import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface ReviewResult {
  reviewContent: string
  photoSuggestions: string[]
}

interface ReviewOutputProps {
  result: ReviewResult
}

export function ReviewOutput({ result }: ReviewOutputProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Refined Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
            {result.reviewContent}
          </p>
        </div>
        {Array.isArray(result.photoSuggestions) && result.photoSuggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Photo Suggestions</h4>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {result.photoSuggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}