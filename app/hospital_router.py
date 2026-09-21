"""
app/hospital_router.py — Hospital Management Router
Deployed models, doctor feedback, integrations, version history, dashboard stats
README Section 5.1–5.7
"""
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.auth_router import (
    require_any_auth,
    require_doctor,
    require_hospital,
    get_db,
)
from sqlalchemy.orm import Session
from core.database import DeployedModel, DoctorFeedback, AutomlJob

router = APIRouter(
    prefix="/api/hospital",
    tags=["Hospital Management"],
)

# ─── Mock Data (Used ONLY for initial database seeding) ──────────────────────
_DEPLOYED_MODELS = [
    {
        "id": "mdl-001",
        "name": "CardioQSVM-v2.1",
        "type": "Quantum SVM (QSVM)",
        "category": "Quantum QML",
        "ownership": "platform",
        "disease": "Cardiovascular Disease",
        "accuracy": 94.2,
        "f1_score": 93.8,
        "version": "2.1.0",
        "status": "active",
        "deployed_at": "2026-08-15",
        "input_formats": ["ECG", "Tabular CSV", "DICOM"],
        "qubits": 6,
        "description": (
            "Fidelity quantum kernel SVM for "
            "heart disease detection."
        ),
        "feedback_count": 12,
        "avg_rating": 4.7,
    },
    {
        "id": "mdl-002",
        "name": "OncoQubit-WDBC-v2",
        "type": "Variational Quantum Classifier (VQC)",
        "category": "Quantum QML",
        "ownership": "platform",
        "disease": "Breast Cancer",
        "accuracy": 92.8,
        "f1_score": 91.5,
        "version": "2.0.1",
        "status": "active",
        "deployed_at": "2026-07-20",
        "input_formats": ["Biopsy Image", "Tabular CSV"],
        "qubits": 8,
        "description": (
            "Variational quantum circuit for "
            "WDBC breast cancer classification."
        ),
        "feedback_count": 8,
        "avg_rating": 4.5,
    },
    {
        "id": "mdl-003",
        "name": "DiabetesNet-Metabolic-v1",
        "type": "Random Forest",
        "category": "Classical ML",
        "ownership": "platform",
        "disease": "Diabetes",
        "accuracy": 89.5,
        "f1_score": 88.2,
        "version": "1.3.0",
        "status": "active",
        "deployed_at": "2026-06-10",
        "input_formats": ["Blood Report", "Tabular CSV"],
        "qubits": 0,
        "description": (
            "Classical random forest for "
            "metabolic diabetes screening."
        ),
        "feedback_count": 15,
        "avg_rating": 4.3,
    },
    {
        "id": "mdl-004",
        "name": "ParkinsonsQNN-Vocal-v1",
        "type": "Quantum Neural Network (QNN)",
        "category": "Quantum QML",
        "ownership": "platform",
        "disease": "Parkinson's Disease",
        "accuracy": 95.1,
        "f1_score": 94.7,
        "version": "1.0.0",
        "status": "active",
        "deployed_at": "2026-08-25",
        "input_formats": ["Voice Recording", "Tabular CSV"],
        "qubits": 6,
        "description": (
            "Dressed QNN trained on vocal biomarker "
            "features for Parkinson's detection."
        ),
        "feedback_count": 5,
        "avg_rating": 4.9,
    },
    {
        "id": "mdl-005",
        "name": "PneumoniaNet-v3",
        "type": "XGBoost + CNN",
        "category": "Classical ML",
        "ownership": "platform",
        "disease": "Pneumonia",
        "accuracy": 96.7,
        "f1_score": 96.1,
        "version": "3.2.0",
        "status": "active",
        "deployed_at": "2026-05-01",
        "input_formats": ["Chest X-Ray", "DICOM", "CT Scan"],
        "qubits": 0,
        "description": (
            "Hybrid CNN + gradient boosting for "
            "pneumonia detection from chest imaging."
        ),
        "feedback_count": 22,
        "avg_rating": 4.8,
    },
    {
        "id": "mdl-006",
        "name": "Hospital-Tumour-RF-v1",
        "type": "Random Forest",
        "category": "Classical ML",
        "ownership": "hospital",
        "disease": "Brain Tumour",
        "accuracy": 87.3,
        "f1_score": 86.0,
        "version": "1.0.0",
        "status": "active",
        "deployed_at": "2026-09-05",
        "input_formats": ["MRI", "CT Scan"],
        "qubits": 0,
        "description": (
            "Hospital-trained AutoML model for brain "
            "tumour detection using MRI scans."
        ),
        "feedback_count": 3,
        "avg_rating": 4.2,
    },
]

