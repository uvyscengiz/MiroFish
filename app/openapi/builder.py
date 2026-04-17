"""Build a machine-readable OpenAPI document from the current Flask app."""

from __future__ import annotations

import inspect
import re
from typing import Any

from flask import Flask
from pydantic import BaseModel
from werkzeug.routing import Rule

from .registry import OPERATION_REGISTRY, OperationSpec
from .schemas import (
    ErrorEnvelope,
    HealthEnvelope,
    MessageEnvelope,
    OpenAPIDocument,
    SuccessEnvelope,
)

OPENAPI_VERSION = "3.1.0"
DEFAULT_SERVER_URL = "/"
PATH_PARAM_PATTERN = re.compile(r"<(?:(?P<converter>[^:<>]+):)?(?P<name>[^<>]+)>")
METHOD_DESCRIPTIONS = {
    "DELETE": "Delete",
    "GET": "Retrieve",
    "PATCH": "Update",
    "POST": "Create or trigger",
    "PUT": "Replace",
}
REQUEST_CONTENT_BY_PATH = {
    "/api/graph/ontology/generate": "multipart/form-data",
}


def build_openapi_spec(app: Flask) -> dict[str, Any]:
    """Create an OpenAPI document for the registered Flask routes."""

    components = _build_component_schemas(
        SuccessEnvelope,
        MessageEnvelope,
        ErrorEnvelope,
        HealthEnvelope,
        OpenAPIDocument,
        *list(_registry_models()),
    )
    paths: dict[str, Any] = {}

    for rule in sorted(app.url_map.iter_rules(), key=lambda item: item.rule):
        if rule.endpoint == "static":
            continue

        normalized_path = _normalize_rule_path(rule.rule)
        path_item = paths.setdefault(normalized_path, {})
        for method in _iter_methods(rule):
            path_item[method.lower()] = _build_operation(app, rule, method)

    return {
        "openapi": OPENAPI_VERSION,
        "info": {
            "title": "MiroFish Backend API",
            "version": app.config.get("API_VERSION", "0.1.0"),
            "description": (
                "Machine-readable contract for the existing MiroFish backend-only "
                "Flask service."
            ),
        },
        "servers": [{"url": DEFAULT_SERVER_URL}],
        "paths": paths,
        "components": {"schemas": components},
    }


def _build_operation(app: Flask, rule: Rule, method: str) -> dict[str, Any]:
    view = app.view_functions[rule.endpoint]
    override = OPERATION_REGISTRY.get(rule.endpoint)
    doc = inspect.getdoc(view) or ""
    summary = (
        override.summary
        if override and override.summary
        else _summary_from_docstring(doc)
        or f"{METHOD_DESCRIPTIONS.get(method, method.title())} {rule.endpoint}"
    )
    description = override.description if override and override.description else doc or None
    tags = list(override.tags) if override and override.tags else [_infer_tag(rule.rule)]

    operation: dict[str, Any] = {
        "operationId": _operation_id(rule.endpoint, method),
        "summary": summary,
        "tags": tags,
        "parameters": _parameters(rule, override),
        "responses": _responses(rule.rule, method, override),
    }
    if description:
        operation["description"] = description

    request_body = _request_body(rule.rule, method, override)
    if request_body is not None:
        operation["requestBody"] = request_body

    return operation


def _registry_models() -> set[type[BaseModel]]:
    models: set[type[BaseModel]] = set()
    for spec in OPERATION_REGISTRY.values():
        if spec.request_model is not None:
            models.add(spec.request_model)
        if spec.response_model is not None:
            models.add(spec.response_model)
    return models


def _build_component_schemas(*models: type[BaseModel]) -> dict[str, Any]:
    schemas: dict[str, Any] = {}
    for model in models:
        schema = model.model_json_schema(ref_template="#/components/schemas/{model}")
        definitions = schema.pop("$defs", {})
        for name, definition in definitions.items():
            schemas.setdefault(name, definition)
        schemas[model.__name__] = schema
    return schemas


def _iter_methods(rule: Rule) -> list[str]:
    methods = rule.methods or set()
    return sorted(method for method in methods if method not in {"HEAD", "OPTIONS"})


def _normalize_rule_path(rule: str) -> str:
    return PATH_PARAM_PATTERN.sub(lambda match: "{" + match.group("name") + "}", rule)


