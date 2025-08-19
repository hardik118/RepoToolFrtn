"use client"

import { useState } from "react"
import AuthGuard from "@/components/auth-guard"
import Sidebar from "@/components/layout/sidebar"
import Navbar from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ExternalLink, Eye, Calendar, GitBranch } from 'lucide-react'

export default function TeacherSubmissions() {
  const [selectedAssignment, setSelectedAssignment] = useState("all")

  const assignments = [
    "React Hooks Implementation",
    "Python Data Structures",
    "API Integration Project",
  ]

  const submissions = [
    {
      id: 1,
      studentName: "John Doe",
      studentEmail: "john.doe@email.com",
      assignment: "React Hooks Implementation",
      repoUrl: "https://github.com/johndoe/react-hooks-project",
      submissionDate: "2024-02-12",
      status: "submitted",
      grade: null,
    },
    {
      id: 2,
      studentName: "Sarah Smith",
      studentEmail: "sarah.smith@email.com",
      assignment: "React Hooks Implementation",
      repoUrl: "https://github.com/sarahsmith/hooks-demo",
      submissionDate: "2024-02-11",
      status: "reviewed",
      grade: "A",
    },
    {
      id: 3,
      studentName: "Mike Johnson",
      studentEmail: "mike.johnson@email.com",
      assignment: "Python Data Structures",
      repoUrl: "https://github.com/mikej/python-structures",
      submissionDate: "2024-02-10",
      status: "reviewed",
      grade: "B+",
    },
    {
      id: 4,
      studentName: "Emily Davis",
      studentEmail: "emily.davis@email.com",
      assignment: "React Hooks Implementation",
      repoUrl: "https://github.com/emilyd/react-learning",
      submissionDate: "2024-02-13",
      status: "submitted",
      grade: null,
    },
  ]

  const filteredSubmissions = selectedAssignment === "all" 
    ? submissions 
    : submissions.filter(sub => sub.assignment === selectedAssignment)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-yellow-100 text-yellow-700"
      case "reviewed":
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

  return (
    <AuthGuard requiredRole="teacher">
      <div className="flex h-screen bg-gray-50">
        <Sidebar role="teacher" />
        
        <div className="flex-1 flex flex-col md:ml-64">
          <Navbar />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Submissions</h1>
                <p className="text-gray-600 mt-2">Review and grade student submissions</p>
              </div>

              {/* Filter */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Filter Submissions</CardTitle>
                  <CardDescription>Select an assignment to view its submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 items-center">
                    <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select assignment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Assignments</SelectItem>
                        {assignments.map((assignment) => (
                          <SelectItem key={assignment} value={assignment}>
                            {assignment}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-sm text-gray-600">
                      Showing {filteredSubmissions.length} submission(s)
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submissions Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Submissions</CardTitle>
                  <CardDescription>
                    {selectedAssignment === "all" 
                      ? "All submissions across assignments" 
                      : `Submissions for ${selectedAssignment}`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Assignment</TableHead>
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
                          <TableCell>
                            <div>
                              <div className="font-medium">{submission.studentName}</div>
                              <div className="text-sm text-gray-500">{submission.studentEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {submission.assignment}
                          </TableCell>
                          <TableCell>
                            <a
                              href={submission.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                            >
                              <GitBranch className="h-4 w-4" />
                              <span className="truncate max-w-48">
                                {submission.repoUrl.split('/').slice(-1)[0]}
                              </span>
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
                            <Badge className={getStatusColor(submission.status)}>
                              {submission.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {submission.grade ? (
                              <span className={getGradeColor(submission.grade)}>
                                {submission.grade}
                              </span>
                            ) : (
                              <span className="text-gray-400">Not graded</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                Analyze
                              </Button>
                            </div>
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
