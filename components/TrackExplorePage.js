"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { track } from '@vercel/analytics'; // <-- use `track` instead of `event`

function shouldTrack(pathname) {
  return pathname && (pathname === '/' || pathname === '/explore' || pathname.startsWith('/explore/'));
}

export default function TrackExplorePage() {
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldTrack(pathname)) return;

    const now = Date.now();
    const EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

    const stored = JSON.parse(sessionStorage.getItem('trackedPagesWithExpiry') || '{}');
    const lastTracked = stored[pathname] || 0;

    if (now - lastTracked < EXPIRY) return;

    // Track custom event
    track('page_visit', { path: pathname });
    console.log("📊 Analytics: page visit", pathname);

    stored[pathname] = now;
    sessionStorage.setItem('trackedPagesWithExpiry', JSON.stringify(stored));
  }, [pathname]);

  return null;
}
