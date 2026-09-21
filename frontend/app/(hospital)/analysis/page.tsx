"use client"

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import HospitalLayout from "@/components/hospital-layout"
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ScatterChart, Scatter
} from "recharts"

// ─── Types ────────────────────────────────────────────────────────────────────
type ModelResult = {
  model_name: string; category: string;
  accuracy: number; sensitivity: number; specificity: number;
  precision: number; f1_score: number; roc_auc: number;
  training_time_sec: number; inference_latency_ms: number;
  confusion_matrix: { TP: number; TN: number; FP: number; FN: number };
  roc_curve: { fpr: number; tpr: number }[];
  quantum_resources?: Record<string, any>;
}

type ExperimentResult = {
  experiment_id: string; dataset_name: string; target_col: string;
  total_runtime_sec: number;
  pipeline: { n_qubits: number; n_features_selected: number; pca_variance_pct: number; selected_features: string[]; leakage_audit: any; data_splits: any }
  benchmark: { all_models: ModelResult[]; classical_champion: ModelResult; quantum_champion: ModelResult;
    comparison_deltas: { delta_accuracy_pct: number; delta_sensitivity_pct: number; delta_roc_auc: number };
    outcome: string; conclusion: string; hardware_readiness: any; consensus_analysis: any }
  vqc_loss_history: { loss: number[]; val_loss: number[] }
}

// ─── Colour palette ───────────────────────────────────────────────────────────
const COLORS = {
  accent: "#6366f1", accent2: "#8b5cf6", cyan: "#06b6d4",
  green: "#10b981", orange: "#f59e0b", red: "#ef4444",
  text: "#f1f5f9", text2: "#94a3b8", text3: "#64748b",
  bg: "#05070f", surface: "#0d1121", surface2: "#111827", border: "rgba(99,102,241,0.15)"
}

const MODEL_COLORS: Record<string, string> = {
  "Hybrid QML": "#6366f1",
  "Classical ML": "#10b981",
}

const DATASETS = [
  { id: "breast_cancer", label: "Breast Cancer (WDBC)", features: 30, samples: 569, domain: "Oncology" },
  { id: "heart_disease", label: "Cardiovascular Disease", features: 13, samples: 303, domain: "Cardiology" },
  { id: "diabetes", label: "Diabetes Screening", features: 8, samples: 500, domain: "Metabolic" },
  { id: "parkinsons", label: "Parkinson's Disease", features: 22, samples: 195, domain: "Neurology" },
  { id: "genomics", label: "Gene Expression Genomics", features: 200, samples: 220, domain: "Precision Medicine" },
]

// ─── Utility components ───────────────────────────────────────────────────────
function Badge({ label, color = COLORS.accent }: { label: string; color?: string }) {
  return (
    <span style={{
      background: color + "1a", border: `1px solid ${color}40`, color,
      fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20,
      letterSpacing: "0.5px", textTransform: "uppercase" as const
    }}>{label}</span>
  )
}

function Card({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: COLORS.surface, border: `1px solid ${COLORS.border}`,
      borderRadius: 16, padding: 24, ...style
    }} className={className}>{children}</div>
  )
}

function MetricPill({ label, value, color = COLORS.accent }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{
      background: COLORS.surface2, border: `1px solid ${COLORS.border}`,
      borderRadius: 10, padding: "10px 14px", textAlign: "center" as const, minWidth: 80
    }}>
      <div style={{ fontSize: 18, fontWeight: 800, color, letterSpacing: "-0.5px" }}>{value}</div>
      <div style={{ fontSize: 10, color: COLORS.text3, fontWeight: 600, marginTop: 2, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{label}</div>
    </div>
  )
}

