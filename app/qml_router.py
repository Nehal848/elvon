"""
app/qml_router.py
FastAPI Router for Hybrid Quantum Machine Learning Platform
Problem Statement ID: 26139
Endpoints:
- Datasets management & profiling
- Strict leakage-safe preprocessing
- Classical vs Hybrid QML benchmarking
- Real-time single-sample disease prediction
- Explainable AI (XAI) & perturbation sensitivity
- Quantum resource and hardware readiness monitoring
- Experiment tracking and reproducibility
"""
import io
import time
import uuid
from datetime import datetime, timezone
from typing import Any

import numpy as np
import pandas as pd
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel, ConfigDict

from app.auth_router import require_any_auth, require_hospital
from core.database import QmlExperiment, SessionLocal, deserialize, serialize
from core.quantum.benchmark import QMLBenchmarkingEngine
from core.quantum.pipeline import (
    BiomedicalDataPipeline,
    load_benchmark_dataset,
    profile_biomedical_dataset,
)
from core.quantum.simulator import HardwareReadinessChecker, QuantumHardwareDispatcher
from core.quantum.xai import QuantumExplainabilityEngine

router = APIRouter(prefix="/api/qml", tags=["Quantum Machine Learning"])

# In-memory storage for active experiment objects (pipelines, trained models, XAI)
_ACTIVE_EXPERIMENTS: dict[str, dict[str, Any]] = {}
_CUSTOM_UPLOADS: dict[str, pd.DataFrame] = {}


# ─── Pydantic Schemas ────────────────────────────────────────────────────────
class ProfileRequest(BaseModel):
    dataset_name: str
    target_col: str | None = "target"
    upload_id: str | None = None

class RunExperimentRequest(BaseModel):
    dataset_name: str = "heart_disease"
    target_col: str = "target"
    upload_id: str | None = None
    n_pca_components: int = 6
    n_selected_features: int = 12
    backend_type: str = "ideal"  # "ideal" | "noisy" | "hardware_sim"
    noise_rate: float = 0.015
    shots: int = 1024
    vqc_iterations: int = 25
    seed: int = 42

