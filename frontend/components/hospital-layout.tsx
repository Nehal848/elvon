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
      className="w-[280px] flex-shrink-0 flex flex-col justify-between h-full relative z-20 bg-[#040a17] text-white select-none overflow-hidden"
    >
      {/* Neural Constellation Constellation SVG Background */}
      <div className="absolute inset-0 pointer-events-none opacity-25 z-0 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Constellation Lines */}
          <line x1="20" y1="40" x2="110" y2="90" stroke="#0ea5e9" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6" />
          <line x1="110" y1="90" x2="220" y2="60" stroke="#0ea5e9" strokeWidth="0.75" opacity="0.5" />
          <line x1="220" y1="60" x2="260" y2="180" stroke="#0ea5e9" strokeWidth="0.75" opacity="0.4" />
          <line x1="260" y1="180" x2="190" y2="280" stroke="#0ea5e9" strokeWidth="0.75" opacity="0.4" />
          <line x1="190" y1="280" x2="80" y2="350" stroke="#0ea5e9" strokeWidth="0.75" opacity="0.4" />
          <line x1="80" y1="350" x2="240" y2="480" stroke="#0ea5e9" strokeWidth="0.75" opacity="0.5" />
          <line x1="240" y1="480" x2="160" y2="590" stroke="#0ea5e9" strokeWidth="0.75" opacity="0.5" />
          <line x1="160" y1="590" x2="60" y2="700" stroke="#0ea5e9" strokeWidth="0.75" opacity="0.6" />
          <line x1="60" y1="700" x2="220" y2="760" stroke="#0ea5e9" strokeWidth="0.75" opacity="0.4" />
          <line x1="220" y1="760" x2="180" y2="860" stroke="#0ea5e9" strokeWidth="0.75" opacity="0.5" />
          {/* Constellation Nodes */}
          <circle cx="20" cy="40" r="2.5" fill="#38bdf8" />
          <circle cx="110" cy="90" r="3.5" fill="#22d3ee" className="animate-pulse" />
          <circle cx="220" cy="60" r="2.5" fill="#38bdf8" />
          <circle cx="260" cy="180" r="2" fill="#0ea5e9" />
          <circle cx="190" cy="280" r="3" fill="#22d3ee" />
          <circle cx="80" cy="350" r="2.5" fill="#38bdf8" />
          <circle cx="240" cy="480" r="3.5" fill="#22d3ee" className="animate-pulse" />
          <circle cx="160" cy="590" r="2.5" fill="#38bdf8" />
          <circle cx="60" cy="700" r="3" fill="#22d3ee" />
          <circle cx="220" cy="760" r="2.5" fill="#38bdf8" />
          <circle cx="180" cy="860" r="2" fill="#0ea5e9" />
        </svg>
      </div>

      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-48 bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* MAIN CONTENT OF SIDEBAR */}
      <div className="relative z-10 flex flex-col flex-1 overflow-y-auto px-4 pt-6 pb-2">
        
        {/* BRAND HEADER WITH 3D CRYSTAL BRAIN */}
        <div className="px-2 mb-6">
          <Link href="/" className="flex items-center gap-3.5 no-underline group">
            {/* Low-Poly 3D Crystal Brain SVG */}
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-cyan-400/20 blur-lg rounded-full" />
              <svg viewBox="0 0 100 100" className="w-12 h-12 relative z-10 filter drop-shadow-[0_0_12px_rgba(56,189,248,0.7)] group-hover:scale-105 transition-transform duration-300">
                <defs>
                  <linearGradient id="crystal1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7dd3fc" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                  <linearGradient id="crystal2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0369a1" />
                  </linearGradient>
                  <linearGradient id="crystal3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#bae6fd" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                  <linearGradient id="crystalEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                {/* Left Hemisphere Low Poly Facets */}
                <polygon points="46,18 28,28 36,44" fill="url(#crystal1)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="46,18 36,44 46,38" fill="url(#crystal3)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="28,28 14,46 32,54" fill="url(#crystal2)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="28,28 32,54 36,44" fill="url(#crystal1)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="36,44 32,54 46,60" fill="url(#crystal3)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="36,44 46,60 46,38" fill="url(#crystal2)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="14,46 22,68 34,70" fill="url(#crystal1)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="14,46 34,70 32,54" fill="url(#crystal3)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="32,54 34,70 46,78" fill="url(#crystal2)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="32,54 46,78 46,60" fill="url(#crystal1)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="34,70 42,88 46,78" fill="url(#crystal3)" stroke="url(#crystalEdge)" strokeWidth="0.8" />

                {/* Right Hemisphere Low Poly Facets */}
                <polygon points="54,18 72,28 64,44" fill="url(#crystal3)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="54,18 64,44 54,38" fill="url(#crystal1)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="72,28 86,46 68,54" fill="url(#crystal2)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="72,28 68,54 64,44" fill="url(#crystal3)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="64,44 68,54 54,60" fill="url(#crystal1)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="64,44 54,60 54,38" fill="url(#crystal2)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="86,46 78,68 66,70" fill="url(#crystal3)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="86,46 66,70 68,54" fill="url(#crystal1)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="68,54 66,70 54,78" fill="url(#crystal2)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="68,54 54,78 54,60" fill="url(#crystal3)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
                <polygon points="66,70 58,88 54,78" fill="url(#crystal1)" stroke="url(#crystalEdge)" strokeWidth="0.8" />
              </svg>
            </div>

            {/* Brand Title */}
            <div className="flex flex-col">
              <span className="text-[22px] font-black tracking-wide text-white leading-none mb-1">ELVON</span>
              <span className="text-[11px] font-bold text-[#38bdf8] tracking-wider leading-none">Clinical Intelligence</span>
            </div>
          </Link>
        </div>

        {/* FLOATING FROSTED GLASS CAPSULE CONTAINER */}
        <div className="rounded-[26px] p-2.5 bg-gradient-to-b from-[#102d4a]/50 via-[#0a1f33]/40 to-[#071726]/50 border border-cyan-400/20 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.37),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col gap-1.5">
          {activeNav.map(({ step, href, icon: Icon, label, badge }: any) => {
            const isActive = isLinkActive(href)
            
            // Determine special indicator badge or dot
            const isReports = label.toLowerCase().includes("report") && !label.toLowerCase().includes("patient")
            const isPatientReport = label.toLowerCase().includes("patient report") || label.toLowerCase().includes("analyze")
            const isPatients = label.toLowerCase() === "patients"
            const isModels = label.toLowerCase().includes("model")

            return (
              <Link
                key={href + step}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`group relative flex items-center justify-between px-3 py-2.5 rounded-[18px] transition-all duration-300 no-underline ${
                  isActive
                    ? "bg-gradient-to-r from-sky-500/35 via-cyan-500/25 to-teal-500/15 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)] text-white"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Square Glass Icon Box */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isActive
                      ? "bg-cyan-500/25 border border-cyan-300/40 text-cyan-200 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                      : isModels
                      ? "bg-cyan-950/40 border border-cyan-400/30 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                      : "bg-white/[0.05] border border-white/10 text-cyan-200/80 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/30 group-hover:text-cyan-200"
                  }`}>
                    {isModels ? (
                      <Brain size={18} className="text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                    ) : (
                      <Icon size={18} />
                    )}
                  </div>

                  {/* Nav Label */}
                  <span className={`text-[13.5px] truncate ${isActive ? "font-extrabold text-white" : "font-semibold text-slate-300 group-hover:text-white"}`}>
                    {label}
                  </span>
                </div>

                {/* Right Badge / Dots matching screenshot */}
                <div className="flex items-center">
                  {isReports ? (
                    // 3D Glossy Red Orb Badge with "2"
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-700 via-red-600 to-rose-400 border border-rose-300/60 text-white font-black text-[11px] shadow-[0_0_16px_rgba(239,68,68,0.85)] flex items-center justify-center ring-2 ring-red-950/40">
                      {badge || 2}
                    </div>
                  ) : isPatientReport ? (
                    // Glowing Turquoise Dot
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] opacity-80" />
                  ) : isPatients ? (
                    // Glowing Mint Teal Dot
                    <span className="w-2 h-2 rounded-full bg-teal-300 shadow-[0_0_8px_#5eead4] opacity-75" />
                  ) : isModels ? (
                    // Subtle Glowing Particle
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_6px_#67e8f9] opacity-70" />
                  ) : null}
                </div>
              </Link>
            )
          })}
        </div>

      </div>

      {/* BOTTOM USER PROFILE & LOGOUT SECTION */}
      <div className="p-4 relative z-10 flex flex-col gap-3">
        {/* User Card Capsule */}
        <div className="relative rounded-[22px] p-3 bg-gradient-to-r from-[#102d4a]/70 via-[#0c233a]/60 to-[#071726]/70 border border-cyan-400/25 backdrop-blur-xl shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* User Avatar with Neon Cyan Ring */}
            <div className="relative shrink-0">
              <img
                src={userAvatar}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
              />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-extrabold text-white truncate leading-tight">{userName}</div>
              <div className="text-[11px] font-semibold text-cyan-400 truncate leading-tight mt-0.5">{userRole}</div>
            </div>
          </div>

          {/* Frosted Glass Settings Gear Button */}
          <Link 
            href="/settings" 
            title="Settings" 
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-300 hover:text-white transition-all shrink-0 ml-2"
          >
            <Settings size={15} />
          </Link>

          {/* Decorative Sparkle */}
          <div className="absolute -bottom-1 -right-1 text-cyan-300/40 pointer-events-none">
            ✦
          </div>
        </div>

        {/* Minimalist Logout Link */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-1.5 text-[13px] font-bold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer bg-transparent border-0 self-start"
        >
          <LogOut size={16} />
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
