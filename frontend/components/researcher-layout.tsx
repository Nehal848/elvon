"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, BarChart2, FlaskConical, History, Atom, ShoppingBag,
  Settings, Search, Bell, ChevronDown, Shield, LogOut, Hexagon, Power, Check, Menu, X
} from "lucide-react"

const RESEARCH_NAV = [
  { href: "/quantum-lab",         icon: Atom,            label: "Quantum Simulator" },
  { href: "/research-dashboard",   icon: LayoutDashboard, label: "Experiment Hub" },
  { href: "/evaluation",          icon: BarChart2,       label: "Evaluation & Benchmarking" },
  { href: "/analysis-report",     icon: FlaskConical,    label: "AI Interpretability" },
  { href: "/history",             icon: History,         label: "Experiment History" },
  { href: "/marketplace",         icon: ShoppingBag,     label: "Model Marketplace" },
]

export default function ResearcherLayout({
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
  const [session, setSession] = useState<any>(null)
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const switcherRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("qml_session")
      if (raw) setSession(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setRoleSwitcherOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const userName = session?.full_name || "Dr. Vikram Sarabhai"
  const userInitials = userName.split(" ").map((w: string) => w[0]).slice(0, 2).join("")

  function handleLogout() {
    localStorage.removeItem("qml_session")
    localStorage.removeItem("hospital_ai_session")
    window.location.href = "/login"
  }

  function handleSwitchRole(role: string, targetPath: string, name: string, designation: string) {
    const updated = {
      ...session,
      role,
      full_name: name,
      designation,
    }
    localStorage.setItem("qml_session", JSON.stringify(updated))
    setSession(updated)
    setRoleSwitcherOpen(false)
    router.push(targetPath)
  }

  const SidebarContent = () => (
    <aside className="w-[260px] flex-shrink-0 bg-[#0f172a] flex flex-col justify-between h-full relative z-20 overflow-y-auto border-r border-slate-800">
      {/* Subtle background hexagon pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' stroke='%23ffffff' stroke-width='1' fill='none' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 100px'
      }} />

      <div className="relative z-10">
        {/* Logo */}
        <div className="pt-7 pb-6 px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-violet-500/20">
              <Hexagon size={22} fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-[20px] font-extrabold tracking-tight text-white leading-none mb-1">ELVON</span>
              <span className="text-[10px] tracking-wider text-violet-400 font-bold uppercase leading-none">Quantum Research</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="space-y-1 px-3 mt-2">
          {RESEARCH_NAV.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== "/research-dashboard" && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  isActive
                    ? "bg-violet-600/20 text-white font-semibold border-l-2 border-violet-400"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <Icon size={17} className={isActive ? "text-violet-400" : "text-slate-500"} /> 
                <span className="truncate">{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 relative z-10 space-y-4">
        {/* Secure Enclave Badge */}
        <div className="bg-emerald-950/30 rounded-xl p-3.5 flex items-center gap-3 border border-emerald-500/20 shadow-xs backdrop-blur-xs">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="fill-emerald-500/20" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-white leading-snug">Zero-Data-Leakage</div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Secure Enclave
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-extrabold text-[12px]">
              {userInitials}
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-white truncate">{userName}</div>
              <div className="text-[10px] text-slate-400 truncate">QML Lead</div>
            </div>
          </div>
          <button onClick={handleLogout} title="Log Out" className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors">
            <Power size={14} />
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-[#f4f7fc] flex font-sans text-slate-900 overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex h-screen sticky top-0">
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[260px] shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 relative">
        
        {/* Subtle Blurred Minimal Watermark Wallpaper */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "url('/medical-pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "320px 320px",
            opacity: 0.03,
            filter: "blur(8px)",
            transform: "scale(1.05)",
          }}
        />
        
        {/* Top Header */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 bg-[#f4f7fc]/90 backdrop-blur-xs border-b border-slate-200/60 relative z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-extrabold text-[#1e3a8a] tracking-tight">{title}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r from-violet-600 to-fuchsia-600">
                  Researcher Suite
                </span>
              </div>
              {subtitle && <p className="text-[13px] text-slate-500 font-medium mt-0.5">{subtitle}</p>}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden xl:flex items-center">
              <Search size={15} className="absolute left-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quantum circuits, benchmarks..."
                className="w-[260px] pl-10 pr-4 py-2 rounded-full bg-white shadow-xs border border-slate-200 text-[13px] outline-none focus:w-[320px] focus:ring-2 focus:ring-violet-500/20 placeholder:text-slate-400 font-medium text-slate-700 transition-all"
              />
            </div>

            {/* Portal Switcher Dropdown */}
            <div className="relative" ref={switcherRef}>
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer text-[12px] font-bold text-slate-700"
              >
                <span className="w-2 h-2 rounded-full bg-violet-600" />
                <span>Switch Portal</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${roleSwitcherOpen ? "rotate-180" : ""}`} />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Workspace</div>
                    <div className="text-[13px] font-extrabold text-violet-600">Quantum Research Suite</div>
                  </div>
                  <div className="p-1 space-y-1">
                    <button
                      onClick={() => handleSwitchRole("doctor", "/patients", "Dr. Ananya Sharma", "Senior Cardiologist & Clinician")}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-[12px] text-slate-600 hover:bg-slate-50 font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        <span>Doctor Clinical Suite</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSwitchRole("institution", "/dashboard", "CityCare Hospital Admin", "Hospital Administrator")}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-[12px] text-slate-600 hover:bg-slate-50 font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        <span>Hospital Command Center</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSwitchRole("data_scientist", "/create-model", "Aarav Patel", "Principal ML & AutoML Engineer")}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-[12px] text-slate-600 hover:bg-slate-50 font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        <span>AutoML & AI Studio</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Bell Link */}
            <Link
              href="/notifications"
              title="Notifications"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center relative text-slate-600 hover:text-violet-600 transition-colors"
            >
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-violet-600 rounded-full"></span>
            </Link>

            {/* Settings Link */}
            <Link
              href="/settings"
              title="Settings"
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-violet-600 transition-colors"
            >
              <Settings size={18} />
            </Link>

            {/* User Avatar */}
            <Link href="/settings" className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-[13px] shadow-xs cursor-pointer no-underline">
              {userInitials}
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 pt-6 relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
