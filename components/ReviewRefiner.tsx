"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToneSelector, type Tone } from "@/components/tone-selector"
import { ReviewOutput, type ReviewResult } from "@/components/review-output"
import { Sparkles, Loader2 } from "lucide-react"

export function ReviewRefiner() {
  const [notes, setNotes] = useState("")
  const [tone, setTone] = useState<Tone>("professional")
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRefine = async () => {
    if (!notes.trim()) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/refine-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: notes, selectedTone: tone }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Request failed with status ${res.status}`)
      }

      const data = await res.json()

      const reviewContent = typeof data.reviewContent === "string" ? data.reviewContent : ""
      const photoSuggestions = Array.isArray(data.photoSuggestions) ? data.photoSuggestions : []

      setResult({ reviewContent, photoSuggestions })
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your messy notes here... (e.g., 'food good, service slow, nice view, price ok, would come back')"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[150px] resize-none"
          />

          <ToneSelector value={tone} onChange={setTone} />

          <Button onClick={handleRefine} disabled={isLoading || !notes.trim()} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refining...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Refine Review
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-300">
          <CardContent className="pt-6">
            <p className="text-red-600 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && <ReviewOutput result={result} />}
    </div>
  )
}