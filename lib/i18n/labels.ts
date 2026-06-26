import type { Locale } from "@/lib/i18n/config";
import { SECTOR_EN } from "@/lib/sectors";
import { REGION_EN } from "@/lib/regions";
import type { SGender } from "@/lib/sectors";

/** Data values (sectors, regions, gender) are stored as Hebrew strings because
 *  they also index the underlying datasets. These helpers map a stored Hebrew
 *  value to its display label for the active locale — the value itself never
 *  changes, only what the user sees. School names stay Hebrew in both locales. */

export function sectorLabel(name: string, locale: Locale): string {
  if (locale === "he") return name;
  return SECTOR_EN[name] ?? name;
}

export function regionLabel(name: string, locale: Locale): string {
  if (locale === "he") return name;
  return REGION_EN[name] ?? name;
}

/** "הכל" is the all-sectors option in the region filter. */
export function sectorFilterLabel(name: string, locale: Locale): string {
  if (name === "הכל") return locale === "he" ? "הכל" : "All";
  return sectorLabel(name, locale);
}

export function genderLabel(gender: SGender, locale: Locale): string {
  if (locale === "he") return gender;
  return gender === "בנים" ? "Boys" : "Girls";
}

export const genderEmoji = (gender: SGender) =>
  gender === "בנים" ? "👨" : "👩";

/** Same, for the school-level data code ("m" | "f"). */
export function genderLabelFromCode(g: "m" | "f", locale: Locale): string {
  return genderLabel(g === "m" ? "בנים" : "בנות", locale);
}
