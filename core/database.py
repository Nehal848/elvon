import json
import logging

from sqlalchemy import Column, Float, Integer, String, Text, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from config import BASE_DIR, DATABASE_URL

logger = logging.getLogger("database")

def get_engine():
    # Attempt to use configured DATABASE_URL (e.g. PostgreSQL)
    target_url = DATABASE_URL
    if target_url and target_url.startswith("postgresql"):
        try:
            # Check if psycopg2 or psycopg is available
            import importlib
            has_driver = False
            for drv in ("psycopg2", "psycopg"):
                try:
                    importlib.import_module(drv)
                    has_driver = True
                    break
                except ImportError:
                    continue
            if has_driver:
                test_engine = create_engine(target_url, pool_pre_ping=True)
                # Test connection briefly
                with test_engine.connect() as conn:  # noqa: F841
                    pass
                logger.info("Connected to PostgreSQL database successfully.")
                return test_engine
            else:
                logger.warning("PostgreSQL driver (psycopg2/psycopg) not installed. Falling back to local SQLite.")
        except Exception as e:  # noqa: BLE001
            logger.warning(f"PostgreSQL connection failed ({e}). Falling back to local SQLite.")
    
    # SQLite fallback
    sqlite_file = BASE_DIR / "hospital_ecosystem.db"
    sqlite_url = f"sqlite:///{sqlite_file}"
    logger.info(f"Using SQLite database at {sqlite_url}")
    return create_engine(sqlite_url, connect_args={"check_same_thread": False})

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    identifier = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    institution = Column(String)
    designation = Column(String)
    state = Column(String)
    address = Column(String)
    phone = Column(String)
    verified = Column(Integer, default=0) # SQLite boolean

class Patient(Base):
    __tablename__ = "patients"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer)
    gender = Column(String)
    admission_date = Column(String)
    status = Column(String)
    condition = Column(String)
    risk_level = Column(String)
    risk_score = Column(Float)
    doctor = Column(String)
    ward = Column(String)

class AIReport(Base):
    __tablename__ = "ai_reports"
    id = Column(String, primary_key=True, index=True)
    patient_id = Column(String, index=True)
    patient_name = Column(String)
    data_source = Column(String)
    model_used = Column(String)
    models_skipped = Column(Text) # JSON
    confidence = Column(Float)
    status = Column(String)
    key_finding = Column(String)
    evidence = Column(Text)
    reasoning = Column(Text)
    timestamp = Column(String)
    analysis_time_sec = Column(Float)

class LabSource(Base):
    __tablename__ = "lab_sources"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    status = Column(String)
    active = Column(Integer, default=1)
    recent_uploads = Column(Integer)
    last_sync = Column(String)
    error = Column(String)

class LabUpload(Base):
    __tablename__ = "lab_uploads"
    id = Column(String, primary_key=True, index=True)
    source = Column(String)
    patient_id = Column(String)
    patient_name = Column(String)
    filename = Column(String)
    timestamp = Column(String)
    status = Column(String)
    model_applied = Column(String)

class DeployedModel(Base):
    __tablename__ = "deployed_models"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    type = Column(String)
    category = Column(String)
    status = Column(String)
    accuracy = Column(Float)
    f1_score = Column(Float)
    disease = Column(String)
    ownership = Column(String)
    version = Column(String)
    input_formats = Column(String) # Stored as JSON string
    qubits = Column(Integer)
    description = Column(String)
    feedback_count = Column(Integer, default=0)
    avg_rating = Column(Float)
    deployed_at = Column(String)

class DoctorFeedback(Base):
    __tablename__ = "doctor_feedback"
    id = Column(String, primary_key=True, index=True)
    model_id = Column(String)
    model_name = Column(String)
    doctor = Column(String)
    rating = Column(Integer)
    comment = Column(Text)
    timestamp = Column(String)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String, nullable=False)
    modality = Column(String, nullable=False)
    format = Column(String, nullable=False)
    champion_model = Column(String, nullable=False)
    confidence_score = Column(String, nullable=False)
    doctor_action = Column(String, nullable=False)
    
    # Extended fields
    dataset_hash = Column(String, default="0x8f3a9d10")
    uploaded_by = Column(String, default="Dr. S. Vance (Senior Clinical Lead)")
    target_column = Column(String, default="Diagnosis")
    problem_type = Column(String, default="Classification (Binary)")
    doctor_notes = Column(String, default="Verified against localized chest opacity markers.")
    model_version = Column(String, default="v2.1.0-ONNX Registry Draft")

