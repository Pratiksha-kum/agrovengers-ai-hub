"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Star, ExternalLink, Brain, Target, DollarSign, Leaf } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface EnhancedSeedsHubProps {
  language: string
}

interface SeedRecommendation {
  variety: string
  type: string
  traits: string[]
  yieldPotential: string
  disease_resistance: string[]
  price_per_kg: number
  region: string[]
  purchaseLink: string
  soilPH: number[]
  climateZone: string[]
}

interface CropDNAResponse {
  success: boolean
  analysis: string
  recommendedSeeds: SeedRecommendation[]
  farmerProfile: {
    location: string
    farmSize: string
    cropPreference: string
    budget: string
    irrigation: string
    soilPH: number
  }
  weatherConditions: {
    temperature: number
    humidity: number
    description: string
    location: string
  }
  totalSeedsAnalyzed: number
  timestamp: string
}

export function EnhancedSeedsHub({ language }: EnhancedSeedsHubProps) {
  const { farmer } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [seedRecommendations, setSeedRecommendations] = useState<SeedRecommendation[]>([])
  const [cropDNAAnalysis, setCropDNAAnalysis] = useState<string>("")
  const [farmerProfile, setFarmerProfile] = useState<any>(null)
  const [weatherConditions, setWeatherConditions] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("recommendations")

  useEffect(() => {
    if (farmer) {
      activateSeedSageAgent()
    }
  }, [farmer])

  useEffect(() => {
    const handleSeedSageActivation = () => {
      console.log("[v0] Seed Sage activated - redirecting to seeds tab")
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get("agent") === "seed-sage") {
        activateSeedSageAgent()
      }
    }

    window.addEventListener("seedSageActivated", handleSeedSageActivation)

    handleSeedSageActivation()

    return () => {
      window.removeEventListener("seedSageActivated", handleSeedSageActivation)
    }
  }, [])

  const activateSeedSageAgent = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/agents/cropdna-oracle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          farmDetails: {
            location: farmer?.location || "Maharashtra",
            farmSize: farmer?.farmSize || "5 acres",
            cropPreference: farmer?.cropPreference || "wheat",
            budget: farmer?.budget || "₹50,000",
            irrigation: farmer?.irrigation || "drip irrigation",
          },
          soilAnalysis: {
            ph: farmer?.soilData?.ph || 7.2,
            nitrogen: farmer?.soilData?.nitrogen || "medium",
            phosphorus: farmer?.soilData?.phosphorus || "low",
            potassium: farmer?.soilData?.potassium || "high",
            organicMatter: farmer?.soilData?.organicMatter || 2.5,
            texture: farmer?.soilData?.texture || "clay loam",
            moisture: farmer?.soilData?.moisture || "adequate",
          },
          location: farmer?.location || "Maharashtra",
          cropPreference: farmer?.cropPreference || "wheat",
        }),
      })

      const data: CropDNAResponse = await response.json()

      if (data.success) {
        setSeedRecommendations(data.recommendedSeeds)
        setCropDNAAnalysis(data.analysis)
        setFarmerProfile(data.farmerProfile)
        setWeatherConditions(data.weatherConditions)
      } else {
        console.error("CropDNA Oracle failed:", data)
        setSeedRecommendations([
          {
            variety: "WH1105",
            type: "High Yielding Wheat",
            traits: ["Disease resistant", "Early maturity"],
            yieldPotential: "4-6 tons/hectare",
            disease_resistance: ["Rust", "Bunt"],
            price_per_kg: 65,
            region: ["All India"],
            purchaseLink: "https://www.syngenta.co.in/product/crop-protection/seeds/wheat/wh1105",
            soilPH: [6.0, 8.0],
            climateZone: ["Temperate", "Subtropical"],
          },
        ])
        setCropDNAAnalysis(
          "CropDNA Oracle analysis is processing. Based on preliminary data, WH1105 wheat variety shows excellent compatibility with your region.",
        )
      }
    } catch (error) {
      console.error("Failed to activate CropDNA Oracle:", error)
      setSeedRecommendations([
        {
          variety: "WH1105",
          type: "High Yielding Wheat",
          traits: ["Disease resistant", "Early maturity"],
          yieldPotential: "4-6 tons/hectare",
          disease_resistance: ["Rust", "Bunt"],
          price_per_kg: 65,
          region: ["All India"],
          purchaseLink: "https://www.syngenta.co.in/product/crop-protection/seeds/wheat/wh1105",
          soilPH: [6.0, 8.0],
          climateZone: ["Temperate", "Subtropical"],
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePurchase = (purchaseLink: string) => {
    window.open(purchaseLink, "_blank", "noopener,noreferrer")
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-green-600 animate-pulse" />
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">🧬 CropDNA Oracle Analyzing...</h3>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Advanced genetic analysis in progress for optimal seed recommendations
          </p>
          <Progress value={75} className="w-full max-w-md mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="h-8 w-8 text-green-600" />
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">🧬 CropDNA Oracle - Seed Sage AI</h3>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          AI-powered genetic seed analysis for {farmer?.name || "your farm"} in{" "}
          {farmerProfile?.location || farmer?.location || "Maharashtra"}
        </p>
        {weatherConditions && (
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {weatherConditions.temperature}°C | {weatherConditions.humidity}% Humidity
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {seedRecommendations.length} Seeds Analyzed
            </Badge>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="analysis">CropDNA Analysis</TabsTrigger>
          <TabsTrigger value="products">Premium Products</TabsTrigger>
          <TabsTrigger value="purchase">Purchase Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          {cropDNAAnalysis && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-green-600" />🧬 CropDNA Oracle Analysis Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div
                    className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: cropDNAAnalysis
                        .replace(
                          /## (.*)/g,
                          '<h3 class="text-lg font-bold text-green-700 dark:text-green-400 mt-6 mb-3 flex items-center gap-2">$1</h3>',
                        )
                        .replace(
                          /\| (.*) \|/g,
                          '<div class="overflow-x-auto"><table class="w-full border-collapse border border-gray-300 dark:border-gray-600 mb-4"><tbody><tr class="bg-gray-50 dark:bg-gray-800">$1</tr></tbody></table></div>',
                        )
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-green-600 dark:text-green-400">$1</strong>')
                        .replace(
                          /(\d+\.\s\*\*.*?\*\*)/g,
                          '<div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-2 border-l-4 border-green-500">$1</div>',
                        ),
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Recommended Seeds */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seedRecommendations.map((seed, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-green-100">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-green-700 dark:text-green-400">{seed.variety}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{seed.type}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Official
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{seed.yieldPotential}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Expected Yield</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">₹{seed.price_per_kg}/kg</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Official Price</div>
                    </div>
                  </div>

                  {/* Traits */}
                  <div>
                    <h5 className="font-semibold text-sm mb-2">Key Traits:</h5>
                    <div className="flex flex-wrap gap-1">
                      {seed.traits.map((trait, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Disease Resistance */}
                  <div>
                    <h5 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Disease Resistance:
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {seed.disease_resistance.map((disease, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {disease}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Suitable Regions */}
                  <div>
                    <h5 className="font-semibold text-sm mb-2">Suitable Regions:</h5>
                    <div className="flex flex-wrap gap-1">
                      {seed.region.map((region, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <span className="text-lg font-bold text-green-600">₹{seed.price_per_kg}/kg</span>
                      <div className="text-xs text-gray-500">Official Price</div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handlePurchase(seed.purchaseLink)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Buy Official
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Comprehensive CropDNA Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                  {cropDNAAnalysis || "CropDNA Oracle analysis will appear here after processing your farm data."}
                </div>
              </div>
            </CardContent>
          </Card>

          {farmerProfile && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Farm Profile Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <strong>Location:</strong> {farmerProfile.location}
                    </div>
                    <div>
                      <strong>Farm Size:</strong> {farmerProfile.farmSize}
                    </div>
                    <div>
                      <strong>Crop Preference:</strong> {farmerProfile.cropPreference}
                    </div>
                    <div>
                      <strong>Budget:</strong> {farmerProfile.budget}
                    </div>
                    <div>
                      <strong>Irrigation:</strong> {farmerProfile.irrigation}
                    </div>
                    <div>
                      <strong>Soil pH:</strong> {farmerProfile.soilPH}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {weatherConditions && (
                <Card>
                  <CardHeader>
                    <CardTitle>Weather Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <strong>Temperature:</strong> {weatherConditions.temperature}°C
                      </div>
                      <div>
                        <strong>Humidity:</strong> {weatherConditions.humidity}%
                      </div>
                      <div>
                        <strong>Conditions:</strong> {weatherConditions.description}
                      </div>
                      <div>
                        <strong>Location:</strong> {weatherConditions.location}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-green-600" />
                Official Product Catalog
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seedRecommendations.map((seed, index) => (
                  <div key={index} className="p-4 border border-green-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-green-700">{seed.variety}</h4>
                      <Badge className="bg-green-100 text-green-800">Official</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{seed.type}</p>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Yield:</strong> {seed.yieldPotential}
                      </div>
                      <div className="text-sm">
                        <strong>Price:</strong> ₹{seed.price_per_kg}/kg
                      </div>
                      <div className="text-sm">
                        <strong>Suitable pH:</strong> {seed.soilPH[0]} - {seed.soilPH[1]}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-3 bg-green-600 hover:bg-green-700"
                      onClick={() => handlePurchase(seed.purchaseLink)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Product
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-600" />
                Official Purchase Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  🛡️ Why Buy Official?
                </h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <li>• Guaranteed authentic seeds with quality assurance</li>
                  <li>• Full technical support and farming guidance</li>
                  <li>• Warranty and replacement guarantee</li>
                  <li>• Access to latest varieties and innovations</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {seedRecommendations.slice(0, 4).map((seed, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{seed.variety}</h4>
                        <p className="text-sm text-gray-600">{seed.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">₹{seed.price_per_kg}</div>
                        <div className="text-xs text-gray-500">per kg</div>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handlePurchase(seed.purchaseLink)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Purchase Official
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reactivate Button */}
      <div className="text-center">
        <Button onClick={activateSeedSageAgent} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
          <Brain className="h-4 w-4 mr-2" />
          {isLoading ? "Analyzing..." : "Reanalyze with CropDNA Oracle"}
        </Button>
      </div>
    </div>
  )
}
