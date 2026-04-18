"""Typed request and response contracts for graph API routes."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


class GraphContractModel(BaseModel):
    """Strict graph contract base model."""

    model_config = ConfigDict(extra="forbid")


class FlexibleGraphContractModel(BaseModel):
    """Graph contract base model for backend-shaped payloads."""

    model_config = ConfigDict(extra="allow")


class ProjectFileInfo(GraphContractModel):
    filename: str | None = None
    original_filename: str | None = None
    saved_filename: str | None = None
    path: str | None = None
    size: int | None = None


class OntologyPayload(FlexibleGraphContractModel):
    entity_types: list[dict[str, Any]] = Field(default_factory=list)
    edge_types: list[dict[str, Any]] = Field(default_factory=list)


class ProjectPayload(GraphContractModel):
    project_id: str
    name: str
    status: str
    created_at: str
    updated_at: str
    files: list[ProjectFileInfo] = Field(default_factory=list)
    total_text_length: int = 0
    ontology: OntologyPayload | None = None
    analysis_summary: str | None = None
    graph_id: str | None = None
    graph_build_task_id: str | None = None
    simulation_requirement: str | None = None
    chunk_size: int = 500
    chunk_overlap: int = 50
    error: str | None = None


class TaskPayload(GraphContractModel):
    task_id: str
    task_type: str
    status: str
    created_at: str
    updated_at: str
    progress: int = 0
    message: str = ""
    progress_detail: dict[str, Any] = Field(default_factory=dict)
    result: dict[str, Any] | None = None
    error: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    already_prepared: bool = False


class GraphDataPayload(FlexibleGraphContractModel):
    node_count: int | None = None
    edge_count: int | None = None
    nodes: list[dict[str, Any]] = Field(default_factory=list)
    edges: list[dict[str, Any]] = Field(default_factory=list)


class ListProjectsQuery(GraphContractModel):
    limit: int = Field(default=50, ge=1)


class GenerateOntologyForm(GraphContractModel):
    simulation_requirement: str = Field(min_length=1)
    project_name: str = "Unnamed Project"
    additional_context: str = ""


class BuildGraphRequest(GraphContractModel):
    project_id: str = Field(min_length=1)
    graph_name: str | None = None
    chunk_size: int | None = Field(default=None, ge=1)
    chunk_overlap: int | None = Field(default=None, ge=0)
    force: bool = False


class MessageResponse(GraphContractModel):
    success: Literal[True] = True
    message: str


class ProjectResponse(GraphContractModel):
    success: Literal[True] = True
    data: ProjectPayload


class ProjectListResponse(GraphContractModel):
    success: Literal[True] = True
    data: list[ProjectPayload]
    count: int


class ProjectMessageResponse(GraphContractModel):
    success: Literal[True] = True
    message: str
    data: ProjectPayload


class OntologyGenerateResult(GraphContractModel):
    project_id: str
    project_name: str
    ontology: OntologyPayload
    analysis_summary: str
    files: list[ProjectFileInfo] = Field(default_factory=list)
    total_text_length: int


class OntologyGenerateResponse(GraphContractModel):
    success: Literal[True] = True
    data: OntologyGenerateResult


class BuildGraphResult(GraphContractModel):
    project_id: str
    task_id: str
    message: str


class BuildGraphResponse(GraphContractModel):
    success: Literal[True] = True
    data: BuildGraphResult


class TaskResponse(GraphContractModel):
    success: Literal[True] = True
    data: TaskPayload


class TaskListResponse(GraphContractModel):
    success: Literal[True] = True
    data: list[TaskPayload]
    count: int


class GraphDataResponse(GraphContractModel):
    success: Literal[True] = True
    data: GraphDataPayload
