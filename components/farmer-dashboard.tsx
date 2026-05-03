"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { getTranslation } from "@/lib/i18n"
import { User, LogOut, Settings } from "lucide-react"

export const FarmerDashboard: React.FC = () => {
  const { farmer, language, logout } = useAuth()

  if (!farmer) return null

  const t = (key: any) => getTranslation(language, key)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {t("welcome")}, {farmer.name}
                </h1>
                <p className="text-sm text-gray-500">{t("dashboard")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                {t("myProfile")}
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t("logout")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Farmer Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Farmer Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Name:</strong> {farmer.name}
              </p>
              <p>
                <strong>Age:</strong> {farmer.age}
              </p>
              <p>
                <strong>Country:</strong> {farmer.country}
              </p>
              <p>
                <strong>Farming Type:</strong> {farmer.farmingType}
              </p>
              <p>
                <strong>Crops:</strong> {farmer.crops.join(", ")}
              </p>
              {farmer.farmLocation && (
                <p>
                  <strong>Location:</strong> {farmer.farmLocation.district}, {farmer.farmLocation.state}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Farm Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Farm Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {farmer.farmAreaAcres && (
                <p>
                  <strong>Farm Area:</strong> {farmer.farmAreaAcres} acres
                </p>
              )}
              {farmer.soilType && (
                <p>
                  <strong>Soil Type:</strong> {farmer.soilType}
                </p>
              )}
              {farmer.irrigationType && (
                <p>
                  <strong>Irrigation:</strong> {farmer.irrigationType}
                </p>
              )}
              <p>
                <strong>Carbon Credit:</strong> {farmer.carbonCreditParticipation ? "Yes" : "No"}
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-green-600 hover:bg-green-700">View AI Agents</Button>
              <Button variant="outline" className="w-full bg-transparent">
                Update Profile
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                View Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
