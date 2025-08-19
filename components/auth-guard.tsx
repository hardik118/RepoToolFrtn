"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: "teacher" | "student"
}

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: ("teacher" | "student")[]
  requiredRole?: "teacher" | "student"
}

export function AuthGuard({ children, allowedRoles, requiredRole }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")

    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData) as User

    const roleToCheck = requiredRole || (allowedRoles && allowedRoles[0])

    if (allowedRoles && !allowedRoles.includes(parsedUser.role)) {
      // Redirect to appropriate dashboard based on actual role
      if (parsedUser.role === "teacher") {
        router.push("/teacher/dashboard")
      } else {
        router.push("/student/dashboard")
      }
      return
    }

    if (requiredRole && parsedUser.role !== requiredRole) {
      // Redirect to appropriate dashboard based on actual role
      if (parsedUser.role === "teacher") {
        router.push("/teacher/dashboard")
      } else {
        router.push("/student/dashboard")
      }
      return
    }

    setUser(parsedUser)
    setIsLoading(false)
  }, [router, requiredRole, allowedRoles])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

export default AuthGuard
