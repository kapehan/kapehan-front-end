"use client";
// NOTE: The "Exceeded maximum recursion depth while resolving `tailwindcss`" error is a build-time config/resolution issue.

import Link from "next/link";
import CoffeeShopCard from "../components/CoffeeShopCard";
import { motion } from "framer-motion";
import SearchBox from "../components/search-box";
import HowItWorks from "../components/HowItWorks";
import PopularCities from "../components/PopularCities";
import OwnerCTA from "../components/OwnerCTA";
import Footer from "../components/Footer";
import Navigation from "../components/navigation";
import { useState, useEffect, useRef } from "react";
import LocationPermissionModal from "../components/LocationPermissionModal";
import { getAnonLocation } from "../services/commonService";
import { getAllCoffeeShop } from "../services/coffeeShopService";
import { getCache, setCache } from "./utils/cacheUtils";

const Page = () => {
  // Open the modal by default; it will auto-close if cached location is valid
  const [showLocationModal, setShowLocationModal] = useState(true);
  const locationIntervalRef = useRef(null);

  // Featured shops state (API-driven)
  const [featuredShops, setFeaturedShops] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(true);

  // Only keep interval; caching handled by LocationPermissionModal
  const REFRESH_INTERVAL = 1000 * 60 * 30; // 30 minutes

  // Fetch current geolocation and update backend (no localStorage here)
  const updateLocation = async () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        try {
          await getAnonLocation({ latitude, longitude });
        } catch (e) {
          console.error("Failed to auto-update location:", e);
        }
      },
      (err) => console.warn("Geolocation error during auto-update:", err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Start auto-refresh interval
  const startLocationInterval = () => {
    if (locationIntervalRef.current) return;
    locationIntervalRef.current = setInterval(() => {
      updateLocation();
    }, REFRESH_INTERVAL);
  };

  // Stop auto-refresh interval
  const stopLocationInterval = () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocationInterval();
    };
  }, []);

  const handleLocationSuccess = (coords) => {
    // Modal already saved to localStorage if needed. Just notify backend and start interval.
    if (coords && typeof coords.latitude === "number" && typeof coords.longitude === "number") {
      getAnonLocation({ latitude: coords.latitude, longitude: coords.longitude }).catch(() => {});
    }
    setShowLocationModal(false);
    startLocationInterval();
  };

  // Fetch top-rated shops (limit 4) with caching
  useEffect(() => {
    let cancelled = false;
    setShopsLoading(true);
    
    const CACHE_KEY = "featured_shops";
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

    (async () => {
      // Try to get cached data first
      const cached = getCache(CACHE_KEY, CACHE_TTL);
      if (cached && !cancelled) {
        setFeaturedShops(cached);
        setShopsLoading(false);
      }

      try {
        const resp = await getAllCoffeeShop({ limit: 4, sort: "rating:desc" });
        const data = resp?.data ?? resp;
        const items =
          (Array.isArray(data) && data) ||
          (Array.isArray(data?.items) && data.items) ||
          (Array.isArray(data?.docs) && data.docs) ||
          (Array.isArray(resp?.items) && resp.items) ||
          [];
        
        if (!cancelled) {
          // Cache the fresh data
          setCache(CACHE_KEY, items);
          setFeaturedShops(items);
        }
      } catch (e) {
        if (!cancelled) setFeaturedShops([]);
      } finally {
        if (!cancelled) setShopsLoading(false);
      }
    })();
    
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Navigation />

      <LocationPermissionModal
        isOpen={showLocationModal}
        onSuccess={handleLocationSuccess}
        onDeny={() => setShowLocationModal(false)}
      />

      {/* Hero Section - Simplified and Clean */}
      <div className="pt-16 md:pt-20 bg-white border-b border-stone-100">
        <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-whyte-bold text-stone-900 leading-tight sm:leading-tight md:leading-[1.1] mb-4 sm:mb-6">
                Discover Metro Manila's{" "}
                <span className="text-amber-700">Best Coffee</span>
              </p>

              <p className="text-base sm:text-lg md:text-xl font-whyte text-stone-600 leading-relaxed mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
                From hidden gems to iconic brews, find your perfect coffee
                experience with Kapehan
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 mb-8">
                {/* SearchBox with improved responsive width */}
                <div className="w-full sm:w-auto sm:min-w-[320px] md:min-w-[500px] lg:min-w-[600px]">
                  <SearchBox />
                </div>

                <Link href="/explore" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-4 bg-amber-700 text-white rounded-lg font-whyte-bold hover:bg-amber-800 transition-colors duration-300 text-sm sm:text-base">
                    Explore Now
                  </button>
                </Link>
              </div>

              {/* Quick Stats - 3 columns on all screen sizes */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 max-w-2xl mx-auto mt-10 sm:mt-16">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-xl sm:text-3xl md:text-4xl font-whyte-bold text-amber-700">
                    500+
                  </div>
                  <div className="text-xs sm:text-sm font-whyte-medium text-stone-600 mt-1">
                    Coffee Shops
                  </div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-xl sm:text-3xl md:text-4xl font-whyte-bold text-amber-700">
                    50K+
                  </div>
                  <div className="text-xs sm:text-sm font-whyte-medium text-stone-600 mt-1">
                    Reviews
                  </div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-xl sm:text-3xl md:text-4xl font-whyte-bold text-amber-700">
                    17
                  </div>
                  <div className="text-xs sm:text-sm font-whyte-medium text-stone-600 mt-1">
                    Cities
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Coffee Shops */}
      <section className="py-12 md:py-20 px-4 sm:px-6 bg-stone-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-whyte-bold text-stone-900 mb-3 sm:mb-4">
              Featured Coffee Shops
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-stone-600 max-w-2xl mx-auto font-whyte px-2">
              Discover the highest-rated coffee shops loved by our community
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
            {shopsLoading ? (
              <>
                <div className="h-40 sm:h-48 bg-stone-200 animate-pulse rounded-lg" />
                <div className="h-40 sm:h-48 bg-stone-200 animate-pulse rounded-lg" />
                <div className="h-40 sm:h-48 bg-stone-200 animate-pulse rounded-lg" />
                <div className="h-40 sm:h-48 bg-stone-200 animate-pulse rounded-lg" />
              </>
            ) : (
              featuredShops.map((shop, index) => (
                <motion.div
                  key={shop.id || shop._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Card fills width nicely on mobile */}
                  <CoffeeShopCard shop={shop} showDistance={false} />
                </motion.div>
              ))
            )}
          </div>

          <div className="text-center">
            <Link href="/explore">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors duration-300 text-base sm:text-lg font-whyte-bold"
              >
                View All Coffee Shops
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Popular Cities Section */}
      <PopularCities />

      {/* Own a Coffee Shop Section */}
      <OwnerCTA />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Page;
