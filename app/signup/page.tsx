"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { signup } from "@/api/auth"

export default function SignupPage() {
  const[name, setName]= useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("")
  const [classroomId, setClassroomId] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()


  const handleSignup = async (e: React.FormEvent) => {
    console.log(1);
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword || !role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }
     if (role === "student" && !classroomId) {
      toast({
        title: "Error",
        description: "Please enter classroom ID",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

     try {
          console.log(2);

    const data = await signup({
      name,
      email,
      password,
      role: role as "teacher" | "student",
      classroomId: role === "student" ? Number(classroomId) : undefined,
    })

    toast({
      title: "Success",
      description: "Account created successfully",
    })


    const userObject = {
      id: data.userId,
      email: email, // Use the email from state
      name: name,   // Use the name from state
      role: data.role.toLowerCase(), // Ensure role is lowercase to match AuthGuard's logic
    }
    localStorage.setItem("user", JSON.stringify(userObject))

    console.log(data);
    console.log(data.role)
    // Now redirect based on the role returned from the backend
        console.log("Lowercased role:", data.role.toLowerCase()); 

    if (data.role.toLowerCase() === "teacher") {
      console.log(true);
      router.push("/teacher/dashboard")
    } else if (data.role.toLowerCase() === "student") {
      router.push("/student/dashboard")
    } else {
      router.push("/")
    }

  } catch (error: any) {
    toast({
      title: "Signup failed",
      description: error.message || "Unknown error",
      variant: "destructive",
    })
  } finally {
    setIsLoading(false)
  }
}

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
           <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

          

           {
            role=="student" && 
             <div className="space-y-2">
              <Label htmlFor="classroomId">Classroom Id</Label>
              <Input
                id="classroomId"
                placeholder="Id your Teacher shared "
                value={classroomId}
                onChange={(e) => setClassroomId(e.target.value)}
                required
              />
            </div>
           }

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
