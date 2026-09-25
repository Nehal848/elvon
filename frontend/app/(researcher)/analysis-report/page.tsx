"use client"

import React, { useState } from "react"
import HospitalLayout from "@/components/hospital-layout"
import { 
  BarChart2, Shield, Activity, Target, BrainCircuit,
  Zap, Clock, Layers, ArrowRight, Check, FileText,
  AlertTriangle, CheckCircle2, ChevronDown, Database,
  Settings, ScatterChart, ShieldAlert, Cpu, Sparkles, Filter
} from "lucide-react"

// Model analysis dataset for all platform models
interface ModelAnalysisData {
  id: string
  name: string
  type: "Hybrid QML" | "Classical ML"
  features: { label: string; val: number; valText: string }[]
  explanation: string
  explanationMethod: string
  falsePositives: number
  falseNegatives: number
  correctPredictions: number
  totalSamples: number
  quantumConfig: {
    model: string
    encoding: string
    qubits: string
    circuitDepth: string
    gateCount: string
    shots: string
    backend: string
    backendDetail: string
  }
}

const MODEL_DATA: Record<string, ModelAnalysisData> = {
  qsvm: {
    id: "qsvm",
    name: "QSVM (Quantum Support Vector Machine)",
    type: "Hybrid QML",
    features: [
      { label: "mean radius", val: 80, valText: "0.23" },
      { label: "worst perimeter", val: 68, valText: "0.19" },
      { label: "mean texture", val: 50, valText: "0.14" },
      { label: "worst radius", val: 42, valText: "0.12" },
      { label: "mean concavity", val: 32, valText: "0.09" },
      { label: "radius error", val: 25, valText: "0.07" },
    ],
    explanationMethod: "Quantum Kernel Gram Matrix Projection",
    explanation: "Feature importance values are extracted via quantum kernel Gram matrix sensitivity mapping in Hilbert statevector space.",
    falsePositives: 8,
    falseNegatives: 5,
    correctPredictions: 527,
    totalSamples: 540,
    quantumConfig: {
      model: "QSVM",
      encoding: "Angle / ZZ-FeatureMap",
      qubits: "8",
      circuitDepth: "6",
      gateCount: "42",
      shots: "1024",
      backend: "Simulator",
      backendDetail: "Aer Statevector Simulator",
    }
  },
  vqc: {
    id: "vqc",
    name: "VQC (Variational Quantum Classifier)",
    type: "Hybrid QML",
    features: [
      { label: "worst perimeter", val: 78, valText: "0.22" },
      { label: "mean radius", val: 72, valText: "0.20" },
      { label: "mean concave points", val: 56, valText: "0.16" },
      { label: "worst texture", val: 45, valText: "0.13" },
      { label: "worst area", val: 35, valText: "0.10" },
      { label: "mean texture", val: 22, valText: "0.06" },
    ],
    explanationMethod: "Parameter Shift Rule Gradient Attributions",
    explanation: "Feature importance computed via variational circuit expectation value gradients with respect to Ansatz rotation angles.",
    falsePositives: 11,
    falseNegatives: 7,
    correctPredictions: 522,
    totalSamples: 540,
    quantumConfig: {
      model: "VQC (RealAmplitudes)",
      encoding: "PauliFeatureMap",
      qubits: "8",
      circuitDepth: "8",
      gateCount: "58",
      shots: "2048",
      backend: "Simulator",
      backendDetail: "Qiskit Aer GPU Backend",
    }
  },
  qkernel: {
    id: "qkernel",
    name: "Quantum Kernel SVM",
    type: "Hybrid QML",
    features: [
      { label: "mean radius", val: 76, valText: "0.21" },
      { label: "worst radius", val: 66, valText: "0.18" },
      { label: "worst concavity", val: 52, valText: "0.15" },
      { label: "mean perimeter", val: 44, valText: "0.12" },
      { label: "mean compactness", val: 34, valText: "0.09" },
      { label: "texture error", val: 26, valText: "0.07" },
    ],
    explanationMethod: "Quantum Fidelity Kernel Estimation",
    explanation: "Evaluates quantum fidelity overlaps between test states and training quantum embedding vectors in feature Fock space.",
    falsePositives: 9,
    falseNegatives: 6,
    correctPredictions: 525,
    totalSamples: 540,
    quantumConfig: {
      model: "Quantum Kernel SVM",
      encoding: "ZZFeatureMap (Entangled)",
      qubits: "8",
      circuitDepth: "7",
      gateCount: "48",
      shots: "1024",
      backend: "Simulator",
      backendDetail: "IBM Quantum Aer Simulator",
    }
  },
  qnn: {
    id: "qnn",
    name: "Quantum Neural Network (QNN)",
    type: "Hybrid QML",
    features: [
      { label: "mean concavity", val: 82, valText: "0.24" },
      { label: "worst perimeter", val: 70, valText: "0.20" },
      { label: "mean radius", val: 54, valText: "0.15" },
      { label: "worst area", val: 40, valText: "0.11" },
      { label: "mean texture", val: 32, valText: "0.09" },
      { label: "compactness error", val: 24, valText: "0.07" },
    ],
    explanationMethod: "Layer-wise Relevance Quantum Propagation",
    explanation: "Integrated gradients propagated backwards through parameterized quantum layers and classical linear heads.",
    falsePositives: 7,
    falseNegatives: 6,
    correctPredictions: 527,
    totalSamples: 540,
    quantumConfig: {
      model: "Hybrid QNN (TorchConnector)",
      encoding: "Angle + Entangling Layers",
      qubits: "10",
      circuitDepth: "12",
      gateCount: "86",
      shots: "4096",
      backend: "Simulator",
      backendDetail: "PennyLane Default Qubit",
    }
  },
  random_forest: {
    id: "random_forest",
    name: "Random Forest Classifier",
    type: "Classical ML",
    features: [
      { label: "worst radius", val: 85, valText: "0.25" },
      { label: "worst perimeter", val: 75, valText: "0.22" },
      { label: "mean concave points", val: 58, valText: "0.17" },
      { label: "worst area", val: 48, valText: "0.14" },
      { label: "mean radius", val: 36, valText: "0.10" },
      { label: "worst texture", val: 24, valText: "0.07" },
    ],
    explanationMethod: "Mean Decrease in Impurity (Gini) & TreeSHAP",
    explanation: "TreeSHAP calculates exact additive Shapley feature attributions averaged over 500 decision trees in the ensemble.",
    falsePositives: 6,
    falseNegatives: 4,
    correctPredictions: 530,
    totalSamples: 540,
    quantumConfig: {
      model: "Random Forest (500 Trees)",
      encoding: "Direct Tabular Scaling",
      qubits: "N/A (Classical)",
      circuitDepth: "N/A",
      gateCount: "N/A",
      shots: "N/A",
      backend: "CPU Multi-Core",
      backendDetail: "Scikit-Learn parallel joblib",
    }
  },
  xgboost: {
    id: "xgboost",
    name: "XGBoost Gradient Booster",
    type: "Classical ML",
    features: [
      { label: "worst perimeter", val: 88, valText: "0.26" },
      { label: "mean concave points", val: 74, valText: "0.21" },
      { label: "worst radius", val: 55, valText: "0.16" },
      { label: "mean texture", val: 42, valText: "0.12" },
      { label: "worst area", val: 32, valText: "0.09" },
      { label: "smoothness error", val: 22, valText: "0.06" },
    ],
    explanationMethod: "Fast TreeSHAP & Gain Contribution",
    explanation: "Measures average gain improvement brought by each feature across all split nodes throughout gradient boosted rounds.",
    falsePositives: 5,
    falseNegatives: 4,
    correctPredictions: 531,
    totalSamples: 540,
    quantumConfig: {
      model: "XGBoost v2.0 (Hist Gradient)",
      encoding: "Direct Tabular Vector",
      qubits: "N/A (Classical)",
      circuitDepth: "N/A",
      gateCount: "N/A",
      shots: "N/A",
      backend: "GPU CUDA Accelerated",
      backendDetail: "XGBoost Native C++ Engine",
    }
  },
  lightgbm: {
    id: "lightgbm",
    name: "LightGBM Classifier",
    type: "Classical ML",
    features: [
      { label: "worst area", val: 82, valText: "0.24" },
      { label: "worst perimeter", val: 70, valText: "0.20" },
      { label: "mean radius", val: 56, valText: "0.16" },
      { label: "mean texture", val: 45, valText: "0.13" },
      { label: "worst concavity", val: 34, valText: "0.10" },
      { label: "concave points error", val: 24, valText: "0.07" },
    ],
    explanationMethod: "Leaf-wise Split Feature Importance",
    explanation: "Computed via LightGBM GOSS (Gradient-based One-Side Sampling) split frequency and loss reduction values.",
    falsePositives: 6,
    falseNegatives: 5,
    correctPredictions: 529,
    totalSamples: 540,
    quantumConfig: {
      model: "LightGBM (GOSS)",
      encoding: "Direct Tabular Vector",
      qubits: "N/A (Classical)",
      circuitDepth: "N/A",
      gateCount: "N/A",
      shots: "N/A",
      backend: "CPU Multi-Core",
      backendDetail: "LightGBM OpenMP Threadpool",
    }
  },
  svm_classical: {
    id: "svm_classical",
    name: "Support Vector Machine (Classical RBF)",
    type: "Classical ML",
    features: [
      { label: "mean radius", val: 74, valText: "0.21" },
      { label: "worst perimeter", val: 65, valText: "0.18" },
      { label: "mean texture", val: 52, valText: "0.15" },
      { label: "worst radius", val: 46, valText: "0.13" },
      { label: "mean concavity", val: 35, valText: "0.10" },
      { label: "radius error", val: 27, valText: "0.08" },
    ],
    explanationMethod: "Kernel SHAP / Permutation Importance",
    explanation: "Kernel SHAP builds a local weighted linear model approximation to attribute non-linear RBF support vector boundaries.",
    falsePositives: 10,
    falseNegatives: 8,
    correctPredictions: 522,
    totalSamples: 540,
    quantumConfig: {
      model: "Classical SVM (RBF Kernel)",
      encoding: "StandardScaler Z-score",
      qubits: "N/A (Classical)",
      circuitDepth: "N/A",
      gateCount: "N/A",
      shots: "N/A",
      backend: "CPU Single Thread",
      backendDetail: "LIBSVM C++ Engine",
    }
  },
  logistic_regression: {
    id: "logistic_regression",
    name: "Logistic Regression (L2 Regularized)",
    type: "Classical ML",
    features: [
      { label: "mean radius", val: 70, valText: "0.20" },
      { label: "worst texture", val: 62, valText: "0.17" },
      { label: "mean perimeter", val: 55, valText: "0.15" },
      { label: "mean concavity", val: 45, valText: "0.12" },
      { label: "worst smoothness", val: 35, valText: "0.10" },
      { label: "fractal dimension error", val: 28, valText: "0.08" },
    ],
    explanationMethod: "Standardized Beta Coefficients (Odds Ratios)",
    explanation: "Linear model log-odds weights standardized across unit variance input features for direct interpretability.",
    falsePositives: 14,
    falseNegatives: 11,
    correctPredictions: 515,
    totalSamples: 540,
    quantumConfig: {
      model: "Logistic Regression (L-BFGS)",
      encoding: "StandardScaler Z-score",
      qubits: "N/A (Classical)",
      circuitDepth: "N/A",
      gateCount: "N/A",
      shots: "N/A",
      backend: "CPU",
      backendDetail: "Scikit-Learn linear_model",
    }
  },
  ensemble_hybrid: {
    id: "ensemble_hybrid",
    name: "Ensemble Hybrid (QSVM + XGBoost Stacking)",
    type: "Hybrid QML",
    features: [
      { label: "worst perimeter", val: 92, valText: "0.27" },
      { label: "mean radius (QSVM weight)", val: 80, valText: "0.23" },
      { label: "worst concavity", val: 64, valText: "0.18" },
      { label: "mean concave points", val: 52, valText: "0.15" },
      { label: "worst area", val: 38, valText: "0.11" },
      { label: "texture error", val: 20, valText: "0.06" },
    ],
    explanationMethod: "Stacked Meta-Learner Attribution",
    explanation: "Blended SHAP weights combining quantum kernel feature representations and gradient boosted decision boundaries.",
    falsePositives: 4,
    falseNegatives: 3,
    correctPredictions: 533,
    totalSamples: 540,
    quantumConfig: {
      model: "Hybrid Stacking Ensemble",
      encoding: "Angle + Tabular Fusion",
      qubits: "8",
      circuitDepth: "6",
      gateCount: "42",
      shots: "1024",
      backend: "Heterogeneous",
      backendDetail: "Qiskit Simulator + C++ XGBoost",
    }
  }
}

