"use client";
import { useState } from "react";
import { IoMenu } from "react-icons/io5";

export default function FloatingMenuButton({ onClick }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="
          group inline-flex items-center rounded-full
          text-amber-700
          px-3 md:px-4 py-2 md:py-2
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-amber-500
          cursor-pointer
          min-h-[44px] min-w-[44px]
          bg-transparent
        "
      >
        <IoMenu className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      {showTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 px-3 py-1 rounded bg-stone-800 text-white text-xs font-whyte-medium shadow-lg whitespace-nowrap">
          Menu
        </div>
      )}
    </div>
  );
}
