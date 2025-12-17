"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@vercel/analytics";

const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

function shouldTrack(pathname) {
  return pathname && (pathname === "/" || pathname === "/explore" || pathname.startsWith("/explore/"));
}

export default function TrackExplorePage() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !shouldTrack(pathname)) return;

    // Check localStorage first
    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem("trackedPagesWithExpiry") || "{}");
    } catch {
      stored = {};
    }

    const lastTracked = Number(stored[pathname]) || 0;
    const now = Date.now();

    if (now - lastTracked < EXPIRY_MS) {
      console.log(`⏱ Already tracked recently (${new Date(lastTracked).toLocaleString()}), skipping`);
      return; // already tracked within 24 hours
    }

    // Wait for Analytics script to be ready
    const waitForAnalytics = setInterval(() => {
      if (typeof track === "function") {
        try {
          track("explore_page_visit", { path: pathname });
          console.log("✅ Analytics event tracked:", pathname);

          stored[pathname] = now;
          localStorage.setItem("trackedPagesWithExpiry", JSON.stringify(stored));

          clearInterval(waitForAnalytics); // stop checking
        } catch (err) {
          console.error("❌ Failed to track Analytics event:", err);
        }
      }
    }, 200);

    return () => clearInterval(waitForAnalytics);
  }, [pathname]);

  return null;
}
