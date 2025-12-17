"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@vercel/analytics";

const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const trackedInMemory = new Set();

function shouldTrack(pathname) {
  return pathname && (pathname === "/" || pathname === "/explore" || pathname.startsWith("/explore/"));
}

export default function TrackExplorePage() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !shouldTrack(pathname)) return;

    // Prevent double tracking in memory (per session)
    if (trackedInMemory.has(pathname)) {
      console.log("⚠️ Already tracked in memory, skipping", pathname);
      return;
    }

    // Check localStorage for expiry
    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem("trackedPagesWithExpiry") || "{}");
    } catch {}
    const lastTracked = Number(stored[pathname]) || 0;
    const now = Date.now();

    if (now - lastTracked < EXPIRY_MS) {
      console.log(`⏱ Already tracked recently (${new Date(lastTracked).toLocaleString()}), skipping`, pathname);
      trackedInMemory.add(pathname);
      return;
    }

    // Determine event name
    let eventName = "page_visit";

    if (pathname === "/") {
      eventName = "home_page_visit";
    } else if (pathname === "/explore") {
      eventName = "explore_index_visit";
    } else if (pathname.startsWith("/explore/")) {
      const slug = pathname.replace("/explore/", "");
      eventName = `explore_page_visit:${slug}`; // Event name now includes slug
    }

    // Track the event
    if (typeof track === "function") {
      try {
        console.log("🚀 Sending analytics event:", eventName);
        track(eventName, { path: pathname });

        // Save to localStorage
        stored[pathname] = now;
        localStorage.setItem("trackedPagesWithExpiry", JSON.stringify(stored));

        trackedInMemory.add(pathname);
      } catch (err) {
        console.error("❌ Failed to track Analytics event:", err);
      }
    }
  }, [pathname]);

  return null;
}
