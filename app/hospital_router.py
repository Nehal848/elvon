"""
app/hospital_router.py — Hospital Management Router
Deployed models, doctor feedback, integrations, version history, dashboard stats
README Section 5.1–5.7
"""
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth_router import (
    get_db,
    require_any_auth,
    require_doctor,
    require_hospital,
)
from core.database import AutomlJob, DeployedModel, DoctorFeedback, User, AuditLog

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
    _user: dict = Depends(require_hospital),
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
    _user: dict = Depends(require_any_auth),
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
    _user: dict = Depends(require_hospital),
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
    _user: dict = Depends(require_doctor),
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
    _user: dict = Depends(require_hospital),
):
    """List models currently being trained. README Section 5.1, 5.4."""
    return {"jobs": _TRAINING_JOBS}


# ─── 5. Integrations ─────────────────────────────────────────────────────────
@router.get("/integrations")
async def list_integrations(
    _user: dict = Depends(require_any_auth),
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
    _user: dict = Depends(require_any_auth),
):
    """Model version history. README Section 5.5."""
    results = _VERSION_HISTORY.copy()
    if model_id:
        results = [v for v in results if v["model_id"] == model_id]
    return {"versions": results}


# ─── 7. User Management ──────────────────────────────────────────────────────
class CreateUserRequest(BaseModel):
    full_name: str
    identifier: str
    email: str
    role: str
    institution: str | None = None
    designation: str | None = None
    phone: str | None = None
    password: str | None = "Welcome@123"


_DEFAULT_USERS = [
    {
        "id": "USR-001",
        "name": "Dr. Ananya Sharma",
        "full_name": "Dr. Ananya Sharma",
        "role": "Senior Cardiologist & Clinician",
        "department": "Cardiology & Clinical AI",
        "institution": "AIIMS Delhi",
        "licenseId": "MED-11001-DL",
        "identifier": "MED-11001-DL",
        "email": "doctor@elvon.ai",
        "status": "Verified",
        "lastActive": "Active Now",
        "avatarColor": "from-blue-600 to-cyan-500",
    },
    {
        "id": "USR-002",
        "name": "Dr. Vikram Sarabhai",
        "full_name": "Dr. Vikram Sarabhai",
        "role": "Lead QML Research Scientist",
        "department": "Quantum Computing Lab",
        "institution": "TIFR Quantum Center",
        "licenseId": "RES-QML-007",
        "identifier": "RES-QML-007",
        "email": "researcher@elvon.ai",
        "status": "Verified",
        "lastActive": "14 mins ago",
        "avatarColor": "from-purple-600 to-fuchsia-600",
    },
    {
        "id": "USR-003",
        "name": "Aarav Patel",
        "full_name": "Aarav Patel",
        "role": "Principal ML & AutoML Engineer",
        "department": "Diagnostic AI Studio",
        "institution": "Elvon Medical AI Labs",
        "licenseId": "DS-AI-404",
        "identifier": "DS-AI-404",
        "email": "datascientist@elvon.ai",
        "status": "Verified",
        "lastActive": "1 hour ago",
        "avatarColor": "from-emerald-600 to-teal-500",
    },
    {
        "id": "USR-004",
        "name": "CityCare Admin",
        "full_name": "CityCare Admin",
        "role": "Hospital Administrator",
        "department": "Executive Operations",
        "institution": "CityCare Multi-Speciality",
        "licenseId": "HOSP-MH-001",
        "identifier": "HOSP-MH-001",
        "email": "admin@citycare.in",
        "status": "Active",
        "lastActive": "Active Now",
        "avatarColor": "from-indigo-600 to-violet-600",
    },
]


@router.get("/users")
async def list_users(
    db: Session = Depends(get_db),
    _user: dict = Depends(require_any_auth),
):
    """List registered users and clinical staff."""
    db_users = db.query(User).all()
    if not db_users:
        return {"users": _DEFAULT_USERS}

    results = []
    for u in db_users:
        role_label = u.designation or (
            "Clinician" if u.role == "doctor"
            else "Hospital Administrator" if u.role == "institution"
            else "Quantum Researcher" if u.role == "researcher"
            else "AutoML & Data Scientist"
        )
        avatar = (
            "from-blue-600 to-cyan-500" if u.role == "doctor"
            else "from-indigo-600 to-violet-600" if u.role == "institution"
            else "from-purple-600 to-fuchsia-600" if u.role == "researcher"
            else "from-emerald-600 to-teal-500"
        )
        results.append({
            "id": u.id,
            "name": u.full_name,
            "full_name": u.full_name,
            "identifier": u.identifier,
            "licenseId": u.identifier,
            "email": u.email,
            "role": role_label,
            "department": u.designation or "Clinical Operations",
            "institution": u.institution or "CityCare Multi-Speciality Hospital",
            "status": "Verified" if u.verified else "Active",
            "lastActive": "Active Recently",
            "avatarColor": avatar,
        })
    return {"users": results}


