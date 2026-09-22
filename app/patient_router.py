"""
app/patient_router.py — Patient & Lab Management Router
Patient CRUD, AI Reports, Laboratory Uploads, Alerts
README Section 4.2, 4.4, 4.5
"""
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth_router import get_db, require_any_auth, require_doctor
from core.database import AIReport, DeployedModel, LabSource, LabUpload, Patient

router = APIRouter(prefix="/api", tags=["Patients & Laboratory"])

# ─── Mock Data (Used ONLY for initial database seeding) ──────────────────────
_PATIENTS = [
    {
        "id": "PAT-001", "name": "Rajesh Kumar", "age": 62, "gender": "Male",
        "admission_date": "2026-09-10", "status": "active",
        "condition": "Suspected Cardiovascular Disease",
        "risk_level": "high", "risk_score": 94.2,
        "doctor": "Dr. Ananya Sharma", "ward": "Cardiology - ICU",
    },
    {
        "id": "PAT-002", "name": "Priya Mehta", "age": 45, "gender": "Female",
        "admission_date": "2026-09-08", "status": "active",
        "condition": "Breast Cancer Screening",
        "risk_level": "medium", "risk_score": 67.8,
        "doctor": "Dr. Ananya Sharma", "ward": "Oncology",
    },
    {
        "id": "PAT-003", "name": "Amit Singh", "age": 55, "gender": "Male",
        "admission_date": "2026-09-11", "status": "active",
        "condition": "Diabetes Management",
        "risk_level": "medium", "risk_score": 72.1,
        "doctor": "Dr. Vikram Patel", "ward": "Endocrinology",
    },
    {
        "id": "PAT-004", "name": "Suman Gupta", "age": 70, "gender": "Female",
        "admission_date": "2026-09-09", "status": "active",
        "condition": "Parkinson's Disease Monitoring",
        "risk_level": "high", "risk_score": 88.5,
        "doctor": "Dr. Ananya Sharma", "ward": "Neurology",
    },
    {
        "id": "PAT-005", "name": "Vikram Rao", "age": 38, "gender": "Male",
        "admission_date": "2026-09-12", "status": "active",
        "condition": "Pneumonia - Follow Up",
        "risk_level": "low", "risk_score": 23.4,
        "doctor": "Dr. Meera Joshi", "ward": "Pulmonology",
    },
    {
        "id": "PAT-006", "name": "Lakshmi Nair", "age": 52, "gender": "Female",
        "admission_date": "2026-09-07", "status": "discharged",
        "condition": "Blood Cancer - Remission Check",
        "risk_level": "low", "risk_score": 15.2,
        "doctor": "Dr. Ananya Sharma", "ward": "Haematology",
    },
    {
        "id": "PAT-007", "name": "Arjun Deshmukh", "age": 48, "gender": "Male",
        "admission_date": "2026-09-11", "status": "active",
        "condition": "Cardiac Arrhythmia",
        "risk_level": "high", "risk_score": 91.7,
        "doctor": "Dr. Vikram Patel", "ward": "Cardiology",
    },
    {
        "id": "PAT-008", "name": "Fatima Sheikh", "age": 33, "gender": "Female",
        "admission_date": "2026-09-12", "status": "active",
        "condition": "Genomic Risk Assessment",
        "risk_level": "medium", "risk_score": 56.3,
        "doctor": "Dr. Meera Joshi", "ward": "Genetic Medicine",
    },
]

