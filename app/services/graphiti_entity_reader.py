"""
Graphiti / Neo4j 实体读取与过滤服务
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from ..utils.logger import get_logger
from .graphiti_graph_builder import GraphitiGraphBuilderService
from .zep_entity_reader import EntityNode, FilteredEntities

logger = get_logger('mirofish.graphiti_entity_reader')


class GraphitiEntityReader:
    """读取 Phase 7 写入的 Graphiti 兼容图数据，并适配为现有 simulation 数据结构"""

    def __init__(self):
        self.builder = GraphitiGraphBuilderService()

    def _load_graph_data(self, graph_id: str) -> Dict[str, Any]:
        return self.builder.get_graph_data(graph_id)

    def get_all_nodes(self, graph_id: str) -> List[Dict[str, Any]]:
        data = self._load_graph_data(graph_id)
        return data.get('nodes', [])

    def get_all_edges(self, graph_id: str) -> List[Dict[str, Any]]:
        data = self._load_graph_data(graph_id)
        return data.get('edges', [])

    def filter_defined_entities(
        self,
        graph_id: str,
        defined_entity_types: Optional[List[str]] = None,
        enrich_with_edges: bool = True,
    ) -> FilteredEntities:
        logger.info("开始从 Graphiti 图谱 %s 读取实体", graph_id)

        all_nodes = self.get_all_nodes(graph_id)
        all_edges = self.get_all_edges(graph_id) if enrich_with_edges else []
        node_map = {node['uuid']: node for node in all_nodes}

        entities: List[EntityNode] = []
        entity_types_found = set()
        for node in all_nodes:
            labels = node.get('labels', [])
            custom_labels = [label for label in labels if label not in ['Entity', 'Node']]
            if not custom_labels:
                continue

            if defined_entity_types:
                matching = [label for label in custom_labels if label in defined_entity_types]
                if not matching:
                    continue
                entity_type = matching[0]
            else:
                entity_type = custom_labels[0]

            entity_types_found.add(entity_type)
            entity = EntityNode(
                uuid=node['uuid'],
                name=node.get('name', ''),
                labels=labels,
                summary=node.get('summary', ''),
                attributes=node.get('attributes', {}),
            )

            if enrich_with_edges:
                related_edges = []
                related_node_uuids = set()
                for edge in all_edges:
                    if edge['source_node_uuid'] == node['uuid']:
                        related_edges.append(
                            {
                                "direction": "outgoing",
                                "edge_name": edge.get("name", ""),
                                "fact": edge.get("fact", ""),
                                "target_node_uuid": edge.get("target_node_uuid"),
                            }
                        )
                        related_node_uuids.add(edge.get("target_node_uuid"))
                    elif edge['target_node_uuid'] == node['uuid']:
                        related_edges.append(
                            {
                                "direction": "incoming",
                                "edge_name": edge.get("name", ""),
                                "fact": edge.get("fact", ""),
                                "source_node_uuid": edge.get("source_node_uuid"),
                            }
                        )
                        related_node_uuids.add(edge.get("source_node_uuid"))

                entity.related_edges = related_edges
                entity.related_nodes = [
                    {
                        "uuid": related_uuid,
                        "name": node_map[related_uuid].get("name", ""),
                        "labels": node_map[related_uuid].get("labels", []),
                        "summary": node_map[related_uuid].get("summary", ""),
                    }
                    for related_uuid in related_node_uuids
                    if related_uuid in node_map
                ]

            entities.append(entity)

        return FilteredEntities(
            entities=entities,
            entity_types=entity_types_found,
            total_count=len(all_nodes),
            filtered_count=len(entities),
        )

    def get_entity_with_context(self, graph_id: str, entity_uuid: str) -> Optional[EntityNode]:
        entities = self.filter_defined_entities(graph_id=graph_id, enrich_with_edges=True).entities
        for entity in entities:
            if entity.uuid == entity_uuid:
                return entity
        return None

    def get_entities_by_type(
        self,
        graph_id: str,
        entity_type: str,
        enrich_with_edges: bool = True,
    ) -> List[EntityNode]:
        return self.filter_defined_entities(
            graph_id=graph_id,
            defined_entity_types=[entity_type],
            enrich_with_edges=enrich_with_edges,
        ).entities
