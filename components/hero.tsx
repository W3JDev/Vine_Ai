"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Wine, ArrowRight } from "lucide-react"
import { FadeIn, SlideUp } from "@/components/ui/motion"

export default function Hero() {
  return (
    <section className="w-full pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="container px-4 md:px-6 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1 }}
            className="absolute top-20 right-[20%] w-72 h-72 bg-wine-500/20 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute bottom-10 left-[10%] w-96 h-96 bg-wine-700/20 rounded-full blur-3xl"
          />
        </div>

        <div className="flex flex-col items-center space-y-10 text-center relative">
          <FadeIn>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-wine-200 dark:border-wine-800 px-3 py-1 text-sm font-medium mb-4"
            >
              <span className="flex h-2 w-2 rounded-full bg-wine-500 mr-2 animate-pulse-subtle" />
              Premium AI-Powered Wine Experience
            </motion.div>
          </FadeIn>

          <SlideUp>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-gradient">VinAI Match</span>
              <br />
              <span className="text-foreground">Your Personal Sommelier</span>
            </h1>
          </SlideUp>

          <SlideUp delay={0.1}>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Discover your perfect wine match with our sophisticated AI-powered pairing service, tailored to your
              unique taste profile and preferences.
            </p>
          </SlideUp>

          <SlideUp delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/quiz">
                <Button className="premium-button group">
                  <span>Take Taste Profile Quiz</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="outline"
                  className="rounded-full border-wine-200 dark:border-wine-800 hover:bg-wine-100/10 dark:hover:bg-wine-900/20"
                >
                  View Your Profile
                </Button>
              </Link>
            </div>
          </SlideUp>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative w-full max-w-5xl mt-16"
          >
            <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-wine-200 dark:border-wine-800 shadow-2xl">
              <div className="bg-gradient-to-br from-wine-50 to-wine-100 dark:from-wine-950 dark:to-wine-900 w-full h-full flex items-center justify-center">
                <div className="glass-effect rounded-xl p-8 max-w-md text-center">
                  <Wine className="h-12 w-12 mx-auto mb-4 text-wine-500" />
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Wine Recommendations</h3>
                  <p className="text-muted-foreground">
                    Our sophisticated AI analyzes your taste preferences to find your perfect wine match
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
              className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-wine-100 dark:bg-wine-900 flex items-center justify-center shadow-lg"
            >
              <Wine className="h-10 w-10 text-wine-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
