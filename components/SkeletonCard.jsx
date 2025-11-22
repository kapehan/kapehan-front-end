export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm h-[420px] flex flex-col animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-stone-200 rounded-t-xl"></div>

      {/* Content skeleton */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3 flex-1">
          {/* Title */}
          <div className="h-6 bg-stone-200 rounded w-3/4"></div>

          {/* Address */}
          <div className="h-4 bg-stone-200 rounded w-full"></div>

          {/* Rating and price */}
          <div className="flex justify-between">
            <div className="h-4 bg-stone-200 rounded w-1/3"></div>
            <div className="h-4 bg-stone-200 rounded w-1/4"></div>
          </div>

          {/* Categories */}
          <div className="flex gap-2">
            <div className="h-6 bg-stone-200 rounded-full w-16"></div>
            <div className="h-6 bg-stone-200 rounded-full w-20"></div>
          </div>

          {/* Amenities */}
          <div className="flex gap-2">
            <div className="h-6 bg-stone-200 rounded-full w-12"></div>
            <div className="h-6 bg-stone-200 rounded-full w-14"></div>
            <div className="h-6 bg-stone-200 rounded-full w-10"></div>
          </div>
        </div>

        {/* Button */}
        <div className="h-12 bg-stone-200 rounded-xl w-full mt-4"></div>
      </div>
    </div>
  )
}
