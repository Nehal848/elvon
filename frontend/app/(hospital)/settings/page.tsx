"use client"

import React, { useState, useEffect } from "react"
import HospitalLayout from "@/components/hospital-layout"
import {
  Settings, User, Cpu, ShieldCheck, Key, Save, CheckCircle2,
  RefreshCw, Sliders, Server, Zap, Database, Lock
} from "lucide-react"

export default function SettingsPage() {
  const [userName, setUserName] = useState("Dr. Elena Rostova")
  const [userEmail, setUserEmail] = useState("elena.rostova@qml-health.org")
  const [userRole, setUserRole] = useState("Researcher")
  const [organization, setOrganization] = useState("National Institute of Quantum Medicine")

  // Quantum settings
  const [activeBackend, setActiveBackend] = useState("statevector_simulator")
  const [shots, setShots] = useState("2048")
  const [optLevel, setOptLevel] = useState("2")
  const [ibmToken, setIbmToken] = useState("")
  const [enableNoiseModel, setEnableNoiseModel] = useState(false)
  const [strictLeakageAudit, setStrictLeakageAudit] = useState(true)
  const [differentialPrivacy, setDifferentialPrivacy] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    try {
      const sessStr = localStorage.getItem("qml_session")
      if (sessStr) {
        const sess = JSON.parse(sessStr)
        if (sess.full_name || sess.name) setUserName(sess.full_name || sess.name)
        if (sess.email) setUserEmail(sess.email)
        if (sess.role) setUserRole(sess.role)
        if (sess.institution || sess.org) setOrganization(sess.institution || sess.org)
      }
    } catch {
      // ignore
    }
  }, [])

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const existing = JSON.parse(localStorage.getItem("qml_session") || "{}")
      const updatedSession = {
        ...existing,
        name: userName,
        full_name: userName,
        email: userEmail,
        role: userRole,
        org: organization,
        institution: organization,
        backend: activeBackend,
        shots: parseInt(shots),
        optLevel: parseInt(optLevel),
      }
      localStorage.setItem("qml_session", JSON.stringify(updatedSession))
      setSavedSuccess(true)
      setTimeout(() => {
        setSavedSuccess(false)
        window.location.reload()
      }, 800)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <HospitalLayout
      title="Platform Settings & Quantum Hardware"
      subtitle="Manage your profile, quantum simulator backends, Qiskit transpilation, and zero-leakage security"
    >
      <form onSubmit={handleSaveSettings} className="space-y-6 max-w-5xl">
        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">Settings saved successfully! Updating session profile...</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Researcher Profile & Persona Role</h2>
              <p className="text-xs text-slate-500 font-medium">Configure your identity and view mode across the platform</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm font-medium transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Email Address</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm font-medium transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Active Persona Role</label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm font-medium transition-colors"
              >
                <option value="Researcher">Researcher (QML Lab, Models, Marketplace, Datasets)</option>
                <option value="Institution">Institution / Clinician (Dashboard, Analysis, Laboratory, Patients)</option>
              </select>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Switching role changes sidebar navigation and contextual workflows.
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Affiliated Institution</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm font-medium transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Quantum Hardware & Simulator Card */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Quantum Computing Execution Target</h2>
              <p className="text-xs text-slate-500 font-medium">Configure Qiskit / PennyLane simulator engine and NISQ physical hardware</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Simulation Backend</label>
              <select
                value={activeBackend}
                onChange={(e) => setActiveBackend(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm font-medium transition-colors"
              >
                <option value="statevector_simulator">Qiskit Statevector Simulator (Exact, Noiseless)</option>
                <option value="qasm_simulator">Qiskit Aer QASM (Shot-based Sampling)</option>
                <option value="ibm_brisbane">IBM Quantum Brisbane (127-Qubit Eagle QPU)</option>
                <option value="ionq_aria">IonQ Aria (25-Qubit Trapped-Ion Cloud)</option>
                <option value="rigetti_aspen">Rigetti Aspen-M3 (80-Qubit Superconducting)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Measurement Shots</label>
              <select
                value={shots}
                onChange={(e) => setShots(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm font-medium transition-colors"
              >
                <option value="1024">1,024 Shots (Fast dev)</option>
                <option value="2048">2,048 Shots (Recommended benchmark)</option>
                <option value="4096">4,096 Shots (High precision)</option>
                <option value="8192">8,192 Shots (Publication grade)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Qiskit Transpiler Level</label>
              <select
                value={optLevel}
                onChange={(e) => setOptLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm font-medium transition-colors"
              >
                <option value="0">Level 0: No optimization (Raw circuit)</option>
                <option value="1">Level 1: Light gate cancellation</option>
                <option value="2">Level 2: Medium (Commutation analysis)</option>
                <option value="3">Level 3: Heavy (Max 2Q gate reduction)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">IBM Quantum Experience API Token</label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={ibmToken}
                onChange={(e) => setIbmToken(e.target.value)}
                placeholder="Optional: Enter your IBM Quantum API key (ibmq_...)"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 text-sm font-mono transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Leave blank to run on local statevector and Aer QASM high-performance simulators.
            </p>
          </div>
        </div>

        {/* Security & Audit Card */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Zero-Data-Leakage & Governance</h2>
              <p className="text-xs text-slate-500 font-medium">Strict clinical research validation safeguards</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">Strict Split Data Leakage Verification</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Ensure scalers, PCA, and quantum kernel transforms are strictly fitted only on training partitions.
                </div>
              </div>
              <input
                type="checkbox"
                checked={strictLeakageAudit}
                onChange={(e) => setStrictLeakageAudit(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">NISQ Noise Simulation Layer</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Simulate depolarizing thermal noise channels and bit-flip readout errors during benchmark runs.
                </div>
              </div>
              <input
                type="checkbox"
                checked={enableNoiseModel}
                onChange={(e) => setEnableNoiseModel(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="font-bold text-slate-900">Differential Privacy (DP-SGD)</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">
                  Inject calibrated Laplacian/Gaussian noise into quantum circuit gradient updates.
                </div>
              </div>
              <input
                type="checkbox"
                checked={differentialPrivacy}
                onChange={(e) => setDifferentialPrivacy(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" /> Save Preferences
          </button>
        </div>
      </form>
    </HospitalLayout>
  )
}
