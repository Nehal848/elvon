"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import HospitalLayout from "@/components/hospital-layout"
import {
  Database,
  FileText,
  TrendingUp,
  Clock,
  Heart,
  Plus,
  UploadCloud,
  CheckCircle2,
  MoreHorizontal,
  Brain,
  Droplets,
  Activity,
  Ribbon,
  Layers,
  Sparkles,
  Sliders,
  Cpu,
  ArrowRight,
  X,
  FileSpreadsheet,
  Check,
  Zap,
  Info,
  ChevronRight,
  Eye,
  DownloadCloud
} from "lucide-react"

// --- Clinical Datasets Dummy Data ---
const CLINICAL_DATASETS = {
  heart_disease: {
    id: "heart_disease",
    name: "Heart Disease UCI",
    domain: "Cardiology",
    status: "Ready",
    featuresCount: 14,
    samplesCount: "1,025",
    classesCount: "2 classes (Normal / Arrhythmia)",
    qualityScore: 96,
    missingValues: 12,
    duplicates: 4,
    invalidValues: 2,
    features: 14,
    columns: ["Age", "Sex", "ChestPain", "RestingBP", "Cholesterol", "MaxHR"],
    rows: [
      { c1: "63", c2: "Male", c3: "Typical Angina", c4: "145 mmHg", c5: "233 mg/dl", c6: "150 bpm" },
      { c1: "67", c2: "Female", c3: "Asymptomatic", c4: "160 mmHg", c5: "286 mg/dl", c6: "108 bpm" },
      { c1: "67", c2: "Male", c3: "Non-anginal", c4: "120 mmHg", c5: "229 mg/dl", c6: "129 bpm" },
      { c1: "37", c2: "Male", c3: "Non-anginal", c4: "130 mmHg", c5: "250 mg/dl", c6: "187 bpm" },
      { c1: "41", c2: "Female", c3: "Atypical Angina", c4: "130 mmHg", c5: "204 mg/dl", c6: "172 bpm" },
      { c1: "54", c2: "Male", c3: "Asymptomatic", c4: "140 mmHg", c5: "239 mg/dl", c6: "160 bpm" },
    ],
    schema: [
      { name: "age", type: "Integer", role: "Feature", missing: "0 (0%)", correlation: "+0.28" },
      { name: "sex", type: "Categorical", role: "Feature", missing: "0 (0%)", correlation: "+0.31" },
      { name: "cp (chest pain)", type: "Categorical", role: "Feature", missing: "2 (0.2%)", correlation: "+0.43" },
      { name: "trestbps", type: "Continuous", role: "Feature", missing: "4 (0.4%)", correlation: "+0.18" },
      { name: "chol", type: "Continuous", role: "Feature", missing: "6 (0.6%)", correlation: "-0.09" },
      { name: "thalach (Max HR)", type: "Continuous", role: "Feature", missing: "0 (0%)", correlation: "-0.42" },
      { name: "num (Diagnosis)", type: "Binary Target", role: "Target", missing: "0 (0%)", correlation: "1.00" },
    ]
  },
  breast_cancer: {
    id: "breast_cancer",
    name: "Breast Cancer Wisconsin",
    domain: "Oncology",
    status: "Validated",
    featuresCount: 30,
    samplesCount: "569",
    classesCount: "2 classes (Malignant / Benign)",
    qualityScore: 98.4,
    missingValues: 0,
    duplicates: 0,
    invalidValues: 1,
    features: 30,
    columns: ["ID", "Diagnosis", "Radius", "Texture", "Perimeter", "Smoothness"],
    rows: [
      { c1: "842302", c2: "Malignant", c3: "17.99", c4: "10.38", c5: "122.8", c6: "0.1184" },
      { c1: "842517", c2: "Malignant", c3: "20.57", c4: "17.77", c5: "132.9", c6: "0.0847" },
      { c1: "843009", c2: "Malignant", c3: "19.69", c4: "21.25", c5: "130.0", c6: "0.1096" },
      { c1: "843483", c2: "Benign", c3: "11.42", c4: "20.38", c5: "77.58", c6: "0.1425" },
      { c1: "843584", c2: "Malignant", c3: "20.29", c4: "14.34", c5: "135.1", c6: "0.1003" },
      { c1: "843786", c2: "Benign", c3: "12.45", c4: "15.70", c5: "82.57", c6: "0.1278" },
    ],
    schema: [
      { name: "radius_mean", type: "Continuous", role: "Feature", missing: "0 (0%)", correlation: "+0.73" },
      { name: "texture_mean", type: "Continuous", role: "Feature", missing: "0 (0%)", correlation: "+0.42" },
      { name: "perimeter_mean", type: "Continuous", role: "Feature", missing: "0 (0%)", correlation: "+0.74" },
      { name: "area_mean", type: "Continuous", role: "Feature", missing: "0 (0%)", correlation: "+0.71" },
      { name: "concave_points_mean", type: "Continuous", role: "Feature", missing: "0 (0%)", correlation: "+0.78" },
      { name: "diagnosis", type: "Binary Target", role: "Target", missing: "0 (0%)", correlation: "1.00" },
    ]
  },
  parkinsons: {
    id: "parkinsons",
    name: "Parkinson's Telemonitoring",
    domain: "Neurology",
    status: "Ready",
    featuresCount: 20,
    samplesCount: "5,875",
    classesCount: "Unified Motor Rating (Continuous)",
    qualityScore: 94.6,
    missingValues: 18,
    duplicates: 8,
    invalidValues: 5,
    features: 20,
    columns: ["Subject#", "Age", "Sex", "Jitter(%)", "Shimmer", "HNR"],
    rows: [
      { c1: "SUB-01", c2: "72", c3: "Male", c4: "0.00662", c5: "0.0256", c6: "21.033" },
      { c1: "SUB-01", c2: "72", c3: "Male", c4: "0.00792", c5: "0.0312", c6: "18.950" },
      { c1: "SUB-02", c2: "58", c3: "Female", c4: "0.00341", c5: "0.0189", c6: "24.512" },
      { c1: "SUB-03", c2: "65", c3: "Male", c4: "0.00512", c5: "0.0245", c6: "22.180" },
      { c1: "SUB-04", c2: "70", c3: "Female", c4: "0.00845", c5: "0.0387", c6: "17.420" },
      { c1: "SUB-05", c2: "61", c3: "Male", c4: "0.00410", c5: "0.0195", c6: "23.600" },
    ],
    schema: [
      { name: "age", type: "Integer", role: "Feature", missing: "0 (0%)", correlation: "+0.31" },
      { name: "jitter_percent", type: "Continuous", role: "Feature", missing: "6 (0.1%)", correlation: "+0.28" },
      { name: "shimmer_apq3", type: "Continuous", role: "Feature", missing: "7 (0.1%)", correlation: "+0.35" },
      { name: "HNR", type: "Continuous", role: "Feature", missing: "5 (0.1%)", correlation: "-0.41" },
      { name: "total_UPDRS", type: "Score Target", role: "Target", missing: "0 (0%)", correlation: "1.00" },
    ]
  }
}

