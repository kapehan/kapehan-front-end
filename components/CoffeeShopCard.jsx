"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaWifi,
  FaCar,
  FaLeaf,
  FaDog,
  FaWheelchair,
} from "react-icons/fa"

export default function CoffeeShopCard({ shop, showDistance = true }) {
  const getPriceDisplay = (price) => {
    return "₱".repeat(price) + "₱".repeat(4 - price).replace(/₱/g, "○")
  }

  const getStatusColor = (isOpen) => {
    return isOpen ? "text-green-600" : "text-red-600"
  }

  const getStatusText = (isOpen) => {
    return isOpen ? "Open" : "Closed"
  }

  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const amenityIcons = {
    wifi: { icon: FaWifi, label: "WiFi" },
    parking: { icon: FaCar, label: "Parking" },
    outdoorSeating: { icon: FaLeaf, label: "Outdoor" },
    petFriendly: { icon: FaDog, label: "Pet Friendly" },
    wheelchairAccessible: { icon: FaWheelchair, label: "Accessible" },
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="min-h-[420px] bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-stone-100 flex flex-col"
    >
      <Link href={`/explore/${createSlug(shop.name)}`} className="flex flex-col h-full">
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-amber-100 to-stone-100 overflow-hidden">
            <img
              src={shop.image || "/placeholder.svg?height=200&width=300"}
              alt={shop.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mona-medium bg-white/90 backdrop-blur-sm ${getStatusColor(
                shop.openNow,
              )}`}
            >
              <FaClock className="mr-1 h-3 w-3" />
              {getStatusText(shop.openNow)}
            </span>
          </div>

          {showDistance && shop.distance && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mona-medium bg-white/90 backdrop-blur-sm text-stone-700">
                <FaMapMarkerAlt className="mr-1 h-3 w-3" />
                {shop.distance}km
              </span>
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="space-y-3">
            <div>
              <h3 className="font-mona-bold text-lg text-stone-800 mb-1 line-clamp-1">{shop.name}</h3>
              <p className="text-stone-600 text-sm line-clamp-1 flex items-center">
                <FaMapMarkerAlt className="mr-1 h-3 w-3 flex-shrink-0 font-mona-semibold" />
                {shop.address || `${shop.city}, Metro Manila`}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1 h-4 w-4" />
                <span className="font-mona-medium text-stone-800">{shop.rating}</span>
                <span className="text-stone-500 text-sm ml-1">({shop.reviewCount || 0})</span>
              </div>
              <div className="text-stone-600 text-sm">{getPriceDisplay(shop.price || 2)}</div>
            </div>

            {shop.categories && shop.categories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {shop.categories.slice(0, 2).map((category, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-mona-medium"
                  >
                    {category}
                  </span>
                ))}
                {shop.categories.length > 2 && (
                  <span className="inline-block px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-full font-mona-medium">
                    +{shop.categories.length - 2}
                  </span>
                )}
              </div>
            )}

            {shop.amenities && (
              <div className="flex flex-wrap gap-2 text-stone-500">
                {Object.entries(shop.amenities)
                  .filter(([key, value]) => value && amenityIcons[key])
                  .slice(0, 3)
                  .map(([key]) => {
                    const { icon: Icon, label } = amenityIcons[key]
                    return (
                      <div key={key} className="flex items-center text-xs bg-stone-100 px-2 py-1 rounded-full">
                        <Icon className="h-3 w-3 mr-1" />
                        <span>{label}</span>
                      </div>
                    )
                  })}
                {Object.entries(shop.amenities).filter(([key, value]) => value && amenityIcons[key]).length > 3 && (
                  <div className="flex items-center text-xs bg-stone-100 px-2 py-1 rounded-full">
                    <span>
                      +
                      {
                        Object.entries(shop.amenities).filter(
                          ([key, value]) => value && amenityIcons[key]
                        ).length - 3
                      }{" "}
                      more
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-xl transition-all duration-300 font-mona-medium mt-6">
            View Details
          </button>
        </div>
      </Link>
    </motion.div>
  )
}
