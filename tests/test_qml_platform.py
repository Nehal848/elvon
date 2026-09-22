"""
tests/test_qml_platform.py
Comprehensive unit & integration test suite for the
Hybrid Quantum Machine Learning Platform for Early Disease Detection (Problem Statement ID: 26139).
"""
import sys
from pathlib import Path

_PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

import numpy as np
from fastapi.testclient import TestClient

from app.main import app
from core.quantum.models import QuantumKernelClassifier, VariationalQuantumClassifier
from core.quantum.pipeline import (
    BiomedicalDataPipeline,
    load_benchmark_dataset,
    profile_biomedical_dataset,
)
from core.quantum.simulator import (
    HardwareReadinessChecker,
    QuantumCircuit,
    QuantumSimulator,
)

client = TestClient(app)

# ─── 1. Simulator & Circuit Tests ────────────────────────────────────────────
def test_quantum_circuit_creation_and_resources():
    qc = QuantumCircuit(4)
    qc.h(0).ry(1, 0.5).cnot(0, 1).cz(1, 2)
    stats = qc.get_resource_summary()
    assert stats["n_qubits"] == 4
    assert stats["single_qubit_gates"] == 2
    assert stats["two_qubit_gates"] == 2
    assert stats["circuit_depth"] >= 2

def test_quantum_simulator_ideal_and_expectation():
    sim = QuantumSimulator(backend_type="ideal")
    qc = QuantumCircuit(2)
    # Put qubit 0 in |0>, qubit 1 in |1>
    qc.x(1)
    sv, stats = sim.run(qc)  # noqa: RUF059
    assert np.isclose(np.linalg.norm(sv), 1.0)
    # <Z_0> should be +1.0, <Z_1> should be -1.0
    exp_0 = sim.get_expectation_z(sv, qubit=0, n_qubits=2)
    exp_1 = sim.get_expectation_z(sv, qubit=1, n_qubits=2)
    assert np.isclose(exp_0, 1.0, atol=1e-3)
    assert np.isclose(exp_1, -1.0, atol=1e-3)

def test_quantum_simulator_noisy():
    sim_noisy = QuantumSimulator(backend_type="noisy", noise_rate=0.05, shots=500, seed=42)
    qc = QuantumCircuit(2)
    qc.h(0).cnot(0, 1)
    sv, stats = sim_noisy.run(qc)
    assert stats["backend"] == "noisy"
    assert stats["noise_rate"] == 0.05
    assert len(sv) == 4

def test_hardware_readiness_checker():
    qc = QuantumCircuit(4)
    for i in range(4):
        qc.ry(i, 0.1)
    for i in range(3):
        qc.cnot(i, i + 1)
    report = HardwareReadinessChecker.evaluate_circuit(qc, "simulator_ideal")
    assert report["readiness_score"] == 100
    assert report["status"] == "READY FOR EXECUTION"

# ─── 2. Data Pipeline & Leakage Prevention Tests ─────────────────────────────
def test_dataset_loading_and_profiling():
    df, target = load_benchmark_dataset("heart_disease")
    assert len(df) == 303
    assert target == "target"
    profile = profile_biomedical_dataset(df, target)
    assert profile["n_samples"] == 303
    assert profile["data_quality_score"] > 80.0
    assert profile["validation_status"] == "PASSED"

def test_pipeline_zero_leakage_and_transforms():
    df, target = load_benchmark_dataset("heart_disease")
    pipeline = BiomedicalDataPipeline(target_col=target, n_pca_components=4, seed=42)
    res = pipeline.process(df)

    # Check leakage audit
    audit = res["leakage_audit"]
    assert audit["status"] == "VERIFIED_ZERO_LEAKAGE"
    assert "PASSED" in audit["scaler_isolation"]
    assert "PASSED" in audit["pca_isolation"]

    # Check dimensions
    assert res["X_train_quantum"].shape[1] == 4
    assert res["X_test_quantum"].shape[1] == 4
    assert len(res["pca_component_mapping"]) == 4

    # Test single-sample transformation consistency
    sample = df.iloc[0].to_dict()
    x_c, x_q = pipeline.transform_new_sample(sample)  # noqa: RUF059
    assert len(x_q) == 4

