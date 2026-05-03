"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface VoiceAIInterfaceProps {
  language: string
}

export function VoiceAIInterface({ language }: VoiceAIInterfaceProps) {
  const { user } = useAuth()
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)
  const [conversation, setConversation] = useState<Array<{ type: "user" | "ai"; message: string; timestamp: string }>>(
    [],
  )

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const greetings = {
      en: `Hello ${user?.name || "Farmer"}! I'm your Cropwise Voice AI assistant. Ask me about weather, market rates, or crop advice.`,
      hi: `नमस्कार ${user?.name || "किसान जी"}! मैं आपका सिंजेंटा वॉइस AI सहायक हूं। मुझसे मौसम, बाजार दर, या फसल सलाह के बारे में पूछें।`,
      mr: `नमस्कार ${user?.name || "शेतकरी जी"}! मी तुमचा सिंजेंटा व्हॉइस AI सहायक आहे. मला हवामान, बाजार दर किंवा पीक सल्ल्याबद्दल विचारा.`,
    }

    const greeting = greetings[language as keyof typeof greetings] || greetings.en
    setConversation([
      {
        type: "ai",
        message: greeting,
        timestamp: new Date().toISOString(),
      },
    ])
  }, [language, user?.name])

  const requestMicrophonePermission = async () => {
    try {
      console.log("[v0] Requesting microphone permission")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasPermission(true)
      stream.getTracks().forEach((track) => track.stop()) // Stop the stream after getting permission
      console.log("[v0] Microphone permission granted")
      return true
    } catch (error) {
      console.error("[v0] Microphone permission denied:", error)
      setHasPermission(false)
      return false
    }
  }

  const startListening = async () => {
    if (!hasPermission) {
      const granted = await requestMicrophonePermission()
      if (!granted) return
    }

    try {
      console.log("[v0] Starting voice recording")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      })

      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = async () => {
        console.log("[v0] Recording stopped, processing audio")
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        await processAudio(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsListening(true)
    } catch (error) {
      console.error("[v0] Error starting recording:", error)
    }
  }

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      console.log("[v0] Stopping voice recording")
      mediaRecorderRef.current.stop()
      setIsListening(false)
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)

    try {
      console.log("[v0] Transcribing audio with Groq Whisper")

      // Convert to audio file format
      const audioFile = new File([audioBlob], "audio.webm", { type: "audio/webm" })

      const formData = new FormData()
      formData.append("audio", audioFile)
      formData.append("language", language)

      // Transcribe audio
      const transcribeResponse = await fetch("/api/voice/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!transcribeResponse.ok) {
        throw new Error("Transcription failed")
      }

      const { text } = await transcribeResponse.json()
      console.log("[v0] Transcription result:", text)

      // Add user message to conversation
      setConversation((prev) => [
        ...prev,
        {
          type: "user",
          message: text,
          timestamp: new Date().toISOString(),
        },
      ])

      // Get AI response
      const chatResponse = await fetch("/api/voice/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          language,
          farmerData: user,
        }),
      })

      if (!chatResponse.ok) {
        throw new Error("Chat response failed")
      }

      const { response } = await chatResponse.json()
      console.log("[v0] AI response generated")

      // Add AI response to conversation
      setConversation((prev) => [
        ...prev,
        {
          type: "ai",
          message: response,
          timestamp: new Date().toISOString(),
        },
      ])

      // Speak the response
      speakResponse(response)
    } catch (error) {
      console.error("[v0] Error processing audio:", error)
      setConversation((prev) => [
        ...prev,
        {
          type: "ai",
          message: "Sorry, I couldn't process your request. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  const speakResponse = (text: string) => {
    if ("speechSynthesis" in window) {
      console.log("[v0] Speaking AI response")

      // Stop any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === "hi" ? "hi-IN" : language === "mr" ? "mr-IN" : "en-US"
      utterance.rate = 0.9
      utterance.pitch = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthesisRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const getLanguageDisplay = () => {
    const languages = {
      en: { name: "English", flag: "🇺🇸", code: "US" },
      hi: { name: "हिंदी", flag: "🇮🇳", code: "IN" },
      mr: { name: "मराठी", flag: "🇮🇳", code: "IN" },
    }
    return languages[language as keyof typeof languages] || languages.en
  }

  const currentLang = getLanguageDisplay()

  return (
    <div className="space-y-6">
      {/* Voice Control Center */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Control Center
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Voice Button */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={handleVoiceToggle}
              disabled={isProcessing}
              className={`w-32 h-32 rounded-full text-white transition-all duration-300 ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-200"
                  : isProcessing
                    ? "bg-yellow-500 hover:bg-yellow-600 animate-spin"
                    : "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
              }`}
            >
              <div className="flex flex-col items-center">
                {isProcessing ? (
                  <>
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-sm">Processing</span>
                  </>
                ) : isListening ? (
                  <>
                    <MicOff className="w-8 h-8 mb-2" />
                    <span className="text-sm">Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8 mb-2" />
                    <span className="text-sm">Speak</span>
                  </>
                )}
              </div>
            </Button>
          </div>

          {/* Status Badge */}
          <div className="text-center">
            <Badge
              variant={isListening ? "destructive" : isProcessing ? "secondary" : "default"}
              className="text-sm px-4 py-2"
            >
              {isProcessing ? "Processing..." : isListening ? "Listening..." : "Ready to listen"}
            </Badge>
          </div>

          {/* Language Display */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <span className="text-lg">{currentLang.flag}</span>
              <span className="font-medium">{currentLang.code}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{currentLang.name}</span>
            </div>
          </div>

          {/* Audio Controls */}
          {isSpeaking && (
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={stopSpeaking}
                className="flex items-center gap-2 bg-transparent"
              >
                <VolumeX className="w-4 h-4" />
                Stop Speaking
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conversation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Voice Conversation
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
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
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs opacity-70 flex items-center gap-1">
                      {msg.type === "user" ? (
                        <>
                          <Mic className="w-3 h-3" />
                          You
                        </>
                      ) : (
                        <>🤖 Cropwise AI</>
                      )}
                    </div>
                    {msg.type === "ai" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakResponse(msg.message)}
                        className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <div className="text-sm leading-relaxed">{msg.message}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
