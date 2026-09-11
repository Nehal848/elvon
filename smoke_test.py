"""Quick smoke test for quantum pipeline"""
import sys
sys.path.insert(0, ".")
from core.quantum.pipeline import load_benchmark_dataset, BiomedicalDataPipeline, apply_feature_engineering
from core.quantum import QuantumKernelClassifier, QMLBenchmarkingEngine, QuantumExplainabilityEngine

print("QML imports: OK")

# Quick smoke test
df, target_col = load_benchmark_dataset("breast_cancer")
print(f"Dataset loaded: {df.shape}, target=target")

pipe = BiomedicalDataPipeline(target_col='target', n_pca_components=4, n_selected_features=8, seed=42)
result = pipe.process(df)
print(f"Pipeline leakage_audit: {result['leakage_audit']['status']}")
print(f"X_train_classical shape: {result['X_train_classical'].shape}")

print("SMOKE TEST PASSED")
