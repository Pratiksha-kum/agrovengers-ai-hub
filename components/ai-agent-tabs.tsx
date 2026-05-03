"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ContractCreatorAI } from "./contract-creator-ai"
import { FixedAINegotiator } from "./fixed-ai-negotiator"
import { useAuth } from "@/contexts/auth-context"
import { Bot, LucideContrast as FileContract, Handshake, User } from "lucide-react"

interface AIAgentTabsProps {
  initialTab?: string
}

export function AIAgentTabs({ initialTab = "contract-creator" }: AIAgentTabsProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const { user } = useAuth()
  const [contractCreatorCompleted, setContractCreatorCompleted] = useState(false)

  // Check if farmer profile is complete
  useEffect(() => {
    if (user?.farmerProfile?.profileComplete) {
      setContractCreatorCompleted(true)
    }
  }, [user])

  const handleContractCreatorComplete = (farmerProfile: any) => {
    setContractCreatorCompleted(true)
    setTimeout(() => {
      setActiveTab("negotiation")
    }, 1000)
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-green-800 mb-2">FairTrade Guardian AI System</h1>
        <p className="text-gray-600 text-lg">
          Empowering farmers with intelligent contract creation and fair pricing negotiation
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="contract-creator" className="flex items-center gap-2 text-base py-3">
            <FileContract className="w-5 h-5" />
            Contract Creator AI
            {contractCreatorCompleted && (
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                Complete
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="negotiation"
            className="flex items-center gap-2 text-base py-3"
            disabled={!contractCreatorCompleted}
          >
            <Handshake className="w-5 h-5" />
            Smart Negotiation
            {!contractCreatorCompleted && (
              <Badge variant="outline" className="ml-2">
                Locked
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contract-creator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-6 h-6 text-blue-600" />
                Contract Creator AI Agent
              </CardTitle>
              <CardDescription>
                Phase 1: Comprehensive farmer profile collection for personalized services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContractCreatorAI
                language="en"
                onProfileComplete={handleContractCreatorComplete}
                onRedirectToNegotiation={() => setActiveTab("negotiation")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="negotiation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Handshake className="w-6 h-6 text-green-600" />
                Smart Negotiation - AI Fair Pricing System
              </CardTitle>
              <CardDescription>
                Phase 2: Intelligent contract negotiation for fair pricing and farmer protection
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contractCreatorCompleted ? (
                <FixedAINegotiator farmerProfile={user?.farmerProfile} />
              ) : (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Complete Your Profile First</h3>
                  <p className="text-gray-500">
                    Please complete the Contract Creator AI setup to unlock smart negotiation features.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
