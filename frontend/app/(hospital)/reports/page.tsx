"use client"

import React, { useState } from "react"
import HospitalLayout from "@/components/hospital-layout"
import { 
  FileText, Activity, CheckCircle2, Clock, Search, Calendar, 
  ChevronLeft, ChevronRight, X, Download, Printer, Info, Hexagon,
  HeartPulse, BrainCircuit, Droplet, ArrowRight
} from "lucide-react"

export default function ReportsPage() {
  const [activeFilter, setActiveFilter] = useState("All")
  const [selectedReport, setSelectedReport] = useState<string | null>("P-1024")

  const filters = ["All", "Disease Detected", "No Disease", "Recent"]

  return (
    <HospitalLayout 
      title="Reports" 
      subtitle="View and manage completed patient analysis reports."
    >
      <div className="max-w-[1500px] pb-12 flex gap-6 items-start relative">
        
        {/* Main Content Area */}
        <div className={`flex-1 space-y-6 transition-all duration-300`}>
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard icon={<FileText className="text-blue-500" />} iconBg="bg-blue-50" label="Total Reports" value="15" />
            <StatCard icon={<Activity className="text-red-500" />} iconBg="bg-red-50" label="Disease Detected" value="7" />
            <StatCard icon={<CheckCircle2 className="text-emerald-500" />} iconBg="bg-emerald-50" label="No Disease" value="8" />
            <StatCard icon={<Clock className="text-blue-500" />} iconBg="bg-blue-50" label="Recent Reports" value="4" />
          </div>

          {/* Filters Row */}
          <div className="bg-white rounded-[20px] p-4 flex flex-col md:flex-row items-center justify-between border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] gap-4">
            
            <div className="relative w-full md:w-[300px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient or report..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-100 text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400 font-medium text-slate-700 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
                    activeFilter === filter 
                      ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" 
                      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-full text-[13px] font-bold hover:bg-slate-50 transition-colors">
              <Calendar size={16} className="text-slate-400" />
              Date Range
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-[16px] font-bold text-slate-900">Analysis Reports</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Patient ID</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Analysis Date</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Disease</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Result</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Confidence</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Model</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  <ReportRow 
                    id="P-1024" name="Rahul Sharma" img="https://i.pravatar.cc/150?img=11"
                    date="16 Sep 2026" disease="Cardiovascular Disease" result="Disease Detected"
                    confidence="87%" model="Hybrid QML" 
                    isActive={selectedReport === "P-1024"}
                    onClick={() => setSelectedReport("P-1024")}
                  />
                  <ReportRow 
                    id="P-1023" name="Priya Verma" img="https://i.pravatar.cc/150?img=5"
                    date="15 Sep 2026" disease="Diabetes" result="No Disease"
                    confidence="92%" model="Classical ML"
                    isActive={selectedReport === "P-1023"}
                    onClick={() => setSelectedReport("P-1023")}
                  />
                  <ReportRow 
                    id="P-1022" name="Amit Patel" img="https://i.pravatar.cc/150?img=12"
                    date="14 Sep 2026" disease="Cardiovascular Disease" result="Disease Detected"
                    confidence="84%" model="Hybrid QML"
                    isActive={selectedReport === "P-1022"}
                    onClick={() => setSelectedReport("P-1022")}
                  />
                  <ReportRow 
                    id="P-1021" name="Neha Singh" img="https://i.pravatar.cc/150?img=9"
                    date="13 Sep 2026" disease="Diabetes" result="No Disease"
                    confidence="91%" model="Classical ML"
                    isActive={selectedReport === "P-1021"}
                    onClick={() => setSelectedReport("P-1021")}
                  />
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-[13px] font-semibold text-slate-500 pl-2">Showing 1-4 of 15 reports</span>
              <div className="flex items-center gap-1.5">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 text-white font-bold text-[13px] shadow-sm shadow-blue-500/20">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 font-bold text-[13px] hover:bg-slate-200 transition-colors">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 font-bold text-[13px] hover:bg-slate-200 transition-colors">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 font-bold text-[13px] hover:bg-slate-200 transition-colors">4</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-[24px] p-12 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] relative overflow-hidden flex flex-col items-center justify-center text-center mt-6">
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
              backgroundImage: "radial-gradient(ellipse at bottom, rgba(59, 130, 246, 0.15) 0%, transparent 70%)"
            }} />
            <div className="absolute left-0 right-0 bottom-0 h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQwIDMyMCI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LCAxMzAsIDI0NiwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMCAyMjRMMTQ0MCAxNjBMMTQ0MCAzMjBMMCAzMjBaIi8+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU5LCAxMzAsIDI0NiwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTAgMTkyTDE0NDAgMjI0TDE0NDAgMzIwTDAgMzIwWiIvPjwvc3ZnPg==')] bg-cover bg-bottom opacity-50" />
            
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 relative z-10">
              <FileText size={28} className="text-blue-500" />
            </div>
            <h3 className="text-[18px] font-bold text-slate-900 mb-2 relative z-10">No analysis reports yet</h3>
            <p className="text-[14px] text-slate-500 font-medium relative z-10 mb-6">Completed patient analyses will appear here.</p>
            <button className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white px-6 py-2.5 rounded-full text-[14px] font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 relative z-10 transition-all">
              <Activity size={16} /> Analyze Patient Report
            </button>
          </div>

        </div>

        {/* Right Side Panel - Details */}
        {selectedReport && (
          <div className="w-[420px] flex-shrink-0 bg-white rounded-[24px] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[calc(100vh-140px)] sticky top-6">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center text-white" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
                  <Hexagon size={20} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[#1e3a8a] leading-tight">ELVON</h3>
                  <div className="text-[10px] text-slate-500 font-semibold mb-1">Clinical Intelligence</div>
                  <h4 className="text-[15px] font-extrabold text-slate-900 leading-none tracking-tight">Patient Disease Analysis Report</h4>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 p-1 bg-white rounded-md border border-slate-200"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Scrollable Details */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Patient Info */}
              <div>
                <div className="flex items-center gap-2 text-[14px] font-bold text-[#1e3a8a] mb-4">
                  <span className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center"><Info size={14} className="text-blue-600"/></span> Patient Information
                </div>
                <div className="flex items-center justify-between p-4 rounded-[16px] bg-[#f8fafc] border border-slate-100">
                  <div className="flex items-center gap-4">
                    <img src="https://i.pravatar.cc/150?img=11" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="Patient" />
                    <div>
                      <div className="text-[15px] font-bold text-slate-900">Rahul Sharma</div>
                      <div className="text-[12px] text-slate-500 font-medium">Patient ID: P-1024</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-right">
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase">Age</div>
                      <div className="text-[13px] font-bold text-slate-700">45</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase">Gender</div>
                      <div className="text-[13px] font-bold text-slate-700">Male</div>
                    </div>
                    <div className="col-span-2 mt-1">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase">Analysis Date</div>
                      <div className="text-[13px] font-bold text-slate-700">16 September 2026</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prediction Result */}
              <div>
                <div className="flex items-center gap-2 text-[14px] font-bold text-red-600 mb-4">
                  <span className="w-6 h-6 rounded-md bg-red-50 flex items-center justify-center"><Activity size={14} className="text-red-500"/></span> Prediction Result
                </div>
                <div className="p-5 rounded-[16px] bg-red-50 border border-red-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-[10px]">!</span>
                    </div>
                    <span className="text-[16px] font-extrabold text-red-600">Disease Detected</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full border-[3px] border-emerald-100 border-t-emerald-500 flex items-center justify-center">
                      <span className="text-[14px] font-extrabold text-slate-900">87<span className="text-[10px]">%</span></span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 flex justify-between items-center text-[13px]">
                  <span className="font-semibold text-slate-500">Disease</span>
                  <span className="font-bold text-slate-900">Cardiovascular Disease</span>
                </div>
              </div>

              {/* Model Info */}
              <div>
                <div className="flex items-center gap-2 text-[14px] font-bold text-indigo-600 mb-4">
                  <span className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center"><BrainCircuit size={14} className="text-indigo-500"/></span> Model Information
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Model Used</div>
                    <div className="text-[14px] font-bold text-slate-900">Hybrid QML</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">Model Type</div>
                    <div className="text-[14px] font-bold text-slate-900">Pre-trained Hybrid QML</div>
                  </div>
                </div>
                
                <div className="border border-slate-100 rounded-[12px] overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-100">
                    <span className="text-[12px] font-bold text-slate-600">Model Comparison</span>
                  </div>
                  <div className="flex divide-x divide-slate-100">
                    <div className="flex-1 p-3">
                      <div className="text-[11px] font-semibold text-slate-500 mb-2">Classical ML Result</div>
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-red-500">
                        <span className="w-2 h-2 rounded-full border-2 border-red-500"></span> Disease Detected
                      </div>
                    </div>
                    <div className="flex-1 p-3 bg-[#f8fafc]">
                      <div className="text-[11px] font-semibold text-slate-500 mb-2">Hybrid QML Result</div>
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-red-500">
                        <span className="w-2 h-2 rounded-full border-2 border-red-500"></span> Disease Detected
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Explainability */}
              <div>
                <div className="flex items-center gap-2 text-[14px] font-bold text-blue-600 mb-4">
                  <span className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center"><FileText size={14} className="text-blue-500"/></span> Why this prediction?
                </div>
                <div className="space-y-3 px-2">
                  <FeatureBar label="Age" val={32} />
                  <FeatureBar label="Blood Pressure" val={26} color="bg-cyan-400" />
                  <FeatureBar label="Cholesterol" val={22} color="bg-teal-400" />
                  <FeatureBar label="BMI" val={15} color="bg-blue-300" />
                  <FeatureBar label="Other Factors" val={5} color="bg-indigo-300" />
                </div>
              </div>
              
              {/* Summary */}
              <div>
                <div className="flex items-center gap-2 text-[14px] font-bold text-blue-600 mb-4">
                  <span className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center"><FileText size={14} className="text-blue-500"/></span> Analysis Summary
                </div>
                <div className="bg-slate-50 rounded-[16px] p-5 grid grid-cols-2 gap-y-4 gap-x-4">
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold mb-1">Disease Analyzed</div>
                    <div className="text-[13px] font-bold text-slate-700">Cardiovascular Disease</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold mb-1">Model Used</div>
                    <div className="text-[13px] font-bold text-slate-700">Hybrid QML</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold mb-1">Prediction</div>
                    <div className="text-[13px] font-bold text-slate-700">Disease Detected</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold mb-1">Analysis Date</div>
                    <div className="text-[13px] font-bold text-slate-700">16 September 2026</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold mb-1">Confidence</div>
                    <div className="text-[14px] font-extrabold text-slate-900">87%</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-semibold mb-1">Processing Status</div>
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-500">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Completed
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl py-3 text-[14px] font-bold shadow-md shadow-blue-500/20 hover:from-blue-600 hover:to-cyan-500 transition-colors cursor-pointer"
              >
                <Download size={16} /> Download PDF
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 rounded-xl py-3 text-[14px] font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Printer size={16} /> Print Report
              </button>
            </div>
          </div>
        )}

      </div>
    </HospitalLayout>
  )
}

