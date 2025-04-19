"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, KeyIcon } from "lucide-react"
import { useSettings } from "@/hooks/use-settings"

export default function ApiKeySetupPage() {
  const router = useRouter()
  const { updateSettings } = useSettings()
  const [apiKey, setApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Save the API key using the settings hook
      await updateSettings({ apiKey })

      // Redirect to system prompt setup
      router.push("/setup/system-prompt")
    } catch (err) {
      setError("An error occurred while saving your API key. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <KeyIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">API Key Setup</CardTitle>
          <CardDescription className="text-center">
            Enter your AI service provider API key to get started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="sk-••••••••••••••••••••••••••••••"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your API key is stored securely and never shared with anyone.
              </p>
            </div>
            <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Don&apos;t have an API key? Get one from your AI service provider.
                  </p>
                  <p className="mt-3 text-sm md:mt-0 md:ml-6">
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                    >
                      Get API key
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Continue"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
