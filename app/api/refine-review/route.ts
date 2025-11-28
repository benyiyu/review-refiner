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
    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" })

    const systemPrompt = `You refine messy notes into a clear restaurant review.
Return STRICT JSON only, no explanations.
JSON schema:
{
  "summary": string,
  "pros": string[],
  "cons": string[],
  "reviewContent": string,
  "photoSuggestions": string[]
}
Rules:
- Keep tone aligned with the provided tone option.
- Be concise but vivid; avoid exaggeration.
- Use first-person voice.
- Photo suggestions: 3-5 specific shots.
`

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
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      pros: Array.isArray(parsed.pros) ? parsed.pros : [],
      cons: Array.isArray(parsed.cons) ? parsed.cons : [],
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