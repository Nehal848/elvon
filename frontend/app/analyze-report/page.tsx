"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AnalyzeReportRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/analysis-report")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-600 font-semibold text-sm">Redirecting to Analysis & Report Suite...</p>
      </div>
    </div>
  )
}
