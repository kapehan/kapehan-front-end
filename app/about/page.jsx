"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { FaCoffee, FaLeaf, FaUsers } from "react-icons/fa"
import Navigation from "../../components/navigation"

// Team members data
const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    bio: "Coffee enthusiast with over 15 years in the industry. Sarah founded BrewFinder to help people discover amazing coffee shops around the world.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Michael Chen",
    role: "Chief Coffee Officer",
    bio: "Former barista champion with a passion for specialty coffee. Michael personally visits and reviews coffee shops to ensure quality listings.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Content",
    bio: "Food and beverage writer who brings coffee stories to life. Emily manages our blog and creates engaging content about coffee culture.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "David Kim",
    role: "Tech Lead",
    bio: "Software engineer and coffee lover. David built BrewFinder's platform to make finding the perfect coffee shop simple and enjoyable.",
    image: "/placeholder.svg?height=300&width=300",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      {/* Hero Section */}
      <div
        className="relative h-[50vh] bg-cover bg-center"
        style={{ backgroundImage: "url('/placeholder.svg?height=800&width=1600')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60">
          <div className="container mx-auto h-full flex flex-col items-center justify-center text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-whyte-bold text-white mb-4"
            >
              About BrewFinder
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-white mb-6 max-w-2xl"
            >
              Connecting coffee lovers with exceptional coffee shops since 2023
            </motion.p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-whyte-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                BrewFinder began with a simple question: "Where can I find a great cup of coffee?" As avid coffee
                enthusiasts, we found ourselves constantly searching for the perfect coffee shop – whether for a morning
                pick-me-up, a productive work session, or a casual meetup with friends.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We realized that while there were plenty of coffee shops, finding the right one with the perfect
                ambiance, quality beans, and amenities was challenging. That's when the idea for BrewFinder was born – a
                platform dedicated to helping people discover coffee shops that match their specific preferences and
                needs.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Since our launch in 2023, we've grown to feature thousands of coffee shops across the country, each
                personally visited and reviewed by our team. Our mission remains the same: to connect coffee lovers with
                their perfect brew, one cup at a time.
              </p>
            </div>
            <div className="md:w-1/2 relative h-[400px] rounded-xl overflow-hidden shadow-lg">
              <Image src="/placeholder.svg?height=800&width=1200" alt="BrewFinder team" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-whyte-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at BrewFinder.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCoffee className="text-amber-700 text-2xl" />
              </div>
              <h3 className="text-xl font-whyte-bold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600">
                We believe in the importance of exceptional coffee. We only feature shops that meet our high standards
                for bean quality, preparation, and overall experience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaLeaf className="text-amber-700 text-2xl" />
              </div>
              <h3 className="text-xl font-whyte-bold text-gray-900 mb-3">Sustainability</h3>
              <p className="text-gray-600">
                We prioritize coffee shops that demonstrate commitment to sustainable practices, from ethically sourced
                beans to eco-friendly operations.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-amber-700 text-2xl" />
              </div>
              <h3 className="text-xl font-whyte-bold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                We celebrate coffee shops that create welcoming spaces and foster connections within their communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-whyte-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The passionate coffee lovers behind BrewFinder.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div key={index} whileHover={{ y: -10 }} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative h-64">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-whyte-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-amber-600 font-whyte-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-whyte-bold mb-4">Our Impact</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Since our founding, we've made a significant impact on the coffee community.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-whyte-bold text-amber-500 mb-2">5,000+</div>
              <p className="text-gray-300">Coffee Shops Listed</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-whyte-bold text-amber-500 mb-2">250,000+</div>
              <p className="text-gray-300">Monthly Users</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-whyte-bold text-amber-500 mb-2">100+</div>
              <p className="text-gray-300">Cities Covered</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-whyte-bold text-amber-500 mb-2">15,000+</div>
              <p className="text-gray-300">User Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-whyte-bold text-gray-900 mb-4">Our Partners</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're proud to collaborate with these organizations to promote coffee culture.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                <Image
                  src={`/placeholder.svg?height=80&width=200&text=Partner ${index + 1}`}
                  alt={`Partner ${index + 1}`}
                  width={200}
                  height={80}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-amber-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-whyte-bold mb-6">Join the BrewFinder Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're a coffee shop owner or a coffee enthusiast, we'd love to have you be part of our journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="bg-white hover:bg-gray-100 text-amber-800 px-8 py-3 rounded-full font-whyte-medium transition-colors"
            >
              List Your Coffee Shop
            </a>
            <a
              href="#"
              className="bg-transparent hover:bg-amber-700 border-2 border-white text-white px-8 py-3 rounded-full font-whyte-medium transition-colors"
            >
              Become a Reviewer
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
