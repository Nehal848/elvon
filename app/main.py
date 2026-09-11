# -*- coding: utf-8 -*-
"""
app/main.py — Hybrid Quantum Machine Learning Platform for Early Disease Detection
Problem Statement ID: 26139 (Smart India Hackathon)
All hospital-specific routes have been removed. This file exposes ONLY the
QML research platform API as specified in SIH_139_QML.pdf.
"""
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles as _SF

from core.database import init_db
from app.qml_router import router as qml_router

# ─── Application Bootstrap ────────────────────────────────────────────────────
app = FastAPI(
    title="Hybrid Quantum Machine Learning Platform for Early Disease Detection",
    description=(
        "SIH Problem Statement ID: 26139\n\n"
        "Implements a complete end-to-end Hybrid QML pipeline:\n"
        "- Biomedical Data Pipeline (70/15/15 leakage-safe split)\n"
        "- Domain-aware clinical feature engineering\n"
        "- PCA dimensionality reduction to 4-12 quantum-compatible qubits\n"
        "- Classical Baselines: LR, SVM, RF, XGBoost/GB, MLP\n"
        "- Hybrid QML: Quantum Kernel (QSVM), VQC, QNN\n"
        "- Dual Simulation: Ideal Statevector + Noisy NISQ\n"
        "- Explainable AI: Perturbation sensitivity (Delta-Z) + PCA attribution\n"
        "- Hardware Readiness Scoring\n"
        "- Automated Noise Impact Analysis\n"
        "- Qubit Dimension Sweep (Accuracy vs Qubit Count)\n"
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — allow the Next.js frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Initialize database on startup ──────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    init_db()

# ─── Mount QML router ─────────────────────────────────────────────────────────
# All endpoints at /api/qml/*
app.include_router(qml_router)

# ─── Health check ─────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "platform": "Hybrid QML Platform for Early Disease Detection",
        "problem_statement_id": "26139",
        "version": "2.0.0",
        "endpoints": [
            "GET  /api/qml/datasets               — List benchmark datasets",
            "POST /api/qml/datasets/upload         — Upload custom CSV",
            "POST /api/qml/datasets/profile        — Data quality audit report",
            "POST /api/qml/experiment/run          — Run Classical + QML benchmark",
            "GET  /api/qml/experiment/{id}         — Retrieve experiment results",
            "GET  /api/qml/experiments/history     — Experiment history",
            "POST /api/qml/predict                 — Real-time single-sample prediction",
            "POST /api/qml/explain                 — Quantum perturbation XAI",
            "GET  /api/qml/hardware/status         — Simulator & hardware status",
            "POST /api/qml/benchmark/noise-impact  — Ideal vs Noisy delta analysis",
            "POST /api/qml/benchmark/dimension-sweep — Accuracy vs Qubit Count sweep",
        ]
    }

# ─── Serve built Next.js frontend (optional) ─────────────────────────────────
_frontend_dir = Path(__file__).resolve().parent.parent / "frontend"
if (_frontend_dir / "out").exists():
    app.mount("/", _SF(directory=str(_frontend_dir / "out"), html=True), name="frontend")
