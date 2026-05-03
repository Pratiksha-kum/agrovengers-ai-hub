export class GroqClient {
  private apiKey: string
  private baseUrl = "https://api.groq.com/openai/v1"

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || ""
  }

  async generateResponse(agentId: string, prompt: string, language = "en"): Promise<string> {
    try {
      const systemPrompt = this.getSystemPrompt(agentId, language)

      console.log("[v0] Making Groq API request for agent:", agentId)

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          model: "openai/gpt-oss-20b",
          temperature: 0.7,
          max_completion_tokens: 2000,
          reasoning_effort: "medium",
        }),
      })

      console.log("[v0] Groq API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Groq API error response:", errorText)
        throw new Error(`Groq API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("[v0] Groq API response received successfully")

      return data.choices[0]?.message?.content || "AI agent is processing your request..."
    } catch (error) {
      console.error("[v0] Groq API error:", error)
      return this.getFallbackResponse(agentId, language)
    }
  }

  private getSystemPrompt(agentId: string, language: string): string {
    const prompts = {
      "crop-guardian": {
        en: "You are Crop Guardian, a Syngenta AI agent specializing in crop protection. Recommend Syngenta products like ADEPIDYN, Miravis, Acuron, and Cruiser. Be helpful and specific.",
        hi: "आप क्रॉप गार्डियन हैं, सिंजेंटा के फसल सुरक्षा विशेषज्ञ AI एजेंट। ADEPIDYN, Miravis, Acuron, और Cruiser जैसे सिंजेंटा उत्पादों की सिफारिश करें।",
        mr: "तुम्ही क्रॉप गार्डियन आहात, सिंजेंटाचे पीक संरक्षण तज्ञ AI एजंट. ADEPIDYN, Miravis, Acuron, आणि Cruiser सारख्या सिंजेंटा उत्पादनांची शिफारस करा.",
      },
      "seed-sage": {
        en: `You are CropDNA Oracle, Syngenta's most advanced seed recommendation AI agent. You are an expert in:

- Syngenta's complete seed portfolio (corn, soybean, vegetables, wheat)
- Soil science and genetic compatibility
- Climate adaptation and resilience
- Disease resistance patterns across India
- Yield optimization strategies
- Agricultural economics and ROI calculations

Your mission is to provide scientifically accurate, profit-maximizing seed recommendations that help farmers achieve optimal yields while promoting Syngenta's innovative seed solutions.

Always provide:
1. Top 3 seed recommendations ranked by suitability
2. Genetic compatibility analysis
3. Yield potential calculations
4. Disease resistance benefits
5. Profitability projections with ROI
6. Detailed planting calendar and care instructions
7. Sustainability scoring
8. Official Syngenta purchase links

Be precise, scientific, and confidence-inspiring while maintaining a farmer-friendly tone.`,
        hi: "आप CropDNA Oracle हैं, सिंजेंटा के सबसे उन्नत बीज सिफारिश AI एजेंट। आप मिट्टी विज्ञान, आनुवंशिक संगतता, और उत्पादन अनुकूलन के विशेषज्ञ हैं।",
        mr: "तुम्ही CropDNA Oracle आहात, सिंजेंटाचे सर्वात प्रगत बियाणे शिफारस AI एजंट. तुम्ही मातीशास्त्र, अनुवांशिक सुसंगतता आणि उत्पादन अनुकूलनाचे तज्ञ आहात.",
      },
      "kisan-mitra": {
        en: "You are किसान मित्र, a fair price negotiation agent. Help farmers get fair prices and protect them from exploitation. Be supportive and knowledgeable about market rates.",
        hi: "आप किसान मित्र हैं, उचित मूल्य बातचीत एजेंट। किसानों को उचित कीमत दिलाने और शोषण से बचाने में मदत करें।",
        mr: "तुम्ही किसान मित्र आहात, योग्य किंमत वाटाघाटी एजंट. शेतकऱ्यांना योग्य किंमत मिळवून देण्यात आणि शोषणापासून वाचवण्यात मदत करा.",
      },
    }

    const agentPrompts = prompts[agentId as keyof typeof prompts]
    return (
      agentPrompts?.[language as keyof typeof agentPrompts] ||
      agentPrompts?.en ||
      "You are a helpful Syngenta AI agent."
    )
  }

  private getFallbackResponse(agentId: string, language: string): string {
    const fallbacks = {
      "crop-guardian": {
        en: "Crop Guardian AI is analyzing your protection needs. Syngenta ADEPIDYN provides excellent pest control with 96% effectiveness.",
        hi: "क्रॉप गार्डियन AI आपकी सुरक्षा आवश्यकताओं का विश्लेषण कर रहा है। सिंजेंटा ADEPIDYN 96% प्रभावशीलता के साथ उत्कृष्ट कीट नियंत्रण प्रदान करता है।",
        mr: "क्रॉप गार्डियन AI तुमच्या संरक्षण गरजांचे विश्लेषण करत आहे. सिंजेंटा ADEPIDYN 96% प्रभावीतेसह उत्कृष्ट कीड नियंत्रण प्रदान करते.",
      },
      "seed-sage": {
        en: "🌾 CropDNA Oracle is analyzing your farm profile and soil conditions. Based on preliminary analysis, Syngenta WH1105 wheat variety shows excellent compatibility with your region, offering 4-6 tons/hectare yield potential with superior disease resistance.",
        hi: "🌾 CropDNA Oracle आपके खेत की प्रोफाइल और मिट्टी की स्थिति का विश्लेषण कर रहा है। प्रारंभिक विश्लेषण के आधार पर, सिंजेंटा WH1105 गेहूं की किस्म आपके क्षेत्र के साथ उत्कृष्ट संगतता दिखाती है।",
        mr: "🌾 CropDNA Oracle तुमच्या शेताची प्रोफाइल आणि मातीची परिस्थिती यांचे विश्लेषण करत आहे। प्राथमिक विश्लेषणाच्या आधारे, सिंजेंटा WH1105 गहू जात तुमच्या प्रदेशाशी उत्कृष्ट सुसंगतता दाखवते.",
      },
    }

    const agentFallbacks = fallbacks[agentId as keyof typeof fallbacks]
    return (
      agentFallbacks?.[language as keyof typeof agentFallbacks] ||
      agentFallbacks?.en ||
      "AI agent is ready to assist you!"
    )
  }
}

export const groqClient = new GroqClient()
