"use client";

import * as React from "react";
import { DirectionProvider } from "@radix-ui/react-direction";
import { dirOf, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
};

const LocaleContext = React.createContext<LocaleContextValue | null>(null);

/** Provides the active locale + its dictionary to all client components.
 *  The locale comes from the `[lang]` route segment (server), so switching
 *  language is a normal navigation that re-renders everything. */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = React.useMemo<LocaleContextValue>(
    () => ({ locale, dict: getDictionary(locale) }),
    [locale],
  );
  // Feed the locale's writing direction to Radix so popovers/menus align and
  // flip correctly in RTL (Hebrew) as well as LTR.
  return (
    <LocaleContext.Provider value={value}>
      <DirectionProvider dir={dirOf(locale)}>{children}</DirectionProvider>
    </LocaleContext.Provider>
  );
}

function useLocaleContext(): LocaleContextValue {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale/useT must be used within a LocaleProvider");
  }
  return ctx;
}

/** The active locale ("he" | "en"). */
export function useLocale(): Locale {
  return useLocaleContext().locale;
}

/** The dictionary for the active locale. */
export function useT(): Dictionary {
  return useLocaleContext().dict;
}
