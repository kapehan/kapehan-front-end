"use client";
import { useState, useEffect } from "react";
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
  const checkStoredLocation = () => {
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
  };

  // Save location to localStorage with timestamp
  const saveLocation = ({ latitude, longitude }) => {
    if (!saveToLocalStorage) return;
    try {
      const payload = {
        latitude,
        longitude,
        ts: Date.now(),
        expiresAt: Date.now() + ttl, // human-readable expiry
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
        console.error("Failed to get location:", err);
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
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaMapMarkerAlt className="text-amber-700 text-xl" />
          </div>
          <h2 className="text-2xl font-whyte-bold text-stone-900 mb-2">
            Find Nearest Coffee Shops
          </h2>
          <p className="text-stone-600 mb-6">
            To help us show you the nearest coffee shops based on your
            location, may we access your location?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onDeny}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-stone-300 text-stone-700 rounded-lg font-whyte-bold hover:bg-stone-50 transition-colors"
            >
              Not Now
            </button>
            <button
              onClick={handleAllow}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-amber-700 text-white rounded-lg font-whyte-bold hover:bg-amber-800 transition-colors"
            >
              {loading ? "Locating..." : "Allow Location"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
