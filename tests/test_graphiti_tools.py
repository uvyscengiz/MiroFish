from app.services.graphiti_tools import GraphitiToolsService
from app.utils.llm_client import LLMClient


class FakeBuilder:
    def __init__(self, graph_data):
        self.graph_data = graph_data

    def get_graph_data(self, graph_id: str):
        return self.graph_data[graph_id]

    def close(self):
        return None


class FakeLLMClient:
    def chat_json(self, *args, **kwargs):
        return {
            "sub_queries": [
                "Which entities are central to campus sustainability?",
                "What relationships connect the topic to people?",
            ]
        }


def test_graphiti_tools_get_node_detail_from_cached_graph():
    service = GraphitiToolsService(llm_client=LLMClient.__new__(LLMClient))
    service.builder = FakeBuilder(
        {
            "graph-1": {
                "nodes": [
                    {
                        "uuid": "node-alice",
                        "name": "Alice",
                        "labels": ["Entity", "Person"],
                        "summary": "Alice supports campus sustainability.",
                        "attributes": {"role": "student"},
                    }
                ],
                "edges": [],
            }
        }
    )

    service._load_graph_data("graph-1")
    node = service.get_node_detail("node-alice")

    assert node is not None
    assert node.uuid == "node-alice"
    assert node.name == "Alice"
    service.close()


def test_graphiti_insight_forge_populates_entity_insights():
    service = GraphitiToolsService(llm_client=FakeLLMClient())
    service.builder = FakeBuilder(
        {
            "graph-1": {
                "nodes": [
                    {
                        "uuid": "node-alice",
                        "name": "Alice",
                        "labels": ["Entity", "Person"],
                        "summary": "Alice supports campus sustainability.",
                        "attributes": {"role": "student"},
                    },
                    {
                        "uuid": "node-topic",
                        "name": "campus sustainability",
                        "labels": ["Entity", "Topic"],
                        "summary": "A campus topic Alice supports.",
                        "attributes": {},
                    },
                ],
                "edges": [
                    {
                        "uuid": "edge-1",
                        "name": "SUPPORTS",
                        "fact": "Alice supports campus sustainability.",
                        "source_node_uuid": "node-alice",
                        "target_node_uuid": "node-topic",
                        "source_node_name": "Alice",
                        "target_node_name": "campus sustainability",
                    }
                ],
            }
        }
    )

    result = service.insight_forge(
        graph_id="graph-1",
        query="campus sustainability",
        simulation_requirement="audit",
    )

    assert result.total_facts >= 1
    assert result.total_relationships >= 1
    assert result.total_entities >= 1
    assert any(entity["name"] == "Alice" for entity in result.entity_insights)
    service.close()
