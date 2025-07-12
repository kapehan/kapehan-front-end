import apiService from "../api/apiService"

export const getShops = async (search = "", amenities = [], cities = [], categories = [], priceRange = []) => {
  try {
    // Build query parameters
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (amenities.length > 0) {
      amenities.forEach((amenity) => params.append("amenities", amenity))
    }
    if (cities.length > 0) {
      cities.forEach((city) => params.append("city", city))
    }
    if (categories.length > 0) {
      categories.forEach((category) => params.append("category", category))
    }
    if (priceRange.length === 2) {
      params.append("minPrice", priceRange[0])
      params.append("maxPrice", priceRange[1])
    }

    // Make API request with search, amenities & cities filters
    const response = await apiService.get(`/shops?${params.toString()}`, {
      headers: { "Content-Type": "application/json" },
    })
    console.log("API request params:", params.toString())
    console.log("response", response)

    const { shops } = response.data
    const { pagination } = response.data // Assuming pagination is inside `response.data`

    // Return both shops and pagination
    return { shops, pagination }
  } catch (error) {
    console.error("Error fetching shops:", error)
    return {
      shops: [],
      pagination: { currentPage: 1, totalPages: 0, totalShops: 0 },
      error: error.response?.data?.message || error.message,
    }
  }
}

export async function getShopByName(name) {
  // This is a placeholder for a real API call
  // In a real application, you would use fetch or axios to make a request to your backend API

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Dummy data for demonstration purposes - updated to match the expected structure
  const dummyShops = [
    {
      isFeatured: false,
      _id: "67e9903e842e2dd2c483ffcb",
      name: "Cafe Prince Main",
      description: "A small coffee shop base in Taguigs",
      address: "Block 21 Lot 4 Italy St. EP HOUSING, Residential, Taguig, 1630",
      city: "Taguig",
      phone: "09158956883",
      email: "",
      rating: 5,
      reviewCount: 12,
      price: 1,
      latitude: 14.516781715288587,
      longitude: 121.05376439972552,
      openingHours: {
        monday: {
          open: "12:00",
          close: "20:00",
          closed: false,
        },
        tuesday: {
          open: "12:00",
          close: "20:00",
          closed: false,
        },
        wednesday: {
          open: "12:00",
          close: "20:00",
          closed: false,
        },
        thursday: {
          open: "12:00",
          close: "20:00",
          closed: false,
        },
        friday: {
          open: "12:00",
          close: "20:00",
          closed: false,
        },
        saturday: {
          open: "12:00",
          close: "20:00",
          closed: false,
        },
        sunday: {
          open: "12:00",
          close: "20:00",
          closed: false,
        },
      },
      amenities: {
        wifi: true,
        parking: false,
        powerOutlets: true,
        outdoorSeating: true,
        petFriendly: true,
        accessible: true,
        familyFriendly: true,
        veganOptions: true,
        dineIn: true,
        specialtyCoffee: true,
      },
      socialMedia: {
        facebook: "cafeprince",
        instagram: "cafeprince",
        twitter: "cafeprince",
      },
      categories: [
        "Workspace-Friendly",
        "Aesthetic & Design",
        "Food & Pastries",
        "Music & Vibe",
        "Photo Ops",
        "Study Spot",
        "Outdoor Seating",
        "Coffee Quality",
        "Quick Service",
      ],
      drinks: [
        {
          name: "Spanish Latte",
          description: "",
          sizes: {
            small: {
              price: "",
            },
            medium: {
              price: "120",
            },
            large: {
              price: "135",
            },
          },
          popular: true,
        },
      ],
      foodItems: [
        {
          name: "Velvet Cookie",
          description: "",
          category: "pastry",
          price: "75",
          popular: true,
        },
      ],
      image: "/placeholder.svg?height=200&width=300",
      openNow: true, // Added for convenience
    },
    {
      isFeatured: false,
      _id: "67e9903e842e2dd2c483ffcc",
      name: "Urban Grind",
      description: "Urban Grind offers a modern coffee experience with artisanal pastries and a vibrant atmosphere.",
      address: "456 Main Street, Quezon City",
      city: "Quezon City",
      phone: "09123456789",
      email: "contact@urbangrind.com",
      rating: 4.5,
      reviewCount: 96,
      price: 3,
      latitude: 14.6372,
      longitude: 121.0304,
      openingHours: {
        monday: {
          open: "07:00",
          close: "22:00",
          closed: false,
        },
        tuesday: {
          open: "07:00",
          close: "22:00",
          closed: false,
        },
        wednesday: {
          open: "07:00",
          close: "22:00",
          closed: false,
        },
        thursday: {
          open: "07:00",
          close: "22:00",
          closed: false,
        },
        friday: {
          open: "07:00",
          close: "23:00",
          closed: false,
        },
        saturday: {
          open: "08:00",
          close: "23:00",
          closed: false,
        },
        sunday: {
          open: "08:00",
          close: "21:00",
          closed: false,
        },
      },
      amenities: {
        wifi: true,
        parking: false,
        powerOutlets: true,
        outdoorSeating: true,
        petFriendly: true,
        accessible: true,
        familyFriendly: false,
        veganOptions: true,
        dineIn: true,
        specialtyCoffee: false,
      },
      socialMedia: {
        facebook: "urbangrind",
        instagram: "urbangrindcoffee",
        twitter: "urbangrind",
      },
      categories: ["Aesthetic & Design", "Food & Pastries", "Music & Vibe"],
      drinks: [
        {
          name: "Signature Latte",
          description: "Our house specialty with caramel and vanilla",
          sizes: {
            small: {
              price: "140",
            },
            medium: {
              price: "160",
            },
            large: {
              price: "180",
            },
          },
          popular: true,
        },
      ],
      foodItems: [
        {
          name: "Artisan Croissant",
          description: "Buttery, flaky croissant made fresh daily",
          category: "pastry",
          price: "95",
          popular: true,
        },
      ],
      image: "/placeholder.svg?height=200&width=300",
      openNow: true, // Added for convenience
    },
  ]

  // Find shop by name (case insensitive)
  const shop = dummyShops.find((shop) => shop.name.toLowerCase() === name.toLowerCase())

  return shop || null
}

