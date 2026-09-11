"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Search, Bell, Settings, LayoutDashboard, BarChart2, Box, Users, FlaskConical,
  LogOut, Shield, ChevronDown, User, Menu, Cpu, ShoppingBag, PlusCircle,
  Layers, Plug, FileText, Atom
} from "lucide-react"

function getInitials(name: string) {
  if (!name) return "?"
  return name.trim().split(/\s+/).map((w: string) => w[0]).join("").substring(0, 2).toUpperCase()
}

// ── Role-based nav ─────────────────────────────────────────────────────────────
const RESEARCHER_NAV = [
  { href: "/dashboard",     icon: LayoutDashboard, label: "Dashboard" },
  { href: "/analysis",      icon: Cpu,             label: "Quantum Lab" },
  { href: "/models",        icon: Box,             label: "My Models" },
  { href: "/marketplace",   icon: ShoppingBag,     label: "Model Marketplace" },
  { href: "/create-model",  icon: PlusCircle,      label: "Create Model" },
  { href: "/patients",      icon: FileText,        label: "My Datasets" },
  { href: "/version",       icon: Layers,          label: "Version History" },
  { href: "/settings",      icon: Settings,        label: "Settings" },
]

const INSTITUTION_NAV = [
  { href: "/dashboard",     icon: LayoutDashboard, label: "Dashboard" },
  { href: "/analysis",      icon: BarChart2,       label: "Analysis" },
  { href: "/models",        icon: Box,             label: "Models" },
  { href: "/patients",      icon: Users,           label: "Patients" },
  { href: "/laboratory",    icon: FlaskConical,    label: "Laboratory & Imaging" },
  { href: "/settings",      icon: Settings,        label: "Settings" },
]

export default function HospitalLayout({
  children,
  title,
  subtitle
}: {
  children: React.ReactNode
  title: string
  subtitle?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    // Check auth — support both old key and new key
    try {
      const raw = localStorage.getItem("qml_session") || localStorage.getItem("hospital_ai_session")
      if (!raw) { router.push("/login"); return }
      setSession(JSON.parse(raw))
    } catch { router.push("/login") }
  }, [router])

  const role = session?.role || "researcher"
  const userName = session?.full_name || session?.name || session?.hospital_name || "Researcher"
  const userRole = role === "institution" ? "Institution" : (session?.designation || "Researcher")
  const userInitials = getInitials(userName)
  const navLinks = role === "institution" ? INSTITUTION_NAV : RESEARCHER_NAV

  function handleLogout() {
    localStorage.removeItem("qml_session")
    localStorage.removeItem("hospital_ai_session")
    window.location.href = "/login"
  }

  const Sidebar = () => (
    <aside className="w-[220px] flex-shrink-0 bg-[#FCFDFE] border-r border-slate-200/60 flex flex-col justify-between h-full relative z-20">
      <div>
        {/* Logo */}
        <div className="pt-7 pb-7 px-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
            <Atom size={19} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-bold tracking-tight text-[#0f172a] leading-none mb-0.5">QML Platform</span>
            <span className="text-[9px] tracking-wide text-indigo-500 font-semibold uppercase leading-none">SIH · PS-26139</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 space-y-0.5">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all ${
                pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={16} className="flex-shrink-0" /> {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="px-4 pb-5 space-y-4">
        {/* Secure Enclave Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-4 relative overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-700 text-white flex items-center justify-center mb-2.5 relative z-10 shadow-sm">
            <Shield size={16} />
          </div>
          <h4 className="text-[12px] font-semibold text-slate-900 mb-0.5 relative z-10 leading-tight">Zero-Data-Leakage Architecture</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed mb-3 relative z-10">All computations within secure enclave</p>
          <div className="inline-flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-indigo-700 border border-indigo-100 relative z-10">
            Secure Enclave Active <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* User Profile */}
        <div className="pt-3 border-t border-slate-200/60">
          <Link href="/settings" onClick={() => setSidebarOpen(false)} className="flex items-center justify-between mb-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {userInitials}
              </div>
              <div>
                <div className="text-[12px] font-semibold text-slate-900 truncate max-w-[110px]">{userName}</div>
                <div className="text-[10px] text-slate-500">{userRole}</div>
              </div>
            </div>
            <ChevronDown size={12} className="text-slate-400" />
          </Link>
          <div className="space-y-0.5">
            <button className="flex items-center gap-2.5 w-full px-2 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <div className="relative">
                <Bell size={14} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 text-white text-[7px] font-bold flex items-center justify-center rounded-full border border-white">3</span>
              </div>
              Notifications
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-2 py-1.5 text-[12px] font-medium text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-[#F3F6FA] flex font-sans text-slate-900 overflow-hidden">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[220px] shadow-2xl overflow-y-auto">
            <Sidebar />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">

        {/* Top Header */}
        <header className="h-16 md:h-20 flex-shrink-0 flex items-center justify-between px-4 md:px-8 bg-[#F3F6FA] border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-base md:text-xl font-semibold text-slate-900 tracking-tight leading-tight">{title}</h1>
              {subtitle && <p className="hidden md:block text-[12px] text-slate-500 font-medium mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative hidden lg:flex items-center">
              <Search size={14} className="absolute left-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search experiments, models..."
                className="w-[260px] pl-9 pr-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-[13px] outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder:text-slate-400 font-medium text-slate-700 transition-all"
              />
            </div>
            <button className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center relative text-slate-600 hover:bg-slate-50 transition-colors">
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-[#F3F6FA]">3</span>
            </button>
            <Link href="/settings" className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-sm border-2 border-white relative">
              {userInitials}
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
