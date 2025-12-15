"use client";
import { BiSolidNavigation } from "react-icons/bi";

function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(navigator.userAgent);
}

export default function FloatingNavigationButton({ latitude, longitude, label = "Navigate" }) {
  if (typeof latitude !== "number" || typeof longitude !== "number") return null;

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
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
      }, 500);
      window.location.href = url;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, "_blank");
    }
  };

  return (
    <button
      type="button"
      aria-label={label}
      onClick={handleClick}
      className="
        fixed bottom-20 right-4 md:bottom-24 md:right-10 z-50
        group inline-flex items-center rounded-full
        bg-white border border-amber-600 text-amber-700
        shadow-lg px-2.5 md:px-4 py-1.5 md:py-2
        transition-all duration-200 hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-amber-500
        cursor-pointer
      "
    >
      {/* smaller fixed circle for mobile, slightly larger on md */}
      <span className="inline-flex items-center justify-center bg-amber-600 text-white rounded-full w-6 h-6 md:w-7 md:h-7 leading-none">
        <BiSolidNavigation className="block w-2.5 h-2.5 md:w-3 md:h-3" />
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
        Navigation
      </span>
    </button>
  );
}