export async function getShopReviews(shopId) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // This would be replaced with a real API call in production
  // Example: const response = await fetch(`/api/shops/${shopId}/reviews`);
  // return response.json();

  // For now, return dummy data based on shop ID
  if (shopId === "67e9903e842e2dd2c483ffcb") {
    // Reviews for Cafe Prince Main
    return [
      {
        _id: "r1",
        shopId: shopId,
        name: "Sarah Johnson",
        avatar: "",
        rating: 5,
        date: "2023-11-15",
        content:
          "This coffee shop is a hidden gem! The atmosphere is cozy and inviting, perfect for both work and casual meetups. Their Spanish Latte is exceptional - rich flavor without being bitter. The staff is knowledgeable and friendly. Highly recommend!",
      },
      {
        _id: "r2",
        shopId: shopId,
        name: "Michael Chen",
        avatar: "",
        rating: 4,
        date: "2023-10-20",
        content:
          "Great coffee and pastries! The space is well-designed with plenty of seating. WiFi is reliable which makes it perfect for remote work. Only giving 4 stars because it gets quite crowded during peak hours and finding a seat can be challenging.",
      },
    ]
  } else if (shopId === "67e9903e842e2dd2c483ffcc") {
    // Reviews for Urban Grind
    return [
      {
        _id: "r3",
        shopId: shopId,
        name: "Emily Rodriguez",
        avatar: "",
        rating: 5,
        date: "2023-09-05",
        content:
          "I visit Urban Grind at least twice a week. Their Signature Latte is the best in town - smooth and never watered down. The Artisan Croissant is also worth trying! Love the minimalist decor and the plants throughout the space.",
      },
    ]
  }

  // Return empty array for other shops or if no reviews found
  return []
}
