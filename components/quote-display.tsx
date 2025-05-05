"use client"

import { motion } from "framer-motion"

interface QuoteDisplayProps {
  quote: {
    text: string
    author: string
  }
  className?: string
}

export default function QuoteDisplay({ quote, className = "" }: QuoteDisplayProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center space-y-6 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <blockquote className={`${className} italic font-medium leading-relaxed text-base-black dark:text-base-cream`}>
        "{quote.text}"
      </blockquote>
      <cite className="text-lg md:text-xl font-medium text-base-black dark:text-base-cream opacity-80 not-italic mt-4">
        — {quote.author || "Unknown"}
      </cite>
    </motion.div>
  )
}
