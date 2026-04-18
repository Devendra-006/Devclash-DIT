from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import audit, report
from dotenv import load_dotenv
import uvicorn

load_dotenv()

app = FastAPI(
    title="DevCareer API",
    description="Developer Career Intelligence System — Backend Pipeline & AI Layer",
    version="1.0.0",
)

# CORS — allow frontend integration (PRD Part 2)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audit.router, prefix="/audit", tags=["audit"])
app.include_router(report.router, prefix="/report", tags=["report"])


@app.get("/")
def root():
    return {"service": "DevCareer API", "version": "1.0.0", "status": "running"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