_DOCTOR_FEEDBACK = [
    {
        "id": "fb-001",
        "model_id": "mdl-001",
        "model_name": "CardioQSVM-v2.1",
        "doctor": "Dr. Ananya Sharma",
        "rating": 5,
        "comment": (
            "Excellent accuracy on ECG data. Detected "
            "ischemic pattern that I confirmed manually. "
            "100% agreement on my last 10 cases."
        ),
        "timestamp": "2026-09-12T10:00:00Z",
    },
    {
        "id": "fb-002",
        "model_id": "mdl-005",
        "model_name": "PneumoniaNet-v3",
        "doctor": "Dr. Vikram Patel",
        "rating": 5,
        "comment": (
            "Very reliable for chest X-ray analysis. "
            "Correctly identified bilateral infiltrates "
            "in 3 critical cases today."
        ),
        "timestamp": "2026-09-12T08:30:00Z",
    },
    {
        "id": "fb-003",
        "model_id": "mdl-003",
        "model_name": "DiabetesNet-Metabolic-v1",
        "doctor": "Dr. Meera Joshi",
        "rating": 4,
        "comment": (
            "Good overall but slightly over-predicts in "
            "younger patients (<30). Suggest retraining "
            "with age-stratified data."
        ),
        "timestamp": "2026-09-11T16:00:00Z",
    },
    {
        "id": "fb-004",
        "model_id": "mdl-004",
        "model_name": "ParkinsonsQNN-Vocal-v1",
        "doctor": "Dr. Ananya Sharma",
        "rating": 5,
        "comment": (
            "Remarkably accurate on vocal biomarker "
            "analysis. The quantum model outperformed "
            "classical baselines on all my test cases."
        ),
        "timestamp": "2026-09-11T14:00:00Z",
    },
]

_TRAINING_JOBS = [
    {
        "id": "job-001",
        "name": "Liver-Cirrhosis-VQC",
        "disease": "Liver Cirrhosis",
        "status": "training",
        "progress": 67,
        "current_step": (
            "AutoML Pipeline — Training XGBoost "
            "(4/7 algorithms)"
        ),
        "started_at": "2026-09-12T06:00:00Z",
        "data_type": "tabular",
    },
    {
        "id": "job-002",
        "name": "Retinopathy-CNN-v2",
        "disease": "Diabetic Retinopathy",
        "status": "profiling",
        "progress": 25,
        "current_step": (
            "Data Profiling & Validation — "
            "Checking image quality"
        ),
        "started_at": "2026-09-12T09:30:00Z",
        "data_type": "image",
    },
]

_INTEGRATIONS = [
    {
        "system": "MRI System",
        "type": "imaging",
        "connected_models": ["Hospital-Tumour-RF-v1"],
        "status": "active",
        "health": "healthy",
        "last_check": "2026-09-12T11:00:00Z",
    },
    {
        "system": "CT Scanner",
        "type": "imaging",
        "connected_models": [
            "PneumoniaNet-v3",
            "Hospital-Tumour-RF-v1",
        ],
        "status": "active",
        "health": "healthy",
        "last_check": "2026-09-12T11:00:00Z",
    },
    {
        "system": "Digital X-Ray",
        "type": "imaging",
        "connected_models": ["PneumoniaNet-v3"],
        "status": "active",
        "health": "healthy",
        "last_check": "2026-09-12T11:00:00Z",
    },
    {
        "system": "ECG Machine",
        "type": "diagnostics",
        "connected_models": ["CardioQSVM-v2.1"],
        "status": "active",
        "health": "healthy",
        "last_check": "2026-09-12T10:50:00Z",
    },
    {
        "system": "Haematology Analyser",
        "type": "lab",
        "connected_models": ["DiabetesNet-Metabolic-v1"],
        "status": "active",
        "health": "healthy",
        "last_check": "2026-09-12T11:00:00Z",
    },
    {
        "system": "Pathology Lab",
        "type": "lab",
        "connected_models": ["OncoQubit-WDBC-v2"],
        "status": "active",
        "health": "healthy",
        "last_check": "2026-09-12T09:30:00Z",
    },
    {
        "system": "Voice Recorder",
        "type": "diagnostics",
        "connected_models": ["ParkinsonsQNN-Vocal-v1"],
        "status": "active",
        "health": "healthy",
        "last_check": "2026-09-12T10:00:00Z",
    },
    {
        "system": "PACS Server",
        "type": "storage",
        "connected_models": [],
        "status": "warning",
        "health": "degraded",
        "last_check": "2026-09-12T08:00:00Z",
    },
    {
        "system": "Genomics Sequencer",
        "type": "lab",
        "connected_models": [],
        "status": "disconnected",
        "health": "offline",
        "last_check": "2026-09-10T12:00:00Z",
    },
]

