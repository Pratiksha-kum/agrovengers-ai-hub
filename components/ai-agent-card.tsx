"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"
import { CheckCircle } from "lucide-react"

interface AIAgent {
  id: string
  name: string
  description: string
  icon: LucideIcon
  success: number
  specialty: string
  metrics: string[]
  color: string
}

interface AIAgentCardProps {
  agent: AIAgent
  onActivate: () => void
  language: string
  onSeedSageActivate?: () => void
}

export function AIAgentCard({ agent, onActivate, language, onSeedSageActivate }: AIAgentCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleActivate = () => {
    onActivate()

    if (agent.id === "seed-sage" && onSeedSageActivate) {
      console.log("[v0] Seed Sage agent activated - triggering redirect to seeds tab")
      setTimeout(() => {
        onSeedSageActivate()
        window.dispatchEvent(new CustomEvent("seedSageActivated"))
      }, 300)
    }
  }

  const IconComponent = agent.icon

  return (
    <Card
      className={`transition-all duration-300 hover:shadow-xl border-2 cursor-pointer ${
        isHovered ? "border-green-400 shadow-green-100 -translate-y-1" : "border-gray-200 dark:border-gray-700"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-xl ${agent.color} flex items-center justify-center shadow-md`}>
              <IconComponent className="w-7 h-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{agent.name}</CardTitle>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">{agent.specialty}</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="text-xs bg-green-50 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-300"
          >
            {agent.success}% Success
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{agent.description}</p>

        <div className="space-y-1">
          {agent.metrics.map((metric, index) => (
            <div key={index} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <span>{metric}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={handleActivate}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Open Analysis
        </Button>
      </CardContent>
    </Card>
  )
}