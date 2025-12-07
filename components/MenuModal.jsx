"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaStar, FaTimes } from "react-icons/fa"
import { getMenuByCoffeeShopId } from "../services/coffeeShopService"

export default function MenuModal({ shop, slug, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState("coffee")
  const [menuData, setMenuData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let mounted = true
    setIsLoading(true)
    setError("")
    setMenuData(null)
    getMenuByCoffeeShopId(slug)
      .then((resp) => {
        const data = resp?.data?.menu ?? resp?.menu ?? resp?.data ?? null
        if (!data || Object.values(data).every((arr) => !arr || arr.length === 0)) {
          if (mounted) {
            setMenuData(null)
            setError("Sorry, this coffee shop menu is unavailable. Please try again later.")
          }
        } else {
          if (mounted) {
            setMenuData(data)
            setError("")
          }
        }
      })
      .catch(() => {
        if (mounted) {
          setMenuData(null)
          setError("Sorry, this coffee shop menu is unavailable. Please try again later.")
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [slug])

  const categoryLabels = {
    coffee: "Coffee",
    nonCoffee: "Non-Coffee",
    pastry: "Pastries",
    riceMeals: "Rice Meals",
  }

  const MenuItem = ({ item }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-stone-50 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-stone-800 text-sm">{item.name}</h4>
            {/* No best seller info in API, so skip */}
          </div>
        </div>
      </div>
      {item.has_variants && Array.isArray(item.variants) && item.variants.length > 0 ? (
        <div className="space-y-1">
          {item.variants.map((sizeOption, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs">
              <span className="text-stone-600">{sizeOption.size}</span>
              <span className="font-semibold text-amber-700">₱{sizeOption.price}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <span className="text-stone-600 text-sm">Price</span>
          <span className="font-semibold text-amber-700 text-sm">₱{item.price}</span>
        </div>
      )}
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 bg-black/50 flex sm:items-center items-end justify-center p-0 sm:p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full sm:max-w-2xl h-[85vh] sm:h-auto max-h-[92vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-50 to-stone-50 px-5 sm:px-6 py-4 sm:py-6 border-b border-stone-200 flex items-start sm:items-center justify-between z-10">
          <div className="text-left">
            <h2 className="text-lg sm:text-2xl font-bold text-stone-900 truncate" title={shop.name}>
              {shop.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 line-clamp-2">{shop.address}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <FaTimes className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="sticky top-[72px] sm:top-[74px] bg-white/90 backdrop-blur-sm border-b border-stone-200 px-5 sm:px-6 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                selectedCategory === key
                  ? "bg-amber-700 text-white shadow-sm"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
              disabled={isLoading || !menuData || !menuData[key] || menuData[key].length === 0}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Menu Items Grid or Loading/Error */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-stone-500 text-sm">Loading menu...</div>
          ) : error ? (
            <div className="flex items-center justify-center h-40 text-stone-500 text-sm text-center">{error}</div>
          ) : menuData && menuData[selectedCategory] && menuData[selectedCategory].length > 0 ? (
            <div
              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4"
              role="list"
            >
              {menuData[selectedCategory].map((item, idx) => (
                <MenuItem key={item.id || idx} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40 text-stone-500 text-sm text-center">
              Sorry, this coffee shop menu is unavailable. Please try again later.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 px-5 sm:px-6 py-4 bg-stone-50">
          <button
            onClick={onClose}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 rounded-lg transition-colors text-sm sm:text-base"
          >
            Close Menu
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
