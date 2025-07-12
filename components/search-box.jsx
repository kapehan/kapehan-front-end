"use client"
import { useState } from "react"
import { FaSearch } from "react-icons/fa"

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="relative flex-grow max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search for coffee shops..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-3 sm:py-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3B] focus:border-[#8B5E3B] transition-all duration-200"
      />
    </div>
  )
}
