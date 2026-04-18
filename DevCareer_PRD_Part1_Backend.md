# DevCareer
## Developer Career Intelligence System
### PRD — Part 1 of 2: Backend Pipeline & AI Layer
> DevClash 2026 | April 18–19, 2026 | 24 Hours

---

| Field | Value |
|---|---|
| Version | 1.0 — Hackathon Build |
| PRD Scope | Backend: Ingestion → Analysis → AI Layer → API endpoints |
| Companion PRD | PRD Part 2: Frontend, Market Intel & Career Report UI |
| Hackathon | DevClash 2026 — April 18–19, 2026 |
| AI Stack | Claude Sonnet 4 (claude-sonnet-4-20250514) via Anthropic API |
| Merge Point | FastAPI /audit and /report/{id} endpoints + Pydantic schemas |

---

## 1. Problem Statement

Developers consistently misjudge their own skill level. Resumes are written from self-perception rather than demonstrated ability, portfolios are curated to hide weaknesses, and career advice remains generic to the point of uselessness.

There is currently no tool that:

- Audits what a developer has actually built from their real code
- Compares it honestly against the job market with traceable evidence
- Tells them exactly what stands between them and the next level
- Maps the architecture of their repos so judges and employers understand the project fast

DevCareer solves all four. The PS3 architecture navigation layer is embedded as a feature — not a separate product — giving our PS5 submission greater depth than any competitor.

---

## 2. Product Overview (Shared Context)

### 2.1 One-Line Pitch

Input a GitHub username → receive a brutally honest 360-degree audit of your demonstrated skill level, architecture quality, career gaps, job market fit, and a 90-day roadmap to the next bracket — all traced to actual lines of code.

### 2.2 Core Differentiator

- Actual code quality audit with file + line-level evidence
- Architecture graph (PS3 layer) showing structural quality visually
- Career verdict with market benchmarking and salary gap analysis
- Actionable resume rewrite based on what code actually shows

### 2.3 Target User

Mid-level developers (1–4 years) preparing for job applications, promotion conversations, or seeking honest feedback on where they stand versus market expectations.

---

## 3. Backend System Architecture

### 3.1 End-to-End Data Flow — Backend Layers (Layers 1–4)

The backend owns Layers 1 through 5 of the six-layer pipeline. Layer 6 (Output rendering) is handled by PRD Part 2.

| Layer | Component | What It Does | Tech Stack |
|---|---|---|---|
| 1 | User Input Handler | Receives GitHub username / repo URL from frontend via FastAPI endpoint | FastAPI |
| 2 | Ingestion | GitHub API collector fetches all repos, commits, activity. Repo cloner walks file tree, detects languages, entry points. | PyGitHub, GitPython, tree-sitter |
| 3 | Analysis (parallel) | Static analysis (complexity, naming, test coverage, docs), Architecture mapper (dependency + call graph), Security scanner (hardcoded secrets, SQL injection, weak auth) | radon, pylint, bandit, semgrep, networkx, pydriller |
| 4 | AI Layer (Claude) | Three separate Claude API calls: Code Review Engine, Architecture Summarizer, Career Verdict Engine. Each receives specific context and returns structured JSON. | claude-sonnet-4-20250514 |
| 5 | Market Intel | Job role matcher cross-references detected skills against live job postings. Salary & percentile engine places dev in tier among peers. | Adzuna API, Reed API, cached salary dataset |

### 3.2 Backend Folder Structure

```
devcareer/
backend/
  main.py               # FastAPI entry point
  routers/
    audit.py            # /audit endpoint — triggers full pipeline
    report.py           # /report/{id} — fetch cached results
  services/
    github_collector.py  # PyGitHub: fetch repos, commits, activity
    repo_parser.py       # GitPython + tree-sitter: clone & parse
    static_analyzer.py   # radon + pylint: complexity, naming, docs
    arch_mapper.py       # networkx: dependency + call graph (PS3)
    security_scanner.py  # bandit + semgrep: secrets, injection risks
    claude_engine.py     # All 3 Claude API calls
    market_intel.py      # Adzuna / Reed API + salary dataset
  models/
    audit_schema.py      # Pydantic schemas for all pipeline outputs
  cache/
    redis_client.py      # Cache audit results by username
```

---

## 4. Backend Feature Requirements

### 4.1 Core — Must Ship

