"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCcw, ArrowLeft, Calendar, MessageCircle, Send, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
const rotationPlan = [
  { season: "Kharif 2024", crop: "Soybean", duration: "Jun - Oct", roi: "+18%", status: "Completed" },
  { season: "Rabi 2024-25", crop: "Wheat", duration: "Nov - Mar", roi: "+22%", status: "Current" },
  { season: "Zaid 2025", crop: "Moong Dal", duration: "Mar - Jun", roi: "+15%", status: "Planned" },
  { season: "Kharif 2025", crop: "Cotton", duration: "Jun - Oct", roi: "+25%", status: "Planned" },
  { season: "Rabi 2025-26", crop: "Chickpea", duration: "Nov - Mar", roi: "+20%", status: "Planned" },
]
const statusColor: Record<string, string> = {
  Completed: "bg-gray-100 text-gray-600 border-gray-300",
  Current: "bg-green-100 text-green-800 border-green-300",
  Planned: "bg-blue-100 text-blue-800 border-blue-300",
}
export function RotationMasterAgent({ onBack, language }: { onBack: () => void; language: string }) {
  const [messages, setMessages] = useState([{ role: "assistant", text: "🌾 Welcome to Rotation Master! I help plan intelligent crop rotations based on your farm history and market trends." }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text: userMsg }])
    setLoading(true)
    try {
      const res = await fetch("/api/agents/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agentId: "rotation-master", message: userMsg, language }) })
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
            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center"><RotateCcw className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-xl font-bold">Rotation Master - Crop Optimizer</h2><p className="text-sm text-gray-500">AI Agents → Crop Rotation Planning</p></div>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800 border border-green-300">94% Success Rate</Badge>
      </div>
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold mb-2">Rotation Master - Crop Planning AI</h1>
        <p className="text-gray-500 mb-2">Intelligent crop rotation based on 5-year farm history and market trends</p>
        <Badge className="bg-indigo-100 text-indigo-800 border border-indigo-300">22% ROI Boost</Badge>
      </div>
      <Tabs defaultValue="rotation-plan" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
          <TabsTrigger value="rotation-plan">Rotation Plan</TabsTrigger>
          <TabsTrigger value="soil-health">Soil Health</TabsTrigger>
          <TabsTrigger value="ai-planner">AI Planner</TabsTrigger>
        </TabsList>
        <TabsContent value="rotation-plan" className="mt-6 space-y-3">
          <div className="flex items-center gap-2 mb-4"><Calendar className="w-5 h-5 text-indigo-500" /><h3 className="text-lg font-semibold">5-Year Rotation Schedule</h3></div>
          {rotationPlan.map((plan, i) => (
            <Card key={i} className={`border-2 ${plan.status === "Current" ? "border-green-400 shadow-md" : "border-gray-200"}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">{i + 1}</div>
                    <div><p className="font-semibold">{plan.crop}</p><p className="text-sm text-gray-500">{plan.season} • {plan.duration}</p></div>
                  </div>
                  <div className="flex items-center gap-3"><span className="text-green-600 font-semibold">{plan.roi}</span><Badge className={`text-xs border ${statusColor[plan.status]}`}>{plan.status}</Badge></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="soil-health" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card><CardHeader><CardTitle className="text-base">🌱 Soil Nutrients</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[{ label: "Nitrogen (N)", value: "Medium", width: "60%" }, { label: "Phosphorus (P)", value: "Low", width: "30%" }, { label: "Potassium (K)", value: "High", width: "80%" }, { label: "Organic Matter", value: "2.5%", width: "50%" }].map((n) => (
                  <div key={n.label}><div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{n.label}</span><span className="font-medium">{n.value}</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-indigo-400 h-2 rounded-full" style={{ width: n.width }} /></div></div>
                ))}
              </CardContent>
            </Card>
            <Card><CardHeader><CardTitle className="text-base">📊 Rotation Benefits</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[{ label: "Yield Improvement", value: "+22%" }, { label: "Pest Reduction", value: "-35%" }, { label: "Fertilizer Savings", value: "₹8,500/acre" }, { label: "Soil Health Score", value: "78/100" }, { label: "Water Usage", value: "-18%" }].map((b) => (
                  <div key={b.label} className="flex justify-between p-2 bg-indigo-50 rounded-lg"><span className="text-sm text-gray-700">{b.label}</span><span className="text-sm font-bold text-indigo-700">{b.value}</span></div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="ai-planner" className="mt-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5 text-indigo-500" />AI Rotation Planner</CardTitle></CardHeader>
            <CardContent>
              <div className="h-80 overflow-y-auto space-y-3 mb-4 p-3 bg-gray-50 rounded-lg">
                {messages.map((msg, i) => (<div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === "user" ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-800"}`}>{msg.text}</div></div>))}
                {loading && <div className="flex justify-start"><div className="bg-white border p-3 rounded-lg"><Loader2 className="w-4 h-4 animate-spin text-indigo-500" /></div></div>}
              </div>
              <div className="flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Ask about crop rotation..." className="flex-1" />
                <Button onClick={sendMessage} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Send className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
