// Dummy data for coffee shops
const dummyCoffeeShops = [
  {
    _id: "1",
    name: "Brew Haven Coffee",
    address: "123 Coffee Lane, Brewville",
    distance: 0.8,
    rating: 4.7,
    reviewCount: 128,
    price: 2, // 1-4 scale
    image: "/placeholder.svg?height=200&width=300",
    categories: ["Specialty Coffee", "Breakfast", "Workspace"],
    openNow: true,
    hours: "7:00 AM - 8:00 PM",
    amenities: {
      wifi: true,
      parking: true,
      powerOutlets: true,
      outdoorSeating: true,
      petFriendly: false,
    },
    description:
      "A cozy coffee shop with a wide variety of specialty coffee and a great atmosphere for working or relaxing.",
  },
  {
    _id: "2",
    name: "Urban Grind",
    address: "456 Main Street, Downtown",
    distance: 1.2,
    rating: 4.5,
    reviewCount: 96,
    price: 3,
    image: "/placeholder.svg?height=200&width=300",
    categories: ["Coffee Shop", "Bakery", "Lunch"],
    openNow: true,
    hours: "6:30 AM - 7:00 PM",
    amenities: {
      wifi: true,
      parking: false,
      powerOutlets: true,
      outdoorSeating: true,
      petFriendly: true,
    },
    description:
      "Urban Grind offers a modern coffee experience with artisanal pastries and a vibrant atmosphere in the heart of downtown.",
  },
  {
    _id: "3",
    name: "Espresso Express",
    address: "789 Quick Avenue, Fasttown",
    distance: 0.5,
    rating: 4.2,
    reviewCount: 64,
    price: 1,
    image: "/placeholder.svg?height=200&width=300",
    categories: ["Quick Service", "Coffee", "Pastries"],
    openNow: true,
    hours: "5:00 AM - 6:00 PM",
    amenities: {
      wifi: true,
      parking: true,
      powerOutlets: false,
      outdoorSeating: false,
      petFriendly: false,
    },
    description:
      "Get your coffee fix fast at Espresso Express, where quality meets convenience for coffee lovers on the go.",
  },
  {
    _id: "4",
    name: "The Coffee Collective",
    address: "101 Community Road, Socialville",
    distance: 1.5,
    rating: 4.8,
    reviewCount: 156,
    price: 3,
    image: "/placeholder.svg?height=200&width=300",
    categories: ["Artisan Coffee", "Brunch", "Community Space"],
    openNow: true,
    hours: "7:30 AM - 9:00 PM",
    amenities: {
      wifi: true,
      parking: true,
      powerOutlets: true,
      outdoorSeating: true,
      petFriendly: true,
    },
    description:
      "The Coffee Collective is more than just a coffee shop—it's a community hub where people gather to enjoy exceptional coffee and meaningful connections.",
  },
  {
    _id: "5",
    name: "Morning Brew",
    address: "222 Sunrise Blvd, Earlytown",
    distance: 2.1,
    rating: 4.3,
    reviewCount: 87,
    price: 2,
    image: "/placeholder.svg?height=200&width=300",
    categories: ["Breakfast", "Coffee", "Sandwiches"],
    openNow: false,
    hours: "6:00 AM - 2:00 PM",
    amenities: {
      wifi: true,
      parking: true,
      powerOutlets: true,
      outdoorSeating: false,
      petFriendly: false,
    },
    description:
      "Start your day right at Morning Brew, where we serve fresh coffee and delicious breakfast options in a warm, welcoming environment.",
  },
  {
    _id: "6",
    name: "Artisan Coffee Lab",
    address: "333 Craft Street, Artville",
    distance: 1.8,
    rating: 4.9,
    reviewCount: 112,
    price: 4,
    image: "/placeholder.svg?height=200&width=300",
    categories: ["Specialty Coffee", "Coffee Tasting", "Roastery"],
    openNow: true,
    hours: "8:00 AM - 6:00 PM",
    amenities: {
      wifi: true,
      parking: false,
      powerOutlets: true,
      outdoorSeating: true,
      petFriendly: false,
    },
    description:
      "Artisan Coffee Lab is where science meets art. We meticulously roast our beans in-house and offer coffee education through regular tasting events.",
  },
]

// Function to get all coffee shops
export async function getShops(filters = {}) {
  // This will be replaced with an axios call in the future
  // Example: const response = await axios.get('/api/coffee-shops', { params: filters });
  // return response.data;

  // For now, return dummy data with optional filtering
  let shops = [...dummyCoffeeShops]

  // Apply filters if provided
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase()
    shops = shops.filter(
      (shop) => shop.name.toLowerCase().includes(searchTerm) || shop.address.toLowerCase().includes(searchTerm),
    )
  }

  if (filters.categories && filters.categories.length > 0) {
    shops = shops.filter((shop) => shop.categories.some((category) => filters.categories.includes(category)))
  }

  if (filters.cities && filters.cities.length > 0) {
    shops = shops.filter((shop) => {
      const shopCity = shop.address.split(", ").pop()
      return filters.cities.includes(shopCity)
    })
  }

  if (filters.amenities && filters.amenities.length > 0) {
    shops = shops.filter((shop) => {
      return filters.amenities.every((amenity) => shop.amenities[amenity])
    })
  }

  return shops
}

// Function to get a coffee shop by name slug
export async function getCoffeeShopBySlug(slug) {
  // This will be replaced with an axios call in the future
  // Example: const response = await axios.get(`/api/coffee-shops/slug/${slug}`);
  // return response.data;

  // Convert slug to name format for comparison
  const nameFromSlug = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

  // Find shop by name (case insensitive)
  return dummyCoffeeShops.find((shop) => shop.name.toLowerCase() === nameFromSlug.toLowerCase()) || null
}

// Function to get details for a specific coffee shop by ID
export async function getCoffeeShopDetails(id) {
  // This will be replaced with an axios call in the future
  // Example: const response = await axios.get(`/api/coffee-shops/${id}`);
  // return response.data;

  // For now, return dummy data for the specified ID
  return dummyCoffeeShops.find((shop) => shop._id === id) || null
}

// Function to get reviews for a specific coffee shop
export async function getReviewShop(shopId) {
  // This will be replaced with an axios call in the future
  // Example: const response = await axios.get(`/api/coffee-shops/${shopId}/reviews`);
  // return response.data;

  // For now, return dummy reviews
  return [
    {
      _id: "r1",
      shopId: shopId,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=50&width=50",
      rating: 5,
      date: "2023-11-15",
      content:
        "This coffee shop is a hidden gem! The atmosphere is cozy and inviting, perfect for both work and casual meetups. Their pour-over coffee is exceptional - rich flavor without being bitter. The staff is knowledgeable and friendly. Highly recommend the house special latte!",
    },
    {
      _id: "r2",
      shopId: shopId,
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=50&width=50",
      rating: 4,
      date: "2023-10-20",
      content:
        "Great coffee and pastries! The space is well-designed with plenty of seating. WiFi is reliable which makes it perfect for remote work. Only giving 4 stars because it gets quite crowded during peak hours and finding a seat can be challenging.",
    },
    {
      _id: "r3",
      shopId: shopId,
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=50&width=50",
      rating: 5,
      date: "2023-09-05",
      content:
        "I visit this place at least twice a week. Their cold brew is the best in town - smooth and never watered down. The avocado toast is also worth trying! Love the minimalist decor and the plants throughout the space. The baristas are always friendly and remember regular customers.",
    },
  ]
}