| Feature | Tier | Description | Tech |
|---|---|---|---|
| GitHub Profile Ingestion | CORE | Accepts GitHub username or URL, fetches all public repos via GitHub API v3 | PyGitHub, REST v3 |
| Repo Cloning & Parsing | CORE | Clones repos locally, detects languages, maps file tree and module structure — feeds both analysis and PS3 graph | GitPython, tree-sitter |
| Activity Snapshot | CORE | Commit frequency, contribution graph, active vs dead repos | GitHub API |
| Static Code Analysis | CORE | Cyclomatic complexity, naming conventions, function length, modularity score per file | radon, pylint |
| Security Anti-pattern Detection | CORE | Hardcoded secrets, SQL injection risks, exposed API keys, weak auth patterns | bandit, semgrep |
| Architecture Graph (PS3) | CORE | Dependency map, call graph, entry points, high-impact files highlighted. Core PS3 feature baked into PS5 audit depth. | networkx, pydriller |
| Test Coverage Estimation | CORE | Detects test files, test frameworks used, rough coverage signal | AST parser |
| Documentation Completeness | CORE | README quality, inline docstrings, API docs presence scored per repo | AST + Claude |
| AI Code Review per Repo | CORE | Claude reads actual code, flags specific flaws with file + line-level evidence and severity | Claude Sonnet 4 |
| Skill Level Verdict (AI) | CORE | Junior / Mid / Senior verdict with specific evidence — computed by Career Verdict Engine Claude call | Claude Sonnet 4 |
| Gap-to-Next-Level (AI) | CORE | Exact skills blocking promotion, ranked by career ROI with specific fixes — returned in Career Verdict JSON | Claude Sonnet 4 |
| 90-Day Roadmap (AI) | CORE | Personalised plan attacking weakest points in order of career impact — returned in Career Verdict JSON | Claude Sonnet 4 |
| Resume Bullet Rewriter (AI) | CORE | Rewrites resume claims based on what code actually shows — returned in Career Verdict JSON | Claude Sonnet 4 |
| Percentile Ranking | CORE | Where the dev sits among peers with similar experience and stack — computed from salary dataset | Salary dataset |

### 4.2 Essential — Should Ship

| Feature | Tier | Description | Tech |
|---|---|---|---|
| Role Qualification Check | ESSENTIAL | Which roles (Junior / Mid / Senior / Staff) the dev qualifies for right now — appended to Career Verdict JSON | Claude + market data |
| Stack-based Job Matching | ESSENTIAL | Cross-references detected stack against current job postings — returns matching job list JSON | Adzuna API, Reed API |
| Salary Gap Identification | ESSENTIAL | Which specific skills unlock the next salary bracket based on market data | Cached salary dataset |
| Repo Ranking | ESSENTIAL | Scores each repo — which to lead with, which are hurting the profile — returned in Career Verdict JSON | Static analysis + Claude |
| AI File Summaries (PS3) | ESSENTIAL | Plain-English explanation of what each module does, generated per file — from Architecture Summarizer call | Claude Sonnet 4 |
| Onboarding Path (PS3) | ESSENTIAL | Ordered read-list so judges or employers can understand the project fast — from Architecture Summarizer call | networkx + Claude |

### 4.3 Additional — Nice to Have

| Feature | Tier | Description | Tech |
|---|---|---|---|
| Architecture Evolution (PS3) | ADDITIONAL | How repo structure changed over commits — shows growth or regression | pydriller |
| Orphaned Module Detection (PS3) | ADDITIONAL | Flags dead/unused files that add cognitive load without value | networkx |
| Codebase Q&A NLQ (PS3) | ADDITIONAL | Natural language query support — 'Where is auth handled?' → highlighted subgraph answer via Claude | Claude Sonnet 4 |
| Lighthouse Audit (Backend Trigger) | ADDITIONAL | Triggers headless browser run if live URL is provided; returns performance + accessibility JSON to frontend | Playwright + Lighthouse CLI |

---

## 5. AI Prompt Engineering — Claude API

The backend makes three separate Claude Sonnet 4 API calls via `claude_engine.py`. Each prompt is independently tunable. All return strict JSON — no markdown wrapping.

### 5.1 Prompt 1 — Code Review Engine

**Context passed:** raw file content, static analysis metrics (complexity score, naming flags, test coverage signal, doc score) for each file.

**Output:** structured JSON with file-level findings, line citations, severity, and fix recommendations.

