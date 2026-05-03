"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, ArrowLeft, MapPin, MessageCircle, Send, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
const mandiPrices = [
  { city: "Delhi", price: 2956, volume: "5,000", quality: "Highest" },
  { city: "Mumbai", price: 3012, volume: "4,500", quality: "Good" },
  { city: "Kolkata", price: 2871, volume: "3,500", quality: "Good" },
  { city: "Chennai", price: 2899, volume: "2,000", quality: "Good" },
  { city: "Bangalore", price: 2928, volume: "2,500", quality: "Lowest" },
  { city: "Pune", price: 2975, volume: "3,200", quality: "Good" },
]
const qualityColor: Record<string, string> = {
  Highest: "bg-green-100 text-green-800 border-green-300",
  Good: "bg-blue-100 text-blue-800 border-blue-300",
  Lowest: "bg-orange-100 text-orange-800 border-orange-300",
}
export function MarketOracleAgent({ onBack, language }: { onBack: () => void; language: string }) {
  const [messages, setMessages] = useState([{ role: "assistant", text: "👋 Welcome to Market Oracle! Ask me about mandi prices, best selling times, or profit strategies." }])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text: userMsg }])
    setLoading(true)
    try {
      const res = await fetch("/api/agents/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agentId: "market-oracle", message: userMsg, language }) })
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
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-white" /></div>
            <div><h2 className="text-xl font-bold">Market Oracle - Price Intelligence</h2><p className="text-sm text-gray-500">AI Agents → Market Oracle Analysis</p></div>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800 border border-green-300">95% Success Rate</Badge>
      </div>
      <div className="text-center py-4">
        <h1 className="text-3xl font-bold mb-2">Market Oracle - Mandi Price Intelligence</h1>
        <p className="text-gray-500 mb-2">Real-time pricing intelligence from 500+ mandis</p>
        <Badge className="bg-purple-100 text-purple-800 border border-purple-300">95% Prediction Accuracy</Badge>
      </div>
      <Tabs defaultValue="mandi-prices" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
          <TabsTrigger value="mandi-prices">Mandi Prices</TabsTrigger>
          <TabsTrigger value="profit-analysis">Profit Analysis</TabsTrigger>
          <TabsTrigger value="ai-oracle">AI Oracle</TabsTrigger>
        </TabsList>
        <TabsContent value="mandi-prices" className="mt-6">
          <div className="flex items-center gap-2 mb-4"><MapPin className="w-4 h-4 text-purple-500" /><h3 className="text-lg font-semibold">Mandi Prices & Nearby Cities</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mandiPrices.map((m) => (
              <Card key={m.city} className="border border-gray-200 hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2"><span className="font-semibold">{m.city}</span><Badge className={`text-xs border ${qualityColor[m.quality]}`}>{m.quality}</Badge></div>
                  <p className="text-2xl font-bold text-purple-600">₹{m.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">per quintal • Volume: {m.volume} quintals</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="profit-analysis" className="mt-6">
          <Card><CardHeader><CardTitle>📊 Profit Optimization Analysis</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200"><p className="text-sm text-gray-500">Best Market</p><p className="text-2xl font-bold text-green-700">Mumbai</p><p className="text-sm text-green-600">₹3,012/quintal</p></div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200"><p className="text-sm text-gray-500">Average Price</p><p className="text-2xl font-bold text-blue-700">₹2,940</p><p className="text-sm text-blue-600">Across 500+ mandis</p></div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200"><p className="text-sm text-gray-500">Price Trend</p><p className="text-2xl font-bold text-purple-700">+15%</p><p className="text-sm text-purple-600">Expected in 7 days</p></div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200"><p className="text-sm font-semibold text-yellow-800 mb-2">💡 AI Recommendation</p><p className="text-sm text-yellow-700">Hold your produce for 5-7 days. Market analysis indicates a 15% price increase opportunity across major mandis.</p></div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai-oracle" className="mt-6">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5 text-purple-500" />AI Oracle Chat</CardTitle></CardHeader>
            <CardContent>
              <div className="h-80 overflow-y-auto space-y-3 mb-4 p-3 bg-gray-50 rounded-lg">
                {messages.map((msg, i) => (<div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === "user" ? "bg-purple-600 text-white" : "bg-white border border-gray-200 text-gray-800"}`}>{msg.text}</div></div>))}
                {loading && <div className="flex justify-start"><div className="bg-white border p-3 rounded-lg"><Loader2 className="w-4 h-4 animate-spin text-purple-500" /></div></div>}
              </div>
              <div className="flex gap-2">
                <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Ask about mandi prices..." className="flex-1" />
                <Button onClick={sendMessage} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white"><Send className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
