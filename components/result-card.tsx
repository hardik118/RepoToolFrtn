import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar, GitBranch, TrendingUp } from "lucide-react"

interface ResultCardProps {
  result: {
    id: number
    assignment: string
    class: string
    repoUrl: string
    submissionDate: string
    grade: string
    feedback: string
    analysisResults: {
      linesOfCode: number
      commits: number
      testCoverage: number
      codeQuality: string
    }
  }
}

export default function ResultCard({ result }: ResultCardProps) {
  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600"
    if (grade.startsWith("B")) return "text-blue-600"
    if (grade.startsWith("C")) return "text-yellow-600"
    return "text-red-600"
  }

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case "excellent":
        return "bg-green-100 text-green-700"
      case "good":
        return "bg-blue-100 text-blue-700"
      case "fair":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg sm:text-xl break-words">{result.assignment}</CardTitle>
            <CardDescription className="mt-1">{result.class}</CardDescription>
          </div>
          <div className="text-center sm:text-right">
            <div className={`text-2xl sm:text-3xl font-bold ${getGradeColor(result.grade)}`}>{result.grade}</div>
            <div className="text-sm text-gray-500">{new Date(result.submissionDate).toLocaleDateString()}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Repository Analysis */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Repository Analysis
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-blue-600">{result.analysisResults.linesOfCode}</div>
              <div className="text-xs text-gray-600">Lines of Code</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-green-600">{result.analysisResults.commits}</div>
              <div className="text-xs text-gray-600">Commits</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-purple-600">
                {result.analysisResults.testCoverage}%
              </div>
              <div className="text-xs text-gray-600">Test Coverage</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Badge className={getQualityColor(result.analysisResults.codeQuality)}>
                {result.analysisResults.codeQuality}
              </Badge>
              <div className="text-xs text-gray-600 mt-1">Code Quality</div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div>
          <h4 className="font-semibold mb-3">Teacher Feedback</h4>
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-gray-700 text-sm sm:text-base">{result.feedback}</p>
          </div>
        </div>

        {/* Repository Link */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Submitted on {new Date(result.submissionDate).toLocaleDateString()}</span>
          </div>
          <a href={result.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
              <GitBranch className="h-4 w-4 mr-2" />
              View Repository
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