_VERSION_HISTORY = [
    {
        "model_id": "mdl-001",
        "model_name": "CardioQSVM-v2.1",
        "version": "2.1.0",
        "date": "2026-08-15",
        "changelog": (
            "Improved quantum kernel fidelity. "
            "Added support for 12-lead ECG input. "
            "ROC-AUC improved from 0.92 to 0.96."
        ),
        "deployed_by": "Platform Team",
        "accuracy": 94.2,
    },
    {
        "model_id": "mdl-001",
        "model_name": "CardioQSVM-v2.0",
        "version": "2.0.0",
        "date": "2026-06-20",
        "changelog": (
            "Major update: migrated from classical SVM "
            "to Quantum Kernel SVM. "
            "Added noise resilience."
        ),
        "deployed_by": "Platform Team",
        "accuracy": 92.0,
    },
    {
        "model_id": "mdl-001",
        "model_name": "CardioSVM-v1.0",
        "version": "1.0.0",
        "date": "2026-03-01",
        "changelog": (
            "Initial classical SVM baseline for "
            "cardiovascular disease detection."
        ),
        "deployed_by": "Platform Team",
        "accuracy": 88.5,
    },
    {
        "model_id": "mdl-002",
        "model_name": "OncoQubit-WDBC-v2",
        "version": "2.0.1",
        "date": "2026-07-20",
        "changelog": (
            "Patch: fixed PCA component mapping "
            "for 30-feature WDBC dataset."
        ),
        "deployed_by": "Platform Team",
        "accuracy": 92.8,
    },
    {
        "model_id": "mdl-002",
        "model_name": "OncoQubit-WDBC-v2",
        "version": "2.0.0",
        "date": "2026-06-15",
        "changelog": (
            "VQC ansatz changed to RealAmplitudes "
            "with 3 reps. Accuracy boost +3%."
        ),
        "deployed_by": "Platform Team",
        "accuracy": 91.2,
    },
    {
        "model_id": "mdl-005",
        "model_name": "PneumoniaNet-v3",
        "version": "3.2.0",
        "date": "2026-05-01",
        "changelog": (
            "Added DICOM format support. Retrained "
            "on expanded dataset (15k images)."
        ),
        "deployed_by": "Platform Team",
        "accuracy": 96.7,
    },
    {
        "model_id": "mdl-006",
        "model_name": "Hospital-Tumour-RF-v1",
        "version": "1.0.0",
        "date": "2026-09-05",
        "changelog": (
            "Hospital-trained via AutoML. Random Forest "
            "selected as champion (6/7 algorithms "
            "evaluated). Trained on 10,000 MRI images."
        ),
        "deployed_by": "CityCare Hospital",
        "accuracy": 87.3,
    },
]


# ─── Schemas ──────────────────────────────────────────────────────────────────
class FeedbackRequest(BaseModel):
    doctor_name: str
    rating: int  # 1-5
    comment: str


# ─── 1. Dashboard Stats ──────────────────────────────────────────────────────
@router.get("/stats")
async def get_hospital_stats(
    _user: dict = Depends(require_hospital),  # noqa: B008
    db: Session = Depends(get_db),
):
    """Hospital dashboard overview stats. README Section 5.1."""
    fb_list = db.query(DoctorFeedback).all()
    fb_avg = 0
    if fb_list:
        fb_avg = round(sum(f.rating for f in fb_list) / len(fb_list), 1)
        
    training_count = db.query(AutomlJob).filter(AutomlJob.status.in_(["training", "profiling"])).count()
    
    active_models = db.query(DeployedModel).filter(DeployedModel.status == "active").count()
    platform_models = db.query(DeployedModel).filter(DeployedModel.ownership == "platform").count()
    hospital_models = db.query(DeployedModel).filter(DeployedModel.ownership == "hospital").count()
    
    return {
        "active_models": active_models,
        "platform_models": platform_models,
        "hospital_models": hospital_models,
        "total_feedback": len(fb_list),
        "avg_model_rating": fb_avg,
        "training_in_progress": training_count,
        "integrations_healthy": sum(
            1 for i in _INTEGRATIONS
            if i["health"] == "healthy"
        ),
        "integrations_total": len(_INTEGRATIONS),
    }


