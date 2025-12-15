"use client";
import { LuCoffee } from "react-icons/lu";

export default function FloatingMenuButton({ onClick }) {
	return (
		<button
			type="button"
			aria-label="Open menu"
			onClick={onClick}
			className="
        group inline-flex items-center rounded-full
        bg-white border border-amber-600 text-amber-700
        shadow-lg px-2.5 md:px-4 py-1.5 md:py-2
        transition-all duration-200 hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-amber-500
        cursor-pointer
      "
		>
			{/* match navigation button circle/icon sizing */}
			<span className="inline-flex items-center justify-center bg-amber-600 text-white rounded-full w-6 h-6 md:w-7 md:h-7 leading-none">
				<LuCoffee className="block w-2.5 h-2.5 md:w-3 md:h-3" />
			</span>

			<span
				className="
          hidden md:inline-block overflow-hidden
          opacity-0 group-hover:opacity-100
          max-w-0 group-hover:max-w-[110px]
          transition-[opacity,max-width] duration-200 ease-out
          font-whyte-medium text-sm whitespace-nowrap ml-2
        "
			>
				Menu
			</span>
		</button>
	);
}
