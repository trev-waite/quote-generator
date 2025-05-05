"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface Quote {
  text: string
  author: string
}

// Local fallback quotes in case the API fails
const fallbackQuotes: Quote[] = [
  {
    text: "The best way to predict the future is to create it.",
    author: "Abraham Lincoln",
  },
  {
    text: "Be the change that you wish to see in the world.",
    author: "Mahatma Gandhi",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
  },
  {
    text: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
  },
  {
    text: "Get busy living or get busy dying.",
    author: "Stephen King",
  },
  {
    text: "You only live once, but if you do it right, once is enough.",
    author: "Mae West",
  },
  {
    text: "Many of life's failures are people who did not realize how close they were to success when they gave up.",
    author: "Thomas A. Edison",
  },
]

// Get a random quote from the fallback array
function getRandomFallbackQuote(): Quote {
  const randomIndex = Math.floor(Math.random() * fallbackQuotes.length)
  return fallbackQuotes[randomIndex]
}

// Fetch a random quote from an API with fallback
export async function getRandomQuote(): Promise<Quote> {
  try {
    // Try to fetch from API with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

    const response = await fetch("https://api.quotable.io/random", {
      signal: controller.signal,
      cache: "no-store", // Prevent caching issues
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return {
      text: data.content,
      author: data.author,
    }
  } catch (error) {
    console.log("Error fetching quote from API, using fallback:", error)
    // Return a random quote from our fallback array
    return getRandomFallbackQuote()
  }
}

// Generate AI analysis and image for a quote
export async function generateAIAnalysis(quoteText: string, author: string) {
  try {
    // Generate interpretation using OpenAI
    const { text: interpretation } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Analyze this quote: "${quoteText}" by ${author}. 
      Provide a thoughtful interpretation in about 150 words. 
      Discuss the meaning, context, and relevance of this quote in today's world.`,
    })

    // For the image, we'll use a placeholder
    const imageUrl = `/placeholder.svg?height=300&width=600&text=${encodeURIComponent(quoteText.substring(0, 30) + "...")}`

    return {
      interpretation,
      image: imageUrl,
    }
  } catch (error) {
    console.error("Error generating AI analysis:", error)
    throw new Error("Failed to generate AI analysis")
  }
}
