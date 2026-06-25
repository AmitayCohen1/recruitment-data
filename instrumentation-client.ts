// Client-side instrumentation — runs after the document loads but before React
// hydration (Next.js 16 `instrumentation-client` convention), making it the
// ideal place to initialize PostHog so early events aren't missed.
import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  try {
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
      ui_host: "https://eu.posthog.com",
      // Modern defaults: history-based $pageview/$pageleave capture (works with
      // the App Router's client-side navigation), autocapture, web vitals, etc.
      defaults: "2025-05-24",
      capture_exceptions: true,
    });
  } catch (err) {
    // Never let analytics setup break the app.
    console.error("PostHog init failed", err);
  }
}
