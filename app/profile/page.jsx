"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "../../components/navigation";
import Footer from "../../components/Footer";
import UserAccountModal from "../../components/UserAccountModal";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStar,
  FaEnvelope,
  FaEdit,
  FaCog,
} from "react-icons/fa";
import { LuCoffee } from "react-icons/lu";
import { useAuth } from "../../context/authContext";
import NiceAvatar, { genConfig } from "react-nice-avatar";
import { getCache, setCache } from "../utils/cacheUtils";

export default function ProfilePage() {
  const AVATAR_CACHE_KEY = "profile:avatarConfig";
  const AVATAR_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  const { user, isAuthenticated, loading } = useAuth();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const apiUser = user?.data || {};
  const displayName = apiUser.username || "User";
  const email = apiUser.email || "";
  const joinedRaw = apiUser.created_at;
  const visitedShops = Array.isArray(apiUser.visitedShops) ? apiUser.visitedShops : [];

  // Avatar config caching
  const [avatarConfig, setAvatarConfig] = useState(null);
  useEffect(() => {
    let config = getCache(AVATAR_CACHE_KEY, AVATAR_CACHE_TTL);
    if (!config) {
      config = genConfig();
      setCache(AVATAR_CACHE_KEY, config);
    }
    setAvatarConfig(config);
  }, []);

  // Format helpers
  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  const formatCity = (c) =>
    (c || "")
      .replace(/[_-]+/g, " ")
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

  const getTimeAgo = (dateString) => {
    if (!dateString) return "—";
    const now = new Date();
    const visitDate = new Date(dateString);
    const diffInHours = Math.floor((now - visitDate) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  // Sync editable username
  useEffect(() => {
    setNewUsername(displayName);
  }, [displayName]);

  // Auto open login modal once auth is loading
  useEffect(() => {
    if (!loading && !isAuthenticated) setShowAccountModal(true);
  }, [loading, isAuthenticated]);

  const handleLoginSuccess = () => {
    setShowAccountModal(false);
  };

  const handleUpdateUsername = () => {
    if (newUsername.trim()) {
      // Placeholder for API call to update username
      setEditingUsername(false);
    }
  };

  // Remove cached user details and avatar only after initial auth check
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => {
    if (!authChecked && !loading) setAuthChecked(true);
  }, [loading, authChecked]);

  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      localStorage.removeItem(AVATAR_CACHE_KEY);
    }
  }, [isAuthenticated, authChecked]);

  // ✅ Show loader first while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-32 bg-stone-200 rounded-xl"></div>
              <div className="h-64 bg-stone-200 rounded-xl"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <>
        <div className="min-h-screen bg-white">
          <Navigation />
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-md mx-auto">
              <LuCoffee className="mx-auto text-stone-300 mb-8 h-16 w-16" />
              <h1 className="text-2xl font-whyte-bold text-stone-900 mb-4">
                Sign In to Your Profile
              </h1>
              <p className="text-stone-600 mb-8">
                Access your profile, view your coffee shop visits, and manage your preferences.
              </p>
              <button
                onClick={() => setShowAccountModal(true)}
                className="bg-amber-700 text-white px-8 py-3 rounded-lg font-whyte-bold hover:bg-amber-800 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
          <Footer />
        </div>
        <UserAccountModal
          show={showAccountModal}
          onClose={() => setShowAccountModal(false)}
          onLogin={handleLoginSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      {/* Profile Content */}
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
              <div className="flex gap-6 items-start">
                <div>
                  {/* Use react-nice-avatar, cache config for 24h */}
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border border-stone-200 bg-stone-100 flex items-center justify-center overflow-hidden">
                    {avatarConfig ? (
                      <NiceAvatar
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "1rem", // match rounded-2xl
                          overflow: "hidden",
                        }}
                        {...avatarConfig}
                        shape="square"
                      />
                    ) : (
                      <img
                        src={apiUser.avatar || "/placeholder.svg?height=120&width=120"}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-2xl md:text-4xl font-whyte-bold text-stone-900">
                      {displayName}
                    </h1>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      <FaCog className="text-stone-400 hover:text-stone-600 text-lg" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm text-stone-600">
                    {email && (
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="h-4 w-4 text-stone-400" />
                        <span>{email}</span>
                      </div>
                    )}
                    {apiUser.city && (
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="h-4 w-4 text-stone-400" />
                        <span>{formatCity(apiUser.city)}</span>
                      </div>
                    )}
                    {joinedRaw && (
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="h-4 w-4 text-stone-400" />
                        <span>Joined {formatDate(joinedRaw)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4 mb-12">
              <div className="bg-stone-50 rounded-lg p-6 text-center border border-stone-200">
                <div className="text-3xl font-whyte-bold text-amber-700 mb-2">
                  {visitedShops.length}
                </div>
                <div className="text-xs text-stone-600">Visited Shops</div>
              </div>
              <div className="bg-stone-50 rounded-lg p-6 text-center border border-stone-200">
                <div className="text-3xl font-whyte-bold text-amber-700 mb-2">0</div>
                <div className="text-xs text-stone-600">Reviews</div>
              </div>
              <div className="bg-stone-50 rounded-lg p-6 text-center border border-stone-200">
                <div className="text-3xl font-whyte-bold text-amber-700 mb-2">0</div>
                <div className="text-xs text-stone-600">Favorites</div>
              </div>
            </motion.div>

            {/* Recent Visits */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl font-whyte-bold text-stone-900 mb-6">Recent Visits</h2>
              {visitedShops.length > 0 ? (
                <div className="space-y-3">
                  {visitedShops.map((shop, index) => (
                    <motion.div
                      key={shop.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={`/explore/${(shop.name || "")
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, "")}`}
                      >
                        <div className="flex gap-4 p-4 bg-stone-50 rounded-lg border border-stone-200 hover:border-amber-300 hover:bg-amber-50 transition-all">
                          <img
                            src={shop.image || "/placeholder.svg?height=80&width=100"}
                            alt={shop.name}
                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-whyte-bold text-stone-900 truncate">
                              {shop.name}
                            </h3>
                            {shop.city && (
                              <p className="text-sm text-stone-600 flex items-center gap-1 mt-1">
                                <FaMapMarkerAlt className="h-3 w-3 flex-shrink-0" />
                                {formatCity(shop.city)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="text-right">
                              {shop.rating && (
                                <div className="flex items-center gap-1 justify-end">
                                  <FaStar className="text-yellow-400 h-4 w-4" />
                                  <span className="font-whyte-bold text-stone-800">
                                    {shop.rating}
                                  </span>
                                </div>
                              )}
                              <p className="text-xs text-stone-500">
                                {getTimeAgo(shop.visitedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-stone-50 rounded-lg border border-stone-200">
                  <LuCoffee className="mx-auto text-stone-300 mb-4 h-12 w-12" />
                  <p className="text-stone-600 mb-4">No coffee shops visited yet</p>
                  <Link
                    href="/explore"
                    className="inline-flex items-center text-amber-700 font-whyte-bold hover:text-amber-800"
                  >
                    <LuCoffee className="mr-2 h-4 w-4" />
                    Start Exploring
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-whyte-bold text-stone-900 mb-6">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-whyte-bold text-stone-700 mb-2">
                  Username
                </label>
                {editingUsername ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={handleUpdateUsername}
                      className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-lg font-whyte-medium transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-stone-50 px-4 py-2 rounded-lg border border-stone-200">
                    <span className="text-stone-700">{displayName}</span>
                    <button
                      onClick={() => setEditingUsername(true)}
                      className="text-amber-700 hover:text-amber-800"
                    >
                      <FaEdit />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="w-full mt-6 bg-stone-200 hover:bg-stone-300 text-stone-800 px-4 py-2 rounded-lg font-whyte-medium transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      <Footer />
      <UserAccountModal
        show={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onLogin={handleLoginSuccess}
      />
    </div>
  );
}
