// app/layout.js
import "./globals.css";
import { AuthProvider } from "../context/authContext";
import { Analytics, event } from '@vercel/analytics/next';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const metadata = {
  title: "Kapehan - Coffee Shop Finder",
  description: "Discover the best coffee shops in your area",
  generator: 'v0.app'
};

// Check if the path should be tracked
function shouldTrack(pathname) {
  return pathname && (pathname === '/' || pathname === '/explore' || pathname.startsWith('/explore/'));
}

// Track / and /explore pages with 24-hour expiry
function TrackExplorePage() {
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldTrack(pathname)) return;

    const now = Date.now();
    const EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    // Get stored data
    const stored = JSON.parse(sessionStorage.getItem('trackedPagesWithExpiry') || '{}');
    const lastTracked = stored[pathname] || 0;

    // If last tracked was within 24 hours, skip
    if (now - lastTracked < EXPIRY) return;

    // Track the event
    event('page_visit', { path: pathname });
    console.log("📊 Analytics: page visit", pathname);

    // Update storage with current timestamp
    stored[pathname] = now;
    sessionStorage.setItem('trackedPagesWithExpiry', JSON.stringify(stored));
  }, [pathname]);

  return null;
}

export default function RootLayout({ children }) {
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    console.log(
      isProduction
        ? "✅ Vercel Analytics is active"
        : "⚠️ Analytics disabled in dev/staging"
    );
  }, [isProduction]);

  return (
    <html lang="en">
      <body className="font-whyte-regular antialiased">
        <AuthProvider>
          {children}
          {isProduction && (
            <>
              <Analytics mode="manual" /> {/* disable automatic tracking */}
              <TrackExplorePage /> {/* manually track / and /explore pages */}
            </>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
