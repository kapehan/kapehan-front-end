"use client"
import { motion } from "framer-motion"
import { FaStore, FaArrowRight, FaCoffee, FaUsers, FaHeart } from "react-icons/fa"
import Link from "next/link"

const OwnerCTA = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-white border-t border-stone-200">
      <div className="max-w-6xl mx-auto">
        {/* Header - responsive spacing and sizing */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-whyte-bold text-stone-900 mb-3 sm:mb-4 md:mb-6">
              Grow Your Coffee Business
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-stone-600 max-w-2xl mx-auto font-whyte px-2">
              Join Kapehan and connect with coffee lovers across the Philippines. It's completely free and takes just 5
              minutes to get started.
            </p>
          </motion.div>
        </div>

        {/* Grid - responsive layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8"
          >
            {/* Benefit Card 1 */}
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaUsers className="text-amber-700 text-base sm:text-lg md:text-xl" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-whyte-bold text-stone-900 mb-1 sm:mb-2">
                  Reach Coffee Enthusiasts
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-stone-600">
                  Connect with people actively searching for new coffee experiences.
                </p>
              </div>
            </div>

            {/* Benefit Card 2 */}
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaStore className="text-amber-700 text-base sm:text-lg md:text-xl" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-whyte-bold text-stone-900 mb-1 sm:mb-2">
                  Showcase Your Space
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-stone-600">
                  Highlight what makes your coffee shop unique with photos and detailed information.
                </p>
              </div>
            </div>

            {/* Benefit Card 3 */}
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaHeart className="text-amber-700 text-base sm:text-lg md:text-xl" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-whyte-bold text-stone-900 mb-1 sm:mb-2">
                  Build Community
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-stone-600">
                  Be part of the growing coffee community and culture.
                </p>
              </div>
            </div>

            {/* CTA - responsive button and text */}
            <div className="pt-2 sm:pt-4">
              <Link href="/list">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center bg-amber-700 text-white px-5 sm:px-8 py-2.5 sm:py-4 rounded-lg font-whyte-bold hover:bg-amber-800 transition-colors duration-300 text-sm sm:text-base"
                >
                  <FaStore className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  List Your Coffee Shop
                  <FaArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </motion.button>
              </Link>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 sm:mt-3">
                100% free • No hidden fees • 5 minute setup
              </p>
            </div>
          </motion.div>

          {/* Right - Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-stone-50 rounded-lg sm:rounded-lg md:rounded-xl shadow-sm p-5 sm:p-6 md:p-8 border border-stone-200">
              <div className="text-center">
                {/* Icon - responsive sizing */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <FaCoffee className="text-amber-700 text-2xl sm:text-3xl" />
                </div>

                {/* Heading and description - responsive sizing */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-whyte-bold text-stone-900 mb-2 sm:mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-stone-600 mb-5 sm:mb-8">
                  Join the growing community of coffee shops on Kapehan and start connecting with your next customers
                  today.
                </p>

                {/* Stats - responsive grid and sizing */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-stone-200">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-whyte-bold text-amber-700">Free</div>
                    <div className="text-xs sm:text-sm text-stone-500 mt-1">Always</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-whyte-bold text-amber-700">5min</div>
                    <div className="text-xs sm:text-sm text-stone-500 mt-1">Setup</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-whyte-bold text-amber-700">24/7</div>
                    <div className="text-xs sm:text-sm text-stone-500 mt-1">Visible</div>
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
