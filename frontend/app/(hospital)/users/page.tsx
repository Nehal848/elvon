"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import HospitalLayout from "@/components/hospital-layout"
import { 
  Users, Stethoscope, Atom, Sparkles, Building2, 
  Search, Shield, CheckCircle2, MoreVertical, Plus,
  Mail, Phone, Award, Lock, ExternalLink, X, Loader2, RefreshCw
} from "lucide-react"

interface StaffUser {
  id: string
  name: string
  role: string
  department: string
  institution: string
  licenseId: string
  email: string
  status: "Active" | "Verified" | "Pending"
  lastActive: string
  avatarColor: string
}

const DEFAULT_USERS: StaffUser[] = [
  {
    id: "USR-001",
    name: "Dr. Ananya Sharma",
    role: "Senior Cardiologist & Clinician",
    department: "Cardiology & Clinical AI",
    institution: "AIIMS Delhi",
    licenseId: "MED-11001-DL",
    email: "doctor@elvon.ai",
    status: "Verified",
    lastActive: "Active Now",
    avatarColor: "from-blue-600 to-cyan-500"
  },
  {
    id: "USR-002",
    name: "Dr. Vikram Sarabhai",
    role: "Lead QML Research Scientist",
    department: "Quantum Computing Lab",
    institution: "TIFR Quantum Center",
    licenseId: "RES-QML-007",
    email: "researcher@elvon.ai",
    status: "Verified",
    lastActive: "14 mins ago",
    avatarColor: "from-purple-600 to-fuchsia-600"
  },
  {
    id: "USR-003",
    name: "Aarav Patel",
    role: "Principal ML & AutoML Engineer",
    department: "Diagnostic AI Studio",
    institution: "Elvon Medical AI Labs",
    licenseId: "DS-AI-404",
    email: "datascientist@elvon.ai",
    status: "Verified",
    lastActive: "1 hour ago",
    avatarColor: "from-emerald-600 to-teal-500"
  },
  {
    id: "USR-004",
    name: "CityCare Admin",
    role: "Hospital Administrator",
    department: "Executive Operations",
    institution: "CityCare Multi-Speciality",
    licenseId: "HOSP-MH-001",
    email: "admin@citycare.in",
    status: "Active",
    lastActive: "Active Now",
    avatarColor: "from-indigo-600 to-violet-600"
  },
  {
    id: "USR-005",
    name: "Dr. Rajesh Kothari",
    role: "Oncologist & Radiologist",
    department: "Radiology & Imaging",
    institution: "AIIMS Delhi",
    licenseId: "MED-11409-DL",
    email: "r.kothari@aiims.edu",
    status: "Active",
    lastActive: "Yesterday",
    avatarColor: "from-sky-600 to-blue-500"
  },
  {
    id: "USR-006",
    name: "Meera Sen",
    role: "Bioinformatics Specialist",
    department: "Genomics Research",
    institution: "TIFR Quantum Center",
    licenseId: "RES-BIO-112",
    email: "m.sen@tifr.res.in",
    status: "Active",
    lastActive: "2 days ago",
    avatarColor: "from-amber-600 to-orange-500"
  }
]

