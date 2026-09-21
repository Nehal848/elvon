"use client"

import React, { Suspense } from "react"
import { LoginForm } from "../page"

export default function DataScientistLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#05070f" }} />}>
      <LoginForm initialRole="data-scientist" />
    </Suspense>
  )
}
