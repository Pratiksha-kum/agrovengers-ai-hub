"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { type Language, getTranslation } from "@/lib/i18n"
import { Leaf, User, MapPin, Droplets } from "lucide-react"

interface FarmerSignupProps {
  language: Language
  onSignupComplete: () => void
  onSwitchToLogin?: () => void
}

export const FarmerSignup: React.FC<FarmerSignupProps> = ({ language, onSignupComplete, onSwitchToLogin }) => {
  const { signup } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    country: "India",
    phoneNumber: "",
    email: "",
    password: "",
    farmingType: "single" as "single" | "multiple",
    crops: [] as string[],
    otherCrop: "",
    farmLocation: {
      state: "",
      district: "",
    },
    soilType: "",
    farmAreaAcres: "",
    irrigationType: "",
    carbonCreditParticipation: false,
  })

  const crops = ["wheat", "pomegranate", "tomato", "cotton", "sugarcane", "rice", "maize", "soybean", "others"]

  const soilTypes = ["sandy", "loamy", "clay"]
  const irrigationTypes = ["drip", "flood", "rainfed"]

  const t = (key: any) => getTranslation(language, key)

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleCropToggle = (crop: string) => {
    setFormData((prev) => ({
      ...prev,
      crops: prev.crops.includes(crop) ? prev.crops.filter((c) => c !== crop) : [...prev.crops, crop],
    }))
  }

  const handleSubmit = async () => {
    setError("")

    if (!formData.email) {
      setError("Email is required for account creation")
      return
    }

    const finalCrops =
      formData.crops.includes("others") && formData.otherCrop
        ? [...formData.crops.filter((c) => c !== "others"), formData.otherCrop]
        : formData.crops

    const signupData = {
      name: formData.name,
      age: Number.parseInt(formData.age),
      country: formData.country,
      phoneNumber: formData.phoneNumber || undefined,
      email: formData.email,
      password: formData.password,
      language,
      farmingType: formData.farmingType,
      crops: finalCrops,
      farmLocation: formData.farmLocation.state ? formData.farmLocation : undefined,
      soilType: formData.soilType || undefined,
      farmAreaAcres: formData.farmAreaAcres ? Number.parseFloat(formData.farmAreaAcres) : undefined,
      irrigationType: formData.irrigationType || undefined,
      carbonCreditParticipation: formData.carbonCreditParticipation,
    }

    const success = await signup(signupData)
    if (success) {
      onSignupComplete()
    } else {
      setError("Email already exists or signup failed. Please try a different email.")
    }
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">{t("farmerName")}</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{t("farmerName")}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t("farmerName")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">{t("age")}</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder={t("age")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">{t("country")}</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder={t("country")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("phoneNumber")}</Label>
              <Input
                id="phone"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder={t("phoneNumber")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("email")} *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Required for account creation"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">{t("selectCrops")}</h3>
            </div>

            <div className="space-y-2">
              <Label>{t("farmingType")}</Label>
              <Select
                value={formData.farmingType}
                onValueChange={(value: "single" | "multiple") => handleInputChange("farmingType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">{t("singleCrop")}</SelectItem>
                  <SelectItem value="multiple">{t("multipleCrops")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("selectCrops")}</Label>
              <div className="grid grid-cols-2 gap-2">
                {crops.map((crop) => (
                  <div key={crop} className="flex items-center space-x-2">
                    <Checkbox
                      id={crop}
                      checked={formData.crops.includes(crop)}
                      onCheckedChange={() => handleCropToggle(crop)}
                    />
                    <Label htmlFor={crop} className="text-sm">
                      {t(crop as any)}
                    </Label>
                  </div>
                ))}
              </div>

              {formData.crops.includes("others") && (
                <Input
                  value={formData.otherCrop}
                  onChange={(e) => handleInputChange("otherCrop", e.target.value)}
                  placeholder="Specify other crop"
                  className="mt-2"
                />
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">{t("farmLocation")}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">{t("state")}</Label>
                <Input
                  id="state"
                  value={formData.farmLocation.state}
                  onChange={(e) => handleInputChange("farmLocation.state", e.target.value)}
                  placeholder={t("state")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">{t("district")}</Label>
                <Input
                  id="district"
                  value={formData.farmLocation.district}
                  onChange={(e) => handleInputChange("farmLocation.district", e.target.value)}
                  placeholder={t("district")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t("soilType")}</Label>
              <Select value={formData.soilType} onValueChange={(value) => handleInputChange("soilType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("soilType")} />
                </SelectTrigger>
                <SelectContent>
                  {soilTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(type as any)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="farmArea">{t("farmArea")}</Label>
              <Input
                id="farmArea"
                type="number"
                step="0.1"
                value={formData.farmAreaAcres}
                onChange={(e) => handleInputChange("farmAreaAcres", e.target.value)}
                placeholder={t("farmArea")}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">{t("irrigationType")}</h3>
            </div>

            <div className="space-y-2">
              <Label>{t("irrigationType")}</Label>
              <Select
                value={formData.irrigationType}
                onValueChange={(value) => handleInputChange("irrigationType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("irrigationType")} />
                </SelectTrigger>
                <SelectContent>
                  {irrigationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(type as any)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="carbonCredit"
                checked={formData.carbonCreditParticipation}
                onCheckedChange={(checked) => handleInputChange("carbonCreditParticipation", checked)}
              />
              <Label htmlFor="carbonCredit" className="text-sm">
                {t("carbonCredit")}
              </Label>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-800 text-center">{t("signup")}</CardTitle>
          <Progress value={(currentStep / 4) * 100} className="mt-4" />
          <p className="text-center text-sm text-gray-600">Step {currentStep} of 4</p>
        </CardHeader>

        <CardContent>
          {renderStep()}

          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={nextStep}
                className="bg-green-600 hover:bg-green-700"
                disabled={currentStep === 1 && (!formData.name || !formData.email)}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                {t("createAccount")}
              </Button>
            )}
          </div>

          {onSwitchToLogin && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button onClick={onSwitchToLogin} className="text-green-600 hover:text-green-700 font-medium">
                  Sign In
                </button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
