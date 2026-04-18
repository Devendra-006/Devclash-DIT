## DevCareer (local run)

### Prereqs
- **Node.js 18+** (for the Vite frontend)
- **Python 3.11+** (for the FastAPI backend)

### Configure secrets
Backend env file: `devcareer/backend/.env`
- **`GITHUB_TOKEN`**: required to avoid GitHub rate limits during audits
- **`LLM_PROVIDER`**: **`openrouter`** (default) or **`ollama`** for local models via [Ollama](https://ollama.com/) OpenAI-compatible API.

**OpenRouter** (default)
- **`OPENROUTER_API_KEY`**: optional; if missing, the app still runs with fallback scoring
- **`OPENROUTER_MODEL`**: defaults to **`openrouter/elephant-alpha`**
- **`OPENROUTER_TIMEOUT`**: HTTP read timeout in seconds (default **240**). Uses **`max_retries=1`** (~**2×** worst-case wall time).
- **`OPENROUTER_IGNORE_SYSTEM_PROXY`**: set to **`1`** if AI calls hang (broken `HTTP_PROXY` / Windows proxy).
- Optional: **`OPENROUTER_HTTP_REFERER`**, **`OPENROUTER_APP_TITLE`**

**Ollama** (`LLM_PROVIDER=ollama`)
- Run **`ollama serve`** and **`ollama pull <model>`** (e.g. `qwen2.5:latest`).
- **`OLLAMA_MODEL`**: e.g. **`llama3.1:latest`** or **`qwen2.5:latest`** (must match `ollama list`).
- **`OLLAMA_BASE_URL`**: default **`http://127.0.0.1:11434`** (app appends **`/v1`**).
- **`OLLAMA_TIMEOUT`**: read timeout in seconds (default **600**; local generation can be slow).
- **`OLLAMA_MAX_TOKENS`**: default **4096** (override with **`LLM_MAX_TOKENS`** for both backends).
- **`OLLAMA_API_KEY`**: dummy value for the SDK (default **`ollama`**).

Shared: **`LLM_IGNORE_SYSTEM_PROXY=1`** applies to both backends (same behavior as OpenRouter-only flag).

### Verify AI (smoke script)
With OpenRouter **or** Ollama configured, run (exercises code review, architecture summarizer, and career verdict):

```powershell
cd ./backend
$env:PYTHONUNBUFFERED = "1"
python scripts/smoke_openrouter.py
```

You should see `OK: keys ...` for each step and `All three AI paths returned parseable JSON.` at the end.

### Start (recommended)
From `devcareer/` run:

```powershell
./start-all.ps1
```

### Start (manual)

Backend:

```powershell
cd ./backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Frontend:

```powershell
cd ./frontend
npm install
npm run dev
```

### URLs
- **Frontend**: `http://localhost:3000/`
- **Backend**: `http://127.0.0.1:8000/`

### Quick UI test
- Run an audit for **`0xarchit`**
- Open repo **`github-profile-analyzer`** → **View full graph →**

