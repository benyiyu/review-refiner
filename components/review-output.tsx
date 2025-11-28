import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckSquare } from "lucide-react"

export interface ReviewOutputProps {
  reviewContent: string
  photoSuggestions: string[]
}

export function ReviewOutput({ reviewContent, photoSuggestions }: ReviewOutputProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Refined Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
            {reviewContent}
          </p>
        </CardContent>
      </Card>

      {Array.isArray(photoSuggestions) && photoSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Photo Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {photoSuggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                  <CheckSquare className="mt-0.5 h-4 w-4 text-gray-600" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
