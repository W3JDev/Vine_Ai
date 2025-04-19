"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { LayoutGrid, List, FileText, HelpCircle, Save } from "lucide-react"

interface OutputFormatEditorProps {
  formats: OutputFormat[]
  onSave: (formats: OutputFormat[]) => Promise<void>
}

interface OutputFormat {
  id: string
  name: string
  description: string
  enabled: boolean
  format: string
  example: string
}

export function OutputFormatEditor({ formats: initialFormats, onSave }: OutputFormatEditorProps) {
  const [formats, setFormats] = useState<OutputFormat[]>(initialFormats)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(formats[0]?.id || "")

  const handleFormatChange = (id: string, field: keyof OutputFormat, value: any) => {
    setFormats(formats.map((format) => (format.id === id ? { ...format, [field]: value } : format)))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onSave(formats)
    } finally {
      setIsLoading(false)
    }
  }

  // Predefined output format templates
  const formatTemplates = [
    {
      id: "product",
      name: "Product Card",
      description: "Display product information in a card format",
      format: `{
  "type": "product",
  "name": "Product Name",
  "description": "Product description text",
  "price": 99.99,
  "category": "Category",
  "image": "image_url",
  "details": {
    "key1": "value1",
    "key2": "value2"
  },
  "actions": ["Action 1", "Action 2"]
}`,
      example: {
        type: "product",
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 199.99,
        category: "Electronics",
        image: "/placeholder.svg?height=200&width=300",
        details: {
          "Battery Life": "30 hours",
          Connectivity: "Bluetooth 5.0",
        },
        actions: ["Add to Cart", "Save for Later"],
      },
    },
    {
      id: "list",
      name: "List View",
      description: "Display information as a list of items",
      format: `{
  "type": "list",
  "title": "List Title",
  "description": "Optional description",
  "items": [
    {
      "title": "Item 1",
      "description": "Description for item 1",
      "icon": "optional_icon_name"
    },
    {
      "title": "Item 2",
      "description": "Description for item 2",
      "icon": "optional_icon_name"
    }
  ]
}`,
      example: {
        type: "list",
        title: "Top 3 Features",
        description: "Key features of our product",
        items: [
          {
            title: "Easy to Use",
            description: "Intuitive interface for all users",
            icon: "Zap",
          },
          {
            title: "Fast Performance",
            description: "Optimized for speed and efficiency",
            icon: "Rocket",
          },
          {
            title: "Secure",
            description: "Enterprise-grade security built in",
            icon: "Shield",
          },
        ],
      },
    },
    {
      id: "article",
      name: "Article",
      description: "Format content as an article or blog post",
      format: `{
  "type": "article",
  "title": "Article Title",
  "author": "Author Name",
  "date": "Publication Date",
  "content": [
    "Paragraph 1 text",
    "Paragraph 2 text"
  ]
}`,
      example: {
        type: "article",
        title: "Getting Started with AI",
        author: "Tech Expert",
        date: "April 15, 2025",
        content: [
          "Artificial intelligence is transforming how we interact with technology.",
          "In this guide, we'll explore the basics of AI and how you can use it in your projects.",
        ],
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Output Formats</h2>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Formats"}
        </Button>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Configure how structured data should be displayed in the chat interface.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {formats.map((format) => (
            <TabsTrigger key={format.id} value={format.id} className="flex items-center gap-2">
              {format.id === "product" && <LayoutGrid className="h-4 w-4" />}
              {format.id === "list" && <List className="h-4 w-4" />}
              {format.id === "article" && <FileText className="h-4 w-4" />}
              {!["product", "list", "article"].includes(format.id) && <HelpCircle className="h-4 w-4" />}
              {format.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {formats.map((format) => (
          <TabsContent key={format.id} value={format.id} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{format.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`enable-${format.id}`} className="text-sm">
                      Enable
                    </Label>
                    <Switch
                      id={`enable-${format.id}`}
                      checked={format.enabled}
                      onCheckedChange={(checked) => handleFormatChange(format.id, "enabled", checked)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`description-${format.id}`}>Description</Label>
                  <Textarea
                    id={`description-${format.id}`}
                    value={format.description}
                    onChange={(e) => handleFormatChange(format.id, "description", e.target.value)}
                    className="h-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`format-${format.id}`}>Format (JSON Schema)</Label>
                  <Textarea
                    id={`format-${format.id}`}
                    value={format.format}
                    onChange={(e) => handleFormatChange(format.id, "format", e.target.value)}
                    className="h-60 font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Example Output</Label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 overflow-auto max-h-60">
                    <pre className="text-xs">{JSON.stringify(JSON.parse(format.example), null, 2)}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
