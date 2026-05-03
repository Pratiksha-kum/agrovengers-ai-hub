"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LanguageSelector } from "./language-selector"
import { FarmerSignup } from "./farmer-signup"
import { FarmerLogin } from "./farmer-login"
import { ContractCreatorAI } from "./contract-creator-ai"
import { FarmerDashboard } from "./farmer-dashboard"
import type { Language } from "@/lib/i18n"

export const EnhancedAuthWrapper: React.FC = () => {
  const { isAuthenticated, language, setLanguage, farmer } = useAuth()
  const [currentView, setCurrentView] = useState<
    "auth-selection" | "language" | "signup" | "login" | "contract-creator" | "dashboard"
  >("auth-selection")
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [showContractCreator, setShowContractCreator] = useState(false)

  const needsEnhancedProfile = isAuthenticated && farmer && !farmer.enhancedProfileComplete

  if (isAuthenticated && needsEnhancedProfile && !showContractCreator) {
    return (
      <ContractCreatorAI
        language={language}
        onComplete={(profileData) => {
          console.log("[v0] Enhanced Auth: Contract Creator profile completed", profileData)
          setShowContractCreator(false)
          setCurrentView("dashboard")
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("activateNegotiation"))
          }, 1000)
        }}
        isCompleted={false}
      />
    )
  }

  if (isAuthenticated && !needsEnhancedProfile) {
    return <FarmerDashboard />
  }

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang)
    setLanguage(lang)
    setCurrentView("signup")
  }

  const handleSignupComplete = () => {
    console.log("[v0] Enhanced Auth: Signup completed, activating Contract Creator")
    setShowContractCreator(true)
  }

  const handleLoginSuccess = () => {
    // User is now authenticated, will show appropriate view based on profile status
  }

  if (currentView === "auth-selection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-800 mb-2">Welcome to AgroVengers</h1>
            <p className="text-gray-600">Choose how you'd like to continue</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setCurrentView("language")}
              className="w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              🌱 New Farmer? Create Account
            </button>

            <button
              onClick={() => setCurrentView("login")}
              className="w-full p-4 bg-white hover:bg-gray-50 text-green-600 border-2 border-green-600 rounded-lg font-medium transition-colors"
            >
              🚜 Existing Farmer? Sign In
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Test Account:</p>
            <p className="text-xs text-blue-600">Username: devconhack</p>
            <p className="text-xs text-blue-600">Email: devconhack@gmail.com</p>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "language") {
    return <LanguageSelector onLanguageSelect={handleLanguageSelect} />
  }

  if (currentView === "signup" && selectedLanguage) {
    return (
      <FarmerSignup
        language={selectedLanguage}
        onSignupComplete={handleSignupComplete}
        onSwitchToLogin={() => setCurrentView("login")}
      />
    )
  }

  if (currentView === "login") {
    return (
      <FarmerLogin
        language={selectedLanguage || "en"}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setCurrentView("language")}
      />
    )
  }

  return <LanguageSelector onLanguageSelect={handleLanguageSelect} />
}
