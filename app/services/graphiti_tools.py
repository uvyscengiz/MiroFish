"""
Graphiti / Neo4j 检索工具服务
"""

from __future__ import annotations

import math
import re
from typing import Any, Dict, List, Optional

from ..utils.locale import t
from ..utils.logger import get_logger
from ..utils.llm_client import LLMClient
from .graphiti_graph_builder import GraphitiGraphBuilderService
from .hash_embedder import LocalHashEmbedder
from .zep_tools import (
    EdgeInfo,
    NodeInfo,
    SearchResult,
    ZepToolsService,
)

logger = get_logger('mirofish.graphiti_tools')


class GraphitiToolsService(ZepToolsService):
    """复用 ZepToolsService 的报告/采访辅助逻辑，仅替换图谱访问层"""

    def __init__(self, llm_client: Optional[LLMClient] = None):
        self.client = None
        self._llm_client = llm_client
        self.builder = GraphitiGraphBuilderService()
        self._hash_embedder = LocalHashEmbedder()
        self._graph_cache: Dict[str, Dict[str, Any]] = {}
        self._last_graph_id: Optional[str] = None
        logger.info(t("console.zepToolsInitialized"))

    def _tokenize(self, text: str) -> List[str]:
        return [token for token in re.findall(r'\w+', (text or '').lower()) if token]

    def _cosine(self, a: List[float], b: List[float]) -> float:
        if not a or not b:
            return 0.0
        dot = sum(x * y for x, y in zip(a, b))
        norm_a = math.sqrt(sum(x * x for x in a))
        norm_b = math.sqrt(sum(y * y for y in b))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)

    def _text_score(self, query: str, text: str) -> float:
        query_tokens = set(self._tokenize(query))
        text_tokens = set(self._tokenize(text))
        if not query_tokens or not text_tokens:
            return 0.0
        overlap = len(query_tokens & text_tokens) / len(query_tokens)
        query_vec = self._hash_embedder._embed_text(query)
        text_vec = self._hash_embedder._embed_text(text)
        return overlap * 0.7 + max(self._cosine(query_vec, text_vec), 0.0) * 0.3

    def _load_graph_data(self, graph_id: str) -> Dict[str, Any]:
        data = self.builder.get_graph_data(graph_id)
        self._graph_cache[graph_id] = data
        self._last_graph_id = graph_id
        return data

    def search_graph(
        self,
        graph_id: str,
        query: str,
        limit: int = 10,
        scope: str = "edges",
    ) -> SearchResult:
        data = self._load_graph_data(graph_id)
        facts: List[str] = []
        edges_result: List[Dict[str, Any]] = []
        nodes_result: List[Dict[str, Any]] = []

        if scope in ["edges", "both"]:
            scored_edges = []
            for edge in data.get("edges", []):
                text = f"{edge.get('name', '')} {edge.get('fact', '')} {edge.get('source_node_name', '')} {edge.get('target_node_name', '')}"
                score = self._text_score(query, text)
                if score > 0:
                    scored_edges.append((score, edge))
            scored_edges.sort(key=lambda item: item[0], reverse=True)
            for _, edge in scored_edges[:limit]:
                if edge.get("fact"):
                    facts.append(edge["fact"])
                edges_result.append(edge)

        if scope in ["nodes", "both"]:
            scored_nodes = []
            for node in data.get("nodes", []):
                text = f"{node.get('name', '')} {node.get('summary', '')} {' '.join(node.get('labels', []))}"
                score = self._text_score(query, text)
                if score > 0:
                    scored_nodes.append((score, node))
            scored_nodes.sort(key=lambda item: item[0], reverse=True)
            for _, node in scored_nodes[:limit]:
                nodes_result.append(node)
                if node.get("summary"):
                    facts.append(f"[{node.get('name', '')}]: {node['summary']}")

        if not facts and data.get("edges"):
            # 明确的稀疏回退：返回少量边事实，保证报告流程不断裂
            fallback_edges = data["edges"][: min(limit, 3)]
            facts.extend(edge.get("fact", "") for edge in fallback_edges if edge.get("fact"))
            edges_result.extend(fallback_edges)

        return SearchResult(
            facts=facts,
            edges=edges_result,
            nodes=nodes_result,
            query=query,
            total_count=len(facts),
        )

    def get_all_nodes(self, graph_id: str) -> List[NodeInfo]:
        data = self._load_graph_data(graph_id)
        return [
            NodeInfo(
                uuid=node.get("uuid", ""),
                name=node.get("name", ""),
                labels=node.get("labels", []),
                summary=node.get("summary", ""),
                attributes=node.get("attributes", {}),
            )
            for node in data.get("nodes", [])
        ]

    def get_all_edges(self, graph_id: str, include_temporal: bool = True) -> List[EdgeInfo]:
        data = self._load_graph_data(graph_id)
        return [
            EdgeInfo(
                uuid=edge.get("uuid", ""),
                name=edge.get("name", ""),
                fact=edge.get("fact", ""),
                source_node_uuid=edge.get("source_node_uuid", ""),
                target_node_uuid=edge.get("target_node_uuid", ""),
                source_node_name=edge.get("source_node_name"),
                target_node_name=edge.get("target_node_name"),
                created_at=edge.get("created_at"),
                valid_at=edge.get("valid_at") if include_temporal else None,
                invalid_at=edge.get("invalid_at") if include_temporal else None,
                expired_at=edge.get("expired_at") if include_temporal else None,
            )
            for edge in data.get("edges", [])
        ]

    def get_node_detail(self, node_uuid: str) -> Optional[NodeInfo]:
        candidate_graph_ids: List[str] = []
        if self._last_graph_id:
            candidate_graph_ids.append(self._last_graph_id)

        candidate_graph_ids.extend(
            graph_id for graph_id in self._graph_cache.keys()
            if graph_id != self._last_graph_id
        )

        for graph_id in candidate_graph_ids:
            data = self._graph_cache.get(graph_id)
            if data is None:
                data = self._load_graph_data(graph_id)

            for node in data.get("nodes", []):
                if node.get("uuid") != node_uuid:
                    continue

                return NodeInfo(
                    uuid=node.get("uuid", ""),
                    name=node.get("name", ""),
                    labels=node.get("labels", []),
                    summary=node.get("summary", ""),
                    attributes=node.get("attributes", {}),
                )

        return None

    def get_node_edges(self, graph_id: str, node_uuid: str) -> List[EdgeInfo]:
        edges = self.get_all_edges(graph_id)
        return [
            edge
            for edge in edges
            if edge.source_node_uuid == node_uuid or edge.target_node_uuid == node_uuid
        ]

    def get_entities_by_type(self, graph_id: str, entity_type: str) -> List[NodeInfo]:
        return [
            node
            for node in self.get_all_nodes(graph_id)
            if entity_type in node.labels
        ]

    def close(self):
        self.builder.close()
