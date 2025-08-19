import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Repo Analysis Classroom</CardTitle>
          <CardDescription>Analyze GitHub repositories for educational purposes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/login" className="w-full">
            <Button className="w-full" size="lg">
              Login
            </Button>
          </Link>
          <Link href="/signup" className="w-full">
            <Button variant="outline" className="w-full bg-transparent" size="lg">
              Sign Up
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
