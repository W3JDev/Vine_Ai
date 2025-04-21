"use client"

import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

type ParallaxProps = {
  children: ReactNode
  offset?: number
  className?: string
}

export function ParallaxItem({ children, offset = 50, className = "" }: ParallaxProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

type ParallaxContainerProps = {
  children: ReactNode
  className?: string
}

export function ParallaxContainer({ children, className = "" }: ParallaxContainerProps) {
  return <div className={`relative overflow-hidden ${className}`}>{children}</div>
}