#### SYSTEM Prompt

```
You are a senior software engineer conducting a formal code review.
Your job is to review the provided source files and return a structured
JSON audit. You must be specific, evidence-based, and calibrated.

RULES:
- Every finding MUST include: file name, line number(s), severity
  (critical/major/minor), a concrete description of the flaw, and a specific fix.
- Do NOT give generic advice like 'improve naming' without citing exact examples.
- Do NOT give praise unless it is specific and evidence-backed.
- Severity calibration:
  critical = security risk or logic error that would fail code review at any company
  major    = architectural flaw or pattern that signals junior-level thinking
  minor    = style or readability issue that a senior would note in a PR comment
- If test coverage is below 20%, always flag it as major.
- If no README or docstrings exist, flag as major.

OUTPUT FORMAT (strict JSON, no markdown wrapping):
{
  "findings": [
    {
      "file": "src/auth/login.py",
      "lines": [42, 45],
      "severity": "critical",
      "category": "security",
      "finding": "Password comparison uses == instead of hmac.compare_digest,
        making this vulnerable to timing attacks.",
      "fix": "Replace == with hmac.compare_digest(stored_hash, computed_hash).
        See Python docs section 15.2."
    }
  ],
  "repo_score": 62,
  "summary": "2 critical, 4 major, 7 minor issues found across 12 files."
}
```

#### USER Prompt

```
Review the following repository: {repo_name}

Static analysis metrics:
- Cyclomatic complexity avg: {complexity_avg}
- Naming violations: {naming_flags}
- Test file coverage signal: {test_coverage}%
- Documentation score: {doc_score}/100

Files to review (top {n} by impact score):

{file_1_name}:
```
{file_1_content}
```

Return the JSON audit only. No preamble or explanation outside the JSON.
```

---

### 5.2 Prompt 2 — Architecture Summarizer (PS3 Layer)

**Context passed:** the networkx dependency graph serialized as JSON (nodes = files, edges = import/call relationships), entry points detected, high-impact files ranked by in-degree centrality.

**Output:** plain-English per-module summaries, a recommended onboarding path, and answers to any NLQ queries.

#### SYSTEM Prompt

```
You are a senior developer writing onboarding documentation for a codebase.
You have been given a dependency graph of the repository as structured JSON.
Your job is to produce: (1) a plain-English summary for every module node,
(2) a recommended onboarding path for a new developer, and optionally
(3) an answer to a natural language query about the codebase.

RULES:
- Summaries must be 1-2 sentences maximum per module. No jargon.
- The onboarding path must be an ordered list. Start from entry points.
  Each step must explain WHY this file should be read at this point.
- High-impact files (high in-degree centrality) must be flagged as
  'CHANGE RISK: HIGH — affects N modules' in their summary.
- Orphaned nodes (no in-edges, no out-edges) must be flagged as
  'ORPHANED — may be unused, verify before deleting.'
- NLQ answer (if query provided): return a list of node IDs relevant
  to the query, with a one-sentence explanation each.

OUTPUT FORMAT (strict JSON):
{
  "module_summaries": {
    "src/auth/login.py": "Handles user login via JWT. Entry point for all
      authentication flows. CHANGE RISK: HIGH — affects 8 modules.",
    "src/utils/helpers.py": "ORPHANED — utility functions with no callers."
  },
  "onboarding_path": [
    { "order": 1, "file": "README.md", "reason": "Start here for project overview." },
    { "order": 2, "file": "src/main.py", "reason": "Entry point, wires all services." }
  ],
  "nlq_answer": null
}
```

#### USER Prompt

```
Repository: {repo_name}
Dependency graph (JSON): {graph_json}
Entry points detected: {entry_points}
High-impact files (by centrality): {high_impact_files}
Orphaned modules detected: {orphaned_modules}
Natural language query (null if none): {nlq_query}

Return the JSON output only. No markdown, no preamble.
```

---

### 5.3 Prompt 3 — Career Verdict Engine

**Context passed:** aggregated audit JSON across all repos, activity snapshot, and market data. This is the most important prompt — traceable evidence output is the core PS5 differentiator.

#### SYSTEM Prompt

