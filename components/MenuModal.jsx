"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { FaStar, FaTimes } from "react-icons/fa"

export default function MenuModal({ shop, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState("coffee")

  const menuData = {
    coffee: [
      {
        name: "Espresso",
        price: 60,
        bestselling: false,
        sizes: [
          { size: "Single", price: 60 },
          { size: "Double", price: 80 },
        ],
      },
      {
        name: "Americano",
        price: 70,
        bestselling: true,
        sizes: [
          { size: "Small", price: 70 },
          { size: "Medium", price: 85 },
          { size: "Large", price: 100 },
        ],
      },
      {
        name: "Latte",
        price: 90,
        bestselling: true,
        sizes: [
          { size: "Small", price: 90 },
          { size: "Medium", price: 110 },
          { size: "Large", price: 130 },
        ],
      },
      {
        name: "Cappuccino",
        price: 90,
        bestselling: false,
        sizes: [
          { size: "Small", price: 90 },
          { size: "Medium", price: 110 },
          { size: "Large", price: 130 },
        ],
      },
      {
        name: "Macchiato",
        price: 85,
        bestselling: false,
        sizes: [
          { size: "Small", price: 85 },
          { size: "Medium", price: 100 },
          { size: "Large", price: 120 },
        ],
      },
      { name: "Cortado", price: 75, bestselling: false, sizes: [{ size: "Standard", price: 75 }] },
    ],
    nonCoffee: [
      {
        name: "Iced Tea",
        price: 50,
        bestselling: false,
        sizes: [
          { size: "Small", price: 50 },
          { size: "Large", price: 70 },
        ],
      },
      {
        name: "Chocolate Drink",
        price: 80,
        bestselling: true,
        sizes: [
          { size: "Small", price: 80 },
          { size: "Medium", price: 100 },
          { size: "Large", price: 120 },
        ],
      },
      {
        name: "Fresh Juice",
        price: 85,
        bestselling: false,
        sizes: [
          { size: "Regular", price: 85 },
          { size: "Large", price: 110 },
        ],
      },
      {
        name: "Smoothie",
        price: 95,
        bestselling: false,
        sizes: [
          { size: "Regular", price: 95 },
          { size: "Large", price: 120 },
        ],
      },
      {
        name: "Milkshake",
        price: 90,
        bestselling: true,
        sizes: [
          { size: "Regular", price: 90 },
          { size: "Large", price: 115 },
        ],
      },
    ],
    pastry: [
      { name: "Croissant", price: 45, bestselling: false, sizes: [] },
      { name: "Danish", price: 50, bestselling: true, sizes: [] },
      { name: "Muffin", price: 55, bestselling: false, sizes: [] },
      { name: "Donut", price: 40, bestselling: true, sizes: [] },
      { name: "Sandwich", price: 65, bestselling: false, sizes: [] },
      { name: "Bagel", price: 60, bestselling: false, sizes: [] },
    ],
    riceMeals: [
      { name: "Chicken Adobo Rice", price: 120, bestselling: true, sizes: [] },
      { name: "Beef Stew Rice", price: 130, bestselling: false, sizes: [] },
      { name: "Tapa with Fried Rice", price: 125, bestselling: true, sizes: [] },
      { name: "Sinigang Rice", price: 115, bestselling: false, sizes: [] },
      { name: "Fried Chicken Rice", price: 110, bestselling: false, sizes: [] },
      { name: "Vegetable Rice Bowl", price: 95, bestselling: false, sizes: [] },
    ],
  }

  const categoryLabels = {
    coffee: "Coffee",
    nonCoffee: "Non-Coffee",
    pastry: "Pastries",
    riceMeals: "Rice Meals",
  }

  const MenuItem = ({ item, category }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-stone-50 rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-stone-800 text-sm">{item.name}</h4>
            {item.bestselling && (
              <span className="inline-flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded text-xs font-medium text-amber-700">
                <FaStar className="h-3 w-3" />
                Best Seller
              </span>
            )}
          </div>
        </div>
      </div>

      {item.sizes && item.sizes.length > 0 ? (
        <div className="space-y-1">
          {item.sizes.map((sizeOption, idx) => (
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
            >
              {label}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4">
          <div
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4"
            role="list"
          >
            {menuData[selectedCategory].map((item, idx) => (
              <MenuItem key={idx} item={item} category={selectedCategory} />
            ))}
          </div>
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
