"""
Graphiti / Neo4j 图谱构建服务

保持现有 GraphBuilderService 的公开方法形状，供 Phase 7 迁移使用。
"""

from __future__ import annotations

import asyncio
import json
import os
import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any, Callable, Dict, List, Optional

from pydantic import BaseModel, Field, create_model

from graphiti_core import Graphiti
from graphiti_core.cross_encoder.openai_reranker_client import OpenAIRerankerClient
from graphiti_core.edges import EntityEdge
from graphiti_core.embedder.openai import OpenAIEmbedder, OpenAIEmbedderConfig
from graphiti_core.llm_client.config import LLMConfig
from graphiti_core.llm_client.openai_generic_client import OpenAIGenericClient
from graphiti_core.nodes import EntityNode, EpisodeType, EpisodicNode

from ..config import Config
from ..utils.llm_client import LLMClient
from ..utils.logger import get_logger
from ..utils.locale import t
from .hash_embedder import FallbackEmbedder, LocalHashEmbedder

logger = get_logger('mirofish.graphiti_graph_builder')


@dataclass
class GraphInfo:
    """图谱信息"""
    graph_id: str
    node_count: int
    edge_count: int
    entity_types: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "graph_id": self.graph_id,
            "node_count": self.node_count,
            "edge_count": self.edge_count,
            "entity_types": self.entity_types,
        }


