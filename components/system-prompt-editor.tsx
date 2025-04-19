"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Save, RotateCcw } from "lucide-react"

interface SystemPromptEditorProps {
  value: string
  onChange: (value: string) => void
  onSave: () => Promise<void>
}

// Predefined prompt templates
const PROMPT_TEMPLATES = [
  {
    category: "General",
    templates: [
      {
        name: "Helpful Assistant",
        description: "A general-purpose helpful assistant",
        prompt:
          "You are a helpful assistant. You provide clear, concise, and accurate information to the user's questions.",
      },
      {
        name: "Friendly Guide",
        description: "A warm, approachable assistant",
        prompt:
          "You are a friendly guide. Your tone is warm and approachable, and you explain concepts in simple terms while being encouraging and supportive.",
      },
    ],
  },
  {
    category: "Professional",
    templates: [
      {
        name: "Technical Expert",
        description: "For technical and programming questions",
        prompt:
          "You are a technical expert. Provide detailed, accurate technical information and code examples when asked. Prioritize best practices and efficient solutions.",
      },
      {
        name: "Business Consultant",
        description: "For business and strategy questions",
        prompt:
          "You are a business consultant with expertise in strategy, marketing, and operations. Provide professional advice with practical insights and actionable recommendations.",
      },
    ],
  },
  {
    category: "Creative",
    templates: [
      {
        name: "Creative Writer",
        description: "For creative writing assistance",
        prompt:
          "You are a creative writing assistant. Help users draft stories, poems, and other creative content with imaginative and engaging language. Offer suggestions that enhance narrative, character development, and emotional impact.",
      },
      {
        name: "Brainstorming Partner",
        description: "For idea generation",
        prompt:
          "You are a brainstorming partner. Help users generate and refine ideas by asking thought-provoking questions, suggesting connections between concepts, and exploring possibilities from multiple angles.",
      },
    ],
  },
]

export function SystemPromptEditor({ value, onChange, onSave }: SystemPromptEditorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [originalValue] = useState(value)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onSave()
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    onChange(originalValue)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="system-prompt">System Prompt</Label>
        <Textarea
          id="system-prompt"
          placeholder="Enter a system prompt to guide the AI's behavior..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[150px] font-mono text-sm"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The system prompt helps guide the AI's behavior and responses.
        </p>
      </div>

      <div className="flex space-x-2">
        <Button onClick={handleSave} disabled={isLoading} className="flex items-center gap-1">
          <Save className="h-4 w-4" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Button variant="outline" onClick={handleReset} className="flex items-center gap-1">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <Tabs defaultValue="General" className="mt-6">
        <div className="flex items-center mb-4">
          <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
          <h3 className="font-medium">Prompt Templates</h3>
        </div>
        <TabsList className="mb-4">
          {PROMPT_TEMPLATES.map((category) => (
            <TabsTrigger key={category.category} value={category.category}>
              {category.category}
            </TabsTrigger>
          ))}
        </TabsList>
        {PROMPT_TEMPLATES.map((category) => (
          <TabsContent key={category.category} value={category.category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.templates.map((template) => (
                <Card key={template.name} className="cursor-pointer hover:border-purple-300 transition-colors">
                  <CardContent className="p-4" onClick={() => onChange(template.prompt)}>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{template.description}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{template.prompt}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
