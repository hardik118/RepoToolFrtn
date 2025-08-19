"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch, Users, Code, Activity, Trash2, CheckCircle, Clock, AlertCircle, ExternalLink } from "lucide-react"

interface Repository {
  id: string
  url: string
  name: string
  status: "pending" | "analyzing" | "completed" | "error"
  linesOfCode?: number
  commits?: number
  contributors?: number
  lastUpdated?: string
  analyzedAt?: string
}

interface RepoTableProps {
  repositories: Repository[]
  title?: string
  description?: string
  onRemove?: (id: string) => void
  showActions?: boolean
}

export default function RepoTable({
  repositories,
  title = "Repository Analysis Queue",
  description = "Track the progress of your repository analyses",
  onRemove,
  showActions = true,
}: RepoTableProps) {
  const getStatusIcon = (status: Repository["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-gray-500" />
      case "analyzing":
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: Repository["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-700"
      case "analyzing":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "error":
        return "bg-red-100 text-red-700"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mobile View */}
        <div className="block lg:hidden space-y-4">
          {repositories.map((repo) => (
            <Card key={repo.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium truncate flex-1 mr-2">{repo.name}</div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(repo.status)}
                    <Badge className={getStatusColor(repo.status)}>{repo.status}</Badge>
                  </div>
                </div>

                <div className="text-sm text-gray-500 truncate">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {repo.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {repo.status === "completed" && (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="font-semibold text-blue-600">{repo.linesOfCode?.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Lines</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="font-semibold text-green-600">{repo.commits}</div>
                      <div className="text-xs text-gray-600">Commits</div>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <div className="font-semibold text-purple-600">{repo.contributors}</div>
                      <div className="text-xs text-gray-600">Contributors</div>
                    </div>
                  </div>
                )}

                {showActions && onRemove && (
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRemove(repo.id)}
                      disabled={repo.status === "analyzing"}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Repository</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lines of Code</TableHead>
                <TableHead>Commits</TableHead>
                <TableHead>Contributors</TableHead>
                <TableHead>Last Updated</TableHead>
                {showActions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {repositories.map((repo) => (
                <TableRow key={repo.id}>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="font-medium truncate">{repo.name}</div>
                      <div className="text-sm text-gray-500 truncate">
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          {repo.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(repo.status)}
                      <Badge className={getStatusColor(repo.status)}>{repo.status}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {repo.linesOfCode ? (
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-gray-500" />
                        <span>{repo.linesOfCode.toLocaleString()}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {repo.commits ? (
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <span>{repo.commits}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {repo.contributors ? (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{repo.contributors}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {repo.lastUpdated ? (
                      <span className="text-sm">
                        {Math.floor((Date.now() - new Date(repo.lastUpdated).getTime()) / (1000 * 60 * 60 * 24))}d ago
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      {onRemove && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRemove(repo.id)}
                          disabled={repo.status === "analyzing"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {repositories.length === 0 && (
          <div className="text-center py-8">
            <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No repositories added yet</h3>
            <p className="text-gray-600">Add GitHub repository URLs to start batch analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
