"""
app/main.py — ELVON: Hybrid Quantum Machine Learning Platform for Early Disease Detection
Problem Statement ID: 26139 (Smart India Hackathon)
Integrated Hospital AI Ecosystem with QML Research, AutoML Pipeline,
Doctor Portal, and Hospital Command Center.
"""
# Updated: 2026-09-20 (Phase 5 complete)
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles as _SF

import config
from app.auth_router import router as auth_router
from app.automl_router import router as automl_router
from app.hospital_router import router as hospital_router
from app.patient_router import router as patient_router
from app.qml_router import router as qml_router
from core.database import init_db

# ─── Application Bootstrap ────────────────────────────────────────────────────
app = FastAPI(
    title="ELVON — Hybrid Quantum ML Platform",
    description=(
        "Integrated Hospital AI Ecosystem:\n"
        "- **Quantum Lab**: QSVM, VQC, QNN vs Classical ML on biomedical datasets\n"
        "- **Doctor Portal**: Patient alerts, AI reports, lab integrations\n"
        "- **Hospital Command Center**: Model management, AutoML, integrations\n"
        "- **AutoML Pipeline**: 10-step hospital self-service model creation\n"
        "- **Model Marketplace**: Pre-trained licensed disease detection models\n"
        "- Biomedical Data Pipeline (70/15/15 leakage-safe split)\n"
        "- Explainable AI: Perturbation sensitivity + PCA attribution\n"
        "- Hardware Readiness Scoring for NISQ devices\n"
    ),
    version="2.1.0",
    docs_url="/docs" if config.APP_ENV != "production" else None,
    redoc_url="/redoc" if config.APP_ENV != "production" else None,
)

# CORS — resilient localhost, Vercel, Netlify, and configured origin connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_origin_regex=r"^https?://([a-zA-Z0-9\-_.]+\.)?(vercel\.app|netlify\.app|localhost|127\.0\.0\.1|hf\.space)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Initialize database on startup ──────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    init_db()

# ─── Mount All Routers ────────────────────────────────────────────────────────
app.include_router(auth_router)       # /api/auth/*
app.include_router(patient_router)    # /api/patients/*, /api/alerts, /api/lab/*, /api/reports, /api/ai/stats
app.include_router(hospital_router)   # /api/hospital/*
app.include_router(automl_router)     # /api/automl/*
app.include_router(qml_router)        # /api/qml/*

# ─── Health check ─────────────────────────────────────────────────────────────
@app.get("/api", include_in_schema=False)
@app.get("/api/", include_in_schema=False)
@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "platform": "ELVON — Hybrid QML Platform for Early Disease Detection",
        "problem_statement_id": "26139",
        "version": "2.1.0",
        "modules": {
            "auth": "/api/auth — Registration, Login, OTP, JWT",
            "patients": "/api/patients — Patient CRUD, Alerts, Reports",
            "lab": "/api/lab — Laboratory & Imaging Systems",
            "hospital": "/api/hospital — Model Management, Feedback, Integrations",
            "automl": "/api/automl — 10-Step AutoML Pipeline",
            "qml": "/api/qml — Quantum ML Benchmarking Lab",
        }
    }

# ─── Serve built Next.js frontend or redirect to dev server ─────────────────
_frontend_dir = Path(__file__).resolve().parent.parent / "frontend"
if (_frontend_dir / "out").exists():
    app.mount("/", _SF(directory=str(_frontend_dir / "out"), html=True), name="frontend")
else:
    @app.get("/", include_in_schema=False)
    async def root_redirect():
        return RedirectResponse(url="http://localhost:3000/")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def catchall_redirect(full_path: str):
        if full_path.startswith(("api", "docs", "redoc")) or full_path == "openapi.json":
            raise HTTPException(status_code=404, detail="Not Found")
        return RedirectResponse(url=f"http://localhost:3000/{full_path}")
