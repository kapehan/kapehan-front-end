"use client"
import { motion } from "framer-motion"
import { FaSearch, FaCoffee, FaStar } from "react-icons/fa"

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaSearch className="text-amber-600 text-3xl" />,
      title: "Search & Discover",
      description:
        "Browse our curated collection of Metro Manila's finest coffee shops or search by location, vibe, or amenities.",
    },
    {
      icon: <FaCoffee className="text-amber-600 text-3xl" />,
      title: "Visit & Experience",
      description:
        "Check out menus, photos, and reviews to find your perfect match, then visit and enjoy your coffee experience.",
    },
    {
      icon: <FaStar className="text-amber-600 text-3xl" />,
      title: "Rate & Share",
      description: "Leave your review, share your photos, and help others discover the best coffee spots in the city.",
    },
  ]

  return (
    <section className="bg-[#FAF7F2] py-20 px-4 md:px-12">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-mona-bold text-[#5F4429] mb-4"
        >
          How Kapehan Works
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto font-mona-medium"
        >
          Finding your perfect coffee spot in Metro Manila has never been easier
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#8B5E3B] rounded-full flex items-center justify-center text-white font-mona-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-2xl font-mona-bold text-[#5F4429] mb-3">{step.title}</h3>
              <p className="text-gray-600 font-mona-medium">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
