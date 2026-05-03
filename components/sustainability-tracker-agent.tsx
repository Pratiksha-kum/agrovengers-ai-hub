"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, ArrowLeft, MessageCircle, Send, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
const practices = [
  { name: "Drip Irrigation", impact: "Water Saved: 40%", credits: 320, status: "Active" },
  { name: "Organic Composting", impact: "Carbon Stored: 1.2T", credits: 480, status: "Active" },
  { name: "Cover Cropping", impact: "Soil Health: +25%", credits: 290, status: "Active" },
  { name: "Zero Tillage", impact: "Erosion Reduced: 60%", credits: 410, status: "Planned" },
  { name: "Solar Pump", impact: "CO2 Saved: 2.1T/yr", credits: 620, status: "Planned" },
]
export function SustainabilityTrackerAgent({ onBack, language }: { onBack: () => void; language: string }) {
  const [messages, setMessages] = useState([{ role: "assistant", text: "🌱 Welcome to Sustainability Tracker! I monitor your carbon footprint and help earn carbon credits. Ask me how to improve your ESG score!" }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text: userMsg }])
    setLoading(true)
    try {
      const res = await fetch("/api/agents/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agentId: "sustainability-tracker", message: userMsg, language }) })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: "assistant", text: data.response }])
    } catch { setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, try again." }]) }
    finally { setLoading(false) }
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"><ArrowLeft className="w-4 h-4 mr-2" /> Back to AI Agents Hub</Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center"><Leaf className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-xl font-bold">Sustainability Tracker - ESG Intelligence</h2><p className="text-sm text-gray-500">AI Agents → Carbon & Sustainability</p></div>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800 border border-green-300">93% Success Rate</Badge>
      </div>
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold mb-2">Sustainability Tracker - ESG Intelligence</h1>
        <p className="text-gray-500 mb-2">Carbon footprint monitoring and regenerative agriculture optimization</p>
        <Badge className="bg-teal-100 text-teal-800 border border-teal-300">2,847 Carbon Credits Earned</Badge>
      </div>
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
          <TabsTrigger value="dashboard">ESG Dashboard</TabsTrigger>
          <TabsTrigger value="practices">Green Practices</TabsTrigger>
          <TabsTrigger value="ai-tracker">AI Tracker</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-teal-200 bg-teal-50"><CardContent className="p-5 text-center"><p className="text-sm text-gray-500 mb-1">Carbon Credits</p><p className="text-4xl font-bold text-teal-700">2,847</p><p className="text-sm text-teal-600">approx. Rs 1,42,350 value</p></CardContent></Card>
            <Card className="border-2 border-green-200 bg-green-50"><CardContent className="p-5 text-center"><p className="text-sm text-gray-500 mb-1">CO2 Reduced</p><p className="text-4xl font-bold text-green-700">4.2T</p><p className="text-sm text-green-600">This year</p></CardContent></Card>
            <Card className="border-2 border-blue-200 bg-blue-50"><CardContent className="p-5 text-center"><p className="text-sm text-gray-500 mb-1">ESG Score</p><p className="text-4xl font-bold text-blue-700">82/100</p><p className="text-sm text-blue-600">Top 15% farmers</p></CardContent></Card>
          </div>
          <Card><CardHeader><CardTitle className="text-base">🌍 Environmental Impact</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[{ label: "Water Saved", value: "1.8M litres", icon: "💧" }, { label: "Soil Health", value: "+32%", icon: "🌱" }, { label: "Biodiversity", value: "+18 species", icon: "🦋" }, { label: "Energy Saved", value: "2,400 kWh", icon: "⚡" }].map((item) => (
                <div key={item.label} className="p-3 bg-gray-50 rounded-lg text-center"><p className="text-2xl mb-1">{item.icon}</p><p className="text-lg font-bold text-gray-800">{item.value}</p><p className="text-xs text-gray-500">{item.label}</p></div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="practices" className="mt-6 space-y-3">
          {practices.map((p, i) => (
            <Card key={i} className={`border ${p.status === "Active" ? "border-green-300 bg-green-50" : "border-gray-200"}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div><p className="font-semibold">{p.name}</p><p className="text-sm text-gray-500">{p.impact}</p></div>
                  <div className="flex items-center gap-3"><div className="text-right"><p className="font-bold text-teal-700">+{p.credits}</p><p className="text-xs text-gray-400">credits</p></div><Badge className={p.status === "Active" ? "bg-green-100 text-green-800 border border-green-300" : "bg-blue-100 text-blue-800 border border-blue-300"}>{p.status}</Badge></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="ai-tracker" className="mt-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5 text-teal-500" />AI Sustainability Assistant</CardTitle></CardHeader>
            <CardContent>
              <div className="h-80 overflow-y-auto space-y-3 mb-4 p-3 bg-gray-50 rounded-lg">
                {messages.map((msg, i) => (<div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === "user" ? "bg-teal-600 text-white" : "bg-white border border-gray-200 text-gray-800"}`}>{msg.text}</div></div>))}
                {loading && <div className="flex justify-start"><div className="bg-white border p-3 rounded-lg"><Loader2 className="w-4 h-4 animate-spin text-teal-500" /></div></div>}
              </div>
              <div className="flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Ask about carbon credits, green practices..." className="flex-1" />
                <Button onClick={sendMessage} disabled={loading} className="bg-teal-600 hover:bg-teal-700 text-white"><Send className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
