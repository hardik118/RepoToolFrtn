"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Eye, Calendar, GitBranch, FileText } from "lucide-react"

interface Submission {
  id: number
  studentName?: string
  studentEmail?: string
  assignment: string
  class?: string
  repoUrl: string
  submissionDate: string
  status: "submitted" | "reviewed" | "graded" | "late"
  grade?: string | null
  feedback?: string | null
}

interface SubmissionTableProps {
  submissions: Submission[]
  title?: string
  description?: string
  showStudent?: boolean
  showClass?: boolean
  onAnalyze?: (submission: Submission) => void
  onViewFeedback?: (submission: Submission) => void
}

export default function SubmissionTable({
  submissions,
  title = "Submissions",
  description,
  showStudent = true,
  showClass = false,
  onAnalyze,
  onViewFeedback,
}: SubmissionTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-yellow-100 text-yellow-700"
      case "reviewed":
      case "graded":
        return "bg-green-100 text-green-700"
      case "late":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getGradeColor = (grade: string | null) => {
    if (!grade) return ""
    if (grade.startsWith("A")) return "text-green-600 font-semibold"
    if (grade.startsWith("B")) return "text-blue-600 font-semibold"
    if (grade.startsWith("C")) return "text-yellow-600 font-semibold"
    return "text-red-600 font-semibold"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {/* Mobile View */}
        <div className="block md:hidden space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="p-4">
              <div className="space-y-3">
                {showStudent && submission.studentName && (
                  <div>
                    <div className="font-medium">{submission.studentName}</div>
                    <div className="text-sm text-gray-500">{submission.studentEmail}</div>
                  </div>
                )}

                <div className="font-medium">{submission.assignment}</div>

                {showClass && submission.class && <div className="text-sm text-gray-600">{submission.class}</div>}

                <div className="flex items-center gap-2">
                  <a
                    href={submission.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <GitBranch className="h-4 w-4" />
                    <span className="truncate">{submission.repoUrl.split("/").slice(-1)[0]}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {new Date(submission.submissionDate).toLocaleDateString()}
                  </div>
                  <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {submission.grade ? (
                      <span className={getGradeColor(submission.grade)}>{submission.grade}</span>
                    ) : (
                      <span className="text-gray-400">Not graded</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {onAnalyze && (
                      <Button size="sm" variant="outline" onClick={() => onAnalyze(submission)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Analyze
                      </Button>
                    )}
                    {onViewFeedback && submission.status === "graded" && submission.feedback && (
                      <Button size="sm" variant="outline" onClick={() => onViewFeedback(submission)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Feedback
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                {showStudent && <TableHead>Student</TableHead>}
                <TableHead>Assignment</TableHead>
                {showClass && <TableHead>Class</TableHead>}
                <TableHead>Repository</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  {showStudent && (
                    <TableCell>
                      {submission.studentName && (
                        <div>
                          <div className="font-medium">{submission.studentName}</div>
                          <div className="text-sm text-gray-500">{submission.studentEmail}</div>
                        </div>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{submission.assignment}</TableCell>
                  {showClass && <TableCell>{submission.class}</TableCell>}
                  <TableCell>
                    <a
                      href={submission.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <GitBranch className="h-4 w-4" />
                      <span className="truncate max-w-48">{submission.repoUrl.split("/").slice(-1)[0]}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {new Date(submission.submissionDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {submission.grade ? (
                      <span className={getGradeColor(submission.grade)}>{submission.grade}</span>
                    ) : (
                      <span className="text-gray-400">Not graded</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {onAnalyze && (
                        <Button size="sm" variant="outline" onClick={() => onAnalyze(submission)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Analyze
                        </Button>
                      )}
                      {onViewFeedback && submission.status === "graded" && submission.feedback && (
                        <Button size="sm" variant="outline" onClick={() => onViewFeedback(submission)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Feedback
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {submissions.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
            <p className="text-gray-600">Submissions will appear here when students submit their work</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
