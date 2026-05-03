"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface NegotiationPlatformProps {
  language: string
}

export function NegotiationPlatform({ language }: NegotiationPlatformProps) {
  const [negotiationProgress, setNegotiationProgress] = useState(0)
  const [isNegotiating, setIsNegotiating] = useState(false)
  const [currentDeal, setCurrentDeal] = useState({
    crop: "Cotton",
    quality: "Premium",
    quantity: 500,
    basePrice: 5200,
    negotiatedPrice: 5650,
    sustainabilityBonus: 150,
    totalValue: 2900000,
  })

  const marketData = [
    {
      crop: "Cotton",
      price: 5800,
      trend: "up",
      change: 400,
      premium: 400,
      quality: "Premium Grade",
    },
    {
      crop: "Soybean",
      price: 4600,
      trend: "stable",
      change: 0,
      premium: 300,
      quality: "Standard",
    },
    {
      crop: "Corn",
      price: 2100,
      trend: "up",
      change: 150,
      premium: 200,
      quality: "High Yield",
    },
    {
      crop: "Sugarcane",
      price: 3200,
      trend: "stable",
      change: 0,
      premium: 150,
      quality: "Sweet Variety",
    },
  ]

  const startNegotiation = () => {
    setIsNegotiating(true)
    setNegotiationProgress(0)

    const interval = setInterval(() => {
      setNegotiationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsNegotiating(false)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  const acceptDeal = () => {
    alert(
      language === "hi"
        ? "सौदा स्वीकार किया गया! स्मार्ट कॉन्ट्रैक्ट तैयार हो रहा है।"
        : language === "mr"
          ? "करार स्वीकारला गेला! स्मार्ट कॉन्ट्रॅक्ट तयार होत आहे."
          : "Deal accepted! Smart contract is being generated.",
    )
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Smart Negotiation & Fair Pricing Platform
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          AI-powered multi-agent negotiation preventing farmer exploitation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Market Intelligence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Real-time Market Intelligence
              <Badge className="bg-green-100 text-green-800">Live from 500+ Mandis</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{item.crop}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{item.quality}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">₹{item.price.toLocaleString()}</span>
                      {getTrendIcon(item.trend)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">+₹{item.premium} quality bonus</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Negotiation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              AI Negotiation in Progress
              <Button onClick={startNegotiation} disabled={isNegotiating}>
                {isNegotiating ? "Negotiating..." : "Start New Negotiation"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Participants */}
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">👨‍🌾</span>
                </div>
                <div className="text-sm font-medium">किसान मित्र</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Protecting your interests</div>
                <Badge variant="secondary" className="text-xs mt-1">
                  94% Success Rate
                </Badge>
              </div>

              <div className="flex-1 mx-4">
                <div className="text-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Negotiation {negotiationProgress}% Complete
                  </span>
                </div>
                <Progress value={negotiationProgress} className="h-2" />
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">🏢</span>
                </div>
                <div className="text-sm font-medium">Market Connect</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Buyer representative</div>
                <Badge variant="secondary" className="text-xs mt-1">
                  Market Expert
                </Badge>
              </div>
            </div>

            {/* Deal Summary */}
            <div className="space-y-4">
              <h4 className="font-medium">Current Deal Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Crop Type:</span>
                  <div className="font-medium">
                    {currentDeal.crop} ({currentDeal.quality})
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Quantity:</span>
                  <div className="font-medium">{currentDeal.quantity} quintals</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Base Price:</span>
                  <div className="font-medium">₹{currentDeal.basePrice.toLocaleString()}/quintal</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Negotiated Price:</span>
                  <div className="font-medium text-green-600">
                    ₹{currentDeal.negotiatedPrice.toLocaleString()}/quintal
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Sustainability Bonus:</span>
                  <div className="font-medium text-blue-600">+₹{currentDeal.sustainabilityBonus}/quintal</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total Value:</span>
                  <div className="font-bold text-lg text-green-600">
                    ₹{(currentDeal.totalValue / 100000).toFixed(1)}L
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={acceptDeal} className="flex-1 bg-green-600 hover:bg-green-700">
                ✅ Accept Deal
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                💬 Counter Offer
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                🤖 Get AI Advice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
