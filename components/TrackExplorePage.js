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
    if (typeof window === "undefined" || !pathname) return;

    console.log("🔹 Current pathname:", pathname);

    if (!shouldTrack(pathname)) {
      console.log("❌ Not an /explore page, skipping tracking");
      return;
    }

    // Get previously tracked pages from localStorage
    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem("trackedPagesWithExpiry") || "{}");
    } catch (err) {
      console.warn("⚠️ Failed to parse localStorage:", err);
      stored = {};
    }

    const lastTracked = stored[pathname] || 0;
    const now = Date.now();

    if (now - lastTracked < EXPIRY_MS) {
      console.log(`⏱ Already tracked recently (${new Date(lastTracked).toLocaleString()}), skipping`);
      return;
    }

    console.log("⏳ Waiting for Vercel Analytics script to load...");

    // Wait until analytics script is ready
    const interval = setInterval(() => {
      if (window.__vercel_analytics) {
        try {
          track("explore_page_visit", { path: pathname });
          console.log("✅ Analytics event tracked:", pathname);

          // Update localStorage
          stored[pathname] = now;
          localStorage.setItem("trackedPagesWithExpiry", JSON.stringify(stored));
          console.log("💾 localStorage updated");

          clearInterval(interval);
        } catch (err) {
          console.error("❌ Failed to track analytics:", err);
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
