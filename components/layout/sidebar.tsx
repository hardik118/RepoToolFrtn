"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Send,
  BarChart3,
  LogOut,
  Menu,
  X,
  UserPlus,
  GitBranch,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SidebarProps {
  role: "teacher" | "student"
}

const teacherNavItems = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teacher/classes", label: "Classes", icon: Users },
  { href: "/teacher/assignments", label: "Assignments", icon: BookOpen },
  { href: "/teacher/submissions", label: "Submissions", icon: FileText },
  { href: "/teacher/students", label: "Students", icon: UserPlus },
  { href: "/repo-analysis", label: "Repo Analysis", icon: GitBranch },
]

const studentNavItems = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/classes", label: "My Classes", icon: Users },
  { href: "/student/assignments", label: "Assignments", icon: BookOpen },
  { href: "/student/submissions", label: "My Submissions", icon: Send },
  { href: "/student/results", label: "Results", icon: BarChart3 },
  { href: "/repo-analysis", label: "Repo Analysis", icon: GitBranch },
]

export default function Sidebar({ role }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const navItems = role === "teacher" ? teacherNavItems : studentNavItems

  const handleLogout = () => {
    localStorage.removeItem("user")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
    router.push("/")
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Repo Analysis</h2>
            <p className="text-sm text-gray-500 capitalize">{role} Portal</p>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="truncate">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
