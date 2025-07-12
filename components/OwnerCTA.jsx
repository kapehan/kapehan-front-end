"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { FaStore, FaArrowRight, FaCoffee, FaUsers, FaHeart } from "react-icons/fa"
import OwnerAccountModal from "./OwnerAccountModal"
import SuccessModal from "./SuccessModal"

const OwnerCTA = () => {
  const [showOwnerModal, setShowOwnerModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleOwnerSuccess = () => {
    setShowSuccessModal(true)
  }

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-br from-stone-50 to-amber-50 relative overflow-hidden">
      {/* Simple decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-stone-200/20 rounded-full -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center bg-amber-100 text-amber-800 text-sm px-4 py-2 rounded-full font-mona-medium mb-6">
              <FaCoffee className="mr-2" />
              For Coffee Shop Owners
            </div>
            <h2 className="text-4xl md:text-5xl font-mona-bold text-stone-800 mb-6">Grow Your Coffee Business</h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto font-mona-medium">
              Join Kapehan and connect with coffee lovers across Metro Manila. It's completely free and takes just 5
              minutes to get started.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaUsers className="text-amber-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-mona-semibold text-stone-800 mb-2">Reach Coffee Enthusiasts</h3>
                <p className="text-stone-600 font-mona-medium">
                  Connect with people actively searching for new coffee experiences in Metro Manila.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaStore className="text-emerald-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-mona-semibold text-stone-800 mb-2">Showcase Your Space</h3>
                <p className="text-stone-600 font-mona-medium">
                  Highlight what makes your coffee shop unique with photos and detailed information.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaHeart className="text-rose-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-mona-semibold text-stone-800 mb-2">Build Community</h3>
                <p className="text-stone-600 font-mona-medium">Be part of Metro Manila's growing coffee community and culture.</p>
              </div>
            </div>

            <div className="pt-4">
              <motion.button
                onClick={() => setShowOwnerModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-4 rounded-xl font-mona-semibold hover:shadow-lg transition-all duration-300"
              >
                <FaStore className="mr-2" />
                List Your Coffee Shop
                <FaArrowRight className="ml-2" />
              </motion.button>
              <p className="text-sm text-stone-500 mt-3 font-mona-medium">100% free • No hidden fees • 5 minute setup</p>
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-stone-200">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FaCoffee className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-mona-bold text-stone-800 mb-4">Ready to Get Started?</h3>
                <p className="text-stone-600 mb-8 font-mona-medium">
                  Join the growing community of coffee shops on Kapehan and start connecting with your next customers
                  today.
                </p>

                {/* Simple stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200">
                  <div className="text-center">
                    <div className="text-2xl font-mona-bold text-amber-600">Free</div>
                    <div className="text-sm text-stone-500 font-mona-medium">Always</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-mona-bold text-amber-600">5min</div>
                    <div className="text-sm text-stone-500 font-mona-medium">Setup</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-mona-bold text-amber-600">24/7</div>
                    <div className="text-sm text-stone-500 font-mona-medium">Visible</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Owner Account Modal */}
      <OwnerAccountModal
        show={showOwnerModal}
        onClose={() => setShowOwnerModal(false)}
        onSuccess={handleOwnerSuccess}
      />

      {/* Success Modal */}
      <SuccessModal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </section>
  )
}

export default OwnerCTA
