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
      className="w-[305px] flex-shrink-0 flex flex-col justify-between h-full relative z-20 bg-gradient-to-b from-[#0e3357] via-[#103d69] to-[#0a233c] text-white select-none overflow-hidden border-r border-cyan-400/30 shadow-[8px_0_36px_rgba(0,0,0,0.4)]"
    >
      {/* Luminous Ambient Glow in Background */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-cyan-400/25 via-sky-400/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-teal-400/20 blur-3xl rounded-full pointer-events-none" />

      {/* Neural Constellation SVG Background */}
      <div className="absolute inset-0 pointer-events-none opacity-50 z-0 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Constellation Lines */}
          <line x1="20" y1="40" x2="110" y2="90" stroke="#38bdf8" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.75" />
          <line x1="110" y1="90" x2="230" y2="60" stroke="#38bdf8" strokeWidth="0.9" opacity="0.7" />
          <line x1="230" y1="60" x2="270" y2="180" stroke="#38bdf8" strokeWidth="0.9" opacity="0.6" />
          <line x1="270" y1="180" x2="200" y2="280" stroke="#38bdf8" strokeWidth="0.9" opacity="0.6" />
          <line x1="200" y1="280" x2="80" y2="350" stroke="#38bdf8" strokeWidth="0.9" opacity="0.6" />
          <line x1="80" y1="350" x2="250" y2="480" stroke="#38bdf8" strokeWidth="0.9" opacity="0.7" />
          <line x1="250" y1="480" x2="170" y2="590" stroke="#38bdf8" strokeWidth="0.9" opacity="0.7" />
          <line x1="170" y1="590" x2="60" y2="700" stroke="#38bdf8" strokeWidth="0.9" opacity="0.75" />
          <line x1="60" y1="700" x2="230" y2="760" stroke="#38bdf8" strokeWidth="0.9" opacity="0.6" />
          <line x1="230" y1="760" x2="190" y2="860" stroke="#38bdf8" strokeWidth="0.9" opacity="0.7" />
          
          {/* Constellation Glowing Nodes */}
          <circle cx="20" cy="40" r="3" fill="#bae6fd" />
          <circle cx="110" cy="90" r="4.5" fill="#38bdf8" className="animate-pulse" />
          <circle cx="230" cy="60" r="3" fill="#bae6fd" />
          <circle cx="270" cy="180" r="3" fill="#38bdf8" />
          <circle cx="200" cy="280" r="4" fill="#38bdf8" />
          <circle cx="80" cy="350" r="3.5" fill="#bae6fd" />
          <circle cx="250" cy="480" r="4.5" fill="#38bdf8" className="animate-pulse" />
          <circle cx="170" cy="590" r="3.5" fill="#bae6fd" />
          <circle cx="60" cy="700" r="4" fill="#38bdf8" />
          <circle cx="230" cy="760" r="3.5" fill="#bae6fd" />
          <circle cx="190" cy="860" r="3" fill="#38bdf8" />
        </svg>
      </div>

      {/* MAIN CONTENT OF SIDEBAR */}
      <div className="relative z-10 flex flex-col flex-1 overflow-y-auto px-3.5 pt-6 pb-2">
        
        {/* BRAND HEADER WITH 3D CRYSTAL BRAIN */}
        <div className="px-2 mb-5">
          <Link href="/" className="flex items-center gap-3.5 no-underline group">
            {/* Low-Poly 3D Crystal Brain SVG */}
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <div className="absolute inset-0 bg-cyan-400/40 blur-lg rounded-full" />
              <svg viewBox="0 0 100 100" className="w-12 h-12 relative z-10 filter drop-shadow-[0_0_16px_rgba(56,189,248,0.9)] group-hover:scale-105 transition-transform duration-300">
                <defs>
                  <linearGradient id="crystal1_light" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#bae6fd" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                  <linearGradient id="crystal2_light" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0369a1" />
                  </linearGradient>
                  <linearGradient id="crystal3_light" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e0f2fe" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                  <linearGradient id="crystalEdge_light" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                {/* Left Hemisphere Facets */}
                <polygon points="46,18 28,28 36,44" fill="url(#crystal1_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="46,18 36,44 46,38" fill="url(#crystal3_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="28,28 14,46 32,54" fill="url(#crystal2_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="28,28 32,54 36,44" fill="url(#crystal1_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="36,44 32,54 46,60" fill="url(#crystal3_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="36,44 46,60 46,38" fill="url(#crystal2_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="14,46 22,68 34,70" fill="url(#crystal1_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="14,46 34,70 32,54" fill="url(#crystal3_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="32,54 34,70 46,78" fill="url(#crystal2_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="32,54 46,78 46,60" fill="url(#crystal1_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="34,70 42,88 46,78" fill="url(#crystal3_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />

                {/* Right Hemisphere Facets */}
                <polygon points="54,18 72,28 64,44" fill="url(#crystal3_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="54,18 64,44 54,38" fill="url(#crystal1_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="72,28 86,46 68,54" fill="url(#crystal2_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="72,28 68,54 64,44" fill="url(#crystal3_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="64,44 68,54 54,60" fill="url(#crystal1_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="64,44 54,60 54,38" fill="url(#crystal2_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="86,46 78,68 66,70" fill="url(#crystal3_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="86,46 66,70 68,54" fill="url(#crystal1_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="68,54 66,70 54,78" fill="url(#crystal2_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="68,54 54,78 54,60" fill="url(#crystal3_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
                <polygon points="66,70 58,88 54,78" fill="url(#crystal1_light)" stroke="url(#crystalEdge_light)" strokeWidth="0.9" />
              </svg>
            </div>

            {/* Brand Title */}
            <div className="flex flex-col">
              <span className="text-[23px] font-black tracking-wide text-white leading-none mb-1 drop-shadow-sm">ELVON</span>
              <span className="text-[11.5px] font-extrabold text-[#38bdf8] tracking-wider leading-none drop-shadow-sm">Clinical Intelligence</span>
            </div>
          </Link>
        </div>

        {/* FLOATING FROSTED GLASS CAPSULE CONTAINER (LIGHTER, LUMINOUS & HIGH CONTRAST) */}
        <div className="rounded-[26px] p-2.5 bg-gradient-to-b from-[#1b4b7a]/70 via-[#133c64]/60 to-[#0c2a47]/70 border border-cyan-300/40 backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.3),0_0_24px_rgba(34,211,238,0.2),inset_0_1px_2px_rgba(255,255,255,0.35)] flex flex-col gap-1.5">
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
                className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-[18px] transition-all duration-300 no-underline ${
                  isActive
                    ? "bg-gradient-to-r from-sky-400/50 via-cyan-400/40 to-teal-400/30 border-2 border-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.65),inset_0_1px_3px_rgba(255,255,255,0.75)] text-white ring-1 ring-cyan-300/60"
                    : "text-slate-100/90 hover:text-white hover:bg-white/20 border border-transparent hover:border-cyan-300/35 hover:shadow-[0_0_16px_rgba(6,182,212,0.3)]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Square Glass Icon Box */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isActive
                      ? "bg-cyan-400/50 border-2 border-cyan-100 text-white shadow-[0_0_18px_rgba(34,211,238,0.95)]"
                      : isModels
                      ? "bg-cyan-800/60 border border-cyan-300/50 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.45)]"
                      : "bg-white/15 border border-white/25 text-cyan-100 group-hover:bg-cyan-400/35 group-hover:border-cyan-200 group-hover:text-white group-hover:shadow-[0_0_16px_rgba(6,182,212,0.6)]"
                  }`}>
                    {isModels ? (
                      <Brain size={19} className="text-cyan-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.95)]" />
                    ) : (
                      <Icon size={19} />
                    )}
                  </div>

                  {/* Nav Label */}
                  <span className={`text-[13.5px] truncate tracking-tight ${isActive ? "font-black text-white drop-shadow-sm" : "font-bold text-slate-100 group-hover:text-white"}`}>
                    {label}
                  </span>
                </div>

                {/* Right Badge / Dots matching screenshot */}
                <div className="flex items-center shrink-0 ml-1">
                  {isReports ? (
                    // 3D Glossy Red Orb Badge with "2"
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-700 via-red-600 to-rose-400 border border-rose-200/90 text-white font-black text-[11px] shadow-[0_0_18px_rgba(239,68,68,0.95)] flex items-center justify-center ring-2 ring-red-950/40">
                      {badge || 2}
                    </div>
                  ) : isPatientReport ? (
                    // Glowing Turquoise Dot
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8] opacity-95 ring-1 ring-cyan-200/60" />
                  ) : isPatients ? (
                    // Glowing Mint Teal Dot
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-300 shadow-[0_0_12px_#2dd4bf] opacity-95 ring-1 ring-teal-200/60" />
                  ) : isModels ? (
                    // Glowing Particle
                    <span className="w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9] opacity-90 ring-1 ring-cyan-200/60" />
                  ) : null}
                </div>
              </Link>
            )
          })}
        </div>

      </div>

      {/* BOTTOM USER PROFILE & LOGOUT SECTION (LIGHTER FROSTED GLASS) */}
      <div className="p-3.5 relative z-10 flex flex-col gap-3">
        {/* User Card Capsule */}
        <div className="relative rounded-[22px] p-3 bg-gradient-to-r from-[#1b4b7a]/85 via-[#144169]/75 to-[#0e3050]/85 border border-cyan-300/40 backdrop-blur-2xl shadow-[0_8px_24px_rgba(0,0,0,0.3),0_0_18px_rgba(34,211,238,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* User Avatar with Neon Cyan Ring */}
            <div className="relative shrink-0">
              <img
                src={userAvatar}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.8)]"
              />
            </div>
            <div className="min-w-0">
              <div className="text-[13.5px] font-black text-white truncate leading-tight drop-shadow-sm">{userName}</div>
              <div className="text-[11px] font-bold text-cyan-300 truncate leading-tight mt-0.5">{userRole}</div>
            </div>
          </div>

          {/* Frosted Glass Settings Gear Button */}
          <Link 
            href="/settings" 
            title="Settings" 
            className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition-all shrink-0 ml-2 shadow-xs"
          >
            <Settings size={16} />
          </Link>

          {/* Decorative Sparkle */}
          <div className="absolute -bottom-1.5 -right-1.5 text-cyan-300/70 pointer-events-none text-sm drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]">
            ✦
          </div>
        </div>

        {/* Minimalist Logout Link */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-1.5 text-[13px] font-bold text-slate-200 hover:text-cyan-300 transition-colors cursor-pointer bg-transparent border-0 self-start"
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
