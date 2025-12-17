"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function UmamiPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || typeof window === "undefined") return;

    // Prevent refresh double-counting (session-based)
    const key = `umami:${pathname}`;
    if (sessionStorage.getItem(key)) return;

    window.umami?.trackView(pathname);
    sessionStorage.setItem(key, "1");
  }, [pathname]);

  return null;
}
