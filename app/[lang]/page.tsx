import Image from "next/image";
import { PieChart, Scale, Search, Download, Building2 } from "lucide-react";
import cover from "@/public/cover.png";
import { SectorHeatmap } from "@/components/sectors/sector-heatmap";
import { SectorOverview } from "@/components/sectors/sector-overview";
import { GenderGap } from "@/components/sectors/gender-gap";
import { GapsOverview } from "@/components/sectors/gaps-overview";
import { Leaderboards } from "@/components/sectors/leaderboards";
import { RegionView } from "@/components/sectors/region-view";
import { FullData } from "@/components/sectors/full-data";
import { Explorer } from "@/components/dashboard/explorer";
import { Cities } from "@/components/dashboard/cities";
import { Notes } from "@/components/dashboard/notes";
import { DashboardTabs } from "@/components/dashboard/tabs";
import { LanguageToggle } from "@/components/i18n/language-toggle";
import { compactRows, zeroRows, TOTAL_SCHOOLS } from "@/lib/data";
import { isLocale, htmlLang, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "he";
  const t = getDictionary(locale);
  const rows = compactRows();
  const zeros = zeroRows();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 sm:pb-10">
      {/* hero — contained width, touching the top, rounded only at bottom */}
      <header className="relative -mx-4 mb-8 h-[32vh] min-h-[240px] overflow-hidden border-b border-white/10 sm:mx-0 sm:h-[36vh] sm:rounded-b-2xl sm:border-x">
        <Image
          src={cover}
          alt={t.hero.imageAlt}
          fill
          priority
          placeholder="blur"
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/65 to-black/10" />
        <div className="absolute end-4 top-4 z-10">
          <LanguageToggle />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
          <h1 className="max-w-3xl text-2xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
            {t.hero.title}
          </h1>
          <p className="mt-2.5 max-w-2xl text-sm leading-6 text-white/80 drop-shadow-md sm:text-base sm:leading-7">
            {t.hero.subtitle(TOTAL_SCHOOLS.toLocaleString(htmlLang(locale)))}
          </p>
          <p className="mt-3.5 text-sm font-medium text-white drop-shadow-md sm:text-base">
            הערות? כתבו לי{" "}
            <a
              href="https://x.com/messages/compose?recipient_id=1926622482"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white/15 px-2 py-0.5 font-semibold text-white underline decoration-white/60 underline-offset-2 ring-1 ring-white/20 transition-colors hover:bg-white/25 hover:decoration-white"
            >
              amitay1599@
            </a>
          </p>
        </div>
      </header>

      {/* narrative sections, organized into tabs */}
      <DashboardTabs
        tabs={[
          {
            id: "sectors",
            label: t.tabs.sectors,
            icon: <PieChart className="size-4" />,
            content: (
              <>
                <SectorHeatmap />
                <SectorOverview />
              </>
            ),
          },
          {
            id: "gaps",
            label: t.tabs.gaps,
            icon: <Scale className="size-4" />,
            content: (
              <>
                <GapsOverview />
                <GenderGap />
              </>
            ),
          },
          {
            id: "cities",
            label: t.tabs.cities,
            icon: <Building2 className="size-4" />,
            content: (
              <div>
                <h2 className="mb-1 text-xl font-bold tracking-tight sm:text-2xl">
                  {t.citiesTab.title}
                </h2>
                <p className="mb-5 text-sm text-muted-foreground">
                  {t.citiesTab.subtitle}
                </p>
                <div className="space-y-6">
                  <RegionView />
                  <Cities rows={rows} />
                </div>
              </div>
            ),
          },
          {
            id: "schools",
            label: t.tabs.search,
            icon: <Search className="size-4" />,
            content: (
              <div>
                <h2 className="mb-1 text-xl font-bold tracking-tight sm:text-2xl">
                  {t.searchTab.title}
                </h2>
                <p className="mb-5 text-sm text-muted-foreground">
                  {t.searchTab.subtitle}
                </p>
                <div className="space-y-6">
                  <Explorer rows={rows} zeroRows={zeros} />
                  <Leaderboards />
                </div>
              </div>
            ),
          },
          {
            id: "downloads",
            label: t.tabs.sources,
            icon: <Download className="size-4" />,
            content: <FullData />,
          },
        ]}
      />

      <Notes />

      <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-muted-foreground">
        <div className="space-y-1 text-center leading-5">
          <p>
            built by{" "}
            <a
              href="https://x.com/amitay1599"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 underline-offset-2 hover:underline"
            >
              Amitay Cohen
            </a>{" "}
            ·{" "}
            <a
              href="https://x.com/Idaneretz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 underline-offset-2 hover:underline"
            >
              Idan Erez
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
