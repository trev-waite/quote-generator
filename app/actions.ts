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

// Generate interpretation for a quote
export async function generateInterpretation(quoteText: string, author: string) {
  try {
    const interpretationResult = await generateText({
      model: google("gemini-2.0-flash-exp"),
      prompt: `Create a short, around 75 word, interpretation of the meaning of this quote. Do not inclde the actual quote in your response. In you response don't mention anything here as well, just give your interpretation: "${quoteText}" by ${author}.`,
    })

    return interpretationResult.text || ""
  } catch (error) {
    console.error("Error generating interpretation:", error)
    throw new Error("Failed to generate interpretation")
  }
}

// Generate AI image based on interpretation
export async function generateAIImage(interpretation: string) {
  try {
    const imageResult = await generateText({
      model: google("gemini-2.0-flash-exp"),
      providerOptions: {
        google: { responseModalities: ["TEXT", "IMAGE"] },
      },
      prompt: `Create an artistic image that shows a scene representing this interpretation of a quote: ${interpretation}`,
    })

    let image = ""
    if (imageResult.files && imageResult.files.length > 0) {
      const imageFile = imageResult.files.find((file: any) => file.mimeType && file.mimeType.startsWith("image/"))
      if (imageFile) {
        image = imageFile.base64 || ""
      }
    }
    // Fallback to placeholder if no image
    if (!image) {
      image = `/placeholder.svg?height=300&width=600&text=${encodeURIComponent(interpretation.substring(0, 30) + "...")}`
    }
    return image
  } catch (error) {
    console.error("Error generating AI image:", error)
    throw new Error("Failed to generate AI image")
  }
}

// Generate AI analysis and image (all in one) for a quote. Not currently used.
export async function generateAIAnalysis(quoteText: string, author: string) {
  try {
    const interpretation = await generateInterpretation(quoteText, author)
    const image = await generateAIImage(interpretation)
    return {
      interpretation,
      image,
    }
  } catch (error) {
    console.error("Error generating AI analysis:", error)
    throw new Error("Failed to generate AI analysis")
  }
}
