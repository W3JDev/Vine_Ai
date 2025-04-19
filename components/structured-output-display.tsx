import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot } from "lucide-react"

interface StructuredOutputDisplayProps {
  data: any
}

export function StructuredOutputDisplay({ data }: StructuredOutputDisplayProps) {
  // Helper function to determine the component to render based on data type
  const renderData = (data: any) => {
    if (!data) return null

    // Handle different data types
    if (Array.isArray(data)) {
      return renderList(data)
    } else if (typeof data === "object") {
      // Check for specific object types
      if (data.type === "restaurant" || data.type === "menu" || data.type === "product") {
        return renderProductCard(data)
      } else if (data.type === "article" || data.type === "blog") {
        return renderArticle(data)
      } else if (data.type === "qa" || data.type === "faq") {
        return renderQA(data)
      } else {
        return renderGenericObject(data)
      }
    } else {
      // Simple value
      return <p>{String(data)}</p>
    }
  }

  // Render a list of items
  const renderList = (items: any[]) => {
    return (
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border rounded-lg p-4">
            {renderData(item)}
          </div>
        ))}
      </div>
    )
  }

  // Render a product or menu item card
  const renderProductCard = (data: any) => {
    return (
      <Card className="overflow-hidden">
        {data.image && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={data.image || "/placeholder.svg"}
              alt={data.title || data.name || "Product image"}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{data.title || data.name}</CardTitle>
            {data.price && (
              <Badge variant="outline" className="text-lg font-semibold">
                ${typeof data.price === "number" ? data.price.toFixed(2) : data.price}
              </Badge>
            )}
          </div>
          {data.category && <Badge>{data.category}</Badge>}
        </CardHeader>
        <CardContent className="space-y-4">
          {data.description && <p className="text-gray-600 dark:text-gray-300">{data.description}</p>}

          {data.details && (
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(data.details).map(([key, value]) => (
                <div key={key}>
                  <span className="font-medium">{key}: </span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          )}

          {data.actions && (
            <div className="flex gap-2 pt-2">
              {data.actions.map((action: any, index: number) => (
                <Button key={index} variant={index === 0 ? "default" : "outline"}>
                  {action.label || action}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Render an article or blog post
  const renderArticle = (data: any) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{data.title}</CardTitle>
          {data.author && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>By {data.author}</span>
              {data.date && <span>• {data.date}</span>}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {data.content && (
            <div className="prose dark:prose-invert">
              {typeof data.content === "string" ? (
                <p>{data.content}</p>
              ) : Array.isArray(data.content) ? (
                data.content.map((paragraph: string, i: number) => <p key={i}>{paragraph}</p>)
              ) : (
                renderData(data.content)
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Render Q&A format
  const renderQA = (data: any) => {
    const questions = data.questions || data.items || []

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-gray-500">
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold">{data.title || "Frequently Asked Questions"}</h3>
        </div>

        <div className="space-y-3 pl-11">
          {questions.map((item: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              <h4 className="font-medium">{item.question}</h4>
              <p className="mt-1 text-gray-600 dark:text-gray-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render a generic object
  const renderGenericObject = (data: any) => {
    return (
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => {
          // Skip rendering the "type" field
          if (key === "type") return null

          return (
            <div key={key}>
              <h4 className="font-medium capitalize">{key}</h4>
              <div className="ml-4">{renderData(value)}</div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 text-sm">
      <Avatar className="h-8 w-8 bg-gray-500">
        <AvatarFallback>
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="max-w-[80%] md:max-w-[70%]">{renderData(data)}</div>
    </div>
  )
}
