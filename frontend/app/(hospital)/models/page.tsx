"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import HospitalLayout from "@/components/hospital-layout"
import { 
  BrainCircuit, HeartPulse, Droplet, CheckCircle2, ArrowRight, Network, Loader2, AlertCircle
} from "lucide-react"

interface Model {
  id: string
  name: string
  type: string
  category: string
  ownership: string
  disease: string
  accuracy: number
  f1_score: number
  status: string
  feedback_count: number
  deployed_at: string
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/hospital/models")
      if (!res.ok) throw new Error("Failed to load models.")
      const data = await res.json()
      setModels(data.models || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Group models by disease
  const groupedModels = models.reduce((acc, model) => {
    const disease = model.disease || "Unknown"
    if (!acc[disease]) acc[disease] = []
    acc[disease].push(model)
    return acc
  }, {} as Record<string, Model[]>)

  return (
    <HospitalLayout 
      title="AI Models" 
      subtitle="Select a pre-trained model to analyze a patient report."
    >
      <div className="max-w-[1400px] space-y-6 pb-12">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-[20px] p-8 flex items-center justify-between border border-blue-100/50 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-cyan-100/30 to-transparent rounded-r-[20px]" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-[0_4px_20px_rgba(59,130,246,0.15)] relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-purple-400 opacity-20 rounded-full blur-md" />
              <BrainCircuit size={32} className="text-purple-600 relative z-10" />
            </div>
            
            <div>
              <h2 className="text-[18px] font-extrabold text-[#1e3a8a] mb-1">Clinical AI Models</h2>
              <p className="text-[14px] text-slate-500 font-medium">Choose from validated Classical ML and Hybrid QML models<br/>for supported disease detection tasks.</p>
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[13px] font-bold text-emerald-600">{models.filter(m => m.status === 'active').length} Models Active</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 font-semibold flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Models List */}
        {loading ? (
          <div className="flex items-center justify-center h-48 gap-3">
            <Loader2 className="animate-spin text-slate-400" />
            <p className="text-sm font-medium text-slate-500">Loading deployed models...</p>
          </div>
        ) : Object.keys(groupedModels).length === 0 ? (
          <div className="flex items-center justify-center h-48 bg-white rounded-2xl border border-slate-100">
            <p className="text-sm font-medium text-slate-500">No active models found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedModels).map(([disease, diseaseModels]) => {
              // Determine appropriate icon for disease
              let icon = <BrainCircuit size={24} className="text-purple-500" />
              let iconBg = "bg-purple-50"
              if ((disease || "").toLowerCase().includes("cardio")) {
                icon = <HeartPulse size={24} className="text-red-500" />; iconBg = "bg-red-50"
              } else if ((disease || "").toLowerCase().includes("diab")) {
                icon = <Droplet size={24} className="text-rose-500" />; iconBg = "bg-rose-50"
              }

              return (
                <ModelSection 
                  key={disease}
                  title={disease}
                  icon={icon}
                  iconBg={iconBg}
                  models={diseaseModels}
                />
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div className="pt-8 pb-4 flex items-center justify-center gap-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <span>ELVON • Clinical Intelligence</span>
          <span className="opacity-50">|</span>
          <span>Secure • Explainable • Reliable</span>
        </div>

      </div>
    </HospitalLayout>
  )
}

function ModelSection({ title, icon, iconBg, models }: { title: string, icon: React.ReactNode, iconBg: string, models: Model[] }) {
  // Sort models: Quantum first, then Classical, just for consistent display order
  const sortedModels = [...models].sort((a, b) => (b.category || "").localeCompare(a.category || ""))

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <h3 className="text-[18px] font-extrabold text-slate-900">{title}</h3>
        <div className="ml-2 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
            {models.length} Model{models.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      <div className={`p-8 grid grid-cols-1 ${models.length > 1 ? 'md:grid-cols-2' : ''} gap-8`}>
        {sortedModels.map(model => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  )
}

function ModelCard({ model }: { model: Model }) {
  const isQuantum = (model.category || "").toLowerCase().includes("quantum") || (model.type || "").toLowerCase().includes("quantum")
  
  // Theme assignments
  const cardBorder = isQuantum ? "border-purple-100/50" : "border-slate-100"
  const iconWrapper = isQuantum ? "bg-purple-100/50 border-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.15)]" : "bg-blue-100/50 border-blue-100"
  const iconComponent = isQuantum ? <BrainCircuit size={20} className="text-purple-600" /> : <Network size={20} className="text-blue-600" />
  const primaryColor = isQuantum ? "text-purple-600" : "text-blue-600"
  const primaryBorder = isQuantum ? "border-purple-300" : "border-blue-200"
  const secondaryColor = isQuantum ? "text-slate-700" : "text-cyan-600"
  const secondaryBorder = isQuantum ? "border-slate-200" : "border-cyan-200"
  
  return (
    <div className={`bg-[#f8fafc] rounded-[20px] p-6 border ${cardBorder} flex flex-col justify-between relative overflow-hidden`}>
      {isQuantum && (
        <div className="absolute right-0 top-0 w-32 h-32 bg-purple-200/20 blur-3xl rounded-full pointer-events-none" />
      )}
      
      <div>
        <div className="flex items-start justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${iconWrapper}`}>
              {iconComponent}
            </div>
            <div>
              <h4 className="text-[16px] font-bold text-slate-900">{model.category}</h4>
              <p className="text-[13px] text-slate-500 font-medium">{model.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${model.ownership === 'hospital' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${model.ownership === 'hospital' ? 'bg-indigo-500' : 'bg-emerald-500'}`} /> {model.ownership === 'hospital' ? 'Custom' : 'Platform'}
            </div>
            {model.status === 'active' && (
              <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-4 relative z-10">
          <span className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Performance Metrics</span>
        </div>
        
        <div className="flex items-center gap-6 mb-8 relative z-10">
          <MetricCircle value={model.accuracy} label="Accuracy" color={primaryColor} border={primaryBorder} />
          <div className="h-6 w-px bg-slate-200" />
          <MetricCircle value={model.f1_score} label="F1-Score" color={secondaryColor} border={secondaryBorder} />
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-auto relative z-10">
        <div className="text-[11px] font-bold text-slate-400">{model.type}</div>
        <div className="flex flex-col items-end gap-3">
          <Link href="/analysis-report" className={`bg-gradient-to-r text-white px-6 py-2.5 rounded-full text-[14px] font-bold flex items-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg no-underline ${isQuantum ? 'from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 shadow-blue-500/25' : 'from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 shadow-blue-500/20'}`}>
            Use {isQuantum ? 'Hybrid QML' : 'Classical ML'} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function MetricCircle({ value, label, color, border }: { value: number, label: string, color: string, border: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 rounded-full border-2 ${border} flex items-center justify-center`}>
        <span className={`text-[11px] font-bold ${color}`}>{value}</span>
        <span className={`text-[8px] font-bold ${color} opacity-70`}>%</span>
      </div>
      <div>
        <div className={`text-[15px] font-extrabold text-slate-900 leading-none mb-1`}>{value}%</div>
        <div className="text-[11px] font-semibold text-slate-500 leading-none">{label}</div>
      </div>
    </div>
  )
}
