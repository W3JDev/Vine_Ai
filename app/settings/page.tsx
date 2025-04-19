"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, KeyIcon, MessageSquareText, User, VolumeIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSettings } from "@/hooks/use-settings"

export default function SettingsPage() {
  const { toast } = useToast()
  const { settings, updateSettings } = useSettings()
  const [isLoading, setIsLoading] = useState(false)

  // Initialize form state from settings
  const [formState, setFormState] = useState({
    apiKey: "",
    systemPrompt: "",
    voiceEnabled: true,
    voiceSpeed: "1",
    voiceType: "default",
    name: "",
    email: "",
  })

  // Load settings when component mounts
  useEffect(() => {
    if (settings) {
      setFormState({
        apiKey: settings.apiKey || "",
        systemPrompt:
          settings.systemPrompt ||
          "You are a helpful assistant. You provide clear, concise, and accurate information to the user's questions.",
        voiceEnabled: settings.voiceEnabled !== undefined ? settings.voiceEnabled : true,
        voiceSpeed: settings.voiceSpeed || "1",
        voiceType: settings.voiceType || "default",
        name: settings.name || "",
        email: settings.email || "",
      })
    }
  }, [settings])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Save settings
      await updateSettings(formState)

      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving your settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="mb-6 flex items-center">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="api-key" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api-key" className="flex items-center gap-2">
            <KeyIcon className="h-4 w-4" />
            <span className="hidden sm:inline">API Key</span>
          </TabsTrigger>
          <TabsTrigger value="system-prompt" className="flex items-center gap-2">
            <MessageSquareText className="h-4 w-4" />
            <span className="hidden sm:inline">System Prompt</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <VolumeIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Voice</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-key">
          <Card>
            <CardHeader>
              <CardTitle>API Key</CardTitle>
              <CardDescription>Manage your AI service provider API key</CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveSettings}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={formState.apiKey}
                    onChange={(e) => setFormState({ ...formState, apiKey: e.target.value })}
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
                    <div className="ml-3">
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        You can find your API key in your AI service provider dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="system-prompt">
          <Card>
            <CardHeader>
              <CardTitle>System Prompt</CardTitle>
              <CardDescription>Customize how the AI responds to your messages</CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveSettings}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    value={formState.systemPrompt}
                    onChange={(e) => setFormState({ ...formState, systemPrompt: e.target.value })}
                    className="min-h-[120px]"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    The system prompt helps guide the AI's behavior and responses.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="voice">
          <Card>
            <CardHeader>
              <CardTitle>Voice Settings</CardTitle>
              <CardDescription>Configure voice input and output settings</CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveSettings}>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="voice-enabled" className="flex flex-col space-y-1">
                    <span>Enable Voice</span>
                    <span className="font-normal text-sm text-gray-500 dark:text-gray-400">
                      Allow voice input and output
                    </span>
                  </Label>
                  <Switch
                    id="voice-enabled"
                    checked={formState.voiceEnabled}
                    onCheckedChange={(checked) => setFormState({ ...formState, voiceEnabled: checked })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voice-type">Voice Type</Label>
                  <Select
                    value={formState.voiceType}
                    onValueChange={(value) => setFormState({ ...formState, voiceType: value })}
                    disabled={!formState.voiceEnabled}
                  >
                    <SelectTrigger id="voice-type">
                      <SelectValue placeholder="Select a voice type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voice-speed">Voice Speed</Label>
                  <Select
                    value={formState.voiceSpeed}
                    onValueChange={(value) => setFormState({ ...formState, voiceSpeed: value })}
                    disabled={!formState.voiceEnabled}
                  >
                    <SelectTrigger id="voice-speed">
                      <SelectValue placeholder="Select a voice speed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">Slow</SelectItem>
                      <SelectItem value="0.75">Slower</SelectItem>
                      <SelectItem value="1">Normal</SelectItem>
                      <SelectItem value="1.25">Faster</SelectItem>
                      <SelectItem value="1.5">Fast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveSettings}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  />
                </div>
                <div className="pt-4 border-t">
                  <Button variant="destructive" type="button">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
