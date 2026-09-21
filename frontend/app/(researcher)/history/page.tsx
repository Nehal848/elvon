"use client"

import React, { useState, useEffect } from "react"
import ResearcherLayout from "@/components/researcher-layout"
import {
  FlaskConical, CheckCircle2, PlayCircle, XCircle, Search, ChevronDown,
  Bookmark, Plus, ChevronRight, MoreVertical, Clock, Database, SlidersHorizontal,
  Network, Activity, GitCommit, FileText, ShieldCheck, ExternalLink, Copy,
  RotateCw, Download, ChevronLeft, Loader2, FileDown, CheckCircle
} from "lucide-react"

// --- Types ---
interface ExpSummary {
  id: string
  dataset_name: string
  target_column: string
  n_pca_components: number
  quantum_backend: string
  qml_model_type: string
  status: string
  created_at: string
}

interface ExpDetail {
  experiment_id: string
  dataset_name: string
  target_col: string
  pipeline_summary: {
    n_qubits: number
    selected_features: string[]
    leakage_audit: any
  }
  benchmark: any
  quantum_resources: any
  created_at: string
}

function formatDate(isoString: string) {
  if (!isoString) return ["-", "-"]
  const date = new Date(isoString)
  const dateStr = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  return [dateStr, timeStr]
}