class AutomlJob(Base):
    __tablename__ = "automl_jobs"
    id = Column(String, primary_key=True, index=True)
    hospital_id = Column(Integer, default=1)
    disease_name = Column(String)
    data_type = Column(String)
    status = Column(String)
    step = Column(Integer, default=1)
    file_path = Column(String)
    model_path = Column(String)
    config = Column(Text)       # JSON string
    profile = Column(Text)      # JSON string
    quality_score = Column(Float)
    training_progress = Column(String)
    metrics = Column(Text)      # JSON string
    report = Column(Text)       # JSON string
    error = Column(Text)
    logs = Column(Text)         # JSON array
    created_at = Column(String)
    updated_at = Column(String)
    evaluation_start_time = Column(String)
    rlhf_accuracy_score = Column(Float)
    governance_reason = Column(String)

class QmlExperiment(Base):
    __tablename__ = "qml_experiments"
    id = Column(String, primary_key=True, index=True)
    dataset_name = Column(String, nullable=False)
    dataset_version = Column(String, default="v1.0")
    target_column = Column(String, nullable=False)
    selected_features = Column(Text)          # JSON list of feature names
    n_pca_components = Column(Integer, default=8)
    quantum_backend = Column(String, default="ideal_simulator")  # ideal_simulator | noisy_simulator | hardware
    qml_model_type = Column(String, default="VQC")               # QSVM | VQC | QNN
    status = Column(String, default="COMPLETED")
    benchmark_results = Column(Text)         # JSON comparison of classical vs QML
    quantum_resources = Column(Text)         # JSON (qubits, depth, gates, runtime)
    explainability_data = Column(Text)       # JSON (feature importance, perturbation)
    leakage_audit = Column(Text)             # JSON leakage verification report
    created_at = Column(String)
    created_by = Column(String, default="Researcher")

# Helper functions to serialize/deserialize dicts safely
def serialize(obj):
    if obj is None:
        return None
    return json.dumps(obj)

def deserialize(obj_str, default=None):
    if not obj_str:
        return default
    try:
        return json.loads(obj_str)
    except Exception:  # noqa: BLE001
        return default

def auto_migrate_db():
    """
    Reflects the database schema and automatically adds any missing columns
    defined in SQLAlchemy models to existing tables (prevents SQLite schema drift).
    """
    try:
        from sqlalchemy import inspect, text
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        with engine.begin() as conn:
            for table_name, table in Base.metadata.tables.items():
                if table_name in existing_tables:
                    existing_cols = {c["name"] for c in inspector.get_columns(table_name)}
                    for col in table.columns:
                        if col.name not in existing_cols:
                            col_type = col.type.compile(engine.dialect)
                            logger.warning(
                                f"Schema drift detected: adding missing column '{col.name}' "
                                f"({col_type}) to table '{table_name}'"
                            )
                            conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {col.name} {col_type}"))
    except Exception as e:  # noqa: BLE001
        logger.error(f"Error during auto_migrate_db: {e}")


def init_db():
    Base.metadata.create_all(bind=engine)
    auto_migrate_db()
    seed_db()

