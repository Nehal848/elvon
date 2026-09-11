"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ModelsPage() {
  const router = useRouter()
  useEffect(() => { router.replace("/quantum-lab") }, [router])
  return (
    <div style={{ background: "#05070f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontFamily: "Inter, sans-serif" }}>
      Redirecting to Quantum Lab…
    </div>
  )
}