function StatCard({ icon, iconBg, label, value }: any) {
  return (
    <div className="bg-white rounded-[20px] p-5 flex items-center gap-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <div>
        <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">{label}</div>
        <div className="text-[24px] font-extrabold text-slate-900 leading-none">{value}</div>
      </div>
    </div>
  )
}

function ReportRow({ id, name, img, date, disease, result, confidence, model, isActive, onClick }: any) {
  const isDetected = result === "Disease Detected"
  return (
    <tr 
      onClick={onClick}
      className={`border-b border-slate-50 cursor-pointer transition-colors ${isActive ? 'bg-blue-50/50' : 'hover:bg-slate-50/50'}`}
    >
      <td className="py-3 px-6">
        <div className="flex items-center gap-3">
          <img src={img} className="w-8 h-8 rounded-full border border-slate-200" alt="" />
          <span className="font-bold text-slate-800">{name}</span>
        </div>
      </td>
      <td className="py-3 px-6 font-semibold text-slate-500">{id}</td>
      <td className="py-3 px-6 font-semibold text-slate-500">{date}</td>
      <td className="py-3 px-6 font-semibold text-slate-700">{disease}</td>
      <td className="py-3 px-6">
        <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold ${isDetected ? 'text-red-500' : 'text-emerald-500'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isDetected ? 'bg-red-500' : 'bg-emerald-500'}`} /> {result}
        </span>
      </td>
      <td className="py-3 px-6 font-bold text-slate-800">{confidence}</td>
      <td className="py-3 px-6 font-semibold text-slate-600">{model}</td>
      <td className="py-3 px-6 text-right">
        <div className="flex flex-col gap-1 items-end">
          <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="px-3 py-1 text-[11px] font-bold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors w-20 text-center cursor-pointer">View</button>
          <button onClick={(e) => { e.stopPropagation(); window.print(); }} className="px-3 py-1 text-[11px] font-bold text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors w-20 text-center cursor-pointer">Download</button>
        </div>
      </td>
    </tr>
  )
}

function FeatureBar({ label, val, color="bg-blue-500" }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-[12px] font-semibold text-slate-600 truncate">{label}</div>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${val}%` }} />
      </div>
      <div className="w-8 text-right text-[12px] font-bold text-slate-500">{val}%</div>
    </div>
  )
}