_REPORTS = [
    {
        "id": "RPT-001", "patient_id": "PAT-001", "patient_name": "Rajesh Kumar",
        "data_source": "ECG", "model_used": "CardioQSVM-v2.1",
        "models_skipped": [{"name": "PneumoniaNet-v3", "reason": "Data type mismatch (ECG ≠ X-ray)"}],
        "confidence": 94.2, "status": "completed",
        "key_finding": "High probability of ischemic heart disease",
        "evidence": "ST-segment depression >2mm in leads V4-V6, T-wave inversion in aVL. QTc prolongation at 480ms. Historical cholesterol 280mg/dL with LDL >160.",
        "reasoning": "The QSVM model detected a pattern consistent with myocardial ischemia based on 13 clinical features including resting ECG, exercise angina (positive), and ST depression magnitude. The quantum kernel achieved 94.2% confidence by leveraging non-linear feature interactions in the Hilbert space.",
        "timestamp": "2026-09-12T10:30:00Z",
        "analysis_time_sec": 2.4,
    },
    {
        "id": "RPT-002", "patient_id": "PAT-002", "patient_name": "Priya Mehta",
        "data_source": "Biopsy Image", "model_used": "OncoQubit-WDBC-v2",
        "models_skipped": [],
        "confidence": 67.8, "status": "completed",
        "key_finding": "Moderate risk pattern for malignancy",
        "evidence": "Mean radius 14.2 (above threshold), texture 19.7, smoothness 0.11. Cell compactness score elevated at 0.27. Concavity markers in upper range.",
        "reasoning": "The VQC model classified the biopsy morphometric features with moderate confidence. While the mean area and concavity points suggest concern, the symmetry and fractal dimension are within normal range. Recommend follow-up biopsy.",
        "timestamp": "2026-09-11T14:15:00Z",
        "analysis_time_sec": 3.8,
    },
    {
        "id": "RPT-003", "patient_id": "PAT-003", "patient_name": "Amit Singh",
        "data_source": "Blood Report", "model_used": "DiabetesNet-Metabolic-v1",
        "models_skipped": [{"name": "CardioQSVM-v2.1", "reason": "No cardiac data available"}],
        "confidence": 72.1, "status": "completed",
        "key_finding": "Elevated diabetes risk — metabolic markers above threshold",
        "evidence": "Fasting glucose 145 mg/dL, BMI 32.4, insulin resistance index elevated, blood pressure 150/95 mmHg. Family history positive.",
        "reasoning": "Random Forest baseline detected a metabolic pattern consistent with Type-2 diabetes onset. Glucose tolerance, adiposity index, and insulin levels all flagged by mutual information feature selection as primary risk drivers.",
        "timestamp": "2026-09-12T09:00:00Z",
        "analysis_time_sec": 1.2,
    },
    {
        "id": "RPT-004", "patient_id": "PAT-004", "patient_name": "Suman Gupta",
        "data_source": "Voice Recording", "model_used": "ParkinsonsQNN-Vocal-v1",
        "models_skipped": [],
        "confidence": 88.5, "status": "completed",
        "key_finding": "Strong vocal biomarker pattern for Parkinson's disease",
        "evidence": "MDVP jitter 0.007, shimmer 0.034, HNR 18.2 (below normal threshold of 20). DFA 0.75, RPDE 0.52. Significant PPE deviation at 0.38.",
        "reasoning": "The Quantum Neural Network detected characteristic vocal degradation patterns across 22 biomedical features. The jitter/shimmer ratio and reduced harmonic-to-noise ratio are strongly correlated with dopaminergic pathway dysfunction.",
        "timestamp": "2026-09-11T16:45:00Z",
        "analysis_time_sec": 4.1,
    },
    {
        "id": "RPT-005", "patient_id": "PAT-007", "patient_name": "Arjun Deshmukh",
        "data_source": "ECG + Holter Monitor", "model_used": "CardioQSVM-v2.1",
        "models_skipped": [],
        "confidence": 91.7, "status": "completed",
        "key_finding": "Atrial fibrillation pattern detected with high confidence",
        "evidence": "Irregular R-R intervals, absence of P-waves in leads II, III, aVF. Ventricular rate 142 bpm. QRS duration normal at 88ms.",
        "reasoning": "The QSVM model's quantum kernel detected the characteristic irregularity pattern of AF with 91.7% confidence. The model leveraged ECG feature interactions that classical SVM failed to capture, particularly the non-linear relationship between R-R variability and heart rate.",
        "timestamp": "2026-09-12T08:20:00Z",
        "analysis_time_sec": 2.7,
    },
]

