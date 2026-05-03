"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  TrendingUp,
  Shield,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Target,
  BarChart3,
  Handshake,
} from "lucide-react"

interface FarmerProfile {
  personalInfo: any
  farmDetails: any
  financialProfile: any
  agriculturalPortfolio: any
  marketEngagement: any
  technologyPreferences: any
  profileComplete: boolean
  farmerType: "single-crop" | "multi-crop"
}

interface FixedAINegotiatorProps {
  farmerProfile: FarmerProfile
}

interface NegotiationRequest {
  cropType: string
  quantity: number
  qualityParams: {
    moisture: number
    impurities: number
    damaged_grains: number
    foreign_matter: number
  }
  farmerLocation: {
    state: string
    district: string
  }
  farmerProfile: any
  buyerOffers?: Array<{
    buyerName: string
    offerPrice: number
    terms: string
  }>
}

interface NegotiationResult {
  success: boolean
  agent: string
  farmerName: string
  cropDetails: any
  marketIntelligence: {
    averageMarketPrice: number
    qualityPremium: number
    recommendedPrice: number
    priceRange: {
      minimum: number
      target: number
      maximum: number
    }
  }
  aiNegotiationStrategy: string
  contractTerms: any
  protectionLevel: string
  confidence: number
  warnings: string[]
  nextSteps: string[]
  farmerHelpline: string
}

