import * as React from "react"

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const base = "rounded-lg border border-gray-200 bg-white shadow-sm"
  return <div className={[base, className].filter(Boolean).join(" ")} {...props} />
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const base = "p-4 border-b border-gray-200"
  return <div className={[base, className].filter(Boolean).join(" ")} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const base = "text-base font-semibold"
  return <h3 className={[base, className].filter(Boolean).join(" ")} {...props} />
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const base = "p-4"
  return <div className={[base, className].filter(Boolean).join(" ")} {...props} />
}