"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Navigation from "../../../components/navigation"
import Footer from "@/components/Footer"

// Sample blog posts data - same as in blog page
const blogPosts = [
  {
    id: 1,
    slug: "best-coffee-shops-makati-2024",
    title: "The Best Coffee Shops in Makati for 2024",
    excerpt:
      "Discover the top coffee destinations in Makati's bustling business district, from artisanal roasters to cozy neighborhood cafés.",
    author: "Maria Santos",
    date: "2024-01-15",
    category: "City Guides",
    image: "/placeholder.svg?height=600&width=1200",
    content: `Makati City, the bustling financial heart of Metro Manila, is home to some of the most exceptional coffee shops in the Philippines. From sleek corporate-friendly spaces to cozy neighborhood gems, the city offers a diverse coffee landscape that caters to every taste and preference.

In this comprehensive guide, we'll explore the top coffee destinations that have been making waves in 2024. Whether you're a busy professional looking for your morning caffeine fix, a remote worker seeking the perfect workspace, or a coffee enthusiast eager to discover new flavors, Makati has something special waiting for you.

Our journey begins in the heart of the Central Business District, where modern coffee chains and independent roasters compete for the attention of discerning coffee lovers. These establishments have elevated the coffee experience beyond just a quick energy boost, transforming it into a ritual of taste, aroma, and ambiance.

The coffee scene in Makati reflects the city's dynamic character – fast-paced yet sophisticated, international yet distinctly Filipino. Many of these coffee shops source their beans directly from local farmers in the mountains of Benguet, Batangas, and other coffee-growing regions, supporting sustainable farming practices while delivering exceptional quality.

What sets Makati's coffee shops apart is their attention to detail and commitment to excellence. From the careful selection of beans to the precision of brewing techniques, these establishments have mastered the art of coffee making. Many feature state-of-the-art equipment operated by skilled baristas who are passionate about their craft.

The atmosphere in these coffee shops is equally impressive. Thoughtfully designed interiors create spaces that are both functional and inspiring, perfect for business meetings, casual conversations, or quiet contemplation. Many offer reliable Wi-Fi, comfortable seating, and extended operating hours to accommodate the city's busy lifestyle.`,
  },
  {
    id: 2,
    slug: "coffee-brewing-methods-guide",
    title: "A Complete Guide to Coffee Brewing Methods",
    excerpt:
      "From pour-over to espresso, learn about different brewing methods and how they affect the taste of your coffee.",
    author: "Juan Dela Cruz",
    date: "2024-01-12",
    category: "Coffee Education",
    image: "/placeholder.svg?height=600&width=1200",
    content: `Coffee brewing is both an art and a science, with each method offering unique characteristics that can dramatically alter the taste, aroma, and overall experience of your cup. Understanding these different techniques will help you appreciate the complexity of coffee and perhaps discover your new favorite brewing method.

The foundation of great coffee starts with quality beans, but the brewing method you choose will ultimately determine how those flavors are extracted and presented. Each technique has its own optimal grind size, water temperature, brewing time, and coffee-to-water ratio, all of which contribute to the final result.

Pour-over methods, such as the V60 and Chemex, offer exceptional control over the brewing process. These techniques allow you to manipulate variables like pour speed, water temperature, and extraction time to highlight specific flavor notes in your coffee. The result is often a clean, bright cup that showcases the coffee's origin characteristics.

Espresso, the foundation of many coffee drinks, uses pressure to force hot water through finely ground coffee in a matter of seconds. This intense extraction method creates a concentrated shot with a rich crema on top. The key to great espresso lies in achieving the perfect balance of grind size, dose, and extraction time.

French press brewing, also known as immersion brewing, involves steeping coarsely ground coffee in hot water for several minutes before pressing down a metal filter. This method produces a full-bodied cup with more oils and sediment, resulting in a richer, more textured drinking experience.

Cold brew has gained popularity for its smooth, less acidic profile. This method involves steeping coarsely ground coffee in cold water for 12-24 hours, creating a concentrate that can be diluted with water or milk. The extended extraction time at low temperatures produces different flavor compounds compared to hot brewing methods.`,
  },
  // Add more blog posts as needed...
]

export default function BlogDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true)
      try {
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Find blog post by slug
        const blogPost = blogPosts.find((p) => p.slug === slug)
        setPost(blogPost)
      } catch (error) {
        console.error("Error fetching blog data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchBlogData()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 w-1/4 mb-4 rounded"></div>
              <div className="h-12 bg-gray-200 w-3/4 mb-6 rounded"></div>
              <div className="h-6 bg-gray-200 w-1/3 mb-8 rounded"></div>
              <div className="h-[400px] bg-gray-200 w-full mb-8 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 w-full rounded"></div>
                <div className="h-4 bg-gray-200 w-full rounded"></div>
                <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // If post not found
  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Story Not Found</h1>
          <p className="text-gray-600 mb-8">The coffee story you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/blog"
            className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            ← Back to Stories
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Back to blog link */}
        <Link href="/blog" className="inline-flex items-center text-amber-600 hover:text-amber-800 mb-8">
          ← Back to all stories
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Category badge */}
          <div className="mb-4">
            <span className="bg-amber-50 text-amber-700 text-sm px-3 py-1 rounded-full font-medium">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>

          {/* Author info */}
          <div className="flex items-center mb-8 pb-8 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-amber-200 bg-gray-200">
              {/* Placeholder for author image */}
            </div>
            <div className="ml-4">
              <p className="font-medium text-gray-900">{post.author}</p>
              <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Featured image */}
          <div className="relative pt-[56.25%] rounded-xl overflow-hidden mb-8">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          </div>

          {/* Article content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8 font-light leading-relaxed">{post.excerpt}</p>

            {post.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
