"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Leaf, TrendingUp, Droplets, Recycle, Award, Target } from "lucide-react"

interface SustainabilityTrackerProps {
  language: string
}

function SustainabilityTracker({ language }: SustainabilityTrackerProps) {
  const [selectedMetric, setSelectedMetric] = useState("carbon")

  const sustainabilityMetrics = [
    {
      id: "carbon",
      title: "Carbon Footprint",
      value: "2,847",
      unit: "CO₂ Credits",
      progress: 78,
      trend: "+12%",
      icon: Leaf,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: "water",
      title: "Water Conservation",
      value: "45%",
      unit: "Reduction",
      progress: 65,
      trend: "+8%",
      icon: Droplets,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "soil",
      title: "Soil Health Index",
      value: "8.4",
      unit: "/10 Score",
      progress: 84,
      trend: "+15%",
      icon: Target,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      id: "biodiversity",
      title: "Biodiversity Score",
      value: "92%",
      unit: "Health Index",
      progress: 92,
      trend: "+5%",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  const practices = [
    { name: "Cover Cropping", adoption: 85, impact: "High", credits: 450 },
    { name: "Precision Agriculture", adoption: 72, impact: "Very High", credits: 680 },
    { name: "Integrated Pest Management", adoption: 90, impact: "Medium", credits: 320 },
    { name: "No-Till Farming", adoption: 68, impact: "High", credits: 520 },
    { name: "Crop Rotation", adoption: 95, impact: "Medium", credits: 280 },
    { name: "Organic Fertilizers", adoption: 55, impact: "High", credits: 410 },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">🌱 Sustainability Intelligence Center</h3>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Track your environmental impact and earn carbon credits through regenerative practices
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sustainabilityMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card
              key={metric.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedMetric === metric.id ? "ring-2 ring-green-500" : ""
              }`}
              onClick={() => setSelectedMetric(metric.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {metric.trend}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{metric.title}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</span>
                    <span className="text-sm text-gray-500">{metric.unit}</span>
                  </div>
                  <Progress value={metric.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Regenerative Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Recycle className="h-6 w-6 text-green-600" />
            Regenerative Agriculture Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {practices.map((practice, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h5 className="font-semibold text-gray-900 dark:text-white">{practice.name}</h5>
                      <Badge
                        variant={practice.impact === "Very High" ? "default" : "secondary"}
                        className={practice.impact === "Very High" ? "bg-green-600" : ""}
                      >
                        {practice.impact}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Adoption Rate</span>
                        <span className="font-semibold">{practice.adoption}%</span>
                      </div>
                      <Progress value={practice.adoption} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-gray-600">Carbon Credits</span>
                      <span className="font-bold text-green-600">{practice.credits}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Center */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            Sustainability Action Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Quick Actions</h4>
              <div className="space-y-2">
                <Button className="w-full justify-start bg-green-600 hover:bg-green-700">📊 Generate ESG Report</Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  🎯 Set Sustainability Goals
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  💰 Calculate Carbon Credits
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Recommendations</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm font-medium">Increase cover cropping by 15%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Potential: +340 carbon credits</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium">Implement precision irrigation</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Water savings: 25%</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Certifications</h4>
              <div className="space-y-2">
                <Badge className="w-full justify-center bg-green-600">🏆 Regenerative Certified</Badge>
                <Badge variant="outline" className="w-full justify-center">
                  🌿 Carbon Neutral Progress
                </Badge>
                <Badge variant="outline" className="w-full justify-center">
                  💧 Water Steward
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { SustainabilityTracker }
export default SustainabilityTracker
