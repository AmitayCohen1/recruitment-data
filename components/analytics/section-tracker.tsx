"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

/** Tags every PostHog event with the current section + locale (derived from the
 *  route), so the auto-captured $pageviews and custom events can be sliced per
 *  section in the dashboard regardless of which language the user is on. */
export function SectionTracker() {
  const pathname = usePathname();
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const seg = pathname.split("/").filter(Boolean);
    const locale = seg[0] ?? "he";
    const section = seg[1] ?? "sectors";
    try {
      posthog.register({ locale, section });
    } catch {
      // analytics must never break navigation
    }
  }, [pathname]);
  return null;
}
