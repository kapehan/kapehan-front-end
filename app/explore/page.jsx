"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFilter,
  FaSearch,
  FaWifi,
  FaCar,
  FaLeaf,
  FaDog,
  FaWheelchair,
  FaTimes,
} from "react-icons/fa";
import { LuCoffee, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import Navigation from "../../components/navigation";
import LocationPermissionModal from "../../components/LocationPermissionModal";
import CoffeeShopCard from "../../components/CoffeeShopCard";
import Footer from "../../components/Footer";
import metroManilaCities from "../../data/metro-manila-cities.json";
import { getAllCoffeeShop } from "../../services/coffeeShopService";
import { getAnonLocation } from "../../services/commonService";
import ExploreLoading from './loading'

export default function ExplorePage() {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Debounced search term (3s)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedVibes, setSelectedVibes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  // start hidden and decide on mount based on stored anon location
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // start in loading state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Track total results for display
  const [resultCount, setResultCount] = useState(0);

  const searchParams = useSearchParams(); // added
  const paramsInitializedRef = useRef(false); // added - ensure we initialize from URL once
  const locationIntervalRef = useRef(null);

  // Local storage key + TTL (20 minutes)
  const ANON_LOC_KEY = "user_location";
  const LOCATION_TTL = 1000 * 60 * 20; // 20 minutes

  // Initialize state from URL search params once (supports direct /explore?city=... or ?q=...)
  useEffect(() => {
    if (paramsInitializedRef.current) return;
    paramsInitializedRef.current = true;

    if (!searchParams) return;

    const cityParam = searchParams.get("city") || "";
    const qParam = searchParams.get("q") || searchParams.get("search") || "";
    const pageParam = parseInt(searchParams.get("page") || "", 10);
    const ratingParam = parseFloat(searchParams.get("minRating") || searchParams.get("rating") || "");
    const amenitiesParam = searchParams.get("amenities") || "";
    const vibesParam = searchParams.get("vibes") || "";

    if (cityParam) setSelectedCity(cityParam);
    if (qParam) {
      setSearchTerm(qParam);
      setDebouncedSearchTerm(qParam); // immediate fetch when seeded from URL
    }
    if (!Number.isNaN(pageParam) && pageParam > 0) setCurrentPage(pageParam);
    if (!Number.isNaN(ratingParam) && ratingParam > 0) setMinRating(ratingParam);
    if (amenitiesParam) {
      setSelectedAmenities(amenitiesParam.split(",").map(s => s.trim()).filter(Boolean));
    }
    if (vibesParam) {
      setSelectedVibes(vibesParam.split(",").map(s => s.trim()).filter(Boolean));
    }
  }, [searchParams]);

  // Memoize the query so effect only runs when relevant inputs change.
  const queryWithPagination = useMemo(() => {
    return {
      search: debouncedSearchTerm || undefined,
      city: selectedCity || undefined,
      minRating: minRating > 0 ? minRating : undefined,
      amenities: selectedAmenities.length ? selectedAmenities.join(",") : undefined,
      vibes: selectedVibes.length ? selectedVibes.join(",") : undefined,
      // Do not send page=1; backend defaults to page 1 already
      page: currentPage > 1 ? currentPage : undefined,
    };
  }, [debouncedSearchTerm, selectedCity, minRating, selectedAmenities, selectedVibes, currentPage]);

  // Debounce effect (3 seconds)
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Reset page when debounced search or other filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCity, minRating, selectedAmenities, selectedVibes]);

  // Fetch from backend with stale-cancel
  useEffect(() => {
    // Wait for URL params to be initialized before fetching (so direct /explore?city=... triggers a request)
    if (!paramsInitializedRef.current) return;

    let cancelled = false;
    setIsLoading(true);

    (async () => {
      try {
        const response = await getAllCoffeeShop(queryWithPagination);

        // Prefer pageInfo from API; fall back lightly without using limit
        const data = response?.data ?? response;
        const pageInfo =
          response?.pageInfo ??
          data?.pageInfo ??
          response?.pagination ??
          data?.pagination;

        let items =
          (Array.isArray(data) && data) ||
          (Array.isArray(data?.items) && data.items) ||
          (Array.isArray(data?.docs) && data.docs) ||
          (Array.isArray(response?.items) && response.items) ||
          [];

        const total =
          pageInfo?.total ??
          pageInfo?.totalDocs ??
          data?.total ??
          data?.count ??
          items.length;

        const pages =
          pageInfo?.totalPages ?? 1;

        if (!cancelled) {
          setShops(items || []);
          setResultCount(total || 0);
          setTotalPages(pages || 1);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Error fetching coffee shops:", error);
          setShops([]);
          setResultCount(0);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [queryWithPagination]);

  // ✅ Amenity Options
  const amenityOptions = [
    { key: "wifi", label: "WiFi", icon: FaWifi },
    { key: "parking", label: "Parking", icon: FaCar },
    { key: "outdoorSeating", label: "Outdoor Seating", icon: FaLeaf },
    { key: "petFriendly", label: "Pet Friendly", icon: FaDog },
    {
      key: "wheelchairAccessible",
      label: "Wheelchair Accessible",
      icon: FaWheelchair,
    },
  ];

  // ✅ Vibe Options
  const vibesOptions = [
    "Artsy",
    "Cozy",
    "Modern",
    "Rustic",
    "Industrial",
    "Minimalist",
    "Vintage",
    "Bohemian",
    "Elegant",
    "Casual",
    "Romantic",
    "Family-friendly",
    "Professional",
    "Hipster",
    "Traditional",
    "Trendy",
    "Quiet",
    "Lively",
    "Intimate",
    "Spacious",
  ];

  // helper: read and validate stored anon location (with TTL check)
  const readAnonLocation = () => {
    try {
      const raw = localStorage.getItem(ANON_LOC_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Check if expired
      if (!parsed.ts || Date.now() - parsed.ts > LOCATION_TTL) {
        console.log("Location expired, removing from localStorage");
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
          // Save with timestamp
          const payload = { 
            latitude, 
            longitude, 
            ts: Date.now(),
            expiresAt: Date.now() + LOCATION_TTL
          };
          localStorage.setItem(ANON_LOC_KEY, JSON.stringify(payload));
        } catch (e) {
          console.error("Failed to auto-update location:", e);
        }
      },
      (err) => console.warn("Geolocation error during auto-update:", err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Start auto-refresh interval (check every 5 minutes if location needs refresh)
  const startLocationInterval = () => {
    if (locationIntervalRef.current) return;
    console.log("Starting location auto-refresh check");
    locationIntervalRef.current = setInterval(() => {
     const stored = readAnonLocation();
     if (!stored) {
       console.log("Location expired during interval, showing modal");
       setShowLocationModal(true);
       stopLocationInterval();
     }
    }, 1000 * 60 * 5); // Check every 5 minutes
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
      console.log("Found valid stored location:", stored);
      setShowLocationModal(false);
      startLocationInterval();
    } else {
      console.log("No stored location, showing modal");
      setShowLocationModal(true);
    }
    
    return () => {
      stopLocationInterval();
    };
  }, []);

  const handleLocationSuccess = () => {
    console.log("Location success, hiding modal and starting interval");
    setShowLocationModal(false);
    startLocationInterval();
  };

  const handleLocationDeny = () => {
    setShowLocationModal(false);
  };

  // ✅ Filter handlers
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("");
    setMinRating(0);
    setSelectedAmenities([]);
    setSelectedVibes([]);
    setCurrentPage(1);
  };

  const handleAmenityToggle = (amenityKey) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityKey)
        ? prev.filter((a) => a !== amenityKey)
        : [...prev, amenityKey]
    );
  };

  const handleVibesToggle = (vibe) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  // ✅ Pagination
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    selectedCity ||
    minRating > 0 ||
    selectedAmenities.length > 0 ||
    selectedVibes.length > 0;
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <LocationPermissionModal
        isOpen={showLocationModal}
        onSuccess={handleLocationSuccess}
        onDeny={handleLocationDeny}
        localStorageKey={ANON_LOC_KEY}
        ttl={LOCATION_TTL}
      />

      {/* Enhanced Search and Filter Bar - Mobile First */}
      <div className="pt-12 bg-stone-50 border-b border-stone-200 sticky top-12 z-30">
        <div className="container mx-auto px-4 py-3 md:py-4">
          {/* Main Filter Row */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch sm:items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search coffee shops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-sm"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  showFilters || hasActiveFilters
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <FaFilter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="bg-amber-700 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                    {
                      [
                        selectedCity,
                        minRating > 0,
                        ...selectedAmenities,
                        ...selectedVibes,
                      ].filter(Boolean).length
                    }
                  </span>
                )}
              </button>

              {/* Clear Filters - Mobile */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="sm:hidden flex items-center space-x-1 px-3 py-2.5 text-stone-600 hover:text-stone-800 transition-colors text-sm"
                >
                  <FaTimes className="h-3 w-3" />
                  <span>Clear</span>
                </button>
              )}

              {/* Results Count */}
              <div className="text-stone-600 font-medium text-sm whitespace-nowrap">
                <span className="hidden sm:inline">
                  {resultCount} coffee shop
                  {resultCount !== 1 ? "s" : ""} found
                </span>
                <span className="sm:hidden">{resultCount} found</span>
              </div>
            </div>
          </div>

          {/* Enhanced Expandable Filters - Mobile First */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 bg-white rounded-lg border border-stone-200 overflow-hidden"
              >
                {/* Filter Header - Mobile */}
                <div className="flex items-center justify-between mb-4 sm:hidden">
                  <h3 className="font-semibold text-stone-900">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 text-stone-500 hover:text-stone-700"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Basic Filters Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* City Filter */}
                    <div>
                      <label className="block text-sm font-medium text-stone-900 mb-2">
                        City
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm bg-white"
                      >
                        <option value="">All Cities</option>
                        {metroManilaCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <label className="block text-sm font-medium text-stone-900 mb-2">
                        Minimum Rating
                      </label>
                      <select
                        value={minRating}
                        onChange={(e) =>
                          setMinRating(Number.parseFloat(e.target.value))
                        }
                        className="w-full p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm bg-white"
                      >
                        <option value={0}>Any Rating</option>
                        <option value={4.5}>4.5+ Stars</option>
                        <option value={4.0}>4.0+ Stars</option>
                        <option value={3.5}>3.5+ Stars</option>
                        <option value={3.0}>3.0+ Stars</option>
                      </select>
                    </div>

                    {/* Amenities Filter */}
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-sm font-medium text-stone-900 mb-2">
                        Amenities
                      </label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {amenityOptions.map((amenity) => (
                          <label
                            key={amenity.key}
                            className="flex items-center cursor-pointer hover:bg-stone-50 rounded p-1"
                          >
                            <input
                              type="checkbox"
                              checked={selectedAmenities.includes(amenity.key)}
                              onChange={() => handleAmenityToggle(amenity.key)}
                              className="mr-2 h-4 w-4 text-amber-700 focus:ring-amber-600 border-stone-300 rounded"
                            />
                            <amenity.icon className="mr-2 h-3 w-3 text-stone-500 flex-shrink-0" />
                            <span className="text-sm text-stone-700">
                              {amenity.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Vibes Filter - Full Width */}
                  <div>
                    <label className="block text-sm font-medium text-stone-900 mb-3">
                      Vibes & Atmosphere
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-40 overflow-y-auto">
                      {vibesOptions.map((vibe) => (
                        <label
                          key={vibe}
                          className="flex items-center cursor-pointer hover:bg-stone-50 rounded p-1.5"
                        >
                          <input
                            type="checkbox"
                            checked={selectedVibes.includes(vibe)}
                            onChange={() => handleVibesToggle(vibe)}
                            className="mr-2 h-4 w-4 text-amber-700 focus:ring-amber-600 border-stone-300 rounded flex-shrink-0"
                          />
                          <span className="text-xs sm:text-sm text-stone-700 leading-tight">
                            {vibe}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-stone-200 space-y-2 sm:space-y-0">
                    <button
                      onClick={clearFilters}
                      className="text-stone-600 hover:text-stone-800 transition-colors text-sm font-medium"
                    >
                      Clear All Filters
                    </button>
                    <div className="text-xs text-stone-500">
                      {selectedAmenities.length > 0 &&
                        `${selectedAmenities.length} amenity filter${
                          selectedAmenities.length > 1 ? "s" : ""
                        }`}
                      {selectedAmenities.length > 0 &&
                        selectedVibes.length > 0 &&
                        " • "}
                      {selectedVibes.length > 0 &&
                        `${selectedVibes.length} vibe filter${
                          selectedVibes.length > 1 ? "s" : ""
                        }`}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Coffee Shops Grid - Mobile First */}
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <ExploreLoading /> 
        ) : shops.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              {shops.map((shop, index) => (
                <motion.div
                  key={shop.id || `${shop._id || "shop"}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <CoffeeShopCard shop={shop} showDistance={false} />
                </motion.div>
              ))}
            </div>

            {/* Pagination - Mobile First */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-1 md:space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LuChevronLeft className="h-4 md:h-5 w-4 md:w-5" />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 md:px-4 py-2 rounded-lg border transition-colors text-sm md:text-base ${
                          currentPage === page
                            ? "bg-amber-700 text-white border-amber-700"
                            : "border-stone-300 hover:bg-stone-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span
                        key={page}
                        className="px-1 md:px-2 text-stone-400 text-sm md:text-base"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LuChevronRight className="h-4 md:h-5 w-4 md:w-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 md:py-16">
            <LuCoffee className="mx-auto text-stone-400 mb-4 h-12 md:h-16 w-12 md:w-16" />
            <h3 className="text-xl md:text-2xl font-semibold text-stone-900 mb-2">
              No coffee shops found
            </h3>
            <p className="text-stone-600 mb-4 md:mb-6 text-sm md:text-base">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-4 md:px-6 py-2 md:py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors text-sm md:text-base"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
