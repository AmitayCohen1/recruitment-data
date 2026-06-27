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
  return {
    title: `${dict.tabs[tab]} · ${dict.meta.title}`,
    description: dict.meta.description,
  };
}
