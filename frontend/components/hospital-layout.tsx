"use client"

import React, { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Search, Bell, Settings, LayoutDashboard, Box, Users, FileText,
  Power, Menu, ChevronDown, ShoppingBag, PlusCircle, Layers, Link as LinkIcon,
  Activity, Stethoscope, Building2, Atom, Sparkles, LogOut, Check, ArrowRight, X,
  Database, ShieldCheck, Zap, BarChart2, Lightbulb, Clock, CheckCircle2, Brain
} from "lucide-react"

// ── Removed MedicalCrossIcon in favor of Lucide Brain ───────────────────────

// ── Persona Configurations with Numbered Steppers ─────────────────────────────
export const PERSONA_CONFIGS = {
  data_scientist: {
    id: "data_scientist",
    title: "Data Scientist Dashboard",
    subtitle: "Build, train and evaluate models for better healthcare outcomes.",
    badgeLabel: "Data Scientist",
    color: "#0284c7",
    gradient: "from-blue-600 via-sky-500 to-cyan-400",
    homeHref: "/dashboard",
    defaultUser: {
      name: "Rohan Mehta",
      role: "Data Scientist",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    nav: [
      { href: "/dashboard",        icon: LayoutDashboard, label: "Dashboard" },
      { href: "/create-model",     icon: Sparkles,        label: "Create Model (AutoML)" },
      { href: "/models",           icon: Box,             label: "Model Management" },
      { href: "/patients",         icon: Database,        label: "Datasets & Cohorts" },
      { href: "/marketplace",      icon: ShoppingBag,     label: "Model Marketplace" },
      { href: "/reports",          icon: FileText,        label: "Analytics & Reports" },
      { href: "/audit",            icon: ShieldCheck,     label: "Audit & Safety Logs" },
      { href: "/settings",         icon: Settings,        label: "Settings" },
    ]
  },
  doctor: {
    id: "doctor",
    title: "Doctor Clinical Suite",
    subtitle: "Real-time patient triage, diagnostic AI inference, and PACS imaging.",
    badgeLabel: "Doctor / Clinician",
    color: "#0284c7",
    gradient: "from-blue-600 to-cyan-500",
    homeHref: "/dashboard",
    defaultUser: {
      name: "Dr. Ananya Sharma",
      role: "Senior Cardiologist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
    },
    nav: [
      { href: "/dashboard",        icon: LayoutDashboard, label: "Dashboard" },
      { href: "/analysis-report",  icon: FileText,        label: "Analyze Patient Report" },
      { href: "/patients",         icon: Users,           label: "Patients" },
      { href: "/models",         icon: Brain,           label: "Models" },
      { href: "/reports",        icon: FileText,        label: "Reports", badge: 2 },
      { href: "/notifications",  icon: Bell,            label: "Notifications" },
      { href: "/settings",       icon: Settings,        label: "Settings" },
    ]
  },
  institution: {
    id: "institution",
    title: "Hospital Command Center",
    subtitle: "Enterprise hospital operations, model registry, and FHIR interoperability.",
    badgeLabel: "Hospital Admin",
    color: "#0284c7",
    gradient: "from-blue-600 via-indigo-600 to-cyan-500",
    homeHref: "/dashboard",
    defaultUser: {
      name: "CityCare Admin",
      role: "Hospital Administrator",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    nav: [
      { href: "/dashboard",     icon: LayoutDashboard, label: "Dashboard" },
      { href: "/users",         icon: Users,           label: "User Management" },
      { href: "/models",        icon: Box,             label: "Model Management" },
      { href: "/patients",      icon: Users,           label: "Patients & Data" },
      { href: "/reports",       icon: BarChart2,       label: "Analytics & Reports" },
      { href: "/audit",         icon: ShieldCheck,     label: "Audit & Activity" },
      { href: "/notifications", icon: Bell,            label: "Notifications" },
      { href: "/settings",      icon: Settings,        label: "Settings" },
    ]
  },
  researcher: {
    id: "researcher",
    title: "Quantum Research Suite",
    subtitle: "NISQ simulator, PennyLane & Qiskit hybrid quantum machine learning.",
    badgeLabel: "Quantum Researcher",
    color: "#0284c7",
    gradient: "from-blue-600 to-cyan-500",
    homeHref: "/research-dashboard",
    defaultUser: {
      name: "Dr. Vikram Sarabhai",
      role: "Lead QML Scientist",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    nav: [
      { href: "/quantum-lab",         icon: Atom,            label: "Quantum Simulator" },
      { href: "/research-dashboard",   icon: LayoutDashboard, label: "Experiment Hub" },
      { href: "/evaluation",          icon: BarChart2,       label: "Evaluation & Benchmarking" },
      { href: "/analysis-report",     icon: FileText,        label: "AI Interpretability" },
      { href: "/history",             icon: Layers,          label: "Experiment History" },
      { href: "/marketplace",         icon: ShoppingBag,     label: "Model Marketplace" },
      { href: "/notifications",       icon: Bell,            label: "Notifications" },
      { href: "/settings",            icon: Settings,        label: "Settings" },
    ]
  }
}

export default function HospitalLayout({
  children,
  title,
  subtitle
}: {
  children: React.ReactNode
  title?: string
  subtitle?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false)
  const switcherRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("qml_session") || localStorage.getItem("hospital_ai_session")
      if (!raw) {
        const defaultSess = {
          role: "data_scientist",
          full_name: "Rohan Mehta",
          designation: "Data Scientist",
          institution: "Elvon Medical AI Labs",
          identifier: "DS-AI-404",
          email: "datascientist@elvon.ai"
        }
        localStorage.setItem("qml_session", JSON.stringify(defaultSess))
        setSession(defaultSess)
        return
      }
      setSession(JSON.parse(raw))
    } catch {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setRoleSwitcherOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const currentRoleKey: keyof typeof PERSONA_CONFIGS =
    session?.role === "hospital" || session?.role === "institution"
      ? "institution"
      : session?.role === "researcher"
      ? "researcher"
      : session?.role === "doctor"
      ? "doctor"
      : "data_scientist"

  const isLinkActive = (href: string) => {
    if (href === "/dashboard" || href === "/research-dashboard") {
      return pathname === href
    }
    return pathname === href || (pathname.startsWith(href) && href !== "/")
  }

  const activePersona = PERSONA_CONFIGS[currentRoleKey] || PERSONA_CONFIGS.data_scientist
  const activeNav = activePersona.nav

  const displayTitle = title || activePersona.title
  const displaySubtitle = subtitle || activePersona.subtitle

  const userName = session?.full_name || session?.name || activePersona.defaultUser.name
  const userRole = session?.designation || activePersona.defaultUser.role
  const userAvatar = activePersona.defaultUser.avatar

  function handleSwitchRole(newRoleKey: keyof typeof PERSONA_CONFIGS) {
    const targetPersona = PERSONA_CONFIGS[newRoleKey]
    const updated = {
      ...session,
      role: targetPersona.id,
      full_name: targetPersona.defaultUser.name,
      designation: targetPersona.defaultUser.role,
    }
    localStorage.setItem("qml_session", JSON.stringify(updated))
    localStorage.setItem("hospital_ai_session", JSON.stringify(updated))
    setSession(updated)
    setRoleSwitcherOpen(false)
    router.push(targetPersona.homeHref)
  }

  function handleLogout() {
    localStorage.removeItem("qml_session")
    localStorage.removeItem("hospital_ai_session")
    window.location.href = "/login"
  }

  const Sidebar = () => (
    <aside 
      className="w-[268px] flex-shrink-0 flex flex-col justify-between h-full relative z-20 bg-gradient-to-b from-[#0e2a47] via-[#0b2038] to-[#071728] border-r border-cyan-500/15 shadow-[4px_0_24px_rgba(0,0,0,0.25)]"
    >
      {/* Subtle Ambient Radial Light at top of sidebar */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-radial from-cyan-500/15 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* Brand Header */}
        <div className="pt-7 pb-6 px-6">
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(14,165,233,0.45)] group-hover:scale-105 transition-transform">
              <Brain size={24} className="text-white drop-shadow-xs" />
            </div>
            <div className="flex flex-col">
              <span className="text-[21px] font-black tracking-tight text-white leading-none mb-1 drop-shadow-xs">ELVON</span>
              <span className="text-[11px] font-bold text-cyan-400 tracking-wide leading-none">Clinical Intelligence</span>
            </div>
          </Link>
        </div>

        {/* Stepper Navigation */}
        <nav className="px-3.5 space-y-1.5 overflow-y-auto max-h-[calc(100vh-250px)]">
          {activeNav.map(({ step, href, icon: Icon, label, badge }: any) => {
            const isActive = isLinkActive(href)
            return (
              <Link
                key={href + step}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center justify-between px-3 py-2 rounded-2xl text-[13.5px] transition-all no-underline ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white shadow-[0_4px_18px_rgba(14,165,233,0.35)] font-bold border border-white/20"
                    : "text-slate-300 hover:bg-white/[0.08] hover:text-white hover:border-white/10 border border-transparent font-medium"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Styled Glowing Icon Container Badge */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    isActive
                      ? "bg-white/25 text-white backdrop-blur-md ring-1 ring-white/40 shadow-inner"
                      : "bg-white/[0.07] text-cyan-300 group-hover:bg-gradient-to-tr group-hover:from-blue-600 group-hover:to-cyan-400 group-hover:text-white group-hover:shadow-[0_0_12px_rgba(14,165,233,0.4)] border border-white/10 shadow-xs"
                  }`}>
                    {step !== undefined ? (
                      <span className={`text-[11px] font-bold ${isActive ? "text-white" : "text-cyan-300 group-hover:text-white"}`}>
                        {step}
                      </span>
                    ) : (
                      <Icon size={18} />
                    )}
                  </div>

                  <span className="truncate">{label}</span>
                </div>

                {badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-white text-sky-700 shadow-xs" : "bg-rose-500 text-white"
                  }`}>
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Profile & Logout Bottom Card */}
      <div className="p-4 border-t border-white/10 bg-black/10 backdrop-blur-md relative z-10">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.09] transition-colors shadow-inner">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={userAvatar}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)] ring-2 ring-white/20"
            />
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-white truncate leading-tight">{userName}</div>
              <div className="text-[11px] font-medium text-cyan-300/80 truncate leading-tight mt-0.5">{userRole}</div>
            </div>
          </div>
          <Link href="/settings" title="Settings" className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all">
            <Settings size={16} />
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-2.5 flex items-center gap-2 px-3 py-2 text-[12.5px] font-bold text-slate-300 hover:text-rose-300 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-500/30"
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900 overflow-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
      `}</style>

      {/* Minimal Blurred Watermark & Soft Ambient Light */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/medical-pattern.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "320px 320px",
          opacity: 0.035,
          filter: "blur(8px)",
          transform: "scale(1.05)",
        }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-tr from-sky-100/25 via-transparent to-cyan-100/20"
      />

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex h-screen sticky top-0 z-20">
        <Sidebar />
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[260px] shadow-2xl overflow-y-auto z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 relative z-10">

        {/* Top Header matching mockup */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-8 bg-transparent">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-white" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-[22px] font-extrabold text-[#0f172a] tracking-tight">{displayTitle}</h1>
              {displaySubtitle && <p className="text-[13px] text-slate-500 font-medium mt-0.5">{displaySubtitle}</p>}
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-4">
            {/* Search Pill */}
            <div className="hidden lg:flex items-center bg-white rounded-full px-4 py-2 border border-slate-200 shadow-sm min-w-[280px] hover:border-slate-300 transition-colors">
              <Search size={16} className="text-slate-400 mr-2" />
              <input type="text" placeholder="Search patients, models..." className="bg-transparent border-none outline-none text-[13px] font-medium text-slate-700 w-full placeholder:text-slate-400" />
            </div>

            {/* Date Pill */}
            <div className="hidden md:flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-slate-200 shadow-sm text-[12.5px] font-bold text-slate-600">
              <Clock size={15} className="text-cyan-600" />
              <span>Sep 16, 2026</span>
            </div>

            {/* Quick Switch Portal */}
            <div className="relative" ref={switcherRef}>
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all cursor-pointer text-[12.5px] font-bold text-slate-700"
              >
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                <span className="hidden sm:inline">Switch Portal</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${roleSwitcherOpen ? "rotate-180" : ""}`} />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Portal</div>
                    <div className="text-[13px] font-extrabold text-slate-800">{activePersona.title}</div>
                  </div>
                  <div className="p-1 space-y-1">
                    {(Object.keys(PERSONA_CONFIGS) as Array<keyof typeof PERSONA_CONFIGS>).map((k) => {
                      const cfg = PERSONA_CONFIGS[k]
                      const isCur = currentRoleKey === k
                      return (
                        <button
                          key={k}
                          onClick={() => handleSwitchRole(k)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-[12px] transition-colors ${
                            isCur ? "bg-sky-50 font-bold text-blue-700" : "text-slate-600 hover:bg-slate-50 font-medium"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.color }} />
                            <span>{cfg.badgeLabel}</span>
                          </div>
                          {isCur && <Check size={14} className="text-blue-600" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell with Badge */}
            <Link
              href="/notifications"
              title="Notifications"
              className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center relative text-slate-600 hover:text-blue-600 transition-colors no-underline"
            >
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-4 h-4 bg-rose-500 rounded-full text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-white">
                3
              </span>
            </Link>

            {/* Profile Avatar circle */}
            <Link href="/settings" className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-xs cursor-pointer no-underline block">
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            </Link>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 pt-2 relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}