```
You are a brutally honest senior engineering manager conducting a 360-degree
career audit for a developer. Your job is NOT to be encouraging.
Your job is to be accurate, specific, and useful.

You must produce:
1. A skill level verdict (Junior / Mid / Senior) with a confidence score.
2. A gap analysis: exact skills and patterns blocking promotion, ranked by
   career ROI (highest impact first). Each gap must cite specific evidence
   from the audit (file + finding).
3. A 90-day roadmap: specific, ordered actions with estimated weekly effort.
   Each week block must address the highest-ROI gap first.
4. A resume bullet rewrite: for each repo, rewrite the developer's likely
   self-reported claim into an evidence-based bullet a recruiter can verify.
5. Portfolio ranking: rank repos from 'lead with this' to 'hide this',
   with a one-sentence reason for each.

CALIBRATION RULES:
- Junior: < 2 years equivalent demonstrated quality, lacks patterns like
  proper error handling, test writing, modular design.
- Mid: Writes working, readable code. May over-engineer. Tests exist but
  coverage is weak. No clear architectural thinking.
- Senior: Evidence of system design awareness, security-conscious patterns,
  test coverage > 60%, well-documented APIs, clean dependency boundaries.

EVIDENCE RULE: Every verdict claim MUST be traced to a specific finding.
Not: 'your auth is weak.'
Required: 'In ProjectX/src/auth/login.py lines 42-45, you use == for password
comparison instead of hmac.compare_digest — this is a timing attack
vulnerability that a senior engineer would reject immediately in code review.'

OUTPUT FORMAT (strict JSON):
{
  "verdict": "Junior",
  "confidence": 0.82,
  "verdict_evidence": ["Finding 1 with file+line citation", "..."],
  "gap_analysis": [
    {
      "gap": "Secure authentication patterns",
      "career_roi": "high",
      "evidence": "ProjectX/auth/login.py:42-45 — timing attack vulnerability",
      "fix": "Replace == with hmac.compare_digest. Read: OWASP Auth Cheatsheet.",
      "promotion_impact": "Fixing this alone moves you from Junior to Mid on
        auth-heavy roles at any company doing security review."
    }
  ],
  "roadmap_90_days": [
    { "week": "1-2", "focus": "Security patterns", "action": "...", "hours": 6 },
    { "week": "3-4", "focus": "Test coverage", "action": "...", "hours": 8 }
  ],
  "resume_bullets": [
    {
      "repo": "ProjectX",
      "original_claim": "Built a full-stack auth system",
      "rewritten": "Implemented JWT-based authentication for a Node/React app
        with 3 endpoints, session management, and bcrypt hashing
        (timing-attack vulnerability noted — not production-ready)."
    }
  ],
  "portfolio_ranking": [
    { "repo": "ProjectX", "rank": 1, "action": "lead_with", "reason": "..." },
    { "repo": "OldHack", "rank": 3, "action": "hide", "reason": "..." }
  ]
}
```

#### USER Prompt

```
Developer GitHub: {github_username}
Years active on GitHub: {years_active}
Primary languages: {top_languages}

Activity summary:
- Total repos analyzed: {repo_count}
- Average commit frequency: {commit_freq} per month
- Dead repos (no commits > 6 months): {dead_repos}

Code audit findings across all repos:
{aggregated_findings_json}

Market context:
- Detected skill stack: {skill_stack}
- Market percentile estimate: {percentile}
- Roles qualifying for today: {qualifying_roles}
- Skills that unlock next salary bracket: {salary_unlock_skills}

Produce the full career audit JSON. No markdown. No preamble.
Every verdict claim must cite file + line evidence from the audit findings above.
```

---

## 6. API Contract (Integration Interface with PRD Part 2)

This section defines the exact API surface that PRD Part 2 (Frontend) depends on. **Do not change endpoint paths or response schema field names without syncing with the Frontend developer.**

### 6.1 Endpoints

| Method | Path | Description | Response |
|---|---|---|---|
| POST | /audit | Triggers full pipeline for a GitHub username. Returns audit_id. | `{ audit_id: string, status: "processing" }` |
| GET | /report/{audit_id} | Returns cached full audit result once processing is complete. | Full AuditResult JSON (see 6.2) |
| GET | /report/{audit_id}/status | Polling endpoint for frontend progress indicator. | `{ status: "processing" \| "done" \| "error", progress: 0-100 }` |

### 6.2 AuditResult JSON Schema (Top-Level)