class GraphitiGraphBuilderService:
    """Graphiti / Neo4j 图谱构建与读取服务"""

    GRAPH_STORAGE_DIR = os.path.join(Config.UPLOAD_FOLDER, 'graphs')
    RESERVED_NODE_FIELDS = set(EntityNode.model_fields.keys())

    def __init__(self):
        self._loop = asyncio.new_event_loop()
        self.embedder = FallbackEmbedder(
            primary=OpenAIEmbedder(
                config=OpenAIEmbedderConfig(
                    api_key=Config.LLM_API_KEY,
                    base_url=Config.LLM_BASE_URL,
                    embedding_model=Config.GRAPHITI_EMBEDDING_MODEL,
                )
            ),
            fallback=LocalHashEmbedder(),
        )
        self.graphiti = Graphiti(
            Config.NEO4J_URI,
            Config.NEO4J_USER,
            Config.NEO4J_PASSWORD,
            llm_client=OpenAIGenericClient(
                config=LLMConfig(
                    api_key=Config.LLM_API_KEY,
                    base_url=Config.LLM_BASE_URL,
                    model=Config.GRAPHITI_LLM_MODEL,
                    small_model=Config.GRAPHITI_SMALL_LLM_MODEL,
                )
            ),
            embedder=self.embedder,
            cross_encoder=OpenAIRerankerClient(
                config=LLMConfig(
                    api_key=Config.LLM_API_KEY,
                    base_url=Config.LLM_BASE_URL,
                    model=Config.GRAPHITI_SMALL_LLM_MODEL,
                    small_model=Config.GRAPHITI_SMALL_LLM_MODEL,
                )
            ),
        )
        self.llm_client = LLMClient(model=Config.GRAPHITI_LLM_MODEL)
        self._entity_types: Dict[str, type[BaseModel]] | None = None
        os.makedirs(self.GRAPH_STORAGE_DIR, exist_ok=True)

    def _run_async(self, coroutine):
        return self._loop.run_until_complete(coroutine)

    def _get_graph_dir(self, graph_id: str) -> str:
        return os.path.join(self.GRAPH_STORAGE_DIR, graph_id)

    def _get_ontology_path(self, graph_id: str) -> str:
        return os.path.join(self._get_graph_dir(graph_id), 'ontology.json')

    def _persist_metadata(self, graph_id: str, payload: Dict[str, Any]):
        graph_dir = self._get_graph_dir(graph_id)
        os.makedirs(graph_dir, exist_ok=True)
        metadata_path = os.path.join(graph_dir, 'metadata.json')
        with open(metadata_path, 'w', encoding='utf-8') as handle:
            json.dump(payload, handle, ensure_ascii=False, indent=2)

    def _load_ontology(self, graph_id: str) -> Optional[Dict[str, Any]]:
        path = self._get_ontology_path(graph_id)
        if not os.path.exists(path):
            return None

        with open(path, 'r', encoding='utf-8') as handle:
            return json.load(handle)

    def _sanitize_attr_name(self, name: str) -> str:
        if name in self.RESERVED_NODE_FIELDS:
            return f'entity_{name}'
        return name

    def _build_entity_types_from_ontology(
        self, ontology: Optional[Dict[str, Any]]
    ) -> Dict[str, type[BaseModel]] | None:
        if not ontology:
            return None

        entity_models: Dict[str, type[BaseModel]] = {}
        for entity_def in ontology.get('entity_types', []):
            entity_name = entity_def.get('name')
            if not entity_name:
                continue

            fields: Dict[str, tuple[Any, Field]] = {}
            for attr_def in entity_def.get('attributes', []):
                raw_name = attr_def.get('name')
                if not raw_name:
                    continue
                attr_name = self._sanitize_attr_name(raw_name)
                fields[attr_name] = (
                    Optional[str],
                    Field(default=None, description=attr_def.get('description', raw_name)),
                )

            entity_models[entity_name] = create_model(entity_name, **fields)

        return entity_models or None

    async def _list_nodes(self, graph_id: str) -> List[EntityNode]:
        nodes: List[EntityNode] = []
        cursor = None
        while True:
            batch = await EntityNode.get_by_group_ids(
                self.graphiti.driver,
                [graph_id],
                limit=500,
                uuid_cursor=cursor,
            )
            if not batch:
                break
            nodes.extend(batch)
            if len(batch) < 500:
                break
            cursor = batch[-1].uuid
        return nodes

    async def _list_edges(self, graph_id: str) -> List[EntityEdge]:
        edges: List[EntityEdge] = []
        cursor = None
        while True:
            try:
                batch = await EntityEdge.get_by_group_ids(
                    self.graphiti.driver,
                    [graph_id],
                    limit=500,
                    uuid_cursor=cursor,
                )
            except Exception:
                break
            if not batch:
                break
            edges.extend(batch)
            if len(batch) < 500:
                break
            cursor = batch[-1].uuid
        return edges

    def create_graph(self, name: str) -> str:
        """创建图谱工作区"""
        graph_id = f"mirofish_{uuid.uuid4().hex[:16]}"
        self._run_async(self.graphiti.build_indices_and_constraints())
        self._persist_metadata(
            graph_id,
            {
                "graph_id": graph_id,
                "name": name,
                "backend": "graphiti",
                "created_at": datetime.utcnow().isoformat(),
            },
        )
        return graph_id

    def set_ontology(self, graph_id: str, ontology: Dict[str, Any]):
        """持久化本体并生成 Graphiti 约束模型"""
        graph_dir = self._get_graph_dir(graph_id)
        os.makedirs(graph_dir, exist_ok=True)
        with open(self._get_ontology_path(graph_id), 'w', encoding='utf-8') as handle:
            json.dump(ontology or {}, handle, ensure_ascii=False, indent=2)
        self._entity_types = self._build_entity_types_from_ontology(ontology)

    def add_text_batches(
        self,
        graph_id: str,
        chunks: List[str],
        batch_size: int = 3,
        progress_callback: Optional[Callable] = None,
    ) -> List[str]:
        """分批添加文本，使用自定义抽取器写入 Graphiti 兼容数据结构"""
        episode_uuids: List[str] = []
        total_chunks = len(chunks)
        if total_chunks == 0:
            return episode_uuids

        ontology = self._load_ontology(graph_id) or {}
        existing_nodes = self._run_async(self._list_nodes(graph_id))
        entity_index = {node.name.strip().lower(): node for node in existing_nodes if node.name}
        base_time = datetime.utcnow()
        for i, chunk in enumerate(chunks):
            batch_num = i // max(batch_size, 1) + 1
            total_batches = (total_chunks + max(batch_size, 1) - 1) // max(batch_size, 1)
            if progress_callback and i % max(batch_size, 1) == 0:
                progress_callback(
                    t('progress.sendingBatch', current=batch_num, total=total_batches, chunks=min(batch_size, total_chunks - i)),
                    i / total_chunks,
                )

            episode = EpisodicNode(
                name=f'{graph_id}_chunk_{i + 1}',
                group_id=graph_id,
                source=EpisodeType.text,
                source_description='MiroFish imported document chunk',
                content=chunk,
                valid_at=base_time + timedelta(seconds=i),
            )
            extracted = self._extract_chunk_graph(chunk, ontology)
            edge_uuids = []

            for entity_payload in extracted.get('entities', []):
                entity_name = (entity_payload.get('name') or '').strip()
                if not entity_name:
                    continue

                entity_key = entity_name.lower()
                entity = entity_index.get(entity_key)
                if entity is None:
                    labels = list(
                        {
                            'Entity',
                            entity_payload.get('type') or 'Entity',
                        }
                    )
                    entity = EntityNode(
                        name=entity_name,
                        group_id=graph_id,
                        labels=labels,
                        summary=entity_payload.get('summary') or '',
                        attributes=entity_payload.get('attributes') or {},
                        created_at=episode.valid_at,
                    )
                    self._run_async(entity.generate_name_embedding(self.embedder))
                else:
                    labels = set(entity.labels or [])
                    labels.add('Entity')
                    if entity_payload.get('type'):
                        labels.add(entity_payload['type'])
                    entity.labels = list(labels)
                    if entity_payload.get('summary') and not entity.summary:
                        entity.summary = entity_payload['summary']
                    entity.attributes.update(entity_payload.get('attributes') or {})

                if entity.name_embedding is None:
                    self._run_async(entity.generate_name_embedding(self.embedder))
                self._run_async(entity.save(self.graphiti.driver))
                entity_index[entity_key] = entity

            for relation_payload in extracted.get('relations', []):
                source_name = (relation_payload.get('source_name') or '').strip().lower()
                target_name = (relation_payload.get('target_name') or '').strip().lower()
                source_node = entity_index.get(source_name)
                target_node = entity_index.get(target_name)
                if source_node is None or target_node is None:
                    continue

                edge = EntityEdge(
                    group_id=graph_id,
                    source_node_uuid=source_node.uuid,
                    target_node_uuid=target_node.uuid,
                    created_at=episode.valid_at,
                    name=relation_payload.get('relation_type') or 'RELATED_TO',
                    fact=relation_payload.get('fact') or f'{source_node.name} -> {target_node.name}',
                    episodes=[episode.uuid],
                )
                self._run_async(edge.generate_embedding(self.embedder))
                self._run_async(edge.save(self.graphiti.driver))
                edge_uuids.append(edge.uuid)

            episode.entity_edges = edge_uuids
            self._run_async(episode.save(self.graphiti.driver))
            episode_uuids.append(episode.uuid)

            if progress_callback:
                progress_callback(
                    t('progress.sendingBatch', current=batch_num, total=total_batches, chunks=min(batch_size, total_chunks - i)),
                    (i + 1) / total_chunks,
                )

        return episode_uuids

    def _extract_chunk_graph(self, chunk: str, ontology: Dict[str, Any]) -> Dict[str, Any]:
        entity_types = ontology.get('entity_types', [])
        edge_types = ontology.get('edge_types', [])
        messages = [
            {
                "role": "system",
                "content": (
                    "You extract graph entities and relationships from text. "
                    "Return strict JSON only. Keep entity types aligned to the provided ontology when possible. "
                    "Do not invent entities not grounded in the text."
                ),
            },
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "task": "Extract entities and relations for a knowledge graph chunk",
                        "ontology": {
                            "entity_types": entity_types,
                            "edge_types": edge_types,
                        },
                        "text": chunk,
                        "output_schema": {
                            "entities": [
                                {
                                    "name": "entity name from text",
                                    "type": "ontology entity type or Person/Organization/Entity",
                                    "summary": "short factual summary",
                                    "attributes": {"key": "value"},
                                }
                            ],
                            "relations": [
                                {
                                    "source_name": "source entity name",
                                    "target_name": "target entity name",
                                    "relation_type": "ontology edge type or RELATED_TO",
                                    "fact": "short factual sentence grounded in the text",
                                }
                            ],
                        },
                    },
                    ensure_ascii=False,
                ),
            },
        ]
        result = self.llm_client.chat_json(messages=messages, temperature=0.1, max_tokens=2000)
        entities = result.get('entities') if isinstance(result.get('entities'), list) else []
        relations = result.get('relations') if isinstance(result.get('relations'), list) else []
        return {"entities": entities, "relations": relations}

    def _wait_for_episodes(
        self,
        episode_uuids: List[str],
        progress_callback: Optional[Callable] = None,
        timeout: int = 600,
    ):
        """Graphiti add_episode 在返回前已完成处理，这里仅保留兼容层"""
        if progress_callback:
            progress_callback(t('progress.processingComplete', completed=len(episode_uuids), total=len(episode_uuids)), 1.0)

    def _get_graph_info(self, graph_id: str) -> GraphInfo:
        nodes = self._run_async(self._list_nodes(graph_id))
        edges = self._run_async(self._list_edges(graph_id))

        entity_types = {
            label
            for node in nodes
            for label in (node.labels or [])
            if label not in ['Entity', 'Node']
        }

        return GraphInfo(
            graph_id=graph_id,
            node_count=len(nodes),
            edge_count=len(edges),
            entity_types=sorted(entity_types),
        )

    def get_graph_data(self, graph_id: str) -> Dict[str, Any]:
        nodes = self._run_async(self._list_nodes(graph_id))
        edges = self._run_async(self._list_edges(graph_id))

        node_map = {node.uuid: node.name or '' for node in nodes}
        nodes_data = [
            {
                "uuid": node.uuid,
                "name": node.name,
                "labels": node.labels or [],
                "summary": node.summary or "",
                "attributes": node.attributes or {},
                "created_at": node.created_at.isoformat() if node.created_at else None,
            }
            for node in nodes
        ]

        edges_data = [
            {
                "uuid": edge.uuid,
                "name": edge.name or "",
                "fact": edge.fact or "",
                "fact_type": edge.name or "",
                "source_node_uuid": edge.source_node_uuid,
                "target_node_uuid": edge.target_node_uuid,
                "source_node_name": node_map.get(edge.source_node_uuid, ""),
                "target_node_name": node_map.get(edge.target_node_uuid, ""),
                "attributes": {},
                "created_at": edge.created_at.isoformat() if edge.created_at else None,
                "valid_at": edge.valid_at.isoformat() if edge.valid_at else None,
                "invalid_at": edge.invalid_at.isoformat() if edge.invalid_at else None,
                "expired_at": edge.expired_at.isoformat() if edge.expired_at else None,
                "episodes": [str(ep) for ep in (edge.episodes or [])],
            }
            for edge in edges
        ]

        return {
            "graph_id": graph_id,
            "nodes": nodes_data,
            "edges": edges_data,
            "node_count": len(nodes_data),
            "edge_count": len(edges_data),
        }

    def delete_graph(self, graph_id: str):
        async def _delete():
            await self.graphiti.driver.execute_query(
                """
                MATCH (n)
                WHERE n.group_id = $group_id
                DETACH DELETE n
                """,
                group_id=graph_id,
                database_=Config.NEO4J_DATABASE,
            )

        self._run_async(_delete())

        graph_dir = self._get_graph_dir(graph_id)
        if os.path.isdir(graph_dir):
            for root, dirs, files in os.walk(graph_dir, topdown=False):
                for file_name in files:
                    os.remove(os.path.join(root, file_name))
                for dir_name in dirs:
                    os.rmdir(os.path.join(root, dir_name))
            os.rmdir(graph_dir)

    def close(self):
        try:
            self._run_async(self.graphiti.close())
        finally:
            if not self._loop.is_closed():
                self._loop.close()
