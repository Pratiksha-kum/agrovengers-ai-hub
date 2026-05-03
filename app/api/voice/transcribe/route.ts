import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Voice transcription API called")

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File
    const language = (formData.get("language") as string) || "en"

    if (!audioFile) {
      console.log("[v0] No audio file provided")
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    console.log("[v0] Processing audio file:", audioFile.name, "Size:", audioFile.size, "Type:", audioFile.type)

    if (!process.env.GROQ_API_KEY) {
      console.error("[v0] GROQ_API_KEY not found in environment variables")
      return NextResponse.json({ error: "API configuration error" }, { status: 500 })
    }

    let processedFile = audioFile

    // If the file is webm, we need to ensure it's properly formatted
    if (audioFile.type.includes("webm")) {
      // Create a new file with proper extension
      processedFile = new File([audioFile], "audio.webm", {
        type: "audio/webm",
      })
    }

    console.log("[v0] Sending to Groq API with model: whisper-large-v3-turbo")

    const transcription = await groq.audio.transcriptions.create({
      file: processedFile,
      model: "whisper-large-v3-turbo",
      response_format: "json", // Use simple json format instead of verbose_json
      language: language === "hi" ? "hi" : language === "mr" ? "mr" : "en",
    })

    console.log("[v0] Transcription completed successfully:", transcription.text)

    return NextResponse.json({
      text: transcription.text,
      language: language,
    })
  } catch (error: any) {
    console.error("[v0] Voice transcription error:", error)
    console.error("[v0] Error details:", {
      message: error.message,
      status: error.status,
      code: error.code,
    })

    let errorMessage = "Failed to transcribe audio"
    if (error.message?.includes("Invalid file format")) {
      errorMessage = "Unsupported audio format"
    } else if (error.message?.includes("API key")) {
      errorMessage = "API configuration error"
    } else if (error.status === 413) {
      errorMessage = "Audio file too large"
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
