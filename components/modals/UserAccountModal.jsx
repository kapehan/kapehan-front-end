"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaUserTag,
} from "react-icons/fa";
import { LuCoffee } from "react-icons/lu";
import metroManilaCities from "../../data/metro-manila-cities.json";
import { createAccount, loginAccount } from "../../utils/auth-utils";
import { useAuth } from "../../context/authContext";
import SuccessModal from "./SuccessModal";

const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalContent = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, type: "spring" } },
  exit: { opacity: 0, scale: 0.95, y: 40, transition: { duration: 0.2 } },
};

export default function UserAccountModal({ show, onClose }) {
  const { login } = useAuth();

  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeLoading, setWelcomeLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    location: "",
    email: "",
    password: "",
    confirmPassword: "",
    loginEmail: "",
    loginPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const result = await createAccount({
          name: formData.name,
          username: formData.username,
          location: formData.location,
          email: formData.email,
          password: formData.password,
        });
        login(result.user);
        setShowWelcome(true);
        resetForm();
        return;
      } else {
        const result = await loginAccount({
          email: formData.loginEmail,
          password: formData.loginPassword,
        });
        login(result.user);
        resetForm();
        onClose();
        window.location.reload();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      location: "",
      email: "",
      password: "",
      confirmPassword: "",
      loginEmail: "",
      loginPassword: "",
    });
    setError("");
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={modalBackdrop}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      >
        {/* Backdrop */}
        <motion.div
          variants={modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal - responsive sizing */}
        <motion.div
          variants={modalContent}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative bg-white rounded-lg sm:rounded-2xl shadow-2xl w-full max-w-sm md:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        >
          {showWelcome ? (
            <SuccessModal
              show={showWelcome}
              title="Welcome to Kapehan!"
              description={
                <>
                  Your profile has been created successfully.<br />
                  Enjoy discovering the best coffee shops!
                </>
              }
              buttonText="Continue"
              loading={welcomeLoading}
              onClose={() => {
                setWelcomeLoading(true);
                setTimeout(() => {
                  setWelcomeLoading(false);
                  setShowWelcome(false);
                  onClose();
                  window.location.reload();
                }, 900);
              }}
            />
          ) : (
            <>
              {/* Header - responsive padding and sizing */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-stone-200"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <LuCoffee className="text-white text-sm sm:text-lg" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg md:text-xl font-whyte-bold text-stone-800 truncate">
                      {isSignUp ? "Join Kapehan" : "Welcome Back"}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 truncate">
                      {isSignUp ? "Create your account" : "Sign in to your account"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 text-stone-400 hover:text-stone-600 transition-colors rounded-lg hover:bg-stone-100 flex-shrink-0"
                >
                  <FaTimes size={16} />
                </button>
              </motion.div>

              {/* Error Message - responsive padding */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mx-3 sm:mx-4 md:mx-6 mt-3 sm:mt-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-xs sm:text-sm text-red-600">{error}</p>
                </motion.div>
              )}

              {/* Form - responsive padding and spacing */}
              <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                {isSignUp ? (
                  <>
                    {/* Sign Up Form */}
                    <div className="space-y-3 sm:space-y-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs sm:text-sm font-whyte-medium text-stone-700 mb-1.5 sm:mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                      </div>

                      {/* Username */}
                      <div>
                        <label className="block text-xs sm:text-sm font-whyte-medium text-stone-700 mb-1.5 sm:mb-2">
                          Username
                        </label>
                        <div className="relative">
                          <FaUserTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                            placeholder="Choose a username"
                            required
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-xs sm:text-sm font-whyte-medium text-stone-700 mb-1.5 sm:mb-2">
                          Location
                        </label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-3.5 w-3.5 sm:h-4 sm:w-4 pointer-events-none z-10" />
                          <select
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white appearance-none"
                            required
                          >
                            <option value="">Select your city</option>
                            {metroManilaCities.map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-xs sm:text-sm font-whyte-medium text-stone-700 mb-1.5 sm:mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                            placeholder="Enter your email address"
                            required
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-xs sm:text-sm font-whyte-medium text-stone-700 mb-1.5 sm:mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                            placeholder="Create a password"
                            required
                          />
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-xs sm:text-sm font-whyte-medium text-stone-700 mb-1.5 sm:mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                            placeholder="Confirm your password"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Sign In Form */}
                    <div className="space-y-3 sm:space-y-4">
                      {/* Email */}
                      <div>
                        <label className="block text-xs sm:text-sm font-whyte-medium text-stone-700 mb-1.5 sm:mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <input
                            type="email"
                            name="loginEmail"
                            value={formData.loginEmail}
                            onChange={handleInputChange}
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-xs sm:text-sm font-whyte-medium text-stone-700 mb-1.5 sm:mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          <input
                            type="password"
                            name="loginPassword"
                            value={formData.loginPassword}
                            onChange={handleInputChange}
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                            placeholder="Enter your password"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Button - responsive sizing */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2.5 sm:py-3 px-4 rounded-lg font-whyte-bold text-sm sm:text-base hover:shadow-lg transition-all duration-300 mt-4 sm:mt-6 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading
                    ? isSignUp
                      ? "Creating Account..."
                      : "Signing In..."
                    : isSignUp
                    ? "Create Account"
                    : "Sign In"}
                </button>

                {/* Toggle Mode - responsive sizing */}
                <div className="text-center pt-3 sm:pt-4 border-t border-stone-200">
                  <p className="text-xs sm:text-sm text-stone-600">
                    {isSignUp
                      ? "Already have an account?"
                      : "Don't have an account?"}{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-amber-600 hover:text-amber-700 font-whyte-medium transition-colors"
                    >
                      {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                  </p>
                </div>

                {isSignUp && (
                  <p className="text-xs text-stone-500 text-center mt-3 sm:mt-4">
                    By creating an account, you agree to our Terms of Service and
                    Privacy Policy.
                  </p>
                )}
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}