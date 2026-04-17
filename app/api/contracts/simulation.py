"""Typed request and response contracts for simulation API routes."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import ConfigDict, Field

from .graph import GraphContractModel, TaskPayload


class FlexibleSimulationContractModel(GraphContractModel):
    model_config = ConfigDict(extra="allow")


class SimulationStatePayload(GraphContractModel):
    simulation_id: str
    project_id: str
    graph_id: str
    enable_twitter: bool = True
    enable_reddit: bool = True
    status: str
    entities_count: int = 0
    profiles_count: int = 0
    entity_types: list[str] = Field(default_factory=list)
    config_generated: bool = False
    config_reasoning: str = ""
    current_round: int = 0
    twitter_status: str = "not_started"
    reddit_status: str = "not_started"
    created_at: str
    updated_at: str
    error: str | None = None
    run_instructions: dict[str, Any] | None = None


class SimulationRunStatePayload(FlexibleSimulationContractModel):
    simulation_id: str
    runner_status: str
    current_round: int = 0
    total_rounds: int = 0
    simulated_hours: int = 0
    total_simulation_hours: int = 0
    progress_percent: float | int = 0
    twitter_current_round: int | None = 0
    reddit_current_round: int | None = 0
    twitter_simulated_hours: int | None = 0
    reddit_simulated_hours: int | None = 0
    twitter_running: bool | None = None
    reddit_running: bool | None = None
    twitter_completed: bool | None = None
    reddit_completed: bool | None = None
    twitter_actions_count: int = 0
    reddit_actions_count: int = 0
    total_actions_count: int = 0
    started_at: str | None = None
    updated_at: str | None = None
    completed_at: str | None = None
    error: str | None = None
    process_pid: int | None = None


class CreateSimulationRequest(GraphContractModel):
    project_id: str = Field(min_length=1)
    graph_id: str | None = None
    enable_twitter: bool = True
    enable_reddit: bool = True


class SimulationPrepareStatusRequest(GraphContractModel):
    model_config = ConfigDict(extra="ignore")

    task_id: str | None = None
    simulation_id: str | None = None


class ListSimulationsQuery(GraphContractModel):
    project_id: str | None = None


class SimulationResponse(GraphContractModel):
    success: Literal[True] = True
    data: SimulationStatePayload


class SimulationListResponse(GraphContractModel):
    success: Literal[True] = True
    data: list[SimulationStatePayload]
    count: int


class SimulationRunStatusResponse(GraphContractModel):
    success: Literal[True] = True
    data: SimulationRunStatePayload


class SimulationPrepareStatusResponse(GraphContractModel):
    success: Literal[True] = True
    data: TaskPayload
