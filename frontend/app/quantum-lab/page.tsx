"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function QuantumLabRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/analysis")
  }, [router])

  return (
    <div className="min-h-screen bg-[#05070f] flex items-center justify-center text-slate-400 font-sans">
      Redirecting to Quantum Lab...
    </div>
  )
}
