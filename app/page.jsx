"use client"
import Link from "next/link"
import { allShops } from "../data/dummy-data"
import CoffeeShopCard from "../components/CoffeeShopCard"
import { motion } from "framer-motion"
import SearchBox from "../components/search-box"
import HowItWorks from "../components/HowItWorks"
import PopularCities from "../components/PopularCities"
import OwnerCTA from "../components/OwnerCTA"
import Newsletter from "../components/Newsletter"
import Footer from "../components/Footer"
import Navigation from "../components/navigation"

const Page = () => {
  const featuredShops = [...allShops].sort((a, b) => b.rating - a.rating).slice(0, 4)

  return (
    <>
      <Navigation />

      {/* Hero Section - More Compact and Fancy */}
      <div className="pt-20 bg-gradient-to-br from-stone-50 via-amber-50 to-stone-100 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-stone-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-amber-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-mona-bold text-stone-800 leading-tight mb-6">
                Discover Metro Manila's{" "}
                <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                  Best Coffee
                </span>
              </h1>

              <p className="text-lg md:text-xl text-stone-600 leading-relaxed mb-8 max-w-3xl mx-auto">
                From hidden gems to iconic brews, find your perfect coffee experience with Kapehan
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <SearchBox />
                <Link href="/explore">
                  <button className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                    Explore Now
                  </button>
                </Link>
              </div>

              {/* Simplified Quick Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-3xl md:text-4xl font-mona-bold text-amber-700">500+</div>
                  <div className="text-sm font-mona-medium text-stone-600 mt-1">Coffee Shops</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-3xl md:text-4xl font-mona-bold text-amber-700">50K+</div>
                  <div className="text-sm font-mona-medium text-stone-600 mt-1">Reviews</div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-3xl md:text-4xl font-mona-bold text-amber-700">17</div>
                  <div className="text-sm font-mona-medium text-stone-600 mt-1">Cities</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Featured Coffee Shops */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-mona-bold text-stone-800 mb-4">Featured Coffee Shops</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Discover the highest-rated coffee shops loved by our community
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredShops.map((shop, index) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CoffeeShopCard shop={shop} showDistance={false} />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/explore">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full hover:shadow-lg transition-all duration-300 text-lg font-semibold"
              >
                View All Coffee Shops
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Popular Cities Section */}
      <PopularCities />

      {/* Own a Coffee Shop Section */}
      <OwnerCTA />

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </>
  )
}

export default Page