export default function ExperimentHistoryPage() {
  const [experiments, setExperiments] = useState<ExpSummary[]>([])
  const [selectedExpId, setSelectedExpId] = useState<string | null>(null)
  const [expDetail, setExpDetail] = useState<ExpDetail | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetchExperiments()
  }, [])

  const fetchExperiments = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/qml/experiments/history")
      if (!res.ok) throw new Error("Failed to fetch experiments")
      const data = await res.json()
      setExperiments(data)
      if (data.length > 0) {
        handleSelectExp(data[0].id)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectExp = async (id: string) => {
    setSelectedExpId(id)
    setDetailLoading(true)
    try {
      const res = await fetch(`/api/qml/experiment/${id}`)
      if (!res.ok) throw new Error("Failed to fetch details")
      const data = await res.json()
      setExpDetail(data)
    } catch (err: any) {
      console.error(err)
    } finally {
      setDetailLoading(false)
    }
  }

  const completedCount = experiments.filter(e => e.status === "COMPLETED").length
  const failedCount = experiments.filter(e => e.status === "FAILED").length
  const runningCount = experiments.filter(e => e.status === "RUNNING").length

  return (
    <ResearcherLayout 
      title="Experiment History" 
      subtitle="Track, reproduce and manage your research experiments."
    >
      <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-8">
        
        {/* Top Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <FlaskConical size={24} />
            </div>
            <div>
              <div className="text-slate-500 text-[13px] font-semibold mb-0.5">Total Experiments</div>
              <div className="text-[28px] font-extrabold text-slate-800 leading-none">{experiments.length}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-slate-500 text-[13px] font-semibold mb-0.5">Completed</div>
              <div className="text-[28px] font-extrabold text-slate-800 leading-none">{completedCount}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
              <PlayCircle size={24} />
            </div>
            <div>
              <div className="text-slate-500 text-[13px] font-semibold mb-0.5">Running</div>
              <div className="text-[28px] font-extrabold text-slate-800 leading-none">{runningCount}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
              <XCircle size={24} />
            </div>
            <div>
              <div className="text-slate-500 text-[13px] font-semibold mb-0.5">Failed</div>
              <div className="text-[28px] font-extrabold text-slate-800 leading-none">{failedCount}</div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search experiment ID, dataset, model..." 
                className="pl-9 pr-4 py-2.5 w-[280px] text-[13px] bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 font-medium placeholder:text-slate-400"
              />
            </div>
            <button className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
              Status <ChevronDown size={14} className="text-slate-400" />
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
              Dataset <ChevronDown size={14} className="text-slate-400" />
            </button>
            <button className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
              Newest First <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-bold shadow-[0_2px_10px_rgba(37,99,235,0.2)] transition-colors">
            <Plus size={16} /> New Experiment
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex items-start gap-6 h-[calc(100vh-280px)]">
          
          {/* Left Table Section */}
          <div className="flex-1 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col h-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-[16px] font-bold text-slate-800">Experiment Runs</h2>
                <p className="text-[13px] text-slate-500 font-medium mt-0.5">Browse and inspect previous research runs.</p>
              </div>
              <button onClick={fetchExperiments} className="text-blue-600 hover:text-blue-700 font-semibold text-[13px] flex items-center gap-1">
                <RotateCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>
            
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="h-full flex items-center justify-center flex-col text-slate-400 gap-3 min-h-[300px]">
                  <Loader2 size={32} className="animate-spin text-blue-500" />
                  <p className="text-sm font-semibold">Loading experiments...</p>
                </div>
              ) : error ? (
                <div className="p-6 text-red-500 font-semibold min-h-[300px]">{error}</div>
              ) : experiments.length === 0 ? (
                <div className="h-full flex items-center justify-center flex-col text-slate-400 gap-3 min-h-[300px]">
                  <FlaskConical size={48} className="opacity-20" />
                  <p className="text-sm font-semibold text-slate-500">No experiments found.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 shadow-[0_1px_0_#f1f5f9]">
                    <tr>
                      <th className="px-5 py-3 w-10"></th>
                      <th className="px-5 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Experiment</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Dataset</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Model / Approach</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Started</th>
                      <th className="px-5 py-3 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Run Version</th>
                      <th className="px-5 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {experiments.map((exp) => {
                      const [date, time] = formatDate(exp.created_at)
                      return (
                        <tr 
                          key={exp.id} 
                          onClick={() => handleSelectExp(exp.id)}
                          className={`group hover:bg-slate-50 cursor-pointer transition-colors ${selectedExpId === exp.id ? 'bg-blue-50/40 hover:bg-blue-50/60' : ''}`}
                        >
                          <td className="px-5 py-4">
                            <div className="w-4 h-4 rounded border border-slate-300"></div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-[13px] font-bold text-slate-800">{exp.id.split('-').slice(0, 2).join('-')}</span>
                            <span className="text-[11px] block text-slate-400">{exp.id.split('-')[2]}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col">
                              <span className="text-[13px] font-semibold text-slate-700">{exp.dataset_name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[13px] font-semibold text-slate-600">
                            {exp.qml_model_type}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${
                                exp.status === 'COMPLETED' ? 'bg-emerald-500' :
                                exp.status === 'FAILED' ? 'bg-red-500' :
                                exp.status === 'RUNNING' ? 'bg-amber-500' : 'bg-slate-300'
                              }`}></div>
                              <span className={`text-[12px] font-bold ${
                                exp.status === 'COMPLETED' ? 'text-emerald-600' :
                                exp.status === 'FAILED' ? 'text-red-600' :
                                exp.status === 'RUNNING' ? 'text-amber-600' : 'text-slate-500'
                              }`}>{exp.status}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col">
                              <span className="text-[13px] font-semibold text-slate-700">{date}</span>
                              <span className="text-[11px] font-semibold text-slate-400">{time}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold">
                              v1.0
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <ChevronRight size={16} className={`text-slate-300 group-hover:text-blue-500 transition-colors ${selectedExpId === exp.id ? 'text-blue-500' : ''}`} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white mt-auto">
              <div className="text-[12px] font-semibold text-slate-500">
                Showing {experiments.length > 0 ? 1 : 0}-{experiments.length} of {experiments.length} experiments
              </div>
            </div>
          </div>

          {/* Right Detail Section */}
          <div className="w-[600px] flex-shrink-0 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col h-full overflow-hidden">
            {detailLoading ? (
               <div className="flex-1 flex items-center justify-center flex-col text-slate-400 gap-3 min-h-[400px]">
                 <Loader2 size={32} className="animate-spin text-blue-500" />
               </div>
            ) : !expDetail ? (
               <div className="flex-1 flex items-center justify-center text-slate-400 min-h-[400px]">
                 <p className="text-sm font-semibold">Select an experiment to view details</p>
               </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto">
                  {/* Header */}
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Network size={20} />
                      </div>
                      <div>
                        <h2 className="text-[18px] font-extrabold text-slate-800 leading-none">{expDetail.experiment_id}</h2>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/50 flex items-center gap-1.5 ml-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">Completed</span>
                      </div>
                    </div>
                    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Timestamps */}
                    <div className="flex items-center justify-between bg-slate-50/80 rounded-xl p-4 border border-slate-100/50">
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-slate-400" />
                        <div>
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Started</div>
                          <div className="text-[13px] font-semibold text-slate-800">{formatDate(expDetail.created_at).join(', ')}</div>
                        </div>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-slate-400" />
                        <div>
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Target Column</div>
                          <div className="text-[13px] font-semibold text-slate-800">{expDetail.target_col}</div>
                        </div>
                      </div>
                    </div>

                    {/* Configuration Snapshot */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[14px] font-extrabold text-slate-800 flex items-center gap-2">
                          <SlidersHorizontal size={16} className="text-blue-500" /> Configuration Snapshot
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {/* Dataset */}
                        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-3 text-[13px] font-bold text-slate-700">
                            <Database size={14} className="text-blue-500" /> Dataset
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-[12px] font-medium text-slate-500">Dataset</span>
                              <span className="text-[12px] font-semibold text-slate-800 truncate pl-2">{expDetail.dataset_name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[12px] font-medium text-slate-500">Target</span>
                              <span className="text-[12px] font-semibold text-slate-800 truncate">{expDetail.target_col}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[12px] font-medium text-slate-500">Selected Features</span>
                              <span className="text-[12px] font-semibold text-slate-800">{expDetail.pipeline_summary?.selected_features?.length || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Quantum Configuration */}
                        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-3 text-[13px] font-bold text-slate-700">
                            <Network size={14} className="text-blue-500" /> Quantum Configuration
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-[12px] font-medium text-slate-500">Encoding</span>
                              <span className="text-[12px] font-semibold text-slate-800">Angle Encoding</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[12px] font-medium text-slate-500">Qubits (PCA)</span>
                              <span className="text-[12px] font-semibold text-slate-800">{expDetail.pipeline_summary?.n_qubits}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[12px] font-medium text-slate-500">Circuit Depth</span>
                              <span className="text-[12px] font-semibold text-slate-800">{expDetail.quantum_resources?.depth || 3}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[12px] font-medium text-slate-500">Gates</span>
                              <span className="text-[12px] font-semibold text-slate-800">{expDetail.quantum_resources?.total_gates || 12}</span>
                            </div>
                          </div>
                        </div>

                        {/* Preprocessing */}
                        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm col-span-2">
                          <div className="flex items-center gap-2 mb-3 text-[13px] font-bold text-slate-700">
                            <Activity size={14} className="text-blue-500" /> Validation Outcome
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-[12px] font-medium text-slate-500">Result</span>
                              <span className="text-[12px] font-semibold text-emerald-600">{expDetail.benchmark?.outcome}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[12px] font-medium text-slate-500">Classical Champion</span>
                              <span className="text-[12px] font-semibold text-slate-800">
                                {expDetail.benchmark?.classical_champion?.name} (Acc: {expDetail.benchmark?.classical_champion?.accuracy}%)
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-[12px] font-medium text-slate-500">Quantum Champion</span>
                              <span className="text-[12px] font-semibold text-slate-800">
                                {expDetail.benchmark?.quantum_champion?.name} (Acc: {expDetail.benchmark?.quantum_champion?.accuracy}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 flex-wrap mt-auto">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-bold shadow-sm transition-colors whitespace-nowrap">
                    <FileText size={16} /> View Full Report
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] font-bold text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                    <Download size={16} className="text-slate-500" /> Export Record
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </ResearcherLayout>
  )
}
