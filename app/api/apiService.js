// Simple API service for making HTTP requests
const apiService = {
  get: async (url, options = {}) => {
    try {
      // For demo purposes, simulate API response
      console.log(`GET request to ${url} with options:`, options)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Parse query parameters
      const queryParams = new URLSearchParams(url.split("?")[1])
      const search = queryParams.get("search") || ""
      const amenities = queryParams.getAll("amenities")
      const cities = queryParams.getAll("city")
      const categories = queryParams.getAll("category")
      const minPrice = queryParams.get("minPrice")
      const maxPrice = queryParams.get("maxPrice")

      // Dummy data
      const allShops = [
        {
          _id: "1",
          name: "Brew Haven Coffee",
          address: "123 Coffee Lane, Makati",
          distance: 0.8,
          rating: 4.7,
          reviewCount: 128,
          price: 2,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Workspace-Friendly", "Coffee Quality", "Study Spot"],
          openNow: true,
          hours: "7:00 AM - 8:00 PM",
          amenities: {
            wifi: true,
            parking: true,
            powerOutlets: true,
            outdoorSeating: true,
            petFriendly: false,
          },
        },
        {
          _id: "2",
          name: "Urban Grind",
          address: "456 Main Street, Quezon City",
          distance: 1.2,
          rating: 4.5,
          reviewCount: 96,
          price: 3,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Aesthetic & Design", "Food & Pastries", "Music & Vibe"],
          openNow: true,
          hours: "6:30 AM - 7:00 PM",
          amenities: {
            wifi: true,
            parking: false,
            powerOutlets: true,
            outdoorSeating: true,
            petFriendly: true,
          },
        },
        {
          _id: "3",
          name: "Espresso Express",
          address: "789 Quick Avenue, Taguig",
          distance: 0.5,
          rating: 4.2,
          reviewCount: 64,
          price: 1,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Quick Service", "Coffee Quality", "Photo Ops"],
          openNow: true,
          hours: "5:00 AM - 6:00 PM",
          amenities: {
            wifi: true,
            parking: true,
            powerOutlets: false,
            outdoorSeating: false,
            petFriendly: false,
          },
        },
        {
          _id: "4",
          name: "Coffee Culture",
          address: "101 Bean Street, Pasig",
          distance: 1.7,
          rating: 4.6,
          reviewCount: 112,
          price: 2,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Study Spot", "Workspace-Friendly", "Coffee Quality"],
          openNow: true,
          hours: "7:30 AM - 9:00 PM",
          amenities: {
            wifi: true,
            parking: true,
            powerOutlets: true,
            outdoorSeating: false,
            petFriendly: false,
          },
        },
        {
          _id: "5",
          name: "The Coffee Studio",
          address: "222 Artisan Ave, Mandaluyong",
          distance: 2.3,
          rating: 4.8,
          reviewCount: 156,
          price: 3,
          image: "/placeholder.svg?height=200&width=300",
          categories: ["Aesthetic & Design", "Photo Ops", "Music & Vibe"],
          openNow: false,
          hours: "8:00 AM - 7:00 PM",
          amenities: {
            wifi: true,
            parking: false,
            powerOutlets: true,
            outdoorSeating: true,
            petFriendly: true,
          },
        },
      ]

      // Filter shops based on search parameters
      let filteredShops = [...allShops]

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase()
        filteredShops = filteredShops.filter(
          (shop) => shop.name.toLowerCase().includes(searchLower) || shop.address.toLowerCase().includes(searchLower),
        )
      }

      // Apply amenities filter
      if (amenities && amenities.length > 0) {
        filteredShops = filteredShops.filter((shop) => amenities.every((amenity) => shop.amenities[amenity]))
      }

      // Apply cities filter
      if (cities && cities.length > 0) {
        filteredShops = filteredShops.filter((shop) => {
          const shopCity = shop.address.split(", ").pop()
          return cities.includes(shopCity)
        })
      }

      // Apply categories filter
      if (categories && categories.length > 0) {
        filteredShops = filteredShops.filter((shop) =>
          shop.categories.some((category) => categories.includes(category)),
        )
      }

      // Apply price range filter
      if (minPrice && maxPrice) {
        filteredShops = filteredShops.filter(
          (shop) => shop.price >= Number.parseInt(minPrice) && shop.price <= Number.parseInt(maxPrice),
        )
      }

      // Create pagination
      const pagination = {
        currentPage: 1,
        limit: 10,
        totalPages: Math.ceil(filteredShops.length / 10),
        totalShops: filteredShops.length,
      }

      return {
        data: {
          shops: filteredShops,
          pagination,
        },
      }
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  },

  // Add other methods as needed (post, put, delete)
}

export default apiService
