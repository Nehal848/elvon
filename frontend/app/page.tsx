"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"

/* ── Utility hooks ── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function Counter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0)
  const { ref, inView } = useInView(0.2)
  useEffect(() => {
    if (!inView) return
    let cur = 0
    const inc = end / (1400 / 16)
    const t = setInterval(() => {
      cur += inc
      if (cur >= end) { setVal(end); clearInterval(t) } else setVal(Math.floor(cur))
    }, 16)
    return () => clearInterval(t)
  }, [inView, end])
  return <span ref={ref as React.Ref<HTMLDivElement>}>{prefix}{val}{suffix}</span>
}

function FadeIn({ children, delay = 0, from = "bottom", className = "" }: {
  children: React.ReactNode; delay?: number; from?: string; className?: string
}) {
  const { ref, inView } = useInView()
  const initial = from === "left" ? "translateX(-32px)" : from === "right" ? "translateX(32px)" : from === "scale" ? "scale(0.92)" : "translateY(32px)"
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : initial,
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

function XAIRow({ name, pct, color, delay }: { name: string; pct: number; color: string; delay: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div className="xai-row" ref={ref as React.Ref<HTMLDivElement>}>
      <div className="xai-feat-name">{name}</div>
      <div className="xai-bar-wrap">
        <div className="xai-bar" style={{ width: inView ? `${pct}%` : "0%", background: `linear-gradient(90deg, ${color}, ${color}88)`, transitionDelay: `${delay}ms` }} />
        <div className="xai-bar-shimmer" style={{ animationDelay: `${delay + 800}ms`, opacity: inView ? 1 : 0 }} />
      </div>
      <div className="xai-val">{pct}%</div>
    </div>
  )
}

/* ── Animated Network Node ── */
function NetworkNode({ icon, label, x, y, size = 64, color, delay = 0 }: {
  icon: string; label: string; x: string; y: string; size?: number; color: string; delay?: number
}) {
  const { ref, inView } = useInView(0.05)
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className="net-node" style={{
      left: x, top: y, width: size, height: size,
      opacity: inView ? 1 : 0,
      transform: inView ? "scale(1)" : "scale(0.5)",
      transitionDelay: `${delay}ms`,
      "--node-color": color,
    } as React.CSSProperties}>
      <div className="net-node-glow" />
      <div className="net-node-inner">
        <span className="net-node-icon">{icon}</span>
      </div>
      <div className="net-node-label">{label}</div>
    </div>
  )
}

