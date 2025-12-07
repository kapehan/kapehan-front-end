"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Navigation from "../../components/navigation"
import Footer from "../../components/Footer"
import { LuCalendar, LuUser, LuArrowRight, LuChevronLeft, LuChevronRight } from "react-icons/lu"

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    slug: "best-coffee-shops-makati-2024",
    title: "The Best Coffee Shops in Makati for 2024",
    excerpt:
      "Discover the top coffee destinations in Makati's bustling business district, from artisanal roasters to cozy neighborhood cafés.",
    author: "Maria Santos",
    date: "2024-01-15",
    categories: ["City Guides"],
    image: "/placeholder.svg?height=300&width=500",
    readTime: "5 min read",
  },
  {
    id: 2,
    slug: "coffee-brewing-methods-guide",
    title: "A Complete Guide to Coffee Brewing Methods",
    excerpt:
      "From pour-over to espresso, learn about different brewing methods and how they affect the taste of your coffee.",
    author: "Juan Dela Cruz",
    date: "2024-01-12",
    categories: ["Coffee Education"],
    image: "/placeholder.svg?height=300&width=500",
    readTime: "8 min read",
  },
  {
    id: 3,
    slug: "supporting-local-coffee-farmers",
    title: "Supporting Local Coffee Farmers in the Philippines",
    excerpt:
      "Learn about the importance of supporting local coffee farmers and how your coffee choices can make a difference.",
    author: "Ana Reyes",
    date: "2024-01-10",
    categories: ["Sustainability"],
    image: "/placeholder.svg?height=300&width=500",
    readTime: "6 min read",
  },
  {
    id: 4,
    slug: "coffee-shop-etiquette-guide",
    title: "Coffee Shop Etiquette: A Guide for Everyone",
    excerpt:
      "Essential tips for being a considerate coffee shop customer, from ordering to finding the perfect spot to work.",
    author: "Carlos Mendoza",
    date: "2024-01-08",
    categories: ["Coffee Culture"],
    image: "/placeholder.svg?height=300&width=500",
    readTime: "4 min read",
  },
  {
    id: 5,
    slug: "hidden-gems-quezon-city",
    title: "Hidden Coffee Gems in Quezon City",
    excerpt: "Explore lesser-known coffee shops in QC that serve exceptional brews away from the crowds.",
    author: "Lisa Garcia",
    date: "2024-01-05",
    categories: ["City Guides"],
    image: "/placeholder.svg?height=300&width=500",
    readTime: "7 min read",
  },
  {
    id: 6,
    slug: "coffee-and-productivity",
    title: "Coffee and Productivity: Finding Your Perfect Work Café",
    excerpt:
      "Tips for choosing the right coffee shop for work, including what to look for in WiFi, seating, and atmosphere.",
    author: "Mark Tan",
    date: "2024-01-03",
    categories: ["Lifestyle"],
    image: "/placeholder.svg?height=300&width=500",
    readTime: "5 min read",
  },
  {
    id: 7,
    slug: "third-wave-coffee-philippines",
    title: "The Rise of Third Wave Coffee in the Philippines",
    excerpt: "How specialty coffee culture is transforming the local coffee scene and what it means for coffee lovers.",
    author: "Sarah Kim",
    date: "2024-01-01",
    categories: ["Coffee Education"],
    image: "/placeholder.svg?height=300&width=500",
    readTime: "6 min read",
  },
  {
    id: 8,
    slug: "coffee-shop-design-trends",
    title: "Modern Coffee Shop Design Trends in Metro Manila",
    excerpt: "Exploring the latest interior design trends that are shaping the aesthetic of Manila's coffee shops.",
    author: "David Chen",
    date: "2023-12-28",
    categories: ["Coffee Culture"],
    image: "/placeholder.svg?height=300&width=500",
    readTime: "4 min read",
  },
  {
    id: 9,
    slug: "coffee-roasting-basics",
    title: "Coffee Roasting Basics: Understanding Light, Medium, and Dark Roasts",
    excerpt: "Learn about different roast levels and how they affect the flavor profile of your coffee beans.",
    author: "Roberto Silva",
    date: "2023-12-25",
    categories: ["Coffee Education"],
    image: "/placeholder.svg?height=300&width=500",
    readTime: "6 min read",
  },
  {
    id: 10,
    slug: "manila-coffee-history",
    title: "The History of Coffee Culture in Manila",
    excerpt:
      "Explore how coffee culture evolved in Manila from Spanish colonial times to the modern specialty coffee movement.",
    author: "Elena Vasquez",
    date: "2023-12-22",
    categories: ["Coffee Culture"],
    image: "/placeholder.svg?height=300&width=500",
    readTime: "8 min read",
  },
  {
    id: 11,
    slug: "home-barista-equipment-guide",
    title: "Essential Equipment for the Home Barista",
    excerpt: "A comprehensive guide to building your home coffee setup, from grinders to espresso machines.",
    author: "Michael Torres",
    date: "2023-12-20",
    categories: ["Coffee Education"],
    image: "/placeholder.svg?height=300&width=500",
    readTime: "7 min read",
  },
  {
    id: 12,
    slug: "coffee-shop-wifi-etiquette",
    title: "WiFi Etiquette in Coffee Shops: A Digital Nomad's Guide",
    excerpt: "Best practices for using coffee shops as your remote office while being respectful to other customers.",
    author: "Jessica Park",
    date: "2023-12-18",
    categories: ["Lifestyle"],
    image: "/placeholder.svg?height=300&width=500",
    readTime: "5 min read",
  },
  {
    id: 13,
    slug: "seasonal-coffee-drinks-philippines",
    title: "Seasonal Coffee Drinks Perfect for Philippine Weather",
    excerpt: "Discover refreshing coffee beverages that are perfect for the tropical climate of the Philippines.",
    author: "Carmen Lopez",
    date: "2023-12-15",
    categories: ["Coffee Culture"],
    image: "/placeholder.svg?height=300&width=500",
    readTime: "4 min read",
  },
  {
    id: 14,
    slug: "coffee-shop-photography-tips",
    title: "Instagram-Worthy Coffee Shop Photography Tips",
    excerpt: "Learn how to capture the perfect coffee shop moments for your social media feeds.",
    author: "Alex Rivera",
    date: "2023-12-12",
    categories: ["Lifestyle"],
    image: "/placeholder.svg?height=300&width=500",
    readTime: "6 min read",
  },
  {
    id: 15,
    slug: "fair-trade-coffee-impact",
    title: "The Impact of Fair Trade Coffee on Filipino Farmers",
    excerpt: "Understanding how fair trade certification is changing the lives of coffee farmers in the Philippines.",
    author: "Maria Gonzalez",
    date: "2023-12-10",
    categories: ["Sustainability"],
    image: "/placeholder.svg?height=300&width=500",
    readTime: "7 min read",
  },
]

