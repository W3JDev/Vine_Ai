import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"
import { SettingsProvider } from "@/hooks/use-settings"
import { ChatHistoryProvider } from "@/hooks/use-chat-history"
import { NextAuthProvider } from "@/components/providers/session-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>AI Chat UI</title>
        <meta name="description" content="AI-powered chat interface with voice interaction and structured output" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <SettingsProvider>
              <ChatHistoryProvider>
                <NextAuthProvider>{children}</NextAuthProvider>
              </ChatHistoryProvider>
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
