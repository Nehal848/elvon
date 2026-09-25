"use client"

import React, { useEffect, useState } from "react"
import HospitalLayout from "@/components/hospital-layout"
import { Calendar, User, GitBranch, AlertCircle, Loader2 } from "lucide-react"

type VersionEntry = { 
  model_id: string; 
  model_name: string; 
  version: string; 
  date: string; 
  changelog: string; 
  deployed_by: string; 
  accuracy: number 
}

const DEFAULT_VERSIONS: VersionEntry[] = [
  {
    model_id: "MOD-CARDIO-02",
    model_name: "Quantum-Enhanced VQC Heart Classifier",
    version: "v2.2.0",
    date: "2026-09-14",
    changelog: "Upgraded variational ansatz with Entanglement-Enhanced ZZ feature maps (+2.2% F1 score).",
    deployed_by: "Dr. Vikram Sarabhai",
    accuracy: 96.8
  },
  {
    model_id: "MOD-CARDIO-01",
    model_name: "Ensemble CardioNet",
    version: "v2.4.1",
    date: "2026-09-10",
    changelog: "Retrained XGBoost + Random Forest ensemble with expanded multi-center cardiology cohort.",
    deployed_by: "Aarav Patel",
    accuracy: 94.6
  },
  {
    model_id: "MOD-LIVER-01",
    model_name: "Quantum HepatoVision Classifier",
    version: "v1.4.0",
    date: "2026-09-08",
    changelog: "Integrated PennyLane quantum kernel SVM pipeline with hardware noise mitigation.",
    deployed_by: "Dr. Vikram Sarabhai",
    accuracy: 95.3
  },
  {
    model_id: "MOD-RENAL-01",
    model_name: "RenalInsight AI",
    version: "v3.0.0",
    date: "2026-09-02",
    changelog: "Major release: added longitudinal eGFR trajectory prediction and automated stage grading.",
    deployed_by: "Aarav Patel",
    accuracy: 93.7
  },
  {
    model_id: "MOD-DIAB-01",
    model_name: "DeepGlycemia Predictor",
    version: "v1.8.2",
    date: "2026-08-28",
    changelog: "Calibrated probability thresholds for pre-diabetic early warning indicators.",
    deployed_by: "Dr. Ananya Sharma",
    accuracy: 92.4
  }
]

function formatDate(isoString: string) {
  if (!isoString) return "-"
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return isoString
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export default function VersionPage() {
  const [session, setSession] = useState<any>(null)
  const [versions, setVersions] = useState<VersionEntry[]>(DEFAULT_VERSIONS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filterModel, setFilterModel] = useState<string | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem("qml_session") || localStorage.getItem("hospital_ai_session")
    if (raw) setSession(JSON.parse(raw))

    fetchVersions()
  }, [])

  const fetchVersions = async () => {
    try {
      const res = await fetch("/api/hospital/versions")
      if (res.ok) {
        const data = await res.json()
        if (data.versions && data.versions.length > 0) {
          const sortedVersions = data.versions.sort((a: VersionEntry, b: VersionEntry) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          setVersions(sortedVersions)
          return
        }
      }
    } catch (err: any) {
      // Graceful fallback
    }
    setVersions(DEFAULT_VERSIONS)
  }

  const filtered = filterModel ? versions.filter(v => v.model_id === filterModel) : versions
  
  // Extract unique models for the filter pill buttons
  const modelNames = [...new Map(versions.map(v => [v.model_id, v.model_name.split("-")[0]])).entries()]

  return (
    <HospitalLayout 
      title={`Version History${session?.name ? ` for ${session.name}` : ''}`} 
      subtitle="Model version timeline, changelogs, and accuracy progression"
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Filter */}
        <div className="flex items-center gap-3 flex-wrap bg-white p-4 rounded-[20px] shadow-sm border border-slate-100">
          <span className="text-sm font-bold text-slate-500 mr-2">Filter by Base Model:</span>
          <button onClick={() => setFilterModel(null)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${!filterModel ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"}`}>
            All Models
          </button>
          {modelNames.map(([id, name]) => (
            <button key={id} onClick={() => setFilterModel(id)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${filterModel === id ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"}`}>
              {name}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Timeline */}
        <div className="relative pt-4">
          {/* Timeline line */}
          <div className="absolute left-6 top-4 bottom-0 w-0.5 bg-slate-200" />

          <div className="space-y-6 relative">
            {loading ? (
              <div className="flex items-center gap-3 ml-14 py-4">
                <Loader2 className="animate-spin text-slate-400" />
                <p className="text-sm text-slate-500 font-medium">Loading version history...</p>
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-slate-500 ml-14 py-4 font-medium">No versions found for the selected model.</p>
            ) : (
              filtered.map((v, i) => {
                const isLatest = i === 0 && !filterModel // if we filter, the 0th might not be the global latest, but it's the latest for that model
                
                return (
                  <div key={`${v.model_id}-${v.version}`} className="relative flex items-start gap-5 group">
                    {/* Timeline dot */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors ${
                      isLatest ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-white border-[3px] border-slate-200 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-500"
                    }`}>
                      <GitBranch size={isLatest ? 20 : 18} />
                    </div>

                    {/* Card */}
                    <div className={`flex-1 bg-white rounded-[20px] border p-6 shadow-sm transition-all hover:shadow-md ${
                      isLatest ? "border-indigo-200" : "border-slate-100"
                    }`}>
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-[16px] font-extrabold text-slate-900">{v.model_name}</h3>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              isLatest ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-600"
                            }`}>v{v.version}</span>
                            {isLatest && <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">Latest Master</span>}
                          </div>
                          <div className="flex items-center gap-4 text-[13px] text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-slate-400" /> {formatDate(v.date)}</span>
                            <span className="flex items-center gap-1.5"><User size={14} className="text-slate-400" /> {v.deployed_by}</span>
                          </div>
                        </div>
                        <div className="text-right md:min-w-[100px]">
                          <div className="text-[24px] font-black text-indigo-600 leading-none mb-1">{v.accuracy}%</div>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">accuracy</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-[14px] text-slate-700 leading-relaxed font-medium">
                          {v.changelog}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </HospitalLayout>
  )
}
