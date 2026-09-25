"use client"

import React, { useEffect, useState } from "react"
import HospitalLayout from "@/components/hospital-layout"
import {
  Plug, CheckCircle2, AlertTriangle, XCircle, Wifi, WifiOff,
  MonitorSpeaker, Heart, Droplets, FileText, Radio, Database, Scan
} from "lucide-react"

type Integration = {
  system: string; type: string; connected_models: string[]; status: string;
  health: string; last_check: string
}

const DEFAULT_INTEGRATIONS: Integration[] = [
  { system: "MRI System", type: "DICOM PACS", connected_models: ["PulmoScan Neural Net v2.1", "NeuroVision 3D"], status: "Connected", health: "healthy", last_check: "1 min ago" },
  { system: "CT Scanner", type: "DICOM PACS", connected_models: ["Quantum HepatoVision Classifier"], status: "Connected", health: "healthy", last_check: "2 mins ago" },
  { system: "Digital X-Ray", type: "DICOM Web", connected_models: ["PulmoScan Neural Net v2.1"], status: "Connected", health: "healthy", last_check: "Just now" },
  { system: "ECG Machine", type: "HL7 / Telemetry", connected_models: ["Quantum-Enhanced VQC Heart Classifier", "Ensemble CardioNet v2.4"], status: "Connected", health: "healthy", last_check: "Just now" },
  { system: "Haematology Analyser", type: "LIS ASTM", connected_models: ["DeepGlycemia Predictor v1.8"], status: "Connected", health: "healthy", last_check: "5 mins ago" },
  { system: "Pathology Lab", type: "FHIR Lab", connected_models: ["RenalInsight AI v3.0"], status: "Connected", health: "healthy", last_check: "8 mins ago" },
  { system: "PACS Server", type: "Orthanc DICOM", connected_models: ["All Diagnostic Models"], status: "Connected", health: "healthy", last_check: "Just now" },
  { system: "Genomics Sequencer", type: "FASTQ Stream", connected_models: ["Quantum Kernel Biomarker Analyzer"], status: "Connected", health: "healthy", last_check: "14 mins ago" },
  { system: "Voice Recorder", type: "Audio Stream", connected_models: ["Clinical Gemini Scribe"], status: "Standby", health: "degraded", last_check: "35 mins ago" }
]

const DEFAULT_INTEGRATION_SUMMARY = {
  healthy: 8,
  degraded: 1,
  offline: 0,
  total: 9
}

const SYSTEM_ICONS: Record<string, React.ReactNode> = {
  "MRI System": <MonitorSpeaker size={24} />,
  "CT Scanner": <Scan size={24} />,
  "Digital X-Ray": <Scan size={24} />,
  "ECG Machine": <Heart size={24} />,
  "Haematology Analyser": <Droplets size={24} />,
  "Pathology Lab": <FileText size={24} />,
  "Voice Recorder": <Radio size={24} />,
  "PACS Server": <Database size={24} />,
  "Genomics Sequencer": <Database size={24} />,
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(DEFAULT_INTEGRATIONS)
  const [summary, setSummary] = useState<any>(DEFAULT_INTEGRATION_SUMMARY)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/hospital/integrations")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.integrations && data.integrations.length > 0) {
          setIntegrations(data.integrations)
          setSummary(data.summary || DEFAULT_INTEGRATION_SUMMARY)
        }
      })
      .catch(() => {})
  }, [])

  const healthColor = (health: string) => {
    if (health === "healthy") return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" }
    if (health === "degraded") return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" }
    return { bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-300", dot: "bg-slate-400" }
  }

  return (
    <HospitalLayout title="Integrations" subtitle="Connected diagnostic systems and AI model routing">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Healthy</p>
              <h3 className="text-2xl font-bold text-emerald-600">{summary?.healthy || 0}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertTriangle size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Degraded</p>
              <h3 className="text-2xl font-bold text-amber-600">{summary?.degraded || 0}</h3>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-slate-100 text-slate-500 rounded-xl"><WifiOff size={24} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Offline</p>
              <h3 className="text-2xl font-bold text-slate-600">{summary?.offline || 0}</h3>
            </div>
          </div>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <p className="text-sm text-slate-500 col-span-3 text-center py-12">Loading integrations...</p>
          ) : (
            integrations.map((integ) => {
              const colors = healthColor(integ.health)
              return (
                <div key={integ.system} className={`bg-white rounded-2xl border ${colors.border} shadow-sm p-5 hover:shadow-md transition-shadow`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.text}`}>
                      {SYSTEM_ICONS[integ.system] || <Plug size={24} />}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${colors.dot} ${integ.health === "degraded" ? "animate-pulse" : ""}`} />
                      <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>{integ.health}</span>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1">{integ.system}</h4>
                  <p className="text-xs text-slate-400 mb-4 capitalize">{integ.type}</p>

                  {/* Connected Models */}
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Connected Models</p>
                    {integ.connected_models.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {integ.connected_models.map(model => (
                          <span key={model} className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{model}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No models connected</p>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Wifi size={10} /> Last check: {new Date(integ.last_check).toLocaleString()}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Connection Map */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">System → Model Connection Map</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">System</th>
                  <th className="p-4 font-semibold">Type</th>
                  <th className="p-4 font-semibold">Models</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {integrations.map((integ) => {
                  const colors = healthColor(integ.health)
                  return (
                    <tr key={integ.system} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-semibold text-slate-900">{integ.system}</td>
                      <td className="p-4 text-slate-500 capitalize">{integ.type}</td>
                      <td className="p-4">
                        {integ.connected_models.length > 0
                          ? integ.connected_models.map(m => <span key={m} className="inline-block text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full mr-1">{m}</span>)
                          : <span className="text-xs text-slate-400 italic">None</span>}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${colors.text}`}>
                          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />{integ.health}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HospitalLayout>
  )
}
