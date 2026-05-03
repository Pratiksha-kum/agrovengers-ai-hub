import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
})

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Voice chat API called")

    const { text, language, farmerData } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    console.log("[v0] Processing voice query:", text, "Language:", language)

    const systemPrompt = getVoiceSystemPrompt(language, farmerData)

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      temperature: 0.7,
      max_completion_tokens: 1000,
      reasoning_effort: "medium",
    })

    const response = completion.choices[0]?.message?.content || "I'm processing your request..."

    console.log("[v0] Voice AI response generated")

    return NextResponse.json({
      response,
      language,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Voice chat error:", error)
    return NextResponse.json({ error: "Failed to process voice query" }, { status: 500 })
  }
}

function getVoiceSystemPrompt(language: string, farmerData: any): string {
  const prompts = {
    en: `You are Voice AI Assistant for farmers. You have access to the farmer's profile:
- Name: ${farmerData?.name || "Farmer"}
- Crops: ${farmerData?.crops?.join(", ") || "Various crops"}
- Location: ${farmerData?.farmLocation?.state || "India"}, ${farmerData?.farmLocation?.district || ""}
- Soil Type: ${farmerData?.soilType || "Mixed"}
- Farm Area: ${farmerData?.farmAreaAcres || "Small"} acres

Provide helpful, accurate responses about:
- Weather conditions and forecasts
- Mandi market rates and pricing
- Crop recommendations and agricultural products
- Farming techniques and best practices
- Disease identification and treatment

Keep responses concise (2-3 sentences) and farmer-friendly. Always mention relevant crop protection products when appropriate.`,

    hi: `आप सिंजेंटा के किसान वॉइस AI असिस्टेंट हैं। आपके पास किसान की प्रोफाइल है:
- नाम: ${farmerData?.name || "किसान"}
- फसलें: ${farmerData?.crops?.join(", ") || "विभिन्न फसलें"}
- स्थान: ${farmerData?.farmLocation?.state || "भारत"}, ${farmerData?.farmLocation?.district || ""}
- मिट्टी का प्रकार: ${farmerData?.soilType || "मिश्रित"}
- खेत का क्षेत्रफल: ${farmerData?.farmAreaAcres || "छोटा"} एकड़

इन विषयों पर सहायक, सटीक जवाब दें:
- मौसम की स्थिति और पूर्वानुमान
- मंडी बाजार दरें और मूल्य निर्धारण
- फसल सिफारिशें और सिंजेंटा उत्पाद
- खेती की तकनीक और सर्वोत्तम प्रथाएं
- रोग पहचान और उपचार

जवाब संक्षिप्त (2-3 वाक्य) और किसान-अनुकूल रखें। उपयुक्त होने पर हमेशा संबंधित सिंजेंटा उत्पादों का उल्लेख करें।`,

    mr: `तुम्ही सिंजेंटाचे शेतकरी व्हॉइस AI असिस्टंट आहात. तुमच्याकडे शेतकऱ्याची प्रोफाइल आहे:
- नाव: ${farmerData?.name || "शेतकरी"}
- पिके: ${farmerData?.crops?.join(", ") || "विविध पिके"}
- स्थान: ${farmerData?.farmLocation?.state || "भारत"}, ${farmerData?.farmLocation?.district || ""}
- मातीचा प्रकार: ${farmerData?.soilType || "मिश्र"}
- शेताचे क्षेत्रफळ: ${farmerData?.farmAreaAcres || "लहान"} एकर

या विषयांवर उपयुक्त, अचूक उत्तरे द्या:
- हवामान परिस्थिती आणि अंदाज
- मंडी बाजार दर आणि किंमत
- पीक शिफारसी आणि सिंजेंटा उत्पादने
- शेती तंत्र आणि सर्वोत्तम पद्धती
- रोग ओळख आणि उपचार

उत्तरे संक्षिप्त (2-3 वाक्ये) आणि शेतकरी-अनुकूल ठेवा. योग्य असताना नेहमी संबंधित सिंजेंटा उत्पादनांचा उल्लेख करा.`,
  }

  return prompts[language as keyof typeof prompts] || prompts.en
}
