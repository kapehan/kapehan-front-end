// app/layout.js
import "./globals.css"
import { AuthProvider } from "../context/authContext"
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  title: "Kapehan - Coffee Shop Finder",
  description: "Discover the best coffee shops in your area",
  generator: 'v0.app'
}

export default function RootLayout({ children }) {
  const isProduction = process.env.NODE_ENV === "production"

  if (isProduction) {
    console.log("✅ Vercel Analytics is being triggered")
  } else {
    console.log("⚠️ Analytics not triggered in dev/staging")
  }

  return (
    <html lang="en">
      <body className="font-whyte-regular antialiased">
        <AuthProvider>
          {children}
          {isProduction && <Analytics />}
        </AuthProvider>
      </body>
    </html>
  )
}
