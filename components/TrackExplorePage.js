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

    // Always check localStorage for expiry
    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem("trackedPagesWithExpiry") || "{}");
    } catch {}
    const lastTracked = Number(stored[pathname]) || 0;
    const now = Date.now();

    if (now - lastTracked < EXPIRY_MS) {
      console.log(`⏱ Already tracked recently (${new Date(lastTracked).toLocaleString()}), skipping`);
      return;
    }

    // Prevent double tracking in memory (per session, per effect run)
    if (trackedInMemory.has(pathname)) {
      console.log("⚠️ Already tracked in memory for this session, skipping");
      return;
    }

    // Actually track
    if (typeof track === "function") {
      try {
        console.log("🚀 Sending analytics event for", pathname);
        track("explore_page_visit", { path: pathname });
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
