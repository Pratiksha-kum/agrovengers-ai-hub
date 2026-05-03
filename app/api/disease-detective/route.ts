import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { image, farmerProfile, cropType } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    // Extract base64 data from data URL
    const base64Data = image.split(",")[1]
    if (!base64Data) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 })
    }

    // Build request body matching n8n workflow
    const requestBody = {
      model: "@bedrock-prod-us-east-1/us.anthropic.claude-opus-4-1-20250805-v1:0",
      messages: [
        {
          role: "system",
          content: `You are Disease Detective, Syngenta's expert AI for early crop disease detection and treatment recommendation. Analyze crop images for disease symptoms using accurate agricultural pathology knowledge.

KNOWLEDGE BASE - ACCURATE CROP DISEASES & SYNGENTA PRODUCTS:

Common Diseases & Symptoms:
- Wheat Rust (Puccinia spp.): Orange pustules on leaves/stems, yield loss 20-50%.
- Rice Blast (Magnaporthe oryzae): Lesions with gray centers, eye-shaped spots.
- Tomato Late Blight (Phytophthora infestans): Dark lesions on leaves/fruits, white mold.
- Corn Gray Leaf Spot (Cercospora zeae-maydis): Gray rectangular spots on leaves.
- Soybean Rust (Phakopsora pachyrhizi): Tan/gray pustules on undersides.

Syngenta Products (Use ONLY these with accurate official links):
- ADEPIDYN (Fungicide for cereals): Controls rusts, septoria. Link: https://www.syngenta.co.in/product/crop-protection/fungicide/miravis-duo
- Miravis (Fungicide broad-spectrum): For blast, blight in rice/tomato. Link: https://www.syngenta.co.in/product/crop-protection/fungicide/miravis-duo
- Acuron (Herbicide): Weed control, indirect disease reduction. Link: https://www.syngenta.com/en/crop-protection/acuron
- Cruiser (Insecticide seed treatment): Prevents early insect-vectored diseases. Link: https://www.syngenta.co.in/product/crop-protection/seed-treatment/cruiser

Response Structure:
1. Disease Identification: Name, confidence %, symptoms matched.
2. Severity: Low/Med/High.
3. Treatment: Top 2 Syngenta products with application rates, timing.
4. Prevention: Cultural practices.
5. Purchase: Include exact official links above.

Base diagnosis on image analysis. If unclear, say 'Consult expert'. Be 100% accurate - no hallucinations.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this crop image for early disease signs and recommend Syngenta treatments. Farmer Profile: ${JSON.stringify(farmerProfile)}, Crop: ${cropType}`,
            },
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64Data,
              },
            },
          ],
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }

    // Simulate Portkey API call (using mock response for now since we don't have actual Portkey credentials)
    const mockAnalysis = {
      diseaseName: "Wheat Rust (Puccinia striiformis)",
      confidence: 92,
      severity: "Medium" as const,
      description:
        "Yellow rust infection detected on wheat leaves. This fungal disease causes yellow pustules arranged in stripes on leaf surfaces, leading to reduced photosynthesis and yield loss.",
      symptoms: [
        "Yellow pustules arranged in stripes on leaves",
        "Chlorotic areas around infection sites",
        "Premature leaf senescence",
        "Reduced plant vigor",
      ],
      causes: [
        "Cool, moist weather conditions (15-20°C)",
        "High humidity and morning dew",
        "Dense plant canopy with poor air circulation",
        "Susceptible wheat varieties",
      ],
      treatment: {
        immediate: [
          "Apply ADEPIDYN fungicide at 200ml/acre immediately",
          "Ensure complete coverage of leaf surfaces",
          "Apply during calm weather conditions",
          "Monitor weather for reapplication timing",
        ],
        preventive: [
          "Use resistant wheat varieties",
          "Maintain proper plant spacing",
          "Remove crop residues after harvest",
          "Implement crop rotation practices",
        ],
      },
      syngentaProducts: [
        {
          name: "ADEPIDYN®",
          type: "Fungicide",
          dosage: "200ml/acre",
          price: "₹2,450/L",
          availability: "Available at authorized dealers",
          purchaseLink: "https://www.syngenta.co.in/product/crop-protection/fungicide/miravis-duo",
        },
        {
          name: "Miravis®",
          type: "Fungicide",
          dosage: "150ml/acre",
          price: "₹3,200/L",
          availability: "Available nationwide",
          purchaseLink: "https://www.syngenta.co.in/product/crop-protection/fungicide/miravis-duo",
        },
      ],
      additionalTips: [
        "Apply fungicide before 10 AM or after 4 PM for best results",
        "Use sticker-spreader for better adhesion",
        "Monitor field regularly for early detection",
        "Maintain field hygiene and remove infected debris",
      ],
    }

    return NextResponse.json({
      analysis: mockAnalysis,
      status: "success",
      modelUsed: "Claude Opus 4",
      featureType: "Disease Detection",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Disease detection error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze disease",
        status: "error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
