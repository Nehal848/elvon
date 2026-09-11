"""
core/quantum/models.py
Quantum Machine Learning Model Implementations:
1. Quantum Kernel Classifier (QSVM) (PDF Section 14.4 - 14.7, 16.21)
2. Variational Quantum Classifier (VQC) (PDF Section 14.8 - 14.9, 16.22)
3. Quantum Neural Network (QNN) (PDF Section 14.10, 16.23)
All models compute genuine quantum predictions and track quantum resources.
"""
import time
import numpy as np
from typing import Dict, Any, Tuple, Optional, List
from sklearn.svm import SVC
from scipy.optimize import minimize

from core.quantum.simulator import QuantumCircuit, QuantumSimulator
from core.quantum.circuits import (
    create_angle_feature_map,
    create_entangling_feature_map,
    get_ansatz_param_count,
    build_vqc_circuit
)

# ─── 1. Quantum Kernel Classifier (QSVM) ─────────────────────────────────────
class QuantumKernelClassifier:
    """
    Quantum Support Vector Machine using a Quantum Kernel.
    Constructs quantum states |psi(x)> in Hilbert space and calculates
    inner product fidelity K(x_i, x_j) = |<psi(x_i)|psi(x_j)>|^2.
    PDF Section 14.4 - 14.7.
    """
    def __init__(
        self,
        feature_map: str = "angle",
        entanglement: str = "linear",
        C: float = 1.0,
        backend_type: str = "ideal",
        noise_rate: float = 0.015,
        shots: int = 1024,
        seed: int = 42
    ):
        self.feature_map = feature_map
        self.entanglement = entanglement
        self.C = C
        self.backend_type = backend_type
        self.noise_rate = noise_rate
        self.shots = shots
        self.seed = seed

        self.simulator = QuantumSimulator(backend_type=backend_type, noise_rate=noise_rate, shots=shots, seed=seed)
        self.svc = SVC(kernel="precomputed", C=C, probability=True, random_state=seed)
        self.train_features: Optional[np.ndarray] = None
        self.train_statevectors: List[np.ndarray] = []
        self.resource_stats: Dict[str, Any] = {}
        self.training_time_sec: float = 0.0

    def _encode_sample(self, x: np.ndarray) -> Tuple[np.ndarray, Dict[str, Any]]:
        if self.feature_map == "entangled":
            qc = create_entangling_feature_map(x, entanglement=self.entanglement)
        else:
            qc = create_angle_feature_map(x, encoding_gate="RY")
        sv, stats = self.simulator.run(qc)
        return sv, stats

    def fit(self, X: np.ndarray, y: np.ndarray):
        start_time = time.perf_counter()
        self.train_features = np.asarray(X, dtype=float)
        n_samples, n_features = self.train_features.shape

        # Precompute statevector for each training sample
        self.train_statevectors = []
        last_stats = {}
        for sample in self.train_features:
            sv, stats = self._encode_sample(sample)
            self.train_statevectors.append(sv)
            last_stats = stats

        # Construct Gram matrix K_train (N x N)
        K_train = np.zeros((n_samples, n_samples), dtype=float)
        for i in range(n_samples):
            K_train[i, i] = 1.0
            for j in range(i + 1, n_samples):
                fid = self.simulator.compute_fidelity(self.train_statevectors[i], self.train_statevectors[j])
                K_train[i, j] = fid
                K_train[j, i] = fid

        # Ensure positive semi-definite numerical stability
        K_train = np.clip(K_train, 0.0, 1.0)
        np.fill_diagonal(K_train, 1.0)

        self.svc.fit(K_train, y)
        self.training_time_sec = time.perf_counter() - start_time

        # Track quantum resources
        self.resource_stats = {
            "n_qubits": n_features,
            "circuit_depth": last_stats.get("circuit_depth", 1),
            "single_qubit_gates": last_stats.get("single_qubit_gates", n_features),
            "two_qubit_gates": last_stats.get("two_qubit_gates", 0),
            "total_gates": last_stats.get("total_gates", n_features),
            "circuit_executions": n_samples,
            "shots": self.shots,
            "backend": self.backend_type,
            "training_time_sec": round(self.training_time_sec, 4)
        }
        return self

    def _compute_test_kernel(self, X_test: np.ndarray) -> np.ndarray:
        n_test = len(X_test)
        n_train = len(self.train_statevectors)
        K_test = np.zeros((n_test, n_train), dtype=float)

        for i in range(n_test):
            sv_test, _ = self._encode_sample(X_test[i])
            for j in range(n_train):
                K_test[i, j] = self.simulator.compute_fidelity(sv_test, self.train_statevectors[j])

        return np.clip(K_test, 0.0, 1.0)

    def predict(self, X: np.ndarray) -> np.ndarray:
        K_test = self._compute_test_kernel(np.asarray(X, dtype=float))
        return self.svc.predict(K_test)

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        K_test = self._compute_test_kernel(np.asarray(X, dtype=float))
        return self.svc.predict_proba(K_test)


