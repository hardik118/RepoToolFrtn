"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Sidebar from "@/components/layout/sidebar"
import Navbar from "@/components/layout/navbar"
import {
  GitBranch,
  Users,
  Code,
  Activity,
  Upload,
  Download,
  Trash2,
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  name: string
  role: "teacher" | "student"
}

interface RepoAnalysis {
  id: string
  url: string
  name: string
  status: "pending" | "analyzing" | "completed" | "error"
  linesOfCode?: number
  commits?: number
  contributors?: number
  lastUpdated?: string
  analyzedAt?: string
}

export default function RepoListAnalysis() {
  const [user, setUser] = useState<User | null>(null)
  const [repoUrls, setRepoUrls] = useState("")
  const [repositories, setRepositories] = useState<RepoAnalysis[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
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

  const handleAddRepositories = () => {
    if (!repoUrls.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one repository URL",
        variant: "destructive",
      })
      return
    }

    const urls = repoUrls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0)

    const validUrls = urls.filter((url) => url.includes("github.com"))

    if (validUrls.length === 0) {
      toast({
        title: "Error",
        description: "Please enter valid GitHub repository URLs",
        variant: "destructive",
      })
      return
    }

    if (validUrls.length !== urls.length) {
      toast({
        title: "Warning",
        description: `${urls.length - validUrls.length} invalid URLs were skipped`,
        variant: "destructive",
      })
    }

    const newRepos: RepoAnalysis[] = validUrls.map((url) => {
      const urlParts = url.split("/")
      const name = urlParts[urlParts.length - 1] || "repository"

      return {
        id: Math.random().toString(36).substr(2, 9),
        url,
        name,
        status: "pending",
      }
    })

    setRepositories((prev) => [...prev, ...newRepos])
    setRepoUrls("")

    toast({
      title: "Success",
      description: `Added ${newRepos.length} repositories to the analysis queue`,
    })
  }

  const handleAnalyzeAll = async () => {
    const pendingRepos = repositories.filter((repo) => repo.status === "pending")

    if (pendingRepos.length === 0) {
      toast({
        title: "No Repositories",
        description: "No pending repositories to analyze",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    // Update all pending repos to analyzing status
    setRepositories((prev) =>
      prev.map((repo) => (repo.status === "pending" ? { ...repo, status: "analyzing" as const } : repo)),
    )

    // Simulate analysis for each repository with staggered completion
    pendingRepos.forEach((repo, index) => {
      setTimeout(
        () => {
          const success = Math.random() > 0.1 // 90% success rate

          setRepositories((prev) =>
            prev.map((r) =>
              r.id === repo.id
                ? {
                    ...r,
                    status: success ? ("completed" as const) : ("error" as const),
                    linesOfCode: success ? Math.floor(Math.random() * 10000) + 1000 : undefined,
                    commits: success ? Math.floor(Math.random() * 200) + 50 : undefined,
                    contributors: success ? Math.floor(Math.random() * 10) + 1 : undefined,
                    lastUpdated: success
                      ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
                      : undefined,
                    analyzedAt: new Date().toISOString(),
                  }
                : r,
            ),
          )

          // If this is the last repository, stop analyzing
          if (index === pendingRepos.length - 1) {
            setTimeout(() => {
              setIsAnalyzing(false)
              toast({
                title: "Analysis Complete",
                description: `Analyzed ${pendingRepos.length} repositories`,
              })
            }, 500)
          }
        },
        (index + 1) * 2000,
      ) // Stagger completion by 2 seconds each
    })
  }

  const handleRemoveRepository = (id: string) => {
    setRepositories((prev) => prev.filter((repo) => repo.id !== id))
    toast({
      title: "Repository Removed",
      description: "Repository has been removed from the list",
    })
  }

  const handleExportResults = () => {
    const completedRepos = repositories.filter((repo) => repo.status === "completed")

    if (completedRepos.length === 0) {
      toast({
        title: "No Data",
        description: "No completed analyses to export",
        variant: "destructive",
      })
      return
    }

    // Create CSV data
    const csvHeaders = ["Repository Name", "URL", "Lines of Code", "Commits", "Contributors", "Last Updated"]
    const csvData = completedRepos.map((repo) => [
      repo.name,
      repo.url,
      repo.linesOfCode?.toString() || "",
      repo.commits?.toString() || "",
      repo.contributors?.toString() || "",
      repo.lastUpdated || "",
    ])

    const csvContent = [csvHeaders, ...csvData].map((row) => row.join(",")).join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `repository-analysis-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "Analysis results have been exported to CSV",
    })
  }

  const getStatusIcon = (status: RepoAnalysis["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-gray-500" />
      case "analyzing":
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: RepoAnalysis["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-700"
      case "analyzing":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "error":
        return "bg-red-100 text-red-700"
    }
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
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Batch Repository Analysis</h1>
              <p className="text-gray-600 mt-2">Analyze multiple GitHub repositories simultaneously</p>
            </div>

            {/* Input Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Add Repositories</CardTitle>
                <CardDescription>
                  Enter GitHub repository URLs (one per line) to add them to the analysis queue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="repoUrls">Repository URLs</Label>
                  <Textarea
                    id="repoUrls"
                    placeholder={`https://github.com/user/repo1
https://github.com/user/repo2
https://github.com/user/repo3`}
                    value={repoUrls}
                    onChange={(e) => setRepoUrls(e.target.value)}
                    rows={6}
                    disabled={isAnalyzing}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddRepositories} disabled={isAnalyzing}>
                    <Upload className="h-4 w-4 mr-2" />
                    Add Repositories
                  </Button>
                  <Input type="file" accept=".txt,.csv" className="hidden" id="file-upload" />
                  <Label htmlFor="file-upload">
                    <Button variant="outline" disabled={isAnalyzing} asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload File
                      </span>
                    </Button>
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Control Panel */}
            {repositories.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Analysis Control</CardTitle>
                  <CardDescription>Manage your repository analysis queue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Button onClick={handleAnalyzeAll} disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <>
                          <Activity className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Analyze All Pending
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleExportResults} disabled={isAnalyzing}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Results (CSV)
                    </Button>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Total: {repositories.length}</span>
                      <span>Pending: {repositories.filter((r) => r.status === "pending").length}</span>
                      <span>Completed: {repositories.filter((r) => r.status === "completed").length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Repository List */}
            {repositories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Repository Analysis Queue</CardTitle>
                  <CardDescription>Track the progress of your repository analyses</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Repository</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Lines of Code</TableHead>
                        <TableHead>Commits</TableHead>
                        <TableHead>Contributors</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {repositories.map((repo) => (
                        <TableRow key={repo.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{repo.name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-64">{repo.url}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(repo.status)}
                              <Badge className={getStatusColor(repo.status)}>{repo.status}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {repo.linesOfCode ? (
                              <div className="flex items-center gap-2">
                                <Code className="h-4 w-4 text-gray-500" />
                                <span>{repo.linesOfCode.toLocaleString()}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {repo.commits ? (
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-gray-500" />
                                <span>{repo.commits}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {repo.contributors ? (
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-gray-500" />
                                <span>{repo.contributors}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {repo.lastUpdated ? (
                              <span className="text-sm">
                                {Math.floor(
                                  (Date.now() - new Date(repo.lastUpdated).getTime()) / (1000 * 60 * 60 * 24),
                                )}
                                d ago
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveRepository(repo.id)}
                              disabled={isAnalyzing && repo.status === "analyzing"}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {repositories.length === 0 && (
              <div className="text-center py-12">
                <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No repositories added yet</h3>
                <p className="text-gray-600">Add GitHub repository URLs above to start batch analysis</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