# ─── 2. Deployed Models ──────────────────────────────────────────────────────
@router.get("/models")
async def list_models(
    ownership: str | None = Query(None),
    _user: dict = Depends(require_any_auth),  # noqa: B008
    db: Session = Depends(get_db),
):
    """List all deployed models. README Section 5.2."""
    query = db.query(DeployedModel)
    if ownership:
        query = query.filter(DeployedModel.ownership == ownership)
        
    m_list = query.all()
    models = [{"id": m.id, "name": m.name, "type": m.type, "status": m.status, "accuracy": m.accuracy, "disease": m.disease, "ownership": m.ownership, "feedback_count": m.feedback_count, "deployed_at": m.deployed_at} for m in m_list]
    return {"models": models, "total": len(models)}


# ─── 3. Doctor Feedback ──────────────────────────────────────────────────────
@router.get("/feedback")
async def list_feedback(
    _user: dict = Depends(require_hospital),  # noqa: B008
    db: Session = Depends(get_db),
):
    """List recent doctor feedback. README Section 5.1."""
    f_list = db.query(DoctorFeedback).order_by(DoctorFeedback.timestamp.desc()).all()
    feedback = [{"id": f.id, "model_id": f.model_id, "model_name": f.model_name, "doctor": f.doctor, "rating": f.rating, "comment": f.comment, "timestamp": f.timestamp} for f in f_list]
    return {"feedback": feedback}


@router.post("/models/{model_id}/feedback")
async def submit_feedback(
    model_id: str,
    req: FeedbackRequest,
    _user: dict = Depends(require_doctor),  # noqa: B008
    db: Session = Depends(get_db),
):
    """Submit doctor feedback on a model. README Section 4.3."""
    model = db.query(DeployedModel).filter(DeployedModel.id == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    fb_id = f"fb-{uuid.uuid4().hex[:6]}"
    fb = DoctorFeedback(
        id=fb_id,
        model_id=model_id,
        model_name=model.name,
        doctor=req.doctor_name,
        rating=req.rating,
        comment=req.comment,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
    db.add(fb)
    model.feedback_count += 1
    db.commit()
    
    fb_dict = {"id": fb.id, "model_id": fb.model_id, "model_name": fb.model_name, "doctor": fb.doctor, "rating": fb.rating, "comment": fb.comment, "timestamp": fb.timestamp}
    return {"message": "Feedback submitted", "feedback": fb_dict}


# ─── 4. Training Jobs ────────────────────────────────────────────────────────
@router.get("/training-jobs")
async def list_training_jobs(
    _user: dict = Depends(require_hospital),  # noqa: B008
):
    """List models currently being trained. README Section 5.1, 5.4."""
    return {"jobs": _TRAINING_JOBS}


# ─── 5. Integrations ─────────────────────────────────────────────────────────
@router.get("/integrations")
async def list_integrations(
    _user: dict = Depends(require_any_auth),  # noqa: B008
):
    """List system integrations and their health. README Section 5.6."""
    return {
        "integrations": _INTEGRATIONS,
        "summary": {
            "total": len(_INTEGRATIONS),
            "healthy": sum(1 for i in _INTEGRATIONS if i["health"] == "healthy"),
            "degraded": sum(1 for i in _INTEGRATIONS if i["health"] == "degraded"),
            "offline": sum(1 for i in _INTEGRATIONS if i["health"] == "offline"),
        }
    }


# ─── 6. Version History ──────────────────────────────────────────────────────
@router.get("/versions")
async def list_versions(
    model_id: str | None = Query(None),
    _user: dict = Depends(require_any_auth),  # noqa: B008
):
    """Model version history. README Section 5.5."""
    results = _VERSION_HISTORY.copy()
    if model_id:
        results = [v for v in results if v["model_id"] == model_id]
    return {"versions": results}
