import { type NextRequest, NextResponse } from "next/server"
import type { FarmerData } from "@/contexts/auth-context"

const registeredEmails = new Set<string>()
const farmerDatabase = new Map<string, FarmerData & { password: string }>()

registeredEmails.add("devconhack@gmail.com")
farmerDatabase.set("devconhack@gmail.com", {
  id: "test-farmer-1",
  name: "DevCon Hacker",
  age: 30,
  country: "India",
  phoneNumber: "+91-9876543210",
  email: "devconhack@gmail.com",
  password: "test123",
  language: "en",
  farmingType: "multiple",
  crops: ["wheat", "tomato", "cotton"],
  farmLocation: {
    state: "Maharashtra",
    district: "Pune",
  },
  soilType: "loamy",
  farmAreaAcres: 5.0,
  irrigationType: "drip",
  carbonCreditParticipation: true,
  createdAt: "2024-01-01T00:00:00.000Z",
})

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.name || !data.age || !data.language || !data.email || !data.password) {
      return NextResponse.json(
        { error: "Missing required fields: name, age, language, email, and password are required" },
        { status: 400 },
      )
    }

    if (registeredEmails.has(data.email)) {
      return NextResponse.json(
        { error: "Email already exists. Please use a different email or sign in." },
        { status: 409 },
      )
    }

    // Create new farmer record
    const newFarmer: FarmerData = {
      id: Date.now().toString(),
      name: data.name,
      age: Number.parseInt(data.age),
      country: data.country || "India",
      phoneNumber: data.phoneNumber,
      email: data.email,
      language: data.language,
      farmingType: data.farmingType || "single",
      crops: data.crops || [],
      farmLocation: data.farmLocation,
      soilType: data.soilType,
      farmAreaAcres: data.farmAreaAcres ? Number.parseFloat(data.farmAreaAcres) : undefined,
      irrigationType: data.irrigationType,
      carbonCreditParticipation: data.carbonCreditParticipation || false,
      createdAt: new Date().toISOString(),
    }

    registeredEmails.add(data.email)
    farmerDatabase.set(data.email, { ...newFarmer, password: data.password })

    return NextResponse.json({
      success: true,
      farmer: newFarmer,
      message: "Farmer registered successfully",
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

const exportedFarmerDatabase = farmerDatabase
export { exportedFarmerDatabase }
