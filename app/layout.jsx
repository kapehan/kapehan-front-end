// app/layout.js
import "./globals.css";
import { AuthProvider } from "../context/authContext";
import TrackExplorePage from '../components/TrackExplorePage.js';

export const metadata = {
  title: "Kapehan - Coffee Shop Finder",
  description: "Discover the best coffee shops in your area",
  generator: 'v0.app'
};

export default function RootLayout({ children }) {
  const isProduction = process.env.NODE_ENV === "production";
  console.log("production environment", isProduction)
  return (
    <html lang="en">
      <body className="font-whyte-regular antialiased">
        <AuthProvider>
          {children}
          {isProduction && <TrackExplorePage />}
        </AuthProvider>
      </body>
    </html>
  );
}
