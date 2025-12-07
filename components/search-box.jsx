"use client";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <form
      role="search"
      className="w-full flex-grow max-w-full sm:max-w-md md:max-w-lg px-4 sm:px-0"
    >
      {/* Accessible label for screen readers */}
      <label htmlFor="kapehan-search" className="sr-only">
        Search for coffee shops
      </label>

      <div className="relative w-full">
        {/* Icon: perfectly centered vertically, pinned to the left */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400"
        >
          <FaSearch className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </span>

        <input
          id="kapehan-search"
          type="text"
          placeholder="Search for coffee shops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full
            pl-12 md:pl-14
            pr-4
            h-11 sm:h-12 md:h-12
            text-sm sm:text-base md:text-lg
            border border-gray-300 rounded-full
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-[#8B5E3B] focus:border-[#8B5E3B]
            transition-all duration-200
            bg-white
          "
        />
      </div>
    </form>
  );
}
