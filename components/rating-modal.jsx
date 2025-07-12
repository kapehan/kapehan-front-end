"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes, FaStar } from "react-icons/fa"
import { LuCoffee } from "react-icons/lu"
import AccountModal from "./AccountModal"

export default function RatingModal({ show, onClose, shopId }) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)

  // Mock authentication state - replace with real auth
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setShowAccountModal(true)
      return
    }

    if (rating === 0) {
      alert("Please select a rating")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Here you would normally submit to your API
      console.log("Review submitted:", {
        shopId,
        rating,
        review,
      })

      // Reset form
      setRating(0)
      setReview("")
      onClose()

      // Show success message (you could add a toast notification here)
      alert("Review submitted successfully!")
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("Error submitting review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStarClick = (starRating) => {
    setRating(starRating)
  }

  const handleStarHover = (starRating) => {
    setHoveredRating(starRating)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  if (!show) return null

  // If user is not authenticated, show account modal instead
  if (!isAuthenticated) {
    return (
      <AccountModal
        show={showAccountModal}
        onClose={() => {
          setShowAccountModal(false)
          onClose()
        }}
      />
    )
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-stone-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center">
                <LuCoffee className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-800">Write a Review</h2>
                <p className="text-sm text-stone-600">Share your experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 transition-colors rounded-lg hover:bg-stone-100"
            >
              <FaTimes />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-3">
                How would you rate this coffee shop?
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <FaStar
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoveredRating || rating) ? "text-yellow-400" : "text-stone-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-stone-600 mt-2">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Tell us about your experience (optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
                rows={4}
                placeholder="What did you like about this coffee shop? How was the coffee, service, atmosphere?"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-stone-400 disabled:to-stone-500 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Account Modal for Authentication */}
      <AccountModal show={showAccountModal} onClose={() => setShowAccountModal(false)} />
    </AnimatePresence>
  )
}
