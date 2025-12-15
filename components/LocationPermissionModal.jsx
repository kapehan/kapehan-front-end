"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import { getAnonLocation } from "../services/commonService";

export default function LocationPermissionModal({
  isOpen,
  onSuccess,
  onDeny,
  saveToLocalStorage = true,
  localStorageKey = "user_location",
  ttl = 1000 * 60 * 20, // 20 minutes
}) {
  const [loading, setLoading] = useState(false);

  // Check if valid location exists in localStorage (with TTL)
  const checkStoredLocation = useCallback(() => {
    try {
      const raw = localStorage.getItem(localStorageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed.ts || Date.now() - parsed.ts > ttl) {
        localStorage.removeItem(localStorageKey);
        return null;
      }
      return parsed;
    } catch (e) {
      console.error("Error reading location:", e);
      return null;
    }
  }, [localStorageKey, ttl]);

  // Save location to localStorage with timestamp
  const saveLocation = ({ latitude, longitude }) => {
    if (!saveToLocalStorage) return;
    try {
      const now = Date.now();
      const payload = {
        latitude,
        longitude,
        ts: now,
        expiresAt: now + ttl, // human-readable expiry
      };
      localStorage.setItem(localStorageKey, JSON.stringify(payload));
      console.log(
        "Location saved to localStorage with expiry:",
        new Date(payload.expiresAt)
      );
    } catch (e) {
      console.error("Error saving location:", e);
    }
  };

  // Handler for Allow Location
  const handleAllow = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      if (onDeny) onDeny();
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        try {
          await getAnonLocation({ latitude, longitude });
          saveLocation({ latitude, longitude });
          if (onSuccess) onSuccess({ latitude, longitude });
        } catch (err) {
          console.error("Failed to send location:", err);
          if (onDeny) onDeny();
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        // Log more helpful details (some environments stringify PositionError poorly)
        console.error("Failed to get location:", {
          code: err?.code,
          message: err?.message,
          name: err?.name,
        });
        setLoading(false);
        if (onDeny) onDeny();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (isOpen) {
      const storedLocation = checkStoredLocation();
      if (storedLocation) {
        // If valid location exists, directly call onSuccess
        onSuccess({
          latitude: storedLocation.latitude,
          longitude: storedLocation.longitude,
        });
      }
    }
  }, [isOpen, checkStoredLocation, onSuccess]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg sm:rounded-xl shadow-lg p-5 sm:p-6 md:p-8 max-w-sm w-full text-center"
        >
          {/* Icon - responsive sizing */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FaMapMarkerAlt className="text-amber-700 text-base sm:text-lg md:text-xl" />
          </div>

          {/* Heading - responsive sizing */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-whyte-bold text-stone-900 mb-2 sm:mb-3">
            Find Nearest Coffee Shops
          </h2>

          {/* Description - responsive sizing */}
          <p className="text-xs sm:text-sm md:text-base text-stone-600 mb-5 sm:mb-6 leading-relaxed">
            To help us show you the nearest coffee shops based on your
            location, may we access your location?
          </p>

          {/* Buttons - responsive layout and sizing */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onDeny}
              disabled={loading}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base border border-stone-300 text-stone-700 rounded-lg font-whyte-bold hover:bg-stone-50 transition-colors disabled:opacity-50"
            >
              Not Now
            </button>
            <button
              onClick={handleAllow}
              disabled={loading}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base bg-amber-700 text-white rounded-lg font-whyte-bold hover:bg-amber-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Locating..." : "Allow Location"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
