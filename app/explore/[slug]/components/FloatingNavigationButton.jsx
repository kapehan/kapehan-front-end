"use client";
import { useState } from "react";
import { BiSolidNavigation } from "react-icons/bi";

function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(
    navigator.userAgent
  );
}

export default function FloatingNavigationButton({
  latitude,
  longitude,
  label = "Navigate",
}) {
  if (typeof latitude !== "number" || typeof longitude !== "number")
    return null;

  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    const lat = latitude;
    const lng = longitude;
    let url = "";
    if (isMobile()) {
      if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
        url = `http://maps.apple.com/?daddr=${lat},${lng}`;
      } else {
        url = `geo:${lat},${lng}?q=${lat},${lng}`;
      }
      setTimeout(() => {
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
          "_blank"
        );
      }, 500);
      window.location.href = url;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        aria-label="Open menu"
        onClick={handleClick}
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
        <BiSolidNavigation className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      {showTooltip && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-10 px-3 py-1 rounded bg-stone-800 text-white text-xs font-whyte-medium shadow-lg whitespace-nowrap">
          Navigate
        </div>
      )}
    </div>
  );
}
