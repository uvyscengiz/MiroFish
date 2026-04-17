"""Reusable OpenAPI component schemas."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


class OpenAPIModel(BaseModel):
    """Base model for OpenAPI component generation."""

    model_config = ConfigDict(extra="forbid")


class SuccessEnvelope(OpenAPIModel):
    """Generic success response envelope used across the API."""

    success: Literal[True] = True
    data: Any | None = Field(
        default=None,
        description="Operation-specific response payload.",
    )
    message: str | None = Field(
        default=None,
        description="Optional human-readable success message.",
    )


class MessageEnvelope(OpenAPIModel):
    """Success envelope variant for message-only responses."""

    success: Literal[True] = True
    message: str = Field(description="Human-readable success message.")
    data: Any | None = Field(
        default=None,
        description="Optional supplemental payload.",
    )


class ErrorEnvelope(OpenAPIModel):
    """Error response envelope used by the existing handlers."""

    success: Literal[False] = False
    error: str = Field(description="Primary error detail.")
    message: str | None = Field(
        default=None,
        description="Optional human-readable error message.",
    )
    traceback: str | None = Field(
        default=None,
        description="Optional traceback returned by existing 500 handlers.",
    )


class HealthEnvelope(OpenAPIModel):
    """Health response shape exposed at /health."""

    status: str = Field(description="Service status value.")
    service: str = Field(description="Service display name.")


class OpenAPIDocument(OpenAPIModel):
    """Top-level machine-readable contract exposed at /openapi.json."""

    openapi: str = Field(description="OpenAPI document version.")
    info: dict[str, Any] = Field(description="Service metadata for the contract.")
    servers: list[dict[str, Any]] = Field(
        default_factory=list,
        description="Declared server entries for the contract.",
    )
    paths: dict[str, Any] = Field(
        default_factory=dict,
        description="Path and operation map for the live API.",
    )
    components: dict[str, Any] = Field(
        default_factory=dict,
        description="Reusable schema and component registry.",
    )
