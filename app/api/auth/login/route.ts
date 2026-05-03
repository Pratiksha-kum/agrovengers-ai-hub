import { type NextRequest, NextResponse } from "next/server"

const farmerDatabase = new Map()

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
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const storedFarmer = farmerDatabase.get(email)

    if (!storedFarmer || storedFarmer.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const { password: _, ...farmerData } = storedFarmer

    return NextResponse.json({
      success: true,
      farmer: farmerData,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
