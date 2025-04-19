"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Error caught by boundary:", error)
      setError(error.error)
      setHasError(true)
    }

    window.addEventListener("error", errorHandler)

    return () => {
      window.removeEventListener("error", errorHandler)
    }
  }, [])

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
          We encountered an error while processing your request. Please try again or contact support if the problem
          persists.
        </p>
        {error && (
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mb-4 w-full max-w-md overflow-auto text-left">
            <p className="font-mono text-sm">{error.message}</p>
          </div>
        )}
        <Button onClick={() => window.location.reload()} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Reload Page
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
