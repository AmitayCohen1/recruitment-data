import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { YEARS, TOTAL_SCHOOLS } from "@/lib/data";

/** Section keys that get a generated social-preview card. */
export type OgSection =
  | "home"
  | "sectors"
  | "gaps"
  | "cities"
  | "schools"
  | "lab"
  | "three"
  | "d3"
  | "sources";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const SECTOR_DOTS = ["#38bdf8", "#34d399", "#fbbf24", "#c084fc"];

/** Headline + sub for a section, in the page's own language. */
function copy(section: OgSection, t: ReturnType<typeof getDictionary>) {
  switch (section) {
    case "cities":
      return { title: t.citiesTab.title, sub: t.citiesTab.subtitle };
    case "schools":
      return { title: t.searchTab.title, sub: t.searchTab.subtitle };
    case "lab":
      return { title: t.labTab.title, sub: t.labTab.subtitle };
    case "three":
      return { title: t.threeTab.title, sub: t.threeTab.subtitle };
    case "d3":
      return { title: t.d3Tab.title, sub: t.d3Tab.subtitle };
    case "gaps":
      return { title: t.tabs.gaps, sub: t.meta.description };
    case "sources":
      return { title: t.tabs.sources, sub: t.meta.description };
    case "sectors":
      return { title: t.tabs.sectors, sub: t.meta.description };
    default:
      return { title: t.hero.title, sub: t.meta.description };
  }
}

/** Render a section's social-preview card. Used by every opengraph-image route. */
export async function renderOg(
  params: Promise<{ lang: string }>,
  section: OgSection,
) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "he";
  const rtl = locale === "he";
  const t = getDictionary(locale);
  const { title, sub } = copy(section, t);

  // read the bundled Hebrew font from disk (file:// fetch isn't supported here)
  const font = await readFile(join(process.cwd(), "lib", "Heebo.ttf"));

  const align = rtl ? "flex-end" : "flex-start";
  const textAlign = rtl ? ("right" as const) : ("left" as const);
  const brand = rtl ? "נתוני גיוס לפי בתי ספר" : "IDF recruitment, by school";
  const stat = rtl
    ? `${TOTAL_SCHOOLS.toLocaleString("he-IL")} בתי ספר · ${YEARS[0]}–${YEARS[YEARS.length - 1]}`
    : `${TOTAL_SCHOOLS.toLocaleString("en-US")} schools · ${YEARS[0]}–${YEARS[YEARS.length - 1]}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: align,
          padding: 80,
          background:
            "radial-gradient(1200px 600px at 80% -10%, #0e3a52 0%, #0a0a0a 55%), #0a0a0a",
          color: "#fff",
          fontFamily: "Heebo",
          direction: rtl ? "rtl" : "ltr",
        }}
      >
        {/* brand row + sector accent dots */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", gap: 10 }}>
            {SECTOR_DOTS.map((c) => (
              <div
                key={c}
                style={{ width: 22, height: 22, borderRadius: 999, background: c }}
              />
            ))}
          </div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.72)" }}>
            {brand}
          </div>
        </div>

        {/* headline + sub */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 1040 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, textAlign }}>
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.35,
              color: "rgba(255,255,255,0.8)",
              textAlign,
              // clamp to ~2 lines
              display: "flex",
              maxWidth: 1040,
            }}
          >
            {sub.length > 150 ? `${sub.slice(0, 147)}…` : sub}
          </div>
        </div>

        {/* stat chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 26,
            fontWeight: 700,
            color: "#bae6fd",
            background: "rgba(56,189,248,0.12)",
            border: "1px solid rgba(56,189,248,0.3)",
            borderRadius: 999,
            padding: "10px 22px",
          }}
        >
          {stat}
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Heebo", data: font, style: "normal", weight: 400 },
        { name: "Heebo", data: font, style: "normal", weight: 700 },
      ],
    },
  );
}
