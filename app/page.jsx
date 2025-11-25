"use client";
import Link from "next/link";
import { allShops } from "../data/dummy-data";
import CoffeeShopCard from "../components/CoffeeShopCard";
import { motion } from "framer-motion";
import SearchBox from "../components/search-box";
import HowItWorks from "../components/HowItWorks";
import PopularCities from "../components/PopularCities";
import OwnerCTA from "../components/OwnerCTA";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import Navigation from "../components/navigation";
import { useState, useEffect, useRef } from "react";
import LocationPermissionModal from "../components/LocationPermissionModal";
import { getAnonLocation } from "../services/commonService";

const Page = () => {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const locationIntervalRef = useRef(null);

  const featuredShops = [...allShops]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  // Local storage key + TTL (20 minutes)
  const ANON_LOC_KEY = "user_location";
  const REFRESH_INTERVAL = 1000 * 60 * 30; // 30 minutes

  // helper: save anon location
  const saveAnonLocation = ({ latitude, longitude }) => {
    try {
      const payload = { latitude, longitude, ts: Date.now() };
      localStorage.setItem(ANON_LOC_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error("Error saving anon location:", e);
    }
  };

  // helper: read and validate stored anon location
  const readAnonLocation = () => {
    try {
      const raw = localStorage.getItem(ANON_LOC_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed.ts || Date.now() - parsed.ts > ANON_LOC_TTL) {
        localStorage.removeItem(ANON_LOC_KEY);
        return null;
      }
      return parsed;
    } catch (e) {
      console.error("Error reading anon location:", e);
      return null;
    }
  };

  // Fetch current geolocation and update backend + localStorage
  const updateLocation = async () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        console.log("Auto-updating location:", { latitude, longitude });
        try {
          await getAnonLocation({ latitude, longitude });
          saveAnonLocation({ latitude, longitude });
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

  // on mount: check stored anon location and decide whether to show modal
  useEffect(() => {
    const stored = readAnonLocation();
    if (stored) {
      console.log("Found stored anon location:", stored);
      setShowLocationModal(false);
      startLocationInterval();
    } else {
      // no stored coords -> show modal to ask user
      setShowLocationModal(true);
    }

    return () => {
      stopLocationInterval();
    };
  }, []);

  const handleLocationSuccess = () => {
    setShowLocationModal(false);
    startLocationInterval();
  };

  return (
    <>
      <Navigation />

      <LocationPermissionModal
        isOpen={showLocationModal}
        onSuccess={handleLocationSuccess}
        onDeny={() => setShowLocationModal(false)}
      />

      {/* Hero Section - Simplified and Clean */}
      <div className="pt-20 bg-white border-b border-stone-100">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-stone-900 leading-tight mb-6">
                Discover Metro Manila's{" "}
                <span className="text-amber-700">Best Coffee</span>
              </h1>

              <p className="text-lg md:text-xl text-stone-600 leading-relaxed mb-8 max-w-3xl mx-auto">
                From hidden gems to iconic brews, find your perfect coffee
                experience with Kapehan
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <SearchBox />
                <Link href="/explore">
                  <button className="px-8 py-4 bg-amber-700 text-white rounded-lg font-semibold hover:bg-amber-800 transition-colors duration-300">
                    Explore Now
                  </button>
                </Link>
              </div>

              {/* Simplified Quick Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-amber-700">
                    500+
                  </div>
                  <div className="text-sm font-medium text-stone-600 mt-1">
                    Coffee Shops
                  </div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-amber-700">
                    50K+
                  </div>
                  <div className="text-sm font-medium text-stone-600 mt-1">
                    Reviews
                  </div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-amber-700">
                    17
                  </div>
                  <div className="text-sm font-medium text-stone-600 mt-1">
                    Cities
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Coffee Shops */}
      <section className="py-16 md:py-20 px-6 bg-stone-50 border-b border-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Featured Coffee Shops
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Discover the highest-rated coffee shops loved by our community
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredShops.map((shop, index) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CoffeeShopCard shop={shop} showDistance={false} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/explore">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors duration-300 text-lg font-semibold"
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

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Page;
