"use client"

import React, { useState } from "react"
import Link from "next/link"
import HospitalLayout from "@/components/hospital-layout"
import {
  FileText, Users, Database, ShieldCheck, ArrowRight, Search,
  Filter, CheckCircle, AlertCircle, Sparkles, Activity, Layers
} from "lucide-react"

interface CohortSubject {
  id: string
  dataset: string
  datasetKey: string
  age: number
  gender: string
  label: string
  labelType: "positive" | "negative" | "warning"
  primaryBiomarker: string
  quantumState: "Encoded (4Q)" | "Encoded (8Q)" | "Pending Simulation"
  splitGroup: "Train (80%)" | "Test (20%)"
  leakageAudited: boolean
}

const SAMPLE_PATIENTS: CohortSubject[] = [
  { id: "SUBJ-BC-0101", dataset: "Breast Cancer (WDBC)", datasetKey: "breast_cancer", age: 52, gender: "F", label: "Malignant", labelType: "positive", primaryBiomarker: "Mean Radius: 17.99 mm", quantumState: "Encoded (4Q)", splitGroup: "Train (80%)", leakageAudited: true },
  { id: "SUBJ-BC-0102", dataset: "Breast Cancer (WDBC)", datasetKey: "breast_cancer", age: 46, gender: "F", label: "Benign", labelType: "negative", primaryBiomarker: "Mean Radius: 12.32 mm", quantumState: "Encoded (4Q)", splitGroup: "Train (80%)", leakageAudited: true },
  { id: "SUBJ-BC-0103", dataset: "Breast Cancer (WDBC)", datasetKey: "breast_cancer", age: 61, gender: "F", label: "Malignant", labelType: "positive", primaryBiomarker: "Mean Radius: 19.69 mm", quantumState: "Encoded (4Q)", splitGroup: "Test (20%)", leakageAudited: true },
  { id: "SUBJ-HD-0201", dataset: "Cardiovascular Disease", datasetKey: "heart_disease", age: 63, gender: "M", label: "Heart Disease", labelType: "positive", primaryBiomarker: "Chol: 233 mg/dl, BP: 145", quantumState: "Encoded (4Q)", splitGroup: "Train (80%)", leakageAudited: true },
  { id: "SUBJ-HD-0202", dataset: "Cardiovascular Disease", datasetKey: "heart_disease", age: 41, gender: "F", label: "Normal (No Disease)", labelType: "negative", primaryBiomarker: "Chol: 250 mg/dl, BP: 130", quantumState: "Encoded (4Q)", splitGroup: "Test (20%)", leakageAudited: true },
  { id: "SUBJ-DB-0301", dataset: "Diabetes Screening", datasetKey: "diabetes", age: 50, gender: "F", label: "Diabetic Onset", labelType: "positive", primaryBiomarker: "Glucose: 148, BMI: 33.6", quantumState: "Encoded (8Q)", splitGroup: "Train (80%)", leakageAudited: true },
  { id: "SUBJ-DB-0302", dataset: "Diabetes Screening", datasetKey: "diabetes", age: 31, gender: "F", label: "Non-Diabetic", labelType: "negative", primaryBiomarker: "Glucose: 85, BMI: 26.6", quantumState: "Encoded (8Q)", splitGroup: "Train (80%)", leakageAudited: true },
  { id: "SUBJ-PK-0401", dataset: "Parkinson's Disease", datasetKey: "parkinsons", age: 68, gender: "M", label: "Parkinson's Positive", labelType: "positive", primaryBiomarker: "Jitter: 0.00784, HNR: 21.03", quantumState: "Encoded (4Q)", splitGroup: "Test (20%)", leakageAudited: true },
  { id: "SUBJ-PK-0402", dataset: "Parkinson's Disease", datasetKey: "parkinsons", age: 59, gender: "M", label: "Healthy Control", labelType: "negative", primaryBiomarker: "Jitter: 0.00211, HNR: 26.17", quantumState: "Encoded (4Q)", splitGroup: "Train (80%)", leakageAudited: true },
  { id: "SUBJ-GE-0501", dataset: "Gene Expression Genomics", datasetKey: "genomics", age: 44, gender: "F", label: "High Risk Subtype", labelType: "positive", primaryBiomarker: "Gene-14 Expr: 4.82 (PCA top)", quantumState: "Encoded (8Q)", splitGroup: "Train (80%)", leakageAudited: true },
  { id: "SUBJ-GE-0502", dataset: "Gene Expression Genomics", datasetKey: "genomics", age: 57, gender: "M", label: "Standard Subtype", labelType: "negative", primaryBiomarker: "Gene-82 Expr: 1.15 (PCA top)", quantumState: "Encoded (8Q)", splitGroup: "Test (20%)", leakageAudited: true },
]

