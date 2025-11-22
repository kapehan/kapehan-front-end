"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes, FaStar } from "react-icons/fa"
import { LuCoffee } from "react-icons/lu"
import UserAccountModal from "./UserAccountModal"
import { useAuth } from "../context/authContext"
import { createCoffeeShopReview } from "../services/coffeeShopReviews"

export default function RatingModal({ show, onClose, shopId, slug, onSubmitted, userHasReview }) {
  const { isAuthenticated } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setShowAccountModal(true)
      return
    }
    if (!shopId || !slug || rating === 0) {
      return
    }
    setIsSubmitting(true)
    try {
      await createCoffeeShopReview(slug, { ratings: rating, remarks: review })
      setRating(0)
      setReview("")
      onClose()
      onSubmitted && onSubmitted() // trigger parent refresh logic
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLoginSuccess = () => setShowAccountModal(false)

  // Guard if hidden or no shop id yet
  if (!show || !shopId) return null

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            key={`rating-backdrop-${shopId}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            key={`rating-modal-${shopId}`}
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

            {userHasReview ? (
              <div className="p-6 space-y-4">
                <p className="text-stone-700 text-sm">
                  You have already submitted a review for this coffee shop. Multiple reviews are not allowed.
                </p>
                <button
                  onClick={onClose}
                  className="w-full bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold py-3 rounded-lg transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Star Rating */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">
                    How would you rate this coffee shop?
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={`star-${star}`}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
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
            )}
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Account Modal outside AnimatePresence */}
      <UserAccountModal
        show={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onLogin={handleLoginSuccess}
      />
    </>
  )
}
