import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white dark:bg-gray-950">
        <div className="container flex h-16 items-center px-4 sm:px-6">
          <h1 className="text-2xl font-bold">AI Chat</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Interact with AI in a Modern, Intuitive Interface
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our AI-powered chat interface allows you to easily interact with AI services through text and voice,
                  with a focus on ease of use, rich presentation, and customization.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button className="px-8">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/features">
                    <Button variant="outline" className="px-8">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 rounded-2xl overflow-hidden border shadow-lg">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="AI Chat Interface Preview"
                  className="aspect-video object-cover w-full"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Everything you need to interact with AI services in one place
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {[
                {
                  title: "Chat Interface",
                  description: "Intuitive chat window for text-based interaction with streaming responses",
                  icon: "MessageSquare",
                },
                {
                  title: "Voice Interaction",
                  description: "Voice input and output for a hands-free experience",
                  icon: "Mic",
                },
                {
                  title: "Structured Output",
                  description: "Display structured data in a user-friendly format",
                  icon: "LayoutGrid",
                },
                {
                  title: "API Key Management",
                  description: "Secure storage of user-provided API keys",
                  icon: "Key",
                },
                {
                  title: "Customization",
                  description: "Set custom system prompts and configure output structure",
                  icon: "Settings",
                },
                {
                  title: "History Management",
                  description: "Review and continue previous conversations",
                  icon: "History",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 rounded-xl border p-6 shadow-sm bg-white dark:bg-gray-950"
                >
                  <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2v20" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 bg-white dark:bg-gray-950">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 AI Chat. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
