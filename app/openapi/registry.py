"""Route-level OpenAPI metadata registry."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from pydantic import BaseModel

from app.api.contracts.graph import (
    BuildGraphRequest,
    BuildGraphResponse,
    GenerateOntologyForm,
    GraphDataResponse,
    MessageResponse,
    OntologyGenerateResponse,
    ProjectListResponse,
    ProjectMessageResponse,
    ProjectResponse,
    TaskListResponse,
    TaskResponse,
)
from app.api.contracts.report import (
    GenerateReportRequest,
    GenerateReportResponse,
    GenerateReportStatusRequest,
    ReportBySimulationResponse,
    ReportListResponse,
    ReportResponse,
    ReportTaskStatusResponse,
)
from app.api.contracts.simulation import (
    CreateSimulationRequest,
    SimulationListResponse,
    SimulationPrepareStatusRequest,
    SimulationPrepareStatusResponse,
    SimulationResponse,
    SimulationRunStatusResponse,
)
from app.openapi.schemas import OpenAPIDocument


@dataclass(frozen=True)
class ParameterSpec:
    name: str
    location: str
    required: bool
    schema: dict[str, Any]
    description: str | None = None

    def to_openapi(self) -> dict[str, Any]:
        parameter = {
            "name": self.name,
            "in": self.location,
            "required": self.required,
            "schema": self.schema,
        }
        if self.description:
            parameter["description"] = self.description
        return parameter


@dataclass(frozen=True)
class OperationSpec:
    summary: str | None = None
    description: str | None = None
    tags: tuple[str, ...] = ()
    request_model: type[BaseModel] | None = None
    request_content_type: str = "application/json"
    response_model: type[BaseModel] | None = None
    success_status: str = "200"
    response_description: str = "Successful response."
    parameters: tuple[ParameterSpec, ...] = ()


OPERATION_REGISTRY: dict[str, OperationSpec] = {
    "health": OperationSpec(
        summary="Health check",
        description="Return a lightweight process health payload.",
        tags=("system",),
    ),
    "openapi_spec": OperationSpec(
        summary="Get OpenAPI document",
        description="Return the live machine-readable OpenAPI contract.",
        tags=("system",),
        response_model=OpenAPIDocument,
    ),
    "graph.get_project": OperationSpec(
        summary="Get project detail",
        tags=("graph",),
        response_model=ProjectResponse,
    ),
    "graph.list_projects": OperationSpec(
        summary="List projects",
        tags=("graph",),
        response_model=ProjectListResponse,
        parameters=(
            ParameterSpec(
                name="limit",
                location="query",
                required=False,
                schema={"type": "integer", "default": 50, "minimum": 1},
                description="Maximum number of projects to return.",
            ),
        ),
    ),
    "graph.delete_project": OperationSpec(
        summary="Delete project",
        tags=("graph",),
        response_model=MessageResponse,
    ),
    "graph.reset_project": OperationSpec(
        summary="Reset project state",
        tags=("graph",),
        response_model=ProjectMessageResponse,
    ),
    "graph.generate_ontology": OperationSpec(
        summary="Generate ontology from uploaded documents",
        tags=("graph",),
        request_model=GenerateOntologyForm,
        request_content_type="multipart/form-data",
        response_model=OntologyGenerateResponse,
    ),
    "graph.build_graph": OperationSpec(
        summary="Start graph build",
        tags=("graph",),
        request_model=BuildGraphRequest,
        response_model=BuildGraphResponse,
    ),
    "graph.get_task": OperationSpec(
        summary="Get graph task status",
        tags=("graph",),
        response_model=TaskResponse,
    ),
    "graph.list_tasks": OperationSpec(
        summary="List graph tasks",
        tags=("graph",),
        response_model=TaskListResponse,
    ),
    "graph.get_graph_data": OperationSpec(
        summary="Get graph data",
        tags=("graph",),
        response_model=GraphDataResponse,
    ),
    "graph.delete_graph": OperationSpec(
        summary="Delete graph",
        tags=("graph",),
        response_model=MessageResponse,
    ),
    "simulation.create_simulation": OperationSpec(
        summary="Create simulation",
        tags=("simulation",),
        request_model=CreateSimulationRequest,
        response_model=SimulationResponse,
    ),
    "simulation.get_simulation": OperationSpec(
        summary="Get simulation state",
        tags=("simulation",),
        response_model=SimulationResponse,
    ),
    "simulation.list_simulations": OperationSpec(
        summary="List simulations",
        tags=("simulation",),
        response_model=SimulationListResponse,
        parameters=(
            ParameterSpec(
                name="project_id",
                location="query",
                required=False,
                schema={"type": "string"},
                description="Optional project id to filter simulations.",
            ),
        ),
    ),
    "simulation.get_prepare_status": OperationSpec(
        summary="Get simulation prepare task status",
        tags=("simulation",),
        request_model=SimulationPrepareStatusRequest,
        response_model=SimulationPrepareStatusResponse,
    ),
    "simulation.get_run_status": OperationSpec(
        summary="Get simulation run status",
        tags=("simulation",),
        response_model=SimulationRunStatusResponse,
    ),
    "report.generate_report": OperationSpec(
        summary="Generate report",
        tags=("report",),
        request_model=GenerateReportRequest,
        response_model=GenerateReportResponse,
    ),
    "report.get_generate_status": OperationSpec(
        summary="Get report generation status",
        tags=("report",),
        request_model=GenerateReportStatusRequest,
        response_model=ReportTaskStatusResponse,
    ),
    "report.get_report": OperationSpec(
        summary="Get report detail",
        tags=("report",),
        response_model=ReportResponse,
    ),
    "report.get_report_by_simulation": OperationSpec(
        summary="Get report by simulation",
        tags=("report",),
        response_model=ReportBySimulationResponse,
    ),
    "report.list_reports": OperationSpec(
        summary="List reports",
        tags=("report",),
        response_model=ReportListResponse,
        parameters=(
            ParameterSpec(
                name="simulation_id",
                location="query",
                required=False,
                schema={"type": "string"},
                description="Optional simulation id to filter reports.",
            ),
            ParameterSpec(
                name="limit",
                location="query",
                required=False,
                schema={"type": "integer", "default": 50, "minimum": 1},
                description="Maximum number of reports to return.",
            ),
        ),
    ),
}
