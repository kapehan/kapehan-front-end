"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import { getAnonLocation } from "../services/commonService";

const DENY_KEY = "location_permission_denied";
const DENY_TTL = 1000 * 60 * 60; // 1 hour

export default function LocationPermissionModal({
  isOpen,
  onSuccess,
  onDeny,
  saveToLocalStorage = true,
  localStorageKey = "user_location",
  ttl = 1000 * 60 * 20, // 20 minutes
}) {
  const [loading, setLoading] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);

  // Check if valid location exists in localStorage (with TTL) - sync helper
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

  // Async wrapper to avoid synchronous trigger paths
  const checkStoredLocationAsync = useCallback(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(checkStoredLocation()), 0);
    });
  }, [checkStoredLocation]);

  const saveLocation = ({ latitude, longitude }) => {
    if (!saveToLocalStorage) return;
    try {
      const now = Date.now();
      const payload = { latitude, longitude, ts: now, expiresAt: now + ttl };
      localStorage.setItem(localStorageKey, JSON.stringify(payload));
      console.log("Location saved to localStorage with expiry:", new Date(payload.expiresAt));
    } catch (e) {
      console.error("Error saving location:", e);
    }
  };

  // Handler for Allow Location (non-blocking, hide immediately)
  const handleAllow = async () => {
    console.log("[LocationModal] Allow clicked → hiding modal and requesting geolocation in background…");
    // Hide the modal right away (no coords yet)
    onSuccess && setTimeout(() => onSuccess(), 0);

    if (!navigator.geolocation) {
      console.warn("[LocationModal] Geolocation not supported by this browser.");
      return; // already hidden
    }

    setLoading(true);

    const sendBackend = (coords) => {
      // Save locally
      saveLocation(coords);
      // Fire-and-forget backend update
      getAnonLocation(coords)
        .then(() => console.log("[LocationModal] Sent location to backend."))
        .catch((err) => console.error("[LocationModal] Backend update failed:", err));
    };

    // First attempt: high accuracy (10s)
    console.log("[LocationModal] Attempt #1 (high accuracy, 10s) …");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("[LocationModal] Geolocation success (attempt #1):", { latitude, longitude });
        sendBackend({ latitude, longitude });
        setLoading(false);
      },
      (err) => {
        console.warn("[LocationModal] Attempt #1 failed:", { code: err?.code, message: err?.message });
        // If timeout, fallback to low accuracy (25s)
        if (err?.code === 3) {
          console.log("[LocationModal] Attempt #2 (low accuracy, 25s) …");
          navigator.geolocation.getCurrentPosition(
            (pos2) => {
              const { latitude, longitude } = pos2.coords;
              console.log("[LocationModal] Geolocation success (attempt #2):", { latitude, longitude });
              sendBackend({ latitude, longitude });
              setLoading(false);
            },
            (err2) => {
              console.error("[LocationModal] Attempt #2 failed:", { code: err2?.code, message: err2?.message });
              setLoading(false);
              // modal already hidden
            },
            { enableHighAccuracy: false, timeout: 25000, maximumAge: 60000 }
          );
        } else {
          setLoading(false);
          // modal already hidden
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Handler for "Not Now"
  const handleDeny = () => {
    try {
      localStorage.setItem(DENY_KEY, JSON.stringify({ ts: Date.now() }));
    } catch (e) {
      // ignore
    }
    setShouldShow(false);
    onDeny && onDeny();
  };

  // Define checkDenyFlag inside the component
  const checkDenyFlag = useCallback(() => {
    try {
      const raw = localStorage.getItem(DENY_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (!parsed.ts || Date.now() - parsed.ts > DENY_TTL) {
        localStorage.removeItem(DENY_KEY);
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  useEffect(() => {
    // On mount, check deny flag
    if (isOpen) {
      setShouldShow(!checkDenyFlag());
    }
  }, [isOpen, checkDenyFlag]);

  useEffect(() => {
    if (!isOpen || !shouldShow) return;
    console.log("[LocationModal] Checking stored location (async) …");
    let mounted = true;
    (async () => {
      const storedLocation = await checkStoredLocationAsync();
      if (mounted && storedLocation && onSuccess) {
        console.log("[LocationModal] Stored location found → hiding modal and using cached coords.");
        setTimeout(
          () =>
            onSuccess({
              latitude: storedLocation.latitude,
              longitude: storedLocation.longitude,
            }),
          0
        );
      } else {
        console.log("[LocationModal] No valid stored location.");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isOpen, shouldShow, checkStoredLocationAsync, onSuccess]);

  if (!isOpen || !shouldShow) return null;

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
          <p className="text-xs sm:text-sm md:text-base text-stone-600 mb-5 sm:mb-6 leading-relaxed font-whyte-regular">
            To help us show you the nearest coffee shops based on your
            location, may we access your location?
          </p>

          {/* Buttons - responsive layout and sizing */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={handleAllow}
              disabled={loading}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base bg-amber-700 text-white rounded-lg font-whyte-bold hover:bg-amber-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Locating..." : "Allow Location"}
            </button>
            <button
              onClick={handleDeny}
              disabled={loading}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base border border-stone-300 text-stone-700 rounded-lg font-whyte-bold hover:bg-stone-50 transition-colors disabled:opacity-50"
            >
              Not Now
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
