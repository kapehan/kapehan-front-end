import SkeletonCard from "@/components/SkeletonCard"
import Navigation from "@/components/navigation"

export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navigation />

      {/* Filter Bar Skeleton */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="h-6 w-40 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-10 w-48 md:w-64 bg-gray-200 animate-pulse rounded-full"></div>
              <div className="h-10 w-32 bg-gray-200 animate-pulse rounded-full"></div>
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Skeleton */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array(8)
            .fill()
            .map((_, index) => (
              <SkeletonCard key={index} />
            ))}
        </div>
      </div>
    </div>
  )
}
