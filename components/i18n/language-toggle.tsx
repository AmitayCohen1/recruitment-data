"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { locales, isLocale, type Locale } from "@/lib/i18n/config";
import { useLocale, useT } from "./locale-provider";

/** Swaps the leading `/[lang]` segment of the current path for the other
 *  locale, preserving the rest of the route. */
function swapLocale(pathname: string, next: Locale): string {
  const segments = pathname.split("/");
  // segments[0] is "" (leading slash); segments[1] is the locale segment.
  if (segments[1] && isLocale(segments[1])) {
    segments[1] = next;
    return segments.join("/") || "/";
  }
  return `/${next}${pathname}`;
}

export function LanguageToggle({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useT();
  const pathname = usePathname() ?? "/";
  const other = locales.find((l) => l !== locale) ?? locale;

  return (
    <Link
      href={swapLocale(pathname, other)}
      aria-label={t.nav.switchLanguage}
      title={t.nav.switchLanguage}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/85 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-black/50 ring-1 ring-white/10 backdrop-blur-md transition-colors hover:bg-black"
      }
    >
      <Languages className="size-4" aria-hidden />
      {t.nav.otherLanguage}
    </Link>
  );
}
