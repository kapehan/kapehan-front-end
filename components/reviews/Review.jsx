"use client"
import { motion } from "framer-motion"
import { FaStar, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa"

export default function Review({
  review,
  isOwner,
  isEditing,
  editingContent,
  setEditingContent,
  editingRating,
  setEditingRating,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  savingEdit,
  deletingId
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-white rounded-xl shadow-sm p-6 mb-4 border border-stone-200"
    >
      <div className="flex items-start">
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
          <img
            src={review.avatar || "/placeholder.svg?height=50&width=50"}
            alt={review.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between mb-2">
            <h3 className="font-whyte-bold text-stone-800">
              {review.name}
              {isOwner && (
                <span className="ml-2 text-xs px-2 py-1 rounded bg-amber-100 text-amber-700">
                  You
                </span>
              )}
            </h3>
            <span className="text-sm text-stone-500">
              {new Date(review.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, i) => {
              const filled = i < (isEditing ? editingRating : review.rating)
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!isEditing}
                  onClick={() => isEditing && setEditingRating(i + 1)}
                  className={isEditing ? "cursor-pointer" : "cursor-default"}
                >
                  <FaStar
                    className={filled ? "text-yellow-400" : "text-stone-300"}
                    size={16}
                  />
                </button>
              )
            })}
          </div>
          {!isEditing && (
            <p className="text-stone-700 whitespace-pre-line mb-4">{review.content}</p>
          )}
          {isEditing && (
            <textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              rows={4}
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4"
              placeholder="Update your review..."
            />
          )}
          {isOwner && (
            <div className="flex flex-wrap items-center gap-1 mt-2">
              {!isEditing && (
                <>
                  <button
                    onClick={() => !savingEdit && deletingId !== review._id && onEdit(review)}
                    title="Edit"
                    disabled={savingEdit || deletingId === review._id}
                    className="h-8 w-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-amber-100 text-stone-500 hover:text-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300 disabled:opacity-50"
                  >
                    <FaEdit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => !savingEdit && deletingId !== review._id && onDelete(review._id)}
                    title="Delete"
                    disabled={savingEdit || deletingId === review._id}
                    className={`h-8 w-8 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 ${
                      deletingId === review._id
                        ? "bg-red-500 text-white cursor-not-allowed"
                        : "bg-red-50 text-red-500 hover:bg-red-100"
                    } disabled:opacity-50`}
                  >
                    {deletingId === review._id ? (
                      <span className="inline-block h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaTrash className="h-4 w-4" />
                    )}
                  </button>
                </>
              )}
              {isEditing && (
                <>
                  <button
                    onClick={!savingEdit ? onSave : undefined}
                    title="Save"
                    disabled={savingEdit}
                    className={`h-8 w-8 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 ${
                      savingEdit
                        ? "bg-green-400 text-white cursor-not-allowed"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                  >
                    {savingEdit ? (
                      <span className="inline-block h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaCheckCircle className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={!savingEdit ? onCancel : undefined}
                    title="Cancel"
                    disabled={savingEdit}
                    className="h-8 w-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
                  >
                    <FaTimesCircle className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