export function FixedAINegotiator({ farmerProfile }: FixedAINegotiatorProps) {
  const [currentCrop, setCurrentCrop] = useState("")
  const [quantity, setQuantity] = useState("")
  const [qualityParams, setQualityParams] = useState({
    moisture: 12,
    impurities: 1.5,
    damaged_grains: 3,
    foreign_matter: 0.5,
  })
  const [buyerOffers, setBuyerOffers] = useState([{ buyerName: "", offerPrice: 0, terms: "" }])
  const [isNegotiating, setIsNegotiating] = useState(false)
  const [negotiationResult, setNegotiationResult] = useState<NegotiationResult | null>(null)
  const [error, setError] = useState("")

  // Initialize with farmer's primary crop if single-crop farmer
  useEffect(() => {
    if (farmerProfile?.farmerType === "single-crop" && farmerProfile?.agriculturalPortfolio?.primaryCrop) {
      setCurrentCrop(farmerProfile.agriculturalPortfolio.primaryCrop)
    }
  }, [farmerProfile])

  const addBuyerOffer = () => {
    setBuyerOffers([...buyerOffers, { buyerName: "", offerPrice: 0, terms: "" }])
  }

  const updateBuyerOffer = (index: number, field: string, value: any) => {
    const updated = buyerOffers.map((offer, i) => (i === index ? { ...offer, [field]: value } : offer))
    setBuyerOffers(updated)
  }

  const startNegotiation = async () => {
    if (!currentCrop || !quantity) {
      setError("Please provide crop type and quantity")
      return
    }

    setIsNegotiating(true)
    setError("")

    try {
      const personalInfo = farmerProfile?.personalInfo || {}
      const farmDetails = farmerProfile?.farmDetails || {}

      const negotiationRequest: NegotiationRequest = {
        cropType: currentCrop,
        quantity: Number.parseInt(quantity),
        qualityParams,
        farmerLocation: {
          state: personalInfo.state || "uttar pradesh",
          district: personalInfo.district || "lucknow",
        },
        farmerProfile: {
          name: personalInfo.name || "Farmer",
          phone: personalInfo.phone || "",
          farmSize: farmDetails.totalLand || "Unknown",
          experience: personalInfo.experience || 0,
          farmerType: farmerProfile?.farmerType || "multi-crop",
        },
        buyerOffers: buyerOffers.filter((offer) => offer.buyerName && offer.offerPrice > 0),
      }

      const response = await fetch("/api/fixed-ai-negotiator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(negotiationRequest),
      })

      if (!response.ok) {
        throw new Error("Negotiation request failed")
      }

      const result = await response.json()
      setNegotiationResult(result)
    } catch (err) {
      setError("Failed to process negotiation. Please try again.")
      console.error("Negotiation error:", err)
    } finally {
      setIsNegotiating(false)
    }
  }

  const renderFarmerTypeStrategy = () => {
    const agriculturalPortfolio = farmerProfile?.agriculturalPortfolio || {}
    const primaryCrop = agriculturalPortfolio.primaryCrop || "your primary crop"
    const cropsCount = agriculturalPortfolio.crops?.length || "multiple"

    if (farmerProfile?.farmerType === "single-crop") {
      return (
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Target className="h-4 w-4" />
          <AlertDescription>
            <strong>Single Crop Specialist Strategy:</strong> Deep focus on {primaryCrop}
            with specialized quality premiums, seasonal timing optimization, and buyer matching based on crop expertise.
          </AlertDescription>
        </Alert>
      )
    } else {
      return (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <BarChart3 className="h-4 w-4" />
          <AlertDescription>
            <strong>Multi-Crop Portfolio Strategy:</strong> Leveraging your diverse crop portfolio for cross-crop
            negotiations, bulk advantages, and risk distribution across {cropsCount} different crops.
          </AlertDescription>
        </Alert>
      )
    }
  }

  if (negotiationResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-green-800">{negotiationResult.agent}</h3>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Confidence: {Math.round(negotiationResult.confidence * 100)}%
          </Badge>
        </div>

        {/* Market Intelligence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Market Intelligence & Fair Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Market Price</p>
                <p className="text-xl font-bold">₹{negotiationResult.marketIntelligence.averageMarketPrice}</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Quality Premium</p>
                <p className="text-xl font-bold text-blue-600">
                  +{negotiationResult.marketIntelligence.qualityPremium}%
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Recommended Price</p>
                <p className="text-xl font-bold text-green-600">
                  ₹{negotiationResult.marketIntelligence.recommendedPrice}
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Max Target</p>
                <p className="text-xl font-bold text-purple-600">
                  ₹{negotiationResult.marketIntelligence.priceRange.maximum}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Negotiation Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Handshake className="w-5 h-5 text-green-600" />
              AI Negotiation Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{negotiationResult.aiNegotiationStrategy}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contract Terms & Legal Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Contract Terms & Legal Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Price Terms</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Agreed Price: ₹{negotiationResult.contractTerms.priceTerms.agreedPrice}</li>
                  <li>• {negotiationResult.contractTerms.priceTerms.paymentTerms}</li>
                  <li>• {negotiationResult.contractTerms.priceTerms.qualityBonus}</li>
                  <li>• {negotiationResult.contractTerms.priceTerms.priceProtection}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Legal Protections</h4>
                <ul className="space-y-1 text-sm">
                  {negotiationResult.contractTerms.legalProtections.map((protection: string, index: number) => (
                    <li key={index}>• {protection}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warnings & Next Steps */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="w-5 h-5" />
                Important Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {negotiationResult.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    {warning}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {negotiationResult.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
              <Separator className="my-4" />
              <p className="text-sm text-center text-gray-600">
                <strong>Farmer Helpline:</strong> {negotiationResult.farmerHelpline}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button onClick={() => setNegotiationResult(null)} variant="outline" className="px-8">
            Start New Negotiation
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {renderFarmerTypeStrategy()}

      {/* Crop Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-600" />
            Crop Details for Negotiation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cropType">Crop Type</Label>
              <Input
                id="cropType"
                value={currentCrop}
                onChange={(e) => setCurrentCrop(e.target.value)}
                placeholder="e.g., wheat, rice, corn"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity (Quintals)</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 100"
              />
            </div>
          </div>

          {/* Quality Parameters */}
          <div>
            <Label className="text-base font-semibold">Quality Parameters</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div>
                <Label htmlFor="moisture" className="text-sm">
                  Moisture %
                </Label>
                <Input
                  id="moisture"
                  type="number"
                  step="0.1"
                  value={qualityParams.moisture}
                  onChange={(e) => setQualityParams({ ...qualityParams, moisture: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="impurities" className="text-sm">
                  Impurities %
                </Label>
                <Input
                  id="impurities"
                  type="number"
                  step="0.1"
                  value={qualityParams.impurities}
                  onChange={(e) =>
                    setQualityParams({ ...qualityParams, impurities: Number.parseFloat(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="damaged" className="text-sm">
                  Damaged Grains %
                </Label>
                <Input
                  id="damaged"
                  type="number"
                  step="0.1"
                  value={qualityParams.damaged_grains}
                  onChange={(e) =>
                    setQualityParams({ ...qualityParams, damaged_grains: Number.parseFloat(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="foreign" className="text-sm">
                  Foreign Matter %
                </Label>
                <Input
                  id="foreign"
                  type="number"
                  step="0.1"
                  value={qualityParams.foreign_matter}
                  onChange={(e) =>
                    setQualityParams({ ...qualityParams, foreign_matter: Number.parseFloat(e.target.value) })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buyer Offers */}
      <Card>
        <CardHeader>
          <CardTitle>Current Buyer Offers (Optional)</CardTitle>
          <CardDescription>Add any existing offers to help AI provide better negotiation strategies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {buyerOffers.map((offer, index) => (
            <div key={index} className="grid md:grid-cols-3 gap-4 p-4 border rounded-lg">
              <div>
                <Label htmlFor={`buyer-${index}`}>Buyer Name</Label>
                <Input
                  id={`buyer-${index}`}
                  value={offer.buyerName}
                  onChange={(e) => updateBuyerOffer(index, "buyerName", e.target.value)}
                  placeholder="e.g., Local Trader"
                />
              </div>
              <div>
                <Label htmlFor={`price-${index}`}>Offer Price (₹/Quintal)</Label>
                <Input
                  id={`price-${index}`}
                  type="number"
                  value={offer.offerPrice}
                  onChange={(e) => updateBuyerOffer(index, "offerPrice", Number.parseInt(e.target.value))}
                  placeholder="e.g., 1800"
                />
              </div>
              <div>
                <Label htmlFor={`terms-${index}`}>Payment Terms</Label>
                <Input
                  id={`terms-${index}`}
                  value={offer.terms}
                  onChange={(e) => updateBuyerOffer(index, "terms", e.target.value)}
                  placeholder="e.g., Cash payment"
                />
              </div>
            </div>
          ))}
          <Button onClick={addBuyerOffer} variant="outline" className="w-full bg-transparent">
            Add Another Buyer Offer
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center">
        <Button
          onClick={startNegotiation}
          disabled={isNegotiating}
          className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700"
        >
          {isNegotiating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing Smart Negotiation...
            </>
          ) : (
            <>
              <Handshake className="w-5 h-5 mr-2" />
              Start Smart Negotiation
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
