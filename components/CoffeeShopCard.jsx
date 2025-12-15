import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaMapMarkerAlt,
  FaStar,
  FaClock,
  FaWifi,
  FaCar,
  FaLeaf,
  FaDog,
  FaPlug,
  FaCreditCard,
  FaTruck,
  FaSnowflake,
  FaCalendarCheck,
  FaWheelchair,
} from "react-icons/fa";

export default function CoffeeShopCard({ shop, showDistance = true }) {
  const getStatusColor = (isOpen) =>
    isOpen ? "text-green-600" : "text-red-600";

  const getStatusText = (isOpen) => (isOpen ? "Open" : "Closed");

  // Fixed slug creation: remove accents properly (é → e, not removed)
  const removeAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\u02B0-\u02FF]/g, "")
      .replace(/[\u1AB0-\u1AFF]/g, "")
      .replace(/[\u1DC0-\u1DFF]/g, "")
      .replace(/[\u20D0-\u20FF]/g, "")
      .replace(/[\uFE20-\uFE2F]/g, "");
  };

  const createSlug = (name) =>
    removeAccents(name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // Amenity icon mapping
  const amenityIcons = {
    "Credit Cards Accepted": { icon: FaCreditCard, label: "Credit Cards" },
    "Drive-Thru": { icon: FaTruck, label: "Drive-Thru" },
    Delivery: { icon: FaTruck, label: "Delivery" },
    "Power Outlets": { icon: FaPlug, label: "Power Outlets" },
    "Outdoor Seating": { icon: FaLeaf, label: "Outdoor Seating" },
    "Pet Friendly": { icon: FaDog, label: "Pet Friendly" },
    "Wi-Fi": { icon: FaWifi, label: "Wi-Fi" },
    Parking: { icon: FaCar, label: "Parking" },
    "Air Conditioning": { icon: FaSnowflake, label: "Air Conditioning" },
    Reservations: { icon: FaCalendarCheck, label: "Reservations" },
    "Wheelchair Accessible": { icon: FaWheelchair, label: "Accessible" },
  };

  // derive a single vibe label from various shapes
  const vibeLabel = (() => {
    if (typeof shop?.vibe === "string" && shop.vibe.trim()) return shop.vibe;
    if (typeof shop?.vibes === "string" && shop.vibes.trim()) return shop.vibes;
    if (Array.isArray(shop?.vibes) && shop.vibes.length > 0) return shop.vibes[0];
    return null;
  })();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-stone-100 flex flex-col h-full"
    >
      <Link href={`/explore/${createSlug(shop.name)}`} className="flex flex-col h-full">
        <div className="relative">
          {/* Image - responsive height */}
          <div className="h-40 sm:h-44 md:h-48 bg-gradient-to-br from-amber-100 to-stone-100 overflow-hidden">
            <img
              src={shop.imageUrl || "/placeholder.svg?height=200&width=300"}
              alt={shop.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Status Badge - responsive sizing, full text always shown */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <span
              className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-whyte-medium bg-white/90 backdrop-blur-sm ${getStatusColor(
                shop.isOpen
              )}`}
            >
              <FaClock className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
              {getStatusText(shop.isOpen)}
            </span>
          </div>

          {/* Distance Badge - responsive sizing */}
          {showDistance && shop.distance && (
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
              <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-whyte-medium bg-white/90 backdrop-blur-sm text-stone-700">
                <FaMapMarkerAlt className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {shop.distance} km
              </span>
            </div>
          )}
        </div>

        {/* Info Section - responsive padding */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-2 sm:space-y-3 flex-1">
            {/* Header - responsive text sizing */}
            <div>
              <h3 className="font-whyte-bold text-sm sm:text-base md:text-lg text-stone-800 mb-0.5 sm:mb-1 line-clamp-1">
                {shop.name}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm line-clamp-1 flex items-center gap-1">
                <FaMapMarkerAlt className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                {shop.address && shop.address.length > 30
                  ? shop.address.slice(0, 30) + "..."
                  : shop.address}
              </p>
            </div>

            {/* Rating - responsive sizing */}
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-whyte-bold text-stone-800 text-xs sm:text-sm">
                {parseFloat(shop.rating || 0).toFixed(1)}
              </span>
            </div>

            {/* Vibe - single badge */}
            {vibeLabel && (
              <div className="flex flex-wrap gap-1">
                <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-whyte-medium line-clamp-1">
                  {vibeLabel}
                </span>
              </div>
            )}

            {/* Amenities - responsive grid */}
            {shop.amenities && shop.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-2 text-stone-500">
                {shop.amenities.slice(0, 2).map((amenity, i) => {
                  const Icon = amenityIcons[amenity]?.icon || FaPlug;
                  const label = amenityIcons[amenity]?.label || amenity;
                  return (
                    <div
                      key={i}
                      className="flex items-center text-xs bg-stone-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full gap-1"
                    >
                      <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                      <span className="hidden sm:inline text-xs">{label}</span>
                    </div>
                  );
                })}
                {shop.amenities.length > 2 && (
                  <div className="flex items-center text-xs bg-stone-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    <span>+{shop.amenities.length - 2}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* View Details Button - responsive padding */}
          <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl transition-all duration-300 font-whyte-medium text-xs sm:text-sm mt-2 sm:mt-3 md:mt-4">
            View Details
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
