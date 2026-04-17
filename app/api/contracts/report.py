"""Typed request and response contracts for report API routes."""

from __future__ import annotations

from typing import Literal

from pydantic import Field

from .graph import GraphContractModel, TaskPayload


class ReportSectionPayload(GraphContractModel):
    title: str
    content: str = ""


class ReportOutlinePayload(GraphContractModel):
    title: str
    summary: str
    sections: list[ReportSectionPayload] = Field(default_factory=list)


class ReportPayload(GraphContractModel):
    report_id: str
    simulation_id: str
    graph_id: str
    simulation_requirement: str
    status: str
    outline: ReportOutlinePayload | None = None
    markdown_content: str = ""
    created_at: str = ""
    completed_at: str = ""
    error: str | None = None


class GenerateReportRequest(GraphContractModel):
    simulation_id: str = Field(min_length=1)
    force_regenerate: bool = False


class GenerateReportStatusRequest(GraphContractModel):
    task_id: str | None = None
    simulation_id: str | None = None


class ListReportsQuery(GraphContractModel):
    simulation_id: str | None = None
    limit: int = Field(default=50, ge=1)


class GenerateReportResult(GraphContractModel):
    simulation_id: str
    report_id: str
    task_id: str | None = None
    status: str
    message: str
    already_generated: bool | None = None


class GenerateReportResponse(GraphContractModel):
    success: Literal[True] = True
    data: GenerateReportResult


class ReportResponse(GraphContractModel):
    success: Literal[True] = True
    data: ReportPayload


class ReportBySimulationResponse(GraphContractModel):
    success: Literal[True] = True
    data: ReportPayload
    has_report: bool = True


class ReportListResponse(GraphContractModel):
    success: Literal[True] = True
    data: list[ReportPayload]
    count: int


class ReportTaskStatusResponse(GraphContractModel):
    success: Literal[True] = True
    data: TaskPayload