export default function AnalysisReportPage() {
  const [selectedModelKey, setSelectedModelKey] = useState<string>("qsvm")
  const currentModel = MODEL_DATA[selectedModelKey] || MODEL_DATA.qsvm

  return (
    <HospitalLayout 
      title="AI Interpretability" 
      subtitle="Understand experiment behavior, analyze features, and generate research-ready insights."
    >
      <div className="max-w-[1600px] space-y-6 pb-12">
        
        {/* Top Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[13px] font-bold text-slate-700">Experiment</span>
            <div className="relative">
              <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 pr-10 text-[13px] font-bold text-slate-700 outline-none shadow-sm cursor-pointer hover:bg-slate-100 transition-colors appearance-none min-w-[280px]">
                <option>Breast Cancer — Classical vs QML</option>
                <option>Cardiovascular Risk — Hybrid Quantum Screening</option>
                <option>Oncology Genomics — QNN Feature Map</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[12px] font-bold border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Completed
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-slate-500">Active Model Analysis:</span>
            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
              currentModel.type === "Hybrid QML" 
                ? "bg-purple-50 text-purple-700 border border-purple-200" 
                : "bg-blue-50 text-blue-700 border border-blue-200"
            }`}>
              {currentModel.type}
            </span>
            <span className="text-[13px] font-extrabold text-slate-800">{currentModel.name.split(" ")[0]}</span>
          </div>
        </div>

        {/* Section 1: Model Analysis */}
        <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <BarChart2 size={16} />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-slate-900">Model Analysis</h2>
              </div>
            </div>
            <div className="text-[12px] font-bold text-slate-500">
              Showing insights for: <span className="text-blue-600 font-extrabold">{currentModel.name}</span>
            </div>
          </div>
          <p className="text-[13px] text-slate-500 mb-6 pl-11">Interpret model behavior and investigate prediction errors for any selected model.</p>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pl-0 md:pl-11">
            
            {/* Feature Importance */}
            <div className="border border-slate-100 rounded-[16px] p-5 flex flex-col justify-between bg-gradient-to-b from-white to-slate-50/30">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                    <BarChart2 size={16} className="text-blue-500"/> Feature Importance <InfoIcon />
                  </h3>
                  
                  {/* Model Selector Dropdown with ALL Models */}
                  <div className="relative">
                    <select 
                      value={selectedModelKey}
                      onChange={(e) => setSelectedModelKey(e.target.value)}
                      className="bg-white border-2 border-blue-500/30 hover:border-blue-500 rounded-xl pl-3 pr-9 py-2 text-[12px] font-bold text-slate-800 outline-none shadow-sm cursor-pointer transition-all appearance-none max-w-full sm:min-w-[260px] focus:ring-2 focus:ring-blue-500/20"
                    >
                      <optgroup label="⚛️ Hybrid Quantum (QML) Models">
                        <option value="qsvm">QSVM (Quantum Support Vector Machine)</option>
                        <option value="vqc">VQC (Variational Quantum Classifier)</option>
                        <option value="qkernel">Quantum Kernel SVM</option>
                        <option value="qnn">Quantum Neural Network (QNN)</option>
                        <option value="ensemble_hybrid">Ensemble Hybrid (QSVM + XGBoost)</option>
                      </optgroup>
                      <optgroup label="💻 Classical Machine Learning Models">
                        <option value="random_forest">Random Forest Classifier</option>
                        <option value="xgboost">XGBoost Gradient Booster</option>
                        <option value="lightgbm">LightGBM Classifier</option>
                        <option value="svm_classical">Support Vector Machine (Classical RBF)</option>
                        <option value="logistic_regression">Logistic Regression (L2)</option>
                      </optgroup>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none" />
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="space-y-3">
                  {currentModel.features.map((feat, idx) => (
                    <FeatureBar 
                      key={`${currentModel.id}-${idx}-${feat.label}`} 
                      label={feat.label} 
                      val={feat.val} 
                      valText={feat.valText} 
                      isQML={currentModel.type === "Hybrid QML"}
                    />
                  ))}
                </div>
              
                {/* X Axis */}
                <div className="flex justify-between mt-3 pl-[140px] pr-8 text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-2 mb-6">
                  <span>0.00</span><span>0.05</span><span>0.10</span><span>0.15</span><span>0.20</span><span>0.25+</span>
                </div>
                <div className="text-center text-[9px] font-bold text-slate-400 mb-6 pl-[140px]">
                  Feature Importance Score ({currentModel.explanationMethod})
                </div>
              
                {/* Info Box */}
                <div className="bg-blue-50/80 rounded-[10px] p-3.5 flex items-start gap-3 border border-blue-100">
                  <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    i
                  </div>
                  <div>
                    <div className="font-bold text-blue-950 text-[11px] mb-0.5 flex items-center gap-2">
                      <span>Model-specific explanation: {currentModel.explanationMethod}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-blue-200/60 text-blue-900 font-semibold">{currentModel.type}</span>
                    </div>
                    <div className="text-slate-600 text-[11px] font-medium leading-relaxed">
                      {currentModel.explanation}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prediction Error Analysis */}
            <div className="border border-slate-100 rounded-[16px] p-5 flex flex-col justify-between bg-gradient-to-b from-white to-slate-50/30">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                    <Activity size={16} className="text-blue-500"/> Prediction Error Analysis
                  </h3>
                  <span className="text-[11px] font-bold text-slate-500">
                    Accuracy: <span className="text-emerald-600 font-extrabold">{((currentModel.correctPredictions / currentModel.totalSamples) * 100).toFixed(1)}%</span>
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="border border-rose-100 bg-rose-50/30 rounded-xl p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center"><AlertTriangle size={12}/></div>
                      <span className="text-[11px] font-bold text-slate-700">False Positives</span>
                    </div>
                    <div className="text-[28px] font-extrabold text-rose-600 pl-8">{currentModel.falsePositives}</div>
                  </div>
                  <div className="border border-amber-100 bg-amber-50/30 rounded-xl p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center"><AlertTriangle size={12}/></div>
                      <span className="text-[11px] font-bold text-slate-700">False Negatives</span>
                    </div>
                    <div className="text-[28px] font-extrabold text-amber-600 pl-8">{currentModel.falseNegatives}</div>
                  </div>
                  <div className="border border-emerald-100 rounded-xl p-4 flex flex-col justify-center bg-emerald-50/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check size={12} strokeWidth={3}/></div>
                      <span className="text-[11px] font-bold text-slate-700">Correct Predictions</span>
                    </div>
                    <div className="text-[28px] font-extrabold text-emerald-600 pl-8">{currentModel.correctPredictions}</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4">
                  <div className="flex-1 bg-rose-50/70 border border-rose-100 rounded-xl p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-rose-600"><AlertTriangle size={14}/> False Positives (Type I)</div>
                    <div className="text-[12px] font-bold text-slate-700">{currentModel.falsePositives} <span className="text-slate-400 font-medium">samples</span></div>
                  </div>
                  <div className="flex-1 bg-amber-50/70 border border-amber-100 rounded-xl p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-amber-600"><AlertTriangle size={14}/> False Negatives (Type II)</div>
                    <div className="text-[12px] font-bold text-slate-700">{currentModel.falseNegatives} <span className="text-slate-400 font-medium">samples</span></div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  Total held-out validation cohort: <strong className="text-slate-800">{currentModel.totalSamples} cases</strong>
                </div>
                <button className="px-5 py-2.5 rounded-xl border border-blue-300 text-blue-600 text-[12px] font-bold hover:bg-blue-50 transition-colors flex items-center gap-1.5 shrink-0 shadow-sm">
                  View Misclassified Samples <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Section 2: Data & Feature Analysis */}
        <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Database size={16} />
            </div>
            <h2 className="text-[18px] font-bold text-slate-900">Data & Feature Analysis</h2>
          </div>
          <p className="text-[13px] text-slate-500 mb-6 pl-11">Explore data characteristics and the transformation of features used by the models.</p>

          <div className="pl-0 md:pl-11 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            
            {/* Class Distribution */}
            <div className="lg:col-span-3">
              <h3 className="text-[13px] font-bold text-slate-900 mb-6">Class Distribution</h3>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 flex shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="93.7" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[16px] font-extrabold text-slate-900 leading-none">569</span>
                    <span className="text-[9px] font-bold text-slate-500">Samples</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between gap-4 items-center text-[11px] font-bold w-full">
                    <div className="flex items-center gap-2 whitespace-nowrap"><span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"/> <span className="text-slate-700">Benign (357)</span></div>
                    <span className="text-slate-500">62.7%</span>
                  </div>
                  <div className="flex justify-between gap-4 items-center text-[11px] font-bold w-full">
                    <div className="flex items-center gap-2 whitespace-nowrap"><span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]"/> <span className="text-slate-700">Malignant (212)</span></div>
                    <span className="text-slate-500">37.3%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Transformation */}
            <div className="lg:col-span-5 px-0 lg:px-6 border-y lg:border-y-0 lg:border-x border-slate-100 py-4 lg:py-0">
              <h3 className="text-[13px] font-bold text-slate-900 mb-6">Feature Transformation Pipeline</h3>
              <div className="flex items-center justify-between h-24">
                <div className="flex-1 bg-[#f8fafc] border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center">
                  <div className="text-[18px] font-extrabold text-slate-900">30</div>
                  <div className="text-[10px] font-bold text-slate-500">Original Features</div>
                </div>
                <div className="text-slate-300 mx-3"><ArrowRight size={16}/></div>
                <div className="flex-1 bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex flex-col items-center justify-center">
                  <div className="text-[18px] font-extrabold text-slate-900">15</div>
                  <div className="text-[10px] font-bold text-blue-600">Selected Features</div>
                </div>
                <div className="text-slate-300 mx-3"><ArrowRight size={16}/></div>
                <div className="flex-1 bg-purple-50/50 border border-purple-100 rounded-xl p-4 flex flex-col items-center justify-center">
                  <div className="text-[18px] font-extrabold text-slate-900">8</div>
                  <div className="text-[10px] font-bold text-purple-600 text-center leading-tight">Quantum-Ready<br/>Features</div>
                </div>
              </div>
            </div>

            {/* Dimensionality Reduction */}
            <div className="lg:col-span-4 pl-0 lg:pl-2">
              <h3 className="text-[13px] font-bold text-slate-900 mb-4">Dimensionality Reduction (PCA)</h3>
              <div className="flex items-center gap-6">
                
                {/* Simulated Scatter Plot */}
                <div className="flex-1 h-32 relative border-l border-b border-slate-200">
                  <div className="absolute inset-0 flex flex-col justify-between py-1 text-[8px] font-semibold text-slate-400 -left-4">
                    <span>3</span><span>2</span><span>1</span><span>0</span><span>-1</span><span>-2</span><span>-3</span>
                  </div>
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-semibold text-slate-400">PCA 2</div>
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[8px] font-semibold text-slate-400 -mb-4">
                    <span>-3</span><span>-2</span><span>-1</span><span>0</span><span>1</span><span>2</span><span>3</span>
                  </div>
                  <div className="absolute -bottom-8 left-0 right-0 text-center text-[9px] font-semibold text-slate-400">PCA 1</div>
                  
                  {/* Dots */}
                  <div className="absolute inset-0 overflow-hidden opacity-80">
                    <ScatterDots color="#3b82f6" count={80} cx={35} cy={40} spread={15} />
                    <ScatterDots color="#a855f7" count={60} cx={75} cy={50} spread={15} />
                  </div>
                </div>

                <div className="w-32 space-y-4">
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-[#3b82f6]"/> Benign
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-[#a855f7]"/> Malignant
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400">PCA Components</div>
                    <div className="text-[16px] font-extrabold text-slate-900">8</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400">Variance Retained</div>
                    <div className="text-[16px] font-extrabold text-slate-900">92.4%</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="pl-0 md:pl-11 flex flex-wrap items-center gap-4 mt-10">
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 bg-slate-50 px-6 py-2.5 rounded-xl border border-slate-100">
              <button className="flex items-center gap-2 text-[12px] font-bold text-blue-600"><Settings size={14}/> Feature selection</button>
              <button className="flex items-center gap-2 text-[12px] font-bold text-slate-500 hover:text-slate-800"><Activity size={14}/> Correlation analysis</button>
              <button className="flex items-center gap-2 text-[12px] font-bold text-slate-500 hover:text-slate-800"><ScatterChart size={14} className="scale-x-[-1]"/> PCA</button>
              <button className="flex items-center gap-2 text-[12px] font-bold text-slate-500 hover:text-slate-800"><BarChart2 size={14}/> Class distribution</button>
            </div>
          </div>

        </div>

        {/* Sections 3 & 4 Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Section 3: Quantum / Architecture Analysis */}
          <div className="xl:col-span-8 bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  currentModel.type === "Hybrid QML" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                }`}>
                  <AtomIcon />
                </div>
                <h2 className="text-[18px] font-bold text-slate-900">
                  {currentModel.type === "Hybrid QML" ? "Quantum Circuit & Hardware Analysis" : "Model Architecture & Runtime Configuration"}
                </h2>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                Target: <strong className="text-slate-800">{currentModel.name}</strong>
              </span>
            </div>
            <p className="text-[13px] text-slate-500 mb-8 pl-0 md:pl-11">
              {currentModel.type === "Hybrid QML" 
                ? "Review quantum encoding, ansatz depth, and statevector simulator metrics for this model."
                : "Review classical hardware acceleration, threading, and optimization backend settings."}
            </p>
            
            <div className="pl-0 md:pl-11 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 mb-1">Selected Model</div>
                <div className="text-[13px] font-extrabold text-slate-900 truncate">{currentModel.quantumConfig.model}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 mb-1">Feature Encoding</div>
                <div className="text-[13px] font-extrabold text-slate-900 truncate">{currentModel.quantumConfig.encoding}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 mb-1">Qubits / Width</div>
                <div className="text-[13px] font-extrabold text-purple-600">{currentModel.quantumConfig.qubits}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 mb-1">Circuit Depth</div>
                <div className="text-[13px] font-extrabold text-slate-900">{currentModel.quantumConfig.circuitDepth}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 mb-1">Gate Count</div>
                <div className="text-[13px] font-extrabold text-slate-900">{currentModel.quantumConfig.gateCount}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 mb-1">Shots / Samples</div>
                <div className="text-[13px] font-extrabold text-slate-900">{currentModel.quantumConfig.shots}</div>
              </div>
            </div>

            <div className="pl-0 md:pl-11 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <PipeCard icon={<Layers size={14} className="text-emerald-500"/>} bg="bg-emerald-50" label="Input Dimension" val="30" />
                <ArrowRight size={14} className="text-slate-300 hidden sm:block" />
                <PipeCard icon={<AtomIcon small />} bg={currentModel.type === "Hybrid QML" ? "bg-purple-50" : "bg-blue-50"} label="Qubits / Dimension" val={currentModel.quantumConfig.qubits !== "N/A (Classical)" ? currentModel.quantumConfig.qubits : "30"} />
                <ArrowRight size={14} className="text-slate-300 hidden sm:block" />
                <PipeCard icon={<Cpu size={14} className="text-purple-500"/>} bg="bg-purple-50" label="Architecture Depth" val={currentModel.quantumConfig.circuitDepth !== "N/A" ? currentModel.quantumConfig.circuitDepth : "Dense"} />
                <ArrowRight size={14} className="text-slate-300 hidden sm:block" />
                <PipeCard icon={<Zap size={14} className="text-blue-500"/>} bg="bg-blue-50" label="Shots / Iterations" val={currentModel.quantumConfig.shots !== "N/A" ? currentModel.quantumConfig.shots : "1000"} />
              </div>
              <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 w-full md:w-56">
                <div className="text-[10px] font-semibold text-slate-500 mb-0.5">Execution Backend</div>
                <div className="text-[12px] font-bold text-slate-800">{currentModel.quantumConfig.backend}</div>
                <div className="text-[10px] font-medium text-slate-500 mt-0.5">{currentModel.quantumConfig.backendDetail}</div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 flex flex-col gap-6">
            
            {/* Research Findings */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                  <div className="text-blue-500"><LightbulbIcon /></div>
                  <h3 className="text-[15px] font-bold text-slate-900">Research Findings</h3>
                </div>
                <span className="text-[9px] font-bold text-slate-400">Automated Analysis</span>
              </div>
              <div className="space-y-4">
                <Finding icon={<Database size={14}/>} text="Feature selection reduced the input space from 30 to 15 features before quantum encoding." />
                <Finding icon={<ScatterChart size={14}/>} text="PCA further reduced the representation to 8 quantum-ready dimensions retaining 92.4% variance." />
                <Finding icon={<Activity size={14}/>} text={`${currentModel.name} achieved ${((currentModel.correctPredictions / currentModel.totalSamples) * 100).toFixed(1)}% accuracy with ${currentModel.falsePositives} false positives and ${currentModel.falseNegatives} false negatives.`} />
                <Finding icon={<AtomIcon small />} text={`Execution performed on ${currentModel.quantumConfig.backendDetail} (${currentModel.quantumConfig.backend}).`} />
              </div>
            </div>

            {/* Evaluation Summary */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-blue-500"><FileText size={16}/></div>
                <h3 className="text-[15px] font-bold text-slate-900">Evaluation Summary</h3>
              </div>
              <div className="space-y-3">
                <EvalCheck text="Model performance was evaluated on a held-out test set." />
                <EvalCheck text="Cross-validation was used to assess performance consistency." />
                <EvalCheck text="Classical ML and hybrid QML approaches were benchmarked using common criteria." />
                <EvalCheck text="Computational cost and resource requirements are reported alongside predictive performance." />
                <EvalCheck text="Quantum experiments currently use a simulator-based backend." />
              </div>
            </div>

          </div>
        </div>

        {/* Section 4: Research Report */}
        <div className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText size={16} />
              </div>
              <h2 className="text-[18px] font-bold text-slate-900">Research Report</h2>
            </div>
            <p className="text-[13px] text-slate-500 mb-6 pl-0 md:pl-11">Generate a structured research report with active model interpretability metrics.</p>
            
            <div className="pl-0 md:pl-11 mb-2 text-[12px] font-bold text-slate-900">Report Outline</div>
            <div className="pl-0 md:pl-11 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-3">
              <OutlineItem num="01" text="Experiment Overview" />
              <OutlineItem num="04" text="Classical & Quantum Methods" />
              <OutlineItem num="07" text="Model & Quantum Analysis" />
              <OutlineItem num="02" text="Dataset & Methodology" />
              <OutlineItem num="05" text="Evaluation & Validation" />
              <OutlineItem num="08" text="Limitations & Future Work" />
              <OutlineItem num="03" text="Preprocessing & Feature Analysis" />
              <OutlineItem num="06" text="Benchmark Findings" />
              <OutlineItem num="09" text="Conclusion" />
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[13px] py-3 px-6 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-colors">
              <PlusSquareIcon /> Generate Report
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white border border-blue-200 text-blue-600 font-bold text-[11px] py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5">
                <FileIcon /> Save Analysis
              </button>
              <button className="bg-white border border-blue-200 text-blue-600 font-bold text-[11px] py-2.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5">
                <FilePdfIcon /> Export PDF
              </button>
            </div>
          </div>
        </div>

      </div>
    </HospitalLayout>
  )
}

function FeatureBar({ label, val, valText, isQML = false }: { label: string; val: number; valText: string; isQML?: boolean }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-[140px] text-[11px] font-bold text-slate-600 text-right truncate group-hover:text-blue-600 transition-colors">{label}</div>
      <div className="flex-1 h-3 rounded-full bg-slate-100 flex items-center overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isQML 
              ? "bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500" 
              : "bg-gradient-to-r from-blue-600 to-cyan-400"
          }`} 
          style={{ width: `${val}%` }} 
        />
      </div>
      <div className="w-10 text-[11px] font-extrabold text-slate-800">{valText}</div>
    </div>
  )
}

function ScatterDots({ color, count, cx, cy, spread }: any) {
  const dots = []
  for (let i = 0; i < count; i++) {
    const r1 = Math.random()
    const r2 = Math.random()
    const x = cx + (Math.sqrt(-2 * Math.log(r1 || 0.01)) * Math.cos(2 * Math.PI * r2)) * spread
    const y = cy + (Math.sqrt(-2 * Math.log(r1 || 0.01)) * Math.sin(2 * Math.PI * r2)) * spread
    
    if (x > 0 && x < 100 && y > 0 && y < 100) {
      dots.push(<circle key={i} cx={`${x}%`} cy={`${y}%`} r="1.5" fill={color} opacity="0.7" />)
    }
  }
  return <svg className="absolute inset-0 w-full h-full">{dots}</svg>
}

function PipeCard({ icon, bg, label, val }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-[12px] p-3 flex items-center gap-3 w-40 shadow-sm">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg}`}>
        {icon}
      </div>
      <div>
        <div className="text-[9px] font-bold text-slate-500 mb-0.5">{label}</div>
        <div className="text-[14px] font-extrabold text-slate-900 leading-none truncate">{val}</div>
      </div>
    </div>
  )
}

