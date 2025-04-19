"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageSquareText, Sparkles } from "lucide-react"
import { useSettings } from "@/hooks/use-settings"

export default function SystemPromptSetupPage() {
  const router = useRouter()
  const { updateSettings } = useSettings()
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistant. You provide clear, concise, and accurate information to the user's questions.",
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Save the system prompt using the settings hook
      await updateSettings({ systemPrompt })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError("An error occurred while saving your system prompt. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const presetPrompts = [
    {
      title: "Helpful Assistant",
      prompt:
        "You are a helpful assistant. You provide clear, concise, and accurate information to the user's questions.",
    },
    {
      title: "Creative Writer",
      prompt:
        "You are a creative writing assistant. Help users draft stories, poems, and other creative content with imaginative and engaging language.",
    },
    {
      title: "Technical Expert",
      prompt:
        "You are a technical expert. Provide detailed, accurate technical information and code examples when asked.",
    },
    {
      title: "Data Analyst",
      prompt:
        "You are a data analysis assistant. Help users interpret data, create visualizations, and draw insights from information.",
    },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
              <MessageSquareText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">System Prompt</CardTitle>
          <CardDescription className="text-center">Customize how the AI responds to your messages</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <Textarea
                id="system-prompt"
                placeholder="Enter a system prompt to guide the AI's behavior..."
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The system prompt helps guide the AI's behavior and responses.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                Preset Prompts
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {presetPrompts.map((preset, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    className="justify-start h-auto py-2 px-3"
                    onClick={() => setSystemPrompt(preset.prompt)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{preset.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{preset.prompt}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving..." : "Continue"}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => router.push("/dashboard")}>
              Skip for now
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