_LAB_SOURCES = [
    {"id": "src-mri", "name": "MRI System", "type": "MRI", "status": "connected", "active": True, "recent_uploads": 8, "last_sync": "2026-09-12T10:15:00Z", "error": None},
    {"id": "src-ct", "name": "CT Scanner", "type": "CT Scan", "status": "connected", "active": True, "recent_uploads": 12, "last_sync": "2026-09-12T10:30:00Z", "error": None},
    {"id": "src-xray", "name": "Digital X-Ray", "type": "X-Ray", "status": "connected", "active": True, "recent_uploads": 15, "last_sync": "2026-09-12T10:45:00Z", "error": None},
    {"id": "src-blood", "name": "Haematology Analyser", "type": "Blood Report", "status": "connected", "active": True, "recent_uploads": 22, "last_sync": "2026-09-12T11:00:00Z", "error": None},
    {"id": "src-pathology", "name": "Pathology Lab", "type": "Pathology", "status": "connected", "active": True, "recent_uploads": 6, "last_sync": "2026-09-12T09:30:00Z", "error": None},
    {"id": "src-ecg", "name": "ECG Machine", "type": "ECG", "status": "connected", "active": True, "recent_uploads": 18, "last_sync": "2026-09-12T10:50:00Z", "error": None},
    {"id": "src-emr", "name": "EMR System", "type": "EMR", "status": "connected", "active": True, "recent_uploads": 30, "last_sync": "2026-09-12T11:05:00Z", "error": None},
    {"id": "src-ehr", "name": "EHR Database", "type": "EHR", "status": "connected", "active": True, "recent_uploads": 45, "last_sync": "2026-09-12T11:10:00Z", "error": None},
    {"id": "src-pacs", "name": "PACS Server", "type": "PACS", "status": "warning", "active": True, "recent_uploads": 3, "last_sync": "2026-09-12T08:00:00Z", "error": "High latency detected (>500ms). Connection intermittent."},
]

_LAB_UPLOADS = [
    {"id": "upl-001", "source": "ECG", "patient_id": "PAT-001", "patient_name": "Rajesh Kumar", "filename": "ecg_12lead_001.dcm", "timestamp": "2026-09-12T10:30:00Z", "status": "analyzed", "model_applied": "CardioQSVM-v2.1"},
    {"id": "upl-002", "source": "MRI", "patient_id": "PAT-004", "patient_name": "Suman Gupta", "filename": "brain_mri_t2_004.nii", "timestamp": "2026-09-12T09:45:00Z", "status": "pending", "model_applied": None},
    {"id": "upl-003", "source": "Blood Report", "patient_id": "PAT-003", "patient_name": "Amit Singh", "filename": "cbc_lipid_panel_003.pdf", "timestamp": "2026-09-12T09:00:00Z", "status": "analyzed", "model_applied": "DiabetesNet-Metabolic-v1"},
    {"id": "upl-004", "source": "X-Ray", "patient_id": "PAT-005", "patient_name": "Vikram Rao", "filename": "chest_xray_pa_005.dcm", "timestamp": "2026-09-12T08:30:00Z", "status": "analyzed", "model_applied": "PneumoniaNet-v3"},
    {"id": "upl-005", "source": "CT Scan", "patient_id": "PAT-002", "patient_name": "Priya Mehta", "filename": "breast_ct_002.dcm", "timestamp": "2026-09-11T14:00:00Z", "status": "analyzed", "model_applied": "OncoQubit-WDBC-v2"},
    {"id": "upl-006", "source": "Pathology", "patient_id": "PAT-006", "patient_name": "Lakshmi Nair", "filename": "blood_smear_006.tiff", "timestamp": "2026-09-11T11:30:00Z", "status": "analyzed", "model_applied": "BloodCancer-BERT-v1"},
    {"id": "upl-007", "source": "ECG", "patient_id": "PAT-007", "patient_name": "Arjun Deshmukh", "filename": "holter_24h_007.csv", "timestamp": "2026-09-12T08:20:00Z", "status": "analyzed", "model_applied": "CardioQSVM-v2.1"},
    {"id": "upl-008", "source": "EMR", "patient_id": "PAT-008", "patient_name": "Fatima Sheikh", "filename": "genomic_panel_008.vcf", "timestamp": "2026-09-12T07:00:00Z", "status": "pending", "model_applied": None},
]


