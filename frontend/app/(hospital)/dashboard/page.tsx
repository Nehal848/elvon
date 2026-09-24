"use client"

import React, { useEffect, useState } from "react"
import HospitalLayout from "@/components/hospital-layout"
import {
  Database, Settings, Activity, Box, Zap, BarChart2, Lightbulb, ChevronRight,
  CheckCircle2, AlertCircle, MoreHorizontal, ArrowRight, Cpu, Layers, Check,
  DownloadCloud, Sparkles, ShieldCheck, FileText, TrendingUp, Clock, User,
  Laptop, FlaskConical, Users, Brain, Cloud, Shield, Bell, AlertTriangle, Lock
} from "lucide-react"

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("qml_session") || localStorage.getItem("hospital_ai_session")
      if (raw) {
        setSession(JSON.parse(raw))
      }
    } catch {}
    setLoading(false)
  }, [])

  if (loading) return null

  if (session?.role === "hospital" || session?.role === "institution") {
    return <AdminDashboard session={session} />
  }

  if (session?.role === "doctor") {
    return <DoctorDashboard session={session} />
  }

  return <DataScientistDashboard />
}

function AdminDashboard({ session }: { session: any }) {
  const adminName = session?.full_name || "Administrator"

  return (
    <HospitalLayout title={`Good Morning, ${adminName}`} subtitle="Here's your hospital-wide ELVON system overview.">
      <div className="max-w-[1440px] space-y-6 pb-12">
        
        {/* TOP STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-[104px]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <User size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-slate-700">Doctors</span>
                <span className="text-[24px] font-extrabold text-slate-900 leading-none mt-1">24</span>
              </div>
            </div>
            <div className="mt-auto flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <div className="w-1 h-3 rounded-full bg-blue-600" /> Active doctors
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-[104px]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Laptop size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-slate-700">Data Scientists</span>
                <span className="text-[24px] font-extrabold text-slate-900 leading-none mt-1">6</span>
              </div>
            </div>
            <div className="mt-auto flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <div className="w-1 h-3 rounded-full bg-teal-500" /> Active users
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-[104px]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <FlaskConical size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-slate-700">Researchers</span>
                <span className="text-[24px] font-extrabold text-slate-900 leading-none mt-1">8</span>
              </div>
            </div>
            <div className="mt-auto flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <div className="w-1 h-3 rounded-full bg-purple-500" /> Active researchers
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-[104px]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-slate-700">Total Patients</span>
                <span className="text-[24px] font-extrabold text-slate-900 leading-none mt-1">1,248</span>
              </div>
            </div>
            <div className="mt-auto flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <div className="w-1 h-3 rounded-full bg-emerald-500" /> Registered patients
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-[104px]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Brain size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-slate-700">Active AI Models</span>
                <span className="text-[24px] font-extrabold text-slate-900 leading-none mt-1">12</span>
              </div>
            </div>
            <div className="mt-auto flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <div className="w-1 h-3 rounded-full bg-blue-600" /> Deployed models
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-[104px]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-slate-700">Total Analyses</span>
                <span className="text-[24px] font-extrabold text-slate-900 leading-none mt-1">3,482</span>
              </div>
            </div>
            <div className="mt-auto flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <div className="w-1 h-3 rounded-full bg-orange-500" /> Completed analyses
            </div>
          </div>
        </div>

        {/* SECOND ROW: SYSTEM HEALTH & USER ACTIVITY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* System Health */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Activity size={18} className="text-blue-500" /> System Health
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> System Operational
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center mb-3">
                  <Cloud size={24} className="text-teal-500" />
                </div>
                <span className="text-[12px] font-bold text-slate-700 mb-1">AI Services</span>
                <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center mb-3">
                  <Cpu size={24} className="text-teal-500" />
                </div>
                <span className="text-[12px] font-bold text-slate-700 mb-1">Model Services</span>
                <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center mb-3">
                  <Database size={24} className="text-teal-500" />
                </div>
                <span className="text-[12px] font-bold text-slate-700 mb-1">Data Storage</span>
                <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Secure</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center mb-3">
                  <ShieldCheck size={24} className="text-teal-500" />
                </div>
                <span className="text-[12px] font-bold text-slate-700 mb-1">System Security</span>
                <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Protected</span>
              </div>
            </div>
          </div>

          {/* User Activity */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <Users size={18} className="text-blue-500" /> User Activity
              </div>
              <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500 border border-slate-200 rounded-lg px-3 py-1">
                <Clock size={14} /> Last 7 days
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1 h-[140px] flex items-end justify-between border-l border-b border-slate-100 pb-2 px-2">
                {[60, 40, 50, 70, 80, 50, 30].map((h, i) => (
                  <div key={i} className="flex flex-col items-center justify-end gap-1 w-6 h-full">
                    <div className="w-full bg-blue-500 rounded-t-sm" style={{ height: `${h}%` }} />
                    <div className="w-full bg-teal-400 rounded-t-sm" style={{ height: `${h * 0.4}%` }} />
                    <div className="w-full bg-purple-500 rounded-t-sm" style={{ height: `${h * 0.2}%` }} />
                  </div>
                ))}
              </div>
              
              {/* Legend & Stats */}
              <div className="w-[140px] flex flex-col justify-between py-2">
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase"><span className="w-2 h-2 rounded-full bg-blue-500" /> Doctors</div>
                  <div className="text-[18px] font-extrabold text-slate-900 leading-none mt-1">124</div>
                  <div className="text-[10px] text-slate-400">analyses</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase"><span className="w-2 h-2 rounded-full bg-teal-400" /> Data Scientists</div>
                  <div className="text-[18px] font-extrabold text-slate-900 leading-none mt-1">18</div>
                  <div className="text-[10px] text-slate-400">model activities</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase"><span className="w-2 h-2 rounded-full bg-purple-500" /> Researchers</div>
                  <div className="text-[18px] font-extrabold text-slate-900 leading-none mt-1">32</div>
                  <div className="text-[10px] text-slate-400">research activities</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* THIRD ROW: MODEL OVERVIEW, PATIENT ANALYSIS, SYSTEM ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* AI Model Overview (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
              <Brain size={18} className="text-blue-500" /> AI Model Overview
            </div>
            
            {/* Model Stats */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              <div className="border border-slate-100 rounded-lg p-2 text-center">
                <div className="text-[18px] font-extrabold text-slate-900">12</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase">Total Models</div>
              </div>
              <div className="border border-slate-100 rounded-lg p-2 text-center">
                <div className="text-[18px] font-extrabold text-slate-900">7</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase">Classical ML</div>
              </div>
              <div className="border border-slate-100 rounded-lg p-2 text-center">
                <div className="text-[18px] font-extrabold text-slate-900">5</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase">Hybrid QML</div>
              </div>
              <div className="border border-slate-100 rounded-lg p-2 text-center bg-emerald-50/50">
                <div className="text-[18px] font-extrabold text-emerald-600">10</div>
                <div className="text-[9px] font-bold text-emerald-600 uppercase">Active</div>
              </div>
              <div className="border border-slate-100 rounded-lg p-2 text-center bg-orange-50/50">
                <div className="text-[18px] font-extrabold text-orange-600">2</div>
                <div className="text-[9px] font-bold text-orange-600 uppercase">Needs Review</div>
              </div>
            </div>

            <div className="text-[13px] font-bold text-slate-800 mb-3">Key Models</div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500"><Activity size={14} /></div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-800">Cardiovascular Disease</div>
                    <div className="text-[11px] font-semibold text-slate-500">Classical ML – <span className="text-emerald-500">Active</span> | Hybrid QML – <span className="text-emerald-500">Active</span></div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">Active</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500"><Activity size={14} /></div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-800">Diabetes</div>
                    <div className="text-[11px] font-semibold text-slate-500">Classical ML – <span className="text-emerald-500">Active</span> | Hybrid QML – <span className="text-emerald-500">Active</span></div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">Active</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500"><Brain size={14} /></div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-800">Brain Disease</div>
                    <div className="text-[11px] font-semibold text-slate-500">Classical ML – <span className="text-emerald-500">Active</span> | Hybrid QML – <span className="text-orange-500">Review Required</span></div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold">Review</span>
              </div>
            </div>
            <div className="pt-2 text-right">
              <a href="/models" className="text-[12px] font-bold text-blue-600 hover:underline">View Model Management →</a>
            </div>
          </div>

          {/* Patient Analysis Overview (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
              <FileText size={18} className="text-blue-500" /> Patient Analysis Overview
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-center mb-6 border-b border-slate-100 pb-4">
              <div>
                <div className="text-[10px] font-bold text-blue-600 uppercase">Total Analyses</div>
                <div className="text-[18px] font-extrabold text-blue-600">3,482</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-red-500 uppercase">Disease Detected</div>
                <div className="text-[18px] font-extrabold text-red-500">1,427</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-emerald-500 uppercase">No Disease</div>
                <div className="text-[18px] font-extrabold text-emerald-500">2,055</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-orange-500 uppercase">Pending</div>
                <div className="text-[18px] font-extrabold text-orange-500">18</div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="14" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f43f5e" strokeWidth="14" strokeDasharray="103 251.2" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="14" strokeDasharray="148 251.2" strokeDashoffset="-103" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[16px] font-extrabold text-slate-900">3,482</span>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase">Total Analyses</span>
                </div>
              </div>
              
              <div className="flex flex-col justify-center gap-3 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="text-[12px] font-bold text-slate-700">Disease Detected</div>
                  </div>
                  <div className="text-[12px] font-bold text-slate-500">1,427 (41%)</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <div className="text-[12px] font-bold text-slate-700">No Disease</div>
                  </div>
                  <div className="text-[12px] font-bold text-slate-500">2,055 (59%)</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <div className="text-[12px] font-bold text-slate-700">Pending</div>
                  </div>
                  <div className="text-[12px] font-bold text-slate-500">18 (1%)</div>
                </div>
              </div>
            </div>
          </div>

          {/* System Alerts (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6 flex flex-col h-full">
            <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
              <ShieldCheck size={18} className="text-blue-500" /> System Alerts
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center"><AlertTriangle size={14} /></div>
                  <div className="text-[13px] font-bold text-slate-700"><span className="text-red-500">2</span> permission requests pending</div>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500" />
              </div>
              <div className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center"><AlertTriangle size={14} /></div>
                  <div className="text-[13px] font-bold text-slate-700"><span className="text-orange-500">1</span> model requires review</div>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500" />
              </div>
              <div className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center"><Lock size={14} /></div>
                  <div className="text-[13px] font-bold text-slate-700"><span className="text-emerald-500">0</span> critical security alerts</div>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500" />
              </div>
              <div className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center"><BarChart2 size={14} /></div>
                  <div className="text-[13px] font-bold text-slate-700"><span className="text-purple-500">3</span> failed analysis processes</div>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500" />
              </div>
            </div>
            
            <div className="pt-2 text-right mt-auto">
              <a href="/notifications" className="text-[12px] font-bold text-blue-600 hover:underline">View All Alerts →</a>
            </div>
          </div>
        </div>

        {/* FOURTH ROW: RECENT ACTIVITY */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Clock size={18} className="text-blue-500" /> Recent Activity
            </div>
            <a href="/audit" className="text-[12px] font-bold text-blue-600 hover:underline">View All Activity →</a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100">
                  <th className="pb-3 px-4 w-12"></th>
                  <th className="pb-3 px-4">Time</th>
                  <th className="pb-3 px-4">User / Role</th>
                  <th className="pb-3 px-4">Action</th>
                  <th className="pb-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-[13px]">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 text-center"><div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 mx-auto flex items-center justify-center"><User size={14} /></div></td>
                  <td className="py-3 px-4 font-semibold text-slate-500">2 minutes ago</td>
                  <td className="py-3 px-4 font-bold text-slate-800">Dr. Ananya Sharma <span className="text-slate-400 font-semibold text-[11px]">(Doctor)</span></td>
                  <td className="py-3 px-4 font-semibold text-slate-700">analyzed a patient report</td>
                  <td className="py-3 px-4 text-slate-500">Patient report #PR-2026-458</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 text-center"><div className="w-8 h-8 rounded-full bg-teal-50 text-teal-500 mx-auto flex items-center justify-center"><Laptop size={14} /></div></td>
                  <td className="py-3 px-4 font-semibold text-slate-500">18 minutes ago</td>
                  <td className="py-3 px-4 font-bold text-slate-800">Data Scientist <span className="text-slate-400 font-semibold text-[11px]">(Data Scientist)</span></td>
                  <td className="py-3 px-4 font-semibold text-slate-700">updated Cardiovascular Disease Model v2</td>
                  <td className="py-3 px-4 text-slate-500">Model v2.0.1</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 text-center"><div className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 mx-auto flex items-center justify-center"><FlaskConical size={14} /></div></td>
                  <td className="py-3 px-4 font-semibold text-slate-500">42 minutes ago</td>
                  <td className="py-3 px-4 font-bold text-slate-800">Researcher <span className="text-slate-400 font-semibold text-[11px]">(Researcher)</span></td>
                  <td className="py-3 px-4 font-semibold text-slate-700">completed a model experiment</td>
                  <td className="py-3 px-4 text-slate-500">Experiment #EXP-318</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 text-center"><div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 mx-auto flex items-center justify-center"><User size={14} /></div></td>
                  <td className="py-3 px-4 font-semibold text-slate-500">1 hour ago</td>
                  <td className="py-3 px-4 font-bold text-slate-800">Dr. Rajesh Kumar <span className="text-slate-400 font-semibold text-[11px]">(Doctor)</span></td>
                  <td className="py-3 px-4 font-semibold text-slate-700">New doctor account created</td>
                  <td className="py-3 px-4 text-slate-500">Account: dr.rajesh@elvon.ai</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 text-center"><div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center"><Settings size={14} /></div></td>
                  <td className="py-3 px-4 font-semibold text-slate-500">2 hours ago</td>
                  <td className="py-3 px-4 font-bold text-slate-800">System <span className="text-slate-400 font-semibold text-[11px]">(System)</span></td>
                  <td className="py-3 px-4 font-semibold text-slate-700">New analysis report generated</td>
                  <td className="py-3 px-4 text-slate-500">Report #RPT-7842</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 text-center"><div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 mx-auto flex items-center justify-center"><ShieldCheck size={14} /></div></td>
                  <td className="py-3 px-4 font-semibold text-slate-500">3 hours ago</td>
                  <td className="py-3 px-4 font-bold text-slate-800">Administrator <span className="text-slate-400 font-semibold text-[11px]">(Administrator)</span></td>
                  <td className="py-3 px-4 font-semibold text-slate-700">updated user permissions</td>
                  <td className="py-3 px-4 text-slate-500">Role: Data Scientist</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </HospitalLayout>
  )
}

function DoctorDashboard({ session }: { session: any }) {
  const doctorName = session?.full_name || "Dr. Ananya Sharma"

  return (
    <HospitalLayout title={`Good Morning, ${doctorName}`} subtitle="Here's your clinical intelligence overview.">
      <div className="max-w-[1440px] space-y-6 pb-12">
        
        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50/30 border border-blue-100/50 rounded-[24px] p-8 flex items-center justify-between relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="absolute top-0 right-0 w-[500px] h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-24 h-24 relative shrink-0">
              <div className="absolute inset-0 bg-blue-100 rounded-2xl transform rotate-3" />
              <div className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center transform -rotate-3 overflow-hidden">
                <FileText size={40} className="text-blue-500/20 absolute -left-2 -top-2" />
                <Brain size={32} className="text-blue-600 relative z-10" />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                  <span className="text-[12px] font-bold">+</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-[22px] font-extrabold text-slate-900 mb-1">Analyze a New Patient Report</h2>
              <p className="text-[14px] text-slate-600 font-medium mb-4 max-w-md">Upload a patient's medical report to begin AI-powered disease analysis.</p>
              <a href="/analysis-report" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2.5 rounded-full text-[14px] font-bold shadow-md shadow-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/30 transition-all cursor-pointer">
                <Cloud size={16} /> Analyze Patient Report <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end relative z-10 mr-8">
            <div className="text-[16px] font-extrabold text-slate-800 tracking-tight text-right mb-1">Better Insights.<br/>Healthier Tomorrows.</div>
            <div className="flex items-center gap-1 text-emerald-500 mt-2">
              <Activity size={28} />
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <div className="text-[12px] font-bold text-slate-500 mb-1">Total Patients</div>
              <div className="text-[28px] font-extrabold text-slate-900 leading-none">24</div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-slate-400">
                <span className="text-emerald-500 flex items-center"><TrendingUp size={12} className="mr-0.5" /> 12%</span> vs. last 7 days
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Users size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <div className="text-[12px] font-bold text-slate-500 mb-1">Analyses Completed</div>
              <div className="text-[28px] font-extrabold text-slate-900 leading-none">18</div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-slate-400">
                <span className="text-emerald-500 flex items-center"><TrendingUp size={12} className="mr-0.5" /> 20%</span> vs. last 7 days
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <div className="text-[12px] font-bold text-slate-500 mb-1">Reports Generated</div>
              <div className="text-[28px] font-extrabold text-slate-900 leading-none">15</div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-slate-400">
                <span className="text-emerald-500 flex items-center"><TrendingUp size={12} className="mr-0.5" /> 15%</span> vs. last 7 days
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
              <FileText size={20} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <div className="text-[12px] font-bold text-slate-500 mb-1">Pending Analyses</div>
              <div className="text-[28px] font-extrabold text-slate-900 leading-none">03</div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-slate-400">
                <span className="text-orange-500 flex items-center"><TrendingUp size={12} className="mr-0.5" /> 50%</span> vs. last 7 days
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
              <Clock size={20} />
            </div>
          </div>
        </div>

        {/* TABLES ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Patients */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900">Recent Patients</h3>
                  <p className="text-[12px] text-slate-500 font-medium">Latest patients added to the system</p>
                </div>
              </div>
              <a href="/patients" className="text-[12px] font-bold text-blue-600 flex items-center gap-1 hover:underline">View All Patients <ArrowRight size={14} /></a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold bg-slate-50/50">
                    <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Patient ID</th>
                    <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Patient Name</th>
                    <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Age / Gender</th>
                    <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Last Analysis</th>
                    <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Latest Result</th>
                    <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                  <tr className="hover:bg-slate-50/50 cursor-pointer transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-500">
                      <div className="flex items-center gap-2">
                        <img src="https://i.pravatar.cc/150?img=11" className="w-6 h-6 rounded-full" alt="" />
                        P-1024
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">Rahul Sharma</td>
                    <td className="py-3 px-4 text-slate-500">45 / M</td>
                    <td className="py-3 px-4 text-slate-500">Today</td>
                    <td className="py-3 px-4 font-bold text-red-500 bg-red-50/50 rounded-lg px-2 text-center w-fit">Disease Detected</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-red-500 font-bold text-[11px]"><span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Attention</span>
                        <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 cursor-pointer transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-500">
                      <div className="flex items-center gap-2">
                        <img src="https://i.pravatar.cc/150?img=5" className="w-6 h-6 rounded-full" alt="" />
                        P-1023
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">Priya Verma</td>
                    <td className="py-3 px-4 text-slate-500">32 / F</td>
                    <td className="py-3 px-4 text-slate-500">Yesterday</td>
                    <td className="py-3 px-4 font-bold text-emerald-500 bg-emerald-50/50 rounded-lg px-2 text-center w-fit">No Disease</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-emerald-500 font-bold text-[11px]"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Clear</span>
                        <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 cursor-pointer transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-500">
                      <div className="flex items-center gap-2">
                        <img src="https://i.pravatar.cc/150?img=12" className="w-6 h-6 rounded-full" alt="" />
                        P-1022
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">Amit Patel</td>
                    <td className="py-3 px-4 text-slate-500">58 / M</td>
                    <td className="py-3 px-4 text-slate-500">2 days ago</td>
                    <td className="py-3 px-4 font-bold text-red-500 bg-red-50/50 rounded-lg px-2 text-center w-fit">Disease Detected</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-red-500 font-bold text-[11px]"><span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Attention</span>
                        <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 cursor-pointer transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-500">
                      <div className="flex items-center gap-2">
                        <img src="https://i.pravatar.cc/150?img=9" className="w-6 h-6 rounded-full" alt="" />
                        P-1021
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">Neha Singh</td>
                    <td className="py-3 px-4 text-slate-500">41 / F</td>
                    <td className="py-3 px-4 text-slate-500">3 days ago</td>
                    <td className="py-3 px-4 font-bold text-emerald-500 bg-emerald-50/50 rounded-lg px-2 text-center w-fit">No Disease</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-emerald-500 font-bold text-[11px]"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Clear</span>
                        <ChevronRight size={14} className="text-slate-300" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col h-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900">Recent Reports</h3>
                  <p className="text-[12px] text-slate-500 font-medium">Latest generated patient reports</p>
                </div>
              </div>
              <a href="/reports" className="text-[12px] font-bold text-blue-600 flex items-center gap-1 hover:underline">View All Reports <ArrowRight size={14} /></a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold bg-slate-50/50">
                    <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Patient Name</th>
                    <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Report Type</th>
                    <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider">Prediction</th>
                    <th className="py-3 px-4 font-semibold text-[11px] uppercase tracking-wider text-center">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                  <tr className="hover:bg-slate-50/50 cursor-pointer transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                      <img src="https://i.pravatar.cc/150?img=11" className="w-6 h-6 rounded-full" alt="" />
                      Rahul Sharma
                    </td>
                    <td className="py-3 px-4 text-slate-500">Disease Analysis Report</td>
                    <td className="py-3 px-4 text-slate-500">Today</td>
                    <td className="py-3 px-4"><span className="text-red-500 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5 text-[11px] font-bold">Disease Detected</span></td>
                    <td className="py-3 px-4 text-center text-blue-500"><a href="/reports" className="w-7 h-7 rounded-full bg-blue-50 inline-flex items-center justify-center hover:bg-blue-100 transition-colors"><FileText size={14} /></a></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 cursor-pointer transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                      <img src="https://i.pravatar.cc/150?img=5" className="w-6 h-6 rounded-full" alt="" />
                      Priya Verma
                    </td>
                    <td className="py-3 px-4 text-slate-500">Disease Analysis Report</td>
                    <td className="py-3 px-4 text-slate-500">Yesterday</td>
                    <td className="py-3 px-4"><span className="text-emerald-500 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 text-[11px] font-bold">No Disease</span></td>
                    <td className="py-3 px-4 text-center text-blue-500"><a href="/reports" className="w-7 h-7 rounded-full bg-blue-50 inline-flex items-center justify-center hover:bg-blue-100 transition-colors"><FileText size={14} /></a></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 cursor-pointer transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                      <img src="https://i.pravatar.cc/150?img=12" className="w-6 h-6 rounded-full" alt="" />
                      Amit Patel
                    </td>
                    <td className="py-3 px-4 text-slate-500">Disease Analysis Report</td>
                    <td className="py-3 px-4 text-slate-500">14 Sep</td>
                    <td className="py-3 px-4"><span className="text-red-500 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5 text-[11px] font-bold">Disease Detected</span></td>
                    <td className="py-3 px-4 text-center text-blue-500"><a href="/reports" className="w-7 h-7 rounded-full bg-blue-50 inline-flex items-center justify-center hover:bg-blue-100 transition-colors"><FileText size={14} /></a></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 cursor-pointer transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                      <img src="https://i.pravatar.cc/150?img=9" className="w-6 h-6 rounded-full" alt="" />
                      Neha Singh
                    </td>
                    <td className="py-3 px-4 text-slate-500">Disease Analysis Report</td>
                    <td className="py-3 px-4 text-slate-500">13 Sep</td>
                    <td className="py-3 px-4"><span className="text-emerald-500 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 text-[11px] font-bold">No Disease</span></td>
                    <td className="py-3 px-4 text-center text-blue-500"><a href="/reports" className="w-7 h-7 rounded-full bg-blue-50 inline-flex items-center justify-center hover:bg-blue-100 transition-colors"><FileText size={14} /></a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available AI Models */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Brain size={18} />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900">Available AI Models</h3>
                  <p className="text-[12px] text-slate-500 font-medium">Deployed and available for clinical analysis</p>
                </div>
              </div>
              <a href="/models" className="text-[12px] font-bold text-blue-600 flex items-center gap-1 hover:underline">View All Models <ArrowRight size={14} /></a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center text-center hover:border-blue-200 transition-colors cursor-pointer bg-slate-50/50">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                  <Activity size={24} />
                </div>
                <div className="text-[13px] font-bold text-slate-800 leading-tight mb-3 h-8">Cardiovascular<br/>Disease Detection</div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Active</div>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center text-center hover:border-blue-200 transition-colors cursor-pointer bg-slate-50/50">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
                  <span className="text-[24px] font-bold mt-1">🩸</span>
                </div>
                <div className="text-[13px] font-bold text-slate-800 leading-tight mb-3 h-8">Diabetes<br/>Detection</div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Active</div>
              </div>

              <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center text-center hover:border-blue-200 transition-colors cursor-pointer bg-slate-50/50">
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center mb-3">
                  <Brain size={24} />
                </div>
                <div className="text-[13px] font-bold text-slate-800 leading-tight mb-3 h-8">Brain Disease<br/>Detection</div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Active</div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">System Status</h3>
                <p className="text-[12px] text-slate-500 font-medium">All systems are operational</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500" /> AI Services
                </div>
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-500"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Connected</div>
              </div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Model Services
                </div>
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-500"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Active</div>
              </div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-600">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Secure Data Connection
                </div>
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-500"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Protected</div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span>ELVON • AI-assisted clinical intelligence</span>
              <span className="flex items-center gap-1">Secure • Explainable • Reliable</span>
            </div>
          </div>
        </div>

      </div>
    </HospitalLayout>
  )
}

function DataScientistDashboard() {
  return (
    <HospitalLayout title="Data Scientist Dashboard" subtitle="Build, train and evaluate models for better healthcare outcomes.">
      <div className="max-w-[1440px] space-y-6 pb-12">
        
        {/* ── ROW 1: 6-Metric Pipeline Cards Strip ────────────────────────────── */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {/* Card 1: Uploaded Datasets */}
          <div className="min-w-[200px] flex-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Database size={16} />
              </div>
              <span className="text-[12px] font-bold text-slate-700">Uploaded Datasets</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[24px] font-extrabold text-slate-900">12</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">+2 this week</span>
            </div>
          </div>
          
          <ChevronRight size={20} className="text-slate-300 flex-shrink-0" />

          {/* Card 2: Processing */}
          <div className="min-w-[200px] flex-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-bl-full" />
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Settings size={16} />
              </div>
              <span className="text-[12px] font-bold text-slate-700">Processing</span>
            </div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-baseline gap-1">
                <span className="text-[24px] font-extrabold text-slate-900">3</span>
                <span className="text-[14px] text-slate-400 font-semibold">/ 12</span>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center">
                <span className="text-[10px] font-bold text-blue-600">25%</span>
              </div>
            </div>
          </div>

          <ChevronRight size={20} className="text-slate-300 flex-shrink-0" />

          {/* Card 3: Validation */}
          <div className="min-w-[200px] flex-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
              <span className="text-[12px] font-bold text-slate-700">Validation</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-[24px] font-extrabold text-slate-900">2</span>
                <span className="text-[14px] text-slate-400 font-semibold">/ 12</span>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center">
                <span className="text-[10px] font-bold text-purple-600">17%</span>
              </div>
            </div>
          </div>

          <ChevronRight size={20} className="text-slate-300 flex-shrink-0" />

          {/* Card 4: Training */}
          <div className="min-w-[200px] flex-1 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-4 border border-blue-600 shadow-md shadow-cyan-500/20 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center">
                <Zap size={16} />
              </div>
              <span className="text-[12px] font-bold text-white/90">Training</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-[24px] font-extrabold">2</span>
                <span className="text-[11px] font-semibold bg-white/20 px-1.5 py-0.5 rounded-md">Active</span>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">17%</span>
              </div>
            </div>
          </div>

          <ChevronRight size={20} className="text-slate-300 flex-shrink-0" />

          {/* Card 5: Evaluation */}
          <div className="min-w-[200px] flex-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <BarChart2 size={16} />
              </div>
              <span className="text-[12px] font-bold text-slate-700">Evaluation</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-[24px] font-extrabold text-slate-900">1</span>
                <span className="text-[11px] font-semibold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-md">Completed</span>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center">
                <span className="text-[10px] font-bold text-teal-600">8%</span>
              </div>
            </div>
          </div>

          <ChevronRight size={20} className="text-slate-300 flex-shrink-0" />

          {/* Card 6: Explainability */}
          <div className="min-w-[200px] flex-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <Lightbulb size={16} />
              </div>
              <span className="text-[12px] font-bold text-slate-700">Explainability</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-[24px] font-extrabold text-slate-900">1</span>
                <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-md">Available</span>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-slate-100 flex items-center justify-center">
                <span className="text-[10px] font-bold text-orange-600">8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Workflow Status & Summary ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Workflow Tracker (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-[22px] p-6 border border-slate-200 shadow-sm flex flex-col justify-center min-h-[180px]">
            <h2 className="text-[15px] font-bold text-slate-900 mb-6">Current Pipeline Status</h2>
            <div className="flex justify-between relative">
              <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-slate-100 -z-10 -translate-y-1/2" />
              <div className="absolute top-1/2 left-4 w-3/5 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400 -z-10 -translate-y-1/2" />
              
              {[
                { step: "01", label: "Dataset Overview", status: "completed" },
                { step: "02", label: "Data Preprocessing", status: "completed" },
                { step: "03", label: "Data Validation", status: "completed" },
                { step: "04", label: "Model Training", status: "active" },
                { step: "05", label: "Evaluation", status: "pending" },
                { step: "06", label: "Explainability", status: "pending" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[12px] border-2 ${
                    item.status === 'completed' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                    item.status === 'active' ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/30' :
                    'bg-white text-slate-400 border-slate-200'
                  }`}>
                    {item.status === 'completed' ? <Check size={16} /> : item.step}
                  </div>
                  <span className={`text-[11px] font-bold ${
                    item.status === 'completed' ? 'text-slate-700' :
                    item.status === 'active' ? 'text-cyan-600' : 'text-slate-400'
                  }`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dataset & Model Summary (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900 rounded-[22px] p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10" />
            <h2 className="text-[14px] font-bold text-white/90 mb-4 flex items-center gap-2">
              <Database size={16} className="text-cyan-400" />
              Dataset & Model Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                <span className="text-[12px] text-slate-400 font-medium">Dataset</span>
                <span className="text-[12.5px] font-bold text-white">heart_disease_clinical.csv</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                <span className="text-[12px] text-slate-400 font-medium">Records</span>
                <span className="text-[12.5px] font-bold text-white">5,230 samples</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                <span className="text-[12px] text-slate-400 font-medium">Features</span>
                <span className="text-[12.5px] font-bold text-white">13 features</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                <span className="text-[12px] text-slate-400 font-medium">Current Model</span>
                <span className="text-[12px] font-bold bg-cyan-900/50 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">Hybrid QML</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[12px] text-slate-400 font-medium">Status</span>
                <span className="text-[12px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Training Running
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 3: Performance, Quantum Resource, Recent Experiments ────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left: Model Performance Chart (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-[22px] p-6 border border-slate-200 shadow-sm">
            <h3 className="text-[15px] font-bold text-slate-900 mb-6">Model Performance — Classical vs Hybrid QML</h3>
            
            {/* Dummy grouped bar chart representation */}
            <div className="flex items-end justify-between h-[180px] pb-6 border-b border-slate-100">
              {/* Group 1: Accuracy */}
              <div className="flex flex-col items-center gap-2 group relative">
                <div className="flex items-end gap-1.5 h-[140px]">
                  <div className="w-8 bg-slate-200 rounded-t-md relative group-hover:bg-slate-300 transition-colors" style={{ height: '82%' }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded">82%</div>
                  </div>
                  <div className="w-8 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md relative hover:opacity-90 transition-opacity" style={{ height: '94%' }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-cyan-600 text-white text-[10px] py-1 px-2 rounded">94%</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-500">Accuracy</span>
              </div>
              
              {/* Group 2: Precision */}
              <div className="flex flex-col items-center gap-2 group relative">
                <div className="flex items-end gap-1.5 h-[140px]">
                  <div className="w-8 bg-slate-200 rounded-t-md" style={{ height: '78%' }}></div>
                  <div className="w-8 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md" style={{ height: '91%' }}></div>
                </div>
                <span className="text-[11px] font-bold text-slate-500">Precision</span>
              </div>

              {/* Group 3: Recall */}
              <div className="flex flex-col items-center gap-2 group relative">
                <div className="flex items-end gap-1.5 h-[140px]">
                  <div className="w-8 bg-slate-200 rounded-t-md" style={{ height: '84%' }}></div>
                  <div className="w-8 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md" style={{ height: '95%' }}></div>
                </div>
                <span className="text-[11px] font-bold text-slate-500">Recall</span>
              </div>

              {/* Group 4: F1-Score */}
              <div className="flex flex-col items-center gap-2 group relative">
                <div className="flex items-end gap-1.5 h-[140px]">
                  <div className="w-8 bg-slate-200 rounded-t-md" style={{ height: '80%' }}></div>
                  <div className="w-8 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md" style={{ height: '93%' }}></div>
                </div>
                <span className="text-[11px] font-bold text-slate-500">F1-Score</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-slate-200" />
                <span className="text-[11.5px] font-semibold text-slate-500">Classical ML</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-cyan-500" />
                <span className="text-[11.5px] font-semibold text-slate-500">Hybrid QML</span>
              </div>
            </div>
          </div>

          {/* Center: Quantum Resource Usage (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-[22px] p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="text-[15px] font-bold text-slate-900 mb-6 w-full">Quantum Resource Usage</h3>
            
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="52" fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
                <circle
                  cx="70" cy="70" r="52" fill="transparent" stroke="#0ea5e9" strokeWidth="16"
                  strokeDasharray="222 326.7" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[28px] font-extrabold text-slate-900">68%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">QPU Usage</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Qubits Used</span>
                <span className="text-[16px] font-bold text-slate-900">12 <span className="text-[12px] text-slate-400">/ 20</span></span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Total Shots</span>
                <span className="text-[16px] font-bold text-slate-900">8,192</span>
              </div>
            </div>
          </div>

          {/* Right: Recent Experiments (3 cols) */}
          <div className="md:col-span-3 bg-white rounded-[22px] p-6 border border-slate-200 shadow-sm">
            <h3 className="text-[15px] font-bold text-slate-900 mb-4">Recent Experiments</h3>
            <div className="space-y-4">
              {[
                { name: "Exp-QML-Cardio", status: "Running", time: "10m ago", color: "bg-blue-50 text-blue-600 border-blue-200" },
                { name: "Exp-CNN-Tumor", status: "Completed", time: "1h ago", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
                { name: "Exp-QSVM-Diab", status: "Completed", time: "3h ago", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
                { name: "Exp-RF-Baseline", status: "Queued", time: "4h ago", color: "bg-slate-100 text-slate-500 border-slate-200" },
                { name: "Exp-VQC-Neuro", status: "Failed", time: "1d ago", color: "bg-rose-50 text-rose-600 border-rose-200" },
              ].map((exp, i) => (
                <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-800">{exp.name}</h4>
                    <span className="text-[10.5px] text-slate-400">{exp.time}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${exp.color}`}>
                    {exp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ROW 4: Model Benchmarking ───────────────────────────────────────── */}
        <div className="bg-white rounded-[22px] p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[16px] font-bold text-slate-900">Model Benchmarking</h3>
              <p className="text-[12px] text-slate-500 font-medium">Comparison of trained models on Heart Disease UCI dataset.</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <DownloadCloud size={14} />
              Export Report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold bg-slate-50/50">
                  <th className="py-3 px-4 rounded-tl-xl">Model Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">F1-Score</th>
                  <th className="py-3 px-4">Training Time</th>
                  <th className="py-3 px-4 rounded-tr-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr className="hover:bg-slate-50 transition-colors bg-blue-50/30">
                  <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                    QuantumBoost QSVM
                    <span className="bg-cyan-500 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Recommended</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-blue-600">Hybrid QML</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">94.2%</span>
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full"><div className="w-[94%] h-full bg-emerald-500 rounded-full" /></div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold">0.93</td>
                  <td className="py-3 px-4 font-medium text-slate-500">12.4 min</td>
                  <td className="py-3 px-4"><span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">Elite</span></td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800">Random Forest</td>
                  <td className="py-3 px-4 font-medium text-slate-500">Classical ML</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">82.5%</span>
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full"><div className="w-[82%] h-full bg-blue-500 rounded-full" /></div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold">0.80</td>
                  <td className="py-3 px-4 font-medium text-slate-500">0.8 min</td>
                  <td className="py-3 px-4"><span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">Good</span></td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800">Logistic Regression</td>
                  <td className="py-3 px-4 font-medium text-slate-500">Classical ML</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">79.1%</span>
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full"><div className="w-[79%] h-full bg-blue-500 rounded-full" /></div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold">0.77</td>
                  <td className="py-3 px-4 font-medium text-slate-500">0.1 min</td>
                  <td className="py-3 px-4"><span className="text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">Stable</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </HospitalLayout>
  )
}
