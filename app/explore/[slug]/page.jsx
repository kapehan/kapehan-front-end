"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaArrowLeft,
  FaLeaf,
  FaWifi,
  FaCar,
  FaDog,
  FaWheelchair,
  FaCheckCircle,
  FaHeart,
  FaRegHeart,
  FaCoffee,
  FaCouch,
  FaLaptop,
  FaPalette,
  FaCreditCard,
  FaTruck,
  FaPlug,
  FaSnowflake,
  FaCalendarCheck,
} from "react-icons/fa";
import { IoInformation } from "react-icons/io5";

import Navigation from "../../../components/navigation";
import RatingModal from "../../../components/rating-modal";
import ReviewSection from "../../../components/ReviewSection";
import CoffeeShopCard from "../../../components/CoffeeShopCard";
import Footer from "../../../components/Footer";
import UserAccountModal from "../../../components/UserAccountModal";
import MenuModal from "../../../components/MenuModal";
import FloatingNavigationButton from "./components/FloatingNavigationButton";
import { getCoffeeShopById,getFeaturedCoffeeShops } from "../../../services/coffeeShopService";
import ShopDetailSkeleton from "./loading";
import { useAuth } from "../../../context/authContext";
import FloatingMenuButton from "./components/FloatingMenuButton";
import { normalizeShop } from "./utils/shopNormalizer";
import { toTitleCase } from "./utils/slugUtils";
import { isCurrentlyOpen } from "./utils/timeUtils";
import { LuCoffee } from "react-icons/lu";
import SuggestedCoffeeShops from "../../../components/SuggestedCoffeeShops";

