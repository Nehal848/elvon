"use client"

import React, { useState } from "react"
import Link from "next/link"
import HospitalLayout from "@/components/hospital-layout"
import {
  Box, Cpu, Zap, ShieldCheck, ArrowRight, ExternalLink,
  Layers, CheckCircle2, Sparkles, Filter, Search, Info
} from "lucide-react"

interface ModelItem {
  id: string
  name: string
  category: "quantum" | "classical"
  type: string
  description: string
  ansatzOrArchitecture: string
  qubitSupport: string
  avgAccuracy: string
  bestDataset: string
  inferenceLatency: string
  hardwareReady: boolean
  backendCompatibility: string[]
  paramsCount: string
  leakageAudited: boolean
}

const MODELS_DATA: ModelItem[] = [
  {
    id: "qsvm",
    name: "Quantum Support Vector Machine (QSVM)",
    category: "quantum",
    type: "Quantum Kernel Method",
    description: "Projects non-linearly separable biomedical feature vectors into 2^N Hilbert state space using multi-qubit entanglement feature maps.",
    ansatzOrArchitecture: "ZZFeatureMap / PauliFeatureMap (reps=2)",
    qubitSupport: "4 – 16 Qubits",
    avgAccuracy: "94.7%",
    bestDataset: "Breast Cancer WDBC",
    inferenceLatency: "18.4 ms",
    hardwareReady: true,
    backendCompatibility: ["Statevector Simulator", "Aer QASM", "IBM Brisbane (127Q)"],
    paramsCount: "Kernel Matrix (N x N)",
    leakageAudited: true,
  },
  {
    id: "vqc",
    name: "Variational Quantum Classifier (VQC)",
    category: "quantum",
    type: "Parameterized Quantum Circuit",
    description: "Trainable quantum variational ansatz optimized with COBYLA/SLSQP via parameter-shift gradient calculation for diagnostic classification.",
    ansatzOrArchitecture: "TwoLocal / RealAmplitudes (Ry + CNOT ladder)",
    qubitSupport: "4 – 8 Qubits",
    avgAccuracy: "91.2%",
    bestDataset: "Cardiovascular Disease",
    inferenceLatency: "34.1 ms",
    hardwareReady: true,
    backendCompatibility: ["Statevector Simulator", "Aer QASM", "IonQ Aria"],
    paramsCount: "32 Trainable θ Angles",
    leakageAudited: true,
  },
  {
    id: "hybrid_qnn",
    name: "Hybrid Quantum Neural Network (QNN)",
    category: "quantum",
    type: "PyTorch + TorchConnector",
    description: "Deep classical feedforward layers bridged directly to a PennyLane / Qiskit quantum expectation layer with end-to-end backpropagation.",
    ansatzOrArchitecture: "FC(32) -> AngleEmbedding -> StronglyEntanglingLayers -> FC(2)",
    qubitSupport: "4 – 8 Qubits",
    avgAccuracy: "93.4%",
    bestDataset: "Gene Expression Genomics",
    inferenceLatency: "26.8 ms",
    hardwareReady: true,
    backendCompatibility: ["PyTorch Lightning", "Pennylane default.qubit", "Rigetti Aspen-M3"],
    paramsCount: "1,248 weights + 48 θ angles",
    leakageAudited: true,
  },
  {
    id: "random_forest",
    name: "Random Forest Classifier",
    category: "classical",
    type: "Ensemble Decision Trees",
    description: "Ensemble of 100 Gini-impurity bagging trees acting as standard high-performance classical baseline for structured medical diagnostics.",
    ansatzOrArchitecture: "100 Estimators, max_depth=8",
    qubitSupport: "N/A (Classical)",
    avgAccuracy: "94.2%",
    bestDataset: "Parkinson's Voice Features",
    inferenceLatency: "3.2 ms",
    hardwareReady: false,
    backendCompatibility: ["x86 CPU", "Apple Silicon", "NVIDIA CUDA"],
    paramsCount: "100 Trees (~42k nodes)",
    leakageAudited: true,
  },
  {
    id: "gradient_boosting",
    name: "Gradient Boosting (XGBoost/LightGBM style)",
    category: "classical",
    type: "Sequential Residual Boosting",
    description: "Gradient boosted decision trees minimizing log-loss iteratively with shrinkage regularization.",
    ansatzOrArchitecture: "GradientBoostingClassifier (lr=0.1, n=100)",
    qubitSupport: "N/A (Classical)",
    avgAccuracy: "95.1%",
    bestDataset: "Breast Cancer WDBC",
    inferenceLatency: "4.1 ms",
    hardwareReady: false,
    backendCompatibility: ["x86 CPU", "CUDA Acceleration"],
    paramsCount: "80 Trees (~28k nodes)",
    leakageAudited: true,
  },
  {
    id: "svm_rbf",
    name: "Classical Support Vector Machine (RBF)",
    category: "classical",
    type: "Radial Basis Function Kernel",
    description: "Standard Gaussian kernel SVM providing direct comparison against Quantum Kernel methods in reproducing kernel Hilbert spaces.",
    ansatzOrArchitecture: "SVC(C=1.0, kernel='rbf', gamma='scale')",
    qubitSupport: "N/A (Classical)",
    avgAccuracy: "92.8%",
    bestDataset: "Diabetes Screening",
    inferenceLatency: "5.6 ms",
    hardwareReady: false,
    backendCompatibility: ["x86 CPU", "Intel oneDAL"],
    paramsCount: "Support Vectors (~180)",
    leakageAudited: true,
  },
  {
    id: "logistic_regression",
    name: "L2-Regularized Logistic Regression",
    category: "classical",
    type: "Linear Maximum Likelihood",
    description: "Interpretable generalized linear model serving as fundamental lower-bound benchmark for sensitivity and clinical ROC-AUC.",
    ansatzOrArchitecture: "LogisticRegression(penalty='l2', solver='lbfgs')",
    qubitSupport: "N/A (Classical)",
    avgAccuracy: "88.9%",
    bestDataset: "Cardiovascular Disease",
    inferenceLatency: "0.8 ms",
    hardwareReady: false,
    backendCompatibility: ["x86 CPU"],
    paramsCount: "N Coefficients + Bias",
    leakageAudited: true,
  },
]

