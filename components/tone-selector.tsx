"use client"
import * as React from "react"

export type Tone =
  | "professional"
  | "casual"
  | "enthusiastic"
  | "critical"

interface ToneSelectorProps {
  value: Tone
  onChange: (tone: Tone) => void
}

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  const options: Tone[] = ["professional", "casual", "enthusiastic", "critical"]

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tone</label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className={[
              "rounded-md border px-3 py-2 text-sm capitalize",
              value === t
                ? "border-black bg-black text-white"
                : "border-gray-300 bg-white hover:bg-gray-50",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  )
}