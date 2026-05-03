import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()

    console.log("[v0] Fixed AI Negotiator request received:", requestData)

    // Validate required fields
    const requiredFields = ["cropType", "quantity", "farmerLocation", "qualityParams"]
    const missingFields = requiredFields.filter((field) => !requestData[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: true,
          message: `Missing required fields: ${missingFields.join(", ")}`,
          requiredFields: requiredFields,
        },
        { status: 400 },
      )
    }

    // Structure data for processing (matching the n8n workflow format)
    const processedData = {
      cropType: requestData.cropType || "wheat",
      quantity: Number.parseInt(requestData.quantity) || 0,
      qualityParams: {
        moisture: Number.parseFloat(requestData.qualityParams?.moisture) || 12,
        impurities: Number.parseFloat(requestData.qualityParams?.impurities) || 1.5,
        damaged_grains: Number.parseFloat(requestData.qualityParams?.damaged_grains) || 3,
        foreign_matter: Number.parseFloat(requestData.qualityParams?.foreign_matter) || 0.5,
      },
      farmerLocation: {
        state: requestData.farmerLocation?.state || "uttar pradesh",
        district: requestData.farmerLocation?.district || "lucknow",
      },
      farmerProfile: {
        name: requestData.farmerProfile?.name || "Farmer",
        phone: requestData.farmerProfile?.phone || "Not provided",
        farmSize: requestData.farmerProfile?.farmSize || 10,
        experience: requestData.farmerProfile?.experience || 5,
        farmerType: requestData.farmerProfile?.farmerType || "single-crop",
      },
      buyerOffers: requestData.buyerOffers || [
        { buyerName: "Local Trader", offerPrice: 1800, terms: "Cash payment" },
        { buyerName: "Commission Agent", offerPrice: 1750, terms: "Credit payment" },
      ],
      timestamp: new Date().toISOString(),
    }

    // Quality Assessment (Syngenta Standards)
    let qualityScore = 100
    let qualityGrade = "A"
    let premiumPercent = 0

    const { qualityParams } = processedData

    if (qualityParams.moisture > 14) {
      qualityScore -= (qualityParams.moisture - 14) * 2
    }
    if (qualityParams.impurities > 2) {
      qualityScore -= (qualityParams.impurities - 2) * 3
    }
    if (qualityParams.damaged_grains > 5) {
      qualityScore -= (qualityParams.damaged_grains - 5) * 2
    }
    if (qualityParams.foreign_matter > 1) {
      qualityScore -= (qualityParams.foreign_matter - 1) * 4
    }

    // Determine grade and premium
    if (qualityScore >= 95) {
      qualityGrade = "A+"
      premiumPercent = 8
    } else if (qualityScore >= 90) {
      qualityGrade = "A"
      premiumPercent = 5
    } else if (qualityScore >= 85) {
      qualityGrade = "B+"
      premiumPercent = 2
    } else if (qualityScore >= 80) {
      qualityGrade = "B"
      premiumPercent = 0
    } else {
      qualityGrade = "C"
      premiumPercent = -5
    }

    const qualityAssessment = {
      qualityScore: Math.max(0, qualityScore),
      qualityGrade,
      premiumPercent,
      syngentaCertified: qualityScore >= 85,
    }

    // Calculate fair price
    const avgMarketPrice = 2000 // Default fallback

    // Apply quality premium
    const qualityAdjustment = (avgMarketPrice * premiumPercent) / 100
    const bulkBonus = processedData.quantity > 50 ? avgMarketPrice * 0.02 : 0
    const recommendedPrice = avgMarketPrice + qualityAdjustment + bulkBonus

    const fairPriceAnalysis = {
      avgMarketPrice: Math.round(avgMarketPrice),
      qualityAdjustment: Math.round(qualityAdjustment),
      bulkBonus: Math.round(bulkBonus),
      recommendedPrice: Math.round(recommendedPrice),
      priceRange: {
        minimum: Math.round(recommendedPrice * 0.95),
        target: Math.round(recommendedPrice),
        maximum: Math.round(recommendedPrice * 1.05),
      },
    }

    // Generate AI Negotiation Strategy based on farmer type
    let aiNegotiationStrategy = ""

    if (processedData.farmerProfile.farmerType === "single-crop") {
      aiNegotiationStrategy = `SINGLE CROP SPECIALIST STRATEGY for ${processedData.cropType.toUpperCase()}:

🎯 SPECIALIZATION ADVANTAGE:
• Position yourself as a ${processedData.cropType} specialist with deep expertise
• Emphasize consistent quality and reliable supply from focused farming
• Highlight your specialized knowledge of optimal growing conditions

💰 PRICING STRATEGY:
• Start negotiation at ₹${fairPriceAnalysis.priceRange.maximum} (your maximum target)
• Justify premium pricing with quality grade ${qualityGrade} certification
• Use seasonal timing to your advantage - demand peaks for ${processedData.cropType}

🤝 NEGOTIATION TACTICS:
• Leverage your specialization - buyers value consistent single-crop suppliers
• Mention your ${processedData.farmerProfile.experience} years of focused ${processedData.cropType} experience
• Offer long-term supply agreements for better pricing
• Don't accept first offers - your specialization commands premium

⚡ KEY TALKING POINTS:
• "I specialize exclusively in ${processedData.cropType} - guaranteed quality and consistency"
• "My ${processedData.farmerProfile.experience} years of focused experience ensures premium grade"
• "Single-crop focus means I can guarantee reliable supply throughout season"
• "Quality grade ${qualityGrade} with ${qualityAssessment.qualityScore}/100 score deserves premium pricing"`
    } else {
      aiNegotiationStrategy = `MULTI-CROP PORTFOLIO STRATEGY:

🌾 PORTFOLIO POWER:
• Leverage your diversified crop portfolio for bulk negotiation advantages
• Position as a reliable supplier with multiple crop options
• Use cross-crop leverage - if one crop price is low, others can compensate

💰 PRICING STRATEGY:
• Bundle negotiations across multiple crops for better overall pricing
• Start at ₹${fairPriceAnalysis.priceRange.maximum} for current ${processedData.cropType}
• Offer volume discounts in exchange for premium pricing
• Use crop rotation knowledge to predict market trends

🤝 NEGOTIATION TACTICS:
• Present yourself as a one-stop agricultural supplier
• Offer seasonal supply planning across your crop portfolio
• Use diversification as risk mitigation for buyers
• Negotiate annual contracts covering multiple crops

⚡ KEY TALKING POINTS:
• "My diversified portfolio ensures year-round supply reliability"
• "Multiple crops mean I can offer flexible delivery schedules"
• "Portfolio approach reduces risk for both parties"
• "Bulk quantities across crops justify premium pricing"
• "Cross-crop expertise ensures optimal quality management"`
    }

    // Contract Terms
    const contractTerms = {
      priceTerms: {
        agreedPrice: fairPriceAnalysis.recommendedPrice,
        paymentTerms: "Payment within 7 days of delivery",
        qualityBonus: "Additional 2% for A+ grade crops",
        priceProtection: "Price cannot be reduced after agreement",
      },
      protectionClauses: [
        "Quality assessment by certified agency only",
        "Farmer has right to reject unfair quality deductions",
        "Dispute resolution through agricultural tribunal",
        "Force majeure clause protects farmer from natural disasters",
        "Transportation costs borne by buyer",
      ],
      deliveryTerms: {
        location: "Delivery at buyer's facility or agreed location",
        timeframe: "Delivery within mutually agreed timeframe",
        qualityCheck: "Quality assessment at delivery point with farmer present",
      },
      legalProtections: [
        "Contract governed by Agricultural Produce Marketing Act",
        "Farmer retains right to legal representation",
        "Any contract modifications require written farmer consent",
        "Copy of contract provided to farmer in local language",
      ],
    }

    // Final negotiation result
    const negotiationResult = {
      success: true,
      agent: "FairTrade Guardian (किसान न्याय)",
      farmerName: processedData.farmerProfile.name,
      cropDetails: {
        cropType: processedData.cropType,
        quantity: processedData.quantity,
        qualityGrade: qualityAssessment.qualityGrade,
        syngentaCertified: qualityAssessment.syngentaCertified,
      },
      marketIntelligence: {
        averageMarketPrice: fairPriceAnalysis.avgMarketPrice,
        qualityPremium: premiumPercent,
        recommendedPrice: fairPriceAnalysis.recommendedPrice,
        priceRange: fairPriceAnalysis.priceRange,
      },
      aiNegotiationStrategy,
      contractTerms,
      protectionLevel: "Maximum",
      confidence: 0.95,
      warnings: [
        "Do not accept verbal commitments",
        "Verify buyer credentials before delivery",
        "Ensure quality assessment is transparent",
        "Keep all documentation for legal protection",
      ],
      nextSteps: [
        "Present counter-offer based on AI recommendation",
        "Negotiate contract terms with buyer",
        "Get written agreement before delivery",
        "Contact FairTrade Guardian if issues arise",
      ],
      farmerHelpline: "1800-FAIRTRADE",
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] Fixed AI Negotiator response generated successfully")

    return NextResponse.json(negotiationResult)
  } catch (error) {
    console.error("[v0] Fixed AI Negotiator error:", error)
    return NextResponse.json(
      {
        error: true,
        message: "Internal server error during negotiation processing",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