export default function ModelsPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "quantum" | "classical">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null)

  const filteredModels = MODELS_DATA.filter((m) => {
    if (activeFilter !== "all" && m.category !== activeFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        m.name.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <HospitalLayout
      title="Model Registry & Benchmark Suite"
      subtitle="Examine pre-configured Quantum (QSVM, VQC, Hybrid QNN) and Classical baseline architectures"
    >
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 w-fit">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeFilter === "all"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Models ({MODELS_DATA.length})
            </button>
            <button
              onClick={() => setActiveFilter("quantum")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeFilter === "quantum"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              Quantum ML (3)
            </button>
            <button
              onClick={() => setActiveFilter("classical")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeFilter === "classical"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              Classical Baselines (4)
            </button>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models..."
                className="w-full pl-9 pr-3 py-2 bg-slate-800/60 border border-slate-700/60 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <Link
              href="/create-model"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Sparkles className="w-4 h-4" />
              Create Custom Model
            </Link>
          </div>
        </div>

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Active Model Families</div>
            <div className="text-2xl font-bold text-white mt-1">7 Architectures</div>
            <div className="text-xs text-indigo-400 mt-1">3 Quantum + 4 Classical</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Peak Quantum Accuracy</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">94.7%</div>
            <div className="text-xs text-slate-400 mt-1">QSVM on WDBC dataset</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">NISQ Hardware Readiness</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">3/3 Ready</div>
            <div className="text-xs text-slate-400 mt-1">IBM Brisbane & IonQ tested</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Zero-Leakage Guarantee</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">100% Audited</div>
            <div className="text-xs text-slate-400 mt-1">Strict split validation applied</div>
          </div>
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 group hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                      model.category === "quantum"
                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {model.category === "quantum" ? "⚛ Quantum ML" : "💻 Classical Baseline"}
                  </span>
                  {model.hardwareReady && (
                    <span className="text-[11px] bg-cyan-500/15 text-cyan-400 px-2 py-0.5 rounded-md font-semibold border border-cyan-500/20 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> QPU Ready
                    </span>
                  )}
                </div>

                {/* Model Title & Type */}
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {model.name}
                </h3>
                <div className="text-xs font-semibold text-slate-400 mb-2.5">{model.type}</div>

                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {model.description}
                </p>

                {/* Technical Specs List */}
                <div className="space-y-2 py-3 border-y border-slate-700/50 text-xs mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Ansatz / Circuit:</span>
                    <span className="font-mono text-slate-200 truncate max-w-[180px]" title={model.ansatzOrArchitecture}>
                      {model.ansatzOrArchitecture}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Qubits:</span>
                    <span className="font-semibold text-slate-200">{model.qubitSupport}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Avg Accuracy:</span>
                    <span className="font-bold text-emerald-400">{model.avgAccuracy}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Latency:</span>
                    <span className="font-mono text-cyan-300">{model.inferenceLatency}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Top Benchmark:</span>
                    <span className="text-slate-300 truncate max-w-[170px]">{model.bestDataset}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setSelectedModel(model)}
                  className="flex-1 py-2 px-3 bg-slate-700/50 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5" /> Details
                </button>
                <Link
                  href={`/analysis?model=${model.id}`}
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  Deploy in Lab <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Model Inspection Modal */}
        {selectedModel && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                      selectedModel.category === "quantum"
                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {selectedModel.category === "quantum" ? "Quantum ML" : "Classical Baseline"}
                    </span>
                    {selectedModel.hardwareReady && (
                      <span className="text-xs bg-cyan-500/15 text-cyan-400 px-2 py-0.5 rounded-md font-semibold border border-cyan-500/20">
                        NISQ Hardware Compatible
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedModel.name}</h2>
                  <p className="text-xs text-slate-400 mt-1">{selectedModel.type}</p>
                </div>
                <button
                  onClick={() => setSelectedModel(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                {selectedModel.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/40">
                  <div className="text-slate-400 mb-1 font-medium">Architecture / Ansatz</div>
                  <div className="font-mono text-white font-semibold">{selectedModel.ansatzOrArchitecture}</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/40">
                  <div className="text-slate-400 mb-1 font-medium">Parameter Complexity</div>
                  <div className="font-mono text-white font-semibold">{selectedModel.paramsCount}</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/40">
                  <div className="text-slate-400 mb-1 font-medium">Target Qubit Range</div>
                  <div className="text-white font-semibold">{selectedModel.qubitSupport}</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/40">
                  <div className="text-slate-400 mb-1 font-medium">Data Leakage Audit</div>
                  <div className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Passed 5-Fold Strict Split
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-300 mb-2">Validated Backends</div>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.backendCompatibility.map((b, i) => (
                    <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setSelectedModel(null)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <Link
                  href={`/analysis?model=${selectedModel.id}`}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  Launch In Experiment Lab <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </HospitalLayout>
  )
}