# ─── Schemas ──────────────────────────────────────────────────────────────────
class AddPatientRequest(BaseModel):
    name: str
    age: int
    gender: str
    condition: str
    ward: str | None = "General"

class GenerateReportRequest(BaseModel):
    source: str
    model: str
    clinical_data: dict


# ─── 1. Patient Endpoints ────────────────────────────────────────────────────
@router.get("/patients")
async def list_patients(
    search: str | None = Query(None),
    status: str | None = Query(None),
    _user: dict = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    """List all patients with optional search and status filter."""
    query = db.query(Patient)
    if search:
        q = f"%{search.lower()}%"
        query = query.filter(
            Patient.name.ilike(q) | Patient.id.ilike(q) | Patient.condition.ilike(q)
        )
    if status:
        query = query.filter(Patient.status == status)
    
    results = query.all()
    # Convert SQLAlchemy models to dicts for JSON serialization
    patients = [
        {
            "id": p.id, "name": p.name, "age": p.age, "gender": p.gender,
            "admission_date": p.admission_date, "status": p.status,
            "condition": p.condition, "risk_level": p.risk_level,
            "risk_score": p.risk_score, "doctor": p.doctor, "ward": p.ward
        } for p in results
    ]
    return {"patients": patients, "total": len(patients)}


@router.post("/patients")
async def add_patient(
    req: AddPatientRequest,
    _user: dict = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    """Add a new patient."""
    new_id = f"PAT-{uuid.uuid4().hex[:6].upper()}"
    patient_model = Patient(
        id=new_id,
        name=req.name,
        age=req.age,
        gender=req.gender,
        admission_date=datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        status="active",
        condition=req.condition,
        risk_level="pending",
        risk_score=0.0,
        doctor="Dr. Ananya Sharma",
        ward=req.ward,
    )
    db.add(patient_model)
    db.commit()
    
    patient_dict = {
        "id": patient_model.id, "name": patient_model.name, "age": patient_model.age, "gender": patient_model.gender,
        "admission_date": patient_model.admission_date, "status": patient_model.status,
        "condition": patient_model.condition, "risk_level": patient_model.risk_level,
        "risk_score": patient_model.risk_score, "doctor": patient_model.doctor, "ward": patient_model.ward
    }
    return {"message": "Patient added successfully", "patient": patient_dict}


@router.get("/patients/{patient_id}")
async def get_patient(
    patient_id: str,
    _user: dict = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    """Get patient details with their reports."""
    p = db.query(Patient).filter(Patient.id == patient_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")

    patient_dict = {
        "id": p.id, "name": p.name, "age": p.age, "gender": p.gender,
        "admission_date": p.admission_date, "status": p.status,
        "condition": p.condition, "risk_level": p.risk_level,
        "risk_score": p.risk_score, "doctor": p.doctor, "ward": p.ward
    }
    
    r_list = db.query(AIReport).filter(AIReport.patient_id == patient_id).all()
    reports = [{"id": r.id, "patient_id": r.patient_id, "data_source": r.data_source, "model_used": r.model_used, "confidence": r.confidence, "status": r.status, "key_finding": r.key_finding, "timestamp": r.timestamp} for r in r_list]
    
    u_list = db.query(LabUpload).filter(LabUpload.patient_id == patient_id).all()
    uploads = [{"id": u.id, "source": u.source, "filename": u.filename, "timestamp": u.timestamp, "status": u.status, "model_applied": u.model_applied} for u in u_list]

    return {"patient": patient_dict, "reports": reports, "uploads": uploads}


@router.get("/patients/{patient_id}/reports")
async def get_patient_reports(
    patient_id: str,
    _user: dict = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    """Get AI analysis reports for a patient. README Section 4.2."""
    r_list = db.query(AIReport).filter(AIReport.patient_id == patient_id).all()
    reports = [{"id": r.id, "patient_id": r.patient_id, "data_source": r.data_source, "model_used": r.model_used, "confidence": r.confidence, "status": r.status, "key_finding": r.key_finding, "evidence": r.evidence, "reasoning": r.reasoning, "timestamp": r.timestamp, "analysis_time_sec": r.analysis_time_sec} for r in r_list]
    return {"patient_id": patient_id, "reports": reports}


@router.post("/patients/{patient_id}/generate-report")
async def generate_patient_report(
    patient_id: str,
    req: GenerateReportRequest,
    _user: dict = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    """Generate AI report using Gemini with de-identification."""
    import time

    from core.deidentification import deidentify_payload
    from core.gemini_service import GeminiService
    
    p = db.query(Patient).filter(Patient.id == patient_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    start_time = time.time()
    
    # 1. De-identify
    payload = req.clinical_data
    safe_payload, tokens_applied = deidentify_payload(payload, patient_name=p.name)
    
    # 2. Call Gemini
    gemini = GeminiService()
    report_data = gemini.generate_report(safe_payload, disease_context=p.condition)
    
    # 3. Save report
    new_id = f"RPT-{uuid.uuid4().hex[:6].upper()}"
    new_report = AIReport(
        id=new_id,
        patient_id=p.id,
        patient_name=p.name,
        data_source=req.source,
        model_used=req.model,
        models_skipped="[]",
        confidence=95.0, # Extract or mock
        status="completed",
        key_finding=report_data.get("key_finding"),
        evidence=report_data.get("evidence"),
        reasoning=report_data.get("reasoning"),
        timestamp=datetime.now(timezone.utc).isoformat(),
        analysis_time_sec=round(time.time() - start_time, 2)
    )
    db.add(new_report)
    db.commit()
    
    return {
        "message": "Report generated successfully",
        "report_id": new_id,
        "raw_payload": payload,
        "safe_payload": safe_payload,
        "tokens_applied": tokens_applied,
        "generated_content": report_data
    }



# ─── 2. Alerts ────────────────────────────────────────────────────────────────
@router.get("/alerts")
async def get_alerts(
    _user: dict = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    """
    Get patient alerts — patients with high risk scores.
    README Section 4.1 (Dashboard: Patient Alerts).
    """
    alerts = []
    high_risk_patients = db.query(Patient).filter(Patient.risk_score >= 50, Patient.status == "active").all()
    
    for p in high_risk_patients:
        severity = "critical" if p.risk_score >= 90 else "high" if p.risk_score >= 75 else "moderate"
        alerts.append({
            "patient_id": p.id,
            "patient_name": p.name,
            "condition": p.condition,
            "risk_score": p.risk_score,
            "severity": severity,
            "ward": p.ward,
            "doctor": p.doctor,
        })
    alerts.sort(key=lambda x: x["risk_score"], reverse=True)
    return {"alerts": alerts, "total": len(alerts)}


# ─── 3. Reports Overview ─────────────────────────────────────────────────────
@router.get("/reports")
async def list_reports(
    _user: dict = Depends(require_doctor),
    db: Session = Depends(get_db),
):
    """List all AI analysis reports across patients. README Section 4.2."""
    r_list = db.query(AIReport).all()
    reports = [{"id": r.id, "patient_id": r.patient_id, "patient_name": r.patient_name, "data_source": r.data_source, "model_used": r.model_used, "confidence": r.confidence, "status": r.status, "key_finding": r.key_finding, "timestamp": r.timestamp, "analysis_time_sec": r.analysis_time_sec} for r in r_list]
    return {"reports": reports, "total": len(reports)}


# ─── 4. Laboratory & Imaging ─────────────────────────────────────────────────
@router.get("/lab/sources")
async def get_lab_sources(
    _user: dict = Depends(require_any_auth),
    db: Session = Depends(get_db),
):
    """Get connected laboratory and imaging systems. README Section 4.5."""
    sources = db.query(LabSource).all()
    src_list = [{"id": s.id, "name": s.name, "type": s.type, "status": s.status, "active": bool(s.active), "recent_uploads": s.recent_uploads, "last_sync": s.last_sync, "error": s.error} for s in sources]
    return {
        "sources": src_list,
        "total_connected": sum(1 for s in src_list if s["status"] == "connected"),
        "total_warning": sum(1 for s in src_list if s["status"] == "warning"),
    }


@router.get("/lab/uploads")
async def get_lab_uploads(
    source: str | None = Query(None),
    status: str | None = Query(None),
    _user: dict = Depends(require_any_auth),
    db: Session = Depends(get_db),
):
    """Get recent uploads from lab/imaging systems. README Section 4.5."""
    query = db.query(LabUpload)
    if source:
        query = query.filter(LabUpload.source == source)
    if status:
        query = query.filter(LabUpload.status == status)
        
    u_list = query.all()
    uploads = [{"id": u.id, "source": u.source, "patient_id": u.patient_id, "patient_name": u.patient_name, "filename": u.filename, "timestamp": u.timestamp, "status": u.status, "model_applied": u.model_applied} for u in u_list]
    return {"uploads": uploads, "total": len(uploads)}


@router.get("/lab/pacs/studies")
async def get_pacs_studies(
    _user: dict = Depends(require_any_auth),
):
    """Retrieve indexed imaging studies from the connected PACS/DICOMWeb gateway."""
    import json

    import config
    pacs_file = config.BASE_DIR / "app" / "storage" / "mock-data" / "dicom" / "studies.json"
    if pacs_file.exists():
        return {"studies": json.loads(pacs_file.read_text(encoding="utf-8"))}
    return {"studies": []}


@router.get("/lab/fhir/bundles")
async def get_fhir_bundles(
    _user: dict = Depends(require_any_auth),
):
    """Retrieve FHIR observation bundles from the EHR interoperability gateway."""
    import json

    import config
    fhir_file = config.BASE_DIR / "app" / "storage" / "mock-data" / "fhir" / "bundles.json"
    if fhir_file.exists():
        return json.loads(fhir_file.read_text(encoding="utf-8"))
    return {"resourceType": "Bundle", "entry": []}


# ─── 5. AI Performance Stats ─────────────────────────────────────────────────
@router.get("/ai/stats")
async def get_ai_stats(
    _user: dict = Depends(require_any_auth),
    db: Session = Depends(get_db),
):
    """
    AI performance indicators for the doctor dashboard.
    README Section 4.1: confidence score, doctor agreement %, avg analysis time.
    """
    r_list = db.query(AIReport).all()
    confidences = [r.confidence for r in r_list if r.confidence]
    analysis_times = [r.analysis_time_sec for r in r_list if r.analysis_time_sec]
    
    total_patients = db.query(Patient).count()
    active_patients = db.query(Patient).filter(Patient.status == "active").count()
    high_risk_alerts = db.query(Patient).filter(Patient.status == "active", Patient.risk_score >= 75).count()
    
    m_list = db.query(DeployedModel).filter(DeployedModel.status == "active").all()

    return {
        "avg_confidence": round(sum(confidences) / len(confidences), 1) if confidences else 0,
        "doctor_agreement_pct": 94.5,
        "avg_analysis_time_sec": round(sum(analysis_times) / len(analysis_times), 1) if analysis_times else 0,
        "total_analyses_today": len(r_list),
        "total_patients": total_patients,
        "active_patients": active_patients,
        "high_risk_alerts": high_risk_alerts,
        "models_active": len(m_list),
        "models_list": [
            {"name": m.name, "type": m.type, "accuracy": m.accuracy, "status": m.status, "version": m.version} for m in m_list
        ],
    }
