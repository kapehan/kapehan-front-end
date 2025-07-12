"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { FaStar, FaMapMarkerAlt, FaClock, FaWifi, FaParking } from "react-icons/fa"

export default function CoffeeShopCard({ shop }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [visibleCategories, setVisibleCategories] = useState(2)

  // Update visible categories based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1536) {
        // 2xl
        setVisibleCategories(3)
      } else if (window.innerWidth >= 1280) {
        // xl
        setVisibleCategories(2)
      } else if (window.innerWidth >= 768) {
        // md
        setVisibleCategories(2)
      } else {
        setVisibleCategories(2)
      }
    }

    handleResize() // Set initial value
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Extract city from address
  const city = shop.address.split(", ").pop()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      {!isLoaded && <div className="bg-gray-200 animate-pulse rounded-lg h-[350px] w-full"></div>}
      <div
        className={`bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <div className="relative h-48">
          <Image
            src={shop.image || "/placeholder.svg?height=300&width=400"}
            alt={shop.name}
            fill
            className="object-cover"
            onLoad={() => setIsLoaded(true)}
            onError={() => setIsLoaded(true)}
          />
          {/* Rating badge */}
          <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 shadow-md">
            <span className="text-yellow-500 font-bold">★</span>
            <span className="text-sm font-medium text-[#4b4b4d] ml-1">{shop.rating}</span>
          </div>
          {/* Location badge */}
          <div className="absolute bottom-2 left-2 bg-white rounded-full px-2 py-1 shadow-md">
            <p className="text-sm font-medium text-gray-600">{city}</p>
          </div>
          {/* Open/Closed Status */}
          {shop.openNow !== undefined && (
            <div className="absolute top-2 left-2 bg-white rounded-full px-2 py-1 shadow-md">
              <div
                className={`flex items-center text-xs font-medium ${shop.openNow ? "text-green-600" : "text-red-600"}`}
              >
                <FaClock className="mr-1" size={10} />
                {shop.openNow ? "Open Now" : "Closed"}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-[#5F4429] mb-2">{shop.name}</h3>

          <div className="flex items-center mb-2">
            <FaMapMarkerAlt className="text-gray-500 mr-1 flex-shrink-0" size={14} />
            <p className="text-sm text-gray-600 line-clamp-1">{shop.address}</p>
          </div>

          <div className="flex items-center mb-3">
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" size={14} />
              <span className="text-sm font-medium">{shop.rating}</span>
            </div>
            <span className="text-sm text-gray-500 ml-1">({shop.reviewCount} reviews)</span>
          </div>

          {/* Categories - Responsive */}
          {shop.categories && shop.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 h-[28px]">
              {shop.categories.slice(0, visibleCategories).map((category, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full whitespace-nowrap"
                >
                  {category}
                </span>
              ))}
              {shop.categories.length > visibleCategories && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                  +{shop.categories.length - visibleCategories}
                </span>
              )}
            </div>
          )}

          {/* Amenity badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {shop.amenities && shop.amenities.wifi && (
              <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center">
                <FaWifi className="mr-1" size={10} />
                WiFi
              </span>
            )}
            {shop.amenities && shop.amenities.parking && (
              <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
                <FaParking className="mr-1" size={10} />
                Parking
              </span>
            )}
          </div>

          <Link
            href={`/coffee-shop/${shop.id}`}
            className="mt-auto block w-full bg-amber-600 hover:bg-amber-700 text-white text-center py-2 rounded-lg transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
