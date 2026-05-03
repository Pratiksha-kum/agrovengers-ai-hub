"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Upload, Camera, Search, Leaf, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react"
import Image from "next/image"

interface DiseaseDetectiveProps {
  farmerProfile?: any
}

interface DiseaseAnalysis {
  diseaseName: string
  confidence: number
  severity: "Low" | "Medium" | "High"
  description: string
  symptoms: string[]
  causes: string[]
  treatment: {
    immediate: string[]
    preventive: string[]
  }
  syngentaProducts: {
    name: string
    type: string
    dosage: string
    price: string
    availability: string
  }[]
  additionalTips: string[]
}

export function DiseaseDetective({ farmerProfile }: DiseaseDetectiveProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<DiseaseAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setAnalysis(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeDisease = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/disease-detective", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: selectedImage,
          farmerProfile: farmerProfile,
          cropType: farmerProfile?.primaryCrop || "general",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze disease")
      }

      const result = await response.json()
      setAnalysis(result.analysis)
    } catch (err) {
      setError("Failed to analyze the image. Please try again.")
      console.error("Disease analysis error:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Image Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Upload Crop Image
          </CardTitle>
          <CardDescription>Take a clear photo of the affected crop area for accurate disease detection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />

            {!selectedImage ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">Upload Crop Image</p>
                <p className="text-sm text-gray-500">Click to select an image or drag and drop</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image src={selectedImage || "/placeholder.svg"} alt="Uploaded crop" fill className="object-cover" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={analyzeDisease} disabled={isAnalyzing} className="flex-1">
                    {isAnalyzing ? (
                      <>
                        <Search className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Disease...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Analyze Disease
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Change Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Disease Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Disease Identification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{analysis.diseaseName}</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline">{Math.round(analysis.confidence)}% Confidence</Badge>
                    <Badge className={getSeverityColor(analysis.severity)}>{analysis.severity} Severity</Badge>
                  </div>
                </div>
                <p className="text-gray-600">{analysis.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Symptoms & Causes */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.symptoms.map((symptom, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Causes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.causes.map((cause, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{cause}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Syngenta Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-600" />
                Recommended Products
              </CardTitle>
              <CardDescription>Professional-grade solutions for effective disease management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {analysis.syngentaProducts.map((product, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{product.name}</h4>
                      <Badge variant="secondary">{product.type}</Badge>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Dosage:</span> {product.dosage}
                      </div>
                      <div>
                        <span className="font-medium">Price:</span> {product.price}
                      </div>
                      <div>
                        <span className="font-medium">Availability:</span> {product.availability}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Treatment Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-red-600">Immediate Actions</h4>
                  <ul className="space-y-2">
                    {analysis.treatment.immediate.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 text-green-600">Preventive Measures</h4>
                  <ul className="space-y-2">
                    {analysis.treatment.preventive.map((measure, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Expert Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.additionalTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Leaf className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
