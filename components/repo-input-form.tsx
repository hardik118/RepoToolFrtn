"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GitBranch, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RepoInputFormProps {
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
  isLoading?: boolean
  onSubmit: (repoUrl: string) => void
}

export default function RepoInputForm({
  title = "Analyze Repository",
  description = "Enter a GitHub repository URL to start the analysis",
  placeholder = "https://github.com/username/repository-name",
  buttonText = "Analyze Repository",
  isLoading = false,
  onSubmit,
}: RepoInputFormProps) {
  const [repoUrl, setRepoUrl] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!repoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a repository URL",
        variant: "destructive",
      })
      return
    }

    // Basic GitHub URL validation
    if (!repoUrl.includes("github.com")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GitHub repository URL",
        variant: "destructive",
      })
      return
    }

    onSubmit(repoUrl)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repoUrl">GitHub Repository URL</Label>
            <Input
              id="repoUrl"
              placeholder={placeholder}
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={isLoading}
              required
              className="w-full"
            />
            <p className="text-xs text-gray-500">Make sure the repository is public so it can be analyzed</p>
          </div>
          <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <GitBranch className="h-4 w-4 mr-2" />
                {buttonText}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
