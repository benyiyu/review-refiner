import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

function extractJson(text: string): string {
  const fenced = text.match(/```json\s*([\s\S]*?)\s*```/i)
  if (fenced && fenced[1]) return fenced[1].trim()
  // Fallback: try to find the first JSON object
  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1)
  }
  return text.trim()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const userInput: string = body?.userInput || ""
    const selectedTone: string = body?.selectedTone || "professional"

    if (!userInput || typeof userInput !== "string") {
      return NextResponse.json({ error: "Missing or invalid userInput" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" })

    const systemPrompt = `
You are an expert social media editor for the Chinese market (Red/Dianping).
User Input: ${userInput}
Selected Tone: ${selectedTone}

Task: Rewrite the messy notes into a high-quality review in **Simplified Chinese (简体中文)**.

Requirements:
1. Language: **STRICTLY Simplified Chinese (简体中文)**. Do not use English unless it's a specific brand name.
2. Structure:
   - Start with an engaging summary.
   - Provide detailed pros and cons.
   - Mention specific dishes/items if applicable.
3. Tone: Adapt the writing style based on the "${selectedTone}" selection (e.g., use emojis for "Enthusiastic", be objective for "Professional").
4. Photo Suggestions: Provide 3-4 specific, visual ideas for photos.

**IMPORTANT: Return ONLY valid JSON in this format:**
{
  "reviewContent": "...(Chinese text)...",
  "photoSuggestions": ["...(Chinese text)...", "...(Chinese text)..."]
}
`;

    const prompt = `${systemPrompt}\n\nUser Notes: ${userInput}\nTone: ${selectedTone}\nReturn ONLY JSON.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    let parsed: any
    try {
      parsed = JSON.parse(extractJson(text))
    } catch (e) {
      return NextResponse.json(
        { error: "Model returned non-JSON output", raw: text },
        { status: 502 }
      )
    }

    const output = {
      reviewContent: typeof parsed.reviewContent === "string" ? parsed.reviewContent : "",
      photoSuggestions: Array.isArray(parsed.photoSuggestions) ? parsed.photoSuggestions : [],
    }

    return NextResponse.json(output)
  } catch (error: any) {
    console.error("refine-review error", error)
    return NextResponse.json(
      { error: error?.message || "Unexpected error" },
      { status: 500 }
    )

  }
}

