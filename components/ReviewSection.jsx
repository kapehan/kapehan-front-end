"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaStar, FaUser, FaEdit, FaThumbsUp } from "react-icons/fa"
import { LuCoffee } from "react-icons/lu"

// Mock reviews data - replace with real API
const mockReviews = [
  {
    id: 1,
    user: "Sarah Johnson",
    rating: 5,
    date: "2024-01-15",
    comment:
      "Amazing coffee and cozy atmosphere! Perfect for working remotely. The baristas are super friendly and knowledgeable about their beans.",
    helpful: 12,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    user: "Mike Chen",
    rating: 4,
    date: "2024-01-10",
    comment:
      "Great coffee quality and nice ambiance. Gets a bit crowded during lunch hours but overall a solid choice for coffee lovers.",
    helpful: 8,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    user: "Emma Rodriguez",
    rating: 5,
    date: "2024-01-08",
    comment:
      "Love this place! The specialty drinks are creative and delicious. WiFi is reliable and there are plenty of power outlets.",
    helpful: 15,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    user: "David Kim",
    rating: 4,
    date: "2024-01-05",
    comment:
      "Solid coffee shop with good vibes. The pastries are fresh and the coffee is consistently good. Great spot for meetings.",
    helpful: 6,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    user: "Lisa Wong",
    rating: 5,
    date: "2024-01-03",
    comment:
      "One of my favorite coffee shops in the area. The latte art is beautiful and the staff always remembers my order.",
    helpful: 10,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    user: "Carlos Santos",
    rating: 4,
    date: "2024-01-01",
    comment:
      "Good coffee and comfortable seating. The music isn't too loud which makes it perfect for studying or working.",
    helpful: 7,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    user: "Anna Martinez",
    rating: 5,
    date: "2023-12-28",
    comment:
      "Excellent service and amazing coffee! The cold brew is particularly good. Will definitely be coming back.",
    helpful: 9,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    user: "John Taylor",
    rating: 3,
    date: "2023-12-25",
    comment: "Decent coffee but can get quite noisy during peak hours. The location is convenient though.",
    helpful: 4,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const REVIEWS_PER_PAGE = 5

export default function ReviewSection({ shopId, onWriteReview }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("newest")
  const [displayedReviews, setDisplayedReviews] = useState(REVIEWS_PER_PAGE)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    // Simulate API call
    const fetchReviews = async () => {
      setLoading(true)
      try {
        // In real app, fetch reviews for specific shopId
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setReviews(mockReviews)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [shopId])

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date) - new Date(a.date)
      case "oldest":
        return new Date(a.date) - new Date(b.date)
      case "highest":
        return b.rating - a.rating
      case "lowest":
        return a.rating - b.rating
      case "helpful":
        return b.helpful - a.helpful
      default:
        return 0
    }
  })

  const handleLoadMore = async () => {
    setLoadingMore(true)
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    setDisplayedReviews((prev) => Math.min(prev + REVIEWS_PER_PAGE, reviews.length))
    setLoadingMore(false)
  }

  const averageRating =
    reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage:
      reviews.length > 0 ? (reviews.filter((review) => review.rating === rating).length / reviews.length) * 100 : 0,
  }))

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 md:mb-10">
        <div className="p-4 md:p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 w-1/3 mb-6 rounded"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 w-1/4 mb-2 rounded"></div>
                      <div className="h-3 bg-gray-200 w-1/6 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 w-full rounded"></div>
                    <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 md:mb-10">
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-mona-bold text-[#5F4429] mb-4 sm:mb-0 flex items-center">
            <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
              <LuCoffee className="text-amber-600 text-lg md:text-xl" />
            </div>
            Reviews ({reviews.length})
          </h2>

          <button
            onClick={onWriteReview}
            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-300 font-mona-medium text-sm md:text-base flex items-center justify-center w-full sm:w-auto"
          >
            <FaEdit className="mr-2 h-4 w-4" />
            Write a Review
          </button>
        </div>

        {reviews.length > 0 ? (
          <>
            {/* Rating Summary - Mobile Optimized */}
            <div className="bg-stone-50 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Average Rating */}
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-2">
                    <span className="text-3xl md:text-4xl font-mona-bold text-stone-800 mr-2">{averageRating}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`h-5 md:h-6 w-5 md:w-6 ${
                            i < Math.floor(averageRating) ? "text-yellow-400" : "text-stone-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-stone-600 text-sm md:text-base">Based on {reviews.length} reviews</p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center text-sm">
                      <span className="w-8 text-stone-600">{rating}★</span>
                      <div className="flex-1 mx-3 bg-stone-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-stone-600 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort Options - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
              <h3 className="text-lg font-mona-semibold text-stone-800">Customer Reviews</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-white w-full sm:w-auto"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>

            {/* Reviews List - Mobile Optimized */}
            <div className="space-y-4 md:space-y-6">
              {sortedReviews.slice(0, displayedReviews).map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border border-stone-200 rounded-xl p-4 md:p-6 hover:shadow-md transition-shadow"
                >
                  {/* Review Header - Mobile Optimized */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 md:mb-4">
                    <div className="flex items-center mb-3 sm:mb-0">
                      <img
                        src={review.avatar || "/placeholder.svg"}
                        alt={review.user}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 border-2 border-stone-200"
                      />
                      <div>
                        <h4 className="font-mona-semibold text-stone-800 text-sm md:text-base">{review.user}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`h-3 md:h-4 w-3 md:w-4 ${
                                  i < review.rating ? "text-yellow-400" : "text-stone-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-stone-500 text-xs md:text-sm">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-stone-700 leading-relaxed mb-4 text-sm md:text-base">{review.comment}</p>

                  {/* Review Actions - Mobile Optimized */}
                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-stone-500 hover:text-stone-700 transition-colors text-sm">
                        <FaThumbsUp className="h-3 w-3" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                    <span className="text-stone-400 text-xs">{Math.floor(Math.random() * 30) + 1} days ago</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More Button - Mobile Optimized */}
            {displayedReviews < reviews.length && (
              <div className="text-center mt-6 md:mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-stone-100 hover:bg-stone-200 disabled:opacity-50 text-stone-700 px-6 py-3 rounded-lg transition-colors font-mona-medium text-sm md:text-base w-full sm:w-auto"
                >
                  {loadingMore ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-stone-700"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </div>
                  ) : (
                    `Load More Reviews (${reviews.length - displayedReviews} remaining)`
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          /* No Reviews State - Mobile Optimized */
          <div className="text-center py-8 md:py-12">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-stone-400 text-2xl md:text-3xl" />
            </div>
            <h3 className="text-xl md:text-2xl font-mona-semibold text-stone-800 mb-2">No reviews yet</h3>
            <p className="text-stone-600 mb-6 text-sm md:text-base px-4">
              Be the first to share your experience at this coffee shop!
            </p>
            <button
              onClick={onWriteReview}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-lg transition-all duration-300 font-mona-medium text-sm md:text-base w-full sm:w-auto max-w-xs"
            >
              Write the First Review
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
