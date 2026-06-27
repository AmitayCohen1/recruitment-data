import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

type TabKey = keyof Dictionary["tabs"];

/** Per-route metadata: a section-specific <title> on top of the site title,
 *  so each section URL is independently indexable/shareable. */
export async function sectionMetadata(
  params: Promise<{ lang: string }>,
  tab: TabKey,
): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "he";
  const dict = getDictionary(locale);
  const title = `${dict.tabs[tab]} · ${dict.meta.title}`;
  const description = dict.meta.description;
  // Setting openGraph/twitter here overwrites (not merges) the layout's, so the
  // shared static social-preview image must be repeated.
  const images = [{ url: "/og.jpg", width: 1200, height: 630, alt: title }];
  return {
    title,
    description,
    openGraph: { title, description, type: "website", images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
