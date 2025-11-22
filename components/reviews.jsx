"use client"
import { useState } from "react"
import { FaStar, FaThumbsUp, FaRegThumbsUp } from "react-icons/fa"
import { motion } from "framer-motion"

// Dummy review data
const dummyReviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 5,
    date: "2 weeks ago",
    content:
      "This coffee shop is a hidden gem! The atmosphere is cozy and inviting, perfect for both work and casual meetups. Their pour-over coffee is exceptional - rich flavor without being bitter. The staff is knowledgeable and friendly. Highly recommend the house special latte!",
    likes: 12,
    userLiked: false,
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 4,
    date: "1 month ago",
    content:
      "Great coffee and pastries! The space is well-designed with plenty of seating. WiFi is reliable which makes it perfect for remote work. Only giving 4 stars because it gets quite crowded during peak hours and finding a seat can be challenging.",
    likes: 8,
    userLiked: true,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?height=50&width=50",
    rating: 5,
    date: "2 months ago",
    content:
      "I visit this place at least twice a week. Their cold brew is the best in town - smooth and never watered down. The avocado toast is also worth trying! Love the minimalist decor and the plants throughout the space. The baristas are always friendly and remember regular customers.",
    likes: 15,
    userLiked: false,
  },
]

export default function ReviewList() {
  const [reviews, setReviews] = useState(dummyReviews)

  const handleLike = (id) => {
    setReviews(
      reviews.map((review) => {
        if (review.id === id) {
          return {
            ...review,
            likes: review.userLiked ? review.likes - 1 : review.likes + 1,
            userLiked: !review.userLiked,
          }
        }
        return review
      }),
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-start">
            <img
              src={review.avatar || "/placeholder.svg"}
              alt={`${review.name}'s avatar`}
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{review.name}</h3>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>

              <div className="flex items-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} size={16} />
                ))}
              </div>

              <p className="text-gray-700 mb-4">{review.content}</p>

              <button
                onClick={() => handleLike(review.id)}
                className={`flex items-center text-sm ${review.userLiked ? "text-blue-600" : "text-gray-500"} hover:text-blue-600 transition-colors`}
              >
                {review.userLiked ? <FaThumbsUp className="mr-1" /> : <FaRegThumbsUp className="mr-1" />}
                <span>Helpful ({review.likes})</span>
              </button>
            </div>
          </div>
        </motion.div>
      ))}

      <div className="flex justify-center mt-8">
        <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors">
          Load more reviews
        </button>
      </div>
    </div>
  )
}
