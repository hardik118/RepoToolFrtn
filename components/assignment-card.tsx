"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, AlertCircle } from "lucide-react"

interface AssignmentCardProps {
  assignment: {
    id: number
    title: string
    description: string
    class?: string
    deadline: string
    status: "active" | "closed"
    submitted?: boolean
    submissionUrl?: string | null
    submissions?: number
    totalStudents?: number
  }
  userRole: "teacher" | "student"
  onSubmit?: () => void
  onViewDetails?: () => void
}

export default function AssignmentCard({ assignment, userRole, onSubmit, onViewDetails }: AssignmentCardProps) {
  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (status: string, submitted?: boolean, deadline?: string) => {
    if (submitted) return "bg-green-100 text-green-700"
    if (status === "closed") return "bg-gray-100 text-gray-700"

    if (deadline) {
      const daysLeft = getDaysUntilDeadline(deadline)
      if (daysLeft <= 1) return "bg-red-100 text-red-700"
      if (daysLeft <= 3) return "bg-orange-100 text-orange-700"
    }
    return "bg-blue-100 text-blue-700"
  }

  const getStatusText = (status: string, submitted?: boolean, deadline?: string) => {
    if (submitted) return "Submitted"
    if (status === "closed") return "Closed"

    if (deadline) {
      const daysLeft = getDaysUntilDeadline(deadline)
      if (daysLeft <= 0) return "Overdue"
    }
    return "Active"
  }

  const daysLeft = getDaysUntilDeadline(assignment.deadline)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl break-words">{assignment.title}</CardTitle>
            <CardDescription className="mt-2 text-sm sm:text-base">{assignment.description}</CardDescription>
          </div>
          <Badge className={getStatusColor(assignment.status, assignment.submitted, assignment.deadline)}>
            {getStatusText(assignment.status, assignment.submitted, assignment.deadline)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Assignment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {assignment.class && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Class: {assignment.class}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0" />
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
          </div>

          {/* Teacher View - Submission Stats */}
          {userRole === "teacher" && assignment.submissions !== undefined && assignment.totalStudents && (
            <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {assignment.submissions}/{assignment.totalStudents}
                </div>
                <div className="text-sm text-gray-600">Submissions</div>
              </div>
            </div>
          )}

          {/* Warning for urgent deadlines */}
          {daysLeft <= 1 && !assignment.submitted && assignment.status === "active" && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-600">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">Due Soon!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            {userRole === "student" ? (
              assignment.submitted ? (
                <Button variant="outline" size="sm" disabled className="w-full sm:w-auto bg-transparent">
                  Submitted
                </Button>
              ) : assignment.status === "active" ? (
                <Button size="sm" onClick={onSubmit} className="w-full sm:w-auto">
                  Submit Assignment
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled className="w-full sm:w-auto bg-transparent">
                  Closed
                </Button>
              )
            ) : (
              <Button variant="outline" size="sm" onClick={onViewDetails} className="w-full sm:w-auto bg-transparent">
                View Details
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
