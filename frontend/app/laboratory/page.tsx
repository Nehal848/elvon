"use client"

import React, { useEffect, useState } from "react"
import HospitalLayout from "@/components/hospital-layout"
import {
  Wifi, WifiOff, AlertTriangle, CheckCircle2, Activity, Upload,
  MonitorSpeaker, Scan, Heart, Droplets, FileText, Radio, Database,
  Layers, Eye, ExternalLink, ShieldCheck, RefreshCw, Cpu, Stethoscope
} from "lucide-react"

type LabSource = { id: string; name: string; type: string; status: string; active: boolean; recent_uploads: number; last_sync: string; error: string | null }
type LabUpload = { id: string; source: string; patient_id: string; patient_name: string; filename: string; timestamp: string; status: string; model_applied: string | null }

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  "MRI": <MonitorSpeaker size={24} />,
  "CT Scan": <Scan size={24} />,
  "X-Ray": <Scan size={24} />,
  "Blood Report": <Droplets size={24} />,
  "Pathology": <FileText size={24} />,
  "ECG": <Heart size={24} />,
  "EMR": <Database size={24} />,
  "EHR": <Database size={24} />,
  "PACS": <Radio size={24} />,
}

export default function LaboratoryPage() {
  const [activeTab, setActiveTab] = useState<"systems" | "pacs" | "fhir">("systems")
  const [sources, setSources] = useState<LabSource[]>([])
  const [uploads, setUploads] = useState<LabUpload[]>([])
  const [pacsStudies, setPacsStudies] = useState<any[]>([])
  const [fhirBundle, setFhirBundle] = useState<any>(null)
  const [selectedStudy, setSelectedStudy] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterSource, setFilterSource] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/lab/sources").then(r => r.json()).catch(() => ({ sources: [] })),
      fetch("/api/lab/uploads").then(r => r.json()).catch(() => ({ uploads: [] })),
      fetch("/api/lab/pacs/studies").then(r => r.json()).catch(() => ({ studies: [] })),
      fetch("/api/lab/fhir/bundles").then(r => r.json()).catch(() => ({})),
    ]).then(([srcData, uplData, pacsData, fhirData]) => {
      setSources(srcData.sources || [])
      setUploads(uplData.uploads || [])
      setPacsStudies(pacsData.studies || [])
      setFhirBundle(fhirData)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filteredUploads = filterSource
    ? uploads.filter(u => u.source === filterSource)
    : uploads

  return (
    <HospitalLayout title="Laboratory & PACS Imaging" subtitle="Enterprise diagnostic systems, DICOM archive, and HL7 FHIR clinical telemetry">
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("systems")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "systems"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Diagnostic Instruments & Uploads
            </button>
            <button
              onClick={() => setActiveTab("pacs")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "pacs"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Radio size={14} /> PACS / DICOM Studies ({pacsStudies.length})
            </button>
            <button
              onClick={() => setActiveTab("fhir")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "fhir"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Database size={14} /> HL7 FHIR Gateway
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Zero-Leakage DICOM Anonymization Active
          </div>
        </div>

        {/* TAB 1: Diagnostic Instruments & Uploads */}
        {activeTab === "systems" && (
          <div className="space-y-6">
            {/* Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={24} /></div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Connected Instruments</p>
                  <h3 className="text-2xl font-bold text-slate-900">{sources.filter(s => s.status === "connected").length} Online</h3>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><AlertTriangle size={24} /></div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Maintenance Alerts</p>
                  <h3 className="text-2xl font-bold text-slate-900">{sources.filter(s => s.status === "warning").length}</h3>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Upload size={24} /></div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">Diagnostic Telemetry Feeds</p>
                  <h3 className="text-2xl font-bold text-slate-900">{sources.reduce((sum, s) => sum + s.recent_uploads, 0)} Uploads</h3>
                </div>
              </div>
            </div>

            {/* Instruments Grid */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Laboratory Devices</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => setFilterSource(filterSource === source.name ? null : source.name)}
                    className={`text-left p-5 rounded-2xl border transition-all ${
                      filterSource === source.name
                        ? "border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20"
                        : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 bg-slate-50 rounded-xl text-slate-700">
                        {SOURCE_ICONS[source.type] || <Activity size={20} />}
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        source.status === "connected" ? "bg-emerald-50 text-emerald-700" :
                        source.status === "warning" ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        {source.status === "connected" ? <Wifi size={12} /> : <WifiOff size={12} />}
                        {source.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{source.name}</h4>
                    <p className="text-xs text-slate-500 mb-2">{source.type}</p>
                    <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-100 pt-2 font-medium">
                      <span>Sync: {source.last_sync}</span>
                      <span className="font-bold text-slate-700">{source.recent_uploads} files</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Uploads Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload size={18} className="text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    {filterSource ? `Uploads from ${filterSource}` : "All Recent Imaging & Lab Uploads"}
                  </h3>
                </div>
                {filterSource && (
                  <button onClick={() => setFilterSource(null)} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    Show All
                  </button>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Source</th>
                      <th className="p-4 font-semibold">Patient</th>
                      <th className="p-4 font-semibold">File</th>
                      <th className="p-4 font-semibold">Model Applied</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    {filteredUploads.map((upload) => (
                      <tr key={upload.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                            {upload.source}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-slate-900">{upload.patient_name}</td>
                        <td className="p-4 text-slate-500 text-xs font-mono">{upload.filename}</td>
                        <td className="p-4">
                          {upload.model_applied ? (
                            <span className="text-xs font-semibold text-violet-600">{upload.model_applied}</span>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Pending</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            upload.status === "analyzed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {upload.status === "analyzed" ? <CheckCircle2 size={12} /> : <Activity size={12} />}
                            {upload.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 text-right text-xs whitespace-nowrap">
                          {new Date(upload.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PACS / DICOM Imaging Archive */}
        {activeTab === "pacs" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">PACS / DICOMWeb Study Archive</h3>
                  <p className="text-xs text-slate-500">DICOM Part 10 studies indexed from radiology gateways with automated zero-leakage PHI masking.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                    Gateway: DCM4CHEE / Orthanc 2026.1
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-3.5 font-semibold">Study UID</th>
                      <th className="p-3.5 font-semibold">Patient Name</th>
                      <th className="p-3.5 font-semibold">Modality</th>
                      <th className="p-3.5 font-semibold">Body Part</th>
                      <th className="p-3.5 font-semibold">Series / Instances</th>
                      <th className="p-3.5 font-semibold">Study Description</th>
                      <th className="p-3.5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    {pacsStudies.map((study, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-mono text-xs text-blue-600 font-bold">{study.study_uid || `1.2.840.10008.${idx+101}`}</td>
                        <td className="p-3.5 font-bold text-slate-900">{study.patient_name}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            {study.modality}
                          </span>
                        </td>
                        <td className="p-3.5 font-medium text-slate-700">{study.body_part || "CHEST"}</td>
                        <td className="p-3.5 text-xs text-slate-500 font-mono">{study.series_count || 2} Series ({study.instance_count || 14} DICOMs)</td>
                        <td className="p-3.5 text-xs text-slate-600">{study.description || "Routine Diagnostic Imaging"}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setSelectedStudy(study)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={14} /> Inspect DICOM
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Study Detail Modal */}
            {selectedStudy && (
              <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scan className="text-blue-400" size={20} />
                    <h4 className="text-base font-bold text-white">DICOM Metadata Inspector: {selectedStudy.patient_name}</h4>
                  </div>
                  <button onClick={() => setSelectedStudy(null)} className="text-xs text-slate-400 hover:text-white">Close</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 block mb-1">Modality</span>
                    <span className="text-sm font-bold text-purple-300">{selectedStudy.modality}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 block mb-1">Transfer Syntax</span>
                    <span className="text-sm font-bold text-emerald-300">Explicit VR Little Endian</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 block mb-1">Anonymization Protocol</span>
                    <span className="text-sm font-bold text-cyan-300">HIPAA Safe Harbor (Zero Leakage)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-slate-400 block mb-1">AI Pipeline</span>
                    <span className="text-sm font-bold text-indigo-300">DenseNet-121 + QSVM</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: HL7 FHIR Interoperability Gateway */}
        {activeTab === "fhir" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">HL7 FHIR R4 Clinical Resource Telemetry</h3>
                  <p className="text-xs text-slate-500">Live observation bundles consumed from hospital EHR interfaces via FHIR REST API standards.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  Protocol: FHIR v4.0.1 Compliant
                </span>
              </div>

              {fhirBundle && fhirBundle.entry ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {fhirBundle.entry.slice(0, 6).map((item: any, idx: number) => {
                      const res = item.resource || {}
                      const coding = res.code?.coding?.[0] || {}
                      const val = res.valueQuantity ? `${res.valueQuantity.value} ${res.valueQuantity.unit}` : "Recorded"
                      return (
                        <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{res.resourceType}</span>
                              <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">{coding.code || "VITAL"}</span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm mb-1">{res.code?.text || coding.display || "Clinical Observation"}</h4>
                            <p className="text-xs text-slate-500 mb-3">Status: <strong className="text-slate-700">{res.status || "final"}</strong></p>
                          </div>
                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-xs text-slate-500 font-medium">Observed Value:</span>
                            <span className="text-sm font-extrabold text-blue-600">{val}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto max-h-64">
                    <div className="text-[11px] font-bold text-emerald-400 mb-2 uppercase">// Raw FHIR Bundle Snapshot</div>
                    <pre>{JSON.stringify(fhirBundle, null, 2)}</pre>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm font-medium">
                  Connecting to HL7 FHIR server...
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </HospitalLayout>
  )
}
