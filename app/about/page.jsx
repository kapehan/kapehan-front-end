"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCoffee, FaLeaf, FaUsers } from "react-icons/fa";
import NiceAvatar, { genConfig } from "react-nice-avatar";
import Navigation from "../../components/navigation";
import Footer from "../../components/Footer";
// Team members data
const teamMembers = [
  {
    name: "Mark Lester Caletina",
    role: "Founder & CEO",
    bio: "A guy who likes coffee his coffee sweet.",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Jonas Tulang",
    role: "Co Founder & Coffee Specialist",
    bio: "A guy who likes coffee his coffee sweet.",
    image: "/placeholder.svg?height=300&width=300",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      {/* Hero Section */}
      <div
        className="relative h-[50vh] bg-cover bg-center"
        style={{
          backgroundImage: "url('/placeholder.svg?height=800&width=1600')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60">
          <div className="container mx-auto h-full flex flex-col items-center justify-center text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-whyte-bold text-white mb-4"
            >
              About Kapehan
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-white mb-6 max-w-2xl"
            >
              Connecting you to coffee that matters
            </motion.p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-whyte-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Kapehan started with a simple question: “Where can I find good
                coffee?” As coffee lovers, we were always looking for cafés with
                great coffee, a nice vibe, and the right amenities for work or
                hanging out with friends.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We realized it wasn’t easy to find the perfect spot, so we
                created Kapehan — a place to help people discover coffee shops
                that match their needs.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Since we started in 2025, we’ve grown to feature many coffee
                shops across the Philippines, all personally checked and
                reviewed by our team. Our goal is simple: to help coffee lovers
                find their perfect cup, every time.
              </p>
            </div>
            <div className="md:w-1/2 relative h-[400px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/placeholder.svg?height=800&width=1200"
                alt="BrewFinder team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-whyte-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at Kapehan, helping coffee
              lovers find the best cafés and experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCoffee className="text-amber-700 text-2xl" />
              </div>
              <h3 className="text-xl font-whyte-bold text-gray-900 mb-3">
                Coffee Experience
              </h3>
              <p className="text-gray-600">
                We highlight cafés that serve great coffee and offer a memorable
                experience, whether it’s the quality of the beans, the brewing,
                or the vibe of the space.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaLeaf className="text-amber-700 text-2xl" />
              </div>
              <h3 className="text-xl font-whyte-bold text-gray-900 mb-3">
                Support Local
              </h3>
              <p className="text-gray-600">
                We believe in supporting coffee shops that care for their
                community, from sourcing locally to creating spaces where people
                feel welcome.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-amber-700 text-2xl" />
              </div>
              <h3 className="text-xl font-whyte-bold text-gray-900 mb-3">
                Connection
              </h3>
              <p className="text-gray-600">
                We celebrate cafés that bring people together, whether it’s
                friends, colleagues, or strangers bonding over a great cup of
                coffee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-whyte-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate coffee lovers behind BrewFinder.
            </p>
          </div>

          <div className="mx-auto max-w-[640px] md:max-w-[660px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden w-full text-center"
                >
                  {/* Avatar (male) via react-nice-avatar */}
                  <div className="pt-6 flex items-center justify-center">
                    <div className="w-20 h-20 md:w-24 md:h-24">
                      <NiceAvatar
                        style={{ width: "100%", height: "100%" }}
                        {...genConfig({ sex: "man" })}
                      />
                    </div>
                  </div>
                  <div className="p-6 pt-4">
                    <h3 className="text-xl font-whyte-bold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-amber-600 font-whyte-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      {/* <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-whyte-bold mb-4">Our Impact</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Since our founding, we've made a significant impact on the coffee
              community.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-whyte-bold text-amber-500 mb-2">
                5,000+
              </div>
              <p className="text-gray-300">Coffee Shops Listed</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-whyte-bold text-amber-500 mb-2">
                250,000+
              </div>
              <p className="text-gray-300">Monthly Users</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-whyte-bold text-amber-500 mb-2">
                100+
              </div>
              <p className="text-gray-300">Cities Covered</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-whyte-bold text-amber-500 mb-2">
                15,000+
              </div>
              <p className="text-gray-300">User Reviews</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Partners */}
      {/* <section className="py-16 bg-white">
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
      </section> */}
      <Footer />
    </div>
  );
}
