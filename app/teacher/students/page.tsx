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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, UserMinus, Calendar, Users } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function TeacherStudents() {
  const [selectedClass, setSelectedClass] = useState("all")
  const { toast } = useToast()

  const classes = [
    "CS101 - Introduction to Programming",
    "WEB201 - Web Development",
  ]

  const students = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      class: "CS101 - Introduction to Programming",
      joinedDate: "2024-01-20",
      submissions: 3,
      lastActive: "2024-02-12",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah.smith@email.com",
      class: "WEB201 - Web Development",
      joinedDate: "2024-01-22",
      submissions: 5,
      lastActive: "2024-02-13",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      class: "CS101 - Introduction to Programming",
      joinedDate: "2024-01-25",
      submissions: 2,
      lastActive: "2024-02-10",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@email.com",
      class: "WEB201 - Web Development",
      joinedDate: "2024-01-28",
      submissions: 4,
      lastActive: "2024-02-13",
    },
    {
      id: 5,
      name: "Alex Wilson",
      email: "alex.wilson@email.com",
      class: "CS101 - Introduction to Programming",
      joinedDate: "2024-02-01",
      submissions: 1,
      lastActive: "2024-02-11",
    },
  ]

  const filteredStudents = selectedClass === "all" 
    ? students 
    : students.filter(student => student.class === selectedClass)

  const handleRemoveStudent = (studentId: number, studentName: string) => {
    // In a real app, this would make an API call
    toast({
      title: "Student Removed",
      description: `${studentName} has been removed from the class`,
      variant: "destructive",
    })
  }

  const handleMessageStudent = (studentEmail: string) => {
    // In a real app, this would open a messaging interface
    toast({
      title: "Message Sent",
      description: `Message sent to ${studentEmail}`,
    })
  }

  const getActivityStatus = (lastActive: string) => {
    const today = new Date()
    const activeDate = new Date(lastActive)
    const diffDays = Math.floor((today.getTime() - activeDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return { status: "Active today", color: "bg-green-100 text-green-700" }
    if (diffDays <= 3) return { status: "Recent", color: "bg-blue-100 text-blue-700" }
    if (diffDays <= 7) return { status: "This week", color: "bg-yellow-100 text-yellow-700" }
    return { status: "Inactive", color: "bg-gray-100 text-gray-700" }
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
                <h1 className="text-3xl font-bold text-gray-900">Students</h1>
                <p className="text-gray-600 mt-2">Manage students across your classes</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{students.length}</div>
                    <p className="text-xs text-muted-foreground">Across all classes</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active This Week</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {students.filter(s => {
                        const diffDays = Math.floor((new Date().getTime() - new Date(s.lastActive).getTime()) / (1000 * 60 * 60 * 24))
                        return diffDays <= 7
                      }).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Students with recent activity</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Submissions</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(students.reduce((acc, s) => acc + s.submissions, 0) / students.length * 10) / 10}
                    </div>
                    <p className="text-xs text-muted-foreground">Per student</p>
                  </CardContent>
                </Card>
              </div>

              {/* Filter */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Filter Students</CardTitle>
                  <CardDescription>Select a class to view its students</CardDescription>
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
                    <div className="text-sm text-gray-600">
                      Showing {filteredStudents.length} student(s)
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Students Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Student List</CardTitle>
                  <CardDescription>
                    {selectedClass === "all" 
                      ? "All students across classes" 
                      : `Students in ${selectedClass}`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Submissions</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => {
                        const activityStatus = getActivityStatus(student.lastActive)
                        
                        return (
                          <TableRow key={student.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-blue-100 text-blue-700">
                                    {student.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{student.name}</div>
                                  <div className="text-sm text-gray-500">{student.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {student.class}
                            </TableCell>
                            <TableCell>
                              {new Date(student.joinedDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="text-center">
                                <span className="font-semibold">{student.submissions}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(student.lastActive).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge className={activityStatus.color}>
                                {activityStatus.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleMessageStudent(student.email)}
                                >
                                  <Mail className="h-4 w-4 mr-1" />
                                  Message
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleRemoveStudent(student.id, student.name)}
                                >
                                  <UserMinus className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
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
