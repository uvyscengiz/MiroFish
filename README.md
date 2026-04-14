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
ZEP_API_KEY=...
```

Useful optional variables:

```env
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL_NAME=gpt-4o-mini
FLASK_HOST=0.0.0.0
FLASK_PORT=5001
FLASK_DEBUG=true
```

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

Compose exposes `5001` and mounts `./uploads` into the container at `/app/uploads`.

## Capability Surface

The restructure preserves the existing backend product surface:

- `/api/graph` for graph generation and project lifecycle
- `/api/simulation` for simulation preparation, execution, and interaction
- `/api/report` for report generation flows
- `/health` for service health checks
