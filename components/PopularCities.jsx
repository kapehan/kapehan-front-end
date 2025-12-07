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
    <section className="bg-white py-20 px-4 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-whyte-super text-[#5F4429] mb-4"
        >
          Popular Cities
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto font-whyte"
        >
          Explore coffee shops by city and discover the unique coffee culture in each area of Metro Manila
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group overflow-hidden rounded-xl shadow-lg"
            >
              <div className="aspect-w-16 aspect-h-9 h-48 relative">
                <Image
                  src={`/placeholder.svg?height=300&width=400&text=${city.name.replace(" ", "+")}`}
                  alt={`${city.name} coffee shops`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-2xl font-whyte-bold text-white mb-1">{city.name}</h3>
                  <div className="flex items-center text-white/90">
                    <FaMapMarkerAlt className="mr-2" />
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
