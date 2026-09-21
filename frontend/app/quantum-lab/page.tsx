"use client"

import React, { useState, useEffect } from "react"
import HospitalLayout from "@/components/hospital-layout"
import {
  UploadCloud, Database, Settings, Cpu, Play, CheckCircle,
  Activity, Search, Target, Check, ChevronRight, BarChart2
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// --- Styling Constants ---
const COLORS = {
  accent: "#6366f1", accent2: "#8b5cf6", cyan: "#06b6d4",
  green: "#10b981", orange: "#f59e0b", red: "#ef4444",
  text: "#f1f5f9", text2: "#94a3b8", text3: "#64748b",
  bg: "#05070f", surface: "#0d1121", surface2: "#111827", border: "rgba(99,102,241,0.15)"
}

const STEPS = [
  { id: 1, name: "Upload Dataset", icon: Database },
  { id: 2, name: "Preprocess", icon: Settings },
  { id: 3, name: "Model Setup", icon: Cpu },
  { id: 4, name: "Run Training", icon: Play },
  { id: 5, name: "Benchmark", icon: BarChart2 },
  { id: 6, name: "Prediction & XAI", icon: Target },
]

export default function QuantumLabWizard() {
  const [step, setStep] = useState(1)
  
  // State: Step 1
  const [datasetId, setDatasetId] = useState("breast_cancer")
  const [datasetProfile, setDatasetProfile] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  // State: Step 2
  const [prepOptions, setPrepOptions] = useState({
    missing: true, scale: true, pca: 6, selectFeatures: 12
  })
  
  // State: Step 3
  const [classicalModel, setClassicalModel] = useState("Random Forest")
  const [quantumModel, setQuantumModel] = useState("Variational Quantum Classifier")
  const [simulator, setSimulator] = useState("ideal")
  
  // State: Step 4/5 (Execution)
  const [isExecuting, setIsExecuting] = useState(false)
  const [execProgress, setExecProgress] = useState(0)
  const [experimentResult, setExperimentResult] = useState<any>(null)
  
  // State: Step 6 (Predict)
  const [predictionResult, setPredictionResult] = useState<any>(null)
  const [xaiResult, setXaiResult] = useState<any>(null)
  const [isPredicting, setIsPredicting] = useState(false)

  // Handlers
  const handleSimulatedUpload = async () => {
    setIsUploading(true)
    // Simulate upload delay
    await new Promise(r => setTimeout(r, 1500))
    // Fetch profile
    try {
      const res = await fetch("/api/qml/datasets/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset_name: datasetId, target_col: "target" })
      })
      const data = await res.json()
      setDatasetProfile(data)
    } catch (e) {
      console.error(e)
    }
    setIsUploading(false)
  }

  const handleRunExperiment = async () => {
    setStep(4)
    setIsExecuting(true)
    setExecProgress(10)
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setExecProgress(p => p >= 90 ? 90 : p + 5)
    }, 500)

    try {
      const res = await fetch("/api/qml/experiment/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataset_name: datasetId,
          n_pca_components: prepOptions.pca,
          n_selected_features: prepOptions.selectFeatures,
          backend_type: simulator,
          noise_rate: 0.015,
          shots: 1024,
          vqc_iterations: 20,
          seed: 42
        })
      })
      const data = await res.json()
      clearInterval(progressInterval)
      setExecProgress(100)
      setExperimentResult(data)
      setTimeout(() => setStep(5), 1000)
    } catch (e) {
      console.error(e)
      clearInterval(progressInterval)
    } finally {
      setIsExecuting(false)
    }
  }

  const handlePredict = async () => {
    setIsPredicting(true)
    try {
      // Mock sample based on dataset
      let sample = {}
      if (datasetId === "breast_cancer") {
        sample = { "mean radius": 17.99, "mean texture": 10.38, "mean perimeter": 122.8, "mean area": 1001.0, "mean smoothness": 0.1184, "mean compactness": 0.2776, "mean concavity": 0.3001, "mean concave points": 0.1471, "mean symmetry": 0.2419 }
      } else {
        sample = { age: 58, sex: 1, chest_pain_type: 2, resting_bp: 140, cholesterol: 250, fasting_blood_sugar: 0, rest_ecg: 1, max_heart_rate: 145, exercise_angina: 1, st_depression: 1.6, st_slope: 1, num_major_vessels: 1, thalassemia: 2 }
      }

      const res = await fetch("/api/qml/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experiment_id: experimentResult.experiment_id,
          model_name: quantumModel.replace("Variational Quantum Classifier", "VQC"), // Match name roughly, or default to Quantum champion
          sample_values: sample,
          threshold: 0.5
        })
      })
      
      const xaiRes = await fetch("/api/qml/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experiment_id: experimentResult.experiment_id,
          model_name: "Random Forest",
          sample_values: sample
        })
      })

      setPredictionResult(await res.json())
      setXaiResult(await xaiRes.json())
    } catch (e) {
      console.error(e)
    }
    setIsPredicting(false)
  }

  // Helper renderers
  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 z-0 rounded"></div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-500 z-0 rounded transition-all duration-500" style={{ width: `${((step - 1) / 5) * 100}%` }}></div>
      {STEPS.map((s, i) => {
        const active = s.id === step
        const done = s.id < step
        const Icon = s.icon
        return (
          <div key={s.id} className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${active ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]" : done ? "bg-indigo-900 border-indigo-600 text-indigo-300" : "bg-slate-900 border-slate-700 text-slate-500"}`}>
              {done ? <Check size={18} /> : <Icon size={18} />}
            </div>
            <div className={`mt-2 text-xs font-bold ${active ? "text-indigo-400" : done ? "text-indigo-300" : "text-slate-500"}`}>{s.name}</div>
          </div>
        )
      })}
    </div>
  )

  return (
    <HospitalLayout title="Interactive Quantum Lab" subtitle="End-to-End Hybrid QML Benchmark Wizard">
      <div className="min-h-screen bg-[#05070f] text-slate-300 p-8 font-sans">
        <div className="max-w-5xl mx-auto">
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-white tracking-tight mb-3">Hybrid QML Disease Detection Platform</h1>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              A secure, explainable experimental platform that processes complex biomedical data, optimizes features, trains Classical ML and Hybrid QML models, predicts disease risk, and objectively benchmarks both approaches.
            </p>
          </div>

          {renderStepIndicator()}

          {/* STEP 1: UPLOAD */}
          {step === 1 && (
            <div className="bg-[#0d1121] border border-indigo-500/20 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Database className="text-indigo-500"/> 1. Upload Biomedical Dataset</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Select Demo Dataset</label>
                  <select 
                    value={datasetId} 
                    onChange={e => {setDatasetId(e.target.value); setDatasetProfile(null)}}
                    className="w-full bg-[#111827] border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500"
                  >
                    <option value="breast_cancer">Breast Cancer (WDBC) - Oncology</option>
                    <option value="heart_disease">Cardiovascular Disease - Cardiology</option>
                    <option value="diabetes">Diabetes Screening - Metabolic</option>
                  </select>

                  <div className="mt-6 border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-indigo-500/50 transition-colors bg-[#111827]/50">
                    <UploadCloud size={40} className="mx-auto text-slate-500 mb-3" />
                    <p className="text-sm text-slate-400 mb-1">Drag and drop your CSV dataset here</p>
                    <p className="text-xs text-slate-500">or click to browse files</p>
                  </div>

                  <button 
                    onClick={handleSimulatedUpload}
                    disabled={isUploading}
                    className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    {isUploading ? "Uploading & Profiling..." : "Validate Dataset"}
                  </button>
                </div>

                {datasetProfile ? (
                  <div className="bg-[#111827] rounded-xl p-6 border border-slate-800">
                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-center border-b border-slate-800 pb-3">Dataset Overview</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-slate-800/50 pb-2">
                        <span className="text-slate-400 text-sm">Samples</span>
                        <span className="text-white font-mono font-bold">{datasetProfile.n_samples}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/50 pb-2">
                        <span className="text-slate-400 text-sm">Features</span>
                        <span className="text-white font-mono font-bold">{datasetProfile.n_features}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/50 pb-2">
                        <span className="text-slate-400 text-sm">Missing Values</span>
                        <span className="text-emerald-400 font-mono font-bold">0 (Good)</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/50 pb-2">
                        <span className="text-slate-400 text-sm">Class Balance</span>
                        <span className="text-amber-400 font-mono font-bold">{(datasetProfile.class_balance * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    <button onClick={() => setStep(2)} className="w-full mt-8 bg-white text-indigo-900 font-bold py-3 px-4 rounded-xl hover:bg-indigo-50 transition-all flex justify-center items-center gap-2">
                      Proceed to Preprocessing <ChevronRight size={18}/>
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#111827]/50 rounded-xl border border-slate-800 flex items-center justify-center p-6 text-center text-slate-500 text-sm">
                    Upload and validate dataset to view profile.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: PREPROCESS */}
          {step === 2 && (
            <div className="bg-[#0d1121] border border-indigo-500/20 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-right-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Settings className="text-indigo-500"/> 2. Data Preprocessing & Optimization</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-[#111827] p-5 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white mb-4">Standard Cleaning</h3>
                    <label className="flex items-center gap-3 text-sm text-slate-300 mb-3 cursor-pointer">
                      <input type="checkbox" checked={prepOptions.missing} onChange={e => setPrepOptions({...prepOptions, missing: e.target.checked})} className="w-4 h-4 accent-indigo-500" />
                      Missing Value Imputation (Mean/Mode)
                    </label>
                    <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer">
                      <input type="checkbox" checked={prepOptions.scale} onChange={e => setPrepOptions({...prepOptions, scale: e.target.checked})} className="w-4 h-4 accent-indigo-500" />
                      Feature Scaling (StandardScaler)
                    </label>
                  </div>

                  <div className="bg-[#111827] p-5 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-bold text-white mb-4">Feature Selection (Mutual Information)</h3>
                    <div className="flex justify-between text-xs text-slate-400 mb-2"><span>Select Top Features</span><span>{prepOptions.selectFeatures}</span></div>
                    <input type="range" min={4} max={30} value={prepOptions.selectFeatures} onChange={e => setPrepOptions({...prepOptions, selectFeatures: parseInt(e.target.value)})} className="w-full accent-indigo-500" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-indigo-900/20 p-5 rounded-xl border border-indigo-500/30">
                    <h3 className="text-sm font-bold text-indigo-300 mb-2">PCA / Dimensionality Reduction</h3>
                    <p className="text-xs text-indigo-200/70 mb-4">Crucial for Quantum models to map classical data to limited qubits without losing variance.</p>
                    
                    <div className="flex justify-between items-center bg-[#0d1121] p-4 rounded-lg border border-indigo-500/20 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-black text-white">{prepOptions.selectFeatures}</div>
                        <div className="text-[10px] text-slate-500 uppercase">Features</div>
                      </div>
                      <ChevronRight className="text-indigo-500"/>
                      <div className="text-center">
                        <div className="text-2xl font-black text-cyan-400">{prepOptions.pca}</div>
                        <div className="text-[10px] text-cyan-500/70 uppercase">PCA Components</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-indigo-300 mb-2"><span>Target Components (Qubits)</span><span>{prepOptions.pca}</span></div>
                    <input type="range" min={4} max={10} value={prepOptions.pca} onChange={e => setPrepOptions({...prepOptions, pca: parseInt(e.target.value)})} className="w-full accent-cyan-500" />
                  </div>
                  
                  <button onClick={() => setStep(3)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-all flex justify-center items-center gap-2">
                    Apply Processing <ChevronRight size={18}/>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MODEL SETUP */}
          {step === 3 && (
            <div className="bg-[#0d1121] border border-indigo-500/20 rounded-2xl p-8 shadow-2xl animate-in fade-in slide-in-from-right-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Cpu className="text-indigo-500"/> 3. Configure Champion Models</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#111827] rounded-xl p-6 border-l-4 border-emerald-500">
                  <h3 className="text-sm font-bold text-emerald-400 mb-2 uppercase tracking-wider">Classical ML Baseline</h3>
                  <p className="text-xs text-slate-400 mb-4">Select the classical algorithm to benchmark against.</p>
                  <select value={classicalModel} onChange={e => setClassicalModel(e.target.value)} className="w-full bg-[#0d1121] border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-emerald-500 text-sm">
                    <option>Random Forest</option>
                    <option>XGBoost</option>
                    <option>Support Vector Machine</option>
                    <option>Logistic Regression</option>
                  </select>
                </div>

                <div className="bg-indigo-900/10 rounded-xl p-6 border-l-4 border-indigo-500">
                  <h3 className="text-sm font-bold text-indigo-400 mb-2 uppercase tracking-wider">Hybrid QML Model</h3>
                  <p className="text-xs text-slate-400 mb-4">Select the quantum-enhanced model architecture.</p>
                  <select value={quantumModel} onChange={e => setQuantumModel(e.target.value)} className="w-full bg-[#0d1121] border border-slate-700 rounded-lg p-3 text-white outline-none focus:border-indigo-500 text-sm mb-4">
                    <option>Variational Quantum Classifier</option>
                    <option>Quantum Kernel (QSVM)</option>
                    <option>Quantum Neural Network</option>
                  </select>

                  <h4 className="text-xs font-bold text-slate-300 mb-2">Quantum Backend Execution</h4>
                  <select value={simulator} onChange={e => setSimulator(e.target.value)} className="w-full bg-[#0d1121] border border-slate-700 rounded-lg p-3 text-cyan-300 outline-none focus:border-cyan-500 text-sm font-mono">
                    <option value="ideal">Simulator: Ideal Statevector</option>
                    <option value="noisy">Simulator: Noisy NISQ (Aer)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button onClick={() => setStep(2)} className="text-slate-400 hover:text-white px-4 py-2 text-sm font-bold">Back</button>
                <button onClick={handleRunExperiment} className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <Play size={18} fill="currentColor"/> Begin Hybrid Training
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: EXECUTION */}
          {step === 4 && (
            <div className="bg-[#0d1121] border border-indigo-500/50 rounded-2xl p-12 shadow-2xl text-center">
              <Activity className="mx-auto text-indigo-500 mb-6 animate-pulse" size={48} />
              <h2 className="text-2xl font-black text-white mb-2">Executing Hybrid Pipeline</h2>
              <p className="text-slate-400 text-sm mb-8">Compiling quantum circuits, training classical baselines, and optimizing parameterized gates.</p>
              
              <div className="w-full max-w-md mx-auto bg-slate-900 rounded-full h-3 mb-4 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-300" style={{width: `${execProgress}%`}}></div>
              </div>
              <div className="text-xs font-mono text-cyan-400 font-bold">{execProgress}% Complete</div>
            </div>
          )}

          {/* STEP 5: BENCHMARK RESULTS */}
          {step === 5 && experimentResult && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-6 mb-6 text-center">
                <h2 className="text-xl font-bold text-white mb-2">Experiment Completed Successfully</h2>
                <p className="text-indigo-200 text-sm">Total Runtime: {experimentResult.total_runtime_sec}s | Platform mapped {prepOptions.pca} clinical features to {prepOptions.pca} qubits.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Classical Box */}
                <div className="bg-[#0d1121] border border-emerald-500/30 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                    <div>
                      <div className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase mb-1">Baseline</div>
                      <h3 className="text-lg font-black text-white">Classical ML</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">{experimentResult.benchmark.classical_champion.accuracy}%</div>
                      <div className="text-[10px] text-slate-500 uppercase">Accuracy</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-slate-400">ROC-AUC</span><span className="font-mono text-white font-bold">{experimentResult.benchmark.classical_champion.roc_auc.toFixed(3)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Sensitivity</span><span className="font-mono text-white font-bold">{experimentResult.benchmark.classical_champion.sensitivity}%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">F1 Score</span><span className="font-mono text-white font-bold">{experimentResult.benchmark.classical_champion.f1_score}%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Training Time</span><span className="font-mono text-white font-bold">{experimentResult.benchmark.classical_champion.training_time_sec.toFixed(2)}s</span></div>
                  </div>
                </div>

                {/* QML Box */}
                <div className="bg-[#0d1121] border border-indigo-500/50 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4 relative z-10">
                    <div>
                      <div className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase mb-1">Innovation</div>
                      <h3 className="text-lg font-black text-white">Hybrid QML</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">{experimentResult.benchmark.quantum_champion.accuracy}%</div>
                      <div className="text-[10px] text-slate-500 uppercase">Accuracy</div>
                    </div>
                  </div>
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between text-sm"><span className="text-slate-400">ROC-AUC</span><span className="font-mono text-cyan-400 font-bold">{experimentResult.benchmark.quantum_champion.roc_auc.toFixed(3)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Sensitivity</span><span className="font-mono text-white font-bold">{experimentResult.benchmark.quantum_champion.sensitivity}%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">F1 Score</span><span className="font-mono text-white font-bold">{experimentResult.benchmark.quantum_champion.f1_score}%</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Training Time</span><span className="font-mono text-white font-bold">{experimentResult.benchmark.quantum_champion.training_time_sec.toFixed(2)}s</span></div>
                  </div>
                </div>
              </div>

              {/* Quantum Resources */}
              <div className="bg-[#111827] rounded-xl p-6 border border-slate-800 mb-8">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider text-center">Quantum Resources Utilised</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-[#0d1121] rounded-lg p-3 border border-slate-800/50">
                    <div className="text-xl font-black text-cyan-400">{prepOptions.pca}</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-1">Qubits</div>
                  </div>
                  <div className="bg-[#0d1121] rounded-lg p-3 border border-slate-800/50">
                    <div className="text-xl font-black text-cyan-400">~{prepOptions.pca * 3}</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-1">Circuit Depth</div>
                  </div>
                  <div className="bg-[#0d1121] rounded-lg p-3 border border-slate-800/50">
                    <div className="text-xl font-black text-cyan-400">{experimentResult.benchmark.quantum_champion.category === "Hybrid QML" ? "Angle" : "ZZFeature"}</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-1">Encoding</div>
                  </div>
                  <div className="bg-[#0d1121] rounded-lg p-3 border border-slate-800/50">
                    <div className="text-xl font-black text-cyan-400">1024</div>
                    <div className="text-[10px] text-slate-500 uppercase mt-1">Shots</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button onClick={() => setStep(6)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all inline-flex items-center gap-2">
                  Proceed to Live Prediction <ChevronRight size={18}/>
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: PREDICTION & XAI */}
          {step === 6 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-8">
              {/* Patient Sample */}
              <div className="col-span-1 bg-[#0d1121] border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 border-b border-slate-800 pb-2">New Patient Sample</h3>
                <div className="text-xs text-slate-400 mb-4 bg-[#111827] p-3 rounded-lg font-mono">
                  Sample ID: PAT-9912<br/>
                  Extracted Features: {prepOptions.pca}<br/>
                  Ready for inference.
                </div>
                <button 
                  onClick={handlePredict}
                  disabled={isPredicting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {isPredicting ? "Analyzing..." : <><Target size={18}/> Run QML Inference</>}
                </button>
              </div>

              {/* Prediction Result */}
              <div className="col-span-2 space-y-6">
                {predictionResult ? (
                  <div className="bg-[#0d1121] border border-indigo-500/30 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Disease Risk Prediction</h3>
                        <div className="text-3xl font-black text-white">{predictionResult.prediction_label}</div>
                      </div>
                      <div className="text-right bg-[#111827] p-3 rounded-xl border border-slate-800">
                        <div className="text-2xl font-black text-cyan-400">{(predictionResult.probability * 100).toFixed(1)}%</div>
                        <div className="text-[10px] text-slate-500 uppercase mt-1">Probability</div>
                      </div>
                    </div>
                    
                    {xaiResult && xaiResult.feature_importance && (
                      <div className="mt-8 border-t border-slate-800 pt-6">
                        <h4 className="text-sm font-bold text-white mb-4">Explainability (XAI) - Feature Contributions</h4>
                        <div className="space-y-3">
                          {Object.entries(xaiResult.feature_importance).slice(0, 5).map(([feat, val]: any, i) => (
                            <div key={feat} className="flex items-center gap-3">
                              <div className="w-24 text-xs text-slate-400 truncate">{feat}</div>
                              <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden">
                                <div className="bg-indigo-500 h-full rounded-full" style={{width: `${Math.min(100, Math.max(5, val * 100))}%`}}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#0d1121] border border-slate-800 border-dashed rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center h-full">
                    <Target size={48} className="mb-4 text-slate-700" />
                    <p>Run inference to view prediction and explanation.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </HospitalLayout>
  )
}
