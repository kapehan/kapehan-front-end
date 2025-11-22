export default function ShopDetailSkeleton () {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
=      <div className="relative h-[50vh] md:h-[70vh] overflow-hidden bg-gray-300 animate-pulse"></div>

      <div className="container mx-auto px-4 -mt-8 md:-mt-16 relative z-10 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* About Section Skeleton */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 md:mb-10">
            <div className="p-4 md:p-8">
              <div className="h-8 md:h-10 bg-gray-200 w-1/2 md:w-1/3 mb-4 md:mb-6 rounded-md animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 w-full rounded-md animate-pulse"></div>
                <div className="h-4 bg-gray-200 w-full rounded-md animate-pulse"></div>
                <div className="h-4 bg-gray-200 w-3/4 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Info Section Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="h-6 md:h-8 bg-gray-200 w-1/2 mb-4 rounded-md animate-pulse"></div>
                <div className="space-y-3">
                  <div className="h-10 md:h-12 bg-gray-200 w-full rounded-lg animate-pulse"></div>
                  <div className="h-10 md:h-12 bg-gray-200 w-full rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 md:p-6">
                <div className="h-6 md:h-8 bg-gray-200 w-1/2 mb-4 rounded-md animate-pulse"></div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="h-10 md:h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-10 md:h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-10 md:h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden md:col-span-2 lg:col-span-1">
              <div className="p-4 md:p-6">
                <div className="h-6 md:h-8 bg-gray-200 w-1/2 mb-4 rounded-md animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Reviews Skeleton */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 md:mb-10">
            <div className="p-4 md:p-8">
              <div className="h-8 bg-gray-200 w-1/3 mb-6 rounded animate-pulse"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 w-1/4 mb-2 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 w-1/6 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 w-full rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 w-3/4 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}