export default function CoffeeShopDetailPage() {
  const params = useParams();
  const shopSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { isAuthenticated } = useAuth();

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [suggestedShops, setSuggestedShops] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [reviewVersion, setReviewVersion] = useState(0);
  const [userHasReview, setUserHasReview] = useState(null);

  // DEBUG: log shop object whenever it updates (helps inspect shapes like latitude/longitude)
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("DEBUG: shop object:", shop);
    }
  }, [shop]);

  const formatDayLabel = (day) => toTitleCase(day);
  const formatCity = (city) => toTitleCase(city);

  const handleFollowClick = () => {
    if (!isAuthenticated) setShowAccountModal(true);
    else setIsFollowing(!isFollowing);
  };

  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      setShowAccountModal(true);
      return;
    }
    if (userHasReview === true) return;
    setShowReviewModal(true);
  };

  const handleLoginSuccess = () => {
    setShowAccountModal(false);
    setReviewVersion((v) => v + 1);
  };

  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true);

      try {
        const res = await getCoffeeShopById(shopSlug);
        const raw = res?.data ?? res;
        if (!raw) {
          setShop(null);
          setLoading(false);
          return;
        }

        const { mismatch, shop: enhancedShop } = normalizeShop(raw, shopSlug);
        if (mismatch) {
          setShop(null);
          setLoading(false);
          return;
        }

        setShop(enhancedShop);
      } catch (error) {
        console.error("Error fetching shop:", error);
        setShop(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
    // eslint-disable-next-line
  }, [shopSlug, reviewVersion]);

  if (loading) return <ShopDetailSkeleton />;

  if (!shop) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center pt-24 md:pt-32">
          <h1 className="text-2xl md:text-3xl font-whyte-bold text-stone-800 mb-4">
            Coffee Shop Not Found
          </h1>
          <p className="text-stone-600 mb-8">
            The coffee shop you're looking for doesn't exist or has been
            removed.
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Explore
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const openNow = shop.openNow !== undefined ? shop.openNow : isCurrentlyOpen(shop.openingHours);

  const amenityIcons = {
    wifi: { icon: FaWifi, label: "Wi‑Fi" },
    parking: { icon: FaCar, label: "Parking" },
    outdoorSeating: { icon: FaLeaf, label: "Outdoor Seating" },
    petFriendly: { icon: FaDog, label: "Pet Friendly" },
    wheelchairAccessible: { icon: FaWheelchair, label: "Accessible" },
  };

  const CuratedRating = ({ icon: Icon, label, rating, notes }) => (
    <div className="bg-white rounded-lg p-3 md:p-4 border border-stone-200 hover:border-stone-300 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Icon className={`h-4 md:h-5 w-4 md:w-5 mr-2 text-stone-600`} />
          <span className="font-whyte-medium text-stone-800 text-xs md:text-sm">
            {label}
          </span>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`h-3 md:h-4 w-3 md:w-4 ${
                i < rating ? "text-amber-400" : "text-stone-200"
              }`}
            />
          ))}
          <span className="ml-1 md:ml-2 text-xs md:text-sm font-whyte-bold text-stone-700">
            {rating}/5
          </span>
        </div>
      </div>
      <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
        {notes}
      </p>
    </div>
  );

  // format "HH:mm" to "h:mm AM/PM"
  const to12Hour = (time) => {
    if (!time || typeof time !== "string") return "";
    const [hStr, mStr] = time.split(":");
    const h = Number(hStr);
    const m = Number(mStr ?? 0);
    if (!Number.isFinite(h) || !Number.isFinite(m)) return time;
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section - Clean and Light */}
      <div className="relative h-[50vh] md:h-[65vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              shop.image || "/placeholder.svg?height=1200&width=1600"
            })`,
            transform: "scale(1.1)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center bg-white/15 backdrop-blur-sm px-3 md:px-4 py-1 rounded-full mb-4 md:mb-6">
                {shop.categories &&
                  shop.categories.slice(0, 2).map((category, index) => (
                    <span
                      key={`${category}-${index}`}
                      className="text-white text-xs md:text-sm font-whyte-medium"
                    >
                      {category}
                      {index < Math.min(shop.categories.length, 2) - 1 && (
                        <span className="mx-2 text-white/40">•</span>
                      )}
                    </span>
                  ))}
                {shop.categories && shop.categories.length > 2 && (
                  <span className="text-white text-xs md:text-sm font-whyte-medium ml-2">
                    +{shop.categories.length - 2}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center mb-4 px-4">
                <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-whyte-bold text-white drop-shadow-lg text-center leading-snug break-words max-w-[min(90vw,900px)]">
                  {shop.name}
                </h1>
                {shop.verified && (
                  <FaCheckCircle className="text-blue-300 text-lg md:text-xl lg:text-2xl mt-2 sm:mt-0 sm:ml-4 drop-shadow-lg" />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-6">
                <div className="flex items-center bg-white/15 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full">
                  <FaStar className="text-amber-300 mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  <span className="text-white font-whyte-medium text-sm md:text-base">
                    {shop.rating}
                  </span>
                  <span className="text-white text-opacity-70 ml-1 text-xs md:text-sm">
                    ({shop.review_count})
                  </span>
                </div>

                <div className="flex items-center bg-white/15 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full">
                  <FaClock className="text-white mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  <span className="text-white text-sm md:text-base">
                    {openNow ? "Open Now" : "Closed"}
                  </span>
                </div>

                <div className="flex items-center bg-white/15 backdrop-blur-sm px-3 md:px-4 py-2 rounded-full">
                  <FaMapMarkerAlt className="text-white mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  <span className="text-white text-sm md:text-base">
                    {formatCity(shop.city || "")}
                  </span>
                </div>

                <button
                  onClick={handleFollowClick}
                  className="flex items-center bg-white/15 backdrop-blur-sm hover:bg-white/25 px-3 md:px-4 py-2 rounded-full transition-colors"
                >
                  {isFollowing ? (
                    <FaHeart className="text-red-300 mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  ) : (
                    <FaRegHeart className="text-white mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  )}
                  <span className="text-white font-whyte-medium text-sm md:text-base">
                    {isFollowing ? "Following" : "Follow"}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-6 md:-mt-12 relative z-10 pb-8 md:pb-16">
        <div className="max-w-6xl mx-auto">
          {/* About Section */}
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden mb-6 md:mb-10">
            <div className="p-4 md:p-8">
              <h2 className="text-base sm:text-lg md:text-xl font-whyte-bold text-stone-900 mb-4 flex items-center gap-2 md:gap-3">
                <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 md:w-9 md:h-9 rounded-full bg-stone-100">
                  <IoInformation className="text-stone-700 text-sm md:text-base" />
                </span>
                <span className="flex items-baseline gap-1 min-w-0">
                  <span className="font-whyte-bold truncate max-w-[70vw] sm:max-w-[55vw] md:max-w-[42vw] lg:max-w-[36vw] xl:max-w-[32vw]">
                    {shop.name}
                  </span>
                </span>
              </h2>

              <p className="text-stone-700 text-base md:text-lg leading-relaxed mb-4">
                {shop.description}
              </p>
              <div className="flex space-x-3">
                {shop.socialMedia?.facebook && (
                  <a
                    href={`https://facebook.com/${shop.socialMedia.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-500 hover:text-stone-700 transition-colors"
                  >
                    <FaFacebook size={18} />
                  </a>
                )}
                {shop.socialMedia?.instagram && (
                  <a
                    href={`https://instagram.com/${shop.socialMedia.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-500 hover:text-stone-700 transition-colors"
                  >
                    <FaInstagram size={18} />
                  </a>
                )}
                {shop.socialMedia?.twitter && (
                  <a
                    href={`https://twitter.com/${shop.socialMedia.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-500 hover:text-stone-700 transition-colors"
                  >
                    <FaTwitter size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-stone-50 rounded-lg shadow-sm border border-stone-200 mb-6 md:mb-10 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-stone-200">
              {/* Payment Methods */}
              <div className="p-4 md:p-5">
                <h3 className="text-xs uppercase tracking-wide font-whyte-bold text-stone-700 mb-3">
                  Payment Methods
                </h3>
                <div className="space-y-2">
                  {shop.paymentMethods && shop.paymentMethods.length > 0 ? (
                    shop.paymentMethods.map((method) => (
                      <div
                        key={method}
                        className="text-sm text-stone-700 flex items-center"
                      >
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2"></span>
                        {method}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-stone-700">Cash accepted</div>
                  )}
                </div>
              </div>

              {/* Hours */}
              <div className="p-4 md:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs uppercase tracking-wide font-whyte-bold text-stone-700">
                    Hours
                  </h3>
                  <div
                    className={`inline-flex text-xs font-whyte-medium px-2 py-1 rounded ${
                      openNow
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {openNow ? "Open" : "Closed"}
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  {(() => {
                    const weekDays = [
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ];
                    const hours = shop.openingHours || {};
                    return weekDays
                      .filter((day) => hours[day])
                      .map((day) => {
                        const h = hours[day];
                        return (
                          <div key={day} className="flex justify-between">
                            <span className="text-stone-600 capitalize font-whyte-medium">
                              {formatDayLabel(day)}
                            </span>
                            {h.closed ? (
                              <span className="text-stone-400">Closed</span>
                            ) : (
                              <span className="text-stone-700">
                                {to12Hour(h.open)} - {to12Hour(h.close)}
                              </span>
                            )}
                          </div>
                        );
                      });
                  })()}
                </div>
              </div>

              {/* Amenities */}
              <div className="p-4 md:p-5">
                <h3 className="text-xs uppercase tracking-wide font-whyte-bold text-stone-700 mb-3">
                  Amenities
                </h3>
                <div className="space-y-2">
                  {shop.amenities &&
                    Object.entries(shop.amenities)
                      .filter(([key, value]) => value && amenityIcons[key])
                      .slice(0, 3)
                      .map(([key, value]) => {
                        const { icon: Icon, label } = amenityIcons[key];
                        return (
                          <div
                            key={key}
                            className="flex items-center text-xs text-stone-700"
                          >
                            <Icon className="h-3 w-3 mr-2 text-stone-500" />
                            {label}
                          </div>
                        );
                      })}
                </div>
              </div>

              {/* Location (remove inline button) */}
              <div className="p-4 md:p-5">
                <h3 className="text-xs uppercase tracking-wide font-whyte-bold text-stone-700 mb-3">
                  Location
                </h3>
                <p className="text-xs text-stone-700 mb-0 leading-relaxed">
                  {shop.address}
                </p>
              </div>
            </div>
          </div>

          {/* Curated Section */}
          {shop.curated && (
            <div className="bg-white rounded-lg shadow-sm border border-stone-300 overflow-hidden mb-6 md:mb-10">
              <div className="bg-stone-50 p-4 md:p-6 border-b border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h2 className="text-lg md:text-xl font-whyte-bold text-stone-900 mb-1 flex items-center">
                      <FaCheckCircle className="text-stone-600 mr-2 h-4 w-4" />
                      Curated Review
                    </h2>
                    <p className="text-stone-600 text-xs md:text-sm">
                      Team reviewed for quality assurance
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="flex items-center justify-center sm:justify-end">
                      <FaStar className="text-amber-400 mr-1 h-4 w-4" />
                      <span className="text-lg md:text-xl font-whyte-bold text-stone-900">
                        {shop.curated.overallRating}
                      </span>
                      <span className="text-stone-600 ml-1 text-sm">/5</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <CuratedRating
                    icon={FaCoffee}
                    label="Coffee Quality"
                    rating={shop.curated.coffeeQuality.rating}
                    notes={shop.curated.coffeeQuality.notes}
                  />
                  <CuratedRating
                    icon={FaCouch}
                    label="Comfortability"
                    rating={shop.curated.comfortability.rating}
                    notes={shop.curated.comfortability.notes}
                  />
                  <CuratedRating
                    icon={FaLaptop}
                    label="Remote Work Friendly"
                    rating={shop.curated.remoteWorkFriendly.rating}
                    notes={shop.curated.remoteWorkFriendly.notes}
                  />
                  <CuratedRating
                    icon={FaPalette}
                    label="Aesthetic Vibe"
                    rating={shop.curated.aestheticVibe.rating}
                    notes={shop.curated.aestheticVibe.notes}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          {shop._id && (
            <ReviewSection
              key={`reviews-${shop._id}-${reviewVersion}`}
              shopId={shop._id}
              slug={shopSlug}
              onWriteReview={handleWriteReviewClick}
              reviewVersion={reviewVersion}
              onUserReviewStatus={(has) => setUserHasReview(has)} // unchanged callback (now sets boolean)
            />
          )}

          {/* You Might Also Like */}
          <SuggestedCoffeeShops
            subtitle={`More coffee shops in ${formatCity(shop.city || "")}`}
            city={shop.city}
          />
        </div>
      </div>

      {/* Floating buttons stacked at bottom-right */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-center gap-2">
        {shop?.latitude && shop?.longitude && (
          <FloatingNavigationButton latitude={shop.latitude} longitude={shop.longitude} />
        )}
        <FloatingMenuButton onClick={() => setShowMenuModal(true)} />
      </div>

      {/* Modals */}
      <RatingModal
        key={`rating-${shop._id || "pending"}`}
        show={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        shopId={shop._id}
        slug={shopSlug}
        onSubmitted={() => setReviewVersion((v) => v + 1)}
        userHasReview={isAuthenticated ? userHasReview === true : false}
      />
      <UserAccountModal
        show={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onLogin={handleLoginSuccess}
      />
      {showMenuModal && (
        <MenuModal shop={shop} slug={shopSlug} onClose={() => setShowMenuModal(false)} />
      )}
      <Footer />
    </div>
  );
}
