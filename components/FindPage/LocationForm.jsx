"use client"
import { LuMapPin, LuNavigation } from "react-icons/lu"
import { FaExchangeAlt } from "react-icons/fa"

export function LocationForm({
  yourLocation,
  friendLocation,
  onYourLocationChange,
  onFriendLocationChange,
  onSwap,
  onSearch,
  isLoading,
  locationError,
  onGetLocation,
}) {
  return (
    <div className="pt-20 bg-white relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-stone-900 leading-tight mb-4 md:mb-6">
            Meet in the
            <span className="text-amber-600 block">Middle</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-stone-600 leading-relaxed mb-8 md:mb-12">
            Find the perfect coffee shop between you and your friend's location
          </p>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 md:p-8">
              <div className="space-y-4 md:space-y-6">
                <div className="relative">
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Your Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your location..."
                      value={yourLocation}
                      onChange={(e) => onYourLocationChange(e.target.value)}
                      className="w-full p-3 md:p-4 pl-10 md:pl-12 pr-12 md:pr-16 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-base md:text-lg"
                    />
                    <LuMapPin className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 md:h-5 w-4 md:w-5" />
                    <button
                      type="button"
                      onClick={() => onGetLocation(onYourLocationChange)}
                      className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 p-2 text-stone-500 hover:text-amber-600 transition-colors"
                    >
                      <LuNavigation className="h-3 md:h-4 w-3 md:w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={onSwap}
                    className="p-2 md:p-3 bg-amber-100 text-amber-600 rounded-full hover:bg-amber-200 transition-colors"
                  >
                    <FaExchangeAlt className="h-3 md:h-4 w-3 md:w-4 rotate-90" />
                  </button>
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Friend's Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your friend's location..."
                      value={friendLocation}
                      onChange={(e) => onFriendLocationChange(e.target.value)}
                      className="w-full p-3 md:p-4 pl-10 md:pl-12 pr-12 md:pr-16 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-base md:text-lg"
                    />
                    <LuMapPin className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 md:h-5 w-4 md:w-5" />
                    <button
                      type="button"
                      onClick={() => onGetLocation(onFriendLocationChange)}
                      className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 p-2 text-stone-500 hover:text-amber-600 transition-colors"
                    >
                      <LuNavigation className="h-3 md:h-4 w-3 md:w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={onSearch}
                  disabled={isLoading || !yourLocation.trim() || !friendLocation.trim()}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 md:py-4 px-6 md:px-8 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 md:h-5 w-4 md:w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Finding Meeting Spots...
                    </div>
                  ) : (
                    "Find Coffee Shops"
                  )}
                </button>

                {locationError && (
                  <div className="p-3 md:p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                    {locationError}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
