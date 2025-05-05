"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"

interface AIAnalysisProps {
  analysis: {
    interpretation: string
    image: string
  }
}

export default function AIAnalysis({ analysis }: AIAnalysisProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">AI Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {analysis.image && (
            <div className="flex justify-center">
              <div className="relative w-full max-w-md aspect-video rounded-md overflow-hidden">
                <Image
                  src={analysis.image || "/placeholder.svg"}
                  alt="AI generated image based on the quote"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          <div className="text-sm md:text-base leading-relaxed">{analysis.interpretation}</div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
