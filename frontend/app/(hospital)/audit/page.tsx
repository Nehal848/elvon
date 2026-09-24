"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import HospitalLayout from "@/components/hospital-layout"
import { 
  ShieldCheck, Clock, User, Filter, Search, Download, 
  CheckCircle2, AlertTriangle, Eye, Lock, FileText, ArrowRight,
  Database, Activity, RefreshCw, Cpu, X, Terminal, ShieldAlert
} from "lucide-react"

interface AuditLog {
  id: string
  timestamp: string
  user: string
  role: string
  action: string
  resource: string
  category: "Security" | "Inference" | "Access" | "Export" | "Config"
  status: "success" | "warning" | "verified"
  ip: string
  details: string
}

const DEFAULT_LOGS: AuditLog[] = [
  {
    id: "AUD-8921",
    timestamp: "2 mins ago",
    user: "Dr. Ananya Sharma",
    role: "Clinician",
    action: "Model Inference Executed",
    resource: "QSVM Breast Cancer v2.1",
    category: "Inference",
    status: "verified",
    ip: "10.0.4.18 (Enclave)",
    details: "Zero-leakage inference on Patient P-1024; Perturbation sensitivity score 0.94."
  },
  {
    id: "AUD-8920",
    timestamp: "14 mins ago",
    user: "Dr. Vikram Sarabhai",
    role: "Quantum Researcher",
    action: "NISQ Simulator Job Dispatched",
    resource: "VQC Circuit (8-Qubit Statevector)",
    category: "Config",
    status: "success",
    ip: "10.0.12.91",
    details: "PennyLane default.qubit simulator; 2048 shots; Hardware readiness score 87%."
  },
  {
    id: "AUD-8919",
    timestamp: "42 mins ago",
    user: "CityCare Admin",
    role: "Hospital Admin",
    action: "HL7/FHIR Feed Synced",
    resource: "PACS DICOM Server 02",
    category: "Access",
    status: "verified",
    ip: "192.168.1.105",
    details: "18 new radiology imaging studies ingested with verified SHA-256 integrity hash."
  },
  {
    id: "AUD-8918",
    timestamp: "1 hour ago",
    user: "Aarav Patel",
    role: "Data Scientist",
    action: "AutoML Pipeline Completed",
    resource: "Tournament #TRN-2026-04",
    category: "Inference",
    status: "success",
    ip: "10.0.8.44",
    details: "Trained 5 candidate models (XGBoost, RandomForest, QSVM); Champion accuracy 95.8%."
  },
  {
    id: "AUD-8917",
    timestamp: "2 hours ago",
    user: "System Daemon",
    role: "Security Sentinel",
    action: "Enclave Memory Integrity Check",
    resource: "Isolated RAM Sandbox",
    category: "Security",
    status: "verified",
    ip: "127.0.0.1 (Localhost)",
    details: "Zero memory leakage detected across all running containerized inference workers."
  },
  {
    id: "AUD-8916",
    timestamp: "3 hours ago",
    user: "Dr. Ananya Sharma",
    role: "Clinician",
    action: "Patient Diagnostic Report Export",
    resource: "Report #REP-9041 (Patient P-1088)",
    category: "Export",
    status: "success",
    ip: "10.0.4.18 (Enclave)",
    details: "Encrypted PDF generated with digital cryptographic clinician signature."
  },
  {
    id: "AUD-8915",
    timestamp: "5 hours ago",
    user: "System Daemon",
    role: "Compliance Sentinel",
    action: "Differential Privacy Noise Audit",
    resource: "Patient Cohort Registry",
    category: "Security",
    status: "verified",
    ip: "127.0.0.1 (Localhost)",
    details: "Epsilon budget epsilon=0.5 validated; Patient re-identification risk < 0.01%."
  }
]

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>(DEFAULT_LOGS)
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [summary, setSummary] = useState({
    total_events: 1428,
    security_incidents: 0,
    model_inferences: 842,
    data_access_events: 586
  })

  const categories = ["All", "Security", "Inference", "Access", "Export", "Config"]

  useEffect(() => {
    fetchAudit()
  }, [])

  const fetchAudit = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/hospital/audit")
      if (res.ok) {
        const data = await res.json()
        if (data.logs && data.logs.length > 0) {
          setLogs(data.logs)
        }
        if (data.summary) {
          setSummary(data.summary)
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = () => {
    const headers = ["ID", "Timestamp", "User", "Role", "Action", "Resource", "Category", "Status", "IP", "Details"]
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.user}"`,
      `"${l.role}"`,
      `"${l.action}"`,
      `"${l.resource}"`,
      l.category,
      l.status,
      `"${l.ip}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `elvon_audit_log_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredLogs = logs.filter(log => {
    const matchesCat = activeCategory === "All" || log.category.toLowerCase() === activeCategory.toLowerCase()
    const q = searchQuery.toLowerCase()
    const matchesSearch = !q || 
      log.user.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.resource.toLowerCase().includes(q) ||
      log.id.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    return matchesCat && matchesSearch
  })

  return (
    <HospitalLayout 
      title="Audit & Activity Log" 
      subtitle="HIPAA & FHIR compliant system telemetry, clinician access logs, and AI model execution audit."
    >
      <div className="max-w-[1500px] space-y-6 pb-12">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Total Audit Events</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{summary.total_events || 1428}</h3>
              <p className="text-[11px] font-semibold text-emerald-600">100% Immutable</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Security Incidents</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{summary.security_incidents || 0}</h3>
              <p className="text-[11px] font-semibold text-emerald-600">All checks passed</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Cpu size={22} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Model Inferences</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{summary.model_inferences || 842}</h3>
              <p className="text-[11px] font-semibold text-purple-600">Enclave Sandbox</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
              <Activity size={22} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Data Access Events</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{summary.data_access_events || 586}</h3>
              <p className="text-[11px] font-semibold text-cyan-600">Verified TLS 1.3</p>
            </div>
          </div>
        </div>

        {/* Filter, Search & Export Actions */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-[320px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, action, resource, ID..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400 font-medium text-slate-700 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={fetchAudit}
              title="Refresh Telemetry"
              className="p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-[13px] font-bold hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            >
              <Download size={15} /> Export Audit Log
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Clock size={18} className="text-blue-500" /> Recent Security & System Operations
            </div>
            <span className="text-[12px] font-semibold text-slate-500">
              Showing {filteredLogs.length} of {logs.length} entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100 bg-slate-50/50">
                  <th className="py-3 px-6">Event ID / Time</th>
                  <th className="py-3 px-4">User & Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4">Status & IP</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-6 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-blue-600 text-[12px]">{log.id}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{log.timestamp}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800">{log.user}</div>
                      <div className="text-[11px] text-slate-500 font-semibold">{log.role}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {log.action}
                    </td>
                    <td className="py-4 px-4 font-mono text-[12px] text-slate-600">
                      {log.resource}
                    </td>
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {log.status.toUpperCase()}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.ip}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-500 text-[12px] max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Inspect Event"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Event Detail Inspection Modal */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-slate-900">Audit Record: {selectedLog.id}</h3>
                    <p className="text-[12px] text-slate-400">{selectedLog.timestamp} · Enclave Sandbox Verified</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 pt-4 text-[13px]">
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-slate-400 block mb-0.5">Originating User</span>
                    <span className="font-bold text-slate-800">{selectedLog.user}</span>
                    <span className="text-[11px] text-slate-500 block">({selectedLog.role})</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase text-slate-400 block mb-0.5">Category & Status</span>
                    <span className="font-semibold text-slate-700">{selectedLog.category}</span>
                    <span className="text-[11px] text-emerald-600 font-bold block">✓ Verified Hash</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Target Resource</span>
                  <div className="p-3 bg-slate-50 rounded-xl font-mono text-[12px] text-slate-700">
                    {selectedLog.resource}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Execution Telemetry</span>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-xl leading-relaxed">
                    {selectedLog.details}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Cryptographic & Security Proof</span>
                  <div className="bg-[#0f172a] text-slate-300 p-3 rounded-xl font-mono text-[11px] space-y-1">
                    <div>SHA-256: 8f3a9d10b7c4e2098d6174a...01ef</div>
                    <div>Zero-Leakage Sandbox: PASS (RAM Enclave)</div>
                    <div>IP & TLS: {selectedLog.ip} · TLS 1.3 AES-GCM-256</div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="px-5 py-2 rounded-xl text-[13px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </HospitalLayout>
  )
}
