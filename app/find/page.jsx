"use client"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import Navigation from "../../components/navigation"
import Footer from "../../components/Footer"
import CoffeeShopCard from "../../components/CoffeeShopCard"
import { LocationForm } from "../../components/FindPage/LocationForm"
import { LuCoffee, LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { getAllCoffeeShop } from "../../services/coffeeShopService"
import { autoComplete } from '../../services/commonService'

const RESULTS_PER_PAGE = 12

export default function FindPage() {
  const [yourLocation, setYourLocation] = useState("")
  const [friendLocation, setFriendLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [nearbyShops, setNearbyShops] = useState([])
  const [locationError, setLocationError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [yourSuggestions, setYourSuggestions] = useState([])
  const [friendSuggestions, setFriendSuggestions] = useState([])
  const [selectedFriendSuggestion, setSelectedFriendSuggestion] = useState(null) // { lat, lon, address, label?, value? }
  const acDebounceRef = useRef(null)
  const searchDebounceRef = useRef(null)

  // Autocomplete only for friend input; map to objects with address, lat, lon
  const debouncedAutoComplete = (input) => {
    if (acDebounceRef.current) clearTimeout(acDebounceRef.current)
    acDebounceRef.current = setTimeout(async () => {
      if (!input || input.length < 2) {
        setFriendSuggestions([])
        setSelectedFriendSuggestion(null)
        return
      }
      try {
        // Use "search" param for autocomplete
        const res = await autoComplete({ search: input })
        const raw = res?.data ?? res
        const list = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : []
        // Normalize to { address, lat, lon }
        const normalized = list
          .map(s => ({
            address: s.address ?? s.label ?? s.value ?? s.display_name,
            lat: Number(s.lat ?? s.latitude),
            lon: Number(s.lon ?? s.lng ?? s.longitude),
          }))
          .filter(s => s.address && Number.isFinite(s.lat) && Number.isFinite(s.lon))
        setFriendSuggestions(normalized)
      } catch {
        setFriendSuggestions([])
        setSelectedFriendSuggestion(null)
      }
    }, 300)
  }

  // Disable manual typing for your location
  const handleYourLocationChange = () => {
    // no-op to prevent manual typing
  }

  const handleFriendLocationChange = (val) => {
    setFriendLocation(val)
    setSelectedFriendSuggestion(null)
    debouncedAutoComplete(val)
  }

  // When clicking a suggestion, store lat/lon and show address in input
  const handleFriendSuggestionSelect = (suggestion) => {
    setSelectedFriendSuggestion(suggestion)
    setFriendLocation(suggestion.address)
    setFriendSuggestions([])
  }

  const handleYourSuggestionSelect = () => { /* no-op */ }

  // Geolocation: only source of yourLocation "lat,lon"
  const getCurrentLocation = (setLocation) => {
    setLocationError("")
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation(`${latitude.toFixed(6)},${longitude.toFixed(6)}`)
      },
      () => {
        setLocationError("Unable to retrieve your location. Please enter your friend's location and try again.")
      }
    )
  }

  // Debounced search: requires yourLocation + selected friend suggestion
  const handleSearch = () => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    // Increase debounce to 1000ms
    searchDebounceRef.current = setTimeout(async () => {
      if (!yourLocation.trim() || !selectedFriendSuggestion?.lat || !selectedFriendSuggestion?.lon) {
        setLocationError("Use 'Get Location' for your location and choose a friend's address from suggestions.")
        return
      }
      setIsLoading(true)
      setLocationError("")
      setCurrentPage(1)

      const match = yourLocation.match(/(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)/)
      const yourCoords = match ? { lat: Number(match[1]), lon: Number(match[3]) } : null
      const friendCoords = { lat: selectedFriendSuggestion.lat, lon: selectedFriendSuggestion.lon }
      if (!yourCoords) {
        setIsLoading(false)
        setLocationError("Could not parse your location. Please press 'Get Location' again.")
        return
      }

      const midLat = (yourCoords.lat + friendCoords.lat) / 2
      const midLon = (yourCoords.lon + friendCoords.lon) / 2

      try {
        const resp = await getAllCoffeeShop({ lat: midLat, lng: midLon, limit: RESULTS_PER_PAGE * 3 });
        const data = resp?.data ?? resp;
        const items =
          (Array.isArray(data) && data) ||
          (Array.isArray(data?.items) && data.items) ||
          (Array.isArray(data?.docs) && data.docs) ||
          (Array.isArray(resp?.items) && resp.items) ||
          [];

        const toRad = (deg) => (deg * Math.PI) / 180;
        const dist = (a, b) => {
          const R = 6371;
          const dLat = toRad(b.lat - a.lat);
          const dLon = toRad(b.lon - a.lon);
          const lat1 = toRad(a.lat);
          const lat2 = toRad(b.lat);
          const aVal = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
          return R * 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
        };
        const round2 = (n) => Math.round(n * 100) / 100;

        const normalized = items
          .map((shop, idx) => {
            const shopLat = shop.latitude ?? shop.lat ?? shop?.location?.lat;
            const shopLon = shop.longitude ?? shop.lng ?? shop?.location?.lng;
            const hasCoords = Number.isFinite(shopLat) && Number.isFinite(shopLon);

            const rawDistToYou = hasCoords ? dist({ lat: shopLat, lon: shopLon }, yourCoords) : undefined;
            const rawDistToFriend = hasCoords ? dist({ lat: shopLat, lon: shopLon }, friendCoords) : undefined;

            return {
              _id: shop._id ?? shop.id ?? `shop-${idx}`,
              id: shop.id ?? shop._id ?? `shop-${idx}`,
              name: shop.name ?? shop.title ?? shop.shop_name ?? "Coffee Shop",
              address: shop.address ?? shop.full_address ?? shop.location?.address ?? "Address unavailable",
              city: shop.city ?? shop.location?.city ?? "",
              // rating may be string -> number
              rating: Number(shop.rating ?? shop.averageRating ?? shop.rating_value ?? 0),
              reviewCount: shop.reviewCount ?? shop.reviews_count ?? shop.totalReviews ?? 0,
              // map imageUrl to image
              imageUrl: shop.imageUrl ?? "/placeholder.svg?height=200&width=300",
              // amenities/vibes fallbacks
              amenities: shop.amenities ?? [],
              vibes: shop.vibes ?? [],
              // open flag
              openNow: shop.isOpen ?? shop.openNow ?? false,
              // round provided distanceKm to 2 decimals
              distance: typeof shop.distanceKm === "number" ? round2(shop.distanceKm) : undefined,
              // keep coords if available
              latitude: hasCoords ? shopLat : undefined,
              longitude: hasCoords ? shopLon : undefined,
              // round computed fairness distances to 2 decimals
              _distanceToYou: rawDistToYou != null ? round2(rawDistToYou) : undefined,
              _distanceToFriend: rawDistToFriend != null ? round2(rawDistToFriend) : undefined,
              _maxDistance:
                hasCoords && rawDistToYou != null && rawDistToFriend != null
                  ? round2(Math.max(rawDistToYou, rawDistToFriend))
                  : Number.POSITIVE_INFINITY,
            };
          })
          .filter(Boolean);

        // Sort by fairness if available, otherwise by provided distanceKm
        normalized.sort((a, b) => {
          const aFair = a._maxDistance ?? Number.POSITIVE_INFINITY;
          const bFair = b._maxDistance ?? Number.POSITIVE_INFINITY;
          if (aFair !== bFair) return aFair - bFair;
          const aDist = a.distance ?? Number.POSITIVE_INFINITY;
          const bDist = b.distance ?? Number.POSITIVE_INFINITY;
          return aDist - bDist;
        });

        setNearbyShops(normalized);
      } catch {
        setNearbyShops([]);
        setLocationError("Failed to fetch coffee shops. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 1000)
  }

  const swapLocations = () => {
    // Swapping no longer meaningful since your location is geolocation-only; clear friend selection
    setYourLocation(friendLocation) // will be ignored unless format is lat,lon
    setFriendLocation("")
    setFriendSuggestions([])
    setSelectedFriendSuggestion(null)
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
        // Use setYourLocation so the button writes to the input value
        onYourLocationChange={setYourLocation}
        onFriendLocationChange={handleFriendLocationChange}
        onYourSuggestionSelect={handleYourSuggestionSelect}
        onFriendSuggestionSelect={handleFriendSuggestionSelect}
        yourSuggestions={[]} // no autocomplete for your location
        friendSuggestions={friendSuggestions} // render these and show suggestion.address
        onGetLocation={getCurrentLocation}
        disableYourLocationInput={true}
        disableYourLocationAutocomplete={true}
        isLoading={isLoading}
        locationError={locationError}
        onSearch={handleSearch}
      />

      {nearbyShops.length > 0 && (
        <section className="py-12 md:py-16 lg:py-20 px-4 md:px-6 bg-stone-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-whyte-bold text-stone-900 mb-4">Perfect Meeting Spots</h2>
              <p className="text-base md:text-lg text-stone-600">
                Found {nearbyShops.length} coffee shops that are convenient for both of you
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
              {currentResults.map((shop, index) => (
                <motion.div
                  key={shop._id || shop.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <CoffeeShopCard
                    shop={shop}
                    showDistance={true}
                    // Optionally show both distances
                    userDistance={shop._distanceToYou}
                    friendDistance={shop._distanceToFriend}
                  />
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
                        className={`px-3 md:px-4 py-2 rounded-lg border transition-colors text-sm md:text-base font-whyte-medium ${
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
            <h3 className="text-xl md:text-2xl font-whyte-bold text-stone-900 mb-3 md:mb-4">
              Find Your Perfect Meeting Spot
            </h3>
            <p className="text-stone-600 mb-6 md:mb-8 text-sm md:text-base">
              Enter both locations to discover coffee shops that are convenient for everyone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <span className="text-amber-600 font-whyte-bold text-sm md:text-base">1</span>
                </div>
                <p className="text-xs md:text-sm text-stone-600">Enter your location</p>
              </div>
              <div className="text-center">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <span className="text-amber-600 font-whyte-bold text-sm md:text-base">2</span>
                </div>
                <p className="text-xs md:text-sm text-stone-600">Add your friend's location</p>
              </div>
              <div className="text-center">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                  <span className="text-amber-600 font-whyte-bold text-sm md:text-base">3</span>
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
