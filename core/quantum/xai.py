"""
core/quantum/xai.py
Explainable AI (XAI) Engine for Hybrid Quantum-Classical Disease Detection:
1. Classical Feature Importance & Directional Attribution (PDF Section 18.5 - 18.7)
2. QML Feature Perturbation & Sensitivity Analysis (PDF Section 18.12 - 18.13, 33.6)
3. PCA Component Reverse-Attribution (PDF Section 18.9, 33.9)
4. Quantum Circuit Structural Transparency (PDF Section 18.14, 33.5)
5. Clinical Responsibility & Safety Boundaries (PDF Section 18.15, 33.8)
"""
import numpy as np
from typing import Dict, Any, List, Optional

class QuantumExplainabilityEngine:
    """
    Unified Explainability Engine providing transparent, model-specific interpretations
    without overstepping clinical boundaries.
    """
    def __init__(self, pipeline_data: Dict[str, Any]):
        self.pipeline_data = pipeline_data
        self.pca_mapping = pipeline_data.get("pca_component_mapping", [])
        self.selected_features = pipeline_data.get("selected_features", [])

    def explain_classical_model(self, model: Any, model_name: str, feature_vector: np.ndarray) -> Dict[str, Any]:
        """
        Generates feature attribution for classical models (coefficients, tree importance).
        """
        n_features = len(self.selected_features)
        importances = []

        if hasattr(model, "feature_importances_"):
            # Random Forest / Tree models
            raw_imp = model.feature_importances_
            for i, feat in enumerate(self.selected_features[:len(raw_imp)]):
                importances.append({
                    "feature": feat,
                    "importance": round(float(raw_imp[i]), 4),
                    "impact": "positive" if raw_imp[i] > 0.05 else "neutral"
                })
        elif hasattr(model, "coef_"):
            # Logistic Regression / Linear SVM
            coef = model.coef_[0]
            for i, feat in enumerate(self.selected_features[:len(coef)]):
                val = float(coef[i])
                importances.append({
                    "feature": feat,
                    "importance": round(abs(val), 4),
                    "direction": "increases_risk" if val > 0 else "decreases_risk",
                    "impact": "positive" if val > 0 else "negative"
                })
        else:
            # Fallback based on pipeline mutual information
            ranking = self.pipeline_data.get("feature_importance_ranking", {})
            for feat in self.selected_features:
                imp = ranking.get(feat, 0.05)
                importances.append({
                    "feature": feat,
                    "importance": imp,
                    "impact": "positive" if imp > 0.05 else "neutral"
                })

        importances.sort(key=lambda x: x["importance"], reverse=True)

        return {
            "model_type": "Classical ML",
            "model_name": model_name,
            "explanation_method": "Feature Importance & Weight Attribution",
            "feature_attributions": importances,
            "summary": f"Top influential feature for this prediction is '{importances[0]['feature'] if importances else 'N/A'}'",
            "clinical_disclaimer": "Computational attribution describes model behavior under experimental data, not biological causation."
        }

    def explain_qml_model(self, qml_model: Any, model_name: str, quantum_vector: np.ndarray) -> Dict[str, Any]:
        r"""
        Generates perturbation-based sensitivity analysis for Quantum Machine Learning models.
        Systematically perturbs each quantum component by +delta and measures \Delta <Z>.
        PDF Section 18.12 - 18.13, 33.6.
        """
        x_orig = np.asarray(quantum_vector, dtype=float)
        base_proba = float(qml_model.predict_proba(np.array([x_orig]))[0, 1])

        delta = 0.25  # 0.25 rad perturbation
        perturbation_results = []

        for i in range(len(x_orig)):
            # Positive perturbation
            x_plus = x_orig.copy()
            x_plus[i] += delta
            prob_plus = float(qml_model.predict_proba(np.array([x_plus]))[0, 1])

            # Negative perturbation
            x_minus = x_orig.copy()
            x_minus[i] -= delta
            prob_minus = float(qml_model.predict_proba(np.array([x_minus]))[0, 1])

            sensitivity = round(abs(prob_plus - prob_minus) / (2.0 * delta), 4)
            comp_name = f"PC{i + 1}"

            # Map to original clinical features via PCA loadings
            original_contributors = "N/A"
            if i < len(self.pca_mapping):
                top_feats = self.pca_mapping[i].get("top_biomedical_features", [])
                original_contributors = ", ".join([f["feature"] for f in top_feats[:2]])

            direction = "increases_risk" if prob_plus > base_proba else "decreases_risk"

            perturbation_results.append({
                "component": comp_name,
                "sensitivity_score": sensitivity,
                "direction": direction,
                "mapped_clinical_features": original_contributors,
                "delta_output": round(prob_plus - base_proba, 4)
            })

        perturbation_results.sort(key=lambda x: x["sensitivity_score"], reverse=True)

        return {
            "model_type": "Hybrid QML",
            "model_name": model_name,
            "explanation_method": "Input Perturbation & Quantum Expectation Sensitivity",
            "component_sensitivities": perturbation_results,
            "quantum_resources": getattr(qml_model, "resource_stats", {}),
            "circuit_transparency": {
                "qubits_used": len(x_orig),
                "encoding_type": getattr(qml_model, "feature_map_type", "Angle Encoding (RY)"),
                "backend": getattr(qml_model, "backend_type", "simulator")
            },
            "summary": f"Quantum circuit output is most sensitive to variations in {perturbation_results[0]['component']} (linked to {perturbation_results[0]['mapped_clinical_features']})",
            "clinical_disclaimer": "Quantum sensitivity reflects gradient change in Hilbert space expectation values; it does not indicate clinical etiology."
        }
