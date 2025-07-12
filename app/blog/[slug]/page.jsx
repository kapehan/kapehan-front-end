"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Navigation from "../../../components/navigation"
import Footer from "@/components/Footer"
import { getSpecificBlog } from "@/utils/blog-utils"

export default function BlogDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true)
      try {
        // Fetch specific blog post
        const blogPost = await getSpecificBlog(slug)
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
              <p className="text-sm text-gray-500">{post.date}</p>
            </div>
          </div>

          {/* Featured image */}
          <div className="relative pt-[56.25%] rounded-xl overflow-hidden mb-8">
            {/* Using standard img tag instead of Next.js Image */}
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