```json
{
  "audit_id": "string",
  "github_username": "string",
  "generated_at": "ISO8601 timestamp",
  "activity_snapshot": {
    "repo_count": "int",
    "commit_freq_per_month": "float",
    "dead_repos": "int",
    "top_languages": ["string"],
    "years_active": "int"
  },
  "repo_scores": [
    {
      "repo_name": "string",
      "score": "int (0-100)",
      "findings": [{ "file": "", "lines": [], "severity": "", "category": "", "finding": "", "fix": "" }],
      "arch_graph": { "nodes": [], "edges": [] },
      "module_summaries": { "file": "summary" },
      "onboarding_path": [{ "order": 0, "file": "", "reason": "" }]
    }
  ],
  "career_verdict": {
    "verdict": "Junior | Mid | Senior",
    "confidence": "float",
    "verdict_evidence": ["string"],
    "gap_analysis": [{ "gap": "", "career_roi": "", "evidence": "", "fix": "", "promotion_impact": "" }],
    "roadmap_90_days": [{ "week": "", "focus": "", "action": "", "hours": 0 }],
    "resume_bullets": [{ "repo": "", "original_claim": "", "rewritten": "" }],
    "portfolio_ranking": [{ "repo": "", "rank": 0, "action": "", "reason": "" }]
  },
  "market_intel": {
    "percentile": "int",
    "qualifying_roles": ["string"],
    "job_matches": [{ "title": "", "company": "", "url": "", "match_score": 0 }],
    "salary_unlock_skills": ["string"]
  }
}
```

---

## 7. Environment Setup & API Keys

```env
# .env — required before running
ANTHROPIC_API_KEY=sk-ant-...
GITHUB_TOKEN=ghp_...              # For higher API rate limits
ADZUNA_APP_ID=...                 # Free tier — job matching
ADZUNA_APP_KEY=...
REED_API_KEY=...                  # Free tier — UK job postings

# Optional
REDIS_URL=redis://localhost:6379  # Cache audit results
PLAYWRIGHT_HEADLESS=true          # For UI/UX audit (additional feature)
```

### 7.1 Rate Limit Strategy

- **GitHub API:** authenticated requests give 5,000/hour — sufficient for up to 50 full audits
- **Claude API:** batch file analysis into chunks of 3–5 files per call to stay under 200K token context window
- **Adzuna API:** free tier gives 100 calls/day — cache job match results per skill stack hash
- **Redis cache:** store full audit result for 1 hour by `github_username` to avoid re-processing during demo

---

## 8. Build Order — Backend Phases

| Window | Phase | What to Build | Done When |
|---|---|---|---|
| 10AM – 1PM | Ingestion | GitHub API collector + repo cloner + parser. Pydantic schemas. FastAPI /audit endpoint stub. | Can fetch all repos + file tree for any public GitHub username |
| 1PM – 3PM | Analysis Pipeline | Static analyzer (radon + pylint), Security scanner (bandit), Architecture mapper (networkx graph) | Can produce analysis JSON for a cloned repo |
| 3PM – 5PM | Claude API Calls | All 3 Claude API calls wired up. Code Review Engine + Career Verdict Engine. Prompts tuned for JSON output. | Can produce verdict + evidence JSON from real repo |
| 5PM – 6PM | System Design Review | Prepare architecture diagram for 1st Judging Round. Polish pipeline. Present to judges. | Architecture diagram + working demo of ingestion → analysis |
| 9PM – 12AM | Market Intel | Adzuna/Reed job matching backend. AI file summaries + onboarding path (Architecture Summarizer call). | Job matches + architecture summaries returned in /report/{id} |
| 12AM – 3AM | Polish & Edge Cases | Error handling for private repos, empty repos, rate limits. Ensure /report/{id} is stable. | Pipeline stable on edge cases. PDF export data ready. |

---

## 9. Judging Criteria Alignment

| Criterion | Weight | How the Backend Addresses It |
|---|---|---|
| Functional Correctness | 80% | End-to-end pipeline works on any public GitHub URL. Verdict is specific and traceable. Architecture graph data is correctly computed. Error states for private repos, empty repos, and API rate limits are handled. |
| Completeness | 20% | All CORE backend features ship. PS3 architecture graph elevates completeness. Layered feature list (Core → Essential → Additional) ensures graceful scope management. |

> **Note:** The frontend developer (PRD Part 2) is responsible for rendering correctness. The backend is responsible for data accuracy and API stability.

---

*DevCareer — DevClash 2026 — DevKraft*
