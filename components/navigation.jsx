"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { LuCoffee } from "react-icons/lu";
import NiceAvatar, { genConfig } from "react-nice-avatar";
import { getCache } from "../app/utils/cacheUtils";

import { useAuth } from "../context/authContext";
import UserAccountModal from "./UserAccountModal";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState(null);
  const pathname = usePathname();

  // Pull in loading from auth context to gate rendering
  const { user, isAuthenticated, isAnonymous, login, logout, loading } = useAuth();

  // Unified user display helpers
  const displayName =
    user?.data?.username ||
    user?.username ||
    user?.name ||
    "Account";
  const email =
    user?.data?.email ||
    user?.email ||
    "";

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Find", href: "/find" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleAccountClick = () => {
    if (loading) return;
    // Only toggle dropdown if authenticated; otherwise show modal
    if (isAuthenticated) {
      setShowUserDropdown(!showUserDropdown);
    } else {
      setShowAccountModal(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowUserDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest(".user-dropdown")) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserDropdown]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Read avatarConfig only when authenticated and not loading; clear otherwise
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const cached = getCache?.("profile:avatarConfig");
      setAvatarConfig(cached && typeof cached === "object" ? cached : genConfig());
    } else {
      setAvatarConfig(null);
    }
  }, [isAuthenticated, loading]);

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-stone-200 sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center h-12">
            {/* Logo - responsive sizing */}
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center">
                <LuCoffee className="text-white text-sm sm:text-base" />
              </div>
              <span className="text-sm sm:text-base font-whyte-bold text-[#5F4429] hidden xs:inline">
                Kapehan
              </span>
            </Link>

            {/* Desktop Navigation - hide some items on smaller screens */}
            <div className="hidden lg:flex items-center gap-4 md:gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-xs sm:text-sm font-whyte-medium transition-colors hover:text-amber-600 ${
                    isActive(item.href) ? "text-amber-600" : "text-stone-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Account Section */}
            <div className="hidden md:flex items-center gap-2">
              <div className="relative user-dropdown">
                {loading ? (
                  // Loading state: disabled button with skeleton avatar
                  <button
                    disabled
                    className="flex items-center gap-1.5 sm:gap-2 bg-stone-100 px-2 sm:px-3 py-1.5 rounded-lg opacity-70 cursor-not-allowed text-xs sm:text-sm"
                  >
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden inline-flex bg-stone-200 animate-pulse" />
                    <span className="font-whyte-medium text-stone-500 hidden sm:inline">Loading…</span>
                  </button>
                ) : isAuthenticated ? (
                  // Only show avatar button when authenticated
                  <button
                    onClick={handleAccountClick}
                    className="flex items-center gap-1.5 sm:gap-2 bg-stone-100 hover:bg-stone-200 px-2 sm:px-3 py-1.5 rounded-lg transition-colors text-xs sm:text-sm"
                  >
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden inline-flex flex-shrink-0">
                      {avatarConfig ? (
                        <NiceAvatar style={{ width: 20, height: 20 }} {...avatarConfig} />
                      ) : (
                        <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-stone-200 animate-pulse" />
                      )}
                    </span>
                    <span className="font-whyte-medium text-stone-700 hidden sm:inline truncate max-w-[100px]">
                      {displayName}
                    </span>
                    <FaChevronDown className="text-stone-500 text-xs flex-shrink-0" />
                  </button>
                ) : (
                  // Show Account button only when NOT authenticated
                  <button
                    onClick={handleAccountClick}
                    className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-3 sm:px-4 py-1.5 rounded-lg transition-all duration-300 font-whyte-medium text-xs sm:text-sm whitespace-nowrap"
                  >
                    Account
                  </button>
                )}

                {/* User Dropdown - only show when authenticated AND dropdown is open */}
                <AnimatePresence>
                  {isAuthenticated && showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50"
                    >
                      <div className="px-3 sm:px-4 py-2 border-b border-stone-200">
                        <p className="text-xs sm:text-sm font-whyte-medium text-stone-800 truncate">
                          {displayName}
                        </p>
                        {email && (
                          <p className="text-xs text-stone-500 truncate">
                            {email}
                          </p>
                        )}
                      </div>
                      <Link
                        href="/profile"
                        className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-stone-700 hover:bg-stone-50 flex items-center"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <FaUser className="mr-2 h-3 w-3" />
                        View Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-stone-700 hover:bg-stone-50 flex items-center"
                      >
                        <FaSignOutAlt className="mr-2 h-3 w-3" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 rounded-lg text-stone-600 hover:text-amber-600 hover:bg-stone-100 transition-colors flex-shrink-0"
            >
              {isOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[55] md:hidden"
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-0 left-0 h-full w-full bg-white z-[60] md:hidden overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-3 sm:p-4 border-b border-stone-200 sticky top-0 bg-white">
                  <Link
                    href="/"
                    className="flex items-center gap-1.5 flex-shrink-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center">
                      <LuCoffee className="text-white text-sm" />
                    </div>
                    <span className="text-sm font-whyte-bold text-[#5F4429]">
                      Kapehan
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-stone-600 hover:text-amber-600 hover:bg-stone-100 transition-colors flex-shrink-0"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="p-3 sm:p-4 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block text-sm sm:text-base font-whyte-medium transition-colors hover:text-amber-600 py-2 px-2 rounded-lg ${
                        isActive(item.href)
                          ? "text-amber-600 bg-amber-50"
                          : "text-stone-600"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Account Section */}
                  <div className="pt-3 border-t border-stone-200">
                    {loading ? (
                      // Mobile loading state
                      <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                        <span className="w-10 h-10 rounded-full overflow-hidden inline-flex flex-shrink-0 bg-stone-200 animate-pulse" />
                        <p className="text-xs sm:text-sm font-whyte-medium text-stone-500">Loading…</p>
                      </div>
                    ) : isAuthenticated ? (
                      // Authenticated user section
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                          <span className="w-10 h-10 rounded-full overflow-hidden inline-flex flex-shrink-0">
                            {avatarConfig ? (
                              <NiceAvatar style={{ width: 40, height: 40 }} {...avatarConfig} />
                            ) : (
                              <span className="w-10 h-10 rounded-full bg-stone-200 animate-pulse" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-whyte-medium text-stone-800 truncate">
                              {displayName}
                            </p>
                            {email && (
                              <p className="text-xs text-stone-500 truncate">
                                {email}
                              </p>
                            )}
                          </div>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setIsOpen(false)}
                          className="w-full text-left px-3 py-2 text-xs sm:text-sm text-stone-700 hover:bg-stone-50 rounded-lg flex items-center"
                        >
                          <FaUser className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
                          View Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-xs sm:text-sm text-stone-700 hover:bg-stone-50 rounded-lg flex items-center"
                        >
                          <FaSignOutAlt className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
                          Logout
                        </button>
                      </div>
                    ) : (
                      // Not authenticated - show Account button only
                      <button
                        onClick={() => {
                          if (!loading) {
                            setShowAccountModal(true);
                            setIsOpen(false);
                          }
                        }}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-2.5 rounded-lg transition-all duration-300 font-whyte-medium text-xs sm:text-sm"
                      >
                        Account
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Account Modal */}
      <UserAccountModal
        show={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onLogin={(userData) => {
          login(userData);
          setShowAccountModal(false);
        }}
      />
    </>
  );
}