function Finding({ icon, text }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <p className="text-[12px] font-medium text-slate-600 leading-relaxed pt-1.5">{text}</p>
    </div>
  )
}

function EvalCheck({ text }: any) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-emerald-500"><Check size={14}/></div>
      <p className="text-[11px] text-slate-600 font-medium">{text}</p>
    </div>
  )
}

function OutlineItem({ num, text }: any) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0">
        {num}
      </div>
      <span className="text-[12px] font-medium text-slate-600">{text}</span>
    </div>
  )
}

// Custom Icons
function InfoIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
}
function AtomIcon({ small = false }: { small?: boolean }) {
  const sz = small ? 14 : 16
  return <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .11 1.89 1.18 1.18 0 0 1-.14 1.74 1.65 1.65 0 0 0-.9 1.92 1.18 1.18 0 0 1-1.28 1.28 1.65 1.65 0 0 0-1.92.9 1.18 1.18 0 0 1-1.74.14 1.65 1.65 0 0 0-1.89-.11 1.18 1.18 0 0 1-1.89.11 1.65 1.65 0 0 0-1.74-.14 1.18 1.18 0 0 1-1.92-.9 1.65 1.65 0 0 0-1.28-1.28 1.18 1.18 0 0 1-.14-1.74 1.65 1.65 0 0 0 .11-1.89 1.18 1.18 0 0 1 .14-1.74 1.65 1.65 0 0 0 .9-1.92 1.18 1.18 0 0 1 1.28-1.28 1.65 1.65 0 0 0 1.92-.9 1.18 1.18 0 0 1 1.74-.14 1.65 1.65 0 0 0 1.89.11 1.18 1.18 0 0 1 1.89-.11 1.65 1.65 0 0 0 1.74.14 1.18 1.18 0 0 1 1.92.9 1.65 1.65 0 0 0 1.28 1.28 1.18 1.18 0 0 1 .14 1.74 1.65 1.65 0 0 0-.11 1.89z"></path></svg>
}
function LightbulbIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>
}
function PlusSquareIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
}
function FileIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
}
function FilePdfIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>
}
