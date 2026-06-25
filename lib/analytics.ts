import { track as vercelTrack } from "@vercel/analytics";
import posthog from "posthog-js";

type Props = Record<string, string | number | boolean | null>;

/** Send a custom event to both Vercel Analytics and PostHog.
 *  Drop-in replacement for `@vercel/analytics`'s `track`. */
export function track(event: string, props?: Props) {
  vercelTrack(event, props);
  if (typeof window !== "undefined") {
    posthog.capture(event, props);
  }
}
