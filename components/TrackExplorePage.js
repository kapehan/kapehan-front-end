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
    if (!shouldTrack(pathname)) return;

    // Get previously tracked pages from sessionStorage
    const stored = JSON.parse(sessionStorage.getItem("trackedPagesWithExpiry") || "{}");
    const lastTracked = stored[pathname] || 0;
    const now = Date.now();

    // If tracked within expiry, skip
    if (now - lastTracked < EXPIRY_MS) return;

    // Track custom event
    track("explore_page_visit", { path: pathname });
    console.log("📊 Analytics: page visit tracked", pathname);

    // Update sessionStorage
    stored[pathname] = now;
    sessionStorage.setItem("trackedPagesWithExpiry", JSON.stringify(stored));
  }, [pathname]);

  return null;
}
