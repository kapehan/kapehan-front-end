"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaFilter, FaSearch, FaWifi, FaCar, FaLeaf, FaDog, FaWheelchair, FaTimes } from "react-icons/fa"
import { LuCoffee, LuChevronLeft, LuChevronRight } from "react-icons/lu"
import Navigation from "../../components/navigation"
import CoffeeShopCard from "../../components/CoffeeShopCard"
import Footer from "../../components/Footer"
import { allShops } from "../../data/dummy-data"
import metroManilaCities from "../../data/metro-manila-cities.json"
import { AnimatePresence } from "framer-motion"

const ITEMS_PER_PAGE = 12

export default function ExplorePage() {
  const [shops, setShops] = useState(allShops)
  const [filteredShops, setFilteredShops] = useState(allShops)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [minRating, setMinRating] = useState(0)
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [selectedVibes, setSelectedVibes] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const amenityOptions = [
    { key: "wifi", label: "WiFi", icon: FaWifi },
    { key: "parking", label: "Parking", icon: FaCar },
    { key: "outdoorSeating", label: "Outdoor Seating", icon: FaLeaf },
    { key: "petFriendly", label: "Pet Friendly", icon: FaDog },
    { key: "wheelchairAccessible", label: "Wheelchair Accessible", icon: FaWheelchair },
  ]

  const vibesOptions = [
    "Artsy",
    "Cozy",
    "Modern",
    "Rustic",
    "Industrial",
    "Minimalist",
    "Vintage",
    "Bohemian",
    "Elegant",
    "Casual",
    "Romantic",
    "Family-friendly",
    "Professional",
    "Hipster",
    "Traditional",
    "Trendy",
    "Quiet",
    "Lively",
    "Intimate",
    "Spacious",
  ]

  // Filter shops based on criteria
  useEffect(() => {
    let filtered = shops

    if (searchTerm) {
      filtered = filtered.filter(
        (shop) =>
          shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.categories?.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCity) {
      filtered = filtered.filter((shop) => shop.city === selectedCity)
    }

    if (minRating > 0) {
      filtered = filtered.filter((shop) => shop.rating >= minRating)
    }

    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((shop) =>
        selectedAmenities.every((amenity) => shop.amenities && shop.amenities[amenity]),
      )
    }

    if (selectedVibes.length > 0) {
      filtered = filtered.filter((shop) => selectedVibes.some((vibe) => shop.vibes && shop.vibes.includes(vibe)))
    }

    setFilteredShops(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, selectedCity, minRating, selectedAmenities, selectedVibes, shops])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCity("")
    setMinRating(0)
    setSelectedAmenities([])
    setSelectedVibes([])
  }

  const handleAmenityToggle = (amenityKey) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityKey) ? prev.filter((a) => a !== amenityKey) : [...prev, amenityKey],
    )
  }

  const handleVibesToggle = (vibe) => {
    setSelectedVibes((prev) => (prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]))
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredShops.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentShops = filteredShops.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const hasActiveFilters = selectedCity || minRating > 0 || selectedAmenities.length > 0 || selectedVibes.length > 0

  return (
    <div className="min-h-screen bg-stone-50">
      <Navigation />

      {/* Enhanced Search and Filter Bar - Mobile First */}
      <div className="pt-12 bg-white border-b border-stone-200 sticky top-12 z-30">
        <div className="container mx-auto px-4 py-3 md:py-4">
          {/* Main Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search coffee shops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-colors text-sm font-mona-medium ${
                  showFilters || hasActiveFilters
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <FaFilter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="bg-amber-600 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                    {[selectedCity, minRating > 0, ...selectedAmenities, ...selectedVibes].filter(Boolean).length}
                  </span>
                )}
              </button>

              {/* Clear Filters - Mobile */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="sm:hidden flex items-center space-x-1 px-3 py-2.5 text-stone-600 hover:text-stone-800 transition-colors text-sm"
                >
                  <FaTimes className="h-3 w-3" />
                  <span>Clear</span>
                </button>
              )}

              {/* Results Count */}
              <div className="text-stone-600 font-mona-medium text-sm whitespace-nowrap">
                <span className="hidden sm:inline">
                  {filteredShops.length} coffee shop{filteredShops.length !== 1 ? "s" : ""} found
                </span>
                <span className="sm:hidden">{filteredShops.length} found</span>
              </div>
            </div>
          </div>

          {/* Enhanced Expandable Filters - Mobile First */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200 overflow-hidden"
              >
                {/* Filter Header - Mobile */}
                <div className="flex items-center justify-between mb-4 sm:hidden">
                  <h3 className="font-semibold text-stone-800">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="p-1 text-stone-500 hover:text-stone-700">
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Basic Filters Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* City Filter */}
                    <div>
                      <label className="block text-sm font-mona-medium text-stone-700 mb-2">City</label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
                      >
                        <option value="">All Cities</option>
                        {metroManilaCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <label className="block text-sm font-mona-medium text-stone-700 mb-2">Minimum Rating</label>
                      <select
                        value={minRating}
                        onChange={(e) => setMinRating(Number.parseFloat(e.target.value))}
                        className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white"
                      >
                        <option value={0}>Any Rating</option>
                        <option value={4.5}>4.5+ Stars</option>
                        <option value={4.0}>4.0+ Stars</option>
                        <option value={3.5}>3.5+ Stars</option>
                        <option value={3.0}>3.0+ Stars</option>
                      </select>
                    </div>

                    {/* Amenities Filter */}
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-sm font-mona-medium text-stone-700 mb-2">Amenities</label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {amenityOptions.map((amenity) => (
                          <label
                            key={amenity.key}
                            className="flex items-center cursor-pointer hover:bg-white rounded p-1"
                          >
                            <input
                              type="checkbox"
                              checked={selectedAmenities.includes(amenity.key)}
                              onChange={() => handleAmenityToggle(amenity.key)}
                              className="mr-2 h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded"
                            />
                            <amenity.icon className="mr-2 h-3 w-3 text-stone-500 flex-shrink-0" />
                            <span className="text-sm text-stone-700">{amenity.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Vibes Filter - Full Width */}
                  <div>
                    <label className="block text-sm font-mona-medium text-stone-700 mb-3">Vibes & Atmosphere</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-40 overflow-y-auto">
                      {vibesOptions.map((vibe) => (
                        <label key={vibe} className="flex items-center cursor-pointer hover:bg-white rounded p-1.5">
                          <input
                            type="checkbox"
                            checked={selectedVibes.includes(vibe)}
                            onChange={() => handleVibesToggle(vibe)}
                            className="mr-2 h-4 w-4 text-amber-600 focus:ring-amber-500 border-stone-300 rounded flex-shrink-0"
                          />
                          <span className="text-xs sm:text-sm text-stone-700 leading-tight">{vibe}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-stone-200 space-y-2 sm:space-y-0">
                    <button
                      onClick={clearFilters}
                      className="text-stone-600 hover:text-stone-800 transition-colors text-sm font-mona-medium"
                    >
                      Clear All Filters
                    </button>
                    <div className="text-xs text-stone-500">
                      {selectedAmenities.length > 0 &&
                        `${selectedAmenities.length} amenity filter${selectedAmenities.length > 1 ? "s" : ""}`}
                      {selectedAmenities.length > 0 && selectedVibes.length > 0 && " • "}
                      {selectedVibes.length > 0 &&
                        `${selectedVibes.length} vibe filter${selectedVibes.length > 1 ? "s" : ""}`}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Coffee Shops Grid - Mobile First */}
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm h-[420px] animate-pulse">
                <div className="h-48 bg-stone-200 rounded-t-xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-stone-200 rounded w-3/4"></div>
                  <div className="h-4 bg-stone-200 rounded w-full"></div>
                  <div className="h-4 bg-stone-200 rounded w-2/3"></div>
                  <div className="h-10 bg-stone-200 rounded w-full mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : currentShops.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {currentShops.map((shop, index) => (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <CoffeeShopCard shop={shop} showDistance={false} />
                </motion.div>
              ))}
            </div>

            {/* Pagination - Mobile First */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-1 md:space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LuChevronLeft className="h-4 md:h-5 w-4 md:w-5" />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 md:px-4 py-2 rounded-lg border transition-colors text-sm md:text-base ${
                          currentPage === page
                            ? "bg-amber-600 text-white border-amber-600"
                            : "border-stone-300 hover:bg-stone-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="px-1 md:px-2 text-stone-400 text-sm md:text-base">
                        ...
                      </span>
                    )
                  }
                  return null
                })}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LuChevronRight className="h-4 md:h-5 w-4 md:w-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 md:py-16">
            <LuCoffee className="mx-auto text-stone-400 mb-4 h-12 md:h-16 w-12 md:w-16" />
            <h3 className="text-xl md:text-2xl font-semibold text-stone-800 mb-2">No coffee shops found</h3>
            <p className="text-stone-600 mb-4 md:mb-6 text-sm md:text-base">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-4 md:px-6 py-2 md:py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm md:text-base"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
