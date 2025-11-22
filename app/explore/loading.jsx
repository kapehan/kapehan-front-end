import SkeletonCard from "@/components/SkeletonCard";

export default function ExploreLoading() {
  return (
    <div className="min-h-screen">
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
  );
}
