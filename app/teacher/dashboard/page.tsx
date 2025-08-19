"use client"

import AuthGuard from "@/components/auth-guard"
import Sidebar from "@/components/layout/sidebar"
import Navbar from "@/components/layout/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, FileText, TrendingUp } from 'lucide-react'

export default function TeacherDashboard() {
  // Mock data - in real app this would come from API
  const stats = {
    totalClasses: 3,
    totalAssignments: 12,
    totalSubmissions: 45,
    totalStudents: 28,
  }

  const recentActivity = [
    { id: 1, action: "New submission from John Doe", time: "2 hours ago", type: "submission" },
    { id: 2, action: "Assignment 'React Hooks' deadline approaching", time: "1 day ago", type: "deadline" },
    { id: 3, action: "Sarah Smith joined CS101 class", time: "2 days ago", type: "join" },
    { id: 4, action: "New assignment 'API Integration' created", time: "3 days ago", type: "assignment" },
  ]

  return (
    <AuthGuard requiredRole="teacher">
      <div className="flex h-screen bg-gray-50">
        <Sidebar role="teacher" />
        
        <div className="flex-1 flex flex-col md:ml-64">
          <Navbar />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's what's happening in your classes.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalClasses}</div>
                    <p className="text-xs text-muted-foreground">Active classes</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalAssignments}</div>
                    <p className="text-xs text-muted-foreground">Total created</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                    <p className="text-xs text-muted-foreground">Pending review</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Students</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalStudents}</div>
                    <p className="text-xs text-muted-foreground">Across all classes</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your classes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.type === 'submission' ? 'bg-blue-100 text-blue-700' :
                          activity.type === 'deadline' ? 'bg-orange-100 text-orange-700' :
                          activity.type === 'join' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {activity.type}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
