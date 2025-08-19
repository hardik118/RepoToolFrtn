"use client"

import { useState } from "react"
import AuthGuard from "@/components/auth-guard"
import Sidebar from "@/components/layout/sidebar"
import Navbar from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar, GitBranch, Eye } from "lucide-react"

export default function StudentSubmissions() {
  const [selectedClass, setSelectedClass] = useState("all")

  const classes = ["CS101 - Introduction to Programming", "WEB201 - Web Development"]

  const submissions = [
    {
      id: 1,
      assignment: "React Hooks Implementation",
      class: "WEB201 - Web Development",
      repoUrl: "https://github.com/student/react-hooks-project",
      submissionDate: "2024-02-12",
      status: "submitted",
      grade: null,
      feedback: null,
    },
    {
      id: 2,
      assignment: "Python Data Structures",
      class: "CS101 - Introduction to Programming",
      repoUrl: "https://github.com/student/python-structures",
      submissionDate: "2024-02-10",
      status: "graded",
      grade: "A-",
      feedback: "Excellent implementation of data structures. Good use of unit tests.",
    },
    {
      id: 3,
      assignment: "Basic Calculator",
      class: "CS101 - Introduction to Programming",
      repoUrl: "https://github.com/student/calculator-app",
      submissionDate: "2024-02-05",
      status: "graded",
      grade: "B+",
      feedback: "Good functionality, but could improve error handling.",
    },
    {
      id: 4,
      assignment: "Todo List App",
      class: "WEB201 - Web Development",
      repoUrl: "https://github.com/student/todo-app",
      submissionDate: "2024-01-28",
      status: "graded",
      grade: "A",
      feedback: "Outstanding work! Clean code and excellent UI design.",
    },
  ]

  const filteredSubmissions =
    selectedClass === "all" ? submissions : submissions.filter((submission) => submission.class === selectedClass)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-yellow-100 text-yellow-700"
      case "graded":
        return "bg-green-100 text-green-700"
      case "late":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getGradeColor = (grade: string | null) => {
    if (!grade) return ""
    if (grade.startsWith("A")) return "text-green-600 font-semibold"
    if (grade.startsWith("B")) return "text-blue-600 font-semibold"
    if (grade.startsWith("C")) return "text-yellow-600 font-semibold"
    return "text-red-600 font-semibold"
  }

  const stats = {
    totalSubmissions: submissions.length,
    gradedSubmissions: submissions.filter((s) => s.status === "graded").length,
    pendingSubmissions: submissions.filter((s) => s.status === "submitted").length,
    averageGrade: "B+", // This would be calculated from actual grades
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
                <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
                <p className="text-gray-600 mt-2">Track your assignment submissions and grades</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Graded</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.gradedSubmissions}</div>
                    <p className="text-xs text-muted-foreground">Received feedback</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingSubmissions}</div>
                    <p className="text-xs text-muted-foreground">Awaiting review</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                    <Badge className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.averageGrade}</div>
                    <p className="text-xs text-muted-foreground">Current semester</p>
                  </CardContent>
                </Card>
              </div>

              {/* Filter */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Filter Submissions</CardTitle>
                  <CardDescription>Select a class to view its submissions</CardDescription>
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
                    <div className="text-sm text-gray-600">Showing {filteredSubmissions.length} submission(s)</div>
                  </div>
                </CardContent>
              </Card>

              {/* Submissions Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Submission History</CardTitle>
                  <CardDescription>
                    {selectedClass === "all"
                      ? "All your submissions across classes"
                      : `Submissions for ${selectedClass}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Repository</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">{submission.assignment}</TableCell>
                          <TableCell>{submission.class}</TableCell>
                          <TableCell>
                            <a
                              href={submission.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                            >
                              <GitBranch className="h-4 w-4" />
                              <span className="truncate max-w-48">{submission.repoUrl.split("/").slice(-1)[0]}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              {new Date(submission.submissionDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {submission.grade ? (
                              <span className={getGradeColor(submission.grade)}>{submission.grade}</span>
                            ) : (
                              <span className="text-gray-400">Pending</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {submission.status === "graded" && submission.feedback ? (
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View Feedback
                              </Button>
                            ) : (
                              <span className="text-gray-400 text-sm">No feedback yet</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
