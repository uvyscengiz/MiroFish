# MiroFish Backend-Only API

MiroFish now ships as a backend-only Python API. The Vue frontend and Node-based repo orchestration have been removed; the repository root is the Python service.

## Repository Layout

- `app/` Flask app package and API routes
- `scripts/` simulation runner scripts
- `run.py` local entry point
- `uploads/` persisted runtime state and generated artifacts
- `pyproject.toml` / `uv.lock` Python dependency management

## Requirements

- Python 3.11+
- `uv`
- A root `.env` file based on `.env.example`

Required environment variables:

```env
LLM_API_KEY=...
GRAPH_BACKEND=graphiti
NEO4J_URI=bolt://localhost:7687
NEO4J_PASSWORD=...
```

Useful optional variables:

```env
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL_NAME=gpt-4o-mini
FLASK_HOST=0.0.0.0
FLASK_PORT=5001
FLASK_DEBUG=true
```

Graph backend variables:

```env
# Supported graph runtime
GRAPH_BACKEND=graphiti
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=...
NEO4J_DATABASE=neo4j
GRAPHITI_LLM_MODEL=gpt-4.1
GRAPHITI_SMALL_LLM_MODEL=gpt-4.1-mini
GRAPHITI_EMBEDDING_MODEL=text-embedding-3-small
```

`GRAPH_BACKEND=graphiti` is now the supported runtime path. Neo4j stores the graph, Graphiti handles graph operations, and the backend falls back to a deterministic local hash embedder when your OpenAI-compatible endpoint does not expose embeddings.

Search quality is better when a real embeddings model is available, but graph build, inspection, simulation preparation, memory updates, and report search still run without one.

## Local Run

```bash
cp .env.example .env
uv sync
uv run python run.py
```

The API listens on `http://localhost:5001` by default.

## Docker

```bash
cp .env.example .env
docker compose up --build
```

Compose exposes `5001`, starts a Neo4j companion service on `7474` / `7687`, mounts `./uploads` into the container at `/app/uploads`, and defaults the backend container to `bolt://neo4j:7687`.

## Capability Surface

The restructure preserves the existing backend product surface:

- `/api/graph` for graph generation and project lifecycle
- `/api/simulation` for simulation preparation, execution, and interaction
- `/api/report` for report generation flows
- `/health` for service health checks