function ConfusionMatrix({ cm, name }: { cm: { TP: number; TN: number; FP: number; FN: number }; name: string }) {
  const total = cm.TP + cm.TN + cm.FP + cm.FN
  const cells = [
    { label: "TN", value: cm.TN, sub: "True Negative", color: COLORS.green },
    { label: "FP", value: cm.FP, sub: "False Positive", color: COLORS.red },
    { label: "FN", value: cm.FN, sub: "False Negative", color: COLORS.orange },
    { label: "TP", value: cm.TP, sub: "True Positive", color: COLORS.cyan },
  ]
  return (
    <div>
      <div style={{ fontSize: 12, color: COLORS.text2, marginBottom: 10, fontWeight: 600 }}>Confusion Matrix — {name}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {cells.map(c => (
          <div key={c.label} style={{
            background: c.color + "12", border: `1px solid ${c.color}30`,
            borderRadius: 10, padding: "14px 10px", textAlign: "center" as const
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 9, color: c.color, fontWeight: 700, marginTop: 2 }}>{c.label}</div>
            <div style={{ fontSize: 9, color: COLORS.text3, marginTop: 1 }}>{c.sub}</div>
            <div style={{ fontSize: 9, color: COLORS.text3 }}>{total > 0 ? ((c.value / total) * 100).toFixed(1) : 0}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ROCChart({ models, selectedModels }: { models: ModelResult[]; selectedModels: string[] }) {
  const filtered = models.filter(m => selectedModels.includes(m.model_name) && m.roc_curve && m.roc_curve.length > 0)
  if (filtered.length === 0) return <div style={{ color: COLORS.text3, fontSize: 13, padding: 16, textAlign: "center" }}>ROC data not available for selected models</div>

  const colors = [COLORS.accent, COLORS.cyan, COLORS.green, COLORS.orange, "#f472b6", "#a78bfa", "#34d399", "#fb923c"]
  const baselineData = [{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]

  // Combine all data points for recharts
  const maxPts = Math.max(...filtered.map(m => m.roc_curve.length))
  const chartData = Array.from({ length: Math.max(maxPts, 10) }, (_, i) => {
    const pt: any = {}
    filtered.forEach(m => {
      const idx = Math.min(i, m.roc_curve.length - 1)
      const p = m.roc_curve[idx]
      const shortName = m.model_name.replace(" (QSVM)", "").replace(" Quantum Classifier", " VQC").replace(" Classifier", "")
      pt[shortName] = p ? p.tpr : null
      pt.fpr = p ? p.fpr : i / (maxPts - 1)
    })
    return pt
  })

  const lineKeys = filtered.map(m => m.model_name.replace(" (QSVM)", "").replace(" Quantum Classifier", " VQC").replace(" Classifier", ""))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: -16, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
        <XAxis dataKey="fpr" tickFormatter={(v) => v.toFixed(1)} label={{ value: "FPR", position: "insideBottom", fill: COLORS.text3, fontSize: 10 }} tick={{ fill: COLORS.text3, fontSize: 10 }} />
        <YAxis tickFormatter={(v) => v.toFixed(1)} label={{ value: "TPR", angle: -90, position: "insideLeft", fill: COLORS.text3, fontSize: 10 }} tick={{ fill: COLORS.text3, fontSize: 10 }} />
        <Tooltip
          contentStyle={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 11 }}
          labelFormatter={(v) => `FPR: ${Number(v).toFixed(2)}`}
        />
        <Legend wrapperStyle={{ fontSize: 10, color: COLORS.text2 }} />
        {lineKeys.map((key, i) => (
          <Line key={key} type="monotone" dataKey={key} stroke={colors[i % colors.length]} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

function ModelTable({ models }: { models: ModelResult[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            {["Model", "Category", "Accuracy", "Sensitivity", "Specificity", "Precision", "F1", "ROC-AUC", "Train (s)", "Infer (ms)"].map(h => (
              <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: COLORS.text3, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {models.map((m, i) => (
            <tr key={m.model_name} style={{ borderBottom: `1px solid rgba(99,102,241,0.06)`, background: i % 2 === 0 ? "transparent" : "rgba(99,102,241,0.02)" }}>
              <td style={{ padding: "10px 12px", color: COLORS.text, fontWeight: 600, maxWidth: 200, whiteSpace: "nowrap" }}>{m.model_name}</td>
              <td style={{ padding: "10px 12px" }}>
                <Badge label={m.category === "Hybrid QML" ? "Quantum" : "Classical"} color={m.category === "Hybrid QML" ? COLORS.accent : COLORS.green} />
              </td>
              <td style={{ padding: "10px 12px", color: m.accuracy >= 85 ? COLORS.green : COLORS.text, fontWeight: 700 }}>{m.accuracy}%</td>
              <td style={{ padding: "10px 12px", color: COLORS.text2 }}>{m.sensitivity}%</td>
              <td style={{ padding: "10px 12px", color: COLORS.text2 }}>{m.specificity}%</td>
              <td style={{ padding: "10px 12px", color: COLORS.text2 }}>{m.precision}%</td>
              <td style={{ padding: "10px 12px", color: COLORS.text2 }}>{m.f1_score}%</td>
              <td style={{ padding: "10px 12px", color: m.roc_auc >= 0.85 ? COLORS.cyan : COLORS.text2, fontWeight: 700 }}>{m.roc_auc.toFixed(4)}</td>
              <td style={{ padding: "10px 12px", color: COLORS.text3 }}>{m.training_time_sec.toFixed(3)}</td>
              <td style={{ padding: "10px 12px", color: COLORS.text3 }}>{m.inference_latency_ms.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function QuantumLabPage() {
  // Config state
  const [selectedDataset, setSelectedDataset] = useState("heart_disease")
  const [nQubits, setNQubits] = useState(6)
  const [nSelectedFeatures, setNSelectedFeatures] = useState(12)
  const [backendType, setBackendType] = useState("ideal")
  const [noiseRate, setNoiseRate] = useState(0.015)
  const [shots, setShots] = useState(1024)
  const [vqcIter, setVqcIter] = useState(25)

  // Execution state
  const [isRunning, setIsRunning] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [datasetProfile, setDatasetProfile] = useState<any>(null)
  const [experimentResult, setExperimentResult] = useState<ExperimentResult | null>(null)
  const [statusMessage, setStatusMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [activeTab, setActiveTab] = useState<"config" | "results" | "roc" | "confusion" | "noise" | "sweep" | "xai" | "predict">("config")

  // ROC chart model selection
  const [rocSelectedModels, setRocSelectedModels] = useState<string[]>([])

  // Prediction state
  const [predictModel, setPredictModel] = useState("Quantum Kernel (QSVM)")
  const [predictThreshold, setPredictThreshold] = useState(0.5)
  const [sampleValues, setSampleValues] = useState<Record<string, number>>({
    age: 58, sex: 1, chest_pain_type: 2, resting_bp: 140, cholesterol: 250,
    fasting_blood_sugar: 0, rest_ecg: 1, max_heart_rate: 145, exercise_angina: 1,
    st_depression: 1.6, st_slope: 1, num_major_vessels: 1, thalassemia: 2
  })
  const [predictionResult, setPredictionResult] = useState<any>(null)
  const [predictLoading, setPredictLoading] = useState(false)

  // XAI
  const [xaiResult, setXaiResult] = useState<any>(null)
  const [xaiLoading, setXaiLoading] = useState(false)

  // Noise impact
  const [noiseResult, setNoiseResult] = useState<any>(null)
  const [noiseLoading, setNoiseLoading] = useState(false)
  const [noiseRateInput, setNoiseRateInput] = useState(0.015)

  // Dimension sweep
  const [sweepResult, setSweepResult] = useState<any>(null)
  const [sweepLoading, setSweepLoading] = useState(false)

  // Hardware status
  const [hardwareStatus, setHardwareStatus] = useState<any>(null)

  useEffect(() => {
    fetchHardwareStatus()
    fetchProfile("heart_disease")
  }, [])

  useEffect(() => {
    if (experimentResult) {
      const modelNames = experimentResult.benchmark.all_models.map(m => m.model_name)
      setRocSelectedModels(modelNames.slice(0, 4))
    }
  }, [experimentResult])

  async function fetchHardwareStatus() {
    try {
      const res = await fetch("/api/qml/hardware/status")
      if (res.ok) setHardwareStatus(await res.json())
    } catch { }
  }

  async function fetchProfile(name: string) {
    setProfileLoading(true)
    setErrorMessage("")
    try {
      const res = await fetch("/api/qml/datasets/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset_name: name, target_col: "target" })
      })
      if (!res.ok) throw new Error("Failed to load dataset profile")
      setDatasetProfile(await res.json())
      // Update sample values for different datasets
      if (name === "breast_cancer") {
        setSampleValues({ "mean radius": 17.99, "mean texture": 10.38, "mean perimeter": 122.8, "mean area": 1001.0, "mean smoothness": 0.1184, "mean compactness": 0.2776, "mean concavity": 0.3001, "mean concave points": 0.1471, "mean symmetry": 0.2419 })
      } else if (name === "parkinsons") {
        setSampleValues({ mdvp_fo_hz: 154.2, mdvp_fhi_hz: 197.1, mdvp_flo_hz: 116.3, mdvp_jitter_pct: 0.006, nhr: 0.025, hnr: 21.9, rpde: 0.45, dfa: 0.7, ppe: 0.3 })
      } else if (name === "genomics") {
        const gSample: Record<string, number> = {}
        for (let i = 1; i <= 20; i++) gSample[`GENE_${String(i).padStart(3, "0")}`] = parseFloat((Math.random() * 4 - 2).toFixed(3))
        setSampleValues(gSample)
      } else {
        setSampleValues({ age: 58, sex: 1, chest_pain_type: 2, resting_bp: 140, cholesterol: 250, fasting_blood_sugar: 0, rest_ecg: 1, max_heart_rate: 145, exercise_angina: 1, st_depression: 1.6, st_slope: 1, num_major_vessels: 1, thalassemia: 2 })
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load profile")
    } finally {
      setProfileLoading(false)
    }
  }

  async function handleRunExperiment() {
    setIsRunning(true)
    setErrorMessage("")
    setStatusMessage("Initializing Data Pipeline & Strict Leakage Guard…")
    try {
      const nFeatures = selectedDataset === "genomics" ? Math.min(nSelectedFeatures, 50) : nSelectedFeatures
      const res = await fetch("/api/qml/experiment/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataset_name: selectedDataset,
          n_pca_components: nQubits,
          n_selected_features: nFeatures,
          backend_type: backendType,
          noise_rate: noiseRate,
          shots,
          vqc_iterations: vqcIter,
          seed: 42
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Experiment execution failed")
      setExperimentResult(data)
      setStatusMessage(`✅ Experiment ${data.experiment_id} completed in ${data.total_runtime_sec}s!`)
      setActiveTab("results")
    } catch (err: any) {
      setErrorMessage(err.message || "Execution error")
    } finally {
      setIsRunning(false)
    }
  }

  async function handleNoiseImpact() {
    if (!experimentResult) return
    setNoiseLoading(true)
    try {
      const res = await fetch("/api/qml/benchmark/noise-impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experiment_id: experimentResult.experiment_id, noise_rate: noiseRateInput })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Noise impact failed")
      setNoiseResult(data)
    } catch (err: any) {
      setErrorMessage(err.message || "Noise analysis error")
    } finally {
      setNoiseLoading(false)
    }
  }

  async function handleDimensionSweep() {
    if (!experimentResult) return
    setSweepLoading(true)
    try {
      const res = await fetch("/api/qml/benchmark/dimension-sweep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experiment_id: experimentResult.experiment_id, qubit_counts: [4, 6, 8, 10] })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Dimension sweep failed")
      setSweepResult(data)
    } catch (err: any) {
      setErrorMessage(err.message || "Dimension sweep error")
    } finally {
      setSweepLoading(false)
    }
  }

  async function handlePredict() {
    if (!experimentResult) return
    setPredictLoading(true)
    setErrorMessage("")
    try {
      const res = await fetch("/api/qml/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experiment_id: experimentResult.experiment_id, model_name: predictModel, sample_values: sampleValues, threshold: predictThreshold })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Prediction failed")
      setPredictionResult(data)
    } catch (err: any) {
      setErrorMessage(err.message || "Prediction error")
    } finally {
      setPredictLoading(false)
    }
  }

  async function handleExplain() {
    if (!experimentResult) return
    setXaiLoading(true)
    setErrorMessage("")
    try {
      const res = await fetch("/api/qml/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experiment_id: experimentResult.experiment_id, model_name: predictModel, sample_values: sampleValues })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "XAI request failed")
      setXaiResult(data)
    } catch (err: any) {
      setErrorMessage(err.message || "XAI error")
    } finally {
      setXaiLoading(false)
    }
  }

  function handleExportReport() {
    if (!experimentResult) return
    const blob = new Blob([JSON.stringify(experimentResult, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `QML_Report_${experimentResult.experiment_id}.json`
    a.click()
  }

  const lossData = experimentResult?.vqc_loss_history?.loss?.map((l: number, i: number) => ({
    iteration: i + 1, train_loss: l,
    val_loss: experimentResult!.vqc_loss_history.val_loss?.[i] ?? l
  })) || []

  const benchmarkChartData = experimentResult?.benchmark?.all_models?.map((m) => ({
    name: m.model_name.replace(" (QSVM)", "").replace("Variational ", "").replace("Quantum ", "Q-").replace(" Classifier", "").replace("Gradient Boosting", "GradBoost").replace("Random Forest", "RF").replace("Logistic Regression", "LR").replace("Support Vector Machine", "SVM"),
    accuracy: m.accuracy, roc_auc: Math.round(m.roc_auc * 100), f1: m.f1_score,
    category: m.category
  })) || []

  const sweepChartData = sweepResult?.dimension_sweep?.filter((s: any) => !s.error).map((s: any) => ({
    qubits: s.n_qubits, accuracy: s.accuracy_pct, roc_auc: Math.round(s.roc_auc * 100), depth: s.circuit_depth
  })) || []

  // ── Styles ──────────────────────────────────────────────────────────────────
  const S = {
    page: {
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: COLORS.bg, minHeight: "100vh", color: COLORS.text,
    } as React.CSSProperties,
    topbar: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 32px", background: "rgba(5,7,15,0.9)", backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${COLORS.border}`, position: "sticky" as const, top: 0, zIndex: 50,
    },
    logo: { fontWeight: 800, fontSize: 16, color: COLORS.accent, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 },
    main: { maxWidth: 1400, margin: "0 auto", padding: "28px 24px" },
    tabs: { display: "flex", gap: 4, padding: "4px", background: COLORS.surface, borderRadius: 12, marginBottom: 24, flexWrap: "wrap" as const },
    tab: (active: boolean) => ({
      padding: "9px 18px", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer",
      border: "none", transition: "all 0.2s", whiteSpace: "nowrap" as const,
      background: active ? COLORS.accent : "transparent",
      color: active ? "white" : COLORS.text2,
    }),
    label: { fontSize: 12, color: COLORS.text3, fontWeight: 600, marginBottom: 6, letterSpacing: "0.3px" },
    input: {
      width: "100%", background: COLORS.surface2, border: `1px solid ${COLORS.border}`,
      borderRadius: 8, padding: "8px 12px", color: COLORS.text, fontSize: 14, outline: "none",
    },
    select: {
      width: "100%", background: COLORS.surface2, border: `1px solid ${COLORS.border}`,
      borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 14, outline: "none",
      cursor: "pointer", appearance: "auto" as const,
    },
    btnPrimary: {
      background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent2})`,
      color: "white", border: "none", padding: "12px 24px", borderRadius: 10,
      fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
    },
    btnSecondary: {
      background: "transparent", border: `1.5px solid ${COLORS.border}`,
      color: COLORS.text2, padding: "10px 18px", borderRadius: 10,
      fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
    },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 } as React.CSSProperties,
    grid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 } as React.CSSProperties,
    sectionTitle: { fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 16 },
    outcomeCard: (outcome: string) => ({
      background: outcome.includes("Case A") ? `${COLORS.cyan}12` : outcome.includes("Case B") ? `${COLORS.orange}12` : `${COLORS.accent}12`,
      border: `1px solid ${outcome.includes("Case A") ? COLORS.cyan : outcome.includes("Case B") ? COLORS.orange : COLORS.accent}30`,
      borderRadius: 12, padding: "20px 24px", marginBottom: 20,
    }),
  }

  const allModelNames = experimentResult?.benchmark?.all_models?.map(m => m.model_name) ?? []

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0d1121; }
        ::-webkit-scrollbar-thumb { background: #6366f140; border-radius: 3px; }
        select option { background: #0d1121; color: #f1f5f9; }
        .param-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; }
        @media (max-width: 768px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <HospitalLayout title="Quantum Research Laboratory" subtitle="Hybrid QML Benchmarks · QSVM, VQC, QNN vs Classical across 5 biomedical datasets">
        <div style={{ ...S.page, minHeight: "auto", background: "transparent" }}>
          {/* Action Header Bar */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <Badge label="ELVON · Quantum Lab" color={COLORS.accent2} />
            {hardwareStatus && <Badge label={`Backend: ${hardwareStatus.active_backend}`} color={COLORS.cyan} />}
            {experimentResult && (
              <button style={S.btnSecondary} onClick={handleExportReport}>
                ⬇ Export JSON Report
              </button>
            )}
          </div>

          <div style={{ ...S.main, padding: 0 }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.5px", marginBottom: 8 }}>
              ⚗️ Quantum Research Laboratory
            </h1>
            <p style={{ fontSize: 15, color: COLORS.text2 }}>
              Configure, execute, and analyse Hybrid QML benchmarks — QSVM · VQC · QNN vs Classical baselines across 5 biomedical datasets.
            </p>
          </div>

          {/* Error banner */}
          {errorMessage && (
            <div style={{ background: "#ef444420", border: "1px solid #ef444440", borderRadius: 10, padding: "12px 18px", marginBottom: 20, color: "#fca5a5", fontSize: 13 }}>
              ⚠️ {errorMessage}
            </div>
          )}
          {statusMessage && !errorMessage && (
            <div style={{ background: "#10b98120", border: "1px solid #10b98140", borderRadius: 10, padding: "12px 18px", marginBottom: 20, color: "#6ee7b7", fontSize: 13 }}>
              {statusMessage}
            </div>
          )}

          {/* Tabs */}
          <div style={S.tabs}>
            {[
              { key: "config", label: "⚙️ Configure" },
              { key: "results", label: "📊 Results" },
              { key: "roc", label: "📈 ROC Curves" },
              { key: "confusion", label: "🔲 Confusion Matrix" },
              { key: "noise", label: "🌊 Noise Impact" },
              { key: "sweep", label: "🔭 Dimension Sweep" },
              { key: "predict", label: "🎯 Predict" },
              { key: "xai", label: "🔬 Explain (XAI)" },
            ].map(t => (
              <button key={t.key} style={S.tab(activeTab === t.key)} onClick={() => setActiveTab(t.key as any)}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── CONFIG TAB ─────────────────────────────────────────────────────── */}
          {activeTab === "config" && (
            <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }} className="main-grid">
              {/* Left: Config Panel */}
              <Card>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Experiment Configuration</div>

                {/* Dataset */}
                <div style={{ marginBottom: 16 }}>
                  <div style={S.label}>Benchmark Dataset</div>
                  <select style={S.select} value={selectedDataset} onChange={e => { setSelectedDataset(e.target.value); fetchProfile(e.target.value) }}>
                    {DATASETS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                  </select>
                  {selectedDataset && (
                    <div style={{ marginTop: 8, fontSize: 11, color: COLORS.text3 }}>
                      {DATASETS.find(d => d.id === selectedDataset)?.samples} samples · {DATASETS.find(d => d.id === selectedDataset)?.features} features · {DATASETS.find(d => d.id === selectedDataset)?.domain}
                    </div>
                  )}
                </div>

                <div className="param-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div>
                    <div style={S.label}>Qubits / PCA Dims</div>
                    <input style={S.input} type="number" min={4} max={12} value={nQubits} onChange={e => setNQubits(Number(e.target.value))} />
                  </div>
                  <div>
                    <div style={S.label}>MI Features Selected</div>
                    <input style={S.input} type="number" min={4} max={50} value={nSelectedFeatures} onChange={e => setNSelectedFeatures(Number(e.target.value))} />
                  </div>
                  <div>
                    <div style={S.label}>VQC Iterations</div>
                    <input style={S.input} type="number" min={5} max={100} value={vqcIter} onChange={e => setVqcIter(Number(e.target.value))} />
                  </div>
                  <div>
                    <div style={S.label}>Shots</div>
                    <input style={S.input} type="number" min={128} max={8192} value={shots} onChange={e => setShots(Number(e.target.value))} />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={S.label}>Simulation Backend</div>
                  <select style={S.select} value={backendType} onChange={e => setBackendType(e.target.value)}>
                    <option value="ideal">Ideal Statevector Simulator</option>
                    <option value="noisy">Noisy NISQ Simulator (Shot-based)</option>
                  </select>
                </div>

                {backendType === "noisy" && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={S.label}>Noise Rate (depolarizing) — {(noiseRate * 100).toFixed(1)}%</div>
                    <input type="range" min={0.001} max={0.1} step={0.001} value={noiseRate}
                      onChange={e => setNoiseRate(Number(e.target.value))}
                      style={{ width: "100%", accentColor: COLORS.accent }} />
                  </div>
                )}

                <button style={{ ...S.btnPrimary, width: "100%", marginTop: 8, opacity: isRunning ? 0.7 : 1 }}
                  onClick={handleRunExperiment} disabled={isRunning}>
                  {isRunning ? "⏳ Running Pipeline…" : "▶ Run Benchmark Experiment"}
                </button>
              </Card>

              {/* Right: Dataset profile */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Card style={{ padding: 0, overflow: "hidden" }}>
                  <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Dataset Profile</span>
                    {profileLoading && <span style={{ fontSize: 12, color: COLORS.text3 }}>Loading…</span>}
                  </div>
                  {datasetProfile ? (
                    <div style={{ padding: 24 }}>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                        <MetricPill label="Samples" value={datasetProfile.n_samples} />
                        <MetricPill label="Features" value={datasetProfile.n_features} />
                        <MetricPill label="Positive Rate" value={`${(datasetProfile.class_balance * 100).toFixed(0)}%`} color={COLORS.green} />
                        <MetricPill label="Missing %" value={`${(datasetProfile.missing_pct * 100).toFixed(1)}%`} color={COLORS.orange} />
                        <MetricPill label="Status" value={datasetProfile.leakage_audit?.leakage_status === "PASS" ? "✓ PASS" : "⚠ RISK"} color={COLORS.cyan} />
                      </div>
                      {datasetProfile.top_features && (
                        <div>
                          <div style={{ fontSize: 12, color: COLORS.text3, marginBottom: 10, fontWeight: 600 }}>Top Features by Mutual Information</div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {datasetProfile.top_features.slice(0, 8).map((f: any, i: number) => (
                              <span key={f.feature} style={{
                                background: `${COLORS.accent}${Math.round((1 - i / 8) * 40 + 15).toString(16)}`,
                                border: `1px solid ${COLORS.accent}30`, color: COLORS.text,
                                fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 600
                              }}>{f.feature}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: 32, textAlign: "center", color: COLORS.text3, fontSize: 13 }}>
                      {profileLoading ? "Loading dataset profile…" : "Select a dataset to view its profile"}
                    </div>
                  )}
                </Card>

                {/* How the pipeline works */}
                <Card>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Pipeline Overview</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
                    {["01 Ingest", "02 Clean", "03 Engineer", "04 Split 70/15/15", "05 Scale", "06 MI Select", `07 PCA → ${nQubits}q`, "08 Encode-Q", "09 QSVM", "10 VQC", "11 QNN", "12 Classicals", "13 Evaluate"].map(s => (
                      <div key={s} style={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 11, fontWeight: 600, color: COLORS.text2 }}>
                        {s}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ── RESULTS TAB ────────────────────────────────────────────────────── */}
          {activeTab === "results" && experimentResult && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Outcome banner */}
              <div style={S.outcomeCard(experimentResult.benchmark.outcome)}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{experimentResult.benchmark.outcome}</div>
                <div style={{ fontSize: 13, color: COLORS.text2, lineHeight: 1.6 }}>{experimentResult.benchmark.conclusion}</div>
              </div>

              {/* Summary metrics */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  { label: "Runtime", value: `${experimentResult.total_runtime_sec}s`, color: COLORS.text2 },
                  { label: "Qubits", value: `${experimentResult.pipeline?.n_qubits ?? "?"}q`, color: COLORS.accent },
                  { label: "PCA Variance", value: `${experimentResult.pipeline?.pca_variance_pct ?? "?"}%`, color: COLORS.cyan },
                  { label: "QML Champion ROC-AUC", value: experimentResult.benchmark.quantum_champion.roc_auc.toFixed(4), color: COLORS.accent },
                  { label: "Classical Champion ROC-AUC", value: experimentResult.benchmark.classical_champion.roc_auc.toFixed(4), color: COLORS.green },
                  { label: "ΔROC-AUC", value: (experimentResult.benchmark.comparison_deltas.delta_roc_auc > 0 ? "+" : "") + experimentResult.benchmark.comparison_deltas.delta_roc_auc.toFixed(4), color: experimentResult.benchmark.comparison_deltas.delta_roc_auc > 0 ? COLORS.cyan : COLORS.orange },
                ].map(m => <MetricPill key={m.label} label={m.label} value={m.value} color={m.color} />)}
              </div>

              {/* Model comparison table */}
              <Card style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>Full Model Comparison</span>
                </div>
                <ModelTable models={experimentResult.benchmark.all_models} />
              </Card>

              {/* Bar chart */}
              <Card>
                <div style={S.sectionTitle}>ROC-AUC Comparison</div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={benchmarkChartData} margin={{ top: 4, right: 16, left: -16, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                    <XAxis dataKey="name" tick={{ fill: COLORS.text3, fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
                    <YAxis tick={{ fill: COLORS.text3, fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="roc_auc" name="ROC-AUC × 100" fill={COLORS.accent} radius={[4, 4, 0, 0]}
                      label={{ fill: COLORS.text3, fontSize: 9, position: "top" }} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* VQC loss curve */}
              {lossData.length > 0 && (
                <Card>
                  <div style={S.sectionTitle}>VQC Training Loss</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={lossData} margin={{ top: 4, right: 16, left: -16, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                      <XAxis dataKey="iteration" tick={{ fill: COLORS.text3, fontSize: 10 }} />
                      <YAxis tick={{ fill: COLORS.text3, fontSize: 10 }} />
                      <Tooltip contentStyle={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 11 }} />
                      <Legend wrapperStyle={{ fontSize: 11, color: COLORS.text2 }} />
                      <Line type="monotone" dataKey="train_loss" stroke={COLORS.accent} strokeWidth={2} dot={false} name="Train Loss" />
                      <Line type="monotone" dataKey="val_loss" stroke={COLORS.cyan} strokeWidth={2} dot={false} name="Val Loss" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Consensus analysis */}
              {experimentResult.benchmark.consensus_analysis && (
                <Card>
                  <div style={S.sectionTitle}>Quantum Model Consensus Analysis</div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                    <MetricPill label="QSVM↔VQC Agree" value={`${experimentResult.benchmark.consensus_analysis.agreement_rate_pct}%`} color={COLORS.green} />
                    <MetricPill label="QSVM↔VQC Disagree" value={experimentResult.benchmark.consensus_analysis.qsvm_vqc_disagreement} color={COLORS.orange} />
                    <MetricPill label="All 3 Agree" value={experimentResult.benchmark.consensus_analysis.all_three_agree} color={COLORS.cyan} />
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.text3 }}>{experimentResult.benchmark.consensus_analysis.interpretation}</div>
                </Card>
              )}
            </div>
          )}

          {/* ── ROC CURVES TAB ─────────────────────────────────────────────────── */}
          {activeTab === "roc" && experimentResult && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Card>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginRight: 8, alignSelf: "center" }}>Select Models:</div>
                  {allModelNames.map(name => (
                    <button key={name} onClick={() => setRocSelectedModels(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])}
                      style={{
                        padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.15s",
                        background: rocSelectedModels.includes(name) ? COLORS.accent : COLORS.surface2,
                        color: rocSelectedModels.includes(name) ? "white" : COLORS.text2,
                      }}>
                      {name.replace(" (QSVM)", "").replace("Variational ", "").replace(" Classifier", "")}
                    </button>
                  ))}
                </div>
                <div style={S.sectionTitle}>ROC Curves — {rocSelectedModels.length} Models Selected</div>
                <div style={{ fontSize: 12, color: COLORS.text3, marginBottom: 16 }}>Diagonal dashed line = random classifier (AUC = 0.5). Higher and more left-leaning curves indicate better performance.</div>
                <ROCChart models={experimentResult.benchmark.all_models} selectedModels={rocSelectedModels} />
              </Card>

              {/* ROC AUC table */}
              <Card>
                <div style={S.sectionTitle}>ROC-AUC per Model</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {experimentResult.benchmark.all_models.map(m => (
                    <MetricPill key={m.model_name}
                      label={m.model_name.replace(" (QSVM)", "").replace("Variational Quantum ", "VQC ").replace(" Classifier", "").replace("Quantum Neural Network", "QNN")}
                      value={m.roc_auc.toFixed(4)}
                      color={m.category === "Hybrid QML" ? COLORS.accent : COLORS.green} />
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ── CONFUSION MATRIX TAB ───────────────────────────────────────────── */}
          {activeTab === "confusion" && experimentResult && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {experimentResult.benchmark.all_models.map(m => (
                <Card key={m.model_name}>
                  <div style={{ marginBottom: 12 }}>
                    <Badge label={m.category === "Hybrid QML" ? "Quantum" : "Classical"} color={m.category === "Hybrid QML" ? COLORS.accent : COLORS.green} />
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 8 }}>{m.model_name}</div>
                    <div style={{ fontSize: 11, color: COLORS.text3, marginTop: 2 }}>ROC-AUC: {m.roc_auc.toFixed(4)} · Acc: {m.accuracy}%</div>
                  </div>
                  <ConfusionMatrix cm={m.confusion_matrix} name="" />
                </Card>
              ))}
            </div>
          )}

          {/* ── NOISE IMPACT TAB ───────────────────────────────────────────────── */}
          {activeTab === "noise" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Card>
                <div style={S.sectionTitle}>🌊 Noise Impact Analysis — Ideal vs NISQ Noisy</div>
                <p style={{ fontSize: 13, color: COLORS.text2, marginBottom: 20, lineHeight: 1.6 }}>
                  Computes Accuracy_ideal − Accuracy_noisy for QSVM and VQC.
                  Low delta (&lt;2%) indicates strong NISQ robustness. High delta (&gt;5%) indicates hardware sensitivity.
                  (PDF Section 19.30 & 20.30)
                </p>
                {!experimentResult && <div style={{ color: COLORS.orange, fontSize: 13 }}>⚠️ Run a benchmark experiment first to enable noise analysis.</div>}
                {experimentResult && (
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                    <div style={{ flex: 1 }}>
                      <div style={S.label}>Noise Rate: {(noiseRateInput * 100).toFixed(1)}%</div>
                      <input type="range" min={0.001} max={0.1} step={0.001} value={noiseRateInput}
                        onChange={e => setNoiseRateInput(Number(e.target.value))}
                        style={{ width: "100%", accentColor: COLORS.accent }} />
                    </div>
                    <button style={{ ...S.btnPrimary, opacity: noiseLoading ? 0.7 : 1 }}
                      onClick={handleNoiseImpact} disabled={noiseLoading}>
                      {noiseLoading ? "Analysing…" : "Run Noise Analysis"}
                    </button>
                  </div>
                )}
              </Card>

              {noiseResult && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
                    {[
                      { label: "QSVM Ideal Acc", value: `${noiseResult.ideal.qsvm_accuracy}%`, color: COLORS.green },
                      { label: "QSVM Noisy Acc", value: `${noiseResult.noisy.qsvm_accuracy}%`, color: COLORS.orange },
                      { label: "QSVM Noise Δ", value: `${noiseResult.noise_impact.qsvm_delta_pct > 0 ? "-" : "+"}${Math.abs(noiseResult.noise_impact.qsvm_delta_pct)}%`, color: noiseResult.noise_impact.qsvm_delta_pct > 5 ? COLORS.red : COLORS.cyan },
                      { label: "VQC Ideal Acc", value: `${noiseResult.ideal.vqc_accuracy}%`, color: COLORS.green },
                      { label: "VQC Noisy Acc", value: `${noiseResult.noisy.vqc_accuracy}%`, color: COLORS.orange },
                      { label: "VQC Noise Δ", value: `${noiseResult.noise_impact.vqc_delta_pct > 0 ? "-" : "+"}${Math.abs(noiseResult.noise_impact.vqc_delta_pct)}%`, color: noiseResult.noise_impact.vqc_delta_pct > 5 ? COLORS.red : COLORS.cyan },
                    ].map(m => <MetricPill key={m.label} label={m.label} value={m.value} color={m.color} />)}
                  </div>
                  <Card>
                    <div style={{ fontSize: 13, color: COLORS.text2, lineHeight: 1.7 }}>
                      <strong style={{ color: COLORS.text }}>Interpretation:</strong> {noiseResult.noise_impact.interpretation}
                    </div>
                  </Card>
                  <Card>
                    <div style={S.sectionTitle}>Ideal vs Noisy Accuracy</div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={[
                        { model: "QSVM", ideal: noiseResult.ideal.qsvm_accuracy, noisy: noiseResult.noisy.qsvm_accuracy },
                        { model: "VQC", ideal: noiseResult.ideal.vqc_accuracy, noisy: noiseResult.noisy.vqc_accuracy },
                      ]} margin={{ top: 8, right: 16, left: -16, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                        <XAxis dataKey="model" tick={{ fill: COLORS.text3, fontSize: 12 }} />
                        <YAxis tick={{ fill: COLORS.text3, fontSize: 10 }} domain={[0, 100]} />
                        <Tooltip contentStyle={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8 }} />
                        <Legend wrapperStyle={{ fontSize: 11, color: COLORS.text2 }} />
                        <Bar dataKey="ideal" name="Ideal" fill={COLORS.green} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="noisy" name="Noisy" fill={COLORS.orange} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* ── DIMENSION SWEEP TAB ────────────────────────────────────────────── */}
          {activeTab === "sweep" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Card>
                <div style={S.sectionTitle}>🔭 Qubit Dimension Sweep</div>
                <p style={{ fontSize: 13, color: COLORS.text2, marginBottom: 20, lineHeight: 1.6 }}>
                  Evaluates QSVM accuracy as PCA dimensions (= qubit count) varies from 4→10.
                  Shows the Accuracy vs Qubit Count trade-off and retained variance per compression level.
                  (PDF Section 19.26, 20.25, 23.9)
                </p>
                {!experimentResult && <div style={{ color: COLORS.orange, fontSize: 13 }}>⚠️ Run a benchmark experiment first to enable dimension sweep.</div>}
                {experimentResult && (
                  <button style={{ ...S.btnPrimary, opacity: sweepLoading ? 0.7 : 1 }}
                    onClick={handleDimensionSweep} disabled={sweepLoading}>
                    {sweepLoading ? "Sweeping…" : "▶ Run Dimension Sweep (4, 6, 8, 10 qubits)"}
                  </button>
                )}
              </Card>

              {sweepResult && sweepChartData.length > 0 && (
                <>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {sweepChartData.map((s: any) => (
                      <MetricPill key={s.qubits} label={`${s.qubits}q Acc`} value={`${s.accuracy}%`} color={COLORS.accent} />
                    ))}
                  </div>
                  <Card>
                    <div style={S.sectionTitle}>Accuracy & ROC-AUC vs Qubit Count</div>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={sweepChartData} margin={{ top: 8, right: 16, left: -16, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.08)" />
                        <XAxis dataKey="qubits" label={{ value: "Qubits (PCA dims)", position: "insideBottom", fill: COLORS.text3, fontSize: 10 }} tick={{ fill: COLORS.text3, fontSize: 11 }} />
                        <YAxis tick={{ fill: COLORS.text3, fontSize: 10 }} domain={[0, 100]} />
                        <Tooltip contentStyle={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8 }} />
                        <Legend wrapperStyle={{ fontSize: 11, color: COLORS.text2 }} />
                        <Line type="monotone" dataKey="accuracy" stroke={COLORS.accent} strokeWidth={2.5} dot={{ fill: COLORS.accent, r: 5 }} name="Accuracy %" />
                        <Line type="monotone" dataKey="roc_auc" stroke={COLORS.cyan} strokeWidth={2.5} dot={{ fill: COLORS.cyan, r: 5 }} name="ROC-AUC × 100" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* ── PREDICT TAB ────────────────────────────────────────────────────── */}
          {activeTab === "predict" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="main-grid">
              <Card>
                <div style={S.sectionTitle}>🎯 Single-Sample Disease Prediction</div>
                {!experimentResult && <div style={{ color: COLORS.orange, fontSize: 13 }}>⚠️ Run a benchmark experiment first.</div>}
                {experimentResult && (
                  <>
                    <div style={{ marginBottom: 14 }}>
                      <div style={S.label}>Model</div>
                      <select style={S.select} value={predictModel} onChange={e => setPredictModel(e.target.value)}>
                        {experimentResult.benchmark.all_models.map(m => <option key={m.model_name} value={m.model_name}>{m.model_name}</option>)}
                      </select>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <div style={S.label}>Classification Threshold: {predictThreshold.toFixed(2)}</div>
                      <input type="range" min={0.1} max={0.9} step={0.01} value={predictThreshold}
                        onChange={e => setPredictThreshold(Number(e.target.value))}
                        style={{ width: "100%", accentColor: COLORS.accent }} />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <div style={S.label}>Sample Feature Values</div>
                      <div style={{ maxHeight: 240, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                        {Object.entries(sampleValues).map(([k, v]) => (
                          <div key={k} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <span style={{ fontSize: 11, color: COLORS.text2, width: 160, flexShrink: 0 }}>{k}</span>
                            <input style={{ ...S.input, flex: 1 }} type="number" value={v}
                              onChange={e => setSampleValues(prev => ({ ...prev, [k]: Number(e.target.value) }))} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <button style={{ ...S.btnPrimary, width: "100%", opacity: predictLoading ? 0.7 : 1 }}
                      onClick={handlePredict} disabled={predictLoading}>
                      {predictLoading ? "Predicting…" : "▶ Run Prediction"}
                    </button>
                  </>
                )}
              </Card>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {predictionResult && (
                  <Card style={{ border: `1px solid ${predictionResult.predicted_class === 1 ? COLORS.red + "40" : COLORS.green + "40"}` }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Prediction Result</div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
                      <MetricPill label="Class" value={predictionResult.predicted_class === 1 ? "POSITIVE" : "NEGATIVE"} color={predictionResult.predicted_class === 1 ? COLORS.red : COLORS.green} />
                      <MetricPill label="Score" value={predictionResult.prediction_score.toFixed(4)} color={COLORS.accent} />
                      <MetricPill label="Latency" value={`${predictionResult.latency_ms.toFixed(1)}ms`} color={COLORS.cyan} />
                      <MetricPill label="Qubits" value={predictionResult.quantum_encoding?.n_qubits ?? "—"} color={COLORS.accent2} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: predictionResult.predicted_class === 1 ? COLORS.red : COLORS.green, marginBottom: 8 }}>
                      {predictionResult.class_label}
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.text3, lineHeight: 1.5 }}>
                      {predictionResult.disclaimer}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* ── XAI TAB ────────────────────────────────────────────────────────── */}
          {activeTab === "xai" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Card>
                <div style={S.sectionTitle}>🔬 Quantum Explainability (XAI)</div>
                <p style={{ fontSize: 13, color: COLORS.text2, marginBottom: 20, lineHeight: 1.6 }}>
                  Perturbation-based quantum sensitivity analysis — Delta-Z attribution and PCA component importance.
                  (PDF Section 18, 33, 36.9)
                </p>
                {!experimentResult && <div style={{ color: COLORS.orange, fontSize: 13 }}>⚠️ Run a benchmark experiment first.</div>}
                {experimentResult && (
                  <button style={{ ...S.btnPrimary, opacity: xaiLoading ? 0.7 : 1 }}
                    onClick={handleExplain} disabled={xaiLoading}>
                    {xaiLoading ? "Explaining…" : "▶ Generate Explanation"}
                  </button>
                )}
              </Card>

              {xaiResult && (
                <>
                  {xaiResult.feature_sensitivity && (
                    <Card>
                      <div style={S.sectionTitle}>Feature Sensitivity (Delta-Z Attribution)</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {Object.entries(xaiResult.feature_sensitivity)
                          .sort(([, a], [, b]) => Math.abs(b as number) - Math.abs(a as number))
                          .slice(0, 12)
                          .map(([feat, score]) => {
                            const s = score as number
                            const maxScore = 1.0
                            const pct = Math.min(Math.abs(s) / maxScore * 100, 100)
                            return (
                              <div key={feat} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontSize: 11, color: COLORS.text2, width: 160, flexShrink: 0, fontWeight: 600 }}>{feat}</span>
                                <div style={{ flex: 1, background: COLORS.surface2, borderRadius: 4, height: 8 }}>
                                  <div style={{ width: `${pct}%`, height: "100%", background: s > 0 ? COLORS.accent : COLORS.orange, borderRadius: 4, transition: "width 0.5s" }} />
                                </div>
                                <span style={{ fontSize: 11, color: COLORS.text3, width: 50, textAlign: "right" as const }}>{s.toFixed(4)}</span>
                              </div>
                            )
                          })}
                      </div>
                    </Card>
                  )}
                  {xaiResult.pca_attribution && (
                    <Card>
                      <div style={S.sectionTitle}>PCA Component Attribution</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {xaiResult.pca_attribution.map((item: any, i: number) => (
                          <MetricPill key={i} label={`PC-${i + 1}`} value={typeof item === "number" ? item.toFixed(3) : String(item)} color={COLORS.accent} />
                        ))}
                      </div>
                    </Card>
                  )}
                </>
              )}
            </div>
          )}

          {/* No experiment yet for results tabs */}
          {(activeTab === "results" || activeTab === "roc" || activeTab === "confusion") && !experimentResult && (
            <Card style={{ textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⚗️</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No Experiment Results Yet</div>
              <div style={{ fontSize: 14, color: COLORS.text2, marginBottom: 20 }}>Configure your parameters in the Configure tab and run a benchmark experiment.</div>
              <button style={S.btnPrimary} onClick={() => setActiveTab("config")}>→ Go to Configure</button>
            </Card>
          )}
          </div>
        </div>
      </HospitalLayout>
    </>
  )
}
