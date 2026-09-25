"use client"

import React from "react"
import HospitalLayout from "@/components/hospital-layout"
import { 
  Folder, FlaskConical, Play, ArrowRight, MoreHorizontal, 
  Database, Atom, Activity, FileText
} from "lucide-react"

export default function ResearchDashboardPage() {
  return (
    <HospitalLayout 
      title="Experiment Hub" 
      subtitle="Monitor your research, experiments and quantum model performance."
    >
      <div className="max-w-[1500px] space-y-6 pb-12">
        
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="TOTAL DATASETS" value="12" 
            icon={<Folder size={20} className="text-blue-500" />} iconBg="bg-blue-100" 
            gradient="from-blue-50/50 to-transparent"
          />
          <StatCard 
            title="TOTAL EXPERIMENTS" value="28" 
            icon={<FlaskConical size={20} className="text-purple-500" />} iconBg="bg-purple-100"
            gradient="from-purple-50/50 to-transparent"
          />
          <StatCard 
            title="ACTIVE EXPERIMENTS" value="03" subtext="Currently running"
            icon={<Play size={20} className="text-emerald-500" fill="currentColor" />} iconBg="bg-emerald-100"
            gradient="from-emerald-50/50 to-transparent"
          />
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recent Experiments */}
          <div className="lg:col-span-6 bg-white rounded-[20px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FlaskConical size={16} />
                </div>
                <h3 className="text-[16px] font-bold text-slate-900">Recent Experiments</h3>
              </div>
              <button className="text-[13px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700">
                View All <ArrowRight size={14} />
              </button>
            </div>
            
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-[12px] font-semibold text-slate-400">Experiment</th>
                  <th className="pb-3 text-[12px] font-semibold text-slate-400">Status</th>
                  <th className="pb-3 text-[12px] font-semibold text-slate-400">Last Updated</th>
                  <th className="pb-3 text-[12px] font-semibold text-slate-400 text-right"></th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                <ExpRow name="Breast Cancer" status="Completed" time="2h ago" />
                <ExpRow name="Heart Disease" status="Running" time="15m ago" />
                <ExpRow name="Neurological" status="Draft" time="Yesterday" />
                <ExpRow name="Diabetes" status="Completed" time="2 days ago" />
              </tbody>
            </table>
          </div>

          {/* Active Dataset Details */}
          <div className="lg:col-span-3 bg-white rounded-[20px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Database size={16} />
                </div>
                <h3 className="text-[16px] font-bold text-slate-900">Active Dataset Details</h3>
              </div>
              
              <div className="flex items-center gap-2 mb-4 bg-[#f8fafc] p-3 rounded-[12px] border border-slate-100">
                <Folder size={18} className="text-blue-500" fill="currentColor" opacity={0.2} />
                <span className="text-[14px] font-bold text-slate-800">Breast Cancer Dataset</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mb-6">
                <div>
                  <div className="text-[14px] font-extrabold text-slate-900">569</div>
                  <div className="text-[10px] font-semibold text-slate-400">Samples</div>
                </div>
                <div>
                  <div className="text-[14px] font-extrabold text-slate-900">30</div>
                  <div className="text-[10px] font-semibold text-slate-400">Features</div>
                </div>
                <div>
                  <div className="text-[14px] font-extrabold text-slate-900">2</div>
                  <div className="text-[10px] font-semibold text-slate-400">Classes</div>
                </div>
                <div>
                  <div className="text-[12px] font-bold text-emerald-500 mb-1">0%</div>
                  <div className="text-[10px] font-semibold text-slate-400 leading-tight">Missing Values:</div>
                </div>
              </div>
              
              <div className="text-[12px] font-bold text-slate-700 mb-4">Class Distribution</div>
              
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  {/* SVG Donut */}
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0ea5e9" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="93.7" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[14px] font-extrabold text-slate-900 leading-none">569</span>
                    <span className="text-[8px] font-bold text-slate-500">Samples</span>
                  </div>
                </div>
                
                <div className="space-y-3 flex-1">
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]"/> <span className="text-slate-700">Class 0 (212)</span></div>
                    <span className="text-slate-500">37.3%</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-bold">
                    <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"/> <span className="text-slate-700">Class 1 (357)</span></div>
                    <span className="text-slate-500">62.7%</span>
                  </div>
                </div>
              </div>

            </div>
            <button className="mt-6 text-[13px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700">
              View Dataset <ArrowRight size={14} />
            </button>
          </div>

          {/* Quantum Parameter Details */}
          <div className="lg:col-span-3 bg-white rounded-[20px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Atom size={16} />
              </div>
              <h3 className="text-[16px] font-bold text-slate-900">Quantum Parameter details</h3>
            </div>
            
            <div className="space-y-6 flex-1">
              <ParamRow icon={<Atom size={14} className="text-purple-600" />} iconBg="bg-purple-100" label="Qubits:" value="8" />
              <div className="h-px bg-slate-50 w-full" />
              <ParamRow icon={<Activity size={14} className="text-emerald-600" />} iconBg="bg-emerald-100" label="Circuit Depth:" value="6" />
              <div className="h-px bg-slate-50 w-full" />
              <ParamRow icon={<Activity size={14} className="text-amber-600" />} iconBg="bg-amber-100" label="Shots:" value="1024" />
              <div className="h-px bg-slate-50 w-full" />
              <ParamRow icon={<FileText size={14} className="text-rose-600" />} iconBg="bg-rose-100" label="Backend:" value="Simulator" />
            </div>
          </div>
          
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Chart Section */}
          <div className="lg:col-span-8 bg-white rounded-[20px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BarChart2 size={16} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900 leading-tight">Model Performance Overview</h3>
                  <p className="text-[12px] text-slate-500 font-medium">Classical ML vs Hybrid QML</p>
                </div>
              </div>
              <button className="text-[13px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-700">
                View Full Benchmark <ArrowRight size={14} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 mb-8 text-[11px] font-bold text-slate-500">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#1e3a8a]" /> Accuracy</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" /> Precision</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" /> Recall</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> F1-Score</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> ROC-AUC</div>
            </div>

            {/* Custom Bar Chart Graphic */}
            <div className="h-[240px] flex items-end justify-around px-8 pb-4 relative">
              {/* Y Axis */}
              <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between text-[10px] font-bold text-slate-400">
                <span>1.0</span><span>0.8</span><span>0.6</span><span>0.4</span><span>0.2</span><span>0.0</span>
              </div>
              
              <ChartGroup name="SVM" v1={60} v2={55} v3={58} v4={59} v5={62} />
              <ChartGroup name="Logistic Regression" v1={63} v2={61} v3={59} v4={60} v5={64} />
              <ChartGroup name="Random Forest" v1={72} v2={70} v3={68} v4={69} v5={75} />
              <ChartGroup name="Neural Network" v1={73} v2={71} v3={65} v4={68} v5={74} />
              <ChartGroup name="QSVM" v1={64} v2={63} v3={64} v4={63} v5={68} />
              <ChartGroup name="Quantum Kernel" v1={67} v2={66} v3={68} v4={67} v5={71} />
              <ChartGroup name="VQC" v1={68} v2={67} v3={66} v4={67} v5={72} />
              <ChartGroup name="QNN" v1={75} v2={74} v3={72} v4={73} v5={78} />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-4 bg-white rounded-[20px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Activity size={16} />
              </div>
              <h3 className="text-[16px] font-bold text-slate-900">Recent Activity</h3>
            </div>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-[2px] before:bg-slate-100">
              
              <ActivityItem 
                icon={<CheckCircle2 size={12} className="text-white" />} iconBg="bg-emerald-500"
                title="Experiment completed" subtitle="Breast Cancer" time="2 hours ago"
              />
              <ActivityItem 
                icon={<Database size={12} className="text-white" />} iconBg="bg-blue-500"
                title="Dataset updated" subtitle="Heart Disease Dataset" time="5 hours ago"
              />
              <ActivityItem 
                icon={<FlaskConical size={12} className="text-white" />} iconBg="bg-purple-500"
                title="Evaluation completed" subtitle="Neurological Study" time="Yesterday"
              />
              <ActivityItem 
                icon={<FileText size={12} className="text-white" />} iconBg="bg-rose-500"
                title="Research report generated" subtitle="Diabetes Benchmark" time="Yesterday"
              />

            </div>
          </div>

        </div>

      </div>
    </HospitalLayout>
  )
}

