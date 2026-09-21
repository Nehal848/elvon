"use client"

import React, { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Search, Bell, Settings, LayoutDashboard, Box, Users, FileText,
  Power, Menu, ChevronDown, ShoppingBag, PlusCircle, Layers, Link as LinkIcon,
  Activity, Stethoscope, Building2, Atom, Sparkles, LogOut, Check, ArrowRight, X,
  Database, ShieldCheck, Zap, BarChart2, Lightbulb, Clock, CheckCircle2
} from "lucide-react"

// ── Medical Cross Logo Icon ───────────────────────────────────────────────────
function MedicalCrossIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="4" width="12" height="32" rx="4" fill="url(#crossGrad)" />
      <rect x="4" y="14" width="32" height="12" rx="4" fill="url(#crossGrad)" />
      <circle cx="20" cy="20" r="4" fill="#ffffff" />
      <defs>
        <linearGradient id="crossGrad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0284c7" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

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
      { step: 1, href: "/dashboard",        icon: LayoutDashboard, label: "Dashboard" },
      { step: 2, href: "/create-model",     icon: Database,        label: "Dataset Overview" },
      { step: 3, href: "/create-model",     icon: Settings,        label: "Data Preprocessing" },
      { step: 4, href: "/models",           icon: ShieldCheck,     label: "Data Validation" },
      { step: 5, href: "/create-model",     icon: Zap,             label: "Model Training" },
      { step: 6, href: "/evaluation",       icon: BarChart2,       label: "Evaluation" },
      { step: 7, href: "/analysis-report",  icon: Lightbulb,       label: "Explainability" },
    ]
  },
  doctor: {
    id: "doctor",
    title: "Doctor Clinical Suite",
    subtitle: "Real-time patient triage, diagnostic AI inference, and PACS imaging.",
    badgeLabel: "Doctor / Clinician",
    color: "#0284c7",
    gradient: "from-blue-600 to-cyan-500",
    homeHref: "/patients",
    defaultUser: {
      name: "Dr. Ananya Sharma",
      role: "Senior Cardiologist",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"
    },
    nav: [
      { step: 1, href: "/patients",      icon: Users,           label: "Patients Triage" },
      { step: 2, href: "/laboratory",    icon: FileText,        label: "Clinical Lab & PACS" },
      { step: 3, href: "/analysis",      icon: Activity,        label: "AI Diagnostic Lab" },
      { step: 4, href: "/reports",       icon: FileText,        label: "Patient Reports" },
      { step: 5, href: "/notifications", icon: Bell,            label: "Notifications", badge: 2 },
      { step: 6, href: "/settings",      icon: Settings,        label: "Settings" },
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
      { step: 1, href: "/dashboard",     icon: LayoutDashboard, label: "Command Center" },
      { step: 2, href: "/models",        icon: Box,             label: "AI Models Catalog" },
      { step: 3, href: "/integrations",  icon: LinkIcon,        label: "PACS & FHIR Gateways" },
      { step: 4, href: "/version",       icon: Layers,          label: "Platform Architecture" },
      { step: 5, href: "/reports",       icon: FileText,        label: "Hospital Reports" },
      { step: 6, href: "/notifications", icon: Bell,            label: "Notifications", badge: 3 },
      { step: 7, href: "/settings",      icon: Settings,        label: "Settings" },
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
      { step: 1, href: "/quantum-lab",         icon: Atom,            label: "Quantum Simulator" },
      { step: 2, href: "/research-dashboard",   icon: LayoutDashboard, label: "Experiment Hub" },
      { step: 3, href: "/evaluation",          icon: BarChart2,       label: "Benchmarks & Eval" },
      { step: 4, href: "/analysis-report",     icon: FileText,        label: "AI Interpretability" },
      { step: 5, href: "/history",             icon: Layers,          label: "Experiment History" },
      { step: 6, href: "/marketplace",         icon: ShoppingBag,     label: "Model Marketplace" },
      { step: 7, href: "/notifications",       icon: Bell,            label: "Notifications" },
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
    <aside className="w-[260px] flex-shrink-0 bg-white border-r border-slate-200/80 flex flex-col justify-between h-full relative z-20 shadow-[2px_0_16px_rgba(0,0,0,0.02)]">
      <div>
        {/* Brand Header */}
        <div className="pt-7 pb-6 px-6">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center border border-sky-100 shadow-xs">
              <MedicalCrossIcon size={26} />
            </div>
            <div className="flex flex-col">
              <span className="text-[20px] font-extrabold tracking-tight text-[#0f172a] leading-none mb-1">ELVON</span>
              <span className="text-[11px] font-medium text-slate-500 leading-none">Clinical Intelligence</span>
            </div>
          </Link>
        </div>

        {/* Stepper Navigation */}
        <nav className="px-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-250px)]">
          {activeNav.map(({ step, href, icon: Icon, label, badge }) => {
            const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
            return (
              <Link
                key={href + step}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-semibold text-[13.5px] transition-all no-underline ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white shadow-md shadow-cyan-500/25"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Step Number Circle */}
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    {step}
                  </span>

                  <Icon size={17} className={isActive ? "text-white" : "text-slate-400"} />
                  <span className="truncate">{label}</span>
                </div>

                {badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? "bg-white text-blue-600" : "bg-red-500 text-white"
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
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={userAvatar}
              alt={userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-sky-100 shadow-xs"
            />
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-slate-900 truncate leading-tight">{userName}</div>
              <div className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">{userRole}</div>
            </div>
          </div>
          <Link href="/settings" title="Settings" className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg">
            <Settings size={16} />
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center gap-2 px-3 py-2 text-[12.5px] font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl transition-colors cursor-pointer"
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
          <div className="flex items-center gap-3">
            {/* Quick Switch Portal */}
            <div className="relative" ref={switcherRef}>
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all cursor-pointer text-[12px] font-bold text-slate-700"
              >
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" />
                <span>Switch Portal</span>
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
