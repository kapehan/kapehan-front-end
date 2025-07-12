"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaArrowLeft,
  FaLeaf,
  FaWifi,
  FaCar,
  FaDog,
  FaWheelchair,
  FaCheckCircle,
  FaHeart,
  FaRegHeart,
  FaCoffee,
  FaCouch,
  FaLaptop,
  FaPalette,
  FaVolumeUp,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa"
import { LuMapPin, LuCoffee } from "react-icons/lu"
import Navigation from "../../../components/navigation"
import RatingModal from "../../../components/rating-modal"
import ReviewSection from "../../../components/ReviewSection"
import CoffeeShopCard from "../../../components/CoffeeShopCard"
import Footer from "../../../components/Footer"
import AccountModal from "../../../components/AccountModal"
import { allShops } from "../../../data/dummy-data"

// Skeleton loader for the shop details
const ShopDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navigation />
      <div className="relative h-[50vh] md:h-[70vh] overflow-hidden bg-gray-300 animate-pulse"></div>

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

export default function CoffeeShopDetailPage() {
  const params = useParams()
  const shopSlug = params.slug

  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [suggestedShops, setSuggestedShops] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)

  // Mock authentication state - replace with real auth
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Create slug from shop name for comparison
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  // Handle follow button click
  const handleFollowClick = () => {
    if (!isAuthenticated) {
      setShowAccountModal(true)
    } else {
      setIsFollowing(!isFollowing)
    }
  }

  // Handle write review click
  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      setShowAccountModal(true)
    } else {
      setShowReviewModal(true)
    }
  }

  // Fetch shop details
  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true)
      try {
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Find shop by matching slug
        const foundShop = allShops.find((shop) => createSlug(shop.name) === shopSlug)

        if (foundShop) {
          // Add additional properties that might be missing
          const enhancedShop = {
            ...foundShop,
            _id: foundShop.id,
            description:
              foundShop.description ||
              `${foundShop.name} is a cozy, artisanal coffee shop nestled in the heart of ${foundShop.city}. Our passion for exceptional coffee drives us to source the finest beans from sustainable farms worldwide. We roast in small batches to ensure peak flavor and freshness.`,
            openingHours: foundShop.openingHours || {
              monday: { open: "07:00", close: "21:00", closed: false },
              tuesday: { open: "07:00", close: "21:00", closed: false },
              wednesday: { open: "07:00", close: "21:00", closed: false },
              thursday: { open: "07:00", close: "21:00", closed: false },
              friday: { open: "07:00", close: "22:00", closed: false },
              saturday: { open: "08:00", close: "22:00", closed: false },
              sunday: { open: "08:00", close: "20:00", closed: false },
            },
            socialMedia: foundShop.socialMedia || {
              facebook: foundShop.name.toLowerCase().replace(/\s+/g, ""),
              instagram: foundShop.name.toLowerCase().replace(/\s+/g, ""),
            },
            amenities: foundShop.amenities || {
              wifi: true,
              parking: true,
              outdoorSeating: false,
              petFriendly: true,
              wheelchairAccessible: true,
            },
          }
          setShop(enhancedShop)

          // Get suggested shops (same city, different shop, high rating)
          const suggested = allShops
            .filter((s) => s.id !== foundShop.id && s.city === foundShop.city)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4)
          setSuggestedShops(suggested)
        } else {
          setShop(null)
        }
      } catch (error) {
        console.error("Error fetching shop data:", error)
        setShop(null)
      } finally {
        setLoading(false)
      }
    }

    if (shopSlug) {
      fetchShopData()
    }
  }, [shopSlug])

  if (loading) {
    return <ShopDetailSkeleton />
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center pt-24 md:pt-32">
          <h1 className="text-2xl md:text-3xl font-mona-bold text-[#5F4429] mb-4">Coffee Shop Not Found</h1>
          <p className="text-gray-600 mb-8">The coffee shop you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/explore"
            className="inline-flex items-center bg-[#5F4429] hover:bg-[#8B5E3B] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Explore
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  // Check if the shop is currently open
  const isCurrentlyOpen = () => {
    if (!shop.openingHours) return false

    const now = new Date()
    const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "lowercase" })
    const currentHours = now.getHours()
    const currentMinutes = now.getMinutes()
    const currentTime = `${currentHours.toString().padStart(2, "0")}:${currentMinutes.toString().padStart(2, "0")}`

    const todayHours = shop.openingHours[dayOfWeek]
    if (!todayHours || todayHours.closed) return false

    return currentTime >= todayHours.open && currentTime <= todayHours.close
  }

  // Use the provided openNow property or calculate it
  const openNow = shop.openNow !== undefined ? shop.openNow : isCurrentlyOpen()

  const amenityIcons = {
    wifi: { icon: FaWifi, label: "WiFi", color: "text-blue-600" },
    parking: { icon: FaCar, label: "Parking", color: "text-green-600" },
    outdoorSeating: { icon: FaLeaf, label: "Outdoor Seating", color: "text-emerald-600" },
    petFriendly: { icon: FaDog, label: "Pet Friendly", color: "text-amber-600" },
    wheelchairAccessible: { icon: FaWheelchair, label: "Wheelchair Accessible", color: "text-purple-600" },
  }

  // Curated section rating component
  const CuratedRating = ({ icon: Icon, label, rating, notes, color }) => (
    <div className="bg-stone-50 rounded-lg p-3 md:p-4 hover:bg-stone-100 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Icon className={`h-4 md:h-5 w-4 md:w-5 mr-2 ${color}`} />
          <span className="font-mona-medium text-stone-800 text-xs md:text-sm">{label}</span>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={`h-3 md:h-4 w-3 md:w-4 ${i < rating ? "text-yellow-400" : "text-stone-300"}`} />
          ))}
          <span className="ml-1 md:ml-2 text-xs md:text-sm font-mona-semibold text-stone-700">{rating}/5</span>
        </div>
      </div>
      <p className="text-stone-600 text-xs md:text-sm leading-relaxed">{notes}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Navigation />

      {/* Hero Section with Parallax Effect - Mobile First */}
      <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${shop.image || "/placeholder.svg?height=1200&width=1600"})`,
            transform: "scale(1.1)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-3 md:px-4 py-1 rounded-full mb-4 md:mb-6">
                {shop.categories &&
                  shop.categories.slice(0, 2).map((category, index) => (
                    <span key={category} className="text-white text-xs md:text-sm font-mona-medium">
                      {category}
                      {index < Math.min(shop.categories.length, 2) - 1 && <span className="mx-2 text-white/50">•</span>}
                    </span>
                  ))}
                {shop.categories && shop.categories.length > 2 && (
                  <span className="text-white text-xs md:text-sm font-mona-medium ml-2">+{shop.categories.length - 2}</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-mona-bold text-white drop-shadow-lg text-center sm:text-left">
                  {shop.name}
                </h1>
                {shop.verified && (
                  <FaCheckCircle className="text-blue-400 text-2xl md:text-3xl lg:text-4xl mt-2 sm:mt-0 sm:ml-4 drop-shadow-lg" />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-6 md:mb-8">
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full">
                  <FaStar className="text-yellow-400 mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  <span className="text-white font-mona-medium text-sm md:text-base">{shop.rating}</span>
                  <span className="text-white text-opacity-80 ml-1 text-xs md:text-sm">({shop.reviewCount || 0})</span>
                </div>

                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full">
                  <FaClock className="text-white mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  <span className="text-white text-sm md:text-base">{openNow ? "Open Now" : "Closed"}</span>
                </div>

                <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full">
                  <FaMapMarkerAlt className="text-white mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  <span className="text-white text-sm md:text-base">{shop.city}</span>
                </div>

                {/* Follow Button */}
                <button
                  onClick={handleFollowClick}
                  className="flex items-center bg-white/20 backdrop-blur-sm hover:bg-white/30 px-3 md:px-4 py-2 rounded-full transition-colors"
                >
                  {isFollowing ? (
                    <FaHeart className="text-red-400 mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  ) : (
                    <FaRegHeart className="text-white mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  )}
                  <span className="text-white font-mona-medium text-sm md:text-base">
                    {isFollowing ? "Following" : "Follow"}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-8 md:-mt-16 relative z-10 pb-8 md:pb-16">
        <div className="max-w-6xl mx-auto">
          {/* About Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 md:mb-10">
            <div className="p-4 md:p-8">
              <h2 className="text-2xl md:text-3xl font-mona-bold text-[#5F4429] mb-4 md:mb-6 flex items-center">
                <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <LuCoffee className="text-amber-600 text-lg md:text-xl" />
                </div>
                About {shop.name}
              </h2>

              <div className="prose prose-amber max-w-none text-gray-700">
                <p className="text-base md:text-lg leading-relaxed font-mona-medium">{shop.description}</p>
                <div className="flex space-x-3 mt-4 md:mt-6">
                  {shop.socialMedia?.facebook && (
                    <a
                      href={`https://facebook.com/${shop.socialMedia.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FaFacebook size={18} className="md:w-5 md:h-5" />
                    </a>
                  )}
                  {shop.socialMedia?.instagram && (
                    <a
                      href={`https://instagram.com/${shop.socialMedia.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-800 transition-colors"
                    >
                      <FaInstagram size={18} className="md:w-5 md:h-5" />
                    </a>
                  )}
                  {shop.socialMedia?.twitter && (
                    <a
                      href={`https://twitter.com/${shop.socialMedia.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600 transition-colors"
                    >
                      <FaTwitter size={18} className="md:w-5 md:h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info Section (Hours, Amenities, Location) - Mobile First */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
            {/* Hours - Enhanced Design */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-stone-100">
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-3 md:p-4 border-b border-amber-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-base md:text-lg font-mona-bold text-amber-800 flex items-center">
                    <FaClock className="text-amber-600 mr-2 h-4 w-4" />
                    Opening Hours
                  </h3>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-mona-medium ${
                      openNow ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mr-1 ${openNow ? "bg-green-500" : "bg-red-500"}`}></div>
                    {openNow ? "Open" : "Closed"}
                  </div>
                </div>
              </div>

              <div className="p-3 md:p-4">
                <div className="space-y-2">
                  {shop.openingHours &&
                    Object.entries(shop.openingHours).map(([day, hours]) => (
                      <div
                        key={day}
                        className="flex justify-between items-center py-2 px-2 md:px-3 rounded-lg hover:bg-stone-50 transition-colors"
                      >
                        <span className="font-mona-medium text-stone-700 capitalize text-xs md:text-sm">
                          {day.slice(0, 3)}
                        </span>
                        {hours.closed ? (
                          <span className="text-red-600 font-mona-medium text-xs md:text-sm">Closed</span>
                        ) : (
                          <span className="text-stone-600 text-xs md:text-sm font-mona-medium">
                            {hours.open} - {hours.close}
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            

            {/* Amenities - Enhanced Design */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-stone-100">
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-3 md:p-4 border-b border-emerald-200">
                <h3 className="text-base md:text-lg font-mona-bold text-emerald-800 flex items-center">
                  <FaLeaf className="text-emerald-600 mr-2 h-4 w-4" />
                  Amenities
                </h3>
              </div>

              <div className="p-3 md:p-4">
                <div className="grid grid-cols-1 gap-2 md:gap-3">
                  {shop.amenities &&
                    Object.entries(shop.amenities)
                      .filter(([key, value]) => value && amenityIcons[key])
                      .map(([key, value]) => {
                        const { icon: Icon, label, color } = amenityIcons[key]
                        return (
                          <div
                            key={key}
                            className="flex items-center p-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors"
                          >
                            <Icon className={`h-3 md:h-4 w-3 md:w-4 mr-2 md:mr-3 ${color}`} />
                            <span className="text-xs md:text-sm font-mona-medium text-stone-700">{label}</span>
                          </div>
                        )
                      })}
                </div>
              </div>
            </div>

            {/* Location - Enhanced Design */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-stone-100 md:col-span-2 lg:col-span-1">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 md:p-4 border-b border-blue-200">
                <h3 className="text-base md:text-lg font-mona-bold text-blue-800 flex items-center">
                  <LuMapPin className="text-blue-600 mr-2 h-4 w-4" />
                  Location
                </h3>
              </div>

              <div className="p-3 md:p-4">
                <div className="space-y-3">
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <p className="text-stone-700 text-xs md:text-sm font-mona-medium mb-1">Address</p>
                    <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-mona-medium">{shop.address}</p>
                    <p className="text-stone-500 text-xs mt-1 font-mona-regular">{shop.city}, Metro Manila</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Curated Section - Only show if shop has curated data - Moved here */}
          {shop.curated && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 md:mb-10 border-2 border-amber-200">
              <div className="bg-gradient-to-r from-amber-100 to-amber-200 p-4 md:p-6 border-b border-amber-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h2 className="text-xl md:text-2xl font-mona-bold text-amber-800 mb-2 flex items-center">
                      <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-amber-300 flex items-center justify-center mr-3">
                        <FaCheckCircle className="text-amber-700 text-lg md:text-xl" />
                      </div>
                      Kapehan Curated Review
                    </h2>
                    <p className="text-amber-700 text-xs md:text-sm font-mona-medium">
                      Personally reviewed and rated by our team for quality assurance
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="flex items-center justify-center sm:justify-end mb-1">
                      <FaStar className="text-yellow-500 mr-1 h-4 w-4" />
                      <span className="text-xl md:text-2xl font-mona-bold text-amber-800">{shop.curated.overallRating}</span>
                      <span className="text-amber-700 ml-1 text-sm md:text-base">/5</span>
                    </div>
                    <p className="text-amber-700 text-xs">Overall Rating</p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                  <CuratedRating
                    icon={FaCoffee}
                    label="Coffee Quality"
                    rating={shop.curated.coffeeQuality.rating}
                    notes={shop.curated.coffeeQuality.notes}
                    color="text-amber-600"
                  />
                  <CuratedRating
                    icon={FaCouch}
                    label="Comfortability"
                    rating={shop.curated.comfortability.rating}
                    notes={shop.curated.comfortability.notes}
                    color="text-blue-600"
                  />
                  <CuratedRating
                    icon={FaLaptop}
                    label="Remote Work Friendly"
                    rating={shop.curated.remoteWorkFriendly.rating}
                    notes={shop.curated.remoteWorkFriendly.notes}
                    color="text-green-600"
                  />
                  <CuratedRating
                    icon={FaPalette}
                    label="Aesthetic Vibe"
                    rating={shop.curated.aestheticVibe.rating}
                    notes={shop.curated.aestheticVibe.notes}
                    color="text-purple-600"
                  />
                </div>

                <div className="mb-4 md:mb-6">
                  <CuratedRating
                    icon={FaVolumeUp}
                    label="Noise Level"
                    rating={shop.curated.noiseLevel.rating}
                    notes={shop.curated.noiseLevel.notes}
                    color="text-red-600"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-stone-200 text-xs md:text-sm text-stone-600 space-y-2 sm:space-y-0">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 h-3 w-3" />
                    <span>Visited on: {shop.curated.visitedOn}</span>
                  </div>
                  <div className="flex items-center">
                    <FaUser className="mr-2 h-3 w-3" />
                    <span>Reviewed by: {shop.curated.reviewedBy}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Section - Now using the separate component */}
          <ReviewSection shopId={shop._id} onWriteReview={handleWriteReviewClick} />

          {/* You Might Also Like Section - More Fluid Design */}
          {suggestedShops.length > 0 && (
            <div className="mb-6 md:mb-10">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-mona-bold text-[#5F4429] mb-4 flex items-center justify-center">
                  <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <LuCoffee className="text-amber-600 text-lg md:text-xl" />
                  </div>
                  You Might Also Like
                </h2>
                <p className="text-stone-600 text-sm md:text-base">Discover more amazing coffee shops in {shop.city}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {suggestedShops.map((suggestedShop, index) => (
                  <motion.div
                    key={suggestedShop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <CoffeeShopCard shop={suggestedShop} showDistance={false} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <RatingModal
        show={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        shopId={shop._id}
        isAuthenticated={isAuthenticated}
      />

      {/* Account Modal for Follow Authentication */}
      <AccountModal show={showAccountModal} onClose={() => setShowAccountModal(false)} />

      <Footer />
    </div>
  )
}
