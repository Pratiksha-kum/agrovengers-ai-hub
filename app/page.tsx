"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, Shield, Sprout, TrendingUp, RotateCcw, Leaf, User, LogOut, Bot } from "lucide-react"
import { AgrovengersLogo } from "@/components/agrovengers-logo"
import { AIAgentCard } from "@/components/ai-agent-card"
import { VoiceAIInterface } from "@/components/voice-ai-interface"
import { ProductShowcase } from "@/components/product-showcase"
import { EnhancedSeedsHub } from "@/components/enhanced-seeds-hub"
import { TrainingCenter } from "@/components/training-center"
import { EnhancedAuthWrapper } from "@/components/enhanced-auth-wrapper"
import { AIAgentTabs } from "@/components/ai-agent-tabs"
import { useAuth } from "@/contexts/auth-context"
import { getTranslation } from "@/lib/i18n"
import { useAIAgents } from "@/hooks/use-ai-agents"
import { EnhancedWeatherWidget } from "@/components/enhanced-weather-widget"
import { MarketOracleAgent } from "@/components/market-oracle-agent"
import { RotationMasterAgent } from "@/components/rotation-master-agent"
import { SustainabilityTrackerAgent } from "@/components/sustainability-tracker-agent"

function CropwiseAIHub() {
  const { farmer, language, logout, isAuthenticated } = useAuth()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [activeAgentPage, setActiveAgentPage] = useState<string | null>(null)
  const { agents, activateAgent, getAgentResponse } = useAIAgents()

  const t = (key: any) => getTranslation(language, key)

  const handleSeedSageActivation = () => {
    console.log("[v0] Seed Sage activated - redirecting to seeds tab")
    setActiveSection("seeds")
  }

  const handleFairTradeGuardianActivation = () => {
    console.log("[v0] FairTrade Guardian activated - redirecting to fairtrade tab")
    setActiveSection("fairtrade")
  }

  const handleAgriDetectActivation = () => {
    console.log("[v0] AgriDetect activated - redirecting to crop protection tab")
    setActiveSection("protection")
  }

  const aiAgents = [
    {
      id: "agri-detect",
      name: "AgriDetect",
      description:
        "Complete crop protection system with AI-powered disease detection and crop protection recommendations",
      icon: Shield,
      success: 96,
      specialty: "Crop Protection + Disease Detection AI",
      metrics: ["🔍 Disease Detection: AI", "🛡️ Protection: 98%"],
      color: "bg-emerald-500",
    },
    {
      id: "seed-sage",
      name: "Seed Sage",
      description: "Optimal variety selection from our premium seed portfolio for maximum yield and quality",
      icon: Sprout,
      success: 92,
      specialty: "Seeds Division AI",
      metrics: ["🌾 Varieties: 500+", "📈 Yield Boost: 15-25%"],
      color: "bg-green-500",
    },
    {
      id: "market-oracle",
      name: "Market Oracle",
      description: "Real-time pricing intelligence from 500+ mandis with quality assessment premiums",
      icon: TrendingUp,
      success: 95,
      specialty: "Price Intelligence",
      metrics: ["🪙 Mandis: 500+", "⏱️ Updates: Real-time"],
      color: "bg-purple-500",
    },
    {
      id: "crop-whisperer",
      name: "Crop Whisperer",
      description: "Multilingual voice-activated farm guidance with hands-free operation",
      icon: Mic,
      success: 91,
      specialty: "Voice Assistant",
      metrics: ["🎙️ Voice Commands: 100+", "📱 Offline Ready"],
      color: "bg-orange-500",
    },
    {
      id: "rotation-master",
      name: "Rotation Master",
      description: "Intelligent crop rotation planning based on 5-year farm history and market trends",
      icon: RotateCcw,
      success: 88,
      specialty: "Crop Optimizer",
      metrics: ["📅 Planning: 5+ Years", "💹 ROI Boost: 22%"],
      color: "bg-indigo-500",
    },
    {
      id: "sustainability-tracker",
      name: "Sustainability Tracker",
      description: "Carbon footprint monitoring and regenerative agriculture practice optimization",
      icon: Leaf,
      success: 93,
      specialty: "ESG Intelligence",
      metrics: ["🌱 Carbon Credits: 2,847", "♻️ Practices: 12"],
      color: "bg-teal-500",
    },
    {
      id: "contract-creator",
      name: "FairTrade Guardian",
      description: "Complete Contract Creator + Smart Negotiation system for fair pricing and farmer protection",
      icon: Bot,
      success: 95,
      specialty: "FairTrade AI System",
      metrics: ["📄 Contract Creator", "🤝 Smart Negotiation"],
      color: "bg-amber-500",
    },
  ]

  // If an agent page is open, render it full-screen inside the agents tab
  const renderAgentPage = () => {
    if (activeAgentPage === "market-oracle") {
      return <MarketOracleAgent onBack={() => setActiveAgentPage(null)} language={language} />
    }
    if (activeAgentPage === "rotation-master") {
      return <RotationMasterAgent onBack={() => setActiveAgentPage(null)} language={language} />
    }
    if (activeAgentPage === "sustainability-tracker") {
      return <SustainabilityTrackerAgent onBack={() => setActiveAgentPage(null)} language={language} />
    }
    if (activeAgentPage === "crop-whisperer") {
      return (
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setActiveAgentPage(null)} className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent">
            ← Back to AI Agents Hub
          </Button>
          <VoiceAIInterface language={language} />
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-green-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AgrovengersLogo />
              <div>
                <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">Cropwise AI AgentHub</h1>
                <p className="text-sm text-green-600 dark:text-green-300">Complete Farm Intelligence Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {farmer && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      {t("welcome")}, {farmer.name}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t("logout")}
                  </Button>
                </div>
              )}

              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                🚀 Empowering 20M Farmers by 2025
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="text-green-600">Revolutionary AI-powered</span>
              <br />
              Farm Intelligence Platform
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Serving 70M hectares globally with 10 specialized AI agents working together for farmer prosperity.
              Integrating crop protection, premium seeds, and intelligent farming solutions.
            </p>

            <div className="mb-12">
              <EnhancedWeatherWidget />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                onClick={() => setActiveSection("agents")}
              >
                🚀 Start Your AI Farm Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg bg-transparent"
              >
                📹 Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <Tabs value={activeSection} onValueChange={(val) => { setActiveSection(val); setActiveAgentPage(null) }} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 mb-8 bg-white dark:bg-gray-800 border border-green-200 dark:border-gray-700">
            <TabsTrigger value="agents" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="fairtrade" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              FairTrade Guardian
            </TabsTrigger>
            <TabsTrigger value="protection" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Crop Protection
            </TabsTrigger>
            <TabsTrigger value="seeds" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Seeds
            </TabsTrigger>
            <TabsTrigger value="voice" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Voice AI
            </TabsTrigger>
            <TabsTrigger value="training" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              Training
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="space-y-8">
            {/* If an agent page is active, show it instead of the grid */}
            {activeAgentPage ? (
              renderAgentPage()
            ) : (
              <>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">AI Agent Hub Dashboard</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    10 Specialized AI Agents Working Together for Complete Farm Intelligence
                  </p>
                  <p className="text-sm text-green-600 mt-2">💡 Activate an agent to unlock detailed farm insights</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aiAgents.map((agent) => (
                    <AIAgentCard
                      key={agent.id}
                      agent={agent}
                      onActivate={() => {
                        if (agent.id === "contract-creator") {
                          handleFairTradeGuardianActivation()
                        } else if (agent.id === "seed-sage") {
                          handleSeedSageActivation()
                        } else if (agent.id === "agri-detect") {
                          handleAgriDetectActivation()
                        } else if (
                          agent.id === "market-oracle" ||
                          agent.id === "rotation-master" ||
                          agent.id === "sustainability-tracker" ||
                          agent.id === "crop-whisperer"
                        ) {
                          setActiveSection("agents")
                          setActiveAgentPage(agent.id)
                        } else {
                          activateAgent(agent.id)
                        }
                      }}
                      language={language}
                      onSeedSageActivate={agent.id === "seed-sage" ? handleSeedSageActivation : undefined}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="fairtrade">
            <AIAgentTabs />
          </TabsContent>

          <TabsContent value="protection">
            <ProductShowcase language={language} />
          </TabsContent>

          <TabsContent value="seeds">
            <EnhancedSeedsHub language={language} />
          </TabsContent>

          <TabsContent value="voice">
            <VoiceAIInterface language={language} />
          </TabsContent>

          <TabsContent value="training">
            <TrainingCenter language={language} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function Page() {
  const { isAuthenticated } = useAuth()
  const [, setActiveSection] = useState("dashboard")

  useEffect(() => {
    const handleActivateNegotiation = () => {
      console.log("[v0] Main App: Activating negotiation tab")
      setActiveSection("negotiation")
    }

    window.addEventListener("activateNegotiation", handleActivateNegotiation)
    return () => window.removeEventListener("activateNegotiation", handleActivateNegotiation)
  }, [])

  if (!isAuthenticated) {
    return <EnhancedAuthWrapper />
  }

  return <CropwiseAIHub />
}