def _parameters(rule: Rule, override: OperationSpec | None) -> list[dict[str, Any]]:
    parameters = []
    for match in PATH_PARAM_PATTERN.finditer(rule.rule):
        converter = match.group("converter") or "string"
        parameters.append(
            {
                "name": match.group("name"),
                "in": "path",
                "required": True,
                "schema": _schema_for_converter(converter),
            }
        )

    if override:
        parameters.extend(spec.to_openapi() for spec in override.parameters)
    return parameters


def _schema_for_converter(converter: str) -> dict[str, Any]:
    if converter == "int":
        return {"type": "integer"}
    if converter == "float":
        return {"type": "number"}
    if converter == "uuid":
        return {"type": "string", "format": "uuid"}
    return {"type": "string"}


def _request_body(path: str, method: str, override: OperationSpec | None) -> dict[str, Any] | None:
    if override and override.request_model is not None:
        return {
            "required": True,
            "content": {
                override.request_content_type: {
                    "schema": {"$ref": f"#/components/schemas/{override.request_model.__name__}"}
                }
            },
        }

    return _default_request_body(path, method)


def _default_request_body(path: str, method: str) -> dict[str, Any] | None:
    if method not in {"PATCH", "POST", "PUT"}:
        return None

    content_type = REQUEST_CONTENT_BY_PATH.get(path, "application/json")
    schema = (
        {
            "type": "object",
            "properties": {
                "files": {
                    "type": "array",
                    "items": {"type": "string", "format": "binary"},
                }
            },
        }
        if content_type == "multipart/form-data"
        else {"type": "object", "additionalProperties": True}
    )
    return {
        "required": True,
        "content": {
            content_type: {
                "schema": schema,
            }
        },
    }


def _responses(path: str, method: str, override: OperationSpec | None) -> dict[str, Any]:
    if override and override.response_model is not None:
        responses = {
            override.success_status: {
                "description": override.response_description,
                "content": {
                    "application/json": {
                        "schema": {
                            "$ref": (
                                f"#/components/schemas/{override.response_model.__name__}"
                            )
                        }
                    }
                },
            },
            "500": {
                "description": "Unhandled backend error.",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/ErrorEnvelope"}
                    }
                },
            },
        }
        if method in {"DELETE", "GET", "POST"}:
            responses["404"] = {
                "description": "Referenced resource was not found.",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/ErrorEnvelope"}
                    }
                },
            }
        if method in {"PATCH", "POST", "PUT"}:
            responses["400"] = {
                "description": "Request validation or state error.",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/ErrorEnvelope"}
                    }
                },
            }
        return responses

    return _default_responses(path, method)


def _default_responses(path: str, method: str) -> dict[str, Any]:
    if path == "/health":
        return {
            "200": {
                "description": "Health check response.",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/HealthEnvelope"}
                    }
                },
            }
        }

    if path.endswith("/download"):
        success_content = {
            "application/octet-stream": {
                "schema": {"type": "string", "format": "binary"}
            }
        }
    elif path.endswith("/stream"):
        success_content = {
            "text/event-stream": {"schema": {"type": "string"}}
        }
    else:
        response_schema = (
            "#/components/schemas/MessageEnvelope"
            if method == "DELETE"
            else "#/components/schemas/SuccessEnvelope"
        )
        success_content = {
            "application/json": {"schema": {"$ref": response_schema}}
        }

    responses: dict[str, Any] = {
        "200": {
            "description": "Successful response.",
            "content": success_content,
        },
        "500": {
            "description": "Unhandled backend error.",
            "content": {
                "application/json": {
                    "schema": {"$ref": "#/components/schemas/ErrorEnvelope"}
                }
            },
        },
    }
    if method in {"DELETE", "GET", "POST"}:
        responses["404"] = {
            "description": "Referenced resource was not found.",
            "content": {
                "application/json": {
                    "schema": {"$ref": "#/components/schemas/ErrorEnvelope"}
                }
            },
        }
    if method in {"PATCH", "POST", "PUT"}:
        responses["400"] = {
            "description": "Request validation or state error.",
            "content": {
                "application/json": {
                    "schema": {"$ref": "#/components/schemas/ErrorEnvelope"}
                }
            },
        }
    return responses


def _infer_tag(path: str) -> str:
    if path == "/health":
        return "system"
    parts = [part for part in path.split("/") if part]
    if len(parts) >= 2 and parts[0] == "api":
        return parts[1]
    return parts[0] if parts else "system"


def _summary_from_docstring(doc: str) -> str | None:
    lines = [line.strip() for line in doc.splitlines() if line.strip()]
    return lines[0] if lines else None


def _operation_id(endpoint: str, method: str) -> str:
    endpoint_id = endpoint.replace(".", "_")
    return f"{endpoint_id}_{method.lower()}"
