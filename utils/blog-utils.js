// Mock blog data - replace with real API calls
const mockBlogPosts = [
  {
    id: 1,
    slug: "best-coffee-shops-makati-2024",
    title: "The Best Coffee Shops in Makati for 2024",
    excerpt:
      "Discover the top coffee destinations in Makati's bustling business district, from artisanal roasters to cozy neighborhood cafés.",
    content: `Makati's coffee scene has exploded in recent years, with new specialty coffee shops opening every month. From third-wave coffee pioneers to cozy neighborhood cafes, the city offers something for every coffee lover.

The rise of specialty coffee in Makati can be traced back to the early 2010s, when local roasters began sourcing high-quality beans directly from Filipino farmers. This farm-to-cup movement has not only improved coffee quality but also supported local agriculture.

Today's Makati coffee shops are more than just places to grab a quick caffeine fix. They're community hubs, co-working spaces, and cultural centers that reflect the city's dynamic spirit. Whether you're looking for the perfect flat white or a unique Filipino coffee experience, Makati's coffee scene has you covered.`,
    author: "Maria Santos",
    date: "2024-01-15",
    category: "City Guides",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "5 min read",
    featured: true,
  },
  {
    id: 2,
    slug: "coffee-brewing-methods-guide",
    title: "A Complete Guide to Coffee Brewing Methods",
    excerpt:
      "From pour-over to espresso, learn about different brewing methods and how they affect the taste of your coffee.",
    content: `Brewing great coffee at home doesn't have to be complicated. With the right knowledge and equipment, anyone can make cafe-quality coffee in their own kitchen.

The pour-over method is perfect for beginners who want to understand the fundamentals of coffee extraction. Using a V60 or Chemex, you can control every aspect of the brewing process and learn how different variables affect taste.

French press brewing offers a completely different approach, emphasizing immersion and full extraction. This method is forgiving and produces a rich, full-bodied cup that highlights the coffee's natural oils and flavors.

For those who prefer convenience without sacrificing quality, the AeroPress provides a middle ground. It's quick, easy to clean, and produces consistently good results with minimal technique required.

Espresso brewing is more advanced but offers the foundation for many popular coffee drinks. While it requires specialized equipment, mastering espresso opens up a world of possibilities for home baristas.`,
    author: "Juan Dela Cruz",
    date: "2024-01-12",
    category: "Coffee Education",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "8 min read",
    featured: false,
  },
  {
    id: 3,
    slug: "supporting-local-coffee-farmers",
    title: "Supporting Local Coffee Farmers in the Philippines",
    excerpt:
      "Learn about the importance of supporting local coffee farmers and how your coffee choices can make a difference.",
    content: `The Philippines has a long and rich coffee history, with several indigenous varieties that offer unique flavor experiences. Filipino coffee beans are gaining recognition worldwide for their distinctive characteristics and quality.

Barako coffee, grown primarily in Batangas, is known for its strong, bold flavor and full body. This Liberica variety has been cultivated in the Philippines for over a century and remains a favorite among local coffee enthusiasts.

Sagada coffee, grown in the mountain province, offers a different experience with its bright acidity and complex flavor notes. The high altitude and cool climate of the Cordillera mountains create ideal conditions for producing exceptional Arabica beans.

Supporting local farmers through direct trade relationships ensures fair compensation and encourages sustainable farming practices. Many Filipino coffee cooperatives have achieved fair trade certification, providing better livelihoods for farming communities.`,
    author: "Ana Reyes",
    date: "2024-01-10",
    category: "Sustainability",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 4,
    slug: "coffee-shop-etiquette-guide",
    title: "Coffee Shop Etiquette: A Guide for Everyone",
    excerpt:
      "Essential tips for being a considerate coffee shop customer, from ordering to finding the perfect spot to work.",
    content: `Coffee shop etiquette is about creating a welcoming environment for everyone. Whether you're grabbing a quick coffee or settling in for a work session, following these guidelines helps maintain the positive atmosphere that makes coffee shops special.

When ordering, be patient and kind to baristas. They're skilled professionals who take pride in their craft. If you're unsure about menu items, don't hesitate to ask questions - most baristas are happy to share their knowledge.

For those working in coffee shops, be mindful of space and noise levels. Use headphones for calls and videos, and don't monopolize tables during busy periods. Remember that coffee shops are businesses, so make purchases regularly if you're staying for extended periods.

Cleanliness is everyone's responsibility. Clean up after yourself, push in chairs when leaving, and dispose of trash properly. These small actions contribute to a pleasant environment for all customers.`,
    author: "Carlos Mendoza",
    date: "2024-01-08",
    category: "Coffee Culture",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "4 min read",
    featured: false,
  },
  {
    id: 5,
    slug: "hidden-gems-quezon-city",
    title: "Hidden Coffee Gems in Quezon City",
    excerpt: "Explore lesser-known coffee shops in QC that serve exceptional brews away from the crowds.",
    content: `Quezon City's coffee scene extends far beyond the popular chains and well-known specialty shops. Hidden throughout the city's diverse neighborhoods are small, independent coffee shops that offer unique experiences and exceptional coffee.

In the quiet streets of Teacher's Village, you'll find cozy cafes that cater to the academic community. These spots often feature locally roasted beans and provide peaceful environments perfect for studying or quiet conversations.

The emerging food districts in areas like Maginhawa and Tomas Morato hide several coffee gems. These shops often experiment with unique brewing methods and offer creative coffee-based drinks that you won't find elsewhere.

Many of these hidden gems are family-owned businesses that have been serving their communities for years. They offer a more personal touch and often become gathering places for locals who appreciate quality coffee and genuine hospitality.`,
    author: "Lisa Garcia",
    date: "2024-01-05",
    category: "City Guides",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 6,
    slug: "coffee-and-productivity",
    title: "Coffee and Productivity: Finding Your Perfect Work Café",
    excerpt:
      "Tips for choosing the right coffee shop for work, including what to look for in WiFi, seating, and atmosphere.",
    content: `Finding the perfect coffee shop for productive work requires more than just good coffee. The ideal work café balances ambiance, amenities, and atmosphere to create an environment where you can focus and be productive.

WiFi quality is crucial for remote work. Look for shops that offer reliable, high-speed internet and have backup connections. Many modern coffee shops also provide power outlets at every table, eliminating the anxiety of a dying laptop battery.

Seating variety accommodates different work styles. Some people prefer communal tables for a collaborative feel, while others need quiet corners for focused work. The best work cafes offer both options along with comfortable chairs that support long work sessions.

Noise levels significantly impact productivity. While some people thrive in bustling environments, others need quieter spaces. Pay attention to the shop's acoustics and typical crowd to find what works best for your concentration style.`,
    author: "Mark Tan",
    date: "2024-01-03",
    category: "Lifestyle",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "5 min read",
    featured: true,
  },
  {
    id: 7,
    slug: "third-wave-coffee-philippines",
    title: "The Rise of Third Wave Coffee in the Philippines",
    excerpt: "How specialty coffee culture is transforming the local coffee scene and what it means for coffee lovers.",
    content: `The third wave coffee movement has taken root in the Philippines, transforming how Filipinos think about and consume coffee. This movement treats coffee as an artisanal craft rather than just a commodity, emphasizing quality, origin, and brewing technique.

Local roasters are leading this transformation by establishing direct relationships with Filipino coffee farmers. This farm-to-cup approach ensures better quality control and fair compensation for farmers while educating consumers about coffee origins and processing methods.

Specialty coffee shops now focus on single-origin beans, precise brewing methods, and skilled baristas who can explain the nuances of different coffees. This educational approach helps customers develop more sophisticated palates and appreciation for quality coffee.

The movement has also sparked innovation in coffee processing and farming techniques. Filipino coffee producers are experimenting with different fermentation methods and processing techniques to create unique flavor profiles that showcase the country's diverse coffee terroir.`,
    author: "Sarah Kim",
    date: "2024-01-01",
    category: "Coffee Education",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 8,
    slug: "coffee-shop-design-trends",
    title: "Modern Coffee Shop Design Trends in Metro Manila",
    excerpt: "Exploring the latest interior design trends that are shaping the aesthetic of Manila's coffee shops.",
    content: `Coffee shop design in Metro Manila has evolved dramatically, with owners recognizing that ambiance is just as important as the quality of coffee served. The latest trends focus on creating spaces that are both functional and inspiring.

Biophilic design is gaining popularity, incorporating natural elements like living walls, wooden furniture, and abundant natural light. These elements create a calming environment that encourages customers to stay longer and return regularly.

Industrial aesthetics combined with warm touches create spaces that feel both modern and welcoming. Exposed brick walls, metal fixtures, and concrete floors are softened with comfortable seating, warm lighting, and carefully chosen artwork.

Flexible spaces that can adapt to different uses throughout the day are becoming standard. Modular furniture allows areas to be reconfigured for morning commuters, afternoon workers, and evening social gatherings.

Technology integration is becoming seamless, with wireless charging stations, high-speed WiFi, and mobile ordering systems enhancing the customer experience without overwhelming the space.`,
    author: "David Chen",
    date: "2023-12-28",
    category: "Coffee Culture",
    image: "/placeholder.svg?height=400&width=600",
    readTime: "4 min read",
    featured: false,
  },
]

// Get all blog posts
export const getAllBlogs = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockBlogPosts
}

// Get specific blog post by slug
export const getSpecificBlog = async (slug) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const post = mockBlogPosts.find((post) => post.slug === slug)
  if (!post) {
    throw new Error("Blog post not found")
  }

  return post
}

// Get featured blog posts
export const getFeaturedBlogs = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockBlogPosts.filter((post) => post.featured)
}

// Get blog posts by category
export const getBlogsByCategory = async (category) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockBlogPosts.filter((post) => post.category === category)
}

// Get recent blog posts
export const getRecentBlogs = async (limit = 5) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockBlogPosts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit)
}