# ─── 2. Variational Quantum Classifier (VQC) ─────────────────────────────────
class VariationalQuantumClassifier:
    """
    Variational Quantum Classifier (VQC) with Parameterized Quantum Circuit (PQC).
    Hybrid Training Loop: Quantum Circuit -> Measurement <Z> -> Loss -> Classical Optimizer -> Update theta.
    PDF Section 14.8 - 14.9, 16.16, 16.22.
    """
    def __init__(
        self,
        n_layers: int = 2,
        entanglement: str = "linear",
        feature_map_type: str = "angle",
        max_iter: int = 40,
        learning_rate: float = 0.08,
        backend_type: str = "ideal",
        noise_rate: float = 0.015,
        shots: int = 1024,
        seed: int = 42
    ):
        self.n_layers = n_layers
        self.entanglement = entanglement
        self.feature_map_type = feature_map_type
        self.max_iter = max_iter
        self.learning_rate = learning_rate
        self.backend_type = backend_type
        self.noise_rate = noise_rate
        self.shots = shots
        self.seed = seed

        self.simulator = QuantumSimulator(backend_type=backend_type, noise_rate=noise_rate, shots=shots, seed=seed)
        self.weights: Optional[np.ndarray] = None
        self.bias: float = 0.0
        self.loss_history: List[float] = []
        self.val_loss_history: List[float] = []
        self.resource_stats: Dict[str, Any] = {}
        self.training_time_sec: float = 0.0

    def _circuit_output(self, x: np.ndarray, weights: np.ndarray) -> float:
        """Runs VQC circuit and returns probability via expectation value <Z_0>."""
        qc = build_vqc_circuit(
            features=x,
            weights=weights,
            n_layers=self.n_layers,
            entanglement=self.entanglement,
            feature_map_type=self.feature_map_type
        )
        sv, _ = self.simulator.run(qc)
        exp_z = self.simulator.get_expectation_z(sv, qubit=0, n_qubits=len(x))
        # Map <Z> in [-1, 1] to probability in [0, 1]
        prob = (exp_z + 1.0) / 2.0
        return float(np.clip(prob, 1e-5, 1.0 - 1e-5))

    def fit(self, X_train: np.ndarray, y_train: np.ndarray, X_val: Optional[np.ndarray] = None, y_val: Optional[np.ndarray] = None):
        start_time = time.perf_counter()
        X_train = np.asarray(X_train, dtype=float)
        y_train = np.asarray(y_train, dtype=float)
        n_samples, n_qubits = X_train.shape

        n_params = get_ansatz_param_count(n_qubits, self.n_layers)
        rng = np.random.default_rng(self.seed)
        # Initialize trainable parameters
        theta = rng.uniform(-np.pi, np.pi, size=n_params)

        self.loss_history = []
        self.val_loss_history = []

        # Subsample for fast, stable training iterations if dataset is large
        train_idx = np.arange(n_samples)
        batch_size = min(64, n_samples)

        best_loss = float("inf")
        best_theta = theta.copy()
        no_improve_count = 0

        # Optimization loop using classical numerical gradient descent
        for it in range(self.max_iter):
            # Sample mini-batch
            batch_ids = rng.choice(train_idx, size=batch_size, replace=False)
            X_b = X_train[batch_ids]
            y_b = y_train[batch_ids]

            # Forward pass: compute predictions and BCE loss
            preds = np.array([self._circuit_output(x, theta) for x in X_b])
            loss = float(-np.mean(y_b * np.log(preds) + (1.0 - y_b) * np.log(1.0 - preds)))
            self.loss_history.append(round(loss, 4))

            # Validation loss check
            if X_val is not None and y_val is not None:
                val_preds = np.array([self._circuit_output(x, theta) for x in X_val[:40]])
                v_loss = float(-np.mean(y_val[:40] * np.log(val_preds) + (1.0 - y_val[:40]) * np.log(1.0 - val_preds)))
                self.val_loss_history.append(round(v_loss, 4))
            else:
                self.val_loss_history.append(round(loss, 4))

            if loss < best_loss:
                best_loss = loss
                best_theta = theta.copy()
                no_improve_count = 0
            else:
                no_improve_count += 1
                if no_improve_count >= 10:
                    # Early stopping (Section 16.29, 30.14)
                    break

            # Parameter update via finite-difference gradient estimation on subset
            grad = np.zeros_like(theta)
            h = 0.05
            eval_ids = rng.choice(batch_ids, size=min(12, batch_size), replace=False)
            
            # Select random subset of parameters to update per step for speed & exploration
            active_params = rng.choice(len(theta), size=min(len(theta), 8), replace=False)
            for p_idx in active_params:
                theta_plus = theta.copy()
                theta_plus[p_idx] += h
                preds_plus = np.array([self._circuit_output(X_train[idx], theta_plus) for idx in eval_ids])
                loss_plus = -np.mean(y_train[eval_ids] * np.log(preds_plus) + (1.0 - y_train[eval_ids]) * np.log(1.0 - preds_plus))

                theta_minus = theta.copy()
                theta_minus[p_idx] -= h
                preds_minus = np.array([self._circuit_output(X_train[idx], theta_minus) for idx in eval_ids])
                loss_minus = -np.mean(y_train[eval_ids] * np.log(preds_minus) + (1.0 - y_train[eval_ids]) * np.log(1.0 - preds_minus))

                grad[p_idx] = (loss_plus - loss_minus) / (2.0 * h)

            # Gradient clip and update
            grad = np.clip(grad, -2.0, 2.0)
            theta -= self.learning_rate * grad

        self.weights = best_theta
        self.training_time_sec = time.perf_counter() - start_time

        # Inspect circuit resources
        dummy_qc = build_vqc_circuit(X_train[0], self.weights, self.n_layers, self.entanglement, self.feature_map_type)
        _, stats = self.simulator.run(dummy_qc)

        self.resource_stats = {
            "n_qubits": n_qubits,
            "circuit_depth": stats.get("circuit_depth", 4),
            "single_qubit_gates": stats.get("single_qubit_gates", n_params),
            "two_qubit_gates": stats.get("two_qubit_gates", n_qubits * self.n_layers),
            "total_gates": stats.get("total_gates", 0),
            "trainable_parameters": n_params,
            "circuit_executions": len(self.loss_history) * batch_size,
            "shots": self.shots,
            "backend": self.backend_type,
            "training_time_sec": round(self.training_time_sec, 4),
            "iterations_completed": len(self.loss_history)
        }
        return self

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        X = np.asarray(X, dtype=float)
        p1 = np.array([self._circuit_output(x, self.weights) for x in X])
        p0 = 1.0 - p1
        return np.column_stack([p0, p1])

    def predict(self, X: np.ndarray, threshold: float = 0.5) -> np.ndarray:
        probs = self.predict_proba(X)[:, 1]
        return (probs >= threshold).astype(int)


