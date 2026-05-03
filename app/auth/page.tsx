"use client"

import { AuthWrapper } from "@/components/auth-wrapper"
import { AuthProvider } from "@/contexts/auth-context"

export default function AuthPage() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  )
}
