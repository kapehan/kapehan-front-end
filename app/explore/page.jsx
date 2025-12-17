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
import { getAllCoffeeShop } from "../../services/coffeeShopService";
import {
  getAnonLocation,
  getAmenities,
  getVibes,
  getCities,
} from "../../services/commonService";
import ExploreLoading from "./loading";
import { getCache, setCache } from "../utils/cacheUtils";

export default function ExplorePage() {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedVibes, setSelectedVibes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resultCount, setResultCount] = useState(0);

  const [amenityOptions, setAmenityOptions] = useState([]);
  const [vibesOptions, setVibesOptions] = useState([]);
  const [cities, setCities] = useState([]);

  const [locationVersion, setLocationVersion] = useState(0);

  const searchParams = useSearchParams();
  const paramsInitializedRef = useRef(false);
  const locationIntervalRef = useRef(null);

  const ANON_LOC_KEY = "user_location";
  const LOCATION_TTL = 1000 * 60 * 20;

  const CITIES_CACHE_KEY = "explore:cities";
  const AMENITIES_CACHE_KEY = "explore:amenities";
  const VIBES_CACHE_KEY = "explore:vibes";
  const CACHE_TTL = 12 * 60 * 60 * 1000;

  useEffect(() => {
    if (paramsInitializedRef.current) return;
    paramsInitializedRef.current = true;

    if (!searchParams) return;

    const cityParam = searchParams.get("city") || "";
    const qParam = searchParams.get("q") || searchParams.get("search") || "";
    const pageParam = parseInt(searchParams.get("page") || "", 10);
    const ratingParam = parseFloat(
      searchParams.get("minRating") || searchParams.get("rating") || ""
    );
    const amenitiesParam = searchParams.get("amenities") || "";
    const vibesParam = searchParams.get("vibes") || "";

    if (cityParam) setSelectedCity(cityParam);
    if (qParam) {
      setSearchTerm(qParam);
      setDebouncedSearchTerm(qParam);
    }
    if (!Number.isNaN(pageParam) && pageParam > 0) setCurrentPage(pageParam);
    if (!Number.isNaN(ratingParam) && ratingParam > 0)
      setMinRating(ratingParam);
    if (amenitiesParam) {
      setSelectedAmenities(
        amenitiesParam
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }
    if (vibesParam) {
      setSelectedVibes(
        vibesParam
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }
  }, [searchParams]);

  const getValidStoredLocation = () => {
    try {
      const raw = localStorage.getItem(ANON_LOC_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const { latitude, longitude, ts, expiresAt } = parsed || {};
      const notExpired =
        typeof expiresAt === "number"
          ? Date.now() < expiresAt
          : typeof ts === "number"
            ? Date.now() - ts <= LOCATION_TTL
            : false;
      if (notExpired && typeof latitude === "number" && typeof longitude === "number") {
        return { latitude, longitude };
      }
      localStorage.removeItem(ANON_LOC_KEY);
      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const loc = getValidStoredLocation();
    if (loc) {
      setShowLocationModal(false);
      startLocationInterval();
    } else {
      setShowLocationModal(true);
    }
    return () => {
      stopLocationInterval();
    };
  }, []);

  const queryWithPagination = useMemo(() => {
    const loc = getValidStoredLocation();
    return {
      search: debouncedSearchTerm || undefined,
      city: selectedCity || undefined,
      minRating: minRating > 0 ? minRating : undefined,
      amenities: selectedAmenities.length ? selectedAmenities.join(",") : undefined,
      vibes: selectedVibes.length ? selectedVibes.join(",") : undefined,
      lat: loc?.latitude ?? undefined,
      lng: loc?.longitude ?? undefined,
      page: currentPage > 1 ? currentPage : undefined,
    };
  }, [
    debouncedSearchTerm,
    selectedCity,
    minRating,
    selectedAmenities,
    selectedVibes,
    currentPage,
    locationVersion,
  ]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearchTerm,
    selectedCity,
    minRating,
    selectedAmenities,
    selectedVibes,
  ]);

  useEffect(() => {
    if (!paramsInitializedRef.current) return;

    let cancelled = false;
    setIsLoading(true);

    (async () => {
      try {
        const response = await getAllCoffeeShop(queryWithPagination);

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

        const pages = pageInfo?.totalPages ?? 1;

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

  useEffect(() => {
    let cancelled = false;

    const cacheIfMissing = async (key, fetchFn, setter, normalizer) => {
      const cached = getCache(key, CACHE_TTL);
      if (cached) {
        setter(cached);
        return;
      }
      try {
        const apiData = await fetchFn();
        if (!cancelled && Array.isArray(apiData) && apiData.length) {
          const normalized = apiData.map(normalizer).filter(Boolean);
          setCache(key, normalized);
          setter(normalized);
        }
      } catch {}
    };

    cacheIfMissing(
      CITIES_CACHE_KEY,
      getCities,
      setCities,
      (c) => {
        const value = c?.city_value ?? c?.value ?? c?.key ?? c?.city;
        const label = c?.city_name ?? c?.label ?? c?.name ?? c?.city;
        return value && label ? { value, label } : null;
      }
    );

    cacheIfMissing(
      AMENITIES_CACHE_KEY,
      getAmenities,
      setAmenityOptions,
      (a) => {
        const key = a?.amenity_value ?? a?.value ?? a?.key ?? a?.name;
        const label = a?.amenity_name ?? a?.label ?? a?.name;
        const iconMap = { wifi: FaWifi, parking: FaCar, outdoorSeating: FaLeaf, petFriendly: FaDog, wheelchairAccessible: FaWheelchair };
        return key && label ? { key, label, icon: iconMap[key] } : null;
      }
    );

    cacheIfMissing(
      VIBES_CACHE_KEY,
      getVibes,
      setVibesOptions,
      (v) => {
        const value = v?.vibe_value ?? v?.value ?? v?.key;
        const label = v?.vibe_name ?? v?.label ?? v?.name;
        return value && label ? { value, label } : null;
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  const updateLocation = async () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;
        try {
          await getAnonLocation({ latitude, longitude });
          const payload = { latitude, longitude, ts: Date.now(), expiresAt: Date.now() + LOCATION_TTL };
          localStorage.setItem(ANON_LOC_KEY, JSON.stringify(payload));
          setLocationVersion((v) => v + 1);
        } catch (e) {
          console.error("Failed to auto-update location:", e);
        }
      },
      (err) => console.warn("Geolocation error during auto-update:", err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const startLocationInterval = () => {
    stopLocationInterval();
    locationIntervalRef.current = setInterval(() => {
      updateLocation();
    }, LOCATION_TTL);
  };

  const stopLocationInterval = () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
  };

  const handleLocationSuccess = async () => {
    setShowLocationModal(false);
    await updateLocation();
    startLocationInterval();
  };

  const handleFindNearest = async () => {
    await updateLocation();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLocationDeny = () => {
    setShowLocationModal(false);
  };

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

      {/* Sticky Header - responsive */}
      <div className="pt-2 bg-stone-50 border-b border-stone-200 sticky top-12 z-30">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
          <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-4">
            {/* Search and Controls Row - responsive flex */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
              {/* Search Bar - responsive */}
              <div className="relative flex-1 min-w-0">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 text-xs sm:text-sm"
                />
              </div>

              {/* Filter Button and Results - responsive */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-xs sm:text-sm font-whyte-medium flex-shrink-0 ${
                    showFilters || hasActiveFilters
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  }`}
                >
                  <FaFilter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {hasActiveFilters && (
                    <span className="bg-amber-700 text-white text-xs rounded-full px-1.5 py-0.5">
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

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="sm:hidden flex items-center gap-1 px-2 py-2 text-stone-600 hover:text-stone-800 transition-colors text-xs"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                )}

                <button
                  onClick={handleFindNearest}
                  className="px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-amber-700 text-white hover:bg-amber-800 text-xs sm:text-sm font-whyte-medium whitespace-nowrap flex-shrink-0"
                >
                  Nearest
                </button>
              </div>
            </div>

            {/* Results Count - responsive */}
            <div className="text-stone-600 font-whyte-medium text-xs sm:text-sm">
              <span className="hidden sm:inline">
                {resultCount} coffee shop{resultCount !== 1 ? "s" : ""} found
              </span>
              <span className="sm:hidden">{resultCount} found</span>
            </div>
          </div>

          {/* Filter Panel - responsive */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 sm:mt-4 p-3 sm:p-4 bg-white rounded-lg border border-stone-200 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4 sm:hidden">
                  <h3 className="font-whyte-bold text-stone-900 text-sm">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 text-stone-500 hover:text-stone-700"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {/* Basic Filters - responsive grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {/* City Filter */}
                    <div>
                      <label className="block text-xs sm:text-sm font-whyte-medium text-stone-900 mb-1.5 sm:mb-2">
                        City
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full p-2 sm:p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-xs sm:text-sm bg-white"
                      >
                        <option value="">All Cities</option>
                        {cities.map((city) => (
                          <option key={city.value} value={city.value}>
                            {city.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Rating Filter */}
                    <div>
                      <label className="block text-xs sm:text-sm font-whyte-medium text-stone-900 mb-1.5 sm:mb-2">
                        Rating
                      </label>
                      <select
                        value={minRating}
                        onChange={(e) =>
                          setMinRating(Number.parseFloat(e.target.value))
                        }
                        className="w-full p-2 sm:p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-xs sm:text-sm bg-white"
                      >
                        <option value={0}>Any Rating</option>
                        <option value={4.5}>4.5+</option>
                        <option value={4.0}>4.0+</option>
                        <option value={3.5}>3.5+</option>
                        <option value={3.0}>3.0+</option>
                      </select>
                    </div>

                    {/* Amenities Filter */}
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-xs sm:text-sm font-whyte-medium text-stone-900 mb-1.5 sm:mb-2">
                        Amenities
                      </label>
                      <div className="space-y-1.5 max-h-32 overflow-y-auto">
                        {amenityOptions.map((amenity) => (
                          <label
                            key={amenity.key}
                            className="flex items-center cursor-pointer hover:bg-stone-50 rounded p-1 text-xs sm:text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={selectedAmenities.includes(amenity.key)}
                              onChange={() => handleAmenityToggle(amenity.key)}
                              className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-700 rounded"
                            />
                            {amenity.icon && (
                              <amenity.icon className="mr-1.5 sm:mr-2 h-3 w-3 text-stone-500 flex-shrink-0" />
                            )}
                            <span className="text-stone-700">{amenity.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Vibes Filter - responsive grid */}
                  <div>
                    <label className="block text-xs sm:text-sm font-whyte-medium text-stone-900 mb-2 sm:mb-3">
                      Vibes
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2 max-h-40 overflow-y-auto">
                      {vibesOptions.map((vibe) => (
                        <label
                          key={vibe.value}
                          className="flex items-center cursor-pointer hover:bg-stone-50 rounded p-1 text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={selectedVibes.includes(vibe.value)}
                            onChange={() => handleVibesToggle(vibe.value)}
                            className="mr-1 h-3 w-3 text-amber-700 rounded flex-shrink-0"
                          />
                          <span className="text-stone-700 leading-tight line-clamp-2">
                            {vibe.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 sm:pt-4 border-t border-stone-200 space-y-2 sm:space-y-0">
                    <button
                      onClick={clearFilters}
                      className="text-stone-600 hover:text-stone-800 transition-colors text-xs sm:text-sm font-whyte-medium"
                    >
                      Clear All
                    </button>
                    <div className="text-xs text-stone-500">
                      {selectedAmenities.length > 0 &&
                        `${selectedAmenities.length} amenity`}
                      {selectedAmenities.length > 0 &&
                        selectedVibes.length > 0 &&
                        " • "}
                      {selectedVibes.length > 0 && `${selectedVibes.length} vibe`}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Coffee Shops Grid - responsive */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {isLoading ? (
          <ExploreLoading />
        ) : shops.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
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

            {/* Pagination - responsive */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 sm:p-2 rounded-lg border border-stone-300 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LuChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
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
                        className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border transition-colors text-xs sm:text-sm md:text-base ${
                          currentPage === page
                            ? "bg-amber-700 text-white border-amber-700"
                            : "border-stone-300 hover:bg-stone-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span
                        key={page}
                        className="px-0.5 sm:px-1 md:px-2 text-stone-400 text-xs sm:text-sm md:text-base"
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
                  className="p-1.5 sm:p-2 rounded-lg border border-stone-300 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LuChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 sm:py-12 md:py-16">
            <LuCoffee className="mx-auto text-stone-400 mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-whyte-bold text-stone-900 mb-1.5 sm:mb-2">
              No shops found
            </h3>
            <p className="text-stone-600 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base px-2">
              Try adjusting your filters
            </p>
            <button
              onClick={clearFilters}
              className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors text-xs sm:text-sm md:text-base"
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