# ─── 3. QML Models & Benchmarking Tests ──────────────────────────────────────
def test_quantum_kernel_classifier():
    X_train = np.array([[0.2, 0.4], [0.8, 0.9], [0.1, 0.3], [0.7, 0.85]])
    y_train = np.array([0, 1, 0, 1])
    q_kernel = QuantumKernelClassifier(feature_map="angle", C=1.0, seed=42)
    q_kernel.fit(X_train, y_train)

    X_test = np.array([[0.15, 0.35], [0.75, 0.8]])
    preds = q_kernel.predict(X_test)
    probas = q_kernel.predict_proba(X_test)
    assert len(preds) == 2
    assert probas.shape == (2, 2)
    assert np.allclose(probas.sum(axis=1), 1.0)

def test_vqc_classifier():
    X_train = np.array([[0.2, 0.4], [0.8, 0.9], [0.1, 0.3], [0.7, 0.85]])
    y_train = np.array([0, 1, 0, 1])
    vqc = VariationalQuantumClassifier(n_layers=1, max_iter=5, seed=42)
    vqc.fit(X_train, y_train)
    preds = vqc.predict(X_train)
    assert len(preds) == 4
    assert len(vqc.loss_history) > 0

# ─── 4. End-to-End API Tests ─────────────────────────────────────────────────
def test_api_qml_endpoints():
    # 1. Datasets
    r = client.get("/api/qml/datasets")
    assert r.status_code == 200
    assert len(r.json()["benchmark_datasets"]) >= 3

    # 2. Hardware Status
    r = client.get("/api/qml/hardware/status")
    assert r.status_code == 200
    assert "simulator_ideal" in r.json()["backends"]

    # 3. Experiment Run
    r_exp = client.post("/api/qml/experiment/run", json={
        "dataset_name": "heart_disease",
        "n_pca_components": 4,
        "n_selected_features": 8,
        "backend_type": "ideal",
        "vqc_iterations": 5,
        "seed": 42
    })
    assert r_exp.status_code == 200
    data = r_exp.json()
    exp_id = data["experiment_id"]
    assert "benchmark" in data
    assert "classical_champion" in data["benchmark"]
    assert "quantum_champion" in data["benchmark"]

    # 4. Predict
    sample = {
        "age": 52, "sex": 1, "chest_pain_type": 1, "resting_bp": 125, "cholesterol": 210,
        "fasting_blood_sugar": 0, "rest_ecg": 0, "max_heart_rate": 160, "exercise_angina": 0,
        "st_depression": 0.5, "st_slope": 1, "num_major_vessels": 0, "thalassemia": 2
    }
    r_pred = client.post("/api/qml/predict", json={
        "experiment_id": exp_id,
        "model_name": "Quantum Kernel (QSVM)",
        "sample_values": sample
    })
    assert r_pred.status_code == 200
    pred_res = r_pred.json()
    assert "predicted_class" in pred_res
    assert "prediction_score" in pred_res

    # 5. Explain
    r_exp_xai = client.post("/api/qml/explain", json={
        "experiment_id": exp_id,
        "model_name": "Quantum Kernel (QSVM)",
        "sample_values": sample
    })
    assert r_exp_xai.status_code == 200
    xai_res = r_exp_xai.json()
    assert "component_sensitivities" in xai_res


def run_all_tests():
    print("=" * 70)
    print(" Running Quantum ML Platform Test Suite (SIH 26139)")
    print("=" * 70)
    test_quantum_circuit_creation_and_resources()
    print("  [OK] Circuit creation and resource summary")
    test_quantum_simulator_ideal_and_expectation()
    print("  [OK] Ideal simulator and expectation values")
    test_quantum_simulator_noisy()
    print("  [OK] Noisy simulator execution")
    test_hardware_readiness_checker()
    print("  [OK] Hardware readiness checker")
    test_dataset_loading_and_profiling()
    print("  [OK] Dataset loading and profiling")
    test_pipeline_zero_leakage_and_transforms()
    print("  [OK] Pipeline zero leakage and transforms")
    test_quantum_kernel_classifier()
    print("  [OK] Quantum Kernel (QSVM) classifier")
    test_vqc_classifier()
    print("  [OK] Variational Quantum Classifier (VQC)")
    test_api_qml_endpoints()
    print("  [OK] End-to-end QML API endpoints")
    print("=" * 70)
    print(" >>> ALL QML TESTS PASSED SUCCESSFULLY! (100% GREEN) <<<")
    print("=" * 70)


if __name__ == "__main__":
    run_all_tests()
