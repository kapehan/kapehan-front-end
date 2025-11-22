import Navigation from "@/components/navigation"

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading stories...</p>
      </div>
    </div>
  )
}
