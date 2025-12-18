"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { FaMapMarkerAlt } from "react-icons/fa"
import { getCityShopCounts} from "../services/commonService"

const CITY_COUNTS_KEY = "city_shop_counts"
const CITY_COUNTS_TTL = 1000 * 60 * 30 // 30 minutes

const PopularCities = () => {
  const [cities, setCities] = useState([])

  // Helper: read cached city counts
  const readCityCounts = () => {
    try {
      const raw = localStorage.getItem(CITY_COUNTS_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (!parsed.ts || Date.now() - parsed.ts > CITY_COUNTS_TTL) {
        localStorage.removeItem(CITY_COUNTS_KEY)
        return null
      }
      return parsed.data
    } catch {
      return null
    }
  }

  // Fetch and cache city shop counts
  useEffect(() => {
    let cancelled = false
    const cached = readCityCounts()
    if (cached && Array.isArray(cached)) {
      setCities(cached)
    } else {
      (async () => {
        try {
          const resp = await getCityShopCounts()
          // Expect array of { city_name, city_value, count }
          const data =
            Array.isArray(resp?.data) ? resp.data :
            Array.isArray(resp) ? resp :
            []
          const normalized = data.map(c => ({
            name: c.city_name ?? c.name ?? c.city ?? c.city_value,
            count: c.count ?? c.shop_count ?? 0,
            image: c.image ?? c.city_image ?? undefined,
          })).filter(c => c.name)
          if (!cancelled) setCities(normalized)
          // Save to localStorage with timestamp
          localStorage.setItem(CITY_COUNTS_KEY, JSON.stringify({ ts: Date.now(), data: normalized }))
        } catch {
          if (!cancelled) setCities([])
        }
      })()
    }
    return () => { cancelled = true }
  }, [])

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-whyte-bold text-stone-900 mb-3 sm:mb-4"
        >
          Popular Cities
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs sm:text-sm md:text-base lg:text-lg text-stone-600 mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto font-whyte px-2"
        >
          Explore coffee shops by city and discover the unique coffee culture in each area of the Philippines.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative group overflow-hidden rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 h-32 sm:h-40 md:h-48 relative">
                <Image
                  src={city.image ? city.image : `/placeholder.svg?height=300&width=400&text=${city.name.replace(" ", "+")}`}
                  alt={`${city.name} coffee shops`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                {/* Content - responsive padding and text sizes */}
                <div className="absolute bottom-0 left-0 p-3 sm:p-4 md:p-6 w-full">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-whyte-bold text-white mb-1">
                    {city.name}
                  </h3>
                  <div className="flex items-center text-white/90 text-xs sm:text-sm md:text-base">
                    <FaMapMarkerAlt className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{city.count} Coffee Shops</span>
                  </div>
                </div>
              </div>

              <Link href={`/explore?city=${encodeURIComponent(city.name)}`} className="absolute inset-0">
                <span className="sr-only">Explore {city.name} coffee shops</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularCities
