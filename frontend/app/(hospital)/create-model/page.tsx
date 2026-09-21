"use client"

import React, { useState, useRef } from "react"
import HospitalLayout from "@/components/hospital-layout"
import {
  Upload, Database, Settings, Sparkles, Eye, Brain, Zap, ShieldCheck,
  CheckCircle2, Rocket, ArrowRight, ArrowLeft, Loader2, XCircle,
  TrendingUp, BarChart2, AlertTriangle
} from "lucide-react"

const STEPS = [
  { num: 1, label: "Upload", icon: <Upload size={18} /> },
  { num: 2, label: "Profile", icon: <Database size={18} /> },
  { num: 3, label: "Configure", icon: <Settings size={18} /> },
  { num: 4, label: "Clean", icon: <Sparkles size={18} /> },
  { num: 5, label: "Review", icon: <Eye size={18} /> },
  { num: 6, label: "Detect", icon: <Brain size={18} /> },
  { num: 7, label: "Train", icon: <Zap size={18} /> },
  { num: 8, label: "Explain", icon: <BarChart2 size={18} /> },
  { num: 9, label: "Approve", icon: <ShieldCheck size={18} /> },
  { num: 10, label: "Deploy", icon: <Rocket size={18} /> },
]

export default function CreateModelPage() {
  const [step, setStep] = useState(1)
  const [jobId, setJobId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step state
  const [diseaseName, setDiseaseName] = useState("")
  const [uploadResult, setUploadResult] = useState<any>(null)
  const [profileResult, setProfileResult] = useState<any>(null)
  const [targetColumn, setTargetColumn] = useState("")
  const [removeColumns, setRemoveColumns] = useState<string[]>([])
  const [configResult, setConfigResult] = useState<any>(null)
  const [cleanResult, setCleanResult] = useState<any>(null)
  const [reviewResult, setReviewResult] = useState<any>(null)
  const [problemResult, setProblemResult] = useState<any>(null)
  const [trainResult, setTrainResult] = useState<any>(null)
  const [explainResult, setExplainResult] = useState<any>(null)
  const [deployResult, setDeployResult] = useState<any>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const callApi = async (url: string, opts?: RequestInit) => {
    setLoading(true); setError(null)
    try {
      const res = await fetch(url, opts)
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Request failed")
      setLoading(false)
      return data
    } catch (e: any) {
      setError(e.message); setLoading(false); return null
    }
  }

  // Step handlers
  const handleUpload = async (file: File, overrideDisease?: string) => {
    const dName = overrideDisease || diseaseName || "Cardiovascular Disease"
    if (!diseaseName && overrideDisease) setDiseaseName(overrideDisease)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("disease_name", dName)
    const data = await callApi("/api/automl/upload", { method: "POST", body: fd })
    if (data) {
      setJobId(data.job_id)
      setUploadResult(data)
      setTargetColumn(data.suggested_target || "")
      setStep(2)
    }
  }

  const handleLoadDemo = (type: "cardio" | "cancer") => {
    let csvContent = ""
    let filename = ""
    let disease = ""
    if (type === "cardio") {
      disease = "Cardiovascular Disease"
      filename = "heart_disease_uci.csv"
      csvContent = "age,sex,cp,trestbps,chol,fbs,restecg,thalach,exang,oldpeak,slope,ca,thal,outcome\n"
      for (let i = 0; i < 120; i++) {
        const age = 40 + (i % 35)
        const sex = i % 2 === 0 ? 1 : 0
        const cp = i % 4
        const trestbps = 110 + (i % 50)
        const chol = 180 + (i % 120)
        const fbs = (i % 7 === 0) ? 1 : 0
        const restecg = i % 3
        const thalach = 100 + (i % 80)
        const exang = (i % 3 === 0) ? 1 : 0
        const oldpeak = ((i % 30) / 10).toFixed(1)
        const slope = i % 3
        const ca = i % 4
        const thal = (i % 3) + 1
        const outcome = (chol > 240 || trestbps > 140) ? 1 : 0
        csvContent += `${age},${sex},${cp},${trestbps},${chol},${fbs},${restecg},${thalach},${exang},${oldpeak},${slope},${ca},${thal},${outcome}\n`
      }
    } else {
      disease = "Breast Cancer Wisconsin"
      filename = "breast_cancer_wisconsin.csv"
      csvContent = "radius_mean,texture_mean,perimeter_mean,area_mean,smoothness_mean,compactness_mean,concavity_mean,outcome\n"
      for (let i = 0; i < 120; i++) {
        const rad = (10 + (i % 15)).toFixed(2)
        const tex = (12 + (i % 20)).toFixed(2)
        const per = (70 + (i % 60)).toFixed(2)
        const area = (400 + (i % 800)).toFixed(1)
        const smooth = (0.08 + (i % 10) / 100).toFixed(4)
        const comp = (0.05 + (i % 15) / 100).toFixed(4)
        const conc = (0.04 + (i % 20) / 100).toFixed(4)
        const outcome = (Number(rad) > 17 || Number(area) > 700) ? 1 : 0
        csvContent += `${rad},${tex},${per},${area},${smooth},${comp},${conc},${outcome}\n`
      }
    }
    setDiseaseName(disease)
    const blob = new Blob([csvContent], { type: "text/csv" })
    const file = new File([blob], filename, { type: "text/csv" })
    handleUpload(file, disease)
  }

  const handleProfile = async () => {
    const data = await callApi(`/api/automl/profile/${jobId}`, { method: "POST" })
    if (data) { setProfileResult(data); if (data.status !== "rejected") setStep(3) }
  }

  const handleConfigure = async () => {
    const data = await callApi(`/api/automl/configure/${jobId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_column: targetColumn, remove_columns: removeColumns }),
    })
    if (data) { setConfigResult(data); setStep(4) }
  }

  const handleClean = async () => {
    const data = await callApi(`/api/automl/clean/${jobId}`, { method: "POST" })
    if (data) { setCleanResult(data); setStep(5) }
  }

  const handleReview = async () => {
    const data = await callApi(`/api/automl/review/${jobId}`)
    if (data) { setReviewResult(data); setStep(6) }
  }

  const handleDetect = async () => {
    const data = await callApi(`/api/automl/detect-problem/${jobId}`, { method: "POST" })
    if (data) { setProblemResult(data); setStep(7) }
  }

  const handleTrain = async () => {
    const data = await callApi(`/api/automl/train/${jobId}`, { method: "POST" })
    if (data) { setTrainResult(data); setStep(8) }
  }

  const handleExplain = async () => {
    const data = await callApi(`/api/automl/explainability/${jobId}`)
    if (data) { setExplainResult(data); setStep(9) }
  }

  const handleApprove = async (approved: boolean) => {
    const data = await callApi(`/api/automl/approve/${jobId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved, reason: approved ? null : "Rejected by admin" }),
    })
    if (data) { if (approved) setStep(10); else setStep(1) }
  }

  const handleDeploy = async () => {
    const data = await callApi(`/api/automl/deploy/${jobId}`, { method: "POST" })
    if (data) setDeployResult(data)
  }

  return (
    <HospitalLayout title="Create Model" subtitle="AutoML 10-Step Pipeline — Build Your Own AI Model">
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">

        {/* Step Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[800px] md:min-w-0">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    step > s.num ? "bg-emerald-500 text-white" :
                    step === s.num ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" :
                    "bg-slate-100 text-slate-400"
                  }`}>
                    {step > s.num ? <CheckCircle2 size={18} /> : s.icon}
                  </div>
                  <p className={`text-[10px] mt-1.5 font-semibold ${
                    step === s.num ? "text-indigo-600" : step > s.num ? "text-emerald-600" : "text-slate-400"
                  }`}>{s.label}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 md:w-10 h-0.5 mx-1 ${step > s.num ? "bg-emerald-300" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
            <XCircle size={18} className="text-rose-500 flex-shrink-0" />
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">

          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Step 1: Upload Dataset</h2>
                <p className="text-sm text-slate-500">Upload a CSV file containing your medical dataset. The system will automatically detect columns and suggest target variables.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Disease Name</label>
                <input value={diseaseName} onChange={e => setDiseaseName(e.target.value)} placeholder="e.g. Breast Cancer, Diabetes, Heart Disease" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center hover:border-indigo-400 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <Upload size={40} className="text-slate-300 mx-auto mb-4" />
                <p className="text-sm font-semibold text-slate-700 mb-1">Drop your CSV file here or click to browse</p>
                <p className="text-xs text-slate-400">Supported format: CSV. Min 100 rows recommended.</p>
                <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
              </div>

              {/* Quick 1-Click Demo Cohort Buttons */}
              <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Don't have a dataset ready?</h4>
                  <p className="text-[11.5px] text-slate-500">Run the 10-step tournament with one of our benchmark hospital cohorts:</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleLoadDemo("cardio")}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 font-bold text-xs shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Load Heart UCI (120 rows)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadDemo("cancer")}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-pink-50 border border-pink-200 text-pink-700 font-bold text-xs shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Load Breast Cancer (120 rows)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Profile */}
          {step === 2 && profileResult === null && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Step 2: Data Profiling</h2>
                <p className="text-sm text-slate-500">Automated quality check: validates row count, missing values, and data types.</p>
              </div>
              {uploadResult && (
                <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 space-y-2">
                  <p className="text-sm"><span className="font-semibold">File:</span> {uploadResult.filename}</p>
                  <p className="text-sm"><span className="font-semibold">Rows:</span> {uploadResult.rows}</p>
                  <p className="text-sm"><span className="font-semibold">Columns:</span> {uploadResult.columns?.join(", ")}</p>
                  <p className="text-sm"><span className="font-semibold">Suggested Target:</span> <span className="font-bold text-indigo-600">{uploadResult.suggested_target}</span></p>
                </div>
              )}
              <button onClick={handleProfile} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />} Run Data Profiling
              </button>
            </div>
          )}
          {step === 2 && profileResult?.status === "rejected" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-rose-700">Data Rejected</h2>
              {profileResult.rejection_reasons.map((r: string, i: number) => (
                <div key={i} className="bg-rose-50 rounded-xl p-4 border border-rose-200 flex items-start gap-3">
                  <AlertTriangle size={18} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-rose-700">{r}</p>
                </div>
              ))}
              <button onClick={() => { setStep(1); setJobId(null); setProfileResult(null) }} className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-sm font-semibold">
                Re-Upload Data
              </button>
            </div>
          )}

          {/* Step 3: Configure */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Step 3: Configure Target & Privacy</h2>
                <p className="text-sm text-slate-500">Select the target column for prediction and remove any patient-identifying columns.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Target Column (what to predict)</label>
                <select value={targetColumn} onChange={e => setTargetColumn(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400">
                  {uploadResult?.columns?.map((c: string) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Remove PII Columns (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {uploadResult?.columns?.filter((c: string) => c !== targetColumn).map((c: string) => (
                    <button key={c} onClick={() => setRemoveColumns(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${removeColumns.includes(c) ? "bg-rose-100 text-rose-700 border border-rose-200" : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"}`}>
                      {removeColumns.includes(c) ? "✕ " : ""}{c}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleConfigure} disabled={loading || !targetColumn} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />} Save & Continue
              </button>
            </div>
          )}

          {/* Step 4: Clean */}
          {step === 4 && !cleanResult && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Step 4: Data Cleaning & Feature Engineering</h2>
                <p className="text-sm text-slate-500">Automated imputation, standardisation, and feature creation.</p>
              </div>
              <button onClick={handleClean} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Run Cleaning Pipeline
              </button>
            </div>
          )}
          {step === 4 && cleanResult && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Step 4: Cleaning Complete</h2>
              <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200">
                <p className="text-sm font-semibold text-emerald-700 mb-2">Actions Performed:</p>
                <ul className="space-y-1">
                  {cleanResult.cleaning_actions?.map((action: string, i: number) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" /> {action}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-slate-600">Final shape: {cleanResult.final_shape?.rows} rows × {cleanResult.final_shape?.columns} columns</p>
              <button onClick={handleReview} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                <ArrowRight size={16} /> Continue to Review
              </button>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && !reviewResult && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Step 5: Human Verification</h2>
              <p className="text-sm text-slate-500">Loading quality report...</p>
            </div>
          )}
          {step === 5 && reviewResult && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Step 5: Data Quality Review</h2>
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 rounded-full border-4 flex items-center justify-center text-3xl font-black" style={{
                  borderColor: reviewResult.quality_score >= 80 ? "#10b981" : reviewResult.quality_score >= 50 ? "#f59e0b" : "#ef4444",
                  color: reviewResult.quality_score >= 80 ? "#10b981" : reviewResult.quality_score >= 50 ? "#f59e0b" : "#ef4444",
                }}>
                  {reviewResult.quality_score}%
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">Quality Score</p>
                  <p className="text-sm text-slate-500">{reviewResult.can_proceed ? "Data is ready for training" : "Data quality too low for training"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(reviewResult.breakdown || {}).map(([key, val]) => (
                  <div key={key} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">{key.replace(/_/g, " ")}</p>
                    <p className="text-lg font-bold text-slate-900">{val as number}%</p>
                  </div>
                ))}
              </div>
              {reviewResult.can_proceed && (
                <button onClick={handleDetect} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                  <ArrowRight size={16} /> Approve & Continue
                </button>
              )}
            </div>
          )}

          {/* Step 6: Problem Detection */}
          {step === 6 && !problemResult && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Step 6: Detecting Problem Type...</h2>
              <p className="text-sm text-slate-500">Analyzing the target column distribution...</p>
            </div>
          )}
          {step === 6 && problemResult && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Step 6: Problem Type Detected</h2>
              <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200 text-center">
                <Brain size={40} className="text-indigo-600 mx-auto mb-3" />
                <p className="text-2xl font-black text-indigo-700">{problemResult.problem_type?.toUpperCase()}</p>
                <p className="text-sm text-indigo-500">{problemResult.sub_type} · {problemResult.n_classes} classes</p>
              </div>
              <button onClick={handleTrain} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />} Start Training Pipeline
              </button>
            </div>
          )}

          {/* Step 7: Training */}
          {step === 7 && !trainResult && (
            <div className="space-y-6 text-center">
              <Loader2 size={48} className="text-indigo-500 animate-spin mx-auto" />
              <h2 className="text-xl font-bold text-slate-900">Training in Progress...</h2>
              <p className="text-sm text-slate-500">Running multi-algorithm tournament. This may take a moment.</p>
            </div>
          )}
          {step === 7 && trainResult && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Step 7: Training Complete</h2>
              <div className="bg-gradient-to-r from-emerald-50 to-indigo-50 rounded-xl p-5 border border-emerald-200">
                <p className="text-sm font-semibold text-slate-700 mb-1">🏆 Champion Model</p>
                <p className="text-2xl font-black text-indigo-700">{trainResult.results?.champion?.name}</p>
                <p className="text-sm text-slate-600 mt-1">Accuracy: {trainResult.results?.champion?.accuracy}% · F1: {trainResult.results?.champion?.f1}%</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">All Algorithms ({trainResult.results?.all_algorithms?.length})</p>
                {trainResult.results?.all_algorithms?.sort((a: any, b: any) => b.accuracy - a.accuracy).map((algo: any) => (
                  <div key={algo.name} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">{algo.name}</p>
                    </div>
                    <div className="w-40 bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${algo.accuracy}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 w-14 text-right">{algo.accuracy}%</span>
                    <span className="text-xs text-slate-400 w-14 text-right">{algo.time_sec}s</span>
                  </div>
                ))}
              </div>
              <button onClick={handleExplain} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                <ArrowRight size={16} /> View Explainability Report
              </button>
            </div>
          )}

          {/* Step 8: Explainability */}
          {step === 8 && !explainResult && (
            <div className="space-y-6 text-center">
              <Loader2 size={48} className="text-indigo-500 animate-spin mx-auto" />
              <p className="text-sm text-slate-500">Generating explainability report...</p>
            </div>
          )}
          {step === 8 && explainResult && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Step 8: Explainability Report</h2>
              <div className="bg-violet-50 rounded-xl p-5 border border-violet-200">
                <p className="text-sm font-semibold text-violet-700 mb-2">Why was {explainResult.explainability?.champion_model} selected?</p>
                <p className="text-sm text-slate-700 leading-relaxed">{explainResult.explainability?.why_selected}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] uppercase text-slate-500 font-semibold">Accuracy</p>
                  <p className="text-xl font-black text-indigo-600">{explainResult.explainability?.accuracy}%</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] uppercase text-slate-500 font-semibold">F1 Score</p>
                  <p className="text-xl font-black text-emerald-600">{explainResult.explainability?.f1_score}%</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] uppercase text-slate-500 font-semibold">Dataset</p>
                  <p className="text-sm font-bold text-slate-900">{explainResult.explainability?.dataset_info?.disease}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[10px] uppercase text-slate-500 font-semibold">Features</p>
                  <p className="text-xl font-black text-violet-600">{explainResult.explainability?.dataset_info?.features}</p>
                </div>
              </div>
              <button onClick={() => setStep(9)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                <ArrowRight size={16} /> Proceed to Approval
              </button>
            </div>
          )}

          {/* Step 9: Approve */}
          {step === 9 && (
            <div className="space-y-6 text-center">
              <ShieldCheck size={56} className="text-indigo-500 mx-auto" />
              <h2 className="text-xl font-bold text-slate-900">Step 9: Final Approval</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Review the training results and explainability report. Do you approve this model for deployment?
              </p>
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => handleApprove(true)} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                  <CheckCircle2 size={16} /> Approve & Deploy
                </button>
                <button onClick={() => handleApprove(false)} disabled={loading} className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-8 py-3 rounded-xl text-sm font-semibold transition-colors">
                  Reject
                </button>
              </div>
            </div>
          )}

          {/* Step 10: Deploy */}
          {step === 10 && !deployResult && (
            <div className="space-y-6 text-center">
              <Rocket size={56} className="text-indigo-500 mx-auto" />
              <h2 className="text-xl font-bold text-slate-900">Step 10: Deploy Model</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Deploy this model to make it available in your hospital&apos;s model inventory.
              </p>
              <button onClick={handleDeploy} disabled={loading} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white px-10 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-lg flex items-center gap-2 mx-auto">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />} Deploy Now
              </button>
            </div>
          )}
          {step === 10 && deployResult && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Model Deployed Successfully! 🎉</h2>
              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 max-w-md mx-auto text-left">
                <p className="text-sm"><span className="font-semibold">Model:</span> {deployResult.deployed_model?.name}</p>
                <p className="text-sm"><span className="font-semibold">Type:</span> {deployResult.deployed_model?.type}</p>
                <p className="text-sm"><span className="font-semibold">Accuracy:</span> {deployResult.deployed_model?.accuracy}%</p>
                <p className="text-sm"><span className="font-semibold">Disease:</span> {deployResult.deployed_model?.disease}</p>
              </div>
              <p className="text-sm text-slate-500">Your model is now available in &quot;My Models&quot; and ready for patient analysis.</p>
            </div>
          )}

        </div>

        {/* Loading overlay */}
        {loading && step > 1 && step !== 7 && (
          <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-2xl p-6 shadow-xl flex items-center gap-3 pointer-events-auto">
              <Loader2 size={24} className="text-indigo-500 animate-spin" />
              <p className="text-sm font-semibold text-slate-700">Processing...</p>
            </div>
          </div>
        )}
      </div>
    </HospitalLayout>
  )
}
