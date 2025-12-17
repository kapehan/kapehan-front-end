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
    if (!pathname || typeof window === "undefined") return;
    if (!shouldTrack(pathname)) return;

    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem("trackedPagesWithExpiry") || "{}");
    } catch {
      stored = {};
    }

    const lastTracked = stored[pathname] || 0;
    const now = Date.now();

    if (now - lastTracked < EXPIRY_MS) return;

    try {
      track("explore_page_visit", { path: pathname });
      console.log("✅ Analytics event tracked:", pathname);

      stored[pathname] = now;
      localStorage.setItem("trackedPagesWithExpiry", JSON.stringify(stored));
    } catch (err) {
      console.error("❌ Failed to track analytics:", err);
    }
  }, [pathname]);

  return null;
}
