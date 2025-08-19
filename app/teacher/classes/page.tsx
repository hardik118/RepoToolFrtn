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
import { Plus, Users, Copy, Check } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function TeacherClasses() {
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: "CS101 - Introduction to Programming",
      description: "Basic programming concepts using Python",
      code: "CS101ABC",
      students: 15,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "WEB201 - Web Development",
      description: "Modern web development with React and Node.js",
      code: "WEB201XYZ",
      students: 12,
      createdAt: "2024-01-20",
    },
  ])

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newClass, setNewClass] = useState({ name: "", description: "" })
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const { toast } = useToast()

  const generateClassCode = () => {
    return Math.random().toString(36).substr(2, 9).toUpperCase()
  }

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newClass.name || !newClass.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const classCode = generateClassCode()
    const createdClass = {
      id: classes.length + 1,
      name: newClass.name,
      description: newClass.description,
      code: classCode,
      students: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }

    setClasses([...classes, createdClass])
    setNewClass({ name: "", description: "" })
    setIsCreateOpen(false)

    toast({
      title: "Success",
      description: `Class created with code: ${classCode}`,
    })
  }

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
    
    toast({
      title: "Copied",
      description: "Class code copied to clipboard",
    })
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
                  <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
                  <p className="text-gray-600 mt-2">Manage your classes and share codes with students</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Class
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Class</DialogTitle>
                      <DialogDescription>
                        Create a new class and get a shareable code for students to join.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateClass} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="className">Class Name</Label>
                        <Input
                          id="className"
                          placeholder="e.g., CS101 - Introduction to Programming"
                          value={newClass.name}
                          onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="classDescription">Description</Label>
                        <Textarea
                          id="classDescription"
                          placeholder="Brief description of the class"
                          value={newClass.description}
                          onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Create Class</Button>
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
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{classItem.students} students</span>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Class Code</Label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 bg-gray-100 rounded-md text-sm font-mono">
                            {classItem.code}
                          </code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyClassCode(classItem.code)}
                          >
                            {copiedCode === classItem.code ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Created on {new Date(classItem.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
