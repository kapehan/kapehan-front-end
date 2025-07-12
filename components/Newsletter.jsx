"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { LuMail, LuCoffee } from "react-icons/lu"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true)
      setEmail("")
      setIsLoading(false)
    }, 1500)
  }

  return (
    <section className="py-16 md:py-20 px-6 bg-stone-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-amber-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-stone-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-16 h-16 bg-amber-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <LuCoffee className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-mona-bold text-stone-800 mb-4">Stay in the Loop</h2>

          <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto font-mona-medium">
            Get weekly updates on new coffee shops, exclusive reviews, and special offers from your favorite cafés.
          </p>

          {isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-xl p-6"
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-mona-semibold text-stone-800 mb-2">Welcome to the Community!</h3>
              <p className="text-stone-600 font-mona-medium">
                You're all set! Check your inbox for a welcome email with exclusive coffee shop recommendations.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 pl-12 pr-4 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 placeholder-stone-400"
                    required
                  />
                  <LuMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                      Subscribing...
                    </div>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>

              <p className="text-sm text-stone-500 mt-4 font-mona-medium">No spam, unsubscribe at any time. We respect your privacy.</p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
