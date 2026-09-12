"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"

// ─── Simple intersection observer hook ───────────────────────────────────────
function useInView(threshold = 0.1) {
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

// ─── Animated number counter ─────────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const { ref, inView } = useInView()
  useEffect(() => {
    if (!inView) return
    let cur = 0
    const step = 16
    const inc = end / (1600 / step)
    const t = setInterval(() => {
      cur += inc
      if (cur >= end) { setVal(end); clearInterval(t) }
      else setVal(Math.floor(cur))
    }, step)
    return () => clearInterval(t)
  }, [inView, end])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, description, delay = 0 }: { icon: string; title: string; description: string; delay?: number }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
      className="feature-card"
    >
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{description}</p>
    </div>
  )
}

// ─── Pipeline step ────────────────────────────────────────────────────────────
function PipelineStep({ step, title, desc, delay = 0 }: { step: string; title: string; desc: string; delay?: number }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-24px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
      className="pipeline-step"
    >
      <div className="pipeline-badge">{step}</div>
      <div>
        <div className="pipeline-title">{title}</div>
        <div className="pipeline-desc">{desc}</div>
      </div>
    </div>
  )
}

// ─── Dataset card ─────────────────────────────────────────────────────────────
function DatasetCard({ name, domain, samples, features, delay = 0 }: { name: string; domain: string; samples: string; features: string; delay?: number }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "scale(1)" : "scale(0.94)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
      className="dataset-card"
    >
      <div className="dataset-name">{name}</div>
      <div className="dataset-domain">{domain}</div>
      <div className="dataset-stats">
        <span>{samples} samples</span>
        <span>{features} features</span>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [loaded, setLoaded] = useState(false)
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; speed: number; opacity: number }[]>([])

  useEffect(() => {
    setLoaded(true)
    // Generate floating particle positions only on client to avoid hydration mismatch
    setParticles(Array.from({ length: 22 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 12 + 8,
      opacity: Math.random() * 0.5 + 0.1,
    })))
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #05070f;
          --bg2: #080c1a;
          --surface: #0d1121;
          --surface2: #111827;
          --border: rgba(99,102,241,0.15);
          --accent: #6366f1;
          --accent2: #8b5cf6;
          --accent3: #06b6d4;
          --gold: #f59e0b;
          --text: #f1f5f9;
          --text2: #94a3b8;
          --text3: #64748b;
          --green: #10b981;
          --radius: 16px;
          --radius-sm: 10px;
          --shadow: 0 8px 32px rgba(99,102,241,0.12);
          --glow: 0 0 48px rgba(99,102,241,0.18);
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', -apple-system, sans-serif;
          line-height: 1.6;
          overflow-x: hidden;
        }

        /* ── Nav ── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 48px;
          background: rgba(5,7,15,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          font-weight: 800; font-size: 18px; letter-spacing: -0.3px;
          background: linear-gradient(135deg, var(--accent), var(--accent3));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          text-decoration: none;
        }
        .nav-logo span { font-size: 22px; }
        .nav-badge {
          background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3);
          color: var(--accent); font-size: 11px; font-weight: 600;
          padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px;
        }
        .nav-cta {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: white; font-weight: 600; font-size: 14px;
          padding: 10px 22px; border-radius: 10px; text-decoration: none;
          transition: all 0.2s; box-shadow: 0 4px 16px rgba(99,102,241,0.3);
        }
        .nav-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.45); }

        /* ── Hero ── */
        .hero {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          text-align: center; padding: 120px 24px 80px;
          position: relative; overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 80% 60% at 50% 40%, rgba(99,102,241,0.08) 0%, transparent 70%),
                      radial-gradient(ellipse 60% 50% at 20% 70%, rgba(139,92,246,0.06) 0%, transparent 70%),
                      radial-gradient(ellipse 50% 40% at 80% 20%, rgba(6,182,212,0.05) 0%, transparent 60%);
        }
        .hero-sih-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25);
          color: var(--accent2); font-size: 12px; font-weight: 600;
          padding: 8px 18px; border-radius: 20px; margin-bottom: 28px;
          letter-spacing: 0.5px; text-transform: uppercase;
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        .hero-headline {
          font-size: clamp(36px, 7vw, 80px); font-weight: 900;
          letter-spacing: -2px; line-height: 1.05;
          margin-bottom: 24px;
        }
        .hero-headline .grad {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #06b6d4 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero-sub {
          font-size: clamp(15px, 2.5vw, 20px); color: var(--text2); max-width: 680px;
          margin: 0 auto 40px; font-weight: 400; line-height: 1.7;
        }
        .hero-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .btn-primary {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: white; font-weight: 700; font-size: 15px;
          padding: 14px 32px; border-radius: 12px; text-decoration: none;
          transition: all 0.25s; box-shadow: 0 4px 24px rgba(99,102,241,0.35);
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 36px rgba(99,102,241,0.5); }
        .btn-secondary {
          background: transparent; border: 1.5px solid rgba(99,102,241,0.35);
          color: var(--text); font-weight: 600; font-size: 15px;
          padding: 14px 28px; border-radius: 12px; text-decoration: none;
          transition: all 0.25s; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-secondary:hover { border-color: var(--accent); background: rgba(99,102,241,0.08); }

        /* ── Stats strip ── */
        .stats-strip {
          display: flex; justify-content: center; gap: 0; flex-wrap: wrap;
          margin: 56px auto 0; max-width: 800px;
          border: 1px solid var(--border); border-radius: var(--radius);
          overflow: hidden; background: var(--surface);
        }
        .stat-item {
          flex: 1; min-width: 140px; text-align: center;
          padding: 28px 20px; border-right: 1px solid var(--border);
        }
        .stat-item:last-child { border-right: none; }
        .stat-value { font-size: 32px; font-weight: 900; letter-spacing: -1px;
          background: linear-gradient(135deg, var(--accent), var(--accent3));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stat-label { font-size: 12px; color: var(--text3); margin-top: 4px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }

        /* ── Section ── */
        section { padding: 96px 24px; max-width: 1200px; margin: 0 auto; }
        .section-chip {
          display: inline-block; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25);
          color: var(--accent); font-size: 11px; font-weight: 700;
          padding: 6px 14px; border-radius: 20px; margin-bottom: 16px; letter-spacing: 1px; text-transform: uppercase;
        }
        .section-title {
          font-size: clamp(26px, 4vw, 44px); font-weight: 800; letter-spacing: -1px;
          line-height: 1.15; margin-bottom: 16px;
        }
        .section-sub { font-size: 17px; color: var(--text2); max-width: 600px; line-height: 1.7; margin-bottom: 56px; }

        /* ── Feature cards ── */
        .features-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;
        }
        .feature-card {
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
          padding: 28px; transition: all 0.3s; cursor: default;
        }
        .feature-card:hover {
          border-color: rgba(99,102,241,0.4); background: var(--surface2);
          transform: translateY(-4px); box-shadow: var(--shadow);
        }
        .feature-icon { font-size: 32px; margin-bottom: 16px; }
        .feature-title { font-size: 16px; font-weight: 700; margin-bottom: 10px; color: var(--text); }
        .feature-desc { font-size: 14px; color: var(--text2); line-height: 1.65; }

        /* ── Pipeline steps ── */
        .pipeline-grid { display: flex; flex-direction: column; gap: 12px; }
        .pipeline-step {
          display: flex; align-items: flex-start; gap: 18px;
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm);
          padding: 20px 24px; transition: all 0.25s;
        }
        .pipeline-step:hover { border-color: rgba(6,182,212,0.4); background: var(--surface2); }
        .pipeline-badge {
          background: linear-gradient(135deg, var(--accent3), var(--accent));
          color: white; font-size: 11px; font-weight: 800; letter-spacing: 0.5px;
          padding: 6px 12px; border-radius: 8px; white-space: nowrap; flex-shrink: 0;
          font-family: 'Space Mono', monospace;
        }
        .pipeline-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
        .pipeline-desc { font-size: 13px; color: var(--text2); line-height: 1.5; }

        /* ── Dataset cards ── */
        .datasets-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;
        }
        .dataset-card {
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm);
          padding: 22px; transition: all 0.25s;
        }
        .dataset-card:hover { border-color: rgba(99,102,241,0.35); transform: translateY(-3px); box-shadow: var(--shadow); }
        .dataset-name { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 6px; line-height: 1.4; }
        .dataset-domain {
          font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;
          color: var(--accent3); margin-bottom: 14px;
        }
        .dataset-stats { display: flex; gap: 10px; flex-wrap: wrap; }
        .dataset-stats span {
          background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.15);
          color: var(--text2); font-size: 11px; font-weight: 600;
          padding: 4px 10px; border-radius: 6px;
        }

        /* ── Models grid ── */
        .models-section {
          display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start;
        }
        @media (max-width: 768px) { .models-section { grid-template-columns: 1fr; } }
        .models-column-label {
          font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          margin-bottom: 16px; padding-bottom: 10px; border-bottom: 1px solid var(--border);
        }
        .model-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; padding: 10px 16px; margin: 6px 6px 0 0;
          font-size: 13px; font-weight: 600; color: var(--text2); transition: all 0.2s;
        }
        .model-tag:hover { border-color: var(--accent); color: var(--text); }
        .model-tag .dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .model-tag .dot.green { background: var(--green); box-shadow: 0 0 8px rgba(16,185,129,0.5); }
        .model-tag .dot.violet { background: var(--accent); box-shadow: 0 0 8px rgba(99,102,241,0.5); }
        .model-tag .dot.cyan { background: var(--accent3); box-shadow: 0 0 8px rgba(6,182,212,0.5); }

        /* ── CTA section ── */
        .cta-section {
          text-align: center; padding: 96px 24px;
          background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 70%);
        }
        .cta-box {
          max-width: 680px; margin: 0 auto;
          background: var(--surface); border: 1px solid rgba(99,102,241,0.2);
          border-radius: 24px; padding: 64px 48px;
          box-shadow: 0 0 80px rgba(99,102,241,0.1);
        }
        .cta-subtitle { font-size: 14px; color: var(--accent3); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 20px; }
        .cta-title { font-size: clamp(28px, 4vw, 44px); font-weight: 900; letter-spacing: -1px; line-height: 1.15; margin-bottom: 20px; }
        .cta-desc { font-size: 16px; color: var(--text2); margin-bottom: 36px; line-height: 1.7; }

        /* ── Particles ── */
        .particle {
          position: absolute; border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.6), transparent);
          pointer-events: none;
          animation: drift linear infinite;
        }
        @keyframes drift {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(-100vh) rotate(360deg); }
        }

        /* ── Footer ── */
        footer {
          text-align: center; padding: 32px 24px;
          border-top: 1px solid var(--border);
          color: var(--text3); font-size: 13px;
        }
        footer strong { color: var(--text2); }

        @media (max-width: 640px) {
          nav { padding: 14px 20px; }
          .hero { padding: 100px 16px 60px; }
          .stats-strip { margin: 40px 16px 0; }
          section { padding: 64px 16px; }
          .cta-box { padding: 40px 24px; }
        }
      `}</style>

      {/* Navigation */}
      <nav>
        <a href="/" className="nav-logo">
          <span>⚛</span> QML Platform
        </a>
        <span className="nav-badge">SIH · PS-26139</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/login" style={{ color: "var(--text2)", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>Login</Link>
          <Link href="/dashboard" className="nav-cta">Launch Dashboard →</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero">
        <div className="hero-bg" />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animationDuration: `${p.speed}s`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.9s ease" }}
          >
            <div className="hero-sih-badge">
              🇮🇳 Smart India Hackathon · Problem Statement ID: 26139
            </div>
            <h1 className="hero-headline">
              Hybrid Quantum Machine<br />
              <span className="grad">Learning for Early</span><br />
              Disease Detection
            </h1>
            <p className="hero-sub">
              A complete end-to-end research platform benchmarking QSVM, VQC, and QNN
              against classical models on biomedical datasets — with noise analysis,
              explainability, and hardware readiness scoring.
            </p>
            <div className="hero-actions">
              <Link href="/dashboard" className="btn-primary">
                ⚡ Launch Platform Dashboard
              </Link>
              <Link href="/analysis" className="btn-secondary">
                ⚗️ Quantum Lab
              </Link>
            </div>

            {/* Stats strip */}
            <div className="stats-strip">
              <div className="stat-item">
                <div className="stat-value"><Counter end={5} /></div>
                <div className="stat-label">Benchmark Datasets</div>
              </div>
              <div className="stat-item">
                <div className="stat-value"><Counter end={8} /></div>
                <div className="stat-label">ML Models</div>
              </div>
              <div className="stat-item">
                <div className="stat-value"><Counter end={12} />q</div>
                <div className="stat-label">Max Qubits</div>
              </div>
              <div className="stat-item">
                <div className="stat-value"><Counter end={200} /></div>
                <div className="stat-label">Max Gene Features</div>
              </div>
              <div className="stat-item">
                <div className="stat-value"><Counter end={100} suffix="%" /></div>
                <div className="stat-label">Leakage-Safe Pipeline</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Datasets */}
      <section>
        <div className="section-chip">Benchmark Datasets</div>
        <h2 className="section-title">5 Biomedical Datasets</h2>
        <p className="section-sub">
          Covering oncology, cardiovascular, metabolic, neurological, and genomic disease categories
          as specified in the SIH 26139 problem statement.
        </p>
        <div className="datasets-grid">
          <DatasetCard name="Breast Cancer (WDBC)" domain="Oncology" samples="569" features="30" delay={0} />
          <DatasetCard name="Cardiovascular Disease" domain="Cardiology" samples="303" features="13" delay={60} />
          <DatasetCard name="Diabetes Screening" domain="Metabolic" samples="500" features="8" delay={120} />
          <DatasetCard name="Parkinson's Disease" domain="Neurology" samples="195" features="22" delay={180} />
          <DatasetCard name="Gene Expression Genomics" domain="Genomics / Precision Medicine" samples="220" features="200" delay={240} />
        </div>
      </section>

      {/* Pipeline */}
      <section style={{ background: "rgba(8,12,26,0.6)", borderRadius: 24, maxWidth: "100%", borderTop: "1px solid rgba(99,102,241,0.08)", borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-chip">Pipeline Architecture</div>
          <h2 className="section-title">13-Step Data Processing Pipeline</h2>
          <p className="section-sub">
            Full reproducible pipeline from raw tabular biomedical data to quantum circuit-compatible feature vectors,
            with strict leakage-safe train/validation/test splits.
          </p>
          <div className="pipeline-grid">
            <PipelineStep step="01 INGEST" title="Data Ingestion & Schema Audit" desc="Load CSV / benchmark dataset, validate schema, detect column types, audit missing values and class imbalance." delay={0} />
            <PipelineStep step="02 CLEAN" title="Missing Value Imputation" desc="Median imputation for numerical, mode for categorical. Clipping outliers at [1st, 99th] percentile with clinical bounds." delay={50} />
            <PipelineStep step="03 ENCODE" title="Feature Engineering" desc="Domain-aware encoding: clinical risk scores, interaction terms, ordinal encoding of categorical biomarkers." delay={100} />
            <PipelineStep step="04 SPLIT" title="Leakage-Safe 70/15/15 Split" desc="Stratified train/validation/test split using pre-fit scaler — zero leakage of test statistics into training." delay={150} />
            <PipelineStep step="05 SCALE" title="Standardisation" desc="StandardScaler fit on training set only. Validation and test transformed with saved parameters." delay={200} />
            <PipelineStep step="06 MI SELECT" title="Mutual Information Feature Selection" desc="Top-k features ranked by MI score, removing low-information features before dimensionality reduction." delay={250} />
            <PipelineStep step="07 PCA" title="PCA Dimensionality Compression" desc="Variance-maximising PCA projects features to 4–12 principal components, mapping to quantum qubit count." delay={300} />
            <PipelineStep step="08 ENCODE-Q" title="Quantum Angle Encoding" desc="Continuous features mapped to rotation angles [0, π] for RY-gate amplitude encoding per qubit." delay={350} />
            <PipelineStep step="09 QSVM" title="Quantum Kernel Classifier (QSVM)" desc="Fidelity kernel matrix computed by inner-product of quantum states, fed into classical SVM solver." delay={400} />
            <PipelineStep step="10 VQC" title="Variational Quantum Classifier" desc="Trainable parameterised quantum circuit with 2-layer CNOT entanglement, optimised via gradient descent." delay={450} />
            <PipelineStep step="11 QNN" title="Quantum Neural Network" desc="Dressed QNN with classical pre/post-processing layers, trained end-to-end with BCE loss." delay={500} />
            <PipelineStep step="12 BENCH" title="Classical Baseline Suite" desc="LR, SVM, Random Forest, Gradient Boost, XGBoost, MLP — all trained on identical splits for fair comparison." delay={550} />
            <PipelineStep step="13 EVAL" title="Comprehensive Evaluation & Export" desc="ROC-AUC, Confusion Matrix, Sensitivity, Specificity, F1. Hardware readiness scoring. JSON/CSV export." delay={600} />
          </div>
        </div>
      </section>

      {/* Models */}
      <section>
        <div className="section-chip">Model Comparison</div>
        <h2 className="section-title">Classical vs Quantum Tournament</h2>
        <p className="section-sub">
          All 8 models trained on identical leakage-safe splits, evaluated by ROC-AUC,
          Sensitivity, Specificity, F1, and inference latency.
        </p>
        <div className="models-section">
          <div>
            <div className="models-column-label" style={{ color: "var(--green)" }}>⚡ Classical Baselines</div>
            {[
              ["Logistic Regression", "green"],
              ["Support Vector Machine (RBF)", "green"],
              ["Random Forest", "green"],
              ["Gradient Boosting / XGBoost", "green"],
              ["Multi-Layer Perceptron (MLP)", "green"],
            ].map(([name, dot]) => (
              <div className="model-tag" key={name}>
                <span className={`dot ${dot}`} />
                {name}
              </div>
            ))}
          </div>
          <div>
            <div className="models-column-label" style={{ color: "var(--accent)" }}>⚛ Hybrid Quantum (NISQ)</div>
            {[
              ["Quantum Kernel Classifier (QSVM)", "violet"],
              ["Variational Quantum Classifier (VQC)", "cyan"],
              ["Quantum Neural Network (QNN)", "violet"],
            ].map(([name, dot]) => (
              <div className="model-tag" key={name}>
                <span className={`dot ${dot}`} />
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="section-chip">Platform Capabilities</div>
        <h2 className="section-title">Research-Grade Features</h2>
        <p className="section-sub">
          Every capability maps to a specific section in the SIH 26139 problem specification document.
        </p>
        <div className="features-grid">
          <FeatureCard icon="🎯" title="Noise Impact Analysis" description="Automatically computes Accuracy_ideal − Accuracy_noisy for QSVM and VQC. Quantifies NISQ hardware sensitivity at configurable noise rates." delay={0} />
          <FeatureCard icon="📐" title="Qubit Dimension Sweep" description="Evaluates predictive performance as qubit count varies from 4→12. Plots the Accuracy vs. Qubit Count trade-off curve." delay={60} />
          <FeatureCard icon="🔬" title="XAI — Quantum Sensitivity" description="Perturbation-based feature attribution (Delta-Z) and PCA component importance score for every prediction." delay={120} />
          <FeatureCard icon="🖥️" title="Hardware Readiness Score" description="Circuit depth, gate count, T-gate fraction, and estimated fidelity score against IBM Falcon & Hummingbird profiles." delay={180} />
          <FeatureCard icon="🧬" title="Genomics Compression" description="200-gene expression feature space compressed to 8 qubits via MI selection + PCA. Demonstrates extreme dimensionality reduction." delay={240} />
          <FeatureCard icon="📊" title="ROC Curves & Confusion Matrix" description="Per-model ROC curves (FPR/TPR), confusion matrices (TP/TN/FP/FN), and full metric breakdown for all 8 models." delay={300} />
          <FeatureCard icon="🛡️" title="Data Leakage Audit" description="Automated leakage detection checks column overlap, scale contamination, and target peaking before any model training." delay={360} />
          <FeatureCard icon="📤" title="Export & Reproducibility" description="Full experiment results exportable as JSON. Experiment history with audit trail for reproducible research." delay={420} />
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-box">
          <div className="cta-subtitle">Get Started</div>
          <h2 className="cta-title">Run Your First<br />Quantum Benchmark</h2>
          <p className="cta-desc">
            Select a biomedical dataset, configure your quantum parameters,
            and launch the full 13-step pipeline — all from a single interface.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard" className="btn-primary" style={{ fontSize: 16, padding: "16px 36px" }}>
              ⚡ Launch Dashboard →
            </Link>
            <Link href="/analysis" className="btn-secondary" style={{ fontSize: 16, padding: "16px 36px" }}>
              ⚗️ Open Quantum Lab
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer>
        <strong>Hybrid QML Platform</strong> · Smart India Hackathon · Problem Statement ID: <strong>26139</strong>
        <br />
        <span style={{ marginTop: 8, display: "block" }}>
          Classical ML · QSVM · VQC · QNN · Parkinson's · Genomics · Noise Impact · XAI
        </span>
      </footer>
    </>
  )
}
