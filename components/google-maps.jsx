"use client"
import { useEffect, useRef } from "react"

export default function MapComponent({ lat = 0, lng = 0 }) {
  const mapRef = useRef(null)

  useEffect(() => {
    // This is a placeholder for a real Google Maps implementation
    // In a real application, you would use the Google Maps API

    if (mapRef.current) {
      const ctx = mapRef.current.getContext("2d")

      // Clear canvas
      ctx.clearRect(0, 0, mapRef.current.width, mapRef.current.height)

      // Draw map background
      ctx.fillStyle = "#e5e7eb"
      ctx.fillRect(0, 0, mapRef.current.width, mapRef.current.height)

      // Draw some roads
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 4

      // Horizontal roads
      for (let i = 1; i < 5; i++) {
        const y = i * (mapRef.current.height / 5)
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(mapRef.current.width, y)
        ctx.stroke()
      }

      // Vertical roads
      for (let i = 1; i < 5; i++) {
        const x = i * (mapRef.current.width / 5)
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, mapRef.current.height)
        ctx.stroke()
      }

      // Draw marker at center
      const centerX = mapRef.current.width / 2
      const centerY = mapRef.current.height / 2

      // Pin shadow
      ctx.beginPath()
      ctx.arc(centerX, centerY + 2, 8, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
      ctx.fill()

      // Pin base
      ctx.beginPath()
      ctx.arc(centerX, centerY, 10, 0, Math.PI * 2)
      ctx.fillStyle = "#ef4444"
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Add text - with null check for lat and lng
      ctx.font = "12px Arial"
      ctx.fillStyle = "#4b5563"
      ctx.textAlign = "center"

      // Safely format coordinates with null checks
      const latText = typeof lat === "number" ? lat.toFixed(4) : "N/A"
      const lngText = typeof lng === "number" ? lng.toFixed(4) : "N/A"

      ctx.fillText(`Lat: ${latText}, Lng: ${lngText}`, centerX, mapRef.current.height - 10)
    }
  }, [lat, lng])

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      <canvas ref={mapRef} width={600} height={300} className="w-full h-full" />
      <div className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs rounded shadow">
        This is a map placeholder
      </div>
    </div>
  )
}