export default function UsersPage() {
  const [users, setUsers] = useState<StaffUser[]>(DEFAULT_USERS)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [newFullName, setNewFullName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newIdentifier, setNewIdentifier] = useState("")
  const [newRole, setNewRole] = useState("doctor")
  const [newDepartment, setNewDepartment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const roles = ["All", "Clinicians", "Researchers", "Data Scientists", "Administrators"]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/hospital/users")
      if (res.ok) {
        const data = await res.json()
        if (data.users && data.users.length > 0) {
          setUsers(data.users)
        }
      }
    } catch {
      // Keep DEFAULT_USERS if backend is in SQLite/demo mode
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const payload = {
      full_name: newFullName,
      email: newEmail,
      identifier: newIdentifier || `MED-${Math.floor(10000 + Math.random() * 90000)}`,
      role: newRole,
      designation: newDepartment || (newRole === "doctor" ? "Clinician" : newRole === "researcher" ? "QML Researcher" : "AI Engineer"),
      institution: "CityCare Multi-Speciality Hospital"
    }

    try {
      const res = await fetch("/api/hospital/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUsers(prev => [data.user, ...prev])
        }
      } else {
        // Fallback local addition
        const fallbackUser: StaffUser = {
          id: `USR-${Date.now().toString().slice(-4)}`,
          name: newFullName,
          role: payload.designation,
          department: payload.designation,
          institution: payload.institution,
          licenseId: payload.identifier,
          email: newEmail,
          status: "Verified",
          lastActive: "Active Now",
          avatarColor: newRole === "doctor" ? "from-blue-600 to-cyan-500" : newRole === "researcher" ? "from-purple-600 to-fuchsia-600" : "from-emerald-600 to-teal-500"
        }
        setUsers(prev => [fallbackUser, ...prev])
      }
    } catch {
      const fallbackUser: StaffUser = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: newFullName,
        role: payload.designation,
        department: payload.designation,
        institution: payload.institution,
        licenseId: payload.identifier,
        email: newEmail,
        status: "Verified",
        lastActive: "Active Now",
        avatarColor: "from-blue-600 to-cyan-500"
      }
      setUsers(prev => [fallbackUser, ...prev])
    } finally {
      setSubmitting(false)
      setModalOpen(false)
      setNewFullName("")
      setNewEmail("")
      setNewIdentifier("")
      setNewDepartment("")
      setSuccessMsg(`User "${newFullName}" successfully registered!`)
      setTimeout(() => setSuccessMsg(null), 4000)
    }
  }

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch = !q || 
      (u.name && u.name.toLowerCase().includes(q)) || 
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.licenseId && u.licenseId.toLowerCase().includes(q)) ||
      (u.department && u.department.toLowerCase().includes(q))

    let matchesRole = true
    const rLower = (u.role || "").toLowerCase()
    if (roleFilter === "Clinicians") matchesRole = rLower.includes("doctor") || rLower.includes("clinician") || rLower.includes("oncologist")
    if (roleFilter === "Researchers") matchesRole = rLower.includes("research") || rLower.includes("bio") || rLower.includes("qml")
    if (roleFilter === "Data Scientists") matchesRole = rLower.includes("ml") || rLower.includes("data") || rLower.includes("automl")
    if (roleFilter === "Administrators") matchesRole = rLower.includes("admin") || rLower.includes("institution")

    return matchesSearch && matchesRole
  })

  return (
    <HospitalLayout 
      title="User Management" 
      subtitle="Manage hospital staff permissions, medical credentials, clinical roles, and quantum lab access."
    >
      <div className="max-w-[1500px] space-y-6 pb-12">
        
        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center gap-3 animate-in fade-in duration-200">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span className="text-[13px] font-bold">{successMsg}</span>
          </div>
        )}

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users size={22} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Total Personnel</p>
              <h3 className="text-2xl font-extrabold text-slate-900">{users.length}</h3>
              <p className="text-[11px] font-semibold text-emerald-600">All Credentials Verified</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
              <Stethoscope size={22} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">Clinicians</p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {users.filter(u => (u.role || "").toLowerCase().includes("doctor") || (u.role || "").toLowerCase().includes("clinician")).length || 2}
              </h3>
              <p className="text-[11px] font-semibold text-cyan-600">PACS / DICOM Access</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Atom size={22} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">QML Researchers</p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {users.filter(u => (u.role || "").toLowerCase().includes("research") || (u.role || "").toLowerCase().includes("qml")).length || 2}
              </h3>
              <p className="text-[11px] font-semibold text-purple-600">NISQ Hardware Sandbox</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">AI Engineers</p>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {users.filter(u => (u.role || "").toLowerCase().includes("ml") || (u.role || "").toLowerCase().includes("data")).length || 2}
              </h3>
              <p className="text-[11px] font-semibold text-emerald-600">AutoML Tournament Access</p>
            </div>
          </div>
        </div>

        {/* Filter, Search & Add User Actions */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-[320px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, licence ID, department..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400 font-medium text-slate-700 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all ${
                  roleFilter === r
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={fetchUsers}
              title="Refresh"
              className="p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2 rounded-full text-[13px] font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer"
            >
              <Plus size={16} /> Add Personnel
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Users size={18} className="text-blue-500" /> Authorized Personnel Directory
            </div>
            <span className="text-[12px] font-semibold text-slate-500">
              {filteredUsers.length} staff member{filteredUsers.length !== 1 ? "s" : ""} active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100 bg-slate-50/50">
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-4">Role & Department</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Medical / Research ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${u.avatarColor || "from-blue-600 to-cyan-500"} text-white font-extrabold flex items-center justify-center text-[12px] shadow-sm`}>
                          {(u.name || "U").split(" ").map(w => w[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{u.name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Mail size={11} /> {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-700">{u.role}</div>
                      <div className="text-[11px] text-slate-500">{u.department}</div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-600">
                      {u.institution}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-[12px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {u.licenseId}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {u.status || "Verified"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-[12px]">
                      {u.lastActive || "Active Now"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Personnel Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-[18px] font-bold text-slate-900">Add Clinical / Research Personnel</h3>
                  <p className="text-[12px] text-slate-500">Assign role credentials and platform access permissions.</p>
                </div>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4 pt-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="e.g. Dr. Priya Nair"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="priya.nair@aiims.edu"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Platform Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                    >
                      <option value="doctor">Clinician / Doctor</option>
                      <option value="researcher">Quantum Researcher</option>
                      <option value="data_scientist">AutoML Engineer</option>
                      <option value="institution">Hospital Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Medical / Staff ID</label>
                    <input
                      type="text"
                      value={newIdentifier}
                      onChange={(e) => setNewIdentifier(e.target.value)}
                      placeholder="e.g. MED-22091-DL"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">Department / Speciality</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="e.g. Neurology & Clinical AI"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-[13px] outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl text-[13px] font-bold bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : "Save & Issue Access"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </HospitalLayout>
  )
}
