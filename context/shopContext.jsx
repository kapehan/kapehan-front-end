"use client"
import { createContext, useContext, useState } from "react"

// Create the context
const ShopContext = createContext()

// Create a provider component
export function ShopProvider({ children }) {
  const [selectedShop, setSelectedShop] = useState(null)

  return <ShopContext.Provider value={{ selectedShop, setSelectedShop }}>{children}</ShopContext.Provider>
}

// Create a hook to use the context
export function useShop() {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider")
  }
  return context
}
