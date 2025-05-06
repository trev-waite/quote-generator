import { QUOTES } from '@/lib/quotes'
import { NextResponse } from 'next/server'

export async function GET() {
  const randomIndex = Math.floor(Math.random() * QUOTES.length)
  const quote = QUOTES[randomIndex]
  return NextResponse.json(quote)
}