const DATASETS_SUMMARY = [
  { id: "breast_cancer", name: "Breast Cancer (WDBC)", samples: 569, features: 30, domain: "Oncology", task: "Binary Classification" },
  { id: "heart_disease", name: "Cardiovascular Disease", samples: 303, features: 13, domain: "Cardiology", task: "Binary Classification" },
  { id: "diabetes", name: "Diabetes Screening", samples: 500, features: 8, domain: "Metabolic", task: "Binary Classification" },
  { id: "parkinsons", name: "Parkinson's Disease", samples: 195, features: 22, domain: "Neurology", task: "Acoustic Phonation" },
  { id: "genomics", name: "Gene Expression Genomics", samples: 220, features: 200, domain: "Precision Medicine", task: "High-Dim Microarray" },
]

export default function PatientsDatasetsPage() {
  const [activeDatasetFilter, setActiveDatasetFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPatients = SAMPLE_PATIENTS.filter((p) => {
    if (activeDatasetFilter !== "all" && p.datasetKey !== activeDatasetFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        p.id.toLowerCase().includes(q) ||
        p.dataset.toLowerCase().includes(q) ||
        p.label.toLowerCase().includes(q) ||
        p.primaryBiomarker.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <HospitalLayout
      title="Biomedical Datasets & Patient Cohorts"
      subtitle="Strict zero-leakage validated biomedical cohorts mapped into quantum feature state spaces"
    >
      <div className="space-y-6">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Total Cohort Records</div>
            <div className="text-2xl font-bold text-white mt-1">1,787 Subjects</div>
            <div className="text-xs text-indigo-400 mt-1">Across 5 validated domains</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Zero-Leakage Status</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">100% Strict</div>
            <div className="text-xs text-slate-400 mt-1">Preprocessed within splits</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Quantum Feature Mapping</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">Angle / ZZ-Map</div>
            <div className="text-xs text-slate-400 mt-1">Normalized to [-π, π]</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Patient Privacy</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">De-Identified</div>
            <div className="text-xs text-slate-400 mt-1">HIPAA & GDPR Compliant</div>
          </div>
        </div>

        {/* Dataset selector chips */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Select Biomedical Cohort Dataset
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            <button
              onClick={() => setActiveDatasetFilter("all")}
              className={`p-3 rounded-xl text-left border transition-all ${
                activeDatasetFilter === "all"
                  ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                  : "bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="text-xs font-bold">All Datasets</div>
              <div className="text-[11px] opacity-75">1,787 subjects</div>
            </button>
            {DATASETS_SUMMARY.map((ds) => (
              <button
                key={ds.id}
                onClick={() => setActiveDatasetFilter(ds.id)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  activeDatasetFilter === ds.id
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                    : "bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="text-xs font-bold truncate">{ds.name}</div>
                <div className="text-[11px] opacity-75">{ds.samples} samples · {ds.features}f</div>
              </button>
            ))}
          </div>
        </div>

        {/* Patient Table & Search */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-base font-bold text-white">Individual Subject Cohort Records</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing clinical features normalized for quantum circuit state-vector input
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subject ID or marker..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <Link
                href="/analysis"
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20 whitespace-nowrap"
              >
                Launch In Lab <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700/60">
                <tr>
                  <th className="px-4 py-3">Subject ID</th>
                  <th className="px-4 py-3">Dataset</th>
                  <th className="px-4 py-3">Age / Sex</th>
                  <th className="px-4 py-3">Diagnosis / Label</th>
                  <th className="px-4 py-3">Key Biomarker</th>
                  <th className="px-4 py-3">Quantum State</th>
                  <th className="px-4 py-3">Partition</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-white">{p.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-200">{p.dataset}</td>
                    <td className="px-4 py-3 text-slate-400">{p.age}y · {p.gender}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          p.labelType === "positive"
                            ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {p.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-[11px]">{p.primaryBiomarker}</td>
                    <td className="px-4 py-3 text-cyan-300 font-medium">{p.quantumState}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                        {p.splitGroup}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/analysis?dataset=${p.datasetKey}`}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        Test Model →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HospitalLayout>
  )
}
