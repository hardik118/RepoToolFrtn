"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Sidebar from "@/components/layout/sidebar"
import Navbar from "@/components/layout/navbar"
import { GitBranch, Users, Calendar, FileText, Code, Activity, ExternalLink, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  name: string
  role: "teacher" | "student"
}

interface AnalysisResult {
  repoName: string
  repoUrl: string
  linesOfCode: number
  commits: number
  contributors: number
  lastUpdated: string
  languages: { name: string; percentage: number; color: string }[]
  branches: number
  issues: number
  stars: number
  forks: number
}

export default function RepoAnalysis() {
  const [user, setUser] = useState<User | null>(null)
  const [repoUrl, setRepoUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!repoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a repository URL",
        variant: "destructive",
      })
      return
    }

    // Basic GitHub URL validation
    if (!repoUrl.includes("github.com")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setAnalysisResult(null)

    // Simulate API call with realistic delay
    setTimeout(() => {
      // Extract repo name from URL
      const urlParts = repoUrl.split("/")
      const repoName = urlParts[urlParts.length - 1] || "repository"

      // Mock analysis results
      const mockResult: AnalysisResult = {
        repoName: repoName,
        repoUrl: repoUrl,
        linesOfCode: Math.floor(Math.random() * 10000) + 1000,
        commits: Math.floor(Math.random() * 200) + 50,
        contributors: Math.floor(Math.random() * 10) + 1,
        lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        languages: [
          { name: "JavaScript", percentage: 45, color: "#f1e05a" },
          { name: "TypeScript", percentage: 30, color: "#2b7489" },
          { name: "CSS", percentage: 15, color: "#563d7c" },
          { name: "HTML", percentage: 10, color: "#e34c26" },
        ],
        branches: Math.floor(Math.random() * 10) + 1,
        issues: Math.floor(Math.random() * 20),
        stars: Math.floor(Math.random() * 100),
        forks: Math.floor(Math.random() * 50),
      }

      setAnalysisResult(mockResult)
      setIsAnalyzing(false)

      toast({
        title: "Analysis Complete",
        description: "Repository analysis has been completed successfully",
      })
    }, 3000)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={user.role} />

      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Repository Analysis</h1>
              <p className="text-gray-600 mt-2">Analyze GitHub repositories to get detailed insights and metrics</p>
            </div>

            {/* Input Form */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Analyze Repository</CardTitle>
                <CardDescription>Enter a GitHub repository URL to start the analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAnalyze} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="repoUrl">GitHub Repository URL</Label>
                    <Input
                      id="repoUrl"
                      placeholder="https://github.com/username/repository-name"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      disabled={isAnalyzing}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isAnalyzing} className="w-full md:w-auto">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing Repository...
                      </>
                    ) : (
                      <>
                        <GitBranch className="h-4 w-4 mr-2" />
                        Analyze Repository
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Loading State */}
            {isAnalyzing && (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <div>
                      <h3 className="text-lg font-medium">Analyzing Repository</h3>
                      <p className="text-gray-600">This may take a few moments...</p>
                    </div>
                    <Progress value={33} className="w-full max-w-md mx-auto" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analysis Results */}
            {analysisResult && !isAnalyzing && (
              <div className="space-y-6">
                {/* Repository Header */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl flex items-center gap-2">
                          <GitBranch className="h-6 w-6" />
                          {analysisResult.repoName}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          <a
                            href={analysisResult.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            {analysisResult.repoUrl}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Analyzed</Badge>
                    </div>
                  </CardHeader>
                </Card>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Lines of Code</CardTitle>
                      <Code className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysisResult.linesOfCode.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">Total codebase</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Commits</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysisResult.commits}</div>
                      <p className="text-xs text-muted-foreground">Total commits</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Contributors</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysisResult.contributors}</div>
                      <p className="text-xs text-muted-foreground">Active contributors</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {Math.floor(
                          (Date.now() - new Date(analysisResult.lastUpdated).getTime()) / (1000 * 60 * 60 * 24),
                        )}
                        d
                      </div>
                      <p className="text-xs text-muted-foreground">Days ago</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Language Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Language Breakdown</CardTitle>
                    <CardDescription>Programming languages used in this repository</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisResult.languages.map((language) => (
                        <div key={language.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: language.color }}></div>
                              <span className="font-medium">{language.name}</span>
                            </div>
                            <span className="text-sm text-gray-600">{language.percentage}%</span>
                          </div>
                          <Progress value={language.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Branches</CardTitle>
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysisResult.branches}</div>
                      <p className="text-xs text-muted-foreground">Active branches</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Issues</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysisResult.issues}</div>
                      <p className="text-xs text-muted-foreground">Open issues</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Community</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between text-sm">
                        <div>
                          <div className="font-bold">{analysisResult.stars}</div>
                          <div className="text-gray-600">Stars</div>
                        </div>
                        <div>
                          <div className="font-bold">{analysisResult.forks}</div>
                          <div className="text-gray-600">Forks</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
