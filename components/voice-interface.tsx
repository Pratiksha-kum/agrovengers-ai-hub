"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff } from "lucide-react"

interface VoiceInterfaceProps {
  language: string
}

export function VoiceInterface({ language }: VoiceInterfaceProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [conversation, setConversation] = useState<Array<{ type: "user" | "ai"; message: string }>>([
    {
      type: "ai",
      message:
        language === "hi"
          ? "नमस्कार! मैं आपकी फसल से जुड़े सवालों में मदद कर सकता हूं।"
          : language === "mr"
            ? "नमस्कार! मी तुमच्या पिकाशी संबंधित प्रश्नांमध्ये मदत करू शकतो."
            : "Hello! I can help you with your crop-related questions.",
    },
  ])

  const sampleCommands = [
    {
      hindi: "मेरे कपास की कीमत क्या मिल सकती है?",
      english: "What price can I get for my cotton?",
      marathi: "माझ्या कापसाची किंमत काय मिळू शकते?",
    },
    {
      hindi: "मेरी मिट्टी के लिए कौन से बीज अच्छे हैं?",
      english: "Which seeds are good for my soil?",
      marathi: "माझ्या मातीसाठी कोणते बियाणे चांगले आहेत?",
    },
    {
      hindi: "मेरी फसल में कोई बीमारी तो नहीं?",
      english: "Is there any disease in my crop?",
      marathi: "माझ्या पिकात काही आजार तर नाही?",
    },
  ]

  const handleVoiceToggle = () => {
    setIsListening(!isListening)

    if (!isListening) {
      // Start listening
      setTimeout(() => {
        simulateVoiceInput()
      }, 2000)
    }
  }

  const simulateVoiceInput = () => {
    const randomCommand = sampleCommands[Math.floor(Math.random() * sampleCommands.length)]
    const userMessage =
      language === "hi" ? randomCommand.hindi : language === "mr" ? randomCommand.marathi : randomCommand.english

    setConversation((prev) => [...prev, { type: "user", message: userMessage }])
    setIsListening(false)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage, language)
      setConversation((prev) => [...prev, { type: "ai", message: aiResponse }])
    }, 1500)
  }

  const generateAIResponse = (input: string, lang: string) => {
    if (input.includes("कीमत") || input.includes("price") || input.includes("किंमत")) {
      return lang === "hi"
        ? "आपके कपास की वर्तमान बाजार कीमत ₹5,650 प्रति क्विंटल है। गुणवत्ता प्रीमियम के साथ यह ₹6,000 तक मिल सकती है।"
        : lang === "mr"
          ? "तुमच्या कापसाची सध्याची बाजार किंमत ₹5,650 प्रति क्विंटल आहे. गुणवत्ता प्रीमियमसह हे ₹6,000 पर्यंत मिळू शकते."
          : "Your cotton's current market price is ₹5,650 per quintal. With quality premium, it can reach ₹6,000."
    }

    if (input.includes("बीज") || input.includes("seeds") || input.includes("बियाणे")) {
      return lang === "hi"
        ? "आपकी मिट्टी के लिए NK कॉर्न हाइब्रिड सबसे अच्छा विकल्प है। यह 25% अधिक उपज देता है।"
        : lang === "mr"
          ? "तुमच्या मातीसाठी NK कॉर्न हायब्रिड सर्वोत्तम पर्याय आहे. हे 25% जास्त उत्पादन देते."
          : "NK Corn Hybrid is the best option for your soil. It provides 25% higher yield."
    }

    return lang === "hi"
      ? "मैं आपकी समस्या को समझ रहा हूं। कृपया अधिक जानकारी दें।"
      : lang === "mr"
        ? "मी तुमची समस्या समजत आहे. कृपया अधिक माहिती द्या."
        : "I understand your concern. Please provide more details."
  }

  const trySampleCommand = (command: any) => {
    const message = language === "hi" ? command.hindi : language === "mr" ? command.marathi : command.english

    setConversation((prev) => [...prev, { type: "user", message }])

    setTimeout(() => {
      const response = generateAIResponse(message, language)
      setConversation((prev) => [...prev, { type: "ai", message: response }])
    }, 1000)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Voice-First Multilingual Interface</h3>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Hands-free farming assistance in your preferred language
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Voice Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Voice Control Center
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Button
                size="lg"
                onClick={handleVoiceToggle}
                className={`w-32 h-32 rounded-full ${
                  isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-green-600 hover:bg-green-700"
                } text-white`}
              >
                {isListening ? (
                  <div className="flex flex-col items-center">
                    <MicOff className="w-8 h-8 mb-2" />
                    <span className="text-sm">Stop</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Mic className="w-8 h-8 mb-2" />
                    <span className="text-sm">{language === "hi" ? "बोलें" : language === "mr" ? "बोला" : "Speak"}</span>
                  </div>
                )}
              </Button>
            </div>

            <div className="text-center">
              <Badge variant={isListening ? "destructive" : "secondary"}>
                {isListening ? "Listening..." : "Ready to listen"}
              </Badge>
            </div>

            {/* Language Options */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: "hi", name: "हिंदी", flag: "🇮🇳" },
                { code: "mr", name: "मराठी", flag: "🇮🇳" },
                { code: "en", name: "English", flag: "🇺🇸" },
              ].map((lang) => (
                <Button
                  key={lang.code}
                  variant={language === lang.code ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <span>{lang.flag}</span>
                  <span className="text-xs">{lang.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sample Commands */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Voice Commands</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sampleCommands.map((command, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => trySampleCommand(command)}
              >
                <div className="space-y-2">
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {language === "hi" ? command.hindi : language === "mr" ? command.marathi : command.english}
                  </div>
                  <div className="text-xs text-gray-500">{language !== "en" && `English: ${command.english}`}</div>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    Try Command
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Conversation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Live Conversation
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {conversation.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  <div className="text-xs mb-1 opacity-70">{msg.type === "user" ? "You" : "🤖 Crop Whisperer"}</div>
                  <div className="text-sm">{msg.message}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
