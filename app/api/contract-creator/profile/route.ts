import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { farmerId, profileData } = await request.json()

    console.log("[v0] Contract Creator API: Saving enhanced farmer profile", {
      farmerId,
      profileType: profileData.agriculturalPortfolio.farmerType,
      cropsCount: profileData.agriculturalPortfolio.crops.length,
      experienceYears: profileData.farmDetails.experienceYears,
    })

    // In a real implementation, this would save to a database
    // For now, we'll simulate successful storage
    const enhancedProfile = {
      id: farmerId,
      ...profileData,
      createdAt: new Date().toISOString(),
      profileVersion: "2.0",
      aiPersonalizationReady: true,
    }

    const aiPersonalization = {
      negotiationStyle: profileData.marketEngagement.pastPricingExperience === "poor" ? "aggressive" : "balanced",
      riskTolerance: profileData.farmDetails.experienceYears > 10 ? "medium" : "low",
      communicationPreference: profileData.technologyProfile.communicationPreference,
      specializations: profileData.agriculturalPortfolio.crops.map((crop) => crop.cropType),
      marketingStrategy: profileData.agriculturalPortfolio.farmerType === "single_crop" ? "specialist" : "diversified",
    }

    return NextResponse.json({
      success: true,
      message: "Enhanced farmer profile saved successfully",
      profileId: farmerId,
      aiPersonalization,
      nextStep: "negotiation_platform",
    })
  } catch (error) {
    console.error("[v0] Contract Creator API: Error saving profile", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save farmer profile",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const farmerId = searchParams.get("farmerId")

    if (!farmerId) {
      return NextResponse.json({ success: false, message: "Farmer ID is required" }, { status: 400 })
    }

    console.log("[v0] Contract Creator API: Retrieving farmer profile", { farmerId })

    // In a real implementation, this would fetch from database
    // For now, return a mock enhanced profile
    const mockProfile = {
      id: farmerId,
      personalInfo: {
        name: "Sample Farmer",
        contact: "+91-9876543210",
        location: {
          state: "Uttar Pradesh",
          district: "Lucknow",
          village: "Sample Village",
          pincode: "226001",
        },
      },
      farmDetails: {
        totalLandSize: 25,
        irrigationStatus: "partially_irrigated",
        storageCapacity: 500,
        experienceYears: 15,
      },
      agriculturalPortfolio: {
        farmerType: "multi_crop",
        crops: [
          {
            cropType: "wheat",
            variety: "HD-2967",
            annualProduction: 150,
            qualityGrade: "A",
            seasonalTiming: "Rabi",
            historicalPricing: "₹2000-2200/quintal",
          },
        ],
      },
      profileVersion: "2.0",
      aiPersonalizationReady: true,
    }

    return NextResponse.json({
      success: true,
      profile: mockProfile,
    })
  } catch (error) {
    console.error("[v0] Contract Creator API: Error retrieving profile", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve farmer profile",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
