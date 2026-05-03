"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { type Language, getTranslation } from "@/lib/i18n"
import { LogIn } from "lucide-react"

interface FarmerLoginProps {
  language: Language
  onLoginSuccess: () => void
  onSwitchToSignup: () => void
}

export const FarmerLogin: React.FC<FarmerLoginProps> = ({ language, onLoginSuccess, onSwitchToSignup }) => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const t = (key: any) => getTranslation(language, key)

  const fillTestCredentials = () => {
    setFormData({
      email: "devconhack@gmail.com",
      password: "test123",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const success = await login(formData.email, formData.password)

    if (success) {
      onLoginSuccess()
    } else {
      setError("Invalid email or password")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <LogIn className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">{t("loginTitle") || "Sign In"}</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email") || "Email"}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder={t("email") || "Email"}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("password") || "Password"}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder={t("password") || "Password"}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "Signing in..." : t("loginButton") || "Sign In"}
            </Button>
          </form>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
              onClick={fillTestCredentials}
            >
              🧪 Use Test Account
            </Button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {t("noAccount") || "Don't have an account?"}{" "}
              <button onClick={onSwitchToSignup} className="text-green-600 hover:text-green-700 font-medium">
                {t("signupLink") || "Create Account"}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
