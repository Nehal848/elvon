import os
import json
import logging
from pathlib import Path
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker
from config import DATABASE_URL, BASE_DIR

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
                with test_engine.connect() as conn:
                    pass
                logger.info("Connected to PostgreSQL database successfully.")
                return test_engine
            else:
                logger.warning("PostgreSQL driver (psycopg2/psycopg) not installed. Falling back to local SQLite.")
        except Exception as e:
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
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    phase = Column(String, nullable=False)
    role = Column(String, nullable=False)

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
    if obj is None: return None
    return json.dumps(obj)

def deserialize(obj_str, default=None):
    if not obj_str: return default
    try:
        return json.loads(obj_str)
    except:
        return default

def init_db():
    Base.metadata.create_all(bind=engine)

