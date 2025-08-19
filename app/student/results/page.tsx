"use client"

import { useState } from "react"
import AuthGuard from "@/components/auth-guard"
import Sidebar from "@/components/layout/sidebar"
import Navbar from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar, GitBranch, TrendingUp, Award, BookOpen } from "lucide-react"

export default function StudentResults() {
  const [selectedClass, setSelectedClass] = useState("all")

  const classes = ["CS101 - Introduction to Programming", "WEB201 - Web Development"]

  const results = [
    {
      id: 1,
      assignment: "Python Data Structures",
      class: "CS101 - Introduction to Programming",
      repoUrl: "https://github.com/student/python-structures",
      submissionDate: "2024-02-10",
      grade: "A-",
      feedback:
        "Excellent implementation of data structures. Your stack and queue implementations are clean and efficient. The unit tests are comprehensive and well-written. Consider adding more edge case testing for the linked list implementation.",
      analysisResults: {
        linesOfCode: 245,
        commits: 12,
        testCoverage: 85,
        codeQuality: "Good",
      },
    },
    {
      id: 2,
      assignment: "Basic Calculator",
      class: "CS101 - Introduction to Programming",
      repoUrl: "https://github.com/student/calculator-app",
      submissionDate: "2024-02-05",
      grade: "B+",
      feedback:
        "Good functionality and user interface. The calculator handles basic operations well. However, error handling could be improved, especially for division by zero and invalid inputs. Consider adding more comprehensive input validation.",
      analysisResults: {
        linesOfCode: 180,
        commits: 8,
        testCoverage: 65,
        codeQuality: "Fair",
      },
    },
    {
      id: 3,
      assignment: "Todo List App",
      class: "WEB201 - Web Development",
      repoUrl: "https://github.com/student/todo-app",
      submissionDate: "2024-01-28",
      grade: "A",
      feedback:
        "Outstanding work! The React implementation is clean and follows best practices. Excellent use of hooks and state management. The UI is intuitive and responsive. Great job on implementing local storage for persistence.",
      analysisResults: {
        linesOfCode: 320,
        commits: 15,
        testCoverage: 92,
        codeQuality: "Excellent",
      },
    },
    {
      id: 4,
      assignment: "Weather App",
      class: "WEB201 - Web Development",
      repoUrl: "https://github.com/student/weather-app",
      submissionDate: "2024-01-20",
      grade: "B",
      feedback:
        "Good use of API integration and React components. The app successfully fetches and displays weather data. The design is clean but could benefit from better error handling when the API is unavailable. Consider adding loading states.",
      analysisResults: {
        linesOfCode: 280,
        commits: 10,
        testCoverage: 70,
        codeQuality: "Good",
      },
    },
  ]

  const filteredResults = selectedClass === "all" ? results : results.filter((result) => result.class === selectedClass)

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600"
    if (grade.startsWith("B")) return "text-blue-600"
    if (grade.startsWith("C")) return "text-yellow-600"
    return "text-red-600"
  }

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case "excellent":
        return "bg-green-100 text-green-700"
      case "good":
        return "bg-blue-100 text-blue-700"
      case "fair":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const stats = {
    totalGraded: results.length,
    averageGrade: "B+",
    highestGrade: "A",
    averageTestCoverage: Math.round(
      results.reduce((acc, r) => acc + r.analysisResults.testCoverage, 0) / results.length,
    ),
  }

  return (
    <AuthGuard requiredRole="student">
      <div className="flex h-screen bg-gray-50">
        <Sidebar role="student" />

        <div className="flex-1 flex flex-col md:ml-64">
          <Navbar />

          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Results</h1>
                <p className="text-gray-600 mt-2">View your grades, feedback, and repository analysis results</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Graded Assignments</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalGraded}</div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.averageGrade}</div>
                    <p className="text-xs text-muted-foreground">Current semester</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Highest Grade</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.highestGrade}</div>
                    <p className="text-xs text-muted-foreground">Best performance</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Test Coverage</CardTitle>
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.averageTestCoverage}%</div>
                    <p className="text-xs text-muted-foreground">Code quality metric</p>
                  </CardContent>
                </Card>
              </div>

              {/* Filter */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Filter Results</CardTitle>
                  <CardDescription>Select a class to view its results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 items-center">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {classes.map((className) => (
                          <SelectItem key={className} value={className}>
                            {className}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-gray-600">Showing {filteredResults.length} result(s)</div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Cards */}
              <div className="space-y-6">
                {filteredResults.map((result) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{result.assignment}</CardTitle>
                          <CardDescription className="mt-1">{result.class}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${getGradeColor(result.grade)}`}>{result.grade}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(result.submissionDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Repository Analysis */}
                      <div>
                        <h4 className="font-semibold mb-3">Repository Analysis</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{result.analysisResults.linesOfCode}</div>
                            <div className="text-xs text-gray-600">Lines of Code</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{result.analysisResults.commits}</div>
                            <div className="text-xs text-gray-600">Commits</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                              {result.analysisResults.testCoverage}%
                            </div>
                            <div className="text-xs text-gray-600">Test Coverage</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <Badge className={getQualityColor(result.analysisResults.codeQuality)}>
                              {result.analysisResults.codeQuality}
                            </Badge>
                            <div className="text-xs text-gray-600 mt-1">Code Quality</div>
                          </div>
                        </div>
                      </div>

                      {/* Feedback */}
                      <div>
                        <h4 className="font-semibold mb-3">Teacher Feedback</h4>
                        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <p className="text-gray-700">{result.feedback}</p>
                        </div>
                      </div>

                      {/* Repository Link */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Submitted on {new Date(result.submissionDate).toLocaleDateString()}</span>
                        </div>
                        <a
                          href={result.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Button variant="outline" size="sm">
                            <GitBranch className="h-4 w-4 mr-2" />
                            View Repository
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredResults.length === 0 && (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results yet</h3>
                  <p className="text-gray-600">Your graded assignments will appear here</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
