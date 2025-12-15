"use client";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBox() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <form role="search" className="w-full">
      <label htmlFor="kapehan-search" className="sr-only">
        Search for coffee shops
      </label>

      <div className="relative w-full">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 md:pl-5 flex items-center pointer-events-none text-gray-400">
          <FaSearch className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </div>

        {/* Input Field - optimized for iPhone 13 */}
        <input
          id="kapehan-search"
          type="text"
          placeholder="Search coffee shops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          inputMode="search"
          autoComplete="off"
          className="
            w-full
            appearance-none
            pl-11 sm:pl-12 md:pl-16
            pr-4 sm:pr-5 md:pr-6
            py-3 sm:py-3 md:py-4
            min-h-[3rem] md:min-h-[3.5rem]
            text-sm sm:text-base md:text-lg
            leading-[1.50]
            border border-stone-300 rounded-full
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-[#8B5E3B] focus:border-transparent
            transition-all duration-200
            bg-white
            placeholder:text-stone-400
          "
        />
      </div>
    </form>
  );
}