export default function LandingPage() {
  const [loaded, setLoaded] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [particles, setParticles] = useState<{ x: number; size: number; speed: number; opacity: number; delay: number }[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setLoaded(true)
    setParticles(Array.from({ length: 35 }, () => ({
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 20 + 12,
      opacity: Math.random() * 0.3 + 0.05,
      delay: Math.random() * 12,
    })))
    const onScroll = () => setScrolled(window.scrollY > 40)
    const onMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("mousemove", onMouse, { passive: true })
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMouse) }
  }, [])

  /* ── DATA ── */
  const problemCards = [
    { icon: "🧬", title: "Complex Biomedical Data", desc: "High-dimensional data from clinical, genomic, imaging and EHR sources contains subtle patterns that challenge standard approaches.", color: "#10b981" },
    { icon: "⚠️", title: "Noisy & Incomplete Data", desc: "Missing, irrelevant and inconsistent information critically affects model reliability, introducing bias and reducing generalization.", color: "#f59e0b" },
    { icon: "⚛️", title: "Quantum Limitations Today", desc: "Limited qubits, noise and hardware constraints make fully quantum solutions impractical. Hybrid approaches bridge this gap.", color: "#8b5cf6" },
    { icon: "🔍", title: "Lack of Model Understanding", desc: "Predictions without meaningful explanations reduce clinical trust. Explainability is essential for AI-assisted medical decision support.", color: "#ec4899" },
  ]

  const featureCards = [
    { icon: "🧬", title: "Biomedical Data Optimization", desc: "Upload, validate, preprocess, engineer and optimize biomedical features with automated quality checks and leakage detection.", gradient: "linear-gradient(135deg, #10b981, #059669)" },
    { icon: "🤖", title: "Classical ML + Hybrid QML", desc: "Compare LR, SVM, RF, XGB with Quantum Kernel, QSVM, VQC and QNN approaches on identical data splits.", gradient: "linear-gradient(135deg, #6366f1, #4f46e5)" },
    { icon: "⚛️", title: "Quantum-Ready Architecture", desc: "Run experiments on ideal/noisy simulators. Compatible with near-term NISQ quantum hardware profiles including IBM Falcon.", gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
    { icon: "📊", title: "Benchmark-Driven Evaluation", desc: "Compare accuracy, sensitivity, specificity, F1, ROC-AUC, and quantum resource cost in a single experimental run.", gradient: "linear-gradient(135deg, #06b6d4, #0891b2)" },
    { icon: "💡", title: "Explainable Predictions", desc: "SHAP for classical models; perturbation/sensitivity-based explanations for QML. Interpretable for any user.", gradient: "linear-gradient(135deg, #ec4899, #db2777)" },
    { icon: "🔐", title: "Secure & Reproducible", desc: "Leakage-safe data auditing, experiment tracking, versioning and full result auditability for reproducible research.", gradient: "linear-gradient(135deg, #f59e0b, #d97706)" },
  ]

  const hiwSteps = [
    { n: "01", icon: "📁", title: "Upload Dataset", desc: "Select and upload a biomedical dataset. Automated schema audit, missing-value detection and class-balance check.", color: "#10b981" },
    { n: "02", icon: "🧹", title: "Prepare Data", desc: "Clean · Impute · Scale · Feature-select · Apply PCA. All with leakage-safe train/validation/test splits.", color: "#06b6d4" },
    { n: "03", icon: "⚗️", title: "Train Models", desc: "Classical ML and Hybrid QML trained in parallel on identical splits. Configure backends and qubits.", color: "#6366f1" },
    { n: "04", icon: "🔍", title: "Predict", desc: "Disease risk classifications with confidence scores. Clearly labeled as model predictions, not clinical diagnosis.", color: "#f59e0b" },
    { n: "05", icon: "💡", title: "Explain", desc: "Feature importance (classical) and perturbation/sensitivity analysis (quantum). Interpretable for any user.", color: "#ec4899" },
    { n: "06", icon: "📊", title: "Benchmark", desc: "Side-by-side performance and quantum resource metrics. Export full results as JSON for reproducibility.", color: "#8b5cf6" },
  ]

  const benchRows = [
    { name: "Logistic Regression", q: false, acc: 94, rec: 92, f1: 93, roc: 96 },
    { name: "SVM (RBF)", q: false, acc: 95, rec: 93, f1: 94, roc: 97 },
    { name: "Random Forest", q: false, acc: 96, rec: 94, f1: 95, roc: 98, best: true },
    { name: "Quantum Kernel (QSVM)", q: true, acc: 95, rec: 94, f1: 94, roc: 97 },
    { name: "VQC", q: true, acc: 93, rec: 91, f1: 92, roc: 95 },
  ]

  const appCards = [
    { icon: "🩺", title: "Clinical Data", desc: "Patient and laboratory features — standard tabular biomedical datasets.", future: false },
    { icon: "🧬", title: "Genomics", desc: "Genetic and molecular data — high-dimensional feature compression via PCA.", future: false },
    { icon: "🧠", title: "Neurological", desc: "Disease-related biomarkers — Parkinson's and other neurodegenerative patterns.", future: false },
    { icon: "🫀", title: "Cardiovascular", desc: "Risk-related clinical features — early cardiovascular disease detection.", future: false },
    { icon: "🩻", title: "Medical Imaging", desc: "Future extension — imaging-derived feature support for deeper integration.", future: true },
  ]

  const xaiRows = [
    { name: "Radius Mean", pct: 88, color: "#6366f1" },
    { name: "Perimeter Mean", pct: 72, color: "#8b5cf6" },
    { name: "Area Mean", pct: 64, color: "#06b6d4" },
    { name: "Concavity", pct: 48, color: "#10b981" },
    { name: "Texture Mean", pct: 36, color: "#f59e0b" },
    { name: "Smoothness", pct: 22, color: "#ec4899" },
  ]

  const impactCards = [
    { icon: "🔬", title: "Early Detection Research", desc: "Explore and benchmark models for identifying disease-related patterns earlier, contributing to the evidence base for AI-assisted screening.", bg: "rgba(16,185,129,0.1)", color: "#10b981" },
    { icon: "🧪", title: "Accessible QML Research", desc: "Make quantum ML experimentation easier and more accessible for biomedical researchers without requiring deep quantum physics expertise.", bg: "rgba(99,102,241,0.1)", color: "#6366f1" },
    { icon: "📐", title: "Evidence-Based AI", desc: "Measure performance rather than assuming quantum superiority. Build an honest, rigorous scientific foundation for quantum biomedical AI.", bg: "rgba(6,182,212,0.1)", color: "#06b6d4" },
    { icon: "🚀", title: "Future Healthcare Innovation", desc: "Create a bridge between biomedical AI research and emerging quantum technologies — positioning for real quantum hardware as it matures.", bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
  ]

  const CSS_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #052436; --bg2: #071f30; --surf: #0a2d42; --surf2: #0e3b54; --surf3: #124867;
      --border: rgba(14,165,233,0.15); --border2: rgba(14,165,233,0.3); --border3: rgba(14,165,233,0.45);
      --accent: #0ea5e9; --accent2: #06b6d4; --cyan: #00d2ff; --green: #10b981; --gold: #f59e0b; --pink: #ec4899;
      --text: #f0f6fa; --text2: #bae6fd; --text3: #38bdf8;
      --r: 16px; --shadow: 0 8px 40px rgba(14,165,233,0.15); --glow: 0 0 80px rgba(14,165,233,0.2);
    }
    html { scroll-behavior: smooth; }
    body { background: var(--bg); color: var(--text); font-family: Inter, -apple-system, sans-serif; line-height: 1.6; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.35); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.6); }

    /* ── GRADIENTS & UTILITIES ── */
    .grad { background: linear-gradient(135deg, #818cf8, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .grad-warm { background: linear-gradient(135deg, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

    /* ── GRID PATTERN BG ── */
    .grid-bg { position: absolute; inset: 0; background-image:
      linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px);
      background-size: 60px 60px; pointer-events: none; mask-image: radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent); }

    /* ── NAVBAR ── */
    .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 200; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 68px; transition: all .4s cubic-bezier(0.16,1,0.3,1); }
    .navbar.scrolled { background: rgba(5,36,54,0.85); backdrop-filter: blur(24px) saturate(1.4); border-bottom: 1px solid var(--border2); box-shadow: 0 4px 40px rgba(0,0,0,0.2); }
    .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--text); }
    .nav-logo-icon { width: 38px; height: 38px; border-radius: 11px; background: linear-gradient(135deg, var(--accent), var(--cyan)); display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 4px 20px rgba(99,102,241,0.4); transition: all .3s; }
    .nav-logo:hover .nav-logo-icon { box-shadow: 0 6px 28px rgba(99,102,241,0.6); transform: scale(1.05); }
    .nav-logo-text { font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 18px; letter-spacing: -.3px; }
    .nav-links { display: flex; align-items: center; gap: 4px; }
    .nav-link { color: var(--text2); text-decoration: none; font-size: 13.5px; font-weight: 500; padding: 7px 16px; border-radius: 9px; transition: all .25s; position: relative; }
    .nav-link:hover { color: var(--text); background: rgba(99,102,241,0.08); }
    .nav-link::after { content: ''; position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%) scaleX(0); width: 20px; height: 2px; background: var(--accent); border-radius: 1px; transition: transform .25s; }
    .nav-link:hover::after { transform: translateX(-50%) scaleX(1); }
    .nav-actions { display: flex; align-items: center; gap: 12px; }
    .btn-nav-outline { color: var(--text); text-decoration: none; font-size: 13.5px; font-weight: 600; padding: 8px 20px; border-radius: 10px; border: 1.5px solid var(--border2); transition: all .25s; }
    .btn-nav-outline:hover { border-color: var(--accent); background: rgba(99,102,241,0.08); color: white; }
    .btn-nav-primary { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white; text-decoration: none; font-size: 13.5px; font-weight: 700; padding: 9px 22px; border-radius: 10px; box-shadow: 0 4px 20px rgba(99,102,241,0.4); transition: all .25s; position: relative; overflow: hidden; }
    .btn-nav-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, transparent, rgba(255,255,255,0.1), transparent); transform: translateX(-100%); transition: transform .5s; }
    .btn-nav-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(99,102,241,0.55); }
    .btn-nav-primary:hover::before { transform: translateX(100%); }

    /* ── HERO ── */
    .hero { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 48px; padding: 110px 80px 40px; position: relative; overflow: hidden; max-width: 1440px; margin: 0 auto; }
    .hero-orb { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; animation: orb-drift 12s ease-in-out infinite alternate; }
    .hero-orb-1 { width: 700px; height: 700px; background: rgba(99,102,241,0.08); top: -200px; left: -200px; }
    .hero-orb-2 { width: 500px; height: 500px; background: rgba(6,182,212,0.06); bottom: -100px; right: -50px; animation-delay: -4s; }
    .hero-orb-3 { width: 350px; height: 350px; background: rgba(139,92,246,0.1); top: 30%; right: 20%; animation-delay: -8s; }
    @keyframes orb-drift { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(30px, -20px) scale(1.05); } }
    .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.22); color: #a5b4fc; font-size: 11px; font-weight: 700; padding: 7px 18px; border-radius: 24px; margin-bottom: 28px; letter-spacing: .8px; text-transform: uppercase; animation: badge-float 4s ease-in-out infinite; }
    @keyframes badge-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
    .hero-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(38px, 5.5vw, 68px); font-weight: 800; letter-spacing: -2.5px; line-height: 1.04; margin-bottom: 22px; color: var(--text); }
    .hero-sub { font-size: 17px; color: var(--text2); max-width: 540px; margin-bottom: 40px; line-height: 1.8; font-weight: 400; }
    .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 48px; }
    .btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white; font-weight: 700; font-size: 15px; padding: 15px 32px; border-radius: 13px; text-decoration: none; transition: all .3s cubic-bezier(0.16,1,0.3,1); box-shadow: 0 4px 24px rgba(99,102,241,0.35); display: inline-flex; align-items: center; gap: 8px; position: relative; overflow: hidden; }
    .btn-primary::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%); transform: translateX(-100%); transition: transform .6s; }
    .btn-primary:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 12px 44px rgba(99,102,241,0.5); }
    .btn-primary:hover::after { transform: translateX(100%); }
    .btn-secondary { background: rgba(99,102,241,0.06); border: 1.5px solid var(--border2); color: var(--text); font-weight: 600; font-size: 15px; padding: 15px 30px; border-radius: 13px; text-decoration: none; transition: all .3s; display: inline-flex; align-items: center; gap: 8px; }
    .btn-secondary:hover { border-color: var(--accent); background: rgba(99,102,241,0.1); transform: translateY(-2px); }
    .hero-trust { display: flex; align-items: center; gap: 24px; font-size: 12.5px; color: var(--text3); flex-wrap: wrap; }
    .hero-trust-item { display: flex; align-items: center; gap: 7px; }
    .hero-trust-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); box-shadow: 0 0 10px rgba(16,185,129,0.7); animation: pulse-dot 2.5s ease-in-out infinite; }
    @keyframes pulse-dot { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }

    /* ── HERO NETWORK VISUAL ── */
    .hero-visual { position: relative; z-index: 10; width: 100%; max-width: 480px; margin: 0 auto; }
    .net-container { position: relative; width: 100%; aspect-ratio: 1; }
    .net-bg { position: absolute; inset: -20px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%); animation: net-bg-pulse 6s ease-in-out infinite; }
    @keyframes net-bg-pulse { 0%,100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.03); } }
    .net-node { position: absolute; transform-origin: center; transition: all .7s cubic-bezier(0.16,1,0.3,1); z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .net-node-glow { position: absolute; inset: -8px; border-radius: 50%; background: radial-gradient(circle, var(--node-color, var(--accent)), transparent 70%); opacity: 0.25; animation: node-glow 3s ease-in-out infinite; filter: blur(8px); }
    @keyframes node-glow { 0%,100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.15); } }
    .net-node-inner { width: 100%; height: 100%; border-radius: 50%; background: var(--surf2); border: 1.5px solid var(--node-color, var(--accent)); display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; box-shadow: 0 0 20px color-mix(in srgb, var(--node-color, var(--accent)) 30%, transparent); transition: all .3s; }
    .net-node:hover .net-node-inner { transform: scale(1.1); box-shadow: 0 0 30px color-mix(in srgb, var(--node-color, var(--accent)) 50%, transparent); }
    .net-node-icon { font-size: 22px; }
    .net-node-label { font-size: 10px; font-weight: 700; color: var(--text2); text-transform: uppercase; letter-spacing: .5px; white-space: nowrap; text-align: center; }

    /* Network connection lines */
    .net-lines { position: absolute; inset: 0; z-index: 1; }
    .net-lines svg { width: 100%; height: 100%; }
    .net-line { stroke: rgba(99,102,241,0.15); stroke-width: 1.5; fill: none; }
    .net-line-glow { stroke: var(--accent); stroke-width: 2; fill: none; opacity: 0.5; filter: blur(2px); }
    .net-pulse { fill: var(--accent); opacity: 0.8; filter: blur(1px); }

    /* ── STATS STRIP ── */
    .stats-strip-wrap { padding: 0 80px 60px; max-width: 1440px; margin: 0 auto; }
    .stats-strip { display: grid; grid-template-columns: repeat(4, 1fr); background: var(--surf); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; position: relative; }
    .stats-strip::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(99,102,241,0.03), transparent 50%, rgba(6,182,212,0.03)); pointer-events: none; }
    .stat-item { text-align: center; padding: 28px 16px; border-right: 1px solid var(--border); position: relative; transition: background .3s; }
    .stat-item:last-child { border-right: none; }
    .stat-item:hover { background: rgba(99,102,241,0.04); }
    .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 34px; font-weight: 800; letter-spacing: -1px; background: linear-gradient(135deg, #818cf8, var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .stat-label { font-size: 11px; color: var(--text3); margin-top: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: .8px; }

    /* ── SECTION LAYOUT ── */
    .section-outer { padding: 100px 80px; position: relative; z-index: 1; }
    .section-outer.alt { background: linear-gradient(180deg, rgba(7,31,48,0.8), rgba(5,36,54,0.9)); }
    .section-inner { max-width: 1200px; margin: 0 auto; }
    .section-chip { display: inline-flex; align-items: center; gap: 7px; background: rgba(99,102,241,0.07); border: 1px solid rgba(99,102,241,0.18); color: #a5b4fc; font-size: 11px; font-weight: 700; padding: 6px 16px; border-radius: 24px; margin-bottom: 18px; letter-spacing: .8px; text-transform: uppercase; }
    .section-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(30px, 4vw, 48px); font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 18px; }
    .section-sub { font-size: 17px; color: var(--text2); max-width: 620px; line-height: 1.8; margin-bottom: 56px; }

    /* ── PROBLEM CARDS ── */
    .problem-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; }
    .problem-card { background: rgba(10,14,28,0.7); backdrop-filter: blur(12px); border: 1px solid var(--border); border-radius: 20px; padding: 30px; transition: all .35s cubic-bezier(0.16,1,0.3,1); position: relative; overflow: hidden; }
    .problem-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--card-accent, var(--accent)); opacity: 0; transition: opacity .3s; }
    .problem-card:hover { border-color: var(--border2); transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0,0,0,0.3), var(--glow); }
    .problem-card:hover::before { opacity: 1; }
    .problem-icon { font-size: 38px; margin-bottom: 18px; line-height: 1; display: block; }
    .problem-title { font-size: 16px; font-weight: 700; margin-bottom: 10px; }
    .problem-desc { font-size: 13.5px; color: var(--text2); line-height: 1.75; }

    /* ── SOLUTION ── */
    .solution-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
    .solution-flow { display: flex; flex-direction: column; gap: 0; background: var(--surf); border: 1px solid var(--border); border-radius: 22px; padding: 28px; overflow: hidden; position: relative; }
    .solution-flow::before { content: ''; position: absolute; top: 0; left: 50%; width: 1px; height: 100%; background: linear-gradient(to bottom, transparent, var(--border2), var(--accent), var(--border2), transparent); opacity: 0.5; }
    .sol-step { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid rgba(99,102,241,0.06); position: relative; transition: all .3s; }
    .sol-step:last-child { border-bottom: none; }
    .sol-step:hover { padding-left: 8px; }
    .sol-step-icon { width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 17px; transition: all .3s; }
    .sol-step:hover .sol-step-icon { transform: scale(1.1); }
    .sol-step-text { font-size: 13px; font-weight: 600; color: var(--text2); flex: 1; }
    .sol-step-arrow { color: var(--text3); font-size: 11px; opacity: 0.5; }
    .sol-highlight { background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06)); border: 1px solid rgba(139,92,246,0.2); border-radius: 14px; padding: 16px; margin: 10px 0; text-align: center; position: relative; overflow: hidden; }
    .sol-highlight::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(99,102,241,0.05), transparent); animation: sol-scan 4s ease-in-out infinite; }
    @keyframes sol-scan { 0%,100% { transform: translateX(-100%); } 50% { transform: translateX(100%); } }
    .sol-highlight-text { font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: var(--accent2); position: relative; z-index: 1; }

    /* ── FEATURE CARDS ── */
    .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 18px; }
    .feature-card { background: var(--surf); border: 1px solid var(--border); border-radius: 20px; padding: 30px; transition: all .35s cubic-bezier(0.16,1,0.3,1); position: relative; overflow: hidden; }
    .feature-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--feat-gradient); border-radius: 20px 20px 0 0; opacity: 0.7; }
    .feature-card:hover { border-color: var(--border2); transform: translateY(-5px); box-shadow: var(--shadow); }
    .feature-icon-wrap { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 18px; background: rgba(99,102,241,0.08); position: relative; }
    .feature-icon-wrap::after { content: ''; position: absolute; inset: -4px; border-radius: 18px; background: var(--feat-gradient); opacity: 0.12; filter: blur(8px); }
    .feature-title { font-size: 16px; font-weight: 700; margin-bottom: 10px; color: var(--text); }
    .feature-desc { font-size: 13.5px; color: var(--text2); line-height: 1.75; }

    /* ── HOW IT WORKS — VERTICAL TIMELINE ── */
    .hiw-timeline { position: relative; padding: 0 0 20px; }
    .hiw-timeline-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, transparent, var(--border2) 10%, var(--accent) 50%, var(--border2) 90%, transparent); transform: translateX(-50%); }
    .hiw-timeline-line::after { content: ''; position: absolute; left: -1px; top: 0; width: 4px; height: 100%; background: linear-gradient(to bottom, transparent, rgba(99,102,241,0.3), transparent); animation: line-pulse 4s ease-in-out infinite; filter: blur(2px); }
    @keyframes line-pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
    .hiw-item { display: grid; grid-template-columns: 1fr auto 1fr; gap: 32px; align-items: center; margin-bottom: 48px; position: relative; }
    .hiw-item:last-child { margin-bottom: 0; }
    .hiw-item-content { background: var(--surf); border: 1px solid var(--border); border-radius: 18px; padding: 28px; transition: all .35s; }
    .hiw-item-content:hover { border-color: var(--border2); transform: translateY(-3px); box-shadow: var(--shadow); }
    .hiw-item-left .hiw-item-content { text-align: right; }
    .hiw-item-right .hiw-item-content { text-align: left; }
    .hiw-item-left .hiw-item-placeholder { order: 3; }
    .hiw-item-left .hiw-badge-col { order: 2; }
    .hiw-item-left .hiw-item-content { order: 1; }
    .hiw-item-right .hiw-item-placeholder { order: 1; }
    .hiw-item-right .hiw-badge-col { order: 2; }
    .hiw-item-right .hiw-item-content { order: 3; }
    .hiw-badge-col { display: flex; align-items: center; justify-content: center; }
    .hiw-badge { width: 54px; height: 54px; border-radius: 50%; background: var(--surf2); border: 2.5px solid var(--border3); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: var(--accent); font-family: 'JetBrains Mono', monospace; z-index: 3; position: relative; transition: all .4s; box-shadow: 0 0 20px rgba(99,102,241,0.15); }
    .hiw-badge::after { content: ''; position: absolute; inset: -6px; border-radius: 50%; border: 1px solid rgba(99,102,241,0.15); animation: badge-ring 3s ease-in-out infinite; }
    @keyframes badge-ring { 0%,100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.15); opacity: 0; } }
    .hiw-item:hover .hiw-badge { background: var(--accent); color: white; border-color: var(--accent); box-shadow: 0 0 30px rgba(99,102,241,0.5); }
    .hiw-step-icon { font-size: 28px; margin-bottom: 10px; display: block; }
    .hiw-step-title { font-size: 15px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
    .hiw-step-desc { font-size: 12.5px; color: var(--text3); line-height: 1.7; }
    .hiw-item-placeholder { }

    /* ── CLASSICAL vs QML SPLIT ── */
    .quantum-split { display: grid; grid-template-columns: 1fr 100px 1fr; gap: 0; align-items: stretch; border-radius: 22px; overflow: hidden; }
    .quantum-col { background: var(--surf); border: 1px solid var(--border); padding: 34px; }
    .quantum-col-left { border-radius: 22px 0 0 22px; border-right: none; }
    .quantum-col-right { border-radius: 0 22px 22px 0; border-left: none; border-color: rgba(139,92,246,0.2); }
    .quantum-center { display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(180deg, rgba(99,102,241,0.06), rgba(139,92,246,0.1)); border-top: 1px solid var(--border2); border-bottom: 1px solid var(--border2); position: relative; overflow: hidden; }
    .quantum-center::before { content: ''; position: absolute; inset: 0; background: linear-gradient(0deg, transparent, rgba(99,102,241,0.08), transparent); animation: qc-breathe 4s ease-in-out infinite; }
    @keyframes qc-breathe { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
    .quantum-center-text { font-family: 'Space Grotesk', sans-serif; font-size: 9px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; writing-mode: vertical-rl; background: linear-gradient(135deg, var(--accent), var(--accent2), var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; position: relative; z-index: 1; }
    .quantum-col-label { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 22px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
    .quantum-item { display: flex; align-items: center; gap: 10px; padding: 11px 0; border-bottom: 1px solid rgba(99,102,241,0.05); font-size: 13.5px; color: var(--text2); font-weight: 500; transition: all .25s; }
    .quantum-item:last-child { border-bottom: none; }
    .quantum-item:hover { color: var(--text); padding-left: 6px; }
    .quantum-quote { margin-top: 36px; text-align: center; background: var(--surf); border: 1px solid rgba(99,102,241,0.15); border-radius: 18px; padding: 32px 40px; font-size: 16px; color: var(--text2); line-height: 1.8; font-style: italic; position: relative; }
    .quantum-quote::before { content: '"'; position: absolute; top: 12px; left: 24px; font-size: 48px; color: rgba(99,102,241,0.15); font-family: Georgia, serif; }
    .quantum-quote strong { color: var(--text); font-style: normal; }

    /* ── BENCHMARK ── */
    .bench-visual { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
    .bench-visual-card { background: var(--surf); border: 1px solid var(--border); border-radius: 18px; padding: 24px; text-align: center; }
    .bench-visual-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: var(--text3); margin-bottom: 12px; }
    .bench-visual-bars { display: flex; gap: 8px; justify-content: center; align-items: flex-end; height: 80px; }
    .bench-bar { width: 20px; border-radius: 6px 6px 0 0; transition: height 1.2s cubic-bezier(0.16,1,0.3,1); position: relative; }
    .bench-bar-label { position: absolute; top: -18px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 700; color: var(--text2); white-space: nowrap; }
    .bench-table { width: 100%; border-collapse: separate; border-spacing: 0; background: var(--surf); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; }
    .bench-table th { padding: 16px 20px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text3); background: var(--surf2); border-bottom: 1px solid var(--border); }
    .bench-table td { padding: 14px 20px; font-size: 13.5px; color: var(--text2); font-weight: 500; }
    .bench-table tr { border-bottom: 1px solid rgba(99,102,241,0.05); transition: background .2s; }
    .bench-table tr:hover td { background: rgba(99,102,241,0.03); }
    .bench-model { font-weight: 700; color: var(--text); }
    .bench-badge-q { font-size: 10px; font-weight: 700; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.22); color: var(--accent); padding: 3px 9px; border-radius: 7px; margin-left: 6px; }
    .bench-badge-c { font-size: 10px; font-weight: 700; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.18); color: var(--green); padding: 3px 9px; border-radius: 7px; margin-left: 6px; }
    .bench-metric { font-weight: 700; color: var(--text); font-family: 'JetBrains Mono', monospace; font-size: 13px; }
    .bench-metric.best { color: var(--cyan); }
    .bench-bottom { font-size: 13.5px; color: var(--text3); line-height: 1.75; margin-top: 24px; text-align: center; font-style: italic; }

    /* ── APPLICATIONS ── */
    .apps-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 18px; }
    .app-card { background: var(--surf); border: 1px solid var(--border); border-radius: 20px; padding: 32px 20px; text-align: center; transition: all .35s; position: relative; overflow: hidden; }
    .app-card:hover { border-color: var(--border2); transform: translateY(-5px); box-shadow: var(--shadow); }
    .app-icon-wrap { width: 72px; height: 72px; border-radius: 50%; background: rgba(99,102,241,0.06); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; font-size: 32px; transition: all .4s; }
    .app-card:hover .app-icon-wrap { border-color: var(--border2); box-shadow: 0 0 24px rgba(99,102,241,0.15); transform: scale(1.05); }
    .app-title { font-size: 14px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
    .app-desc { font-size: 12px; color: var(--text3); line-height: 1.65; }
    .app-future { font-size: 10px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; color: var(--gold); background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.18); padding: 4px 10px; border-radius: 7px; margin-top: 12px; display: inline-block; animation: future-pulse 3s ease-in-out infinite; }
    @keyframes future-pulse { 0%,100% { box-shadow: 0 0 0 rgba(245,158,11,0); } 50% { box-shadow: 0 0 12px rgba(245,158,11,0.15); } }

    /* ── XAI ── */
    .xai-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
    .xai-viz { background: var(--surf); border: 1px solid var(--border); border-radius: 22px; padding: 34px; position: relative; overflow: hidden; }
    .xai-viz::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4, #10b981, #f59e0b, #ec4899); }
    .xai-title-sm { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text3); margin-bottom: 24px; }
    .xai-row { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
    .xai-feat-name { font-size: 12.5px; font-weight: 600; color: var(--text2); width: 120px; flex-shrink: 0; }
    .xai-bar-wrap { flex: 1; height: 10px; background: rgba(255,255,255,0.04); border-radius: 5px; overflow: hidden; position: relative; }
    .xai-bar { height: 100%; border-radius: 5px; transition: width 1.4s cubic-bezier(0.16,1,0.3,1); position: relative; }
    .xai-bar-shimmer { position: absolute; inset: 0; background: linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%); animation: bar-shimmer 2.5s ease-in-out infinite; transition: opacity .5s; }
    @keyframes bar-shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
    .xai-val { font-size: 11px; font-weight: 700; color: var(--text3); width: 36px; text-align: right; flex-shrink: 0; font-family: 'JetBrains Mono', monospace; }

    /* ── QUANTUM RESOURCES ── */
    .qres-section { position: relative; overflow: hidden; }
    .qres-circuit-bg { position: absolute; inset: 0; opacity: 0.03; background-image:
      linear-gradient(0deg, var(--accent) 1px, transparent 1px),
      linear-gradient(90deg, var(--accent) 1px, transparent 1px);
      background-size: 40px 40px; pointer-events: none; mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent); }
    .qres-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)); gap: 16px; }
    .qres-card { background: rgba(10,14,28,0.6); backdrop-filter: blur(10px); border: 1px solid rgba(99,102,241,0.15); border-radius: 18px; padding: 30px 20px; text-align: center; transition: all .35s; position: relative; overflow: hidden; }
    .qres-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%); opacity: 0; transition: opacity .3s; }
    .qres-card:hover { border-color: rgba(99,102,241,0.35); transform: translateY(-4px); box-shadow: 0 8px 32px rgba(99,102,241,0.12); }
    .qres-card:hover::before { opacity: 1; }
    .qres-value { font-family: 'JetBrains Mono', monospace; font-size: 36px; font-weight: 700; background: linear-gradient(135deg, #818cf8, var(--cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; display: block; letter-spacing: -1px; position: relative; z-index: 1; }
    .qres-label { font-size: 12px; color: var(--text3); font-weight: 600; text-transform: uppercase; letter-spacing: .6px; position: relative; z-index: 1; }
    .qres-demo-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; color: var(--gold); background: rgba(245,158,11,0.07); border: 1px solid rgba(245,158,11,0.18); padding: 6px 14px; border-radius: 9px; margin-bottom: 32px; }

    /* ── RESEARCH ── */
    .research-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
    .research-card { background: var(--surf); border: 1px solid var(--border); border-radius: 20px; padding: 34px; transition: all .35s; position: relative; overflow: hidden; }
    .research-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(99,102,241,0.03), transparent); opacity: 0; transition: opacity .3s; }
    .research-card:hover { border-color: var(--border2); transform: translateY(-5px); box-shadow: var(--shadow); }
    .research-card:hover::before { opacity: 1; }
    .research-icon { font-size: 34px; margin-bottom: 18px; display: block; }
    .research-title { font-size: 17px; font-weight: 700; margin-bottom: 10px; color: var(--text); }
    .research-desc { font-size: 13.5px; color: var(--text2); line-height: 1.75; }

    /* ── IMPACT ── */
    .impact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
    .impact-card { background: var(--surf); border: 1px solid var(--border); border-radius: 20px; padding: 28px; transition: all .35s; display: flex; gap: 18px; align-items: flex-start; }
    .impact-card:hover { border-color: var(--border2); transform: translateY(-3px); box-shadow: var(--shadow); }
    .impact-icon-wrap { width: 48px; height: 48px; border-radius: 14px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 22px; transition: all .3s; }
    .impact-card:hover .impact-icon-wrap { transform: scale(1.1); }
    .impact-title { font-size: 15px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
    .impact-desc { font-size: 13px; color: var(--text2); line-height: 1.75; }

    /* ── CTA ── */
    .cta-section { text-align: center; padding: 120px 48px; background: radial-gradient(ellipse 80% 70% at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 70%); position: relative; z-index: 1; }
    .cta-box { max-width: 720px; margin: 0 auto; background: var(--surf); border: 1px solid rgba(99,102,241,0.18); border-radius: 28px; padding: 72px 56px; position: relative; overflow: hidden; }
    .cta-box::before { content: ''; position: absolute; inset: -1px; border-radius: 28px; padding: 1px; background: linear-gradient(135deg, var(--accent), var(--accent2), var(--cyan), var(--accent)); background-size: 300% 300%; animation: gradient-rotate 6s linear infinite; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0.4; pointer-events: none; }
    @keyframes gradient-rotate { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    .cta-box::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 50%); pointer-events: none; }
    .cta-tagline { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--cyan); font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 22px; position: relative; z-index: 1; }
    .cta-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(30px, 4vw, 50px); font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 22px; position: relative; z-index: 1; }
    .cta-desc { font-size: 16px; color: var(--text2); margin-bottom: 40px; line-height: 1.8; position: relative; z-index: 1; }
    .cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 28px; position: relative; z-index: 1; }
    .cta-disclaimer { font-size: 12px; color: var(--text3); max-width: 480px; margin: 0 auto; line-height: 1.75; border-top: 1px solid var(--border); padding-top: 22px; position: relative; z-index: 1; }

    /* ── FOOTER ── */
    footer { border-top: 1px solid var(--border); background: var(--bg2); padding: 44px 80px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 24px; position: relative; z-index: 1; }
    .footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .footer-logo-name { font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 16px; color: var(--text); }
    .footer-sub { font-size: 12.5px; color: var(--text3); line-height: 1.75; max-width: 500px; }
    .footer-links { display: flex; gap: 24px; }
    .footer-link { color: var(--text3); text-decoration: none; font-size: 13px; font-weight: 500; transition: color .25s; }
    .footer-link:hover { color: var(--text2); }

    /* ── PARTICLES ── */
    .particle { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; background: radial-gradient(circle, rgba(99,102,241,0.5), transparent); animation: drift linear infinite; }
    @keyframes drift { 0% { transform: translateY(0); } 100% { transform: translateY(-100vh); } }

    /* ── RESPONSIVE ── */
    @media (max-width: 1024px) {
      .navbar { padding: 0 24px; } .nav-links { display: none; }
      .hero { grid-template-columns: 1fr; padding: 100px 24px 50px; gap: 48px; }
      .hero-visual { order: -1; max-width: 320px; }
      .solution-layout { grid-template-columns: 1fr; }
      .xai-layout { grid-template-columns: 1fr; }
      .quantum-split { grid-template-columns: 1fr; } .quantum-col-left { border-radius: 22px 22px 0 0; border-right: 1px solid var(--border); border-bottom: none; } .quantum-col-right { border-radius: 0 0 22px 22px; border-left: 1px solid rgba(139,92,246,0.2); } .quantum-center { display: none; }
      .hiw-timeline-line { left: 28px; }
      .hiw-item { grid-template-columns: auto 1fr; gap: 20px; }
      .hiw-item-placeholder { display: none; }
      .hiw-item-left .hiw-item-content, .hiw-item-right .hiw-item-content { order: 2; text-align: left; }
      .hiw-item-left .hiw-badge-col, .hiw-item-right .hiw-badge-col { order: 1; }
      .bench-visual { grid-template-columns: 1fr; }
      .stats-strip { grid-template-columns: repeat(2, 1fr); }
      .research-grid { grid-template-columns: 1fr; }
      .impact-grid { grid-template-columns: 1fr; }
      .section-outer { padding: 72px 24px; }
      footer { grid-template-columns: 1fr; padding: 32px 24px; }
      .cta-box { padding: 48px 28px; }
      .stats-strip-wrap { padding: 0 24px 50px; }
      .features-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
      .apps-grid { grid-template-columns: repeat(2, 1fr); }
      .qres-grid { grid-template-columns: repeat(2, 1fr); }
      .hiw-badge { width: 44px; height: 44px; font-size: 12px; }
    }
  `

  return (
    <>
      <style>{CSS_STYLES}</style>

      {/* ── Background particles ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        {particles.map((p, i) => (
          <div key={i} className="particle" style={{ left: `${p.x}%`, bottom: 0, width: p.size, height: p.size, opacity: p.opacity, animationDuration: `${p.speed}s`, animationDelay: `${p.delay}s` }} />
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── 1. NAVBAR ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`} id="home">
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">🧠</div>
          <span className="nav-logo-text">ELVON <span className="grad">Clinical AI</span></span>
        </Link>
        <div className="nav-links">
          <a href="#home" className="nav-link">Home</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#technology" className="nav-link">Technology</a>
          <a href="#research" className="nav-link">Research</a>
          <a href="#about" className="nav-link">About</a>
        </div>
        <div className="nav-actions">
          <Link href="/login" className="btn-nav-outline">Login</Link>
          <Link href="/login" className="btn-nav-primary">Explore Platform →</Link>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── 2. HERO ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Blurred Medical Pattern Wallpaper */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            backgroundImage: "url('/medical-pattern.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "380px 380px",
            opacity: 0.035,
            filter: "blur(1.5px) invert(1)",
          }}
        />
        <div className="grid-bg" />
        <div className="hero">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />

          {/* Left — Text */}
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(28px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1)", position: "relative", zIndex: 2 }}>
            <div className="hero-badge"><span>🧠</span> ELVON — Clinical Intelligence Platform</div>
            <h1 className="hero-title">
              Early Disease<br />Detection, Powered by<br />
              <span className="grad">Classical + Quantum AI</span>
            </h1>
            <p className="hero-sub">
              A hybrid quantum machine learning platform that transforms complex biomedical data into explainable,
              evidence-based predictions while benchmarking quantum-enhanced models against classical machine learning.
            </p>
            <div className="hero-actions">
              <Link href="/login" className="btn-primary">🚀 Launch Platform</Link>
              <a href="#portals" className="btn-secondary">Explore 4 Portals ↓</a>
            </div>

            {/* 4 Dedicated Portals Access Cards */}
            <div id="portals" style={{ marginTop: 24, marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "var(--cyan)", marginBottom: 12 }}>
                Instant Access by Persona:
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Link href="/login/doctor" style={{ textDecoration: "none", padding: "10px 14px", borderRadius: 12, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.25)", display: "flex", alignItems: "center", gap: 8, transition: "all .2s" }}>
                  <span style={{ fontSize: 16 }}>🩺</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#93c5fd" }}>Doctor Portal</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>Patient Triage & PACS</div>
                  </div>
                </Link>
                <Link href="/login/hospital" style={{ textDecoration: "none", padding: "10px 14px", borderRadius: 12, background: "rgba(79,70,229,0.08)", border: "1px solid rgba(79,70,229,0.25)", display: "flex", alignItems: "center", gap: 8, transition: "all .2s" }}>
                  <span style={{ fontSize: 16 }}>🏥</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc" }}>Hospital Command</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>Bed Telemetry & Models</div>
                  </div>
                </Link>
                <Link href="/login/researcher" style={{ textDecoration: "none", padding: "10px 14px", borderRadius: 12, background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.25)", display: "flex", alignItems: "center", gap: 8, transition: "all .2s" }}>
                  <span style={{ fontSize: 16 }}>⚛️</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#c084fc" }}>Quantum Lab</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>PennyLane NISQ Suite</div>
                  </div>
                </Link>
                <Link href="/login/data-scientist" style={{ textDecoration: "none", padding: "10px 14px", borderRadius: 12, background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.25)", display: "flex", alignItems: "center", gap: 8, transition: "all .2s" }}>
                  <span style={{ fontSize: 16 }}>🤖</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#6ee7b7" }}>AutoML Studio</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>Tournaments & Training</div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="hero-trust">
              {["Simulator-Ready", "Explainable AI", "Benchmark-Driven", "Open Research"].map(t => (
                <div className="hero-trust-item" key={t}><div className="hero-trust-dot" /><span>{t}</span></div>
              ))}
            </div>
          </div>

          {/* Right — Quantum Network Visual */}
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateX(28px) scale(0.95)", transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) .15s", position: "relative", zIndex: 2 }}>
            <div className="hero-visual">
              <div className="net-container">
                <div className="net-bg" />

                {/* SVG Connection Lines */}
                <div className="net-lines">
                  <svg viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg">
                    {/* Connection paths */}
                    <line className="net-line" x1="240" y1="40" x2="240" y2="120" />
                    <line className="net-line" x1="240" y1="120" x2="140" y2="220" />
                    <line className="net-line" x1="240" y1="120" x2="340" y2="220" />
                    <line className="net-line" x1="140" y1="220" x2="240" y2="300" />
                    <line className="net-line" x1="340" y1="220" x2="240" y2="300" />
                    <line className="net-line" x1="240" y1="300" x2="240" y2="370" />
                    <line className="net-line" x1="240" y1="370" x2="240" y2="440" />
                    {/* Glow layer */}
                    <line className="net-line-glow" x1="240" y1="40" x2="240" y2="120" />
                    <line className="net-line-glow" x1="240" y1="120" x2="140" y2="220" />
                    <line className="net-line-glow" x1="240" y1="120" x2="340" y2="220" />
                    <line className="net-line-glow" x1="140" y1="220" x2="240" y2="300" />
                    <line className="net-line-glow" x1="340" y1="220" x2="240" y2="300" />
                    <line className="net-line-glow" x1="240" y1="300" x2="240" y2="370" />
                    <line className="net-line-glow" x1="240" y1="370" x2="240" y2="440" />
                    {/* Animated pulses along paths */}
                    <circle className="net-pulse" r="4">
                      <animateMotion dur="3s" repeatCount="indefinite" path="M240,40 L240,120 L140,220 L240,300 L240,370 L240,440" />
                    </circle>
                    <circle className="net-pulse" r="3" style={{ animationDelay: "1.5s" }}>
                      <animateMotion dur="3s" repeatCount="indefinite" begin="1.5s" path="M240,40 L240,120 L340,220 L240,300 L240,370 L240,440" />
                    </circle>
                  </svg>
                </div>

                {/* Nodes */}
                <NetworkNode icon="🧬" label="Biomedical Data" x="calc(50% - 32px)" y="4%" color="#10b981" delay={0} />
                <NetworkNode icon="⚙️" label="Processing" x="calc(50% - 32px)" y="20%" color="#06b6d4" delay={150} />
                <NetworkNode icon="🤖" label="Classical ML" x="calc(25% - 32px)" y="40%" color="#6366f1" delay={300} />
                <NetworkNode icon="⚛️" label="Hybrid QML" x="calc(75% - 32px)" y="40%" color="#8b5cf6" delay={300} />
                <NetworkNode icon="🔍" label="Prediction" x="calc(50% - 32px)" y="58%" color="#f59e0b" delay={450} />
                <NetworkNode icon="💡" label="Explainability" x="calc(50% - 32px)" y="73%" color="#ec4899" delay={600} />
                <NetworkNode icon="📊" label="Benchmark" x="calc(50% - 32px)" y="88%" color="#a78bfa" delay={750} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="stats-strip-wrap">
          <FadeIn>
            <div className="stats-strip">
              {[
                { v: 5, s: "", l: "Benchmark Datasets" },
                { v: 8, s: "", l: "ML/QML Models" },
                { v: 12, s: "q", l: "Max Qubits" },
                { v: 97, s: "%", l: "Peak ROC-AUC" }
              ].map((s, i) => (
                <div className="stat-item" key={i}>
                  <div className="stat-value"><Counter end={s.v} suffix={s.s} /></div>
                  <div className="stat-label">{s.l}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── 3. PROBLEM SECTION ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="section-outer alt">
        <div className="section-inner">
          <FadeIn>
            <div className="section-chip">⚠️ The Challenge</div>
            <h2 className="section-title">Why Early Detection Is <span className="grad">Difficult</span></h2>
            <p className="section-sub">Biomedical data is complex, noisy, and high-dimensional — making disease detection a formidable ML challenge.</p>
          </FadeIn>
          <div className="problem-grid">
            {problemCards.map((c, i) => (
              <FadeIn key={i} delay={i * 90} from="scale">
                <div className="problem-card" style={{ "--card-accent": c.color } as React.CSSProperties}>
                  <div className="problem-icon">{c.icon}</div>
                  <h3 className="problem-title">{c.title}</h3>
                  <p className="problem-desc">{c.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── 4. SOLUTION ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="section-outer">
        <div className="section-inner">
          <div className="solution-layout">
            <FadeIn from="left">
              <div>
                <div className="section-chip">✦ Our Approach</div>
                <h2 className="section-title">One Platform.<br />Two Learning <span className="grad">Paradigms.</span><br />One Evidence-Based Comparison.</h2>
                <p style={{ fontSize: 16, color: "var(--text2)", lineHeight: 1.85, marginBottom: 24 }}>
                  ELVON combines classical machine learning and quantum-enhanced learning in a single experimental platform.
                  Instead of assuming quantum advantage, it <strong style={{ color: "var(--text)" }}>measures</strong> predictive performance,
                  explainability, generalization and quantum resource requirements.
                </p>
                <p style={{ fontSize: 14, color: "var(--text3)", lineHeight: 1.8, fontStyle: "italic" }}>
                  Rather than promising superiority, we provide rigorous experimental evidence — a key distinction for credible research.
                </p>
              </div>
            </FadeIn>
            <FadeIn from="right" delay={120}>
              <div className="solution-flow">
                {[
                  { icon: "🧬", label: "Biomedical Dataset Upload", bg: "rgba(16,185,129,0.08)" },
                  { icon: "🧹", label: "Data Cleaning & Validation", bg: "rgba(6,182,212,0.08)" },
                  { icon: "⚙️", label: "Feature Engineering & PCA", bg: "rgba(99,102,241,0.08)" },
                ].map((s, i) => (
                  <div className="sol-step" key={i}>
                    <div className="sol-step-icon" style={{ background: s.bg }}>{s.icon}</div>
                    <div className="sol-step-text">{s.label}</div>
                    <span className="sol-step-arrow">→</span>
                  </div>
                ))}
                <div className="sol-highlight">
                  <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 700 }}>🤖 Classical ML</span>
                    <span style={{ fontSize: 12, color: "var(--text3)" }}>⟷</span>
                    <span style={{ fontSize: 12, color: "var(--accent2)", fontWeight: 700 }}>⚛️ Hybrid QML</span>
                  </div>
                  <div className="sol-highlight-text">Parallel Training & Evaluation</div>
                </div>
                {[
                  { icon: "🔍", label: "Disease Risk Prediction", bg: "rgba(245,158,11,0.08)" },
                  { icon: "💡", label: "Explainability (SHAP / Perturbation)", bg: "rgba(236,72,153,0.08)" },
                  { icon: "📊", label: "Benchmarking + Quantum Resources", bg: "rgba(99,102,241,0.08)" },
                  { icon: "🔬", label: "Evidence-Based Insights", bg: "rgba(16,185,129,0.08)" },
                ].map((s, i) => (
                  <div className="sol-step" key={`b-${i}`}>
                    <div className="sol-step-icon" style={{ background: s.bg }}>{s.icon}</div>
                    <div className="sol-step-text">{s.label}</div>
                    <span className="sol-step-arrow">→</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── 5. KEY FEATURES ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="section-outer alt">
        <div className="section-inner">
          <FadeIn>
            <div className="section-chip">⚡ Platform Capabilities</div>
            <h2 className="section-title">Key <span className="grad">Features</span></h2>
            <p className="section-sub">Six research-grade capabilities that make ELVON different.</p>
          </FadeIn>
          <div className="features-grid">
            {featureCards.map((f, i) => (
              <FadeIn key={i} delay={i * 80} from="bottom">
                <div className="feature-card" style={{ "--feat-gradient": f.gradient } as React.CSSProperties}>
                  <div className="feature-icon-wrap">{f.icon}</div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── 6. HOW IT WORKS — VERTICAL TIMELINE ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="section-outer" id="how-it-works">
        <div className="section-inner">
          <FadeIn>
            <div className="section-chip">🔄 Process</div>
            <h2 className="section-title">From Biomedical Data<br />to <span className="grad">Evidence</span></h2>
            <p className="section-sub">A clear 6-step pathway from raw data to explainable, benchmarked results.</p>
          </FadeIn>
          <div className="hiw-timeline">
            <div className="hiw-timeline-line" />
            {hiwSteps.map((s, i) => {
              const isLeft = i % 2 === 0
              return (
                <FadeIn key={i} delay={i * 100} from={isLeft ? "left" : "right"}>
                  <div className={`hiw-item ${isLeft ? "hiw-item-left" : "hiw-item-right"}`}>
                    <div className="hiw-item-placeholder" />
                    <div className="hiw-badge-col">
                      <div className="hiw-badge" style={{ borderColor: s.color }}>{s.n}</div>
                    </div>
                    <div className="hiw-item-content">
                      <span className="hiw-step-icon">{s.icon}</span>
                      <div className="hiw-step-title">{s.title}</div>
                      <div className="hiw-step-desc">{s.desc}</div>
                    </div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── 7. CLASSICAL vs QML ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="section-outer alt" id="technology">
        <div className="section-inner">
          <FadeIn>
            <div className="section-chip">⚛️ Hybrid Intelligence</div>
            <h2 className="section-title">Why Hybrid <span className="grad">Quantum ML?</span></h2>
            <p className="section-sub">Use classical computing where it excels today, and quantum computing where its potential can be experimentally evaluated.</p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="quantum-split">
              <div className="quantum-col quantum-col-left">
                <div className="quantum-col-label" style={{ color: "var(--green)" }}>⚡ Classical Computing</div>
                {["Data preprocessing & cleaning", "Feature engineering", "Mutual information selection", "PCA dimensionality reduction", "LR, SVM, RF, XGBoost, MLP", "Performance evaluation & metrics"].map((item, i) => (
                  <div className="quantum-item" key={i}><span style={{ color: "var(--green)", flexShrink: 0, marginRight: 4 }}>✓</span>{item}</div>
                ))}
              </div>
              <div className="quantum-center"><div className="quantum-center-text">HYBRID INTELLIGENCE</div></div>
              <div className="quantum-col quantum-col-right">
                <div className="quantum-col-label" style={{ color: "var(--accent2)" }}>⚛ Quantum Computing</div>
                {["Quantum feature angle encoding", "Fidelity quantum kernel matrices", "Variational quantum circuits (VQC)", "Quantum neural networks (QNN)", "Noise impact analysis (NISQ)", "Hardware readiness scoring"].map((item, i) => (
                  <div className="quantum-item" key={i}><span style={{ color: "var(--accent2)", flexShrink: 0, marginRight: 4 }}>⚛</span>{item}</div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="quantum-quote">
              Use classical computing where it is strongest today, and quantum computing where its potential can be{" "}
              <strong>experimentally evaluated</strong> — rather than theoretically assumed.
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── 8. BENCHMARK ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="section-outer" id="benchmark">
        <div className="section-inner">
          <FadeIn>
            <div className="section-chip">📊 Performance</div>
            <h2 className="section-title">Don&apos;t Assume Quantum Advantage.<br /><span className="grad">Measure It.</span></h2>
            <p className="section-sub">Every experiment produces measurable evidence about predictive performance and quantum resource requirements.</p>
          </FadeIn>

          {/* Visual Dashboard Comparison */}
          <FadeIn delay={80}>
            <div className="bench-visual">
              <div className="bench-visual-card">
                <div className="bench-visual-label">Accuracy Comparison</div>
                <div className="bench-visual-bars">
                  {benchRows.map((r, i) => {
                    const { ref, inView } = useInView(0.1)
                    return (
                      <div key={i} ref={ref as React.Ref<HTMLDivElement>} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div className="bench-bar" style={{
                          height: inView ? `${r.acc * 0.8}px` : "0px",
                          background: r.q ? "linear-gradient(to top, #6366f1, #8b5cf6)" : "linear-gradient(to top, #10b981, #06b6d4)",
                          transitionDelay: `${i * 100}ms`,
                        }}>
                          <div className="bench-bar-label">{r.acc}%</div>
                        </div>
                        <span style={{ fontSize: 9, color: "var(--text3)", maxWidth: 28, textAlign: "center", lineHeight: 1.2 }}>{r.q ? "Q" : "C"}{i + 1}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="bench-visual-card">
                <div className="bench-visual-label">ROC-AUC Comparison</div>
                <div className="bench-visual-bars">
                  {benchRows.map((r, i) => {
                    const { ref, inView } = useInView(0.1)
                    return (
                      <div key={i} ref={ref as React.Ref<HTMLDivElement>} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div className="bench-bar" style={{
                          height: inView ? `${r.roc * 0.8}px` : "0px",
                          background: r.q ? "linear-gradient(to top, #8b5cf6, #ec4899)" : "linear-gradient(to top, #06b6d4, #10b981)",
                          transitionDelay: `${i * 100}ms`,
                        }}>
                          <div className="bench-bar-label">{r.roc}%</div>
                        </div>
                        <span style={{ fontSize: 9, color: "var(--text3)", maxWidth: 28, textAlign: "center", lineHeight: 1.2 }}>{r.q ? "Q" : "C"}{i + 1}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Table */}
          <FadeIn delay={160}>
            <table className="bench-table">
              <thead>
                <tr><th>Model</th><th>Type</th><th>Accuracy</th><th>Recall</th><th>F1</th><th>ROC-AUC</th></tr>
              </thead>
              <tbody>
                {benchRows.map((r, i) => (
                  <tr key={i}>
                    <td className="bench-model">{r.name}</td>
                    <td><span className={r.q ? "bench-badge-q" : "bench-badge-c"}>{r.q ? "⚛ Quantum" : "⚡ Classical"}</span></td>
                    <td className={`bench-metric${(r as any).best ? " best" : ""}`}>{r.acc}%</td>
                    <td className="bench-metric">{r.rec}%</td>
                    <td className="bench-metric">{r.f1}%</td>
                    <td className={`bench-metric${(r as any).best ? " best" : ""}`}>{r.roc}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FadeIn>
          <p className="bench-bottom">* Demo values shown — actual values reflect measured experimental results once training is complete.</p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── 9. APPLICATIONS ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="section-outer alt" id="about">
        <div className="section-inner">
          <FadeIn>
            <div className="section-chip">🧬 Domains</div>
            <h2 className="section-title">Built for Multiple<br /><span className="grad">Biomedical Domains</span></h2>
            <p className="section-sub">Designed to support varied disease-detection research across multiple biomedical data types.</p>
          </FadeIn>
          <div className="apps-grid">
            {appCards.map((a, i) => (
              <FadeIn key={i} delay={i * 70} from="scale">
                <div className="app-card">
                  <div className="app-icon-wrap">{a.icon}</div>
                  <div className="app-title">{a.title}</div>
                  <div className="app-desc">{a.desc}</div>
                  {a.future && <div className="app-future">Coming Soon</div>}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── 10. EXPLAINABLE AI ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="section-outer">
        <div className="section-inner">
          <div className="xai-layout">
            <FadeIn from="left">
              <div>
                <div className="section-chip">💡 XAI</div>
                <h2 className="section-title">From Prediction<br />to <span className="grad">Understanding</span></h2>
                <p style={{ fontSize: 16, color: "var(--text2)", lineHeight: 1.85, marginBottom: 24 }}>
                  The platform goes beyond a prediction score by showing <strong style={{ color: "var(--text)" }}>which input features or perturbations
                  influence model behavior</strong> — making results interpretable for researchers and clinicians alike.
                </p>
                <p style={{ fontSize: 14, color: "var(--text3)", lineHeight: 1.8 }}>
                  For classical models: SHAP feature importance. For QML models: perturbation-based sensitivity analysis and PCA component
                  attribution — appropriate for the quantum circuit context.
                </p>
              </div>
            </FadeIn>
            <FadeIn from="right" delay={120}>
              <div className="xai-viz">
                <div className="xai-title-sm">WHY THIS PREDICTION? — Feature Contributions</div>
                {xaiRows.map((r, i) => <XAIRow key={i} name={r.name} pct={r.pct} color={r.color} delay={i * 80} />)}
                <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(99,102,241,0.06)", borderRadius: 12, border: "1px solid rgba(99,102,241,0.12)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".5px" }}>Confidence Score</span>
                    <span style={{ fontSize: 18, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }} className="grad">94.2%</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── 11. QUANTUM RESOURCES ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="section-outer alt qres-section">
        <div className="qres-circuit-bg" />
        <div className="section-inner">
          <FadeIn>
            <div className="section-chip">⚛️ Resource Monitor</div>
            <h2 className="section-title">Quantum Resources,<br /><span className="grad">Made Visible</span></h2>
            <p className="section-sub">Track qubit usage, circuit complexity and execution metrics for every QML experiment.</p>
            <div className="qres-demo-badge">⚠️ Demo values — actual values reflect live experiment results</div>
          </FadeIn>
          <div className="qres-grid">
            {[
              { v: "8", l: "Qubits" },
              { v: "12", l: "Circuit Depth" },
              { v: "46", l: "Total Gates" },
              { v: "1024", l: "Shots" },
              { v: "4.8s", l: "Exec Time" },
              { v: "Sim", l: "Backend" }
            ].map((r, i) => (
              <FadeIn key={i} delay={i * 70} from="scale">
                <div className="qres-card">
                  <span className="qres-value">{r.v}</span>
                  <div className="qres-label">{r.l}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── 12. RESEARCH & INNOVATION ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="section-outer" id="research">
        <div className="section-inner">
          <FadeIn>
            <div className="section-chip">🔬 Foundation</div>
            <h2 className="section-title">Built as an Experimental<br /><span className="grad">Research Platform</span></h2>
            <p className="section-sub">Designed for rigorous, reproducible quantum ML research in biomedical applications.</p>
          </FadeIn>
          <div className="research-grid">
            {[
              { icon: "🔬", title: "Open Experimentation", desc: "Experiment with different classical and QML approaches on standardized biomedical datasets. Full configuration control over models, backends and parameters." },
              { icon: "⚖️", title: "Fair Benchmarking", desc: "Compare models under controlled experimental conditions — identical data splits, preprocessing and evaluation metrics. No cherry-picked results." },
              { icon: "🚀", title: "Future Ready", desc: "Simulator-first architecture today. Near-term quantum hardware compatible tomorrow. Hardware readiness scoring prepares for NISQ device deployment." },
            ].map((r, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="research-card">
                  <span className="research-icon">{r.icon}</span>
                  <h3 className="research-title">{r.title}</h3>
                  <p className="research-desc">{r.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── 13. IMPACT ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="section-outer alt">
        <div className="section-inner">
          <FadeIn>
            <div className="section-chip">🌐 Impact</div>
            <h2 className="section-title">Potential <span className="grad">Impact</span></h2>
            <p className="section-sub">How ELVON contributes to biomedical AI research and the quantum computing ecosystem.</p>
          </FadeIn>
          <div className="impact-grid">
            {impactCards.map((c, i) => (
              <FadeIn key={i} delay={i * 90}>
                <div className="impact-card">
                  <div className="impact-icon-wrap" style={{ background: c.bg }}>{c.icon}</div>
                  <div>
                    <div className="impact-title">{c.title}</div>
                    <div className="impact-desc">{c.desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── 14. CTA ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="cta-section">
        <FadeIn from="scale">
          <div className="cta-box">
            <div className="cta-tagline">Experiment · Compare · Explain · Discover</div>
            <h2 className="cta-title">Explore the Future of<br /><span className="grad">Biomedical AI</span></h2>
            <p className="cta-desc">
              Upload your dataset. Configure your experiment. Train classical and quantum models side-by-side.
              Get explainable predictions and benchmark evidence — in one platform.
            </p>
            <div className="cta-actions">
              <Link href="/login/researcher" className="btn-primary" style={{ fontSize: 16, padding: "17px 38px" }}>🚀 Launch ELVON Platform →</Link>
              <Link href="/login" className="btn-secondary" style={{ fontSize: 16, padding: "17px 38px" }}>Login to Platform</Link>
            </div>
            <div className="cta-disclaimer">
              Research and decision-support platform only.<br />
              Not a substitute for professional medical diagnosis or clinical judgment.
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* ── FOOTER ── */}
      {/* ═══════════════════════════════════════════════════ */}
      <footer>
        <div>
          <div className="footer-logo">
            <div className="nav-logo-icon" style={{ width: 32, height: 32, fontSize: 16 }}>🧠</div>
            <div className="footer-logo-name">ELVON</div>
          </div>
          <p className="footer-sub">
            ELVON — Clinical Intelligence & Hybrid Quantum Machine Learning Platform<br />
            Classical ML · QSVM · VQC · QNN · Benchmarking · XAI · NISQ Simulator
          </p>
        </div>
        <div className="footer-links">
          <Link href="/login/doctor" className="footer-link">Doctor Portal</Link>
          <Link href="/login/hospital" className="footer-link">Hospital Admin</Link>
          <Link href="/login/researcher" className="footer-link">Quantum Lab</Link>
          <Link href="/login/data-scientist" className="footer-link">AutoML Studio</Link>
          <Link href="/login" className="footer-link">Login</Link>
        </div>
      </footer>
    </>
  )
}