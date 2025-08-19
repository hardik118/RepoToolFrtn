"use client"

import type React from "react"

import { useState } from "react"
import AuthGuard from "@/components/auth-guard"
import Sidebar from "@/components/layout/sidebar"
import Navbar from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, ExternalLink, GitBranch, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function StudentAssignments() {
  const [selectedClass, setSelectedClass] = useState("all")
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null)
  const [repoUrl, setRepoUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const classes = ["CS101 - Introduction to Programming", "WEB201 - Web Development"]

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "React Hooks Implementation",
      description:
        "Create a React app demonstrating useState and useEffect hooks. Include at least 3 different hooks and show practical examples of their usage.",
      class: "WEB201 - Web Development",
      deadline: "2024-02-15",
      status: "active",
      submitted: false,
      submissionUrl: null,
    },
    {
      id: 2,
      title: "Python Data Structures",
      description:
        "Implement basic data structures: stack, queue, and linked list. Include unit tests for each implementation.",
      class: "CS101 - Introduction to Programming",
      deadline: "2024-02-10",
      status: "closed",
      submitted: true,
      submissionUrl: "https://github.com/student/python-structures",
    },
    {
      id: 3,
      title: "API Integration Project",
      description:
        "Build a web application that integrates with a REST API. Use fetch or axios to retrieve and display data.",
      class: "WEB201 - Web Development",
      deadline: "2024-02-20",
      status: "active",
      submitted: false,
      submissionUrl: null,
    },
    {
      id: 4,
      title: "Database Design",
      description:
        "Design and implement a database schema for a library management system. Include ER diagrams and SQL scripts.",
      class: "CS101 - Introduction to Programming",
      deadline: "2024-02-25",
      status: "active",
      submitted: false,
      submissionUrl: null,
    },
  ])

  const filteredAssignments =
    selectedClass === "all" ? assignments : assignments.filter((assignment) => assignment.class === selectedClass)

  const handleSubmitAssignment = async (e: React.FormEvent) => {
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

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      // Update assignment status
      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === selectedAssignment
            ? { ...assignment, submitted: true, submissionUrl: repoUrl }
            : assignment,
        ),
      )

      toast({
        title: "Success",
        description: "Assignment submitted successfully!",
      })

      setRepoUrl("")
      setSubmitDialogOpen(false)
      setSelectedAssignment(null)
      setIsSubmitting(false)
    }, 1000)
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (status: string, submitted: boolean, deadline: string) => {
    if (submitted) return "bg-green-100 text-green-700"
    if (status === "closed") return "bg-gray-100 text-gray-700"

    const daysLeft = getDaysUntilDeadline(deadline)
    if (daysLeft <= 1) return "bg-red-100 text-red-700"
    if (daysLeft <= 3) return "bg-orange-100 text-orange-700"
    return "bg-blue-100 text-blue-700"
  }

  const getStatusText = (status: string, submitted: boolean, deadline: string) => {
    if (submitted) return "Submitted"
    if (status === "closed") return "Closed"

    const daysLeft = getDaysUntilDeadline(deadline)
    if (daysLeft <= 0) return "Overdue"
    return "Active"
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
                <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
                <p className="text-gray-600 mt-2">View and submit your assignments</p>
              </div>

              {/* Filter */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Filter Assignments</CardTitle>
                  <CardDescription>Select a class to view its assignments</CardDescription>
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
                    <div className="text-sm text-gray-600">Showing {filteredAssignments.length} assignment(s)</div>
                  </div>
                </CardContent>
              </Card>

              {/* Assignments */}
              <div className="space-y-6">
                {filteredAssignments.map((assignment) => {
                  const daysLeft = getDaysUntilDeadline(assignment.deadline)

                  return (
                    <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{assignment.title}</CardTitle>
                            <CardDescription className="mt-2 text-base">{assignment.description}</CardDescription>
                          </div>
                          <Badge
                            className={getStatusColor(assignment.status, assignment.submitted, assignment.deadline)}
                          >
                            {getStatusText(assignment.status, assignment.submitted, assignment.deadline)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>Class: {assignment.class}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4" />
                              <span
                                className={
                                  assignment.submitted
                                    ? "text-gray-600"
                                    : daysLeft <= 1
                                      ? "text-red-600 font-medium"
                                      : daysLeft <= 3
                                        ? "text-orange-600 font-medium"
                                        : "text-gray-600"
                                }
                              >
                                Due: {new Date(assignment.deadline).toLocaleDateString()}
                                {!assignment.submitted && assignment.status === "active" && (
                                  <span className="ml-2">({daysLeft > 0 ? `${daysLeft} days left` : "Overdue"})</span>
                                )}
                              </span>
                            </div>
                            {assignment.submitted && assignment.submissionUrl && (
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <GitBranch className="h-4 w-4" />
                                <a
                                  href={assignment.submissionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline flex items-center gap-1"
                                >
                                  View Submission
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-center">
                            {daysLeft <= 1 && !assignment.submitted && assignment.status === "active" && (
                              <div className="flex items-center gap-2 text-red-600">
                                <AlertCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">Due Soon!</span>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-end">
                            {assignment.submitted ? (
                              <Button variant="outline" size="sm" disabled>
                                Submitted
                              </Button>
                            ) : assignment.status === "active" ? (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedAssignment(assignment.id)
                                  setSubmitDialogOpen(true)
                                }}
                              >
                                Submit Assignment
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" disabled>
                                Closed
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Submit Assignment Dialog */}
              <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Assignment</DialogTitle>
                    <DialogDescription>
                      Provide the GitHub repository URL for your assignment submission.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmitAssignment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="repoUrl">GitHub Repository URL</Label>
                      <Input
                        id="repoUrl"
                        placeholder="https://github.com/username/repository-name"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Make sure your repository is public so your teacher can access it
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setSubmitDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Assignment"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