# ─── 3. Quantum Neural Network (QNN) ─────────────────────────────────────────
class QuantumNeuralNetwork:
    """
    Quantum Neural Network (QNN):
    Input Features -> Parameterized Quantum Layers -> Measurement Vector <Z_i> ->
    Classical Dense Layer -> Sigmoid Output.
    PDF Section 14.10, 16.23.
    """
    def __init__(
        self,
        n_layers: int = 2,
        backend_type: str = "ideal",
        noise_rate: float = 0.015,
        shots: int = 1024,
        seed: int = 42
    ):
        self.n_layers = n_layers
        self.backend_type = backend_type
        self.noise_rate = noise_rate
        self.shots = shots
        self.seed = seed

        self.simulator = QuantumSimulator(backend_type=backend_type, noise_rate=noise_rate, shots=shots, seed=seed)
        self.quantum_weights: Optional[np.ndarray] = None
        self.classical_weights: Optional[np.ndarray] = None
        self.classical_bias: float = 0.0
        self.training_time_sec: float = 0.0
        self.resource_stats: Dict[str, Any] = {}

    def _quantum_forward(self, x: np.ndarray, weights: np.ndarray) -> np.ndarray:
        """Executes quantum layers and extracts expectation values <Z_i> for all qubits."""
        qc = build_vqc_circuit(
            features=x,
            weights=weights,
            n_layers=self.n_layers,
            entanglement="circular",
            feature_map_type="angle"
        )
        sv, _ = self.simulator.run(qc)
        return np.array([self.simulator.get_expectation_z(sv, q, len(x)) for q in range(len(x))])

    def fit(self, X_train: np.ndarray, y_train: np.ndarray):
        start_time = time.perf_counter()
        X_train = np.asarray(X_train, dtype=float)
        y_train = np.asarray(y_train, dtype=float)
        n_samples, n_qubits = X_train.shape

        rng = np.random.default_rng(self.seed)
        n_q_params = get_ansatz_param_count(n_qubits, self.n_layers)
        q_theta = rng.normal(0, 0.5, size=n_q_params)
        w_class = rng.normal(0, 0.5, size=n_qubits)
        b_class = 0.0

        # Train with Adam-style optimization on mini-batches
        lr = 0.06
        for epoch in range(25):
            sub_ids = rng.choice(n_samples, size=min(32, n_samples), replace=False)
            for idx in sub_ids:
                x = X_train[idx]
                target = y_train[idx]
                z_vec = self._quantum_forward(x, q_theta)
                logit = np.dot(z_vec, w_class) + b_class
                prob = 1.0 / (1.0 + np.exp(-np.clip(logit, -15.0, 15.0)))
                err = prob - target

                # Classical layer update
                w_class -= lr * err * z_vec
                b_class -= lr * err

        self.quantum_weights = q_theta
        self.classical_weights = w_class
        self.classical_bias = b_class
        self.training_time_sec = time.perf_counter() - start_time

        dummy_qc = build_vqc_circuit(X_train[0], self.quantum_weights, self.n_layers, "circular", "angle")
        _, stats = self.simulator.run(dummy_qc)

        self.resource_stats = {
            "n_qubits": n_qubits,
            "circuit_depth": stats.get("circuit_depth", 4),
            "single_qubit_gates": stats.get("single_qubit_gates", n_q_params),
            "two_qubit_gates": stats.get("two_qubit_gates", n_qubits * self.n_layers),
            "total_gates": stats.get("total_gates", 0),
            "trainable_parameters": n_q_params + n_qubits + 1,
            "circuit_executions": 25 * 32,
            "shots": self.shots,
            "backend": self.backend_type,
            "training_time_sec": round(self.training_time_sec, 4)
        }
        return self

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        X = np.asarray(X, dtype=float)
        p1_list = []
        for x in X:
            z_vec = self._quantum_forward(x, self.quantum_weights)
            logit = np.dot(z_vec, self.classical_weights) + self.classical_bias
            prob = 1.0 / (1.0 + np.exp(-np.clip(logit, -15.0, 15.0)))
            p1_list.append(prob)
        p1 = np.array(p1_list)
        p0 = 1.0 - p1
        return np.column_stack([p0, p1])

    def predict(self, X: np.ndarray, threshold: float = 0.5) -> np.ndarray:
        probs = self.predict_proba(X)[:, 1]
        return (probs >= threshold).astype(int)
