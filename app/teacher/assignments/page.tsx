"use client"

import { useState } from "react"
import AuthGuard from "@/components/auth-guard"
import Sidebar from "@/components/layout/sidebar"
import Navbar from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar, Clock } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "React Hooks Implementation",
      description: "Create a React app demonstrating useState and useEffect hooks",
      class: "WEB201 - Web Development",
      deadline: "2024-02-15",
      status: "active",
      submissions: 8,
      totalStudents: 12,
    },
    {
      id: 2,
      title: "Python Data Structures",
      description: "Implement basic data structures: stack, queue, and linked list",
      class: "CS101 - Introduction to Programming",
      deadline: "2024-02-10",
      status: "closed",
      submissions: 15,
      totalStudents: 15,
    },
  ])

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    class: "",
    deadline: "",
  })
  const { toast } = useToast()

  const classes = [
    "CS101 - Introduction to Programming",
    "WEB201 - Web Development",
  ]

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newAssignment.title || !newAssignment.description || !newAssignment.class || !newAssignment.deadline) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const createdAssignment = {
      id: assignments.length + 1,
      title: newAssignment.title,
      description: newAssignment.description,
      class: newAssignment.class,
      deadline: newAssignment.deadline,
      status: "active" as const,
      submissions: 0,
      totalStudents: 12, // Mock data
    }

    setAssignments([...assignments, createdAssignment])
    setNewAssignment({ title: "", description: "", class: "", deadline: "" })
    setIsCreateOpen(false)

    toast({
      title: "Success",
      description: "Assignment created successfully",
    })
  }

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <AuthGuard requiredRole="teacher">
      <div className="flex h-screen bg-gray-50">
        <Sidebar role="teacher" />
        
        <div className="flex-1 flex flex-col md:ml-64">
          <Navbar />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
                  <p className="text-gray-600 mt-2">Create and manage assignments for your classes</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Assignment</DialogTitle>
                      <DialogDescription>
                        Create a new assignment for your students to complete.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateAssignment} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Assignment Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g., React Hooks Implementation"
                          value={newAssignment.title}
                          onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Detailed assignment instructions"
                          value={newAssignment.description}
                          onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Select value={newAssignment.class} onValueChange={(value) => setNewAssignment({ ...newAssignment, class: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map((className) => (
                              <SelectItem key={className} value={className}>
                                {className}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={newAssignment.deadline}
                          onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Create Assignment</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-6">
                {assignments.map((assignment) => {
                  const daysLeft = getDaysUntilDeadline(assignment.deadline)
                  
                  return (
                    <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{assignment.title}</CardTitle>
                            <CardDescription className="mt-2">{assignment.description}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
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
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>
                                Due: {new Date(assignment.deadline).toLocaleDateString()}
                                {assignment.status === "active" && (
                                  <span className={`ml-2 ${daysLeft <= 3 ? 'text-red-600' : 'text-gray-600'}`}>
                                    ({daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'})
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {assignment.submissions}/{assignment.totalStudents}
                            </div>
                            <div className="text-sm text-gray-600">Submissions</div>
                          </div>

                          <div className="flex justify-end">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
