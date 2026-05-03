"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CloudRain,
  Sun,
  Cloud,
  CloudSnow,
  MapPin,
  Droplets,
  Wind,
  RefreshCw,
  AlertTriangle,
  Eye,
  Gauge,
} from "lucide-react"

interface WeatherData {
  location: string
  current: {
    temp: number
    description: string
    icon: string
    humidity: number
    windSpeed: number
    feelsLike: number
    pressure?: number
    visibility?: number
    uvIndex?: number
  }
  daily: Array<{
    date: string
    temp: {
      day: number
      night: number
      min: number
      max: number
    }
    description: string
    icon: string
    humidity: number
    windSpeed: number
    pop: number
  }>
}

const getWeatherIcon = (iconCode: string) => {
  const iconMap: { [key: string]: any } = {
    "01d": Sun,
    "01n": Sun,
    "02d": Cloud,
    "02n": Cloud,
    "03d": Cloud,
    "03n": Cloud,
    "04d": Cloud,
    "04n": Cloud,
    "09d": CloudRain,
    "09n": CloudRain,
    "10d": CloudRain,
    "10n": CloudRain,
    "11d": CloudRain,
    "11n": CloudRain,
    "13d": CloudSnow,
    "13n": CloudSnow,
    "50d": Cloud,
    "50n": Cloud,
  }
  return iconMap[iconCode] || Cloud
}

const getWeatherAdvice = (weather: WeatherData) => {
  const temp = weather.current.temp
  const description = weather.current.description.toLowerCase()
  const humidity = weather.current.humidity

  if (description.includes("rain")) {
    return {
      type: "warning",
      message:
        "🌧️ Rainy conditions detected. Avoid field operations and focus on indoor planning. Consider drainage management.",
      color: "from-blue-500 to-cyan-500",
    }
  } else if (temp > 35) {
    return {
      type: "alert",
      message: "🌡️ High temperature alert! Ensure adequate irrigation and consider heat-resistant premium varieties.",
      color: "from-red-500 to-orange-500",
    }
  } else if (temp < 10) {
    return {
      type: "info",
      message:
        "❄️ Cool weather conditions. Monitor crops for frost protection and consider cold-resistant solutions.",
      color: "from-blue-400 to-indigo-500",
    }
  } else if (humidity > 80) {
    return {
      type: "warning",
      message: "💧 High humidity detected. Watch for fungal diseases. Consider fungicide treatments.",
      color: "from-teal-500 to-green-500",
    }
  } else {
    return {
      type: "success",
      message: "✅ Excellent farming conditions! Perfect time for field operations and crop management activities.",
      color: "from-green-500 to-emerald-500",
    }
  }
}

export function EnhancedWeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lon: number; name: string } | null>(null)

  const fetchWeatherData = async (lat: number, lon: number, locationName: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}&location=${encodeURIComponent(locationName)}`)
      if (!response.ok) {
        throw new Error("Failed to fetch weather data")
      }
      const data = await response.json()
      setWeatherData(data)
    } catch (err) {
      setError("Unable to fetch weather data")
      console.error("Weather fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const geoResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=cad0e938782d57ceb23949b23b08a20c`,
          )
          const geoData = await geoResponse.json()
          const locationName = geoData[0] ? `${geoData[0].name}, ${geoData[0].state}` : "Current Location"

          setLocation({ lat: latitude, lon: longitude, name: locationName })
          await fetchWeatherData(latitude, longitude, locationName)
        } catch (err) {
          await fetchWeatherData(latitude, longitude, "Current Location")
        }
      },
      (error) => {
        setError("Unable to retrieve your location")
        setLoading(false)
        // Default to a sample location (Mumbai, Maharashtra)
        const defaultLat = 19.076
        const defaultLon = 72.8777
        setLocation({ lat: defaultLat, lon: defaultLon, name: "Mumbai, Maharashtra" })
        fetchWeatherData(defaultLat, defaultLon, "Mumbai, Maharashtra")
      },
    )
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl">
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
              <span className="ml-3 text-xl text-green-700">Loading weather data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !weatherData) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-orange-50 shadow-xl">
          <CardContent className="p-12">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-700 text-lg mb-4">{error || "Weather data unavailable"}</p>
              <Button onClick={getCurrentLocation} size="lg" className="bg-red-600 hover:bg-red-700">
                <RefreshCw className="h-5 w-5 mr-2" />
                Retry Weather Fetch
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const WeatherIcon = getWeatherIcon(weatherData.current.icon)
  const advice = getWeatherAdvice(weatherData)

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white pb-6">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold">
            <CloudRain className="h-8 w-8" />
            Real-Time Weather Intelligence for Farmers
          </CardTitle>
          <div className="flex items-center gap-2 text-green-100">
            <MapPin className="h-5 w-5" />
            <span className="text-lg">{weatherData.location}</span>
            <Badge variant="secondary" className="ml-2 bg-white/20 text-white border-white/30">
              Live Updates
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Main Weather Display */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Current Weather */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center">
                    <WeatherIcon className="h-20 w-20 text-green-600 mx-auto mb-4" />
                    <div className="text-5xl font-bold text-green-800 mb-2">{weatherData.current.temp}°C</div>
                    <div className="text-lg text-green-600 capitalize font-medium mb-4">
                      {weatherData.current.description}
                    </div>
                    <div className="text-sm text-green-700">Feels like {weatherData.current.feelsLike}°C</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weather Details */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Weather Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        <span className="text-gray-700">Humidity</span>
                      </div>
                      <span className="font-semibold text-blue-600">{weatherData.current.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wind className="h-5 w-5 text-gray-500" />
                        <span className="text-gray-700">Wind Speed</span>
                      </div>
                      <span className="font-semibold text-gray-600">{weatherData.current.windSpeed} m/s</span>
                    </div>
                    {weatherData.current.pressure && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Gauge className="h-5 w-5 text-purple-500" />
                          <span className="text-gray-700">Pressure</span>
                        </div>
                        <span className="font-semibold text-purple-600">{weatherData.current.pressure} hPa</span>
                      </div>
                    )}
                    {weatherData.current.visibility && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Eye className="h-5 w-5 text-indigo-500" />
                          <span className="text-gray-700">Visibility</span>
                        </div>
                        <span className="font-semibold text-indigo-600">
                          {(weatherData.current.visibility / 1000).toFixed(1)} km
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Farming Advice */}
            <div className="lg:col-span-1">
              <Card className={`bg-gradient-to-br ${advice.color} text-white shadow-lg h-full`}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">🌾 AI Farming Advice</h3>
                  <div className="text-white/90 leading-relaxed">{advice.message}</div>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="text-sm text-white/80">Powered by Cropwise Intelligence</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">7-Day Weather Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {weatherData.daily.slice(0, 7).map((day, index) => {
                const DayIcon = getWeatherIcon(day.icon)
                const dayName =
                  index === 0
                    ? "Today"
                    : new Date(Date.now() + index * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
                        weekday: "short",
                      })

                return (
                  <Card
                    key={index}
                    className="bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-sm font-medium text-gray-600 mb-2">{dayName}</div>
                      <DayIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-sm font-bold text-gray-800 mb-1">{day.temp.max}°C</div>
                      <div className="text-xs text-gray-500 mb-2">{day.temp.min}°C</div>
                      {day.pop > 30 && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                          {day.pop}%
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={getCurrentLocation}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh Weather Data
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 bg-transparent"
            >
              <CloudRain className="h-5 w-5 mr-2" />
              View Detailed Forecast
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
