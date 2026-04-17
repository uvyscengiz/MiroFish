from app import create_app


def test_openapi_endpoint_exposes_foundational_contract():
    app = create_app()
    client = app.test_client()

    response = client.get("/openapi.json")

    assert response.status_code == 200
    payload = response.get_json()

    assert payload["openapi"] == "3.1.0"
    assert "/health" in payload["paths"]
    assert "/api/graph/project/{project_id}" in payload["paths"]
    assert "/api/simulation/create" in payload["paths"]
    assert "/api/report/generate" in payload["paths"]

    schemas = payload["components"]["schemas"]
    assert "SuccessEnvelope" in schemas
    assert "ErrorEnvelope" in schemas
    assert "MessageEnvelope" in schemas
    assert "HealthEnvelope" in schemas


def test_openapi_uses_shared_envelopes_and_path_parameters():
    app = create_app()
    client = app.test_client()

    payload = client.get("/openapi.json").get_json()
    graph_get = payload["paths"]["/api/graph/project/{project_id}"]["get"]
    build_graph = payload["paths"]["/api/graph/build"]["post"]
    ontology_generate = payload["paths"]["/api/graph/ontology/generate"]["post"]
    report_download = payload["paths"]["/api/report/{report_id}/download"]["get"]

    assert graph_get["parameters"] == [
        {
            "name": "project_id",
            "in": "path",
            "required": True,
            "schema": {"type": "string"},
        }
    ]
    assert (
        graph_get["responses"]["200"]["content"]["application/json"]["schema"]["$ref"]
        == "#/components/schemas/ProjectResponse"
    )
    assert (
        build_graph["requestBody"]["content"]["application/json"]["schema"]["$ref"]
        == "#/components/schemas/BuildGraphRequest"
    )
    assert (
        ontology_generate["requestBody"]["content"]["multipart/form-data"]["schema"]["$ref"]
        == "#/components/schemas/GenerateOntologyForm"
    )
    assert (
        report_download["responses"]["200"]["content"]["application/octet-stream"][
            "schema"
        ]["format"]
        == "binary"
    )


def test_openapi_graph_routes_include_query_and_response_details():
    app = create_app()
    client = app.test_client()

    payload = client.get("/openapi.json").get_json()
    list_projects = payload["paths"]["/api/graph/project/list"]["get"]
    list_tasks = payload["paths"]["/api/graph/tasks"]["get"]

    assert list_projects["parameters"][0] == {
        "name": "limit",
        "in": "query",
        "required": False,
        "schema": {"type": "integer", "default": 50, "minimum": 1},
        "description": "Maximum number of projects to return.",
    }
    assert (
        list_projects["responses"]["200"]["content"]["application/json"]["schema"]["$ref"]
        == "#/components/schemas/ProjectListResponse"
    )
    assert (
        list_tasks["responses"]["200"]["content"]["application/json"]["schema"]["$ref"]
        == "#/components/schemas/TaskListResponse"
    )


def test_openapi_simulation_and_report_routes_include_typed_contracts():
    app = create_app()
    client = app.test_client()

    payload = client.get("/openapi.json").get_json()
    simulation_create = payload["paths"]["/api/simulation/create"]["post"]
    simulation_list = payload["paths"]["/api/simulation/list"]["get"]
    run_status = payload["paths"]["/api/simulation/{simulation_id}/run-status"]["get"]
    report_generate = payload["paths"]["/api/report/generate"]["post"]
    report_status = payload["paths"]["/api/report/generate/status"]["post"]
    report_list = payload["paths"]["/api/report/list"]["get"]

    assert (
        simulation_create["requestBody"]["content"]["application/json"]["schema"]["$ref"]
        == "#/components/schemas/CreateSimulationRequest"
    )
    assert (
        simulation_create["responses"]["200"]["content"]["application/json"]["schema"]["$ref"]
        == "#/components/schemas/SimulationResponse"
    )
    assert simulation_list["parameters"][0] == {
        "name": "project_id",
        "in": "query",
        "required": False,
        "schema": {"type": "string"},
        "description": "Optional project id to filter simulations.",
    }
    assert (
        run_status["responses"]["200"]["content"]["application/json"]["schema"]["$ref"]
        == "#/components/schemas/SimulationRunStatusResponse"
    )
    assert (
        report_generate["requestBody"]["content"]["application/json"]["schema"]["$ref"]
        == "#/components/schemas/GenerateReportRequest"
    )
    assert (
        report_status["requestBody"]["content"]["application/json"]["schema"]["$ref"]
        == "#/components/schemas/GenerateReportStatusRequest"
    )
    assert (
        report_list["responses"]["200"]["content"]["application/json"]["schema"]["$ref"]
        == "#/components/schemas/ReportListResponse"
    )


def test_openapi_precision_gaps_are_covered_by_typed_models():
    app = create_app()
    client = app.test_client()

    payload = client.get("/openapi.json").get_json()
    prepare_status = payload["paths"]["/api/simulation/prepare/status"]["post"]
    openapi_route = payload["paths"]["/openapi.json"]["get"]
    prepare_request_schema = payload["components"]["schemas"][
        "SimulationPrepareStatusRequest"
    ]

    assert (
        prepare_status["requestBody"]["content"]["application/json"]["schema"]["$ref"]
        == "#/components/schemas/SimulationPrepareStatusRequest"
    )
    assert "task_id" in prepare_request_schema["properties"]
    assert "simulation_id" in prepare_request_schema["properties"]
    assert prepare_request_schema.get("additionalProperties") is not True
    assert (
        openapi_route["responses"]["200"]["content"]["application/json"]["schema"]["$ref"]
        == "#/components/schemas/OpenAPIDocument"
    )