@router.post("/users")
async def create_user(
    body: CreateUserRequest,
    db: Session = Depends(get_db),
    _user: dict = Depends(require_any_auth),
):
    """Register a new clinician, researcher, or staff member."""
    import bcrypt
    new_id = f"usr_{uuid.uuid4().hex[:8]}"
    pw = (body.password or "Welcome@123").encode("utf-8")
    pw_hash = bcrypt.hashpw(pw, bcrypt.gensalt()).decode()

    new_user = User(
        id=new_id,
        full_name=body.full_name,
        identifier=body.identifier,
        email=body.email,
        role=body.role,
        institution=body.institution or "CityCare Multi-Speciality Hospital",
        designation=body.designation or body.role,
        phone=body.phone or "+91-9876543210",
        password_hash=pw_hash,
        verified=1,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": f"User {body.full_name} registered successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.full_name,
            "full_name": new_user.full_name,
            "identifier": new_user.identifier,
            "licenseId": new_user.identifier,
            "email": new_user.email,
            "role": new_user.designation or new_user.role,
            "department": new_user.designation or "Clinical Operations",
            "institution": new_user.institution,
            "status": "Verified",
            "lastActive": "Active Now",
            "avatarColor": "from-blue-600 to-cyan-500",
        }
    }


# ─── 8. Audit & Activity Log ─────────────────────────────────────────────────
_MOCK_AUDIT_LOGS = [
    {
        "id": "AUD-8921",
        "timestamp": "2 mins ago",
        "user": "Dr. Ananya Sharma",
        "role": "Clinician",
        "action": "Model Inference Executed",
        "resource": "QSVM Breast Cancer v2.1",
        "category": "Inference",
        "status": "verified",
        "ip": "10.0.4.18 (Enclave)",
        "details": "Zero-leakage inference on Patient P-1024; Perturbation score 0.94.",
    },
    {
        "id": "AUD-8920",
        "timestamp": "14 mins ago",
        "user": "Dr. Vikram Sarabhai",
        "role": "Quantum Researcher",
        "action": "NISQ Simulator Job Dispatched",
        "resource": "VQC Circuit (8-Qubit Statevector)",
        "category": "Config",
        "status": "success",
        "ip": "10.0.12.91",
        "details": "PennyLane default.qubit simulator; 2048 shots; Hardware readiness score 87%.",
    },
    {
        "id": "AUD-8919",
        "timestamp": "42 mins ago",
        "user": "CityCare Admin",
        "role": "Hospital Admin",
        "action": "HL7/FHIR Feed Synced",
        "resource": "PACS DICOM Server 02",
        "category": "Access",
        "status": "verified",
        "ip": "192.168.1.105",
        "details": "18 new radiology imaging studies ingested with verified SHA-256 integrity hash.",
    },
    {
        "id": "AUD-8918",
        "timestamp": "1 hour ago",
        "user": "Aarav Patel",
        "role": "Data Scientist",
        "action": "AutoML Pipeline Completed",
        "resource": "Tournament #TRN-2026-04",
        "category": "Inference",
        "status": "success",
        "ip": "10.0.8.44",
        "details": "Trained 5 candidate models (XGBoost, RandomForest, QSVM); Champion accuracy 95.8%.",
    },
    {
        "id": "AUD-8917",
        "timestamp": "2 hours ago",
        "user": "System Daemon",
        "role": "Security Sentinel",
        "action": "Enclave Memory Integrity Check",
        "resource": "Isolated RAM Sandbox",
        "category": "Security",
        "status": "verified",
        "ip": "127.0.0.1 (Localhost)",
        "details": "Zero memory leakage detected across all running containerized inference workers.",
    },
    {
        "id": "AUD-8916",
        "timestamp": "3 hours ago",
        "user": "Dr. Ananya Sharma",
        "role": "Clinician",
        "action": "Patient Diagnostic Report Export",
        "resource": "Report #REP-9041 (Patient P-1088)",
        "category": "Export",
        "status": "success",
        "ip": "10.0.4.18 (Enclave)",
        "details": "Encrypted PDF generated with digital cryptographic clinician signature.",
    },
    {
        "id": "AUD-8915",
        "timestamp": "5 hours ago",
        "user": "System Daemon",
        "role": "Compliance Sentinel",
        "action": "Differential Privacy Noise Audit",
        "resource": "Patient Cohort Registry",
        "category": "Security",
        "status": "verified",
        "ip": "127.0.0.1 (Localhost)",
        "details": "Epsilon budget epsilon=0.5 validated; Patient re-identification risk < 0.01%.",
    },
]


@router.get("/audit")
async def list_audit(
    category: str | None = Query(None),
    limit: int = Query(50),
    db: Session = Depends(get_db),
    _user: dict = Depends(require_any_auth),
):
    """List system telemetry and audit logs."""
    logs = _MOCK_AUDIT_LOGS.copy()
    if category and category.lower() != "all":
        logs = [l for l in logs if l["category"].lower() == category.lower()]
    return {
        "summary": {
            "total_events": 1428,
            "security_incidents": 0,
            "model_inferences": 842,
            "data_access_events": 586,
            "enclave_status": "Active (Zero Leakage)",
        },
        "logs": logs[:limit],
    }

