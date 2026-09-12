"use client"

import React, { useState } from "react"
import Link from "next/link"
import HospitalLayout from "@/components/hospital-layout"
import {
  FlaskConical, Activity, Microscope, HeartPulse, Dna,
  ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Search
} from "lucide-react"

interface LabSpecimen {
  id: string
  patientId: string
  testType: string
  domain: string
  biomarkerValue: string
  qmlModelUsed: string
  riskScore: number
  riskLevel: "Low Risk" | "Moderate Risk" | "High Risk"
  quantumConfidence: string
  verified: boolean
}

const SPECIMENS: LabSpecimen[] = [
  {
    id: "SPEC-WDBC-981",
    patientId: "SUBJ-BC-0101",
    testType: "Digital FNA Nuclear Microscopy",
    domain: "Oncology",
    biomarkerValue: "Radius: 17.99mm, Concavity: 0.3001",
    qmlModelUsed: "QSVM (ZZFeatureMap)",
    riskScore: 0.94,
    riskLevel: "High Risk",
    quantumConfidence: "97.8%",
    verified: true,
  },
  {
    id: "SPEC-WDBC-982",
    patientId: "SUBJ-BC-0102",
    testType: "Digital FNA Nuclear Microscopy",
    domain: "Oncology",
    biomarkerValue: "Radius: 12.32mm, Concavity: 0.045",
    qmlModelUsed: "QSVM (ZZFeatureMap)",
    riskScore: 0.08,
    riskLevel: "Low Risk",
    quantumConfidence: "99.1%",
    verified: true,
  },
  {
    id: "SPEC-CARD-412",
    patientId: "SUBJ-HD-0201",
    testType: "12-Lead ECG & Angiography",
    domain: "Cardiology",
    biomarkerValue: "ST Depression: 2.3mm, Max HR: 108",
    qmlModelUsed: "VQC (RealAmplitudes)",
    riskScore: 0.88,
    riskLevel: "High Risk",
    quantumConfidence: "94.3%",
    verified: true,
  },
  {
    id: "SPEC-DIAB-711",
    patientId: "SUBJ-DB-0301",
    testType: "Fasting Plasma Glucose & HbA1c",
    domain: "Metabolic",
    biomarkerValue: "Glucose: 148 mg/dL, BMI: 33.6",
    qmlModelUsed: "Hybrid QNN (PyTorch)",
    riskScore: 0.76,
    riskLevel: "Moderate Risk",
    quantumConfidence: "92.0%",
    verified: true,
  },
  {
    id: "SPEC-PARK-309",
    patientId: "SUBJ-PK-0401",
    testType: "Acoustic Phonation Dysphonia Assay",
    domain: "Neurology",
    biomarkerValue: "Jitter: 0.00784, HNR: 21.03 dB",
    qmlModelUsed: "QSVM (PauliFeatureMap)",
    riskScore: 0.91,
    riskLevel: "High Risk",
    quantumConfidence: "95.6%",
    verified: true,
  },
  {
    id: "SPEC-GENO-114",
    patientId: "SUBJ-GE-0501",
    testType: "Microarray RNA-Sequencing (200-Gene)",
    domain: "Genomics",
    biomarkerValue: "PC1: 4.82, PC2: -2.11 (Oncogene panel)",
    qmlModelUsed: "Hybrid QNN (AngleEmbedding)",
    riskScore: 0.84,
    riskLevel: "High Risk",
    quantumConfidence: "91.8%",
    verified: true,
  },
]

export default function LaboratoryPage() {
  const [activeDomain, setActiveDomain] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = SPECIMENS.filter((s) => {
    if (activeDomain !== "all" && s.domain.toLowerCase() !== activeDomain.toLowerCase()) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return s.id.toLowerCase().includes(q) || s.patientId.toLowerCase().includes(q) || s.testType.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <HospitalLayout
      title="Clinical Laboratory & Imaging Diagnostics"
      subtitle="QML-assisted pathology, bio-telemetry quantification, and explainable quantum diagnosis verification"
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Diagnostic Specimens</div>
            <div className="text-2xl font-bold text-white mt-1">1,787 Records</div>
            <div className="text-xs text-indigo-400 mt-1">Benchmarked cohorts</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Mean Quantum Confidence</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">95.2%</div>
            <div className="text-xs text-slate-400 mt-1">Calibrated statevector certainty</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Zero-Leakage Assurance</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">100% Isolated</div>
            <div className="text-xs text-slate-400 mt-1">Test specimens uncorrupted</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Explainability Status</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">Kernel SHAP Ready</div>
            <div className="text-xs text-slate-400 mt-1">Biomarker attribution available</div>
          </div>
        </div>

        {/* Filter and search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["all", "Oncology", "Cardiology", "Metabolic", "Neurology", "Genomics"].map((d) => (
              <button
                key={d}
                onClick={() => setActiveDomain(d)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                  activeDomain.toLowerCase() === d.toLowerCase()
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60"
                }`}
              >
                {d === "all" ? "All Modalities" : d}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specimen or test..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Specimen queue table */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Diagnostic Laboratory Worklist</h3>
              <p className="text-xs text-slate-400">Specimens verified through Quantum Kernel and Variational classifiers</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-700/60">
                <tr>
                  <th className="px-4 py-3">Specimen ID</th>
                  <th className="px-4 py-3">Patient Ref</th>
                  <th className="px-4 py-3">Diagnostic Modality</th>
                  <th className="px-4 py-3">Biomarker Quantification</th>
                  <th className="px-4 py-3">QML Model</th>
                  <th className="px-4 py-3">Risk Assessment</th>
                  <th className="px-4 py-3">Fidelity</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-white">{item.id}</td>
                    <td className="px-4 py-3 font-mono text-slate-300">{item.patientId}</td>
                    <td className="px-4 py-3 font-medium text-slate-200">{item.testType}</td>
                    <td className="px-4 py-3 font-mono text-slate-300 text-[11px]">{item.biomarkerValue}</td>
                    <td className="px-4 py-3 text-indigo-400 font-semibold">{item.qmlModelUsed}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.riskLevel === "High Risk"
                            ? "bg-rose-500/15 text-rose-400 border border-rose-500/25"
                            : item.riskLevel === "Moderate Risk"
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                            : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                        }`}
                      >
                        {item.riskLevel} ({(item.riskScore * 100).toFixed(0)}%)
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-cyan-300 font-semibold">{item.quantumConfidence}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/analysis`}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        Verify in Lab →
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
