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

  // Create URL-friendly slug from shop name
  const createSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-stone-100 flex flex-col h-full"
    >
      <Link href={`/explore/${createSlug(shop.name)}`} className="flex flex-col h-full">
        <div className="relative">
          {/* 🖼️ Image */}
          <div className="h-48 bg-gradient-to-br from-amber-100 to-stone-100 overflow-hidden">
            <img
              src={shop.imageUrl || "/placeholder.svg?height=200&width=300"}
              alt={shop.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* 🕒 Status Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-whyte-medium bg-white/90 backdrop-blur-sm ${getStatusColor(
                shop.isOpen
              )}`}
            >
              <FaClock className="mr-1 h-3 w-3" />
              {getStatusText(shop.isOpen)}
            </span>
          </div>

          {/* 📍 Distance (if available) */}
          {showDistance && shop.distance && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-whyte-medium bg-white/90 backdrop-blur-sm text-stone-700">
                <FaMapMarkerAlt className="mr-1 h-3 w-3" />
                {shop.distance} km
              </span>
            </div>
          )}
        </div>

        {/* 🧾 Info Section */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-3 flex-1">
            {/* 📌 Header */}
            <div>
              <h3 className="font-whyte-bold text-lg text-stone-800 mb-1 line-clamp-1">
                {shop.name}
              </h3>
              <p className="text-stone-600 text-sm line-clamp-1 flex items-center">
                <FaMapMarkerAlt className="mr-1 h-3 w-3 flex-shrink-0" />
                {shop.address && shop.address.length > 30
                  ? shop.address.slice(0, 30) + "..."
                  : shop.address}
              </p>
            </div>

            {/* ⭐ Rating */}
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1 h-4 w-4" />
              <span className="font-whyte-bold text-stone-800">
                {parseFloat(shop.rating || 0).toFixed(1)}
              </span>
            </div>

            {/* 🎶 Vibes */}
            {shop.vibes && shop.vibes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {shop.vibes.slice(0, 2).map((vibe, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full font-whyte-medium"
                  >
                    {vibe}
                  </span>
                ))}
                {shop.vibes.length > 2 && (
                  <span className="inline-block px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-full font-whyte-medium">
                    +{shop.vibes.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* ⚙️ Amenities */}
            {shop.amenities && shop.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 text-stone-500">
                {shop.amenities.slice(0, 3).map((amenity, i) => {
                  const Icon =
                    amenityIcons[amenity]?.icon || FaPlug;
                  const label =
                    amenityIcons[amenity]?.label || amenity;
                  return (
                    <div
                      key={i}
                      className="flex items-center text-xs bg-stone-100 px-2 py-1 rounded-full"
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      <span>{label}</span>
                    </div>
                  );
                })}
                {shop.amenities.length > 3 && (
                  <div className="flex items-center text-xs bg-stone-100 px-2 py-1 rounded-full">
                    <span>+{shop.amenities.length - 3} more</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 👁️ View Details */}
          <button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-3 rounded-xl transition-all duration-300 font-whyte-medium mt-4">
            View Details
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
