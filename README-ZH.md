# MiroFish Backend-Only API

MiroFish 现在以纯后端 Python API 形式交付。仓库中的 Vue 前端与 Node 编排脚本已移除，仓库根目录本身就是后端服务。

## 目录结构

- `app/` Flask 应用与 API 路由
- `scripts/` 模拟运行脚本
- `run.py` 本地启动入口
- `uploads/` 持久化运行状态与生成产物
- `pyproject.toml` / `uv.lock` Python 依赖管理

## 运行要求

- Python 3.11+
- `uv`
- 根目录 `.env` 文件（基于 `.env.example`）

必需环境变量：

```env
LLM_API_KEY=...
ZEP_API_KEY=...
```

常用可选变量：

```env
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL_NAME=gpt-4o-mini
FLASK_HOST=0.0.0.0
FLASK_PORT=5001
FLASK_DEBUG=true
```

## 本地运行

```bash
cp .env.example .env
uv sync
uv run python run.py
```

默认监听 `http://localhost:5001`。

## Docker

```bash
cp .env.example .env
docker compose up --build
```

Compose 会暴露 `5001` 端口，并将本地 `./uploads` 挂载到容器内 `/app/uploads`。

## 保留能力

本次重构保持现有后端能力不变：

- `/api/graph`：图谱生成与项目生命周期
- `/api/simulation`：模拟准备、执行与交互
- `/api/report`：报告生成流程
- `/health`：服务健康检查