class PredictRequest(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    experiment_id: str
    model_name: str | None = "Quantum Kernel (QSVM)"
    sample_values: dict[str, Any]
    threshold: float = 0.50

class ExplainRequest(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    experiment_id: str
    model_name: str | None = "Quantum Kernel (QSVM)"
    sample_values: dict[str, Any]


# ─── 1. Datasets Management ──────────────────────────────────────────────────
@router.get("/datasets")
async def list_datasets(
    _user: dict = Depends(require_any_auth),
):
    """
    Returns available biomedical benchmark datasets and custom upload status.
    PDF Section 5 & 29.
    """
    return {
        "benchmark_datasets": [
            {
                "id": "breast_cancer",
                "name": "Wisconsin Diagnostic Breast Cancer (WDBC)",
                "category": "Oncology / Cancer Detection",
                "samples": 569,
                "features": 30,
                "target": "Malignant (1) vs Benign (0)",
                "target_col": "target",
                "description": "High-dimensional cellular morphometric measurements extracted from digitized biopsy images."
            },
            {
                "id": "heart_disease",
                "name": "Cardiovascular Disease Cohort (Cleveland Benchmark)",
                "category": "Cardiovascular Disorders",
                "samples": 303,
                "features": 13,
                "target": "Presence (1) vs Absence (0) of Heart Disease",
                "target_col": "target",
                "description": "Multi-factorial clinical markers including hemodynamics, resting ECG, blood pressure, and vessel status."
            },
            {
                "id": "diabetes",
                "name": "Diabetes Metabolic Screening Benchmark",
                "category": "Metabolic / Chronic Disease",
                "samples": 500,
                "features": 8,
                "target": "Diabetes Risk Positive (1) vs Negative (0)",
                "target_col": "target",
                "description": "Clinical indicators comprising glucose tolerance, adiposity index, insulin, blood pressure, and age."
            },
            {
                "id": "parkinsons",
                "name": "Parkinson's Disease Biomedical Dataset (Oxford / UCI)",
                "category": "Neurological Disorders",
                "samples": 195,
                "features": 22,
                "target": "Parkinson's Positive (1) vs Healthy (0)",
                "target_col": "target",
                "description": "Vocal biomedical measurements: MDVP fundamental frequency, jitter, shimmer, NHR, HNR, RPDE, DFA, spread, and PPE."
            },
            {
                "id": "genomics",
                "name": "High-Dimensional Gene Expression Genomics Benchmark",
                "category": "Genomics / Precision Medicine",
                "samples": 220,
                "features": 200,
                "target": "Cancer Positive (1) vs Healthy (0)",
                "target_col": "target",
                "description": "Log2-normalised microarray gene expression data with 200 gene features — demonstrates extreme 200→8 qubit dimensionality compression pipeline."
            }
        ],
        "custom_uploads_count": len(_CUSTOM_UPLOADS)
    }


@router.post("/datasets/upload")
async def upload_custom_dataset(
    file: UploadFile = File(...),
    _user: dict = Depends(require_hospital),
):
    """
    Uploads a custom biomedical CSV dataset and returns a temporary upload ID.
    PDF Section 8.3.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported for biomedical ingestion.")

    content = b""
    while chunk := await file.read(1024 * 1024):
        content += chunk
        if len(content) > 25 * 1024 * 1024:
            raise HTTPException(
                status_code=413,
                detail="File too large. Maximum size is 25MB.",
            )
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {e!s}")

    if len(df) < 10:
        raise HTTPException(status_code=400, detail="Dataset must contain at least 10 rows for statistical evaluation.")

    upload_id = f"upload_{uuid.uuid4().hex[:8]}"
    _CUSTOM_UPLOADS[upload_id] = df

    # Guess potential target column (e.g. 'target', 'diagnosis', 'disease', or last column)
    target_candidates = [c for c in df.columns if c.lower() in ("target", "diagnosis", "disease", "outcome", "class", "label", "condition")]
    default_target = target_candidates[0] if target_candidates else df.columns[-1]

    return {
        "upload_id": upload_id,
        "filename": file.filename,
        "rows": len(df),
        "columns": list(df.columns),
        "suggested_target": default_target
    }


@router.post("/datasets/profile")
async def profile_dataset(
    req: ProfileRequest,
    _user: dict = Depends(require_hospital),
):
    """
    Generates an automated Data Quality Report and schema audit.
    PDF Section 8.13, 29.7.
    """
    if req.upload_id and req.upload_id in _CUSTOM_UPLOADS:
        df = _CUSTOM_UPLOADS[req.upload_id].copy()
    else:
        df, _ = load_benchmark_dataset(req.dataset_name)

    target_col = req.target_col if (req.target_col in df.columns) else df.columns[-1]
    profile = profile_biomedical_dataset(df, target_col)
    profile["dataset_name"] = req.dataset_name

    # Preview top 5 rows
    preview = df.head(5).to_dict(orient="records")
    profile["preview"] = preview
    return profile


# ─── 2. Run Classical vs Hybrid QML Experiment ──────────────────────────────
@router.post("/experiment/run")
async def run_qml_experiment(
    req: RunExperimentRequest,
    _user: dict = Depends(require_hospital),
):
    """
    Executes the complete end-to-end Classical vs Hybrid Quantum Machine Learning experiment:
    1. Leakage-safe train/val/test split
    2. Clinical feature engineering
    3. Mutual information feature selection
    4. PCA dimensionality reduction to target qubits
    5. Training classical baselines (LR, SVM, RF, XGBoost/GB, MLP)
    6. Training Hybrid QML models (Quantum Kernel QSVM, VQC)
    7. Full benchmark metrics & quantum resource evaluation
    8. Hardware readiness scoring
    PDF Section 16, 20, 25, 36, 47.
    """
    start_total = time.perf_counter()

    # Load dataset
    if req.upload_id and req.upload_id in _CUSTOM_UPLOADS:
        df = _CUSTOM_UPLOADS[req.upload_id].copy()
        dataset_label = f"Custom CSV ({req.upload_id})"
    else:
        df, default_target = load_benchmark_dataset(req.dataset_name)  # noqa: RUF059
        dataset_label = req.dataset_name

    target_col = req.target_col if (req.target_col in df.columns) else "target"
    if target_col not in df.columns:
        target_col = df.columns[-1]

    # Initialize and execute pipeline (strict leakage-free)
    pipeline = BiomedicalDataPipeline(
        target_col=target_col,
        n_pca_components=req.n_pca_components,
        n_selected_features=req.n_selected_features,
        seed=req.seed
    )
    pipeline_output = pipeline.process(df)

    # Execute Benchmarking Engine
    benchmarker = QMLBenchmarkingEngine(seed=req.seed)
    benchmark_results = benchmarker.run_benchmark(
        pipeline_output=pipeline_output,
        backend_type=req.backend_type,
        noise_rate=req.noise_rate,
        shots=req.shots,
        vqc_iterations=req.vqc_iterations
    )

    # Initialize XAI Engine
    xai_engine = QuantumExplainabilityEngine(pipeline_output)

    exp_id = f"EXP-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
    total_time_sec = round(time.perf_counter() - start_total, 3)

    # Package response (strip non-serializable objects)
    trained_objs = benchmark_results.pop("trained_objects")
    response_payload = {
        "experiment_id": exp_id,
        "dataset_name": dataset_label,
        "target_col": target_col,
        "total_runtime_sec": total_time_sec,
        "pipeline_summary": {
            "n_qubits": pipeline_output["n_qubits"],
            "selected_features": pipeline_output["selected_features"],
            "cumulative_variance_pct": pipeline_output["cumulative_variance"],
            "explained_variance_ratio": pipeline_output["explained_variance_ratio"],
            "pca_component_mapping": pipeline_output["pca_component_mapping"],
            "engineered_features": pipeline_output["engineered_features"],
            "leakage_audit": pipeline_output["leakage_audit"]
        },
        "benchmark": {
            "all_models": benchmark_results["all_models"],
            "classical_champion": benchmark_results["classical_champion"],
            "quantum_champion": benchmark_results["quantum_champion"],
            "comparison_deltas": benchmark_results["comparison_deltas"],
            "outcome": benchmark_results["outcome"],
            "conclusion": benchmark_results["conclusion"]
        },
        "hardware_readiness": benchmark_results["hardware_readiness"],
        "vqc_loss_history": benchmark_results["vqc_training_history"],
        "backend_info": {
            "backend_type": req.backend_type,
            "shots": req.shots,
            "noise_rate": req.noise_rate if req.backend_type != "ideal" else 0.0
        }
    }

    # Cache for live predictions & XAI
    _ACTIVE_EXPERIMENTS[exp_id] = {
        "pipeline": pipeline,
        "pipeline_output": pipeline_output,
        "q_kernel": trained_objs["q_kernel"],
        "vqc": trained_objs["vqc"],
        "qnn": trained_objs.get("qnn"),
        "xai_engine": xai_engine,
        "dataset_df": df.copy() if not isinstance(df, str) else None,
        "target_col": target_col,
        "summary": response_payload
    }

    # Persist in database
    db = SessionLocal()
    try:
        exp_db = QmlExperiment(
            id=exp_id,
            dataset_name=dataset_label,
            dataset_version="v1.0",
            target_column=target_col,
            selected_features=serialize(pipeline_output["selected_features"]),
            n_pca_components=req.n_pca_components,
            quantum_backend=req.backend_type,
            qml_model_type="QSVM + VQC + QNN",
            status="COMPLETED",
            benchmark_results=serialize(response_payload["benchmark"]),
            quantum_resources=serialize(benchmark_results["quantum_champion"].get("quantum_resources")),
            leakage_audit=serialize(pipeline_output["leakage_audit"]),
            created_at=datetime.now(timezone.utc).isoformat()
        )
        db.add(exp_db)
        db.commit()
    except Exception:  # noqa: BLE001
        db.rollback()
    finally:
        db.close()

    return response_payload


@router.get("/experiment/{exp_id}")
async def get_experiment_results(
    exp_id: str,
    _user: dict = Depends(require_any_auth),
):
    """
    Retrieves stored experiment results by ID.
    PDF Section 36.14.
    """
    if exp_id in _ACTIVE_EXPERIMENTS:
        return _ACTIVE_EXPERIMENTS[exp_id]["summary"]

    db = SessionLocal()
    try:
        row = db.query(QmlExperiment).filter(QmlExperiment.id == exp_id).first()
        if not row:
            raise HTTPException(status_code=404, detail=f"Experiment '{exp_id}' not found.")
        return {
            "experiment_id": row.id,
            "dataset_name": row.dataset_name,
            "target_col": row.target_column,
            "pipeline_summary": {
                "n_qubits": row.n_pca_components,
                "selected_features": deserialize(row.selected_features, []),
                "leakage_audit": deserialize(row.leakage_audit, {})
            },
            "benchmark": deserialize(row.benchmark_results, {}),
            "quantum_resources": deserialize(row.quantum_resources, {}),
            "created_at": row.created_at
        }
    finally:
        db.close()


# ─── 3. Single-Sample Disease Prediction & Explainability ────────────────────
@router.post("/predict")
async def predict_single_sample(
    req: PredictRequest,
    _user: dict = Depends(require_any_auth),
):
    """
    Executes real-time disease classification on an unseen patient sample.
    PDF Section 17, 36.8, 47.9.
    """
    if req.experiment_id not in _ACTIVE_EXPERIMENTS:
        # If no active run in memory, run a quick baseline experiment on Heart Disease
        raise HTTPException(status_code=404, detail="Experiment session not found or expired. Please run a benchmark experiment first.")

    exp_data = _ACTIVE_EXPERIMENTS[req.experiment_id]
    pipeline: BiomedicalDataPipeline = exp_data["pipeline"]
    q_kernel = exp_data["q_kernel"]
    vqc = exp_data["vqc"]

    t0 = time.perf_counter()
    # Apply strict pipeline transforms to new sample
    try:
        x_classical, x_quantum = pipeline.transform_new_sample(req.sample_values)  # noqa: RUF059
    except Exception as e:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=f"Sample feature mismatch: {e!s}")

    # Model evaluation — route to QSVM, VQC, or QNN
    qnn = exp_data.get("qnn")
    model_name = req.model_name or "Quantum Kernel (QSVM)"
    if "Kernel" in model_name or "QSVM" in model_name:
        proba = float(q_kernel.predict_proba(np.array([x_quantum]))[0, 1])
        model_obj = q_kernel
    elif "QNN" in model_name or "Neural Network" in model_name:
        if qnn is None:
            raise HTTPException(status_code=400, detail="QNN model not available in this experiment session.")
        proba = float(qnn.predict_proba(np.array([x_quantum]))[0, 1])
        model_obj = qnn
    else:
        proba = float(vqc.predict_proba(np.array([x_quantum]))[0, 1])
        model_obj = vqc  # noqa: F841

    latency_ms = round((time.perf_counter() - t0) * 1000.0, 2)
    threshold = req.threshold
    predicted_class = 1 if proba >= threshold else 0
    label = "Positive / Disease Risk Pattern Detected" if predicted_class == 1 else "Negative / No Detected Disease Pattern"

    return {
        "experiment_id": req.experiment_id,
        "model_used": model_name,
        "predicted_class": predicted_class,
        "class_label": label,
        "prediction_score": round(proba, 4),
        "classification_threshold": threshold,
        "latency_ms": latency_ms,
        "quantum_encoding": {
            "n_qubits": len(x_quantum),
            "angles": [round(float(v), 3) for v in x_quantum]
        },
        "disclaimer": "This result is generated by an experimental hybrid quantum machine learning model for research/decision-support evaluation. It is not a clinically validated diagnosis."
    }


@router.post("/explain")
async def explain_prediction(
    req: ExplainRequest,
    _user: dict = Depends(require_any_auth),
):
    """
    Generates feature attribution and quantum sensitivity analysis for a patient prediction.
    PDF Section 18, 33, 36.9, 47.10.
    """
    if req.experiment_id not in _ACTIVE_EXPERIMENTS:
        raise HTTPException(status_code=404, detail="Experiment session not found. Please run a benchmark experiment first.")

    exp_data = _ACTIVE_EXPERIMENTS[req.experiment_id]
    pipeline: BiomedicalDataPipeline = exp_data["pipeline"]
    xai_engine: QuantumExplainabilityEngine = exp_data["xai_engine"]
    q_kernel = exp_data["q_kernel"]
    vqc = exp_data["vqc"]
    qnn = exp_data.get("qnn")

    _, x_quantum = pipeline.transform_new_sample(req.sample_values)
    model_name = req.model_name or "Quantum Kernel (QSVM)"
    if "Kernel" in model_name or "QSVM" in model_name:
        model_obj = q_kernel
    elif "QNN" in model_name or "Neural Network" in model_name:
        model_obj = qnn if qnn is not None else q_kernel
    else:
        model_obj = vqc

    explanation = xai_engine.explain_qml_model(
        qml_model=model_obj,
        model_name=model_name,
        quantum_vector=x_quantum
    )
    return explanation


# ─── 4. Quantum Hardware & Simulator Status ──────────────────────────────────
@router.get("/hardware/status")
async def get_hardware_status(
    _user: dict = Depends(require_any_auth),
):
    """
    Returns available quantum simulation and hardware profiles.
    PDF Section 21 & 22.
    """
    return {
        "active_backend": "simulator_ideal",
        "backends": HardwareReadinessChecker.HARDWARE_PROFILES,
        "cloud_qpu": QuantumHardwareDispatcher.get_cloud_status(),
        "features": {
            "simulator_first_ready": True,
            "near_term_hardware_compatible": True,
            "automated_fallback_enabled": True
        }
    }


# ─── 5. Experiment History ───────────────────────────────────────────────────
@router.get("/experiments/history")
async def get_experiment_history(
    _user: dict = Depends(require_any_auth),
):
    """
    Returns list of recorded experiments for reproducibility and audit trail.
    PDF Section 32.10, 36.14.
    """
    db = SessionLocal()
    try:
        rows = db.query(QmlExperiment).order_by(QmlExperiment.created_at.desc()).limit(20).all()
        return [
            {
                "id": r.id,
                "dataset_name": r.dataset_name,
                "target_column": r.target_column,
                "n_pca_components": r.n_pca_components,
                "quantum_backend": r.quantum_backend,
                "qml_model_type": r.qml_model_type,
                "status": r.status,
                "created_at": r.created_at
            }
            for r in rows
        ]
    finally:
        db.close()


# ─── 6. Noise Impact Analysis ────────────────────────────────────────────────
class NoiseImpactRequest(BaseModel):
    experiment_id: str
    noise_rate: float = 0.015
    vqc_iterations: int = 20

@router.post("/benchmark/noise-impact")
async def noise_impact(
    req: NoiseImpactRequest,
    _user: dict = Depends(require_hospital),
):
    """
    Computes Noise Impact Delta = Accuracy_ideal - Accuracy_noisy for QSVM and VQC.
    PDF Section 19.30 & 20.30.
    """
    if req.experiment_id not in _ACTIVE_EXPERIMENTS:
        raise HTTPException(status_code=404, detail="Experiment session not found. Please run a benchmark first.")
    exp_data = _ACTIVE_EXPERIMENTS[req.experiment_id]
    pipeline_output = exp_data["pipeline_output"]
    benchmarker = QMLBenchmarkingEngine()
    return benchmarker.noise_impact_analysis(
        pipeline_output=pipeline_output,
        noise_rate=req.noise_rate,
        vqc_iterations=req.vqc_iterations
    )


# ─── 7. Dimension Sweep ───────────────────────────────────────────────────────
class DimensionSweepRequest(BaseModel):
    experiment_id: str
    qubit_counts: list[int] = [4, 6, 8, 10]

@router.post("/benchmark/dimension-sweep")
async def dimension_sweep(
    req: DimensionSweepRequest,
    _user: dict = Depends(require_hospital),
):
    """
    Evaluates predictive accuracy across different qubit / PCA dimensionalities.
    Shows the Accuracy vs Qubit Count trade-off curve.
    PDF Section 19.26, 20.25, 23.9.
    """
    if req.experiment_id not in _ACTIVE_EXPERIMENTS:
        raise HTTPException(status_code=404, detail="Experiment session not found. Please run a benchmark first.")
    exp_data = _ACTIVE_EXPERIMENTS[req.experiment_id]
    df = exp_data.get("dataset_df")
    target_col = exp_data.get("target_col", "target")
    if df is None:
        raise HTTPException(status_code=400, detail="Dataset DataFrame not available in session (custom CSV upload required).")
    benchmarker = QMLBenchmarkingEngine()
    return {
        "dimension_sweep": benchmarker.dimension_sweep(
            df=df, target_col=target_col, qubit_counts=req.qubit_counts
        ),
        "description": "Accuracy vs Qubit Count: demonstrates how much predictive power is retained at each compression level."
    }
