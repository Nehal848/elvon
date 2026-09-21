"""
core/quantum/circuits.py
Quantum Feature Maps & Variational Circuit Architectures
Supports:
- Angle Encoding (RY, RZ) (PDF Section 15.5)
- Entangling Feature Map (IQP-style interactions) (PDF Section 15.10)
- Parameterized Variational Ansatz (RealAmplitudes & EfficientSU2) (PDF Section 14.9, 14.11)
- Linear and Circular Entanglement Topologies (PDF Section 22.18)
"""

import numpy as np

from core.quantum.simulator import QuantumCircuit


def create_angle_feature_map(features: np.ndarray, encoding_gate: str = "RY") -> QuantumCircuit:
    """
    Angle Encoding: Maps each numerical feature x_i to rotation angle of qubit i.
    PDF Section 15.5: x_i -> RY(x_i) -> Qubit i
    """
    n_qubits = len(features)
    qc = QuantumCircuit(n_qubits)
    gate = encoding_gate.upper()
    for i, val in enumerate(features):
        theta = float(val)
        if gate == "RX":
            qc.rx(i, theta)
        elif gate == "RZ":
            qc.rz(i, theta)
        else:
            qc.ry(i, theta)
    return qc

def create_entangling_feature_map(features: np.ndarray, entanglement: str = "linear", reps: int = 1) -> QuantumCircuit:
    """
    Entangling Feature Map: Creates superposition, encodes features, and establishes
    correlations between features in Hilbert space (PDF Section 15.10).
    """
    n_qubits = len(features)
    qc = QuantumCircuit(n_qubits)

    for _ in range(reps):
        # 1. Superposition
        for i in range(n_qubits):
            qc.h(i)
        # 2. Angle Encoding
        for i, val in enumerate(features):
            qc.ry(i, float(val))
        # 3. Entanglement
        if n_qubits > 1:
            for i in range(n_qubits - 1):
                qc.cnot(i, i + 1)
            if entanglement.lower() == "circular" and n_qubits > 2:
                qc.cnot(n_qubits - 1, 0)
    return qc

def get_ansatz_param_count(n_qubits: int, n_layers: int = 2) -> int:
    """
    Calculates number of trainable parameters for RealAmplitudes ansatz.
    (L + 1) layers of RY rotations on n qubits = (n_layers + 1) * n_qubits.
    """
    return (n_layers + 1) * n_qubits

def build_vqc_circuit(
    features: np.ndarray,
    weights: np.ndarray,
    n_layers: int = 2,
    entanglement: str = "linear",
    feature_map_type: str = "angle"
) -> QuantumCircuit:
    """
    Builds complete Variational Quantum Classifier (VQC) circuit:
    Input Features -> Quantum Feature Map -> Parameterized Ansatz -> Measurement
    PDF Section 14.8, 14.9, 14.11
    """
    n_qubits = len(features)
    expected_params = get_ansatz_param_count(n_qubits, n_layers)
    if len(weights) != expected_params:
        raise ValueError(f"Expected {expected_params} parameters for {n_qubits} qubits and {n_layers} layers, got {len(weights)}")

    # 1. Build Feature Map
    if feature_map_type.lower() == "entangled":
        qc = create_entangling_feature_map(features, entanglement=entanglement)
    else:
        qc = create_angle_feature_map(features, encoding_gate="RY")

    # 2. Append Parameterized Ansatz Layers
    param_idx = 0
    # Initial rotation layer
    for q in range(n_qubits):
        qc.ry(q, float(weights[param_idx]))
        param_idx += 1

    # Variational layers (Entanglement + Rotations)
    for layer in range(n_layers):
        # Entanglement
        if n_qubits > 1:
            for q in range(n_qubits - 1):
                qc.cnot(q, q + 1)
            if entanglement.lower() == "circular" and n_qubits > 2:
                qc.cnot(n_qubits - 1, 0)

        # Trainable rotations
        for q in range(n_qubits):
            qc.ry(q, float(weights[param_idx]))
            param_idx += 1

    return qc
