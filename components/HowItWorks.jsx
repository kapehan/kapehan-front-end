"use client"
import { motion } from "framer-motion"
import { FaSearch, FaCoffee, FaStar } from "react-icons/fa"

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaSearch className="text-amber-600 text-2xl sm:text-3xl" />,
      title: "Search & Discover",
      description:
        "Browse our curated collection of finest coffee shops or search by location, vibe, or amenities.",
    },
    {
      icon: <FaCoffee className="text-amber-600 text-2xl sm:text-3xl" />,
      title: "Visit & Experience",
      description:
        "Check out menus, photos, and reviews to find your perfect match, then visit and enjoy your coffee experience.",
    },
    {
      icon: <FaStar className="text-amber-600 text-2xl sm:text-3xl" />,
      title: "Rate & Share",
      description: "Leave your review, share your photos, and help others discover the best coffee spots in the city.",
    },
  ]

  return (
    <section className="bg-[#FAF7F2] py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-whyte-bold text-stone-900 mb-3 sm:mb-4"
        >
          How Kapehan Works
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs sm:text-sm md:text-base lg:text-lg text-stone-600 mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto font-whyte px-2"
        >
          Finding your perfect coffee spot has never been easier
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="flex flex-col items-center"
            >
              {/* Icon Container - responsive sizing */}
              <div className="relative mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-amber-100 flex items-center justify-center">
                  {step.icon}
                </div>

                {/* Badge - responsive sizing */}
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-stone-800 rounded-full flex items-center justify-center text-white font-whyte-bold text-xs sm:text-sm">
                  {index + 1}
                </div>
              </div>

              {/* Title - responsive sizing */}
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-whyte-bold text-stone-900 mb-2 sm:mb-3">
                {step.title}
              </h3>

              {/* Description - responsive sizing */}
              <p className="text-xs sm:text-sm md:text-base text-stone-600 font-whyte leading-relaxed px-1">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
