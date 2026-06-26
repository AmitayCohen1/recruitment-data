export const locales = ["he", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "he";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Text direction for a locale. Hebrew is RTL; English is LTR. */
export function dirOf(locale: Locale): "rtl" | "ltr" {
  return locale === "he" ? "rtl" : "ltr";
}

/** BCP-47 tag for `<html lang>` and number/date formatting. */
export function htmlLang(locale: Locale): string {
  return locale === "he" ? "he-IL" : "en-US";
}
