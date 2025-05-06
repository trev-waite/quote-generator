"use server"

import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { Quote } from "@/lib/quotes"

// Fetch a random quote from an API with fallback
export async function getRandomQuote(): Promise<Quote> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window === "undefined"
      ? "http://localhost:3000"
      : "");
  const response = await fetch(`${baseUrl}/api/quote`, { cache: "no-store" })
  if (!response.ok) throw new Error("Failed to fetch local quote")
  const data = await response.json()
  return {
    text: data.text,
    author: data.author,
  }
}

// Generate AI analysis and image for a quote
export async function generateAIAnalysis(quoteText: string, author: string) {
  try {
    // Generate interpretation and image using Gemini
    const result = await generateText({
      model: google("gemini-2.0-flash-exp"),
      providerOptions: {
        google: { responseModalities: ["TEXT", "IMAGE"] },
      },
      prompt: `Create a short, around 75 word, interpretation of the meaning of this quote: "${quoteText}" by ${author}. Then using that interpretation, create an artistic image that shows a scene representing your interpretation.`,
    })

    let interpretation = ""
    let image = ""
    if (result.text) {
      interpretation = result.text
    }
    if (result.files && result.files.length > 0) {
      const imageFile = result.files.find((file: any) => file.mimeType && file.mimeType.startsWith("image/"))
      if (imageFile) {
        image = imageFile.base64 || ""
      }
    }
    // Fallback to placeholder if no image
    if (!image) {
      image = `/placeholder.svg?height=300&width=600&text=${encodeURIComponent(quoteText.substring(0, 30) + "...")}`
    }
    return {
      interpretation,
      image,
    }
  } catch (error) {
    console.error("Error generating AI analysis:", error)
    throw new Error("Failed to generate AI analysis")
  }
}
