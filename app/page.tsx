import { ReviewRefiner } from "@/components/ReviewRefiner"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl p-6">
        <h1 className="mb-6 text-2xl font-semibold">Review Refiner</h1>
        <ReviewRefiner />
      </div>
    </main>
  )
}
