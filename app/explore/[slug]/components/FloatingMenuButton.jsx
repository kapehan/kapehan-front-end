"use client";
import { LuCoffee } from "react-icons/lu";

export default function FloatingMenuButton({ onClick }) {
  return (
    <button
      type="button"
      aria-label="Open menu"
      onClick={onClick}
      className="
        fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50
        group inline-flex items-center rounded-full
        bg-white border border-amber-600 text-amber-700
        shadow-lg px-4 md:px-5 py-3
        transition-all duration-200 hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-amber-500
        cursor-pointer
      "
    >
      <LuCoffee className="h-5 w-5 md:h-6 md:w-6" />
      <span
        className="
          hidden md:inline-block overflow-hidden
          opacity-0 group-hover:opacity-100
          max-w-0 group-hover:max-w-[110px]
          transition-[opacity,max-width] duration-200 ease-out
          font-whyte-medium text-sm whitespace-nowrap ml-2
        "
      >
        View Menu
      </span>
    </button>
  );
}
