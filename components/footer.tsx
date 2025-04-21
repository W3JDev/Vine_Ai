"use client"

import Link from "next/link"
import { Wine, Instagram, Twitter, Facebook, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm mt-20">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <motion.div initial={{ rotate: -10 }} animate={{ rotate: 0 }} transition={{ duration: 0.5 }}>
                <Wine className="h-6 w-6 text-wine-500" />
              </motion.div>
              <span className="text-xl font-bold text-gradient">VinAI Match</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium AI-powered wine pairing for the discerning palate. Discover your perfect match with our
              sophisticated recommendation system.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-wine-500/10 hover:text-wine-500">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-wine-500/10 hover:text-wine-500">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-wine-500/10 hover:text-wine-500">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Navigation</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-wine-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-muted-foreground hover:text-wine-500 transition-colors">
                  Taste Quiz
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="text-muted-foreground hover:text-wine-500 transition-colors">
                  Recommendations
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-wine-500 transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-wine-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-wine-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-wine-500 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-wine-500 transition-colors">
                  Responsible Drinking
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Subscribe</h3>
            <p className="text-sm text-muted-foreground">
              Stay updated with the latest wine recommendations and features.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="rounded-full bg-background border-wine-200 dark:border-wine-800 focus:border-wine-500 focus:ring-wine-500/20"
              />
              <Button className="rounded-full bg-wine-500 hover:bg-wine-600">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} VinAI Match. All rights reserved.</p>
          <p className="mt-1">Please drink responsibly.</p>
        </div>
      </div>
    </footer>
  )
}
