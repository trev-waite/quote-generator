"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, Sparkles } from "lucide-react"
import QuoteDisplay from "@/components/quote-display"
import AIAnalysis from "@/components/ai-analysis"
import { getRandomQuote, generateInterpretation, generateAIImage } from "@/app/actions"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  const [quote, setQuote] = useState({ text: "", author: "" })
  const [aiAnalysis, setAiAnalysis] = useState<{ interpretation: string; image: string | null; } | null>(null)
  const [isLoadingQuote, setIsLoadingQuote] = useState(true)
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchNewQuote()
  }, [])

  const fetchNewQuote = async () => {
    setIsLoadingQuote(true)
    setAiAnalysis(null)
    setError("")

    try {
      const newQuote = await getRandomQuote()
      setQuote(newQuote)
    } catch (error) {
      console.error("Failed to fetch quote:", error)
      setError("Failed to fetch a quote. Please try again.")
    } finally {
      setIsLoadingQuote(false)
    }
  }

  const handleGenerateAnalysis = async () => {
    if (isGeneratingAnalysis) return

    setIsGeneratingAnalysis(true)
    setIsGeneratingImage(true)
    setError("")

    try {
      // First, generate the interpretation
      const interpretation = await generateInterpretation(quote.text, quote.author)
      setAiAnalysis({ interpretation, image: null })

      // Then, generate the image
      const image = await generateAIImage(interpretation)
      setAiAnalysis(prev => ({ ...prev!, image }))
    } catch (error) {
      console.error("Failed to generate analysis:", error)
      setError("Failed to generate analysis. Please try again.")
    } finally {
      setIsGeneratingAnalysis(false)
      setIsGeneratingImage(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-3xl w-full space-y-8">
        <div className="w-full py-8">
          {isLoadingQuote ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <QuoteDisplay quote={quote} className="text-3xl md:text-4xl" />
          )}
        </div>

        {error && <div className="text-sm text-center text-red-500">{error}</div>}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={fetchNewQuote} disabled={isLoadingQuote} className="gap-2 theme-button">
            <RefreshCw className={`h-4 w-4 ${isLoadingQuote ? "animate-spin" : ""}`} />
            New Quote
          </Button>

          <Button
            onClick={handleGenerateAnalysis}
            disabled={isLoadingQuote || isGeneratingAnalysis || !quote.text}
            className="gap-2 gradient-button"
          >
            <Sparkles className="h-4 w-4" />
            {isGeneratingAnalysis ? "Generating..." : "Generate AI Analysis"}
          </Button>
        </div>

        {aiAnalysis && <AIAnalysis analysis={aiAnalysis} />}
      </div>
    </main>
  )
}
