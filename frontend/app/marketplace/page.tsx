"use client"

import React, { useState } from "react"
import Link from "next/link"
import HospitalLayout from "@/components/hospital-layout"
import {
  ShoppingBag, Cpu, ShieldCheck, Download, Star, ExternalLink,
  ArrowRight, Search, Filter, Sparkles, CheckCircle2, Layers
} from "lucide-react"

interface MarketModel {
  id: string
  title: string
  author: string
  domain: string
  category: "Quantum QML" | "Classical Baseline"
  description: string
  accuracy: string
  downloads: number
  rating: number
  qubits: string
  dataset: string
  license: string
}

const MARKET_MODELS: MarketModel[] = [
  {
    id: "onco-qubit",
    title: "OncoQubit-v2 (QSVM WDBC)",
    author: "Harvard-MIT Health Sciences & QML Lab",
    domain: "Oncology",
    category: "Quantum QML",
    description: "State-of-the-art Quantum Kernel Support Vector Machine utilizing 2-repetition ZZ-FeatureMaps for early breast malignancy classification.",
    accuracy: "94.7%",
    downloads: 1420,
    rating: 4.9,
    qubits: "4 – 8 Qubits",
    dataset: "Breast Cancer (WDBC)",
    license: "Apache 2.0",
  },
  {
    id: "cardio-vqc",
    title: "CardioVQC-Alpha (Variational TwoLocal)",
    author: "Stanford Quantum Bio Consortium",
    domain: "Cardiology",
    category: "Quantum QML",
    description: "Parameterized quantum circuit with Ry rotations and CNOT entangling layers optimized for multi-parameter clinical cardiac risk evaluation.",
    accuracy: "91.2%",
    downloads: 980,
    rating: 4.8,
    qubits: "4 Qubits",
    dataset: "Cardiovascular Disease",
    license: "MIT",
  },
  {
    id: "neuro-qnn",
    title: "NeuroQNN-Parkinsons Voice Classifier",
    author: "Cambridge Neuro-Quantum Initiative",
    domain: "Neurology",
    category: "Quantum QML",
    description: "Hybrid neural network coupling acoustic phonation feature extractors to PennyLane variational expectation layers for dysphonia detection.",
    accuracy: "93.4%",
    downloads: 850,
    rating: 4.7,
    qubits: "4 – 6 Qubits",
    dataset: "Parkinson's Phonation",
    license: "Open Biomedical AI",
  },
  {
    id: "diabetree-gbm",
    title: "DiabeTree-XGB Classical Ensemble",
    author: "Johns Hopkins Biostatistics",
    domain: "Metabolic",
    category: "Classical Baseline",
    description: "High-regularized gradient boosting benchmark for metabolic diabetes screening serving as reference baseline for quantum speedup audits.",
    accuracy: "95.1%",
    downloads: 2100,
    rating: 4.9,
    qubits: "Classical",
    dataset: "Diabetes Screening",
    license: "Apache 2.0",
  },
  {
    id: "geno-quantum",
    title: "GenoQuantum-Net 200-Gene Embedding",
    author: "Oxford Center for Precision Medicine",
    domain: "Genomics",
    category: "Quantum QML",
    description: "High-dimensional PCA feature projection coupled with AngleEmbedding quantum circuit to identify oncogenic gene co-expression pathways.",
    accuracy: "89.6%",
    downloads: 640,
    rating: 4.8,
    qubits: "8 – 12 Qubits",
    dataset: "Microarray Genomics",
    license: "MIT",
  },
]

export default function MarketplacePage() {
  const [selectedDomain, setSelectedDomain] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = MARKET_MODELS.filter((m) => {
    if (selectedDomain !== "all" && m.domain.toLowerCase() !== selectedDomain.toLowerCase()) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return m.title.toLowerCase().includes(q) || m.author.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <HospitalLayout
      title="QML Biomedical Model Marketplace"
      subtitle="Discover and deploy open-access pre-trained Quantum & Hybrid models from premier research consortia"
    >
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Published Models</div>
            <div className="text-2xl font-bold text-white mt-1">24 Models</div>
            <div className="text-xs text-indigo-400 mt-1">Peer-reviewed architectures</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Community Downloads</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">5,990+</div>
            <div className="text-xs text-slate-400 mt-1">By clinical AI researchers</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Quantum Advantage Rate</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">+3.2% AUC</div>
            <div className="text-xs text-slate-400 mt-1">Over classical linear SVM</div>
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
            <div className="text-xs text-slate-400 font-medium">Zero-Leakage Assurance</div>
            <div className="text-2xl font-bold text-indigo-400 mt-1">100% Certified</div>
            <div className="text-xs text-slate-400 mt-1">Standardized splits</div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["all", "Oncology", "Cardiology", "Neurology", "Metabolic", "Genomics"].map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                  selectedDomain.toLowerCase() === dom.toLowerCase()
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60"
                }`}
              >
                {dom === "all" ? "All Domains" : dom}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search published models..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Grid of Marketplace items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 rounded-2xl p-5 flex flex-col justify-between transition group hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      item.category === "Quantum QML"
                        ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {item.rating}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h3>
                <div className="text-xs text-slate-400 mb-2">By {item.author}</div>

                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {item.description}
                </p>

                <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-700/50 text-xs mb-4">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Benchmark Acc:</span>
                    <span className="font-bold text-emerald-400 text-sm">{item.accuracy}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Quantum Specs:</span>
                    <span className="font-mono text-cyan-300">{item.qubits}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary Dataset:</span>
                    <span className="text-slate-200 truncate block">{item.dataset}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">License:</span>
                    <span className="text-slate-300">{item.license}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Link
                  href={`/analysis`}
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  Deploy in Lab <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => alert(`Downloaded model bundle for ${item.title}`)}
                  className="p-2 bg-slate-700/60 hover:bg-slate-700 text-slate-200 rounded-xl transition"
                  title="Download Weights & Circuit"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HospitalLayout>
  )
}
