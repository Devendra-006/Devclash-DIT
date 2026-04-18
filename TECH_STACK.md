# Tech Stack — DevCareer (Devclash-DIT 2026)

## Overview
- **App type**: Full-stack web app
- **Folders**:
  - **Frontend**: `devcareer/frontend`
  - **Backend**: `devcareer/backend`

## Frontend
- **Framework/UI**: React (`react`, `react-dom`)
- **Build tool/dev server**: Vite
- **Styling**: Tailwind CSS (via `@tailwindcss/vite`)
- **Routing**: React Router (`react-router-dom`)
- **Data fetching**: Axios
- **Visualization**:
  - **Architecture graph UI**: React Flow (`reactflow`)
  - **Charts**: Recharts
- **Export**:
  - **DOM capture**: `html2canvas`
  - **PDF generation**: `jspdf`
- **Linting**: ESLint (flat config) + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`

## Backend
- **Language**: Python
- **Web framework**: FastAPI
- **ASGI server**: Uvicorn (`uvicorn[standard]`)
- **Data models / validation**: Pydantic
- **HTTP client**: `httpx`
- **Environment/config**: `python-dotenv`

## Analysis / Intelligence Pipeline (Backend services)
- **GitHub integration**:
  - **API client**: PyGithub
  - **Repo operations**: GitPython (clone/inspect repos)
- **Static analysis**:
  - **Complexity metrics**: Radon
- **Architecture mapping**:
  - **Dependency graph**: NetworkX
  - **Parsing**: Python `ast` + JS/TS import regex (best-effort relative import resolution)
- **Security scanning**: Custom rules in `devcareer/backend/services/security_scanner.py`

## AI / LLM
- **SDK**: `openai` (OpenAI-compatible client)
- **Provider / gateway**: OpenRouter (`https://openrouter.ai/api/v1`)
- **Model used**: `anthropic/claude-sonnet-4-20250514` (configured in `devcareer/backend/services/claude_engine.py`)
- **Primary AI tasks**:
  - Code review (structured findings + repo score)
  - Architecture summarization + onboarding path
  - Career verdict + gap analysis + 90-day roadmap

## Caching / State
- **Current implementation**: In-memory cache (mock) in `devcareer/backend/cache/redis_client.py`
- **Intended production option**: Redis (commented/placeholder notes mention `REDIS_URL`)

## External APIs / Keys (from `.env.example`)
- **OpenRouter**: `OPENROUTER_API_KEY`
- **GitHub**: `GITHUB_TOKEN`
- **Job market data**:
  - Adzuna: `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`
  - Reed: `REED_API_KEY`

