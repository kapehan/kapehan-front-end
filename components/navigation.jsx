"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FaBars, FaTimes, FaSignOutAlt, FaChevronDown } from "react-icons/fa"
import { LuCoffee } from "react-icons/lu"
import AccountModal from "./AccountModal"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const pathname = usePathname()

  // Mock authentication state - replace with real auth
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  // Mock user data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setUser({
        name: "John Doe",
        email: "john@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      })
    } else {
      setUser(null)
    }
  }, [isAuthenticated])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Find", href: "/find" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const handleAccountClick = () => {
    if (isAuthenticated) {
      setShowUserDropdown(!showUserDropdown)
    } else {
      setShowAccountModal(true)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setShowUserDropdown(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest(".user-dropdown")) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showUserDropdown])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-stone-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-12">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center">
                <LuCoffee className="text-white text-base" />
              </div>
              <span className="text-base font-bold text-[#5F4429]">Kapehan</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-amber-600 ${
                    isActive(item.href) ? "text-amber-600" : "text-stone-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Account Section */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Account Button/User Dropdown */}
              <div className="relative user-dropdown">
                {isAuthenticated ? (
                  <button
                    onClick={handleAccountClick}
                    className="flex items-center space-x-2 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <img src={user?.avatar || "/placeholder.svg"} alt={user?.name} className="w-5 h-5 rounded-full" />
                    <span className="text-sm font-medium text-stone-700">{user?.name}</span>
                    <FaChevronDown className="text-stone-500 text-xs" />
                  </button>
                ) : (
                  <button
                    onClick={handleAccountClick}
                    className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-1.5 rounded-lg transition-all duration-300 font-medium text-sm"
                  >
                    Account
                  </button>
                )}

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isAuthenticated && showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-stone-200 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-stone-200">
                        <p className="text-sm font-medium text-stone-800">{user?.name}</p>
                        <p className="text-xs text-stone-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 flex items-center"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 rounded-lg text-stone-600 hover:text-amber-600 hover:bg-stone-100 transition-colors"
            >
              {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Full Screen Overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-[55] md:hidden"
                onClick={() => setIsOpen(false)}
              />

              {/* Mobile Menu */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-0 left-0 h-full w-full bg-white z-[60] md:hidden"
              >
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-stone-200">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                    <div className="w-7 h-7 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center">
                      <LuCoffee className="text-white text-base" />
                    </div>
                    <span className="text-base font-bold text-[#5F4429]">Kapehan</span>
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg text-stone-600 hover:text-amber-600 hover:bg-stone-100 transition-colors"
                  >
                    <FaTimes size={18} />
                  </button>
                </div>

                {/* Mobile Navigation Items */}
                <div className="p-4 space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block text-base font-medium transition-colors hover:text-amber-600 py-2 ${
                        isActive(item.href) ? "text-amber-600" : "text-stone-600"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Mobile Account Section */}
                  <div className="pt-3 border-t border-stone-200">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-stone-50 rounded-lg">
                          <img
                            src={user?.avatar || "/placeholder.svg"}
                            alt={user?.name}
                            className="w-7 h-7 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-stone-800">{user?.name}</p>
                            <p className="text-xs text-stone-500">{user?.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-lg flex items-center"
                        >
                          <FaSignOutAlt className="mr-2" />
                          Logout
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setShowAccountModal(true)
                          setIsOpen(false)
                        }}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 py-2.5 rounded-lg transition-all duration-300 font-medium text-sm"
                      >
                        Account
                      </button>
                    )}

                    {/* Testing Authentication Toggle - Mobile Only */}
                    <button
                      onClick={() => setIsAuthenticated(!isAuthenticated)}
                      className="w-full mt-3 bg-blue-500 text-white px-3 py-2 rounded text-xs"
                    >
                      {isAuthenticated ? "Logout Test" : "Login Test"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Account Modal */}
      <AccountModal show={showAccountModal} onClose={() => setShowAccountModal(false)} />
    </>
  )
}
