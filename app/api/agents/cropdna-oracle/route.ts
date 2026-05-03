import { type NextRequest, NextResponse } from "next/server"
import { groqClient } from "@/lib/groq-client"

const syngentaSeedDatabase = {
  corn: [
    {
      variety: "NK603",
      type: "Hybrid Corn",
      traits: ["Glyphosate tolerance", "High yield"],
      climateZone: ["Tropical", "Subtropical"],
      soilPH: [6.0, 7.5],
      yieldPotential: "8-12 tons/hectare",
      disease_resistance: ["Corn borer", "Gray leaf spot"],
      price_per_kg: 450,
      region: ["Maharashtra", "Punjab", "Uttar Pradesh"],
      purchaseLink: "https://www.syngenta.co.in/product/crop-protection/seeds/corn/nk603",
    },
    {
      variety: "NK740",
      type: "Hybrid Corn",
      traits: ["Drought tolerance", "Early maturity"],
      climateZone: ["Arid", "Semi-arid"],
      soilPH: [6.5, 8.0],
      yieldPotential: "6-9 tons/hectare",
      disease_resistance: ["Stalk rot", "Ear rot"],
      price_per_kg: 380,
      region: ["Rajasthan", "Gujarat", "Haryana"],
      purchaseLink: "https://www.syngenta.co.in/product/crop-protection/seeds/corn/nk740",
    },
  ],
  soybean: [
    {
      variety: "RR2Y",
      type: "Genetically Modified Soybean",
      traits: ["Roundup Ready", "High protein"],
      climateZone: ["Tropical", "Subtropical"],
      soilPH: [6.0, 7.2],
      yieldPotential: "3-4 tons/hectare",
      disease_resistance: ["Soybean rust", "Pod borer"],
      price_per_kg: 520,
      region: ["Madhya Pradesh", "Maharashtra", "Rajasthan"],
      purchaseLink: "https://www.syngenta.co.in/product/crop-protection/seeds/soybean/rr2y",
    },
  ],
  vegetables: [
    {
      variety: "Tomato F1 Hybrid",
      type: "Determinate Tomato",
      traits: ["Disease resistant", "High yield"],
      climateZone: ["Tropical", "Temperate"],
      soilPH: [6.0, 6.8],
      yieldPotential: "60-80 tons/hectare",
      disease_resistance: ["Late blight", "Bacterial wilt"],
      price_per_10g: 1200,
      region: ["All India"],
      purchaseLink: "https://www.syngenta.co.in/product/crop-protection/seeds/vegetables/tomato-f1",
    },
  ],
  wheat: [
    {
      variety: "WH1105",
      type: "High Yielding Wheat",
      traits: ["Disease resistant", "Early maturity"],
      climateZone: ["Temperate", "Subtropical"],
      soilPH: [6.0, 8.0],
      yieldPotential: "4-6 tons/hectare",
      disease_resistance: ["Rust", "Bunt"],
      price_per_kg: 65,
      region: ["All India"],
      purchaseLink: "https://www.syngenta.co.in/product/crop-protection/seeds/wheat/wh1105",
    },
  ],
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] CropDNA Oracle received request:", body)

    const farmerData = {
      location: body.farmDetails?.location || body.location || "Delhi",
      soilPH: Number.parseFloat(body.soilAnalysis?.ph || body.ph || "7.0"),
      cropPreference: (
        body.farmDetails?.cropPreference ||
        body.cropPreference ||
        body.crop_type ||
        "any"
      ).toLowerCase(),
      farmSize: body.farmDetails?.farmSize || body.farmSize || "5 acres",
      budget: body.farmDetails?.budget || body.budget || "₹50,000",
      irrigation: body.farmDetails?.irrigation || body.irrigation || "Drip irrigation",
    }

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${farmerData.location}&appid=cad0e938782d57ceb23949b23b08a20c&units=metric`,
    )
    const weatherData = await weatherResponse.json()

    let availableSeeds: any[] = []

    if (farmerData.cropPreference === "any" || farmerData.cropPreference === "corn") {
      availableSeeds = availableSeeds.concat(syngentaSeedDatabase.corn)
    }
    if (farmerData.cropPreference === "any" || farmerData.cropPreference === "soybean") {
      availableSeeds = availableSeeds.concat(syngentaSeedDatabase.soybean)
    }
    if (farmerData.cropPreference === "any" || farmerData.cropPreference === "vegetables") {
      availableSeeds = availableSeeds.concat(syngentaSeedDatabase.vegetables)
    }
    if (farmerData.cropPreference === "any" || farmerData.cropPreference === "wheat") {
      availableSeeds = availableSeeds.concat(syngentaSeedDatabase.wheat)
    }

    // If no specific crop match, return all seeds
    if (availableSeeds.length === 0) {
      availableSeeds = [
        ...syngentaSeedDatabase.corn,
        ...syngentaSeedDatabase.soybean,
        ...syngentaSeedDatabase.vegetables,
        ...syngentaSeedDatabase.wheat,
      ]
    }

    const filteredSeeds = availableSeeds.filter((seed) => {
      const phMatch = farmerData.soilPH >= seed.soilPH[0] && farmerData.soilPH <= seed.soilPH[1]
      const regionMatch =
        seed.region.includes("All India") ||
        seed.region.some((r: string) => farmerData.location.toLowerCase().includes(r.toLowerCase()))
      return phMatch && regionMatch
    })

    const analysisPrompt = `GENETIC CROP ANALYSIS REQUEST:

FARM PROFILE:
Location: ${farmerData.location}, India
Farm Size: ${farmerData.farmSize}
Crop Preference: ${farmerData.cropPreference}
Budget: ${farmerData.budget}
Irrigation: ${farmerData.irrigation}

SOIL ANALYSIS:
pH Level: ${farmerData.soilPH}
Nitrogen: Medium
Phosphorus: Low
Potassium: High
Organic Matter: 2.5%
Texture: Clay loam
Moisture: Adequate

WEATHER CONDITIONS:
Current Temperature: ${weatherData.main?.temp || 25}°C
Humidity: ${weatherData.main?.humidity || 65}%
Description: ${weatherData.weather?.[0]?.description || "Clear sky"}

AVAILABLE SYNGENTA SEEDS:
${JSON.stringify(filteredSeeds, null, 2)}

TASK: Provide a comprehensive CropDNA Oracle Analysis Report in the following structured format:

## 🧬 GENETIC COMPATIBILITY ANALYSIS
| Parameter | Analysis | Recommendation |
|-----------|----------|----------------|
| Soil pH Match | [Analysis] | [Recommendation] |
| Climate Suitability | [Analysis] | [Recommendation] |
| Disease Resistance | [Analysis] | [Recommendation] |

## 💰 PROFITABILITY PROJECTIONS
| Seed Variety | Investment (₹) | Expected Yield | Revenue (₹) | Profit (₹) | ROI (%) |
|--------------|----------------|----------------|-------------|------------|---------|
| [Variety 1] | [Amount] | [Yield] | [Revenue] | [Profit] | [ROI] |
| [Variety 2] | [Amount] | [Yield] | [Revenue] | [Profit] | [ROI] |

## 📅 OPTIMAL PLANTING CALENDAR
| Month | Activity | Syngenta Product | Application Rate |
|-------|----------|------------------|------------------|
| [Month] | [Activity] | [Product] | [Rate] |

## ⚠️ RISK ASSESSMENT
| Risk Factor | Probability | Impact | Mitigation Strategy |
|-------------|-------------|--------|-------------------|
| [Risk] | [Probability] | [Impact] | [Strategy] |

## 🎯 TOP 3 SYNGENTA RECOMMENDATIONS
1. **[Variety Name]** - [Detailed analysis with yield potential, price, and benefits]
2. **[Variety Name]** - [Detailed analysis with yield potential, price, and benefits]  
3. **[Variety Name]** - [Detailed analysis with yield potential, price, and benefits]

Focus on Syngenta-specific products and provide actionable insights for maximum farmer success.`

    const aiResponse = await groqClient.generateResponse("seed-sage", analysisPrompt, "en")

    const response = {
      success: true,
      analysis: aiResponse,
      recommendedSeeds: filteredSeeds.slice(0, 3),
      farmerProfile: farmerData,
      weatherConditions: {
        temperature: weatherData.main?.temp || 25,
        humidity: weatherData.main?.humidity || 65,
        description: weatherData.weather?.[0]?.description || "Clear sky",
        location: weatherData.name || farmerData.location,
      },
      totalSeedsAnalyzed: filteredSeeds.length,
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] CropDNA Oracle analysis completed successfully")
    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] CropDNA Oracle error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze crop data",
        fallbackRecommendation:
          "Based on general analysis, Syngenta WH1105 wheat variety is recommended for most Indian regions with 4-6 tons/hectare yield potential.",
      },
      { status: 500 },
    )
  }
}
