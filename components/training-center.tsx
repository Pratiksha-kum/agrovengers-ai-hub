"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Video, Users, Award, Clock, Star, Play, Download } from "lucide-react"

interface TrainingCenterProps {
  language: string
}

function TrainingCenter({ language }: TrainingCenterProps) {
  const [selectedCategory, setSelectedCategory] = useState("beginner")

  const courses = {
    beginner: [
      {
        title: "Introduction to Precision Agriculture",
        description: "Learn the basics of modern farming techniques and technology integration",
        duration: "2 hours",
        modules: 8,
        rating: 4.8,
        enrolled: 1247,
        progress: 0,
        instructor: "Dr. Rajesh Kumar",
        level: "Beginner",
        type: "video",
        certificate: true,
      },
      {
        title: "Crop Protection Fundamentals",
        description: "Understanding pest management and disease prevention strategies",
        duration: "3 hours",
        modules: 12,
        rating: 4.7,
        enrolled: 892,
        progress: 0,
        instructor: "Prof. Sunita Sharma",
        level: "Beginner",
        type: "interactive",
        certificate: true,
      },
    ],
    intermediate: [
      {
        title: "Advanced Seed Selection Strategies",
        description: "Master the art of choosing optimal varieties for maximum yield",
        duration: "4 hours",
        modules: 15,
        rating: 4.9,
        enrolled: 634,
        progress: 45,
        instructor: "Dr. Amit Patel",
        level: "Intermediate",
        type: "video",
        certificate: true,
      },
      {
        title: "Integrated Pest Management",
        description: "Comprehensive approach to sustainable pest control",
        duration: "5 hours",
        modules: 18,
        rating: 4.8,
        enrolled: 456,
        progress: 0,
        instructor: "Dr. Priya Singh",
        level: "Intermediate",
        type: "hands-on",
        certificate: true,
      },
    ],
    advanced: [
      {
        title: "AI-Driven Farm Management",
        description: "Leverage artificial intelligence for optimized farming decisions",
        duration: "6 hours",
        modules: 20,
        rating: 4.9,
        enrolled: 289,
        progress: 0,
        instructor: "Dr. Vikram Mehta",
        level: "Advanced",
        type: "project",
        certificate: true,
      },
    ],
  }

  const categories = [
    { id: "beginner", name: "Beginner", icon: BookOpen, count: 2 },
    { id: "intermediate", name: "Intermediate", icon: Users, count: 2 },
    { id: "advanced", name: "Advanced", icon: Award, count: 1 },
  ]

  const achievements = [
    { name: "First Course Completed", icon: "🎓", earned: true },
    { name: "Precision Agriculture Expert", icon: "🎯", earned: true },
    { name: "Sustainability Champion", icon: "🌱", earned: false },
    { name: "AI Farming Pioneer", icon: "🤖", earned: false },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">📚 AgroVengers Learning Center</h3>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Master modern farming techniques with expert-led courses and AI-powered learning
        </p>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Courses Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">48h</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Learning Hours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-600">8</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Certificates Earned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600">95%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Selection */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`flex items-center gap-2 ${
                selectedCategory === category.id
                  ? "bg-green-600 hover:bg-green-700"
                  : "border-green-600 text-green-600 hover:bg-green-50"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <Icon className="h-4 w-4" />
              {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </Button>
          )
        })}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {courses[selectedCategory as keyof typeof courses]?.map((course, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg text-gray-900 dark:text-white mb-2">{course.title}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {course.modules} modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Course Info */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {course.type}
                  </Badge>
                  {course.certificate && <Badge className="text-xs bg-green-600">Certificate</Badge>}
                </div>
                <span className="text-sm text-gray-500">{course.enrolled} enrolled</span>
              </div>

              {/* Progress */}
              {course.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-semibold">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}

              {/* Instructor */}
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Instructor: </span>
                  <span className="font-semibold">{course.instructor}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {course.progress > 0 ? (
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                ) : (
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Start Course
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-green-600" />
            Learning Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`text-center p-4 rounded-lg border-2 transition-all ${
                  achievement.earned
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 dark:border-gray-700 opacity-50"
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className="text-sm font-semibold">{achievement.name}</div>
                {achievement.earned && <Badge className="mt-2 bg-green-600">Earned</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Path Recommendation */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-6 w-6 text-green-600" />
            Personalized Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Based on your farming profile and learning history, we recommend:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <h4 className="font-semibold mb-2">Next: Soil Health Management</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Learn advanced soil testing and nutrient management techniques.
                </p>
                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                  Start Learning
                </Button>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <h4 className="font-semibold mb-2">Recommended: Market Intelligence</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Master price forecasting and market trend analysis.
                </p>
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  Learn More
                </Button>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <h4 className="font-semibold mb-2">Advanced: Drone Technology</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Explore precision agriculture with drone applications.
                </p>
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { TrainingCenter }
export default TrainingCenter
