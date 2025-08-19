"use client"

import AuthGuard from "@/components/auth-guard"
import Sidebar from "@/components/layout/sidebar"
import Navbar from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function StudentDashboard() {
  // Mock data - in real app this would come from API
  const stats = {
    enrolledClasses: 2,
    activeAssignments: 3,
    completedSubmissions: 8,
    pendingReviews: 2,
  }

  const upcomingDeadlines = [
    {
      id: 1,
      assignment: "React Hooks Implementation",
      class: "WEB201 - Web Development",
      deadline: "2024-02-15",
      status: "not_submitted",
    },
    {
      id: 2,
      assignment: "API Integration Project",
      class: "WEB201 - Web Development",
      deadline: "2024-02-20",
      status: "not_submitted",
    },
    {
      id: 3,
      assignment: "Database Design",
      class: "CS101 - Introduction to Programming",
      deadline: "2024-02-25",
      status: "submitted",
    },
  ]

  const recentActivity = [
    { id: 1, action: "Submitted React Hooks Implementation", time: "2 hours ago", type: "submission" },
    { id: 2, action: "Received grade for Python Data Structures: A-", time: "1 day ago", type: "grade" },
    { id: 3, action: "Joined WEB201 - Web Development class", time: "3 days ago", type: "join" },
    { id: 4, action: "New assignment 'API Integration' available", time: "5 days ago", type: "assignment" },
  ]

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDeadlineColor = (deadline: string, status: string) => {
    if (status === "submitted") return "text-green-600"
    const days = getDaysUntilDeadline(deadline)
    if (days <= 1) return "text-red-600"
    if (days <= 3) return "text-orange-600"
    return "text-gray-600"
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
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Track your progress and upcoming assignments</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Enrolled Classes</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.enrolledClasses}</div>
                    <p className="text-xs text-muted-foreground">Active classes</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeAssignments}</div>
                    <p className="text-xs text-muted-foreground">Need submission</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.completedSubmissions}</div>
                    <p className="text-xs text-muted-foreground">Submissions</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingReviews}</div>
                    <p className="text-xs text-muted-foreground">Awaiting grades</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Deadlines */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Deadlines</CardTitle>
                    <CardDescription>Assignments due soon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingDeadlines.map((item) => {
                        const daysLeft = getDaysUntilDeadline(item.deadline)

                        return (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.assignment}</p>
                              <p className="text-sm text-gray-600">{item.class}</p>
                              <p className={`text-sm font-medium ${getDeadlineColor(item.deadline, item.status)}`}>
                                Due: {new Date(item.deadline).toLocaleDateString()}
                                {item.status === "submitted" ? (
                                  <span className="ml-2 text-green-600">✓ Submitted</span>
                                ) : (
                                  <span className="ml-2">({daysLeft > 0 ? `${daysLeft} days left` : "Overdue"})</span>
                                )}
                              </p>
                            </div>
                            <div className="ml-4">
                              {item.status === "submitted" ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : daysLeft <= 1 ? (
                                <AlertCircle className="h-5 w-5 text-red-600" />
                              ) : (
                                <Clock className="h-5 w-5 text-orange-600" />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest actions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              activity.type === "submission"
                                ? "bg-blue-100 text-blue-700"
                                : activity.type === "grade"
                                  ? "bg-green-100 text-green-700"
                                  : activity.type === "join"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {activity.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
