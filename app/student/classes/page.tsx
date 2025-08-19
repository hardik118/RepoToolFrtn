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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Calendar, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function StudentClasses() {
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: "CS101 - Introduction to Programming",
      description: "Basic programming concepts using Python",
      teacher: "Dr. Smith",
      students: 15,
      assignments: 8,
      joinedDate: "2024-01-15",
    },
    {
      id: 2,
      name: "WEB201 - Web Development",
      description: "Modern web development with React and Node.js",
      teacher: "Prof. Johnson",
      students: 12,
      assignments: 6,
      joinedDate: "2024-01-20",
    },
  ])

  const [isJoinOpen, setIsJoinOpen] = useState(false)
  const [classCode, setClassCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!classCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a class code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock validation - in real app this would validate against backend
      const validCodes = ["CS101ABC", "WEB201XYZ", "MATH301DEF"]

      if (validCodes.includes(classCode.toUpperCase())) {
        // Check if already joined
        const alreadyJoined = classes.some((c) => c.name.includes(classCode.substring(0, 5)))

        if (alreadyJoined) {
          toast({
            title: "Already Joined",
            description: "You are already enrolled in this class",
            variant: "destructive",
          })
        } else {
          // Add new class (mock data)
          const newClass = {
            id: classes.length + 1,
            name: `${classCode.substring(0, 6)} - Sample Class`,
            description: "Class description will be loaded from server",
            teacher: "Instructor Name",
            students: Math.floor(Math.random() * 20) + 10,
            assignments: Math.floor(Math.random() * 10) + 3,
            joinedDate: new Date().toISOString().split("T")[0],
          }

          setClasses([...classes, newClass])
          toast({
            title: "Success",
            description: "Successfully joined the class!",
          })
        }
      } else {
        toast({
          title: "Invalid Code",
          description: "The class code you entered is not valid",
          variant: "destructive",
        })
      }

      setClassCode("")
      setIsJoinOpen(false)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <AuthGuard requiredRole="student">
      <div className="flex h-screen bg-gray-50">
        <Sidebar role="student" />

        <div className="flex-1 flex flex-col md:ml-64">
          <Navbar />

          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
                  <p className="text-gray-600 mt-2">Classes you're enrolled in</p>
                </div>

                <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Join Class
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Join a Class</DialogTitle>
                      <DialogDescription>
                        Enter the class code provided by your teacher to join a class.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleJoinClass} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="classCode">Class Code</Label>
                        <Input
                          id="classCode"
                          placeholder="e.g., CS101ABC"
                          value={classCode}
                          onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                          required
                        />
                        <p className="text-xs text-gray-500">Ask your teacher for the class code</p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsJoinOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Joining..." : "Join Class"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((classItem) => (
                  <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{classItem.name}</CardTitle>
                      <CardDescription>{classItem.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <strong>Teacher:</strong> {classItem.teacher}
                        </div>
                        <Badge variant="secondary">Enrolled</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{classItem.students} students</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-gray-500" />
                          <span>{classItem.assignments} assignments</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Joined on {new Date(classItem.joinedDate).toLocaleDateString()}</span>
                      </div>

                      <div className="pt-2">
                        <Button variant="outline" className="w-full bg-transparent" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {classes.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No classes yet</h3>
                  <p className="text-gray-600 mb-4">Join your first class using a class code from your teacher</p>
                  <Button onClick={() => setIsJoinOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Join Class
                  </Button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
