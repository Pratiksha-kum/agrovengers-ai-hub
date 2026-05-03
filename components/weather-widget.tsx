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
  Thermometer,
  Droplets,
  Wind,
  RefreshCw,
  AlertTriangle,
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
    return { type: "warning", message: "Avoid field operations. Good time for indoor planning." }
  } else if (temp > 35) {
    return { type: "alert", message: "High temperature. Ensure adequate irrigation." }
  } else if (temp < 10) {
    return { type: "info", message: "Cool weather. Monitor for frost protection." }
  } else if (humidity > 80) {
    return { type: "warning", message: "High humidity. Watch for fungal diseases." }
  } else {
    return { type: "success", message: "Good conditions for farming activities." }
  }
}

export function WeatherWidget() {
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

        // Get location name using reverse geocoding
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
      <Card className="w-full max-w-md border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-green-600" />
            <span className="ml-2 text-green-700">Loading weather...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !weatherData) {
    return (
      <Card className="w-full max-w-md border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-700 text-sm">{error || "Weather data unavailable"}</p>
            <Button onClick={getCurrentLocation} size="sm" className="mt-2 bg-red-600 hover:bg-red-700">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const WeatherIcon = getWeatherIcon(weatherData.current.icon)
  const advice = getWeatherAdvice(weatherData)

  return (
    <Card className="w-full max-w-md border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <CloudRain className="h-5 w-5" />
          Weather Updates
        </CardTitle>
        <div className="flex items-center gap-1 text-sm text-green-600">
          <MapPin className="h-4 w-4" />
          {weatherData.location}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WeatherIcon className="h-12 w-12 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-800">{weatherData.current.temp}°C</div>
              <div className="text-sm text-green-600 capitalize">{weatherData.current.description}</div>
            </div>
          </div>
          <div className="text-right text-sm text-green-700">
            <div className="flex items-center gap-1">
              <Thermometer className="h-3 w-3" />
              Feels {weatherData.current.feelsLike}°C
            </div>
            <div className="flex items-center gap-1">
              <Droplets className="h-3 w-3" />
              {weatherData.current.humidity}%
            </div>
            <div className="flex items-center gap-1">
              <Wind className="h-3 w-3" />
              {weatherData.current.windSpeed} m/s
            </div>
          </div>
        </div>

        {/* Farming Advice */}
        <div
          className={`p-3 rounded-lg text-sm ${
            advice.type === "warning"
              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
              : advice.type === "alert"
                ? "bg-red-100 text-red-800 border border-red-200"
                : advice.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
          }`}
        >
          <div className="font-medium">🌾 Farming Advice:</div>
          {advice.message}
        </div>

        {/* 3-Day Forecast */}
        <div>
          <div className="text-sm font-medium text-green-800 mb-2">3-Day Forecast</div>
          <div className="grid grid-cols-3 gap-2">
            {weatherData.daily.slice(0, 3).map((day, index) => {
              const DayIcon = getWeatherIcon(day.icon)
              return (
                <div key={index} className="text-center p-2 bg-white rounded-lg border border-green-100">
                  <div className="text-xs text-green-600 mb-1">
                    {index === 0 ? "Today" : new Date(day.date).toLocaleDateString("en-IN", { weekday: "short" })}
                  </div>
                  <DayIcon className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <div className="text-xs font-medium text-green-800">
                    {day.temp.max}°/{day.temp.min}°
                  </div>
                  {day.pop > 30 && (
                    <Badge variant="secondary" className="text-xs mt-1 bg-blue-100 text-blue-700">
                      {day.pop}% rain
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <Button
          onClick={getCurrentLocation}
          size="sm"
          variant="outline"
          className="w-full border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Weather
        </Button>
      </CardContent>
    </Card>
  )
}
