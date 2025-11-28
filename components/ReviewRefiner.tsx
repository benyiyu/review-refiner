"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToneSelector, type Tone } from "@/components/tone-selector"
import { ReviewOutput, type ReviewOutputProps } from "@/components/review-output"
import { Sparkles, Loader2 } from "lucide-react"

export function ReviewRefiner() {
  const [notes, setNotes] = useState("")
  const [tone, setTone] = useState<Tone>("professional")
  const [reviewContent, setReviewContent] = useState<string>("")
  const [photoSuggestions, setPhotoSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRefine = async () => {
    if (!notes.trim()) return

    setIsLoading(true)
    setError(null)
    setReviewContent("")
    setPhotoSuggestions([])

    try {
      const res = await fetch("/api/refine-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: notes, selectedTone: tone }),
      })

      let data: any
      try {
        data = await res.json()
      } catch (jsonErr) {
        const textFallback = await res.text()
        setReviewContent(textFallback)
        setPhotoSuggestions([])
        return
      }

      if (!res.ok) {
        if (typeof data?.raw === "string") {
          setReviewContent(data.raw)
          setPhotoSuggestions([])
          return
        }
        throw new Error(data?.error || `Request failed with status ${res.status}`)
      }

      const refined = typeof data.reviewContent === "string" ? data.reviewContent : ""
      const photos = Array.isArray(data.photoSuggestions) ? data.photoSuggestions : []

      setReviewContent(refined)
      setPhotoSuggestions(photos)
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

      {(reviewContent || photoSuggestions.length > 0) && (
        <ReviewOutput
          {...({ reviewContent, photoSuggestions } as ReviewOutputProps)}
        />
      )}
    </div>
  )
}
