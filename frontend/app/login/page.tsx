"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Atom, User, Building, Eye, EyeOff, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<"researcher" | "institution">("researcher")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Mock session based on role
      const session = {
        role,
        full_name: role === "researcher" ? "Dr. Ananya Sharma" : "CityCare Admin",
        designation: role === "researcher" ? "Lead Researcher" : "Hospital Admin",
        institution: role === "researcher" ? "AIIMS Delhi" : "CityCare Hospital",
        email: email || (role === "researcher" ? "researcher@qml.ai" : "hospital@qml.ai"),
        token: "mock_jwt_token_12345"
      }
      
      localStorage.setItem("qml_session", JSON.stringify(session))
      router.push("/dashboard")
    }, 600)
  }

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/3 bg-white border-r border-slate-200 flex-col p-10 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-50 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
              <Atom size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] font-bold tracking-tight text-[#0f172a] leading-none mb-0.5">QML Platform</span>
              <span className="text-[10px] tracking-wide text-indigo-500 font-semibold uppercase leading-none">SIH · PS-26139</span>
            </div>
          </div>

          <div className="mt-auto mb-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-[280px]">
              Sign in to your {role === "researcher" ? "individual" : "hospital"} account to access AI-powered clinical intelligence and quantum benchmarking.
            </p>

            <h3 className="text-sm font-semibold text-slate-900 mb-4">Account Type</h3>
            <div className="space-y-3">
              {/* Researcher Toggle */}
              <button
                onClick={() => setRole("researcher")}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                  role === "researcher" 
                    ? "border-indigo-600 bg-indigo-50/50" 
                    : "border-slate-100 hover:border-slate-200 bg-white"
                }`}
              >
                <div className={`p-2 rounded-lg ${role === "researcher" ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}>
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold text-sm ${role === "researcher" ? "text-indigo-900" : "text-slate-700"}`}>Individual Person</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${role === "researcher" ? "border-indigo-600" : "border-slate-300"}`}>
                      {role === "researcher" && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">For doctors, researchers and clinical professionals</p>
                </div>
              </button>

              {/* Institution Toggle */}
              <button
                onClick={() => setRole("institution")}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                  role === "institution" 
                    ? "border-indigo-600 bg-indigo-50/50" 
                    : "border-slate-100 hover:border-slate-200 bg-white"
                }`}
              >
                <div className={`p-2 rounded-lg ${role === "institution" ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}>
                  <Building size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-semibold text-sm ${role === "institution" ? "text-indigo-900" : "text-slate-700"}`}>Hospital Authorization</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${role === "institution" ? "border-indigo-600" : "border-slate-300"}`}>
                      {role === "institution" && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">For hospitals, research labs and organizations</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 relative">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
            <Atom size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[18px] font-bold tracking-tight text-[#0f172a] leading-none mb-0.5">QML Platform</span>
            <span className="text-[10px] tracking-wide text-indigo-500 font-semibold uppercase leading-none">SIH · PS-26139</span>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Sign in to your account</h2>
          <p className="text-slate-500 text-sm mb-8">Enter your credentials to continue to QML Platform.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {role === "institution" && (
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1.5">Hospital / Lab Name</label>
                <input 
                  type="text" 
                  placeholder="Enter institution name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                {role === "researcher" ? "Medical Registration or Licence Number" : "Registration Number"}
              </label>
              <input 
                type="text" 
                placeholder={role === "researcher" ? "Enter licence number" : "Enter registration number"}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-2 text-right">
                <button type="button" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Forgot Password?</button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#0a0f1c] hover:bg-[#1a2035] text-white font-medium py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Don't have an account? <Link href="/sign-up" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign up as {role === "researcher" ? "Individual" : "Hospital"}</Link>
          </div>

          {/* Demo Info Box */}
          <div className="mt-12 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">Hackathon Demo Credentials</h4>
            <p className="text-xs text-indigo-700 mb-1"><strong>Email:</strong> {role === "researcher" ? "researcher@qml.ai" : "hospital@qml.ai"}</p>
            <p className="text-xs text-indigo-700"><strong>Password:</strong> demo123 (any password works)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