export default function DashboardPage() {
  const [selectedKey, setSelectedKey] = useState<keyof typeof CLINICAL_DATASETS>("heart_disease")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeDataset = CLINICAL_DATASETS[selectedKey]

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      setUploadModalOpen(false)
      showToast(`Dataset "${file.name}" uploaded and validated successfully!`)
    }, 1200)
  }

  const handleQuickDemoLoad = (key: keyof typeof CLINICAL_DATASETS) => {
    setSelectedKey(key)
    showToast(`Loaded ${CLINICAL_DATASETS[key].name} cohort into preview.`)
  }

  // Recent datasets list
  const recentDatasets = [
    {
      key: "breast_cancer",
      name: "Breast Cancer Wisconsin",
      domain: "Oncology",
      samples: "569",
      features: "30",
      lastModified: "Apr 26, 2025",
      status: "Validated",
      icon: Ribbon,
      iconColor: "text-pink-500 bg-pink-50 border-pink-100"
    },
    {
      key: "heart_disease",
      name: "Heart Disease UCI",
      domain: "Cardiology",
      samples: "1,025",
      features: "14",
      lastModified: "Apr 25, 2025",
      status: "Ready",
      icon: Heart,
      iconColor: "text-rose-500 bg-rose-50 border-rose-100"
    },
    {
      key: "parkinsons",
      name: "Parkinsons Telemonitoring",
      domain: "Neurology",
      samples: "5,875",
      features: "20",
      lastModified: "Apr 24, 2025",
      status: "Preprocessed",
      icon: Brain,
      iconColor: "text-blue-500 bg-blue-50 border-blue-100"
    },
    {
      key: "diabetes",
      name: "Type-2 Diabetes Biomarkers",
      domain: "Endocrinology",
      samples: "768",
      features: "8",
      lastModified: "Apr 22, 2025",
      status: "Cleaned",
      icon: Droplets,
      iconColor: "text-emerald-500 bg-emerald-50 border-emerald-100"
    },
    {
      key: "lung_cancer",
      name: "Lung CT Radiomics",
      domain: "Oncology",
      samples: "32,768",
      features: "56",
      lastModified: "Apr 20, 2025",
      status: "Normalized",
      icon: Activity,
      iconColor: "text-cyan-500 bg-cyan-50 border-cyan-100"
    },
    {
      key: "alzheimers",
      name: "Alzheimer PET Metrics",
      domain: "Geriatrics",
      samples: "1,420",
      features: "18",
      lastModified: "Apr 18, 2025",
      status: "In Review",
      icon: Brain,
      iconColor: "text-violet-500 bg-violet-50 border-violet-100"
    },
  ]

  // Recent activity logs
  const recentActivities = [
    {
      id: 1,
      title: "Dataset uploaded",
      subtitle: "breast_cancer_wisconsin.csv (569 rows)",
      time: "2 hours ago",
      status: "Completed",
      statusColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: FileSpreadsheet,
      iconBg: "bg-sky-50 text-sky-600 border-sky-100"
    },
    {
      id: 2,
      title: "Preprocessing completed",
      subtitle: "Heart Disease UCI: KNN imputation applied",
      time: "3 hours ago",
      status: "Completed",
      statusColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: Sliders,
      iconBg: "bg-teal-50 text-teal-600 border-teal-100"
    },
    {
      id: 3,
      title: "Model training started",
      subtitle: "Quantum SVM (4-Qubit Angled Kernel)",
      time: "4 hours ago",
      status: "In Progress",
      statusColor: "bg-sky-50 text-sky-600 border-sky-200",
      icon: Cpu,
      iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
      id: 4,
      title: "Evaluation completed",
      subtitle: "QSVM-Cardio: 96.4% AUC on 205 test samples",
      time: "5 hours ago",
      status: "Completed",
      statusColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    {
      id: 5,
      title: "SHAP Explainability Report",
      subtitle: "Top feature: Resting blood pressure (0.42)",
      time: "6 hours ago",
      status: "Completed",
      statusColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
      icon: Zap,
      iconBg: "bg-purple-50 text-purple-600 border-purple-100"
    },
  ]

  return (
    <HospitalLayout
      title="Data Scientist Dashboard"
      subtitle="Build, train and evaluate models for better healthcare outcomes."
    >
      <div className="max-w-[1440px] space-y-6 pb-12">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700">
            <Check size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ── ROW 1: 4 TOP METRIC CARDS ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Datasets */}
          <div className="bg-white rounded-[22px] p-5 border border-slate-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.015)] flex items-center justify-between hover:border-slate-300/80 transition-all">
            <div>
              <span className="text-[12.5px] font-medium text-slate-500 block mb-1">Total Datasets</span>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-extrabold text-slate-900 tracking-tight leading-none">12</span>
                <span className="text-[11px] font-semibold text-slate-400">+3 pending</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[11.5px] font-bold text-emerald-600 flex items-center">
                  ↑ 20%
                </span>
                <span className="text-[11.5px] text-slate-400">vs. last 7 days</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shadow-xs">
              <Database size={22} />
            </div>
          </div>

          {/* Card 2: Total Models Trained */}
          <div className="bg-white rounded-[22px] p-5 border border-slate-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.015)] flex items-center justify-between hover:border-slate-300/80 transition-all">
            <div>
              <span className="text-[12.5px] font-medium text-slate-500 block mb-1">Total Models Trained</span>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-extrabold text-slate-900 tracking-tight leading-none">8</span>
                <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">4 QML + 4 ML</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[11.5px] font-bold text-emerald-600 flex items-center">
                  ↑ 33%
                </span>
                <span className="text-[11.5px] text-slate-400">vs. last 7 days</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-xs">
              <FileText size={22} />
            </div>
          </div>

          {/* Card 3: Best Accuracy */}
          <div className="bg-white rounded-[22px] p-5 border border-slate-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.015)] flex items-center justify-between hover:border-slate-300/80 transition-all">
            <div>
              <span className="text-[12.5px] font-medium text-slate-500 block mb-1">Best Accuracy</span>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-extrabold text-slate-900 tracking-tight leading-none">96.4%</span>
                <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-md">QSVM</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[11.5px] font-bold text-emerald-600 flex items-center">
                  ↑ 5.2%
                </span>
                <span className="text-[11.5px] text-slate-400">vs. last 7 days</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-xs">
              <TrendingUp size={22} />
            </div>
          </div>

          {/* Card 4: Avg. Training Time */}
          <div className="bg-white rounded-[22px] p-5 border border-slate-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.015)] flex items-center justify-between hover:border-slate-300/80 transition-all">
            <div>
              <span className="text-[12.5px] font-medium text-slate-500 block mb-1">Avg. Training Time</span>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-extrabold text-slate-900 tracking-tight leading-none">18.6 min</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2.5">
                <span className="text-[11.5px] font-bold text-emerald-600 flex items-center">
                  ↓ 12%
                </span>
                <span className="text-[11.5px] text-slate-400">vs. last 7 days</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 shadow-xs">
              <Clock size={22} />
            </div>
          </div>
        </div>

        {/* ── ROW 2: DATASET OVERVIEW & PREVIEW + START YOUR ANALYSIS ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Large Card: Dataset Overview & Preview (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-[22px] p-6 border border-slate-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.015)] flex flex-col justify-between">
            <div>
              {/* Header with Dataset Switcher Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                    <Database size={18} />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-slate-900 leading-tight">Dataset Overview & Preview</h2>
                    <span className="text-[11px] text-slate-400 font-medium">Select a benchmark cohort to inspect</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Quick dataset switcher pill selector */}
                  <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200/60 text-[11px] font-semibold">
                    <button
                      onClick={() => setSelectedKey("heart_disease")}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        selectedKey === "heart_disease" ? "bg-white text-blue-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Heart UCI
                    </button>
                    <button
                      onClick={() => setSelectedKey("breast_cancer")}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        selectedKey === "breast_cancer" ? "bg-white text-blue-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Breast Cancer
                    </button>
                    <button
                      onClick={() => setSelectedKey("parkinsons")}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                        selectedKey === "parkinsons" ? "bg-white text-blue-600 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Parkinson's
                    </button>
                  </div>

                  <button
                    onClick={() => setUploadModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white font-semibold text-[12px] bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-xs shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              {/* Body: Split 2 sections */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5">
                {/* Left section: Dataset Metrics */}
                <div className="md:col-span-6 space-y-4">
                  {/* Name + Status */}
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
                      {selectedKey === "heart_disease" ? (
                        <Heart size={20} className="text-rose-500" />
                      ) : selectedKey === "breast_cancer" ? (
                        <Ribbon size={20} className="text-pink-500" />
                      ) : (
                        <Brain size={20} className="text-blue-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold text-slate-900">{activeDataset.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          {activeDataset.status}
                        </span>
                      </div>
                      <span className="text-[11.5px] text-slate-400 font-medium block mt-0.5">
                        {activeDataset.featuresCount} features • {activeDataset.samplesCount} samples • {activeDataset.classesCount}
                      </span>
                    </div>
                  </div>

                  {/* Data Quality Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11.5px] font-semibold text-slate-600 mb-1.5">
                      <span>Data Quality</span>
                      <span className="font-bold text-slate-900">{activeDataset.qualityScore}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-500"
                        style={{ width: `${activeDataset.qualityScore}%` }}
                      />
                    </div>
                  </div>

                  {/* 4 Stat Boxes */}
                  <div className="grid grid-cols-4 gap-2.5">
                    <div className="bg-slate-50/70 border border-slate-100/90 rounded-xl p-2.5 text-center">
                      <span className="text-[10px] text-slate-500 font-medium block truncate">Missing Values</span>
                      <span className="text-[15px] font-extrabold text-slate-800 mt-0.5 block">{activeDataset.missingValues}</span>
                    </div>
                    <div className="bg-slate-50/70 border border-slate-100/90 rounded-xl p-2.5 text-center">
                      <span className="text-[10px] text-slate-500 font-medium block truncate">Duplicates</span>
                      <span className="text-[15px] font-extrabold text-slate-800 mt-0.5 block">{activeDataset.duplicates}</span>
                    </div>
                    <div className="bg-slate-50/70 border border-slate-100/90 rounded-xl p-2.5 text-center">
                      <span className="text-[10px] text-slate-500 font-medium block truncate">Invalid Values</span>
                      <span className="text-[15px] font-extrabold text-slate-800 mt-0.5 block">{activeDataset.invalidValues}</span>
                    </div>
                    <div className="bg-slate-50/70 border border-slate-100/90 rounded-xl p-2.5 text-center">
                      <span className="text-[10px] text-slate-500 font-medium block truncate">Features</span>
                      <span className="text-[15px] font-extrabold text-slate-800 mt-0.5 block">{activeDataset.features}</span>
                    </div>
                  </div>

                  {/* Quick Actions Buttons */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Quick Actions
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setDetailsModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-[12px] font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Info size={13} className="text-slate-400" />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() => setPreviewModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-[12px] font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye size={13} className="text-slate-400" />
                        <span>Preview Data</span>
                      </button>
                      <Link
                        href="/create-model"
                        className="px-4 py-2 rounded-xl text-white font-bold text-[12px] bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-xs shadow-cyan-500/25 transition-all no-underline flex items-center gap-1.5"
                      >
                        <span>Start Preprocessing</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right section: Dataset Preview Mini Table */}
                <div className="md:col-span-6 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[12.5px] font-bold text-slate-800">Dataset Preview</span>
                      <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                        {activeDataset.samplesCount} rows
                      </span>
                    </div>
                    <button
                      onClick={() => setPreviewModalOpen(true)}
                      className="text-[11.5px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-200/60 text-slate-400 font-semibold">
                          {activeDataset.columns.map((col, idx) => (
                            <th key={idx} className="pb-2 font-semibold whitespace-nowrap pr-2">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/70 text-slate-600 font-medium">
                        {activeDataset.rows.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/80 transition-colors">
                            <td className="py-2 pr-2 font-bold text-slate-800 whitespace-nowrap">{row.c1}</td>
                            <td className="py-2 pr-2 whitespace-nowrap">{row.c2}</td>
                            <td className="py-2 pr-2 whitespace-nowrap">{row.c3}</td>
                            <td className="py-2 pr-2 whitespace-nowrap">{row.c4}</td>
                            <td className="py-2 pr-2 whitespace-nowrap">{row.c5}</td>
                            <td className="py-2 pr-2 whitespace-nowrap">{row.c6}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Start Your Analysis & Upload (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Top Gradient Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 rounded-[22px] p-5 text-white shadow-md shadow-cyan-500/15">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                  <Sparkles size={16} />
                </div>
                <h3 className="text-[16px] font-bold text-white tracking-tight">Start Your Analysis</h3>
              </div>
              <p className="text-[12px] text-white/90 font-medium leading-relaxed">
                Upload a dataset or select an existing one to begin your data science workflow.
              </p>

              {/* Quick sample chips */}
              <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="text-white/75 font-semibold text-[10.5px]">Try Demo:</span>
                <button
                  onClick={() => handleQuickDemoLoad("heart_disease")}
                  className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-md font-bold cursor-pointer transition-colors"
                >
                  cardio_uci.csv
                </button>
                <button
                  onClick={() => handleQuickDemoLoad("breast_cancer")}
                  className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-md font-bold cursor-pointer transition-colors"
                >
                  wdbc_onco.csv
                </button>
              </div>
            </div>

            {/* Bottom Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-white rounded-[22px] p-6 border-2 border-dashed border-sky-200/90 hover:border-cyan-400 bg-sky-50/20 hover:bg-sky-50/40 transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.parquet"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div className="w-14 h-14 rounded-full bg-sky-100/70 text-sky-600 flex items-center justify-center mb-3">
                <UploadCloud size={28} />
              </div>
              <h4 className="text-[14px] font-bold text-slate-900 mb-1">Upload Dataset</h4>
              <p className="text-[11.5px] text-slate-400 font-medium max-w-[210px]">
                Drag & drop your file here or click to browse
              </p>
              <span className="text-[10px] text-slate-400 mt-1">Supported formats: CSV, XLSX, Parquet</span>

              <button
                type="button"
                className="mt-4 px-6 py-2 rounded-xl text-white font-bold text-[12px] bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-xs shadow-cyan-500/20 transition-all"
              >
                Upload File
              </button>
            </div>
          </div>
        </div>

        {/* ── ROW 3: RECENT DATASETS + DATASET DISTRIBUTION + RECENT ACTIVITY ────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Column 1: Recent Datasets (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-[22px] p-6 border border-slate-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.015)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                    <Database size={16} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-900 leading-tight">Recent Datasets</h3>
                    <span className="text-[10.5px] text-slate-400 font-medium">6 clinical cohorts active</span>
                  </div>
                </div>
                <Link
                  href="/create-model"
                  className="text-[12px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 no-underline"
                >
                  <span>View All</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11.5px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                      <th className="pb-2 font-semibold">Dataset Name</th>
                      <th className="pb-2 font-semibold">Domain</th>
                      <th className="pb-2 font-semibold">Samples</th>
                      <th className="pb-2 font-semibold">Features</th>
                      <th className="pb-2 font-semibold">Last Modified</th>
                      <th className="pb-2 font-semibold text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {recentDatasets.map((ds, idx) => {
                      const Icon = ds.icon
                      return (
                        <tr
                          key={idx}
                          onClick={() => {
                            if (CLINICAL_DATASETS[ds.key as keyof typeof CLINICAL_DATASETS]) {
                              setSelectedKey(ds.key as keyof typeof CLINICAL_DATASETS)
                              showToast(`Switched preview to ${ds.name}`)
                            }
                          }}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        >
                          <td className="py-2.5 font-semibold text-slate-800">
                            <div className="flex items-center gap-2 min-w-[150px]">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${ds.iconColor}`}>
                                <Icon size={13} />
                              </div>
                              <span className="truncate">{ds.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 text-slate-500 font-medium">{ds.domain}</td>
                          <td className="py-2.5 font-semibold text-slate-700">{ds.samples}</td>
                          <td className="py-2.5 font-semibold text-slate-700">{ds.features}</td>
                          <td className="py-2.5 text-slate-400 font-medium whitespace-nowrap">{ds.lastModified}</td>
                          <td className="py-2.5 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                showToast(`Dataset options: ${ds.name}`)
                              }}
                              className="text-slate-300 hover:text-slate-600 p-1 rounded-md cursor-pointer"
                            >
                              <MoreHorizontal size={15} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Column 2: Dataset Distribution Donut Chart (3 cols) */}
          <div className="md:col-span-3 bg-white rounded-[22px] p-6 border border-slate-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.015)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                    <Layers size={16} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-900 leading-tight">Dataset Distribution</h3>
                    <span className="text-[10.5px] text-slate-400 font-medium">Cohort classifications</span>
                  </div>
                </div>
              </div>

              {/* Donut Chart and Legend */}
              <div className="flex flex-col items-center justify-center py-1">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                    {/* Background track */}
                    <circle cx="70" cy="70" r="52" fill="transparent" stroke="#f8fafc" strokeWidth="16" />

                    {/* Normal: 62.4% -> 204 length */}
                    <circle
                      cx="70"
                      cy="70"
                      r="52"
                      fill="transparent"
                      stroke="#2563eb"
                      strokeWidth="16"
                      strokeDasharray="204 326.7"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />

                    {/* Positive: 24.7% -> 80.7 length */}
                    <circle
                      cx="70"
                      cy="70"
                      r="52"
                      fill="transparent"
                      stroke="#06b6d4"
                      strokeWidth="16"
                      strokeDasharray="80.7 326.7"
                      strokeDashoffset="-204"
                    />

                    {/* Negative: 8.9% -> 29 length */}
                    <circle
                      cx="70"
                      cy="70"
                      r="52"
                      fill="transparent"
                      stroke="#8b5cf6"
                      strokeWidth="16"
                      strokeDasharray="29 326.7"
                      strokeDashoffset="-284.7"
                    />

                    {/* Unknown: 4.0% -> 13 length */}
                    <circle
                      cx="70"
                      cy="70"
                      r="52"
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth="16"
                      strokeDasharray="13 326.7"
                      strokeDashoffset="-313.7"
                    />
                  </svg>

                  {/* Centered Total */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
                    <span className="text-[20px] font-extrabold text-slate-900 leading-tight">5,870</span>
                  </div>
                </div>

                {/* Legend List */}
                <div className="w-full mt-3.5 space-y-1.5 text-[11.5px] font-semibold text-slate-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                      <span>Normal</span>
                    </div>
                    <span className="font-bold text-slate-900">3,663 (62.4%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
                      <span>Positive</span>
                    </div>
                    <span className="font-bold text-slate-900">1,450 (24.7%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
                      <span>Negative</span>
                    </div>
                    <span className="font-bold text-slate-900">522 (8.9%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                      <span>Unknown</span>
                    </div>
                    <span className="font-bold text-slate-900">235 (4.0%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Recent Activity (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-[22px] p-6 border border-slate-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.015)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-slate-900 leading-tight">Recent Activity</h3>
                    <span className="text-[10.5px] text-slate-400 font-medium">Real-time pipeline logs</span>
                  </div>
                </div>
                <Link
                  href="/history"
                  className="text-[12px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 no-underline"
                >
                  <span>View All</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {/* Feed List */}
              <div className="space-y-3">
                {recentActivities.map((act) => {
                  const Icon = act.icon
                  return (
                    <div
                      key={act.id}
                      className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border flex-shrink-0 ${act.iconBg}`}>
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[12.5px] font-bold text-slate-900 truncate leading-tight">
                            {act.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium leading-tight">
                            {act.subtitle}
                          </p>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{act.time}</span>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border flex-shrink-0 ml-2 ${act.statusColor}`}
                      >
                        {act.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODALS ───────────────────────────────────────────────────────────── */}
      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-[16px] font-bold text-slate-900">Upload Healthcare Dataset</h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="mt-5 border-2 border-dashed border-sky-300 bg-sky-50/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-sky-50/60 transition-colors"
            >
              <UploadCloud size={36} className="text-sky-600 mb-2" />
              <div className="text-[13.5px] font-bold text-slate-800">Select CSV, XLSX, or Parquet</div>
              <div className="text-[11.5px] text-slate-400 mt-1">Automatic column profiling & schema validation</div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl text-[12px] font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2 rounded-xl text-white font-bold text-[12px] bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm hover:shadow"
              >
                {isUploading ? "Uploading..." : "Browse Files"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dataset Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] max-w-3xl w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-[16px] font-bold text-slate-900">{activeDataset.name} — Full Preview</h3>
                <p className="text-[11.5px] text-slate-500 mt-0.5">
                  Showing top records out of {activeDataset.samplesCount} validated samples • Domain: {activeDataset.domain}
                </p>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 overflow-x-auto max-h-[350px]">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50 sticky top-0">
                    {activeDataset.columns.map((col, idx) => (
                      <th key={idx} className="p-2.5 font-semibold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {activeDataset.rows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold">{r.c1}</td>
                      <td className="p-2.5">{r.c2}</td>
                      <td className="p-2.5">{r.c3}</td>
                      <td className="p-2.5">{r.c4}</td>
                      <td className="p-2.5">{r.c5}</td>
                      <td className="p-2.5">{r.c6}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11.5px] text-slate-400">
                Quality: <strong className="text-slate-700">{activeDataset.qualityScore}%</strong> • Format: <strong>UTF-8 RFC4180</strong>
              </span>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-5 py-2 rounded-xl text-white font-bold text-[12px] bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dataset Schema & Details Modal */}
      {detailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-[16px] font-bold text-slate-900">{activeDataset.name} — Schema & Correlations</h3>
                <p className="text-[11.5px] text-slate-500 mt-0.5">
                  Statistical profile and Pearson feature correlations
                </p>
              </div>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 overflow-x-auto max-h-[350px]">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50 sticky top-0">
                    <th className="p-2.5 font-semibold">Feature Name</th>
                    <th className="p-2.5 font-semibold">Data Type</th>
                    <th className="p-2.5 font-semibold">Role</th>
                    <th className="p-2.5 font-semibold">Missing</th>
                    <th className="p-2.5 font-semibold">Correlation (r)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {activeDataset.schema.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold font-mono text-[11.5px]">{item.name}</td>
                      <td className="p-2.5 text-slate-500">{item.type}</td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            item.role === "Target" ? "bg-rose-50 text-rose-600" : "bg-sky-50 text-sky-600"
                          }`}
                        >
                          {item.role}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-500">{item.missing}</td>
                      <td className="p-2.5 font-semibold text-slate-800">{item.correlation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="px-5 py-2 rounded-xl text-white font-bold text-[12px] bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </HospitalLayout>
  )
}
