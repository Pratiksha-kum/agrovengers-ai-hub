"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sprout, TrendingUp, Droplets, Shield, Star } from "lucide-react"

interface SeedsHubProps {
  language: string
}

function SeedsHub({ language }: SeedsHubProps) {
  const [selectedCrop, setSelectedCrop] = useState("corn")

  const seedVarieties = {
    corn: [
      {
        name: "NK Hybrid 7590",
        type: "Dent Corn",
        maturity: "115 days",
        yield: "12.5 t/ha",
        traits: ["Drought Tolerant", "High Yield", "Disease Resistant"],
        regions: ["North India", "Central India"],
        price: "₹4,500/bag",
        rating: 4.8,
        features: {
          droughtTolerance: 90,
          diseaseResistance: 85,
          yieldPotential: 95,
        },
      },
      {
        name: "AgroVengers Hybrid 8820",
        type: "Sweet Corn",
        maturity: "85 days",
        yield: "8.2 t/ha",
        traits: ["Early Maturity", "Sweet Kernel", "Uniform Size"],
        regions: ["Punjab", "Haryana", "UP"],
        price: "₹3,800/bag",
        rating: 4.6,
        features: {
          droughtTolerance: 75,
          diseaseResistance: 80,
          yieldPotential: 82,
        },
      },
    ],
    soybean: [
      {
        name: "S 22-15",
        type: "Indeterminate",
        maturity: "95 days",
        yield: "3.2 t/ha",
        traits: ["High Protein", "Pod Shattering Resistant", "Uniform Maturity"],
        regions: ["Maharashtra", "MP", "Karnataka"],
        price: "₹2,200/bag",
        rating: 4.7,
        features: {
          droughtTolerance: 85,
          diseaseResistance: 90,
          yieldPotential: 88,
        },
      },
    ],
    wheat: [
      {
        name: "Cropwise WH 1105",
        type: "Durum Wheat",
        maturity: "125 days",
        yield: "5.8 t/ha",
        traits: ["High Gluten", "Rust Resistant", "Heat Tolerant"],
        regions: ["Rajasthan", "Gujarat", "MP"],
        price: "₹1,850/bag",
        rating: 4.9,
        features: {
          droughtTolerance: 88,
          diseaseResistance: 92,
          yieldPotential: 90,
        },
      },
    ],
  }

  const crops = [
    { id: "corn", name: "Corn", icon: "🌽", count: 2 },
    { id: "soybean", name: "Soybean", icon: "🫘", count: 1 },
    { id: "wheat", name: "Wheat", icon: "🌾", count: 1 },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">🌱 Premium Seeds Hub</h3>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          High-performance seed varieties engineered for maximum yield and resilience
        </p>
      </div>

      {/* Crop Selection */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {crops.map((crop) => (
          <Button
            key={crop.id}
            variant={selectedCrop === crop.id ? "default" : "outline"}
            className={`flex items-center gap-2 ${
              selectedCrop === crop.id
                ? "bg-green-600 hover:bg-green-700"
                : "border-green-600 text-green-600 hover:bg-green-50"
            }`}
            onClick={() => setSelectedCrop(crop.id)}
          >
            <span className="text-lg">{crop.icon}</span>
            {crop.name}
            <Badge variant="secondary" className="ml-2">
              {crop.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Seeds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {seedVarieties[selectedCrop as keyof typeof seedVarieties]?.map((variety, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-green-700 dark:text-green-400">{variety.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{variety.type}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">{variety.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{variety.yield}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Expected Yield</div>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{variety.maturity}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Maturity</div>
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      Drought Tolerance
                    </span>
                    <span className="font-semibold">{variety.features.droughtTolerance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${variety.features.droughtTolerance}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Disease Resistance
                    </span>
                    <span className="font-semibold">{variety.features.diseaseResistance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${variety.features.diseaseResistance}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Yield Potential
                    </span>
                    <span className="font-semibold">{variety.features.yieldPotential}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${variety.features.yieldPotential}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Traits */}
              <div>
                <h5 className="font-semibold text-sm mb-2">Key Traits:</h5>
                <div className="flex flex-wrap gap-1">
                  {variety.traits.map((trait, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Suitable Regions */}
              <div>
                <h5 className="font-semibold text-sm mb-2">Suitable Regions:</h5>
                <div className="flex flex-wrap gap-1">
                  {variety.regions.map((region, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Price and Action */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <span className="text-lg font-bold text-green-600">{variety.price}</span>
                  <div className="text-xs text-gray-500">per 25kg bag</div>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Select Variety
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Seed Selector */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-green-600" />
            AI-Powered Seed Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">🎯 Precision Matching</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI analyzes your soil type, climate conditions, and farming practices to recommend the perfect seed
                variety.
              </p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Start Soil Analysis
              </Button>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">📈 Yield Optimization</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Advanced algorithms predict yield potential based on historical data and current market conditions.
              </p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View Yield Projections
              </Button>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">🌡️ Climate Adaptation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Weather-resistant varieties selected based on local climate patterns and future weather forecasts.
              </p>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                Check Climate Match
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { SeedsHub }
export default SeedsHub
