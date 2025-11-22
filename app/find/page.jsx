"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import Navigation from "../../components/navigation"
import Footer from "../../components/Footer"
import CoffeeShopCard from "../../components/CoffeeShopCard"
import { LocationForm } from "../../components/FindPage/LocationForm"
import { LuCoffee, LuChevronLeft, LuChevronRight } from "react-icons/lu"

const RESULTS_PER_PAGE = 12

export default function FindPage() {
  const [yourLocation, setYourLocation] = useState("")
  const [friendLocation, setFriendLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [nearbyShops, setNearbyShops] = useState([])
  const [locationError, setLocationError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const getCurrentLocation = (setLocation) => {
    setLocationError("")

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
      },
      (error) => {
        setLocationError("Unable to retrieve your location. Please enter your location manually.")
      },
    )
  }

  const handleSearch = () => {
    if (!yourLocation.trim() || !friendLocation.trim()) {
      setLocationError("Please enter both locations to find coffee shops between you and your friend.")
      return
    }

    setIsLoading(true)
    setLocationError("")
    setCurrentPage(1)

    setTimeout(() => {
      setNearbyShops([
        {
          _id: "1",
          name: "Midpoint Café",
          address: "123 EDSA, Makati City",
          rating: 4.5,
          reviewCount: 128,
          distance: 2.3,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Specialty Coffee", "Meeting Spot"],
          amenities: { wifi: true, parking: true, outdoorSeating: false },
          price: 3,
          openNow: true,
          city: "Makati City",
        },
        {
          _id: "2",
          name: "Halfway House Coffee",
          address: "456 Ortigas Ave, Pasig City",
          rating: 4.2,
          reviewCount: 89,
          distance: 3.1,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Local Coffee", "Cozy Atmosphere"],
          amenities: { wifi: true, parking: true, outdoorSeating: true },
          price: 2,
          openNow: true,
          city: "Pasig City",
        },
        {
          _id: "3",
          name: "Central Grounds",
          address: "789 C5 Road, Taguig City",
          rating: 4.4,
          reviewCount: 156,
          distance: 4.2,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Artisan Coffee", "Perfect for Meetings"],
          amenities: { wifi: true, parking: true, outdoorSeating: false },
          price: 3,
          openNow: true,
          city: "Taguig City",
        },
        {
          _id: "4",
          name: "Meeting Point Brew",
          address: "321 Shaw Blvd, Mandaluyong City",
          rating: 4.3,
          reviewCount: 92,
          distance: 2.8,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Third Wave Coffee", "Business Friendly"],
          amenities: { wifi: true, parking: false, outdoorSeating: true },
          price: 3,
          openNow: true,
          city: "Mandaluyong City",
        },
        {
          _id: "5",
          name: "Convergence Coffee",
          address: "654 Katipunan Ave, Quezon City",
          rating: 4.6,
          reviewCount: 203,
          distance: 5.1,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Specialty Roasters", "Study Spot"],
          amenities: { wifi: true, parking: true, outdoorSeating: false },
          price: 2,
          openNow: false,
          city: "Quezon City",
        },
        {
          _id: "6",
          name: "Junction Java",
          address: "987 Alabang-Zapote Rd, Las Piñas City",
          rating: 4.1,
          reviewCount: 67,
          distance: 6.2,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Local Favorite", "Casual Dining"],
          amenities: { wifi: true, parking: true, outdoorSeating: true },
          price: 2,
          openNow: true,
          city: "Las Piñas City",
        },
        {
          _id: "7",
          name: "Crossroads Café",
          address: "147 Marcos Highway, Marikina City",
          rating: 4.4,
          reviewCount: 134,
          distance: 4.7,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Artisan Coffee", "Pet Friendly"],
          amenities: { wifi: true, parking: false, outdoorSeating: true },
          price: 3,
          openNow: true,
          city: "Marikina City",
        },
        {
          _id: "8",
          name: "Rendezvous Roasters",
          address: "258 Commonwealth Ave, Quezon City",
          rating: 4.5,
          reviewCount: 178,
          distance: 3.9,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Specialty Coffee", "Work Friendly"],
          amenities: { wifi: true, parking: true, outdoorSeating: false },
          price: 3,
          openNow: true,
          city: "Quezon City",
        },
        {
          _id: "9",
          name: "Midway Coffee Co.",
          address: "369 Rizal Ave, Manila City",
          rating: 4.0,
          reviewCount: 85,
          distance: 5.5,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Traditional Coffee", "Historic Location"],
          amenities: { wifi: false, parking: false, outdoorSeating: true },
          price: 1,
          openNow: true,
          city: "Manila City",
        },
        {
          _id: "10",
          name: "Connect Café",
          address: "741 Katipunan Ave, Quezon City",
          rating: 4.3,
          reviewCount: 112,
          distance: 4.1,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Modern Coffee", "Meeting Space"],
          amenities: { wifi: true, parking: true, outdoorSeating: false },
          price: 2,
          openNow: true,
          city: "Quezon City",
        },
        {
          _id: "11",
          name: "Bridge Coffee House",
          address: "852 Pasig Blvd, Pasig City",
          rating: 4.2,
          reviewCount: 96,
          distance: 3.7,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Cozy Atmosphere", "Local Roasters"],
          amenities: { wifi: true, parking: false, outdoorSeating: true },
          price: 2,
          openNow: true,
          city: "Pasig City",
        },
        {
          _id: "12",
          name: "Neutral Grounds",
          address: "963 Ayala Ave, Makati City",
          rating: 4.4,
          reviewCount: 145,
          distance: 2.9,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Business Meetings", "Premium Coffee"],
          amenities: { wifi: true, parking: true, outdoorSeating: false },
          price: 3,
          openNow: true,
          city: "Makati City",
        },
      ])
      setIsLoading(false)
    }, 2000)
  }

  const swapLocations = () => {
    const temp = yourLocation
    setYourLocation(friendLocation)
    setFriendLocation(temp)
  }

  const totalPages = Math.ceil(nearbyShops.length / RESULTS_PER_PAGE)
  const startIndex = (currentPage - 1) * RESULTS_PER_PAGE
  const endIndex = startIndex + RESULTS_PER_PAGE
  const currentResults = nearbyShops.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <LocationForm
        yourLocation={yourLocation}
        friendLocation={friendLocation}
        onYourLocationChange={setYourLocation}
        onFriendLocationChange={setFriendLocation}
        onSwap={swapLocations}
        onSearch={handleSearch}
        isLoading={isLoading}
        locationError={locationError}
        onGetLocation={getCurrentLocation}
      />

      {nearbyShops.length > 0 && (
        <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-stone-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900 mb-4">Perfect Meeting Spots</h2>
              <p className="text-base md:text-lg text-stone-600">
                Found {nearbyShops.length} coffee shops that are convenient for both of you
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
              {currentResults.map((shop, index) => (
                <motion.div
                  key={shop._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CoffeeShopCard shop={shop} showDistance={true} />
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-1 md:space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed text-stone-700"
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
                        className={`px-3 md:px-4 py-2 rounded-lg border transition-colors text-sm md:text-base font-medium ${
                          currentPage === page
                            ? "bg-amber-600 text-white border-amber-600"
                            : "border-stone-300 text-stone-700 hover:bg-stone-100"
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
                  className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed text-stone-700"
                >
                  <LuChevronRight className="h-4 md:h-5 w-4 md:w-5" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {nearbyShops.length === 0 && !isLoading && (
        <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-stone-50">
          <div className="max-w-4xl mx-auto text-center">
            <LuCoffee className="mx-auto text-stone-400 mb-4 md:mb-6 h-12 md:h-16 w-12 md:w-16" />
            <h3 className="text-xl md:text-2xl font-semibold text-stone-900 mb-3 md:mb-4">
              Find Your Perfect Meeting Spot
            </h3>
            <p className="text-stone-600 mb-6 md:mb-8 text-sm md:text-base">
              Enter both locations to discover coffee shops that are convenient for everyone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <span className="text-amber-600 font-bold text-sm md:text-base">1</span>
                </div>
                <p className="text-xs md:text-sm text-stone-600">Enter your location</p>
              </div>
              <div className="text-center">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <span className="text-amber-600 font-bold text-sm md:text-base">2</span>
                </div>
                <p className="text-xs md:text-sm text-stone-600">Add your friend's location</p>
              </div>
              <div className="text-center">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <span className="text-amber-600 font-bold text-sm md:text-base">3</span>
                </div>
                <p className="text-xs md:text-sm text-stone-600">Find meeting spots</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