def seed_db():
    import bcrypt

    from app.hospital_router import _DEPLOYED_MODELS, _DOCTOR_FEEDBACK
    from app.patient_router import _LAB_SOURCES, _LAB_UPLOADS, _PATIENTS, _REPORTS

    db = SessionLocal()
    try:
        # Seed Demo Users for all 4 Personas if missing
        demo_users = [
            {
                "id": "usr_demo_doctor",
                "full_name": "Dr. Ananya Sharma",
                "identifier": "MED-11001-DL",
                "email": "doctor@elvon.ai",
                "role": "doctor",
                "password": b"doctor",
                "institution": "AIIMS Delhi",
                "designation": "Senior Cardiologist & Clinician",
                "state": "Delhi",
                "phone": "+91-9876543210",
                "verified": 1,
            },
            {
                "id": "usr_demo_hospital",
                "full_name": "CityCare Hospital Admin",
                "identifier": "HOSP-MH-001",
                "email": "admin@citycare.in",
                "role": "institution",
                "password": b"admin",
                "institution": "CityCare Multi-Speciality Hospital",
                "designation": "Hospital Administrator",
                "address": "Mumbai, Maharashtra",
                "phone": "+91-9988776655",
                "verified": 1,
            },
            {
                "id": "usr_demo_researcher",
                "full_name": "Dr. Vikram Sarabhai",
                "identifier": "RES-QML-007",
                "email": "researcher@elvon.ai",
                "role": "researcher",
                "password": b"researcher",
                "institution": "TIFR Quantum Computing Center",
                "designation": "Lead QML Research Scientist",
                "state": "Maharashtra",
                "phone": "+91-9820011223",
                "verified": 1,
            },
            {
                "id": "usr_demo_datascientist",
                "full_name": "Aarav Patel",
                "identifier": "DS-AI-404",
                "email": "datascientist@elvon.ai",
                "role": "data_scientist",
                "password": b"datascience",
                "institution": "Elvon Medical AI Labs",
                "designation": "Principal ML & AutoML Engineer",
                "state": "Karnataka",
                "phone": "+91-9845012345",
                "verified": 1,
            },
        ]
        for du in demo_users:
            if not db.query(User).filter(User.identifier == du["identifier"]).first():
                du_copy = dict(du)
                pw = du_copy.pop("password")
                du_copy["password_hash"] = bcrypt.hashpw(pw, bcrypt.gensalt()).decode()
                db.add(User(**du_copy))
        db.commit()

        # Seed Patients if empty
        if db.query(Patient).count() == 0:
            for p in _PATIENTS:
                db.add(Patient(**p))
            db.commit()

        # Seed AI Reports if empty
        if db.query(AIReport).count() == 0:
            for r in _REPORTS:
                rpt = r.copy()
                rpt["models_skipped"] = serialize(rpt.get("models_skipped", []))
                db.add(AIReport(**rpt))
            db.commit()

        # Seed Lab Sources if empty
        if db.query(LabSource).count() == 0:
            for ls in _LAB_SOURCES:
                src = ls.copy()
                src["active"] = 1 if src.get("active") else 0
                db.add(LabSource(**src))
            db.commit()

        # Seed Lab Uploads if empty
        if db.query(LabUpload).count() == 0:
            for u in _LAB_UPLOADS:
                db.add(LabUpload(**u))
            db.commit()

        # Seed Deployed Models if empty
        if db.query(DeployedModel).count() == 0:
            for m in _DEPLOYED_MODELS:
                model_data = m.copy()
                if "input_formats" in model_data:
                    model_data["input_formats"] = serialize(model_data["input_formats"])
                db.add(DeployedModel(**model_data))
            db.commit()

        # Seed Doctor Feedback if empty
        if db.query(DoctorFeedback).count() == 0:
            for f in _DOCTOR_FEEDBACK:
                db.add(DoctorFeedback(**f))
            db.commit()

        # Seed QML Experiments if empty
        if db.query(QmlExperiment).count() == 0:
            seed_experiments = [
                {
                    "id": "EXP-2026-WDBC-01",
                    "dataset_name": "Breast Cancer Diagnostic (WDBC)",
                    "dataset_version": "v1.0",
                    "target_column": "diagnosis",
                    "selected_features": serialize(["radius_mean", "texture_mean", "perimeter_mean", "area_mean", "smoothness_mean", "compactness_mean", "concavity_mean", "concave_points_mean"]),
                    "n_pca_components": 8,
                    "quantum_backend": "simulator_ideal",
                    "qml_model_type": "QSVM + VQC + QNN",
                    "status": "COMPLETED",
                    "benchmark_results": serialize({
                        "classical_champion": {"name": "Random Forest", "accuracy": 96.5, "precision": 0.96, "recall": 0.97, "f1_score": 0.965, "roc_auc": 0.988, "latency_ms": 12.4},
                        "quantum_champion": {"name": "Quantum Kernel (QSVM)", "accuracy": 95.8, "precision": 0.95, "recall": 0.96, "f1_score": 0.955, "roc_auc": 0.982, "latency_ms": 45.2, "category": "Hybrid QML"},
                        "outcome": "Classical Advantage: Random Forest exceeds Quantum Kernel by +0.7% accuracy",
                        "models": [
                            {"name": "Random Forest", "category": "Classical ML", "accuracy": 96.5, "precision": 0.96, "recall": 0.97, "f1_score": 0.965, "roc_auc": 0.988},
                            {"name": "Support Vector Machine", "category": "Classical ML", "accuracy": 94.7, "precision": 0.94, "recall": 0.95, "f1_score": 0.945, "roc_auc": 0.975},
                            {"name": "Quantum Kernel (QSVM)", "category": "Hybrid QML", "accuracy": 95.8, "precision": 0.95, "recall": 0.96, "f1_score": 0.955, "roc_auc": 0.982},
                            {"name": "Variational Quantum Classifier", "category": "Hybrid QML", "accuracy": 93.2, "precision": 0.92, "recall": 0.94, "f1_score": 0.930, "roc_auc": 0.960},
                            {"name": "Quantum Neural Network", "category": "Hybrid QML", "accuracy": 94.1, "precision": 0.93, "recall": 0.95, "f1_score": 0.940, "roc_auc": 0.968}
                        ]
                    }),
                    "quantum_resources": serialize({"n_qubits": 8, "depth": 14, "total_gates": 56, "cnot_count": 28, "shots": 1000, "execution_time_ms": 340}),
                    "leakage_audit": serialize({"passed": True, "split_leakage_detected": False, "feature_leakage_detected": False}),
                    "created_at": "2026-03-24T10:15:30Z",
                    "created_by": "Dr. Vikram Sarabhai"
                },
                {
                    "id": "EXP-2026-HEART-02",
                    "dataset_name": "Heart Disease Cleveland",
                    "dataset_version": "v1.0",
                    "target_column": "target",
                    "selected_features": serialize(["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach"]),
                    "n_pca_components": 6,
                    "quantum_backend": "simulator_noisy",
                    "qml_model_type": "Variational Quantum Classifier (VQC)",
                    "status": "COMPLETED",
                    "benchmark_results": serialize({
                        "classical_champion": {"name": "XGBoost", "accuracy": 88.5, "precision": 0.87, "recall": 0.89, "f1_score": 0.88, "roc_auc": 0.912, "latency_ms": 8.5},
                        "quantum_champion": {"name": "VQC (Angle Encoding)", "accuracy": 86.9, "precision": 0.85, "recall": 0.88, "f1_score": 0.865, "roc_auc": 0.895, "latency_ms": 62.0, "category": "Hybrid QML"},
                        "outcome": "Competitive: VQC demonstrates robust convergence under 1.5% simulated depolarizing noise",
                        "models": [
                            {"name": "XGBoost", "category": "Classical ML", "accuracy": 88.5, "precision": 0.87, "recall": 0.89, "f1_score": 0.88},
                            {"name": "Logistic Regression", "category": "Classical ML", "accuracy": 84.1, "precision": 0.83, "recall": 0.85, "f1_score": 0.84},
                            {"name": "VQC (Angle Encoding)", "category": "Hybrid QML", "accuracy": 86.9, "precision": 0.85, "recall": 0.88, "f1_score": 0.865}
                        ]
                    }),
                    "quantum_resources": serialize({"n_qubits": 6, "depth": 18, "total_gates": 48, "cnot_count": 24, "shots": 800, "execution_time_ms": 420}),
                    "leakage_audit": serialize({"passed": True, "split_leakage_detected": False, "feature_leakage_detected": False}),
                    "created_at": "2026-03-25T14:40:00Z",
                    "created_by": "Dr. Vikram Sarabhai"
                },
                {
                    "id": "EXP-2026-DIAB-03",
                    "dataset_name": "Diabetes Early Risk",
                    "dataset_version": "v1.0",
                    "target_column": "Outcome",
                    "selected_features": serialize(["Pregnancies", "Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"]),
                    "n_pca_components": 8,
                    "quantum_backend": "simulator_ideal",
                    "qml_model_type": "Quantum Neural Network (QNN)",
                    "status": "COMPLETED",
                    "benchmark_results": serialize({
                        "classical_champion": {"name": "Logistic Regression", "accuracy": 78.4, "precision": 0.76, "recall": 0.79, "f1_score": 0.775, "roc_auc": 0.825, "latency_ms": 5.1},
                        "quantum_champion": {"name": "Hybrid QNN", "accuracy": 79.2, "precision": 0.78, "recall": 0.80, "f1_score": 0.79, "roc_auc": 0.835, "latency_ms": 55.4, "category": "Hybrid QML"},
                        "outcome": "Quantum Parity: Hybrid QNN outperforms standard baseline by +0.8% accuracy",
                        "models": [
                            {"name": "Logistic Regression", "category": "Classical ML", "accuracy": 78.4, "precision": 0.76, "recall": 0.79, "f1_score": 0.775},
                            {"name": "Hybrid QNN", "category": "Hybrid QML", "accuracy": 79.2, "precision": 0.78, "recall": 0.80, "f1_score": 0.79}
                        ]
                    }),
                    "quantum_resources": serialize({"n_qubits": 8, "depth": 16, "total_gates": 64, "cnot_count": 32, "shots": 1024, "execution_time_ms": 480}),
                    "leakage_audit": serialize({"passed": True, "split_leakage_detected": False, "feature_leakage_detected": False}),
                    "created_at": "2026-03-26T08:20:15Z",
                    "created_by": "Dr. Vikram Sarabhai"
                },
                {
                    "id": "EXP-2026-NEURO-04",
                    "dataset_name": "Parkinsons Disease Biomarkers",
                    "dataset_version": "v1.0",
                    "target_column": "status",
                    "selected_features": serialize(["MDVP:Fo(Hz)", "MDVP:Fhi(Hz)", "MDVP:Flo(Hz)", "MDVP:Jitter(%)", "MDVP:Shimmer", "NHR", "HNR", "RPDE"]),
                    "n_pca_components": 8,
                    "quantum_backend": "simulator_ideal",
                    "qml_model_type": "QSVM (ZZFeatureMap)",
                    "status": "COMPLETED",
                    "benchmark_results": serialize({
                        "classical_champion": {"name": "Support Vector Machine", "accuracy": 91.2, "precision": 0.90, "recall": 0.92, "f1_score": 0.91, "roc_auc": 0.935, "latency_ms": 6.8},
                        "quantum_champion": {"name": "Quantum Kernel (QSVM)", "accuracy": 92.3, "precision": 0.92, "recall": 0.93, "f1_score": 0.925, "roc_auc": 0.948, "latency_ms": 38.0, "category": "Hybrid QML"},
                        "outcome": "Quantum Advantage: QSVM non-linear feature Hilbert space improves separation (+1.1%)",
                        "models": [
                            {"name": "Support Vector Machine", "category": "Classical ML", "accuracy": 91.2, "precision": 0.90, "recall": 0.92, "f1_score": 0.91},
                            {"name": "Quantum Kernel (QSVM)", "category": "Hybrid QML", "accuracy": 92.3, "precision": 0.92, "recall": 0.93, "f1_score": 0.925}
                        ]
                    }),
                    "quantum_resources": serialize({"n_qubits": 8, "depth": 22, "total_gates": 72, "cnot_count": 36, "shots": 1000, "execution_time_ms": 510}),
                    "leakage_audit": serialize({"passed": True, "split_leakage_detected": False, "feature_leakage_detected": False}),
                    "created_at": "2026-03-26T06:10:00Z",
                    "created_by": "Dr. Vikram Sarabhai"
                }
            ]
            for exp in seed_experiments:
                db.add(QmlExperiment(**exp))
            db.commit()

    except Exception as e:  # noqa: BLE001
        logger.error(f"Error seeding DB: {e}")
        db.rollback()
    finally:
        db.close()