const categories = ["All", "City Guides", "Coffee Education", "Sustainability", "Coffee Culture", "Lifestyle"]

const POSTS_PER_PAGE = 12

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredPosts, setFilteredPosts] = useState(blogPosts)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Filter posts based on category
  const handleCategoryChange = (category) => {
    setIsLoading(true)
    setSelectedCategory(category)
    setCurrentPage(1) // Reset to first page when category changes

    setTimeout(() => {
      if (category === "All") {
        setFilteredPosts(blogPosts)
      } else {
        setFilteredPosts(blogPosts.filter((post) => post.categories && post.categories.includes(category)))
      }
      setIsLoading(false)
    }, 300)
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Navigation />

      {/* Hero Section - Mobile First */}
      <div className="pt-20 bg-gradient-to-br from-stone-100 to-amber-50">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-whyte-bold text-stone-800 leading-tight mb-4 md:mb-6">
                <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">Blog</span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-stone-600 leading-relaxed">
                Discover the latest in coffee culture, shop reviews, and brewing tips
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Category Filter - Mobile First */}
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-6 md:mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 md:px-4 py-2 rounded-full text-sm font-whyte-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-amber-600 text-white"
                    : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts Grid - Mobile First */}
      <div className="container mx-auto px-4 md:px-6 pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-40 md:h-48 bg-gray-200"></div>
                  <div className="p-4 md:p-6">
                    <div className="h-6 bg-gray-200 w-3/4 mb-3 rounded"></div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-200 w-full rounded"></div>
                      <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
                      <div className="h-4 bg-gray-200 w-1/4 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
                {currentPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative h-40 md:h-48 overflow-hidden">
                        <img
                          src={post.image || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-amber-600 text-white px-2 md:px-3 py-1 rounded-full text-xs font-whyte-medium">
                            {post.categories && post.categories.length > 0 ? post.categories[0] : "General"}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 md:p-6">
                        <h2 className="text-lg md:text-xl font-whyte-bold text-stone-800 mb-2 md:mb-3 line-clamp-2 hover:text-amber-600 transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-stone-600 mb-3 md:mb-4 line-clamp-3 text-sm md:text-base">{post.excerpt}</p>

                        <div className="flex items-center justify-between text-xs md:text-sm text-stone-500 mb-3 md:mb-4">
                          <div className="flex items-center">
                            <LuUser className="mr-1 h-3 md:h-4 w-3 md:w-4" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <LuCalendar className="mr-1 h-3 md:h-4 w-3 md:w-4" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs md:text-sm text-stone-500">{post.readTime}</span>
                          <div className="flex items-center text-amber-600 font-whyte-medium text-sm md:text-base">
                            Read More
                            <LuArrowRight className="ml-1 h-3 md:h-4 w-3 md:w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {/* Pagination - Mobile First */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-1 md:space-x-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LuChevronLeft className="h-4 md:h-5 w-4 md:w-5" />
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-3 md:px-4 py-2 rounded-lg border transition-colors text-sm md:text-base ${
                            currentPage === page
                              ? "bg-amber-600 text-white border-amber-600"
                              : "border-stone-300 hover:bg-stone-100"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-1 md:px-2 text-stone-400 text-sm md:text-base">
                          ...
                        </span>
                      )
                    }
                    return null
                  })}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LuChevronRight className="h-4 md:h-5 w-4 md:w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
