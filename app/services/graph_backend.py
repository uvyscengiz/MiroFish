"""图谱后端工厂与基础配置检查。"""

from __future__ import annotations

from typing import Any

from neo4j import GraphDatabase

from ..config import Config


class GraphBackendError(RuntimeError):
    """图谱后端相关错误基类"""


class GraphBackendConfigurationError(GraphBackendError):
    """图谱后端配置错误"""


class GraphBackendCapabilityError(GraphBackendError):
    """当前图谱后端尚未支持该能力"""


def get_graph_backend_name() -> str:
    """返回当前图谱后端名称"""
    return Config.GRAPH_BACKEND


def get_graph_backend_config_errors(capability: str | None = None) -> list[str]:
    """获取图谱后端错误列表"""
    errors = Config.validate_graph_backend()
    return errors


def assert_graph_backend_ready(capability: str | None = None):
    """确保图谱后端已准备好，否则抛出统一异常"""
    errors = get_graph_backend_config_errors(capability=capability)
    if errors:
        raise GraphBackendConfigurationError("; ".join(errors))


def test_neo4j_connection() -> dict[str, Any]:
    """
    验证 Neo4j 基础连通性。

    仅用于 Phase 6 建立运行时基础，不依赖完整 Graphiti 写入能力。
    """
    assert_graph_backend_ready()

    if Config.GRAPH_BACKEND != "graphiti":
        return {"backend": Config.GRAPH_BACKEND, "connected": False}

    driver = GraphDatabase.driver(
        Config.NEO4J_URI,
        auth=(Config.NEO4J_USER, Config.NEO4J_PASSWORD),
    )
    try:
        driver.verify_connectivity()
        return {
            "backend": "graphiti",
            "connected": True,
            "database": Config.NEO4J_DATABASE,
            "uri": Config.NEO4J_URI,
        }
    finally:
        driver.close()


def create_graph_builder():
    """创建图谱构建服务"""
    assert_graph_backend_ready()
    if Config.GRAPH_BACKEND == "graphiti":
        from .graphiti_graph_builder import GraphitiGraphBuilderService

        return GraphitiGraphBuilderService()

    raise GraphBackendCapabilityError("当前图谱后端尚未支持图谱构建")


def create_entity_reader():
    """创建实体读取服务"""
    assert_graph_backend_ready()
    if Config.GRAPH_BACKEND == "graphiti":
        from .graphiti_entity_reader import GraphitiEntityReader

        return GraphitiEntityReader()

    raise GraphBackendCapabilityError("当前图谱后端尚未支持实体读取")


def create_report_tools():
    """创建报告检索工具服务"""
    assert_graph_backend_ready()
    if Config.GRAPH_BACKEND == "graphiti":
        from .graphiti_tools import GraphitiToolsService

        return GraphitiToolsService()

    raise GraphBackendCapabilityError("当前图谱后端尚未支持报告检索工具")
