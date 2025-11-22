"use client"
import { motion } from "framer-motion"
import { FaStore, FaArrowRight, FaCoffee, FaUsers, FaHeart } from "react-icons/fa"
import Link from "next/link"

const OwnerCTA = () => {
  return (
    <section className="py-20 px-4 md:px-8 bg-white border-t border-stone-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">Grow Your Coffee Business</h2>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
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
              <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaUsers className="text-amber-700 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">Reach Coffee Enthusiasts</h3>
                <p className="text-stone-600">
                  Connect with people actively searching for new coffee experiences in Metro Manila.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaStore className="text-amber-700 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">Showcase Your Space</h3>
                <p className="text-stone-600">
                  Highlight what makes your coffee shop unique with photos and detailed information.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaHeart className="text-amber-700 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">Build Community</h3>
                <p className="text-stone-600">Be part of Metro Manila's growing coffee community and culture.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/list">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center bg-amber-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-amber-800 transition-colors duration-300"
                >
                  <FaStore className="mr-2" />
                  List Your Coffee Shop
                  <FaArrowRight className="ml-2" />
                </motion.button>
              </Link>
              <p className="text-sm text-stone-500 mt-3">100% free • No hidden fees • 5 minute setup</p>
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
            <div className="bg-stone-50 rounded-lg shadow-sm p-8 border border-stone-200">
              <div className="text-center">
                <div className="w-20 h-20 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <FaCoffee className="text-amber-700 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-4">Ready to Get Started?</h3>
                <p className="text-stone-600 mb-8">
                  Join the growing community of coffee shops on Kapehan and start connecting with your next customers
                  today.
                </p>

                {/* Simple stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-700">Free</div>
                    <div className="text-sm text-stone-500">Always</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-700">5min</div>
                    <div className="text-sm text-stone-500">Setup</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-700">24/7</div>
                    <div className="text-sm text-stone-500">Visible</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default OwnerCTA
