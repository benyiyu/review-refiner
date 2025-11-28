import * as React from "react"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium transition-colors hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed"
  return <button className={[base, className].filter(Boolean).join(" ")} {...props} />
}

export default Button