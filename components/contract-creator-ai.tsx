"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
  FileText,
  User,
  MapPin,
  Sprout,
  TrendingUp,
  Phone,
  Wallet,
  Clock,
  CheckCircle,
  ArrowRight,
  Bot,
  Sparkles,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { type Language, getTranslation } from "@/lib/i18n"

interface ContractCreatorAIProps {
  language: Language
  onProfileComplete: (profileData: EnhancedFarmerProfile) => void
  onRedirectToNegotiation: () => void
}

interface EnhancedFarmerProfile {
  // Core Profile
  personalInfo: {
    name: string
    contact: string
    location: {
      state: string
      district: string
      village?: string
      pincode?: string
    }
  }

  // Farm Details
  farmDetails: {
    totalLandSize: number
    irrigationStatus: "fully_irrigated" | "partially_irrigated" | "rainfed"
    storageCapacity: number
    experienceYears: number
  }

  // Financial Profile
  financialProfile: {
    averageAnnualIncome: string
    preferredPaymentTerms: "immediate" | "7_days" | "15_days" | "30_days"
    bankingAccess: boolean
  }

  // Agricultural Portfolio
  agriculturalPortfolio: {
    farmerType: "single_crop" | "multi_crop"
    crops: CropDetails[]
    seasonalPatterns: string
    qualityStandards: string
  }

  // Market Engagement
  marketEngagement: {
    previousBuyers: string[]
    sellingChannels: string[]
    pastPricingExperience: "excellent" | "good" | "average" | "poor"
    contractFarmingExperience: boolean
    transportationPreference: "self" | "buyer_arranged" | "cooperative"
  }

  // Technology & Communication
  technologyProfile: {
    preferredLanguage: Language
    digitalLiteracy: "high" | "medium" | "low"
    qualityTestingAccess: boolean
    communicationPreference: "voice" | "text" | "both"
  }
}

interface CropDetails {
  cropType: string
  variety?: string
  annualProduction: number
  qualityGrade: string
  seasonalTiming: string
  historicalPricing: string
}

