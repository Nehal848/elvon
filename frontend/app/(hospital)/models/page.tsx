"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import HospitalLayout from "@/components/hospital-layout"
import { 
  BrainCircuit, HeartPulse, Droplet, CheckCircle2, ArrowRight, Network, Loader2, AlertCircle,
  Search, Filter, Sparkles, Cpu, Layers, ShieldCheck, Activity, Box, Stethoscope
} from "lucide-react"

interface Model {
  id: string
  key: string
  name: string
  type: string
  category: "Classical ML" | "Hybrid QML"
  diseaseCategory: string
  ownership: "hospital" | "vendor" | "community"
  disease: string
  accuracy: number
  f1_score: number
  status: "active" | "training" | "benchmarking"
  feedback_count: number
  deployed_at: string
  description: string
}

const ALL_MODELS: Model[] = [
  // 💻 CLASSICAL ML MODELS
  {
    id: "MOD-CARDIO-01",
    key: "random_forest",
    name: "Random Forest Classifier (500 Trees)",
    type: "Classical ML (Ensemble Decision Trees)",
    category: "Classical ML",
    diseaseCategory: "Cardiovascular",
    ownership: "hospital",
    disease: "Cardiovascular Disease",
    accuracy: 94.6,
    f1_score: 94.1,
    status: "active",
    feedback_count: 142,
    deployed_at: "2026-09-10",
    description: "Multi-tree bagged decision ensemble with TreeSHAP feature attributions for ischemic risk prediction."
  },
  {
    id: "MOD-CARDIO-03",
    key: "xgboost",
    name: "XGBoost Gradient Booster",
    type: "Classical ML (Hist Gradient Boosting)",
    category: "Classical ML",
    diseaseCategory: "Cardiovascular",
    ownership: "hospital",
    disease: "Cardiovascular Disease",
    accuracy: 94.2,
    f1_score: 93.8,
    status: "active",
    feedback_count: 198,
    deployed_at: "2026-09-12",
    description: "High-speed regularized gradient boosted decision tree classifier with optimized loss gradients."
  },
  {
    id: "MOD-ONCO-01",
    key: "svm_classical",
    name: "Support Vector Machine (Classical RBF)",
    type: "Classical ML (Radial Basis Kernel)",
    category: "Classical ML",
    diseaseCategory: "Oncology",
    ownership: "hospital",
    disease: "Breast Cancer Screening",
    accuracy: 89.4,
    f1_score: 87.6,
    status: "active",
    feedback_count: 164,
    deployed_at: "2026-09-08",
    description: "Standardized dual-boundary support vector hyperplanes in RBF transformed clinical feature space."
  },
  {
    id: "MOD-ONCO-02",
    key: "lightgbm",
    name: "LightGBM Classifier",
    type: "Classical ML (GOSS Split)",
    category: "Classical ML",
    diseaseCategory: "Oncology",
    ownership: "hospital",
    disease: "Breast Cancer Screening",
    accuracy: 93.8,
    f1_score: 93.1,
    status: "active",
    feedback_count: 119,
    deployed_at: "2026-09-15",
    description: "Gradient-based One-Side Sampling optimized for fast non-linear clinical boundary partitioning."
  },
  {
    id: "MOD-DIAB-01",
    key: "logistic_regression",
    name: "Logistic Regression Risk Stratifier (L2)",
    type: "Classical ML (Linear Log-Odds)",
    category: "Classical ML",
    diseaseCategory: "Metabolic",
    ownership: "hospital",
    disease: "Diabetes Mellitus",
    accuracy: 87.2,
    f1_score: 85.9,
    status: "active",
    feedback_count: 215,
    deployed_at: "2026-08-28",
    description: "Fast, explainable standardized beta coefficient regression model for glycemic trajectory monitoring."
  },
  {
    id: "MOD-RENAL-01",
    key: "random_forest",
    name: "RenalInsight AI v3.0 (Ensemble Trees)",
    type: "Classical ML (Stacking Ensemble)",
    category: "Classical ML",
    diseaseCategory: "Nephrology",
    ownership: "hospital",
    disease: "Chronic Kidney Disease",
    accuracy: 93.7,
    f1_score: 93.0,
    status: "active",
    feedback_count: 178,
    deployed_at: "2026-09-02",
    description: "Ensemble of boosted decision trees tailored for glomerular filtration rate (eGFR) decline warning."
  },
  {
    id: "MOD-PULMO-01",
    key: "xgboost",
    name: "PulmoScan Gradient Net v2.1",
    type: "Classical ML (Tabular Boosted Trees)",
    category: "Classical ML",
    diseaseCategory: "Pulmonology",
    ownership: "hospital",
    disease: "Pulmonary Infection",
    accuracy: 93.1,
    f1_score: 92.5,
    status: "active",
    feedback_count: 112,
    deployed_at: "2026-09-05",
    description: "Multi-biomarker inflammatory response classifier trained on spirometry and blood panel data."
  },

  // ⚛️ HYBRID QML MODELS
  {
    id: "MOD-CARDIO-02",
    key: "vqc",
    name: "Quantum-Enhanced VQC Heart Classifier",
    type: "Hybrid QML (Variational Quantum Circuit)",
    category: "Hybrid QML",
    diseaseCategory: "Cardiovascular",
    ownership: "vendor",
    disease: "Cardiovascular Disease",
    accuracy: 96.8,
    f1_score: 96.2,
    status: "active",
    feedback_count: 89,
    deployed_at: "2026-09-14",
    description: "Parameterized 8-qubit variational Ansatz with Pauli rotation angles and entangling CNOT layers."
  },
  {
    id: "MOD-ONCO-03",
    key: "qsvm",
    name: "QSVM (Quantum Support Vector Machine)",
    type: "Hybrid QML (Angle / ZZ-FeatureMap)",
    category: "Hybrid QML",
    diseaseCategory: "Oncology",
    ownership: "vendor",
    disease: "Breast Cancer Screening",
    accuracy: 95.8,
    f1_score: 95.1,
    status: "active",
    feedback_count: 154,
    deployed_at: "2026-09-16",
    description: "Calculates quantum kernel Gram matrix in Hilbert statevector space with exponential feature mapping."
  },
  {
    id: "MOD-ONCO-04",
    key: "qkernel",
    name: "Quantum Kernel SVM",
    type: "Hybrid QML (Quantum Kernel Estimation)",
    category: "Hybrid QML",
    diseaseCategory: "Oncology",
    ownership: "vendor",
    disease: "Breast Cancer Screening",
    accuracy: 94.9,
    f1_score: 94.3,
    status: "active",
    feedback_count: 76,
    deployed_at: "2026-09-17",
    description: "Evaluates quantum fidelity overlaps between test sample states and training support vectors."
  },
  {
    id: "MOD-LIVER-01",
    key: "qnn",
    name: "Quantum HepatoVision Classifier (QNN)",
    type: "Hybrid QML (Quantum Neural Network)",
    category: "Hybrid QML",
    diseaseCategory: "Hepatology",
    ownership: "vendor",
    disease: "Liver Disease",
    accuracy: 95.3,
    f1_score: 94.8,
    status: "active",
    feedback_count: 64,
    deployed_at: "2026-09-18",
    description: "Hybrid PyTorch-PennyLane QNN with parameterized quantum layers and classical linear dense head."
  },
  {
    id: "MOD-GENOM-01",
    key: "ensemble_hybrid",
    name: "Ensemble Hybrid (QSVM + XGBoost Stacking)",
    type: "Hybrid QML (Quantum-Classical Meta-Learner)",
    category: "Hybrid QML",
    diseaseCategory: "Precision Medicine",
    ownership: "hospital",
    disease: "Genomics & Biomarker Analysis",
    accuracy: 97.4,
    f1_score: 96.9,
    status: "active",
    feedback_count: 42,
    deployed_at: "2026-09-20",
    description: "Meta-learner blending quantum kernel feature projections with gradient boosted decision hyperplanes."
  }
]

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>(ALL_MODELS)
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<"ALL" | "Classical ML" | "Hybrid QML">("ALL")
  const [selectedDiseaseFilter, setSelectedDiseaseFilter] = useState<string>("ALL")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Filter models based on user selections
  const filteredModels = models.filter(m => {
    const matchesType = selectedTypeFilter === "ALL" || m.category === selectedTypeFilter
    const matchesDisease = selectedDiseaseFilter === "ALL" || m.diseaseCategory === selectedDiseaseFilter
    const matchesSearch = searchQuery === "" || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.type.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesDisease && matchesSearch
  })

  // Group models by disease
  const groupedModels = filteredModels.reduce((acc, model) => {
    const disease = model.disease || "Other Diseases"
    if (!acc[disease]) acc[disease] = []
    acc[disease].push(model)
    return acc
  }, {} as Record<string, Model[]>)

  const classicalCount = models.filter(m => m.category === "Classical ML").length
  const hybridCount = models.filter(m => m.category === "Hybrid QML").length

  return (
    <HospitalLayout 
      title="Model Management" 
      subtitle="Select, configure, and inspect validated Classical ML and Hybrid QML models for clinical tasks."
    >
      <div className="max-w-[1500px] space-y-6 pb-12">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-cyan-50/60 rounded-[24px] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-blue-100/60 shadow-[0_2px_16px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-cyan-100/40 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-md border border-blue-100 relative shrink-0">
              <BrainCircuit size={28} className="text-blue-600 relative z-10" />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-100/60 px-2.5 py-0.5 rounded-full">
                  Hospital Model Registry
                </span>
              </div>
              <h2 className="text-[20px] font-extrabold text-slate-900 mb-1">Clinical AI & QML Models</h2>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                Choose between strict <strong>Classical ML</strong> baselines and <strong>Hybrid Quantum (QML)</strong> models with verifiable interpretability.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5 relative z-10">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-blue-100 shadow-sm text-[12px] font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>{classicalCount} Classical</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-purple-100 shadow-sm text-[12px] font-bold text-purple-700">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span>{hybridCount} Hybrid QML</span>
            </div>
          </div>
        </div>

        {/* CONTROLS & FILTER BAR */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Category Tabs: ALL vs CLASSICAL vs HYBRID */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setSelectedTypeFilter("ALL")}
              className={`px-4 py-2 rounded-lg text-[12px] font-bold transition-all ${
                selectedTypeFilter === "ALL"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Models ({models.length})
            </button>
            <button
              onClick={() => setSelectedTypeFilter("Classical ML")}
              className={`px-4 py-2 rounded-lg text-[12px] font-bold flex items-center gap-1.5 transition-all ${
                selectedTypeFilter === "Classical ML"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-blue-600"
              }`}
            >
              💻 Classical ML ({classicalCount})
            </button>
            <button
              onClick={() => setSelectedTypeFilter("Hybrid QML")}
              className={`px-4 py-2 rounded-lg text-[12px] font-bold flex items-center gap-1.5 transition-all ${
                selectedTypeFilter === "Hybrid QML"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-purple-600"
              }`}
            >
              ⚛️ Hybrid QML ({hybridCount})
            </button>
          </div>

          {/* Search & Disease Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search models or diseases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-semibold text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Disease Filter */}
            <div className="relative">
              <select
                value={selectedDiseaseFilter}
                onChange={(e) => setSelectedDiseaseFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-[12px] font-bold text-slate-700 outline-none cursor-pointer hover:bg-slate-100 transition-colors appearance-none"
              >
                <option value="ALL">All Clinical Domains</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Oncology">Oncology</option>
                <option value="Metabolic">Metabolic (Diabetes)</option>
                <option value="Nephrology">Nephrology</option>
                <option value="Hepatology">Hepatology</option>
                <option value="Pulmonology">Pulmonology</option>
                <option value="Precision Medicine">Precision Medicine</option>
              </select>
            </div>
          </div>

        </div>

        {/* Filter Indicator */}
        {selectedTypeFilter !== "ALL" && (
          <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 px-4 py-2.5 rounded-xl text-[12px]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Currently showing:</span>
              <span className={`px-2.5 py-0.5 rounded-md font-extrabold uppercase text-[11px] ${
                selectedTypeFilter === "Hybrid QML" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
              }`}>
                {selectedTypeFilter} only
              </span>
              <span className="text-slate-500">({filteredModels.length} models found — {selectedTypeFilter === "Classical ML" ? "No Quantum models shown" : "No Classical models shown"})</span>
            </div>
            <button 
              onClick={() => setSelectedTypeFilter("ALL")}
              className="font-bold text-blue-600 hover:text-blue-800 underline text-[11px]"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Models List */}
        {filteredModels.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <Search size={20} />
            </div>
            <h3 className="text-[16px] font-bold text-slate-800 mb-1">No matching models found</h3>
            <p className="text-[12px] text-slate-500 mb-4">Try clearing your search query or switching category filters.</p>
            <button 
              onClick={() => { setSelectedTypeFilter("ALL"); setSelectedDiseaseFilter("ALL"); setSearchQuery("") }}
              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-[12px] hover:bg-blue-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedModels).map(([disease, diseaseModels]) => {
              let icon = <BrainCircuit size={22} className="text-blue-500" />
              let iconBg = "bg-blue-50"
              if (disease.toLowerCase().includes("cardio")) {
                icon = <HeartPulse size={22} className="text-red-500" />; iconBg = "bg-red-50"
              } else if (disease.toLowerCase().includes("diab") || disease.toLowerCase().includes("metabolic")) {
                icon = <Droplet size={22} className="text-rose-500" />; iconBg = "bg-rose-50"
              } else if (disease.toLowerCase().includes("cancer") || disease.toLowerCase().includes("onco")) {
                icon = <Stethoscope size={22} className="text-purple-500" />; iconBg = "bg-purple-50"
              }

              return (
                <ModelSection 
                  key={disease}
                  title={disease}
                  icon={icon}
                  iconBg={iconBg}
                  models={diseaseModels}
                />
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div className="pt-8 pb-4 flex items-center justify-center gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <span>ELVON • Clinical Model Governance</span>
          <span className="opacity-50">|</span>
          <span>Verified Classical & QML Registry</span>
        </div>

      </div>
    </HospitalLayout>
  )
}

function ModelSection({ title, icon, iconBg, models }: { title: string, icon: React.ReactNode, iconBg: string, models: Model[] }) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between gap-4 bg-slate-50/40">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
            {icon}
          </div>
          <h3 className="text-[17px] font-extrabold text-slate-900">{title}</h3>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full text-[11px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{models.length} Model{models.length > 1 ? 's' : ''} Available</span>
        </div>
      </div>
      
      <div className={`p-6 grid grid-cols-1 ${models.length > 1 ? 'lg:grid-cols-2' : ''} gap-6`}>
        {models.map(model => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  )
}

function ModelCard({ model }: { model: Model }) {
  const isQuantum = model.category === "Hybrid QML"
  
  const cardBorder = isQuantum ? "border-purple-200/60 bg-gradient-to-b from-purple-50/20 to-white" : "border-slate-200/80 bg-gradient-to-b from-slate-50/30 to-white"
  const badgeStyle = isQuantum ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-blue-100 text-blue-700 border-blue-200"
  const iconWrapper = isQuantum ? "bg-purple-50 border-purple-100 text-purple-600" : "bg-blue-50 border-blue-100 text-blue-600"
  
  return (
    <div className={`rounded-[20px] p-6 border ${cardBorder} flex flex-col justify-between relative shadow-sm hover:shadow-md transition-all group`}>
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${iconWrapper} shrink-0`}>
              {isQuantum ? <BrainCircuit size={22} /> : <Cpu size={22} />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border ${badgeStyle}`}>
                  {isQuantum ? "⚛️ Hybrid QML" : "💻 Classical ML"}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">{model.id}</span>
              </div>
              <h4 className="text-[16px] font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                {model.name}
              </h4>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
          </div>
        </div>

        <p className="text-[12px] text-slate-600 font-medium mb-5 leading-relaxed">
          {model.description}
        </p>
        
        {/* Performance Metrics Row */}
        <div className="flex items-center gap-6 mb-6 p-3.5 bg-white rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center font-extrabold text-[12px] text-emerald-600">
              {model.accuracy}%
            </div>
            <div>
              <div className="text-[13px] font-extrabold text-slate-900">{model.accuracy}%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">Accuracy</div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center font-extrabold text-[12px] text-blue-600">
              {model.f1_score}%
            </div>
            <div>
              <div className="text-[13px] font-extrabold text-slate-900">{model.f1_score}%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">F1-Score</div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          <div className="hidden sm:block">
            <div className="text-[11px] font-bold text-slate-700">{model.feedback_count}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Evaluations</div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="text-[11px] font-semibold text-slate-500 truncate">
          Algorithm: <strong className="text-slate-800">{model.type}</strong>
        </div>

        {/* Direct Link to Interpretability pre-selecting this specific model */}
        <Link 
          href={`/analysis-report?model=${model.key}`}
          className={`px-5 py-2 rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 transition-all shadow-sm no-underline ${
            isQuantum 
              ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20" 
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
          }`}
        >
          <span>Use & Interpret Model</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
