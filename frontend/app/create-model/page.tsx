"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import HospitalLayout from "@/components/hospital-layout"
import {
  Sparkles, Cpu, Layers, Sliders, ArrowRight, ShieldCheck,
  CheckCircle2, Play, Info, Eye
} from "lucide-react"

export default function CreateModelPage() {
  const router = useRouter()
  const [modelName, setModelName] = useState("Custom-VQC-Entangled")
  const [modelType, setModelType] = useState<"vqc" | "qsvm" | "hybrid_qnn">("vqc")
  const [dataset, setDataset] = useState("breast_cancer")
  const [qubits, setQubits] = useState("4")
  const [featureMap, setFeatureMap] = useState("zz_feature_map")
  const [entanglement, setEntanglement] = useState("linear")
  const [ansatz, setAnsatz] = useState("real_amplitudes")
  const [reps, setReps] = useState("2")
  const [optimizer, setOptimizer] = useState("COBYLA")
  const [maxIter, setMaxIter] = useState("100")
  const [shots, setShots] = useState("2048")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nQ = parseInt(qubits) || 4
  const nR = parseInt(reps) || 2
  const estimatedParams = modelType === "qsvm" ? "Kernel Matrix (N×N)" : `${nQ * (nR + 1)} θ angles`
  const estimatedDepth = nR * 3 + 2
  const estimatedCnotGates = entanglement === "full" ? (nQ * (nQ - 1) / 2) * nR : (nQ - 1) * nR

  const handleLaunchModel = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Forward params to analysis lab
    setTimeout(() => {
      router.push(`/analysis?dataset=${dataset}&qubits=${qubits}&ansatz=${ansatz}&reps=${reps}&optimizer=${optimizer}`)
    }, 800)
  }

  return (
    <HospitalLayout
      title="Design Custom Quantum Model"
      subtitle="Synthesize custom variational quantum circuits, entanglement topologies, and kernel embeddings"
    >
      <form onSubmit={handleLaunchModel} className="space-y-6 max-w-5xl">
        {/* Model Meta info */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Model Specification & Target Dataset</h2>
              <p className="text-xs text-slate-400">Define the architectural scope for your quantum circuit</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Model Identifier</label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Model Architecture Family</label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="vqc">Variational Quantum Classifier (VQC)</option>
                <option value="qsvm">Quantum Kernel SVM (QSVM)</option>
                <option value="hybrid_qnn">Hybrid Quantum Neural Network (QNN)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Biomedical Dataset</label>
              <select
                value={dataset}
                onChange={(e) => setDataset(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="breast_cancer">Breast Cancer WDBC (569 samples, 30 features)</option>
                <option value="heart_disease">Cardiovascular Disease (303 samples, 13 features)</option>
                <option value="diabetes">Diabetes Screening (500 samples, 8 features)</option>
                <option value="parkinsons">Parkinson's Phonation (195 samples, 22 features)</option>
                <option value="genomics">Gene Expression Microarray (220 samples, 200 features)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quantum Circuit Architecture */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Quantum Circuit & Ansatz Configuration</h2>
              <p className="text-xs text-slate-400">Configure Hilbert space dimensionality and unitary entangling layers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Qubit Dimension (N)</label>
              <select
                value={qubits}
                onChange={(e) => setQubits(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="4">4 Qubits (2^4 = 16 States)</option>
                <option value="6">6 Qubits (2^6 = 64 States)</option>
                <option value="8">8 Qubits (2^8 = 256 States)</option>
                <option value="12">12 Qubits (2^12 = 4096 States)</option>
                <option value="16">16 Qubits (Publikation Benchmark)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Feature Map Embedding</label>
              <select
                value={featureMap}
                onChange={(e) => setFeatureMap(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="zz_feature_map">ZZFeatureMap (Second-order non-linear)</option>
                <option value="pauli_feature_map">PauliFeatureMap (Z + ZZ interactions)</option>
                <option value="angle_embedding">AngleEmbedding (Rotation Ry/Rz)</option>
                <option value="amplitude_embedding">AmplitudeEmbedding (Logarithmic compression)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Variational Ansatz</label>
              <select
                value={ansatz}
                onChange={(e) => setAnsatz(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="real_amplitudes">RealAmplitudes (Ry + Entanglement)</option>
                <option value="two_local">TwoLocal (Ry + Rz + CNOT)</option>
                <option value="efficient_su2">EfficientSU2 (Full single qubit SU(2))</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Entanglement Topology</label>
              <select
                value={entanglement}
                onChange={(e) => setEntanglement(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="linear">Linear (Nearest-neighbor 1D chain)</option>
                <option value="full">Full (All-to-all pairwise CNOT)</option>
                <option value="circular">Circular (Periodic boundary conditions)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ansatz Repetitions (Depth)</label>
              <select
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="1">1 Repetition (Fast / Low noise)</option>
                <option value="2">2 Repetitions (Recommended balance)</option>
                <option value="3">3 Repetitions (Expressive)</option>
                <option value="4">4 Repetitions (Deep variational)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Classical Optimizer</label>
              <select
                value={optimizer}
                onChange={(e) => setOptimizer(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="COBYLA">COBYLA (Derivative-free, fast)</option>
                <option value="SLSQP">SLSQP (Sequential Least Squares)</option>
                <option value="SPSA">SPSA (Stochastic Perturbation for noisy QPU)</option>
                <option value="ADAM">Adam (Adaptive Moment Estimation)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Max Optimization Iterations</label>
              <select
                value={maxIter}
                onChange={(e) => setMaxIter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 text-sm"
              >
                <option value="50">50 Epochs (Quick test)</option>
                <option value="100">100 Epochs (Standard convergence)</option>
                <option value="200">200 Epochs (Deep convergence)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Circuit Complexity Inspector */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Synthesized Circuit Architecture Preview</h3>
            </div>
            <span className="text-[11px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
              Synthesized & Validated
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-5">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-1">State Space (2^N)</span>
              <span className="font-mono text-base font-bold text-cyan-400">{Math.pow(2, nQ).toLocaleString()} states</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-1">Trainable Parameters</span>
              <span className="font-mono text-base font-bold text-indigo-400">{estimatedParams}</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-1">Estimated Circuit Depth</span>
              <span className="font-mono text-base font-bold text-amber-400">{estimatedDepth} layers</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50">
              <span className="text-slate-400 block mb-1">2-Qubit Entangling Gates</span>
              <span className="font-mono text-base font-bold text-purple-400">{estimatedCnotGates} CNOTs</span>
            </div>
          </div>

          {/* Wire representation */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-700/70 font-mono text-xs text-slate-300 space-y-2 overflow-x-auto">
            {Array.from({ length: Math.min(nQ, 6) }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                <span className="text-indigo-400 font-bold w-12">q[{i}]:</span>
                <span className="text-slate-600">──</span>
                <span className="bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">H</span>
                <span className="text-slate-600">────</span>
                <span className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">Rz(x[{i}])</span>
                <span className="text-slate-600">────</span>
                <span className="bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">Ry(θ[{i}])</span>
                <span className="text-slate-600">────</span>
                <span className="text-purple-400">●────(CX)────</span>
                <span className="bg-slate-800 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">Measure</span>
              </div>
            ))}
            {nQ > 6 && (
              <div className="text-slate-500 text-[11px] pt-1 italic">
                ... + {nQ - 6} additional qubit registers in {entanglement} lattice
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>Synthesizing & Deploying...</>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Launch Training in Quantum Lab
              </>
            )}
          </button>
        </div>
      </form>
    </HospitalLayout>
  )
}
