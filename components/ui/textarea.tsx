import * as React from "react"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className, ...props }: TextareaProps) {
  const base =
    "w-full rounded-md border border-gray-300 bg-white p-3 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/20 disabled:opacity-50"
  return <textarea className={[base, className].filter(Boolean).join(" ")} {...props} />
}

export default Textarea