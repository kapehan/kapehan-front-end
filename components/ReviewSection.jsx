"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaStar, FaUser, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa"
import { useAuth } from "../context/authContext"
import { getCoffeeShopReviewsBySlug, deleteCoffeeShopReview, updateCoffeeShopReview } from "../services/coffeeShopReviews"
import Review from "./reviews/Review"

export default function ReviewSection({ slug, shopId, onWriteReview, reviewVersion, onUserReviewStatus }) {
  const { user } = useAuth()
  const currentUserId = user?.data?.id || user?.id || null

  const [reviews, setReviews] = useState([])
  const [displayedReviews, setDisplayedReviews] = useState([])
  const [showingCount, setShowingCount] = useState(5)
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [userHasReview, setUserHasReview] = useState(null)
  const [reviewsLoaded, setReviewsLoaded] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false) // existing
  const [deletingId, setDeletingId] = useState(null) // added

  // Add: dynamic initial chunk size based on screen size (fix for ReferenceError)
  const [initialChunk, setInitialChunk] = useState(5)
  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(max-width: 640px)")
    const apply = () => setInitialChunk(mq.matches ? 3 : 5)
    apply()
    // Optional: respond to viewport changes while mounted
    mq.addEventListener?.("change", apply)
    return () => mq.removeEventListener?.("change", apply)
  }, [])

  // Editing state
  const [editingId, setEditingId] = useState(null)
  const [editingContent, setEditingContent] = useState("")
  const [editingRating, setEditingRating] = useState(0)

  // Simplified normalization for payload:
  // {
  //   id, created_at, ratings, remarks, user_id, fullname, username
  // }
  const normalizeReviews = (arr = []) =>
    (Array.isArray(arr) ? arr : []).map(r => ({
      _id: String(r.id),
      userId: r.user_id ? String(r.user_id) : null,
      name: r.username || r.fullname || "User",
      avatar: "/placeholder.svg?height=50&width=50",
      rating: r.ratings == null ? 0 : Number(r.ratings),
      date: r.created_at || new Date().toISOString(),
      content: r.remarks || ""
    }))

  useEffect(() => {
    let cancelled = false

    if (!slug) {
      setReviews([])
      setDisplayedReviews([])
      setTotalCount(0)
      setLoading(false)
      setUserHasReview(false) // treat as no review when no slug
      setReviewsLoaded(true)
      return
    }

    const loadReviews = async () => {
      setLoading(true)
      try {
        const payload = await getCoffeeShopReviewsBySlug(slug, {})
        const listRaw = Array.isArray(payload?.data) ? payload.data : []
        const normalized = normalizeReviews(listRaw)
        const total = (payload?.pageInfo?.total ?? normalized.length) || 0
        if (!cancelled) {
          setReviews(normalized)
          // Use responsive initial chunk size
          setDisplayedReviews(normalized.slice(0, initialChunk))
          setShowingCount(Math.min(initialChunk, normalized.length))
          setTotalCount(total)
          const has = currentUserId ? normalized.some(r => r.userId === String(currentUserId)) : false
          setUserHasReview(has)
          onUserReviewStatus && onUserReviewStatus(has)
        }
      } catch {
        if (!cancelled) {
          setReviews([])
          setDisplayedReviews([])
          setShowingCount(0)
          setTotalCount(0)
          setUserHasReview(false)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
          setReviewsLoaded(true)
        }
      }
    }

    loadReviews()
    return () => { cancelled = true }
  }, [slug, reviewVersion, currentUserId, initialChunk])

  const loadMoreReviews = () => {
    const newCount = Math.min(showingCount + 5, reviews.length)
    setDisplayedReviews(reviews.slice(0, newCount))
    setShowingCount(newCount)
  }

  // Start editing
  const handleEdit = (review) => {
    setEditingId(review._id)
    setEditingContent(review.content)
    setEditingRating(review.rating)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingContent("")
    setEditingRating(0)
  }

  const handleSaveEdit = async () => {
    if (!editingId || !slug || !shopId) return
    setSavingEdit(true)
    const newContent = editingContent.trim()
    const newRating = editingRating
    const prevReviews = reviews
    const prevDisplayed = displayedReviews
    // optimistic update
    setReviews(prev => prev.map(r => r._id === editingId ? { ...r, content: newContent, rating: newRating } : r))
    setDisplayedReviews(prev => prev.map(r => r._id === editingId ? { ...r, content: newContent, rating: newRating } : r))
    try {
      await updateCoffeeShopReview(slug, {
        coffee_shop_id: shopId,
        remarks: newContent,
        ratings: newRating
      })
      // success -> clear editing
      setEditingId(null)
      setEditingContent("")
      setEditingRating(0)
    } catch (e) {
      // rollback
      setReviews(prevReviews)
      setDisplayedReviews(prevDisplayed)
    } finally {
      setSavingEdit(false)
    }
  }

  const handleDelete = async (id) => {
    if (deletingId) return
    setDeletingId(id) // added
    const prevReviews = reviews
    const prevDisplayed = displayedReviews
    setReviews(reviews.filter(r => r._id !== id))
    setDisplayedReviews(displayedReviews.filter(r => r._id !== id))
    setTotalCount(c => Math.max(0, c - 1))
    try {
      await deleteCoffeeShopReview(id)
    } catch (e) {
      setReviews(prevReviews)
      setDisplayedReviews(prevDisplayed)
      setTotalCount(prevReviews.length)
    } finally {
      setDeletingId(null) // clear
    }
    if (editingId === id) {
      setEditingId(null)
      setEditingContent("")
      setEditingRating(0)
    }
  }

  const isStillDetermining = loading && !reviewsLoaded

  if (isStillDetermining) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 sm:mb-6 md:mb-10 border border-stone-200">
        {/* Skeleton stays until userHasReview resolved */}
        <div className="p-3 sm:p-4 md:p-8">
          <div className="h-6 sm:h-8 bg-gray-200 w-1/2 sm:w-1/3 mb-4 sm:mb-6 rounded animate-pulse"></div>
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full mr-3 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-3.5 sm:h-4 bg-gray-200 w-1/3 sm:w-1/4 mb-2 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 w-1/4 sm:w-1/6 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 sm:h-4 bg-gray-200 w-full rounded animate-pulse"></div>
                  <div className="h-3.5 sm:h-4 bg-gray-200 w-3/4 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 sm:mb-6 md:mb-10 border border-stone-200">
      <div className="p-3 sm:p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-whyte-bold text-stone-800 flex items-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-amber-100 flex items-center justify-center mr-2 sm:mr-3">
              <FaStar className="text-amber-600 text-base sm:text-lg md:text-xl" />
            </div>
            Reviews
            <span className="ml-2 text-base sm:text-xl text-stone-500">({totalCount})</span>
          </h2>
          <button
            onClick={userHasReview === false ? onWriteReview : undefined}
            disabled={userHasReview !== false}
            className={`w-auto px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors font-whyte-medium text-sm sm:text-sm md:text-base min-h-[36px] md:min-h-[44px] ${
              userHasReview === false
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-stone-200 text-stone-500 cursor-not-allowed"
            }`}
          >
            {userHasReview === false ? "Write a Review" : "You already reviewed"}
          </button>
        </div>

        {/* Responsive spacing between review items */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {displayedReviews.map((review) => {
            const isOwner =
              !!review.userId && !!currentUserId && String(review.userId) === String(currentUserId)
            const isEditing = editingId === review._id
            return (
              <Review
                key={review._id}
                review={review}
                isOwner={isOwner}
                isEditing={isEditing}
                editingContent={editingContent}
                setEditingContent={setEditingContent}
                editingRating={editingRating}
                setEditingRating={setEditingRating}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
                savingEdit={savingEdit}
                deletingId={deletingId}
              />
            )
          })}
        </div>

        {showingCount < reviews.length && (
          <div className="text-center mt-5 sm:mt-6">
            <button
              onClick={loadMoreReviews}
              className="w-auto bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors font-whyte-medium text-sm sm:text-sm md:text-base min-h-[36px] md:min-h-[44px]"
            >
              Load More Reviews ({Math.max(0, totalCount - showingCount)} remaining)
            </button>
          </div>
        )}

        {totalCount === 0 && (
          <div className="text-center py-6 sm:py-8">
            <FaUser className="mx-auto text-stone-400 mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12" />
            <h3 className="text-base sm:text-lg font-whyte-bold text-stone-800 mb-2">
              No Reviews Yet
            </h3>
            <p className="text-sm sm:text-base text-stone-600 mb-4 sm:mb-6">
              Be the first to share your experience!
            </p>
            <button
              onClick={onWriteReview}
              className="w-auto bg-amber-600 hover:bg-amber-700 text-white px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors font-whyte-medium text-sm sm:text-sm md:text-base min-h-[36px] md:min-h-[44px]"
            >
              Write the First Review
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
