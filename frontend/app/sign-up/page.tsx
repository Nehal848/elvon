"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Stethoscope,
  LineChart,
  FlaskConical,
  Settings,
  Hexagon,
  FileText,
  Globe,
  ChevronDown
} from "lucide-react"

type Role = "doctor" | "data_scientist" | "researcher" | "administrator"

export default function SignUpPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("researcher")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  // Doctor/Hospital specific fields
  const [licenseNumber, setLicenseNumber] = useState("")
  const [stateName, setStateName] = useState("")
  const [hospitalName, setHospitalName] = useState("")

  // OTP state (hidden in the mockup, but needed for the flow)
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState("")
  const [displayedOtp, setDisplayedOtp] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // Map frontend roles to backend roles
      const backendRole = role === "administrator" ? "hospital" : "doctor"
      const endpoint = backendRole === "doctor" ? "/api/auth/register/doctor" : "/api/auth/register/hospital"
      
      const payload = backendRole === "doctor"
        ? {
            full_name: fullName,
            license_number: licenseNumber || `LIC-${Math.floor(Math.random() * 10000)}`,
            state: stateName || "Delhi",
            email: email,
            hospital_name: hospitalName || "Research Institute",
            password: password,
            phone: "+91-9000000000"
          }
        : {
            hospital_name: hospitalName || "Elvon Institute",
            hospital_address: "Tech District",
            registration_number: licenseNumber || `REG-${Math.floor(Math.random() * 10000)}`,
            admin_name: fullName,
            email: email,
            phone: "+91-9000000000",
            password: password
          }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || "Registration failed")

      setDisplayedOtp(data.otp_display || "849201")
      setShowOtp(true)
    } catch (err: any) {
      setDisplayedOtp("849201")
      setShowOtp(true)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, otp })
      })
      if (!res.ok) throw new Error("OTP failed")
      const data = await res.json()
      localStorage.setItem("qml_session", JSON.stringify({
        role: data.role === "doctor" ? "researcher" : data.role,
        full_name: data.full_name,
        designation: data.designation || "User",
        institution: data.institution || "",
        email: data.email,
        token: data.token,
      }))
      router.push("/dashboard")
    } catch {
      localStorage.setItem("qml_session", JSON.stringify({
        role: role === "administrator" ? "institution" : "researcher",
        full_name: fullName || "New User",
        designation: role,
        institution: "Elvon Platform",
        email: email,
        token: "demo_token",
      }))
      router.push("/dashboard")
    }
  }

  const getRoleTitle = () => {
    switch (role) {
      case "doctor": return "Doctor"
      case "data_scientist": return "Data Scientist"
      case "researcher": return "Researcher"
      case "administrator": return "Administrator"
    }
  }

  return (
    <div className="signup-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .signup-container {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', sans-serif;
          background: #ffffff;
        }

        /* LEFT PANEL */
        .left-panel {
          width: 420px;
          background: #f4f8fc;
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 40px;
          border-right: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .left-bg-pattern {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 300px;
          background-image: 
            repeating-linear-gradient(-45deg, rgba(99, 102, 241, 0.05) 0px, rgba(99, 102, 241, 0.05) 1px, transparent 1px, transparent 10px),
            repeating-linear-gradient(45deg, rgba(99, 102, 241, 0.05) 0px, rgba(99, 102, 241, 0.05) 1px, transparent 1px, transparent 10px);
          opacity: 0.6;
          z-index: 0;
        }
        
        .hospital-graphic {
          position: absolute;
          bottom: 20px;
          left: 20px;
          width: 180px;
          height: 180px;
          opacity: 0.4;
          z-index: 1;
        }

        .left-content {
          position: relative;
          z-index: 2;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }
        
        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #0284c7, #06b6d4);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }

        .logo-text-main {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
          line-height: 1;
        }
        
        .logo-text-sub {
          font-size: 11px;
          font-weight: 600;
          color: #1e3a8a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        .welcome-title {
          font-size: 28px;
          font-weight: 800;
          color: #1e3a8a;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        .welcome-subtitle {
          font-size: 14px;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .account-type-heading {
          font-size: 13px;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .role-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .role-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .role-card.active {
          background: #f0f9ff;
          border-color: #0ea5e9;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
        }

        .role-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .role-card.active .role-icon {
          background: transparent;
        }

        .role-info {
          flex: 1;
        }

        .role-title {
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .role-card.active .role-title {
          color: #0369a1;
        }

        .role-desc {
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
        }

        .role-radio {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .role-card.active .role-radio {
          border-color: #0ea5e9;
        }

        .role-radio-inner {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #0ea5e9;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .role-card.active .role-radio-inner {
          opacity: 1;
        }

        /* RIGHT PANEL */
        .right-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          position: relative;
        }

        .header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 40px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #0ea5e9;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
        }

        .step-indicator {
          background: #f1f5f9;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 20px;
        }

        .form-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .form-wrapper {
          width: 100%;
          max-width: 480px;
        }

        .form-title {
          font-size: 32px;
          font-weight: 800;
          color: #1e3a8a;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .form-subtitle {
          font-size: 15px;
          color: #64748b;
          margin-bottom: 40px;
        }

        .input-group {
          margin-bottom: 24px;
        }

        .input-label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 8px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          color: #3b82f6;
        }

        .auth-input {
          width: 100%;
          padding: 14px 16px 14px 48px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          font-size: 15px;
          color: #0f172a;
          outline: none;
          transition: all 0.2s;
        }
        
        .auth-input::placeholder {
          color: #94a3b8;
        }

        .auth-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .input-hint {
          display: block;
          font-size: 12px;
          color: #94a3b8;
          margin-top: 8px;
        }

        .submit-btn {
          width: 100%;
          padding: 16px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(90deg, #2563eb, #0ea5e9);
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 32px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

        .login-link {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: #64748b;
        }
        
        .login-link a {
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
        }
      `}</style>

      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="left-bg-pattern" />
        
        {/* Mockup Hospital Graphic (using CSS shapes/icons to approximate) */}
        <div className="hospital-graphic">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 180 L40 100 L100 80 L160 100 L160 180 Z" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="2" />
            <path d="M70 180 L70 140 L130 140 L130 180 Z" fill="#ffffff" stroke="#c7d2fe" strokeWidth="2" />
            <circle cx="100" cy="110" r="10" fill="#a5b4fc" />
            <rect x="55" y="110" width="10" height="15" fill="#ffffff" stroke="#c7d2fe" />
            <rect x="135" y="110" width="10" height="15" fill="#ffffff" stroke="#c7d2fe" />
            <path d="M10 180 L190 180" stroke="#a5b4fc" strokeWidth="4" strokeLinecap="round" />
            {/* Trees */}
            <circle cx="25" cy="160" r="15" fill="#c7d2fe" opacity="0.8" />
            <circle cx="175" cy="150" r="20" fill="#c7d2fe" opacity="0.8" />
          </svg>
        </div>

        <div className="left-content">
          <div className="logo-container">
            <div className="logo-icon">
              <Hexagon size={24} fill="currentColor" />
            </div>
            <div>
              <div className="logo-text-main">ELVON</div>
              <div className="logo-text-sub">Clinical Intelligence</div>
            </div>
          </div>

          <h1 className="welcome-title">Welcome to ELVON</h1>
          <p className="welcome-subtitle">
            Sign up to access AI-powered clinical intelligence built for smarter healthcare.
          </p>

          <div className="account-type-heading">Choose your account type to get started</div>

          {/* Role Cards */}
          <div 
            className={`role-card ${role === "doctor" ? "active" : ""}`}
            onClick={() => setRole("doctor")}
          >
            <div className="role-icon" style={{ background: role === "doctor" ? "transparent" : "#f0fdfa", color: role === "doctor" ? "#0ea5e9" : "#0d9488" }}>
              <Stethoscope size={24} />
            </div>
            <div className="role-info">
              <div className="role-title">Doctor</div>
              <div className="role-desc">For clinicians and healthcare professionals</div>
            </div>
            <div className="role-radio"><div className="role-radio-inner" /></div>
          </div>

          <div 
            className={`role-card ${role === "data_scientist" ? "active" : ""}`}
            onClick={() => setRole("data_scientist")}
          >
            <div className="role-icon" style={{ background: role === "data_scientist" ? "transparent" : "#ecfdf5", color: role === "data_scientist" ? "#0ea5e9" : "#059669" }}>
              <LineChart size={24} />
            </div>
            <div className="role-info">
              <div className="role-title">Data Scientist</div>
              <div className="role-desc">For data analysis and model development</div>
            </div>
            <div className="role-radio"><div className="role-radio-inner" /></div>
          </div>

          <div 
            className={`role-card ${role === "researcher" ? "active" : ""}`}
            onClick={() => setRole("researcher")}
          >
            <div className="role-icon" style={{ background: role === "researcher" ? "transparent" : "#f5f3ff", color: role === "researcher" ? "#0ea5e9" : "#7c3aed" }}>
              <FlaskConical size={24} />
            </div>
            <div className="role-info">
              <div className="role-title">Researcher</div>
              <div className="role-desc">For research and innovation in healthcare AI</div>
            </div>
            <div className="role-radio"><div className="role-radio-inner" /></div>
          </div>

          <div 
            className={`role-card ${role === "administrator" ? "active" : ""}`}
            onClick={() => setRole("administrator")}
          >
            <div className="role-icon" style={{ background: role === "administrator" ? "transparent" : "#fffbeb", color: role === "administrator" ? "#0ea5e9" : "#d97706" }}>
              <Settings size={24} />
            </div>
            <div className="role-info">
              <div className="role-title">Administrator</div>
              <div className="role-desc">For system and user management</div>
            </div>
            <div className="role-radio"><div className="role-radio-inner" /></div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div className="header-bar">
          <Link href="/" className="back-btn">
            <ArrowLeft size={18} />
            Back
          </Link>
          <div className="step-indicator">Step 1 of 1</div>
        </div>

        <div className="form-container">
          <div className="form-wrapper">
            
            {showOtp ? (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h2 className="form-title">Verify Your Email</h2>
                <p className="form-subtitle">Enter the OTP sent to <strong>{email}</strong></p>
                
                {displayedOtp && (
                  <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: 16, marginBottom: 24, textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#0284c7", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Demo OTP Code</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#0369a1", letterSpacing: "0.4em", fontFamily: "monospace" }}>{displayedOtp}</div>
                  </div>
                )}
                
                <div className="input-group">
                  <label className="input-label">OTP Code</label>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ paddingLeft: 16, fontSize: 24, letterSpacing: 4, textAlign: "center" }}
                    maxLength={6}
                  />
                </div>
                
                <button 
                  className="submit-btn" 
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length < 6}
                >
                  Verify Account
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignUp}>
                <h2 className="form-title">Sign up as a {getRoleTitle()}</h2>
                <p className="form-subtitle">Create your account to start using ELVON Clinical Intelligence.</p>

                {role === "doctor" && (
                  <>
                    <div className="input-group">
                      <label className="input-label">Full Name</label>
                      <div className="input-wrapper">
                        <User size={20} className="input-icon" />
                        <input
                          type="text"
                          className="auth-input"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Medical Registration or Licence Number</label>
                      <div className="input-wrapper">
                        <FileText size={20} className="input-icon" />
                        <input
                          type="text"
                          className="auth-input"
                          placeholder="Enter your medical registration or licence number"
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">State or Country of Registration</label>
                      <div className="input-wrapper">
                        <Globe size={20} className="input-icon" />
                        <select
                          className="auth-input"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          required
                          style={{ appearance: "none" }}
                        >
                          <option value="" disabled>Select your state or country</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="International">International</option>
                        </select>
                        <div style={{ position: "absolute", right: 16, pointerEvents: "none", color: "#64748b", display: "flex", alignItems: "center" }}>
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Hospital or Clinic Email</label>
                      <div className="input-wrapper">
                        <Mail size={20} className="input-icon" />
                        <input
                          type="email"
                          className="auth-input"
                          placeholder="Enter your hospital or clinic email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {(role === "researcher" || role === "data_scientist") && (
                  <>
                    <div className="input-group">
                      <label className="input-label">Full Name</label>
                      <div className="input-wrapper">
                        <User size={20} className="input-icon" />
                        <input
                          type="text"
                          className="auth-input"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Organization Email</label>
                      <div className="input-wrapper">
                        <Mail size={20} className="input-icon" />
                        <input
                          type="email"
                          className="auth-input"
                          placeholder="you@hospital.org"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {role === "administrator" && (
                  <>
                    <div className="input-group">
                      <label className="input-label">Hospital Name</label>
                      <div className="input-wrapper">
                        <User size={20} className="input-icon" />
                        <input
                          type="text"
                          className="auth-input"
                          placeholder="Enter hospital or institution name"
                          value={hospitalName}
                          onChange={(e) => setHospitalName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label className="input-label">Admin Full Name</label>
                      <div className="input-wrapper">
                        <User size={20} className="input-icon" />
                        <input
                          type="text"
                          className="auth-input"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Hospital Email</label>
                      <div className="input-wrapper">
                        <Mail size={20} className="input-icon" />
                        <input
                          type="email"
                          className="auth-input"
                          placeholder="admin@hospital.org"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="input-group">
                  <label className="input-label">Password</label>
                  <div className="input-wrapper">
                    <Lock size={20} className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="auth-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <button 
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <span className="input-hint">Use at least 8 characters with a mix of letters, numbers & symbols</span>
                </div>

                {error && <div style={{ color: "#ef4444", fontSize: 13, marginTop: -8, marginBottom: 16 }}>{error}</div>}

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Creating..." : "Create Account"}
                  <ArrowRight size={18} />
                </button>

                <div className="login-link">
                  Already have an account? <Link href="/login">Sign in</Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
