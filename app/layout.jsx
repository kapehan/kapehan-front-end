// app/layout.js
import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "../context/authContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Kapehan - Coffee Shop Finder",
  description: "Discover the best coffee shops in your area",
  generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
