"use client"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

const cities = [
  {
    id: 1,
    name: "Makati",
    image: "/placeholder.svg?height=300&width=300&text=Makati",
    count: 24,
  },
  {
    id: 2,
    name: "BGC",
    image: "/placeholder.svg?height=300&width=300&text=BGC",
    count: 18,
  },
  {
    id: 3,
    name: "Quezon City",
    image: "/placeholder.svg?height=300&width=300&text=Quezon+City",
    count: 32,
  },
  {
    id: 4,
    name: "Manila",
    image: "/placeholder.svg?height=300&width=300&text=Manila",
    count: 15,
  },
  {
    id: 5,
    name: "Pasig",
    image: "/placeholder.svg?height=300&width=300&text=Pasig",
    count: 12,
  },
  {
    id: 6,
    name: "Alabang",
    image: "/placeholder.svg?height=300&width=300&text=Alabang",
    count: 9,
  },
]

export default function CityCarousel() {
  const [width, setWidth] = useState(0)
  const carousel = useRef()

  useEffect(() => {
    setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth)
  }, [])

  return (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-[#5F4429] mb-6 text-center">Popular Cities</h2>

      <motion.div ref={carousel} className="overflow-hidden cursor-grab">
        <motion.div drag="x" dragConstraints={{ right: 0, left: -width }} className="flex gap-4">
          {cities.map((city) => (
            <motion.div
              key={city.id}
              className="min-w-[250px] h-[300px] relative rounded-xl overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/explore?city=${city.name}`}>
                <div className="relative w-full h-full">
                  <Image src={city.image || "/placeholder.svg"} alt={city.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
                    <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
                    <p>{city.count} Coffee Shops</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <p className="text-center text-[#4B4B4D] mt-4 italic">Drag to explore more cities</p>
    </div>
  )
}