function StatCard({ title, value, icon, iconBg, subtext, gradient }: any) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative overflow-hidden flex items-center p-8">
      <div className={`absolute bottom-0 right-0 top-0 w-1/2 bg-gradient-to-l ${gradient} rounded-l-full blur-3xl opacity-60 pointer-events-none`} />
      
      <div className="flex-1 relative z-10 flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <div>
          <div className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wide mb-1">{title}</div>
          <div className="text-[32px] font-extrabold text-slate-900 leading-none">{value}</div>
          {subtext && <div className="text-[11px] font-semibold text-slate-500 mt-1">{subtext}</div>}
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center relative z-10">
        <ArrowRight size={14} className="text-slate-400" />
      </div>
    </div>
  )
}

function ExpRow({ name, status, time }: any) {
  const isCompleted = status === 'Completed'
  const isRunning = status === 'Running'
  
  return (
    <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
      <td className="py-4 font-bold text-slate-700">{name}</td>
      <td className="py-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
          isCompleted ? 'bg-emerald-50 text-emerald-600' :
          isRunning ? 'bg-blue-50 text-blue-600' :
          'bg-amber-50 text-amber-600'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            isCompleted ? 'bg-emerald-500' :
            isRunning ? 'bg-blue-500' :
            'bg-amber-500'
          }`} /> {status}
        </span>
      </td>
      <td className="py-4 text-[12px] font-semibold text-slate-400">{time}</td>
      <td className="py-4 text-right">
        <button className="text-slate-400 hover:text-slate-600 p-1"><MoreHorizontal size={16} /></button>
      </td>
    </tr>
  )
}

function ChartGroup({ name, v1, v2, v3, v4, v5 }: any) {
  return (
    <div className="flex flex-col items-center gap-3 relative z-10">
      <div className="flex items-end gap-1 h-full">
        <div className="w-[10px] bg-[#1e3a8a] rounded-t-[3px]" style={{ height: `${v1}%` }} />
        <div className="w-[10px] bg-[#06b6d4] rounded-t-[3px]" style={{ height: `${v2}%` }} />
        <div className="w-[10px] bg-[#8b5cf6] rounded-t-[3px]" style={{ height: `${v3}%` }} />
        <div className="w-[10px] bg-[#f59e0b] rounded-t-[3px]" style={{ height: `${v4}%` }} />
        <div className="w-[10px] bg-[#3b82f6] rounded-t-[3px]" style={{ height: `${v5}%` }} />
      </div>
      <div className="text-[10px] font-bold text-slate-500 max-w-[60px] text-center leading-tight">{name}</div>
    </div>
  )
}

function ParamRow({ icon, iconBg, label, value }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <span className="text-[13px] font-bold text-slate-700">{label}</span>
      </div>
      <span className="text-[14px] font-extrabold text-slate-900">{value}</span>
    </div>
  )
}

function ActivityItem({ icon, iconBg, title, subtitle, time }: any) {
  return (
    <div className="relative flex items-start gap-4">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 ${iconBg} mt-0.5 shadow-sm`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-0.5">
          <div className="text-[13px] font-bold text-slate-900 leading-snug">{title}</div>
          <div className="text-[11px] font-bold text-slate-400 whitespace-nowrap">{time}</div>
        </div>
        <div className="text-[12px] font-semibold text-slate-500 leading-snug">{subtitle}</div>
      </div>
    </div>
  )
}

function CheckCircle2(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function BarChart2(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}