const ContractCreatorAI: React.FC<ContractCreatorAIProps> = ({
  language,
  onProfileComplete,
  onRedirectToNegotiation,
}) => {
  const { farmer } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [profileData, setProfileData] = useState<EnhancedFarmerProfile>({
    personalInfo: {
      name: farmer?.name || "",
      contact: farmer?.phoneNumber || "",
      location: {
        state: farmer?.farmLocation?.state || "",
        district: farmer?.farmLocation?.district || "",
        village: "",
        pincode: "",
      },
    },
    farmDetails: {
      totalLandSize: farmer?.farmAreaAcres || 0,
      irrigationStatus: "partially_irrigated",
      storageCapacity: 0,
      experienceYears: 0,
    },
    financialProfile: {
      averageAnnualIncome: "",
      preferredPaymentTerms: "7_days",
      bankingAccess: true,
    },
    agriculturalPortfolio: {
      farmerType: farmer?.farmingType === "single" ? "single_crop" : "multi_crop",
      crops:
        farmer?.crops?.map((crop) => ({
          cropType: crop,
          variety: "",
          annualProduction: 0,
          qualityGrade: "B",
          seasonalTiming: "",
          historicalPricing: "",
        })) || [],
      seasonalPatterns: "",
      qualityStandards: "",
    },
    marketEngagement: {
      previousBuyers: [],
      sellingChannels: [],
      pastPricingExperience: "average",
      contractFarmingExperience: false,
      transportationPreference: "self",
    },
    technologyProfile: {
      preferredLanguage: language,
      digitalLiteracy: "medium",
      qualityTestingAccess: false,
      communicationPreference: "both",
    },
  })

  const t = (key: any) => getTranslation(language, key)

  const updateProfileData = (section: keyof EnhancedFarmerProfile, field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const updateNestedProfileData = (
    section: keyof EnhancedFarmerProfile,
    parentField: string,
    field: string,
    value: any,
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: {
          ...(prev[section] as any)[parentField],
          [field]: value,
        },
      },
    }))
  }

  const addCrop = () => {
    setProfileData((prev) => ({
      ...prev,
      agriculturalPortfolio: {
        ...prev.agriculturalPortfolio,
        crops: [
          ...prev.agriculturalPortfolio.crops,
          {
            cropType: "",
            variety: "",
            annualProduction: 0,
            qualityGrade: "B",
            seasonalTiming: "",
            historicalPricing: "",
          },
        ],
      },
    }))
  }

  const updateCrop = (index: number, field: keyof CropDetails, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      agriculturalPortfolio: {
        ...prev.agriculturalPortfolio,
        crops: prev.agriculturalPortfolio.crops.map((crop, i) => (i === index ? { ...crop, [field]: value } : crop)),
      },
    }))
  }

  const handleCompleteProfile = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch("/api/contract-creator/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          farmerId: farmer?.id,
          profileData,
        }),
      })

      if (response.ok) {
        console.log("[v0] Contract Creator AI: Profile completed successfully")
        onProfileComplete(profileData)

        setTimeout(() => {
          console.log("[v0] Contract Creator AI: Redirecting to negotiation platform")
          onRedirectToNegotiation()
        }, 2000)
      }
    } catch (error) {
      console.error("[v0] Contract Creator AI: Error saving profile", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Personal & Contact Information</h3>
                <p className="text-sm text-gray-600">Let's start with your basic details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.personalInfo.name}
                  onChange={(e) => updateNestedProfileData("personalInfo", "name", "", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={profileData.personalInfo.contact}
                  onChange={(e) => updateNestedProfileData("personalInfo", "contact", "", e.target.value)}
                  placeholder="Your mobile number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={profileData.personalInfo.location.state}
                  onChange={(e) => updateNestedProfileData("personalInfo", "location", "state", e.target.value)}
                  placeholder="Your state"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={profileData.personalInfo.location.district}
                  onChange={(e) => updateNestedProfileData("personalInfo", "location", "district", e.target.value)}
                  placeholder="Your district"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="village">Village (Optional)</Label>
                <Input
                  id="village"
                  value={profileData.personalInfo.location.village}
                  onChange={(e) => updateNestedProfileData("personalInfo", "location", "village", e.target.value)}
                  placeholder="Your village"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">PIN Code (Optional)</Label>
                <Input
                  id="pincode"
                  value={profileData.personalInfo.location.pincode}
                  onChange={(e) => updateNestedProfileData("personalInfo", "location", "pincode", e.target.value)}
                  placeholder="Area PIN code"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Farm Details & Infrastructure</h3>
                <p className="text-sm text-gray-600">Tell us about your farming operation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="landSize">Total Land Size (Acres)</Label>
                <Input
                  id="landSize"
                  type="number"
                  value={profileData.farmDetails.totalLandSize}
                  onChange={(e) => updateProfileData("farmDetails", "totalLandSize", Number.parseFloat(e.target.value))}
                  placeholder="Total farming area"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Farming Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={profileData.farmDetails.experienceYears}
                  onChange={(e) => updateProfileData("farmDetails", "experienceYears", Number.parseInt(e.target.value))}
                  placeholder="Years of experience"
                />
              </div>

              <div className="space-y-2">
                <Label>Irrigation Status</Label>
                <Select
                  value={profileData.farmDetails.irrigationStatus}
                  onValueChange={(value) => updateProfileData("farmDetails", "irrigationStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fully_irrigated">Fully Irrigated</SelectItem>
                    <SelectItem value="partially_irrigated">Partially Irrigated</SelectItem>
                    <SelectItem value="rainfed">Rainfed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storage">Storage Capacity (Quintals)</Label>
                <Input
                  id="storage"
                  type="number"
                  value={profileData.farmDetails.storageCapacity}
                  onChange={(e) =>
                    updateProfileData("farmDetails", "storageCapacity", Number.parseFloat(e.target.value))
                  }
                  placeholder="Storage capacity"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Financial Profile</h3>
                <p className="text-sm text-gray-600">Help us understand your financial preferences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Average Annual Income Range</Label>
                <Select
                  value={profileData.financialProfile.averageAnnualIncome}
                  onValueChange={(value) => updateProfileData("financialProfile", "averageAnnualIncome", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="below_1_lakh">Below ₹1 Lakh</SelectItem>
                    <SelectItem value="1_3_lakh">₹1-3 Lakh</SelectItem>
                    <SelectItem value="3_5_lakh">₹3-5 Lakh</SelectItem>
                    <SelectItem value="5_10_lakh">₹5-10 Lakh</SelectItem>
                    <SelectItem value="above_10_lakh">Above ₹10 Lakh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Preferred Payment Terms</Label>
                <Select
                  value={profileData.financialProfile.preferredPaymentTerms}
                  onValueChange={(value) => updateProfileData("financialProfile", "preferredPaymentTerms", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate Payment</SelectItem>
                    <SelectItem value="7_days">Within 7 Days</SelectItem>
                    <SelectItem value="15_days">Within 15 Days</SelectItem>
                    <SelectItem value="30_days">Within 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 col-span-2">
                <Checkbox
                  id="banking"
                  checked={profileData.financialProfile.bankingAccess}
                  onCheckedChange={(checked) => updateProfileData("financialProfile", "bankingAccess", checked)}
                />
                <Label htmlFor="banking">I have access to banking services</Label>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Sprout className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Agricultural Portfolio</h3>
                <p className="text-sm text-gray-600">Details about your crops and farming practices</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Farmer Type</Label>
                <Select
                  value={profileData.agriculturalPortfolio.farmerType}
                  onValueChange={(value) => updateProfileData("agriculturalPortfolio", "farmerType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single_crop">Single Crop Specialist</SelectItem>
                    <SelectItem value="multi_crop">Multi-Crop Farmer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Crop Details</Label>
                  <Button onClick={addCrop} variant="outline" size="sm">
                    Add Crop
                  </Button>
                </div>

                {profileData.agriculturalPortfolio.crops.map((crop, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Crop Type</Label>
                        <Input
                          value={crop.cropType}
                          onChange={(e) => updateCrop(index, "cropType", e.target.value)}
                          placeholder="e.g., Wheat, Rice"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Variety</Label>
                        <Input
                          value={crop.variety}
                          onChange={(e) => updateCrop(index, "variety", e.target.value)}
                          placeholder="Crop variety"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Annual Production (Quintals)</Label>
                        <Input
                          type="number"
                          value={crop.annualProduction}
                          onChange={(e) => updateCrop(index, "annualProduction", Number.parseFloat(e.target.value))}
                          placeholder="Production quantity"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="patterns">Seasonal Patterns</Label>
                <Textarea
                  id="patterns"
                  value={profileData.agriculturalPortfolio.seasonalPatterns}
                  onChange={(e) => updateProfileData("agriculturalPortfolio", "seasonalPatterns", e.target.value)}
                  placeholder="Describe your crop rotation and seasonal patterns"
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Market Engagement History</h3>
                <p className="text-sm text-gray-600">Your experience with buyers and markets</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Past Pricing Experience</Label>
                <Select
                  value={profileData.marketEngagement.pastPricingExperience}
                  onValueChange={(value) => updateProfileData("marketEngagement", "pastPricingExperience", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent - Always got fair prices</SelectItem>
                    <SelectItem value="good">Good - Usually satisfied</SelectItem>
                    <SelectItem value="average">Average - Mixed experiences</SelectItem>
                    <SelectItem value="poor">Poor - Often underpriced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Transportation Preference</Label>
                <Select
                  value={profileData.marketEngagement.transportationPreference}
                  onValueChange={(value) => updateProfileData("marketEngagement", "transportationPreference", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self">Self-arranged</SelectItem>
                    <SelectItem value="buyer_arranged">Buyer arranged</SelectItem>
                    <SelectItem value="cooperative">Through cooperative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 col-span-2">
                <Checkbox
                  id="contract"
                  checked={profileData.marketEngagement.contractFarmingExperience}
                  onCheckedChange={(checked) =>
                    updateProfileData("marketEngagement", "contractFarmingExperience", checked)
                  }
                />
                <Label htmlFor="contract">I have experience with contract farming</Label>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Technology & Communication</h3>
                <p className="text-sm text-gray-600">How you prefer to communicate and use technology</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Digital Literacy Level</Label>
                <Select
                  value={profileData.technologyProfile.digitalLiteracy}
                  onValueChange={(value) => updateProfileData("technologyProfile", "digitalLiteracy", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High - Comfortable with apps and digital tools</SelectItem>
                    <SelectItem value="medium">Medium - Basic smartphone usage</SelectItem>
                    <SelectItem value="low">Low - Prefer simple interfaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Communication Preference</Label>
                <Select
                  value={profileData.technologyProfile.communicationPreference}
                  onValueChange={(value) => updateProfileData("technologyProfile", "communicationPreference", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voice">Voice calls preferred</SelectItem>
                    <SelectItem value="text">Text messages preferred</SelectItem>
                    <SelectItem value="both">Both voice and text</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 col-span-2">
                <Checkbox
                  id="quality"
                  checked={profileData.technologyProfile.qualityTestingAccess}
                  onCheckedChange={(checked) => updateProfileData("technologyProfile", "qualityTestingAccess", checked)}
                />
                <Label htmlFor="quality">I have access to quality testing facilities</Label>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="h-8 w-8 text-green-600" />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Profile Complete!</h4>
                  <p className="text-sm text-gray-600">Ready to activate your personalized AI negotiation system</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-green-700 mb-4">
                <CheckCircle className="h-4 w-4" />
                <span>Comprehensive farmer profile collected</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-blue-700">
                <Sparkles className="h-4 w-4" />
                <span>AI negotiation strategies will be personalized for your farming operation</span>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Bot className="h-16 w-16 text-green-600 animate-pulse" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-6 w-6 text-blue-500 animate-spin" />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">Activating Contract Creator AI</h3>
            <p className="text-gray-600 mb-6">
              Processing your profile and preparing personalized negotiation strategies...
            </p>

            <div className="space-y-2 text-sm text-left">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Profile data validated</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>AI strategies personalized</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Clock className="h-4 w-4 animate-spin" />
                <span>Redirecting to negotiation platform...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Contract Creator AI
                </CardTitle>
                <p className="text-gray-600 mt-1">Building your comprehensive farmer profile</p>
              </div>
            </div>

            <Progress value={(currentStep / 6) * 100} className="mt-4" />
            <p className="text-center text-sm text-gray-600 mt-2">
              Step {currentStep} of 6 - {Math.round((currentStep / 6) * 100)}% Complete
            </p>
          </CardHeader>

          <CardContent className="p-8">
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                Previous
              </Button>

              {currentStep < 6 ? (
                <Button
                  onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 6))}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleCompleteProfile}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white flex items-center gap-2"
                  disabled={isProcessing}
                >
                  Complete Profile & Start Negotiation
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { ContractCreatorAI }
export default ContractCreatorAI
