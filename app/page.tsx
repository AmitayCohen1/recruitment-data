import { ShieldCheck } from "lucide-react";
import { SectorDonuts } from "@/components/sectors/sector-donuts";
import { SectorHeatmap } from "@/components/sectors/sector-heatmap";
import { SectorRanking } from "@/components/sectors/sector-ranking";
import { SectorTrend } from "@/components/sectors/sector-trend";
import { SectorChange } from "@/components/sectors/sector-change";
import { Subgroups } from "@/components/sectors/subgroups";
import { CombatParadox } from "@/components/sectors/combat-paradox";
import { GenderGap } from "@/components/sectors/gender-gap";
import { EffectiveRate } from "@/components/sectors/effective-rate";
import { SectorFunnel } from "@/components/sectors/sector-funnel";
import { RegionView } from "@/components/sectors/region-view";
import { Leaderboards } from "@/components/sectors/leaderboards";
import { CouncilCompare } from "@/components/sectors/council-compare";
import { Explorer } from "@/components/dashboard/explorer";
import { DashboardTabs } from "@/components/dashboard/tabs";
import { compactRows, TOTAL_SCHOOLS } from "@/lib/data";
import { headline, SFIRST, SLATEST } from "@/lib/sectors";

export default function Home() {
  const cards = headline();
  const rows = compactRows();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      {/* hero */}
      <header className="mb-12">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
          <ShieldCheck className="size-3.5" />
          אומת מול נתוני משרד החינוך · {SFIRST}–{SLATEST}
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
          פערי הגיוס של החברה הישראלית
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          מ־<span className="font-semibold text-sky-400">92%</span> בקרב
          חילונים ועד <span className="font-semibold text-amber-400">0.4%</span>{" "}
          בקרב חרדיות — ניתוח של {TOTAL_SCHOOLS.toLocaleString("he")} בתי ספר
          לפי מגזר, מגדר ושנה. הממוצעים משוקללים לפי מספר תלמידי י״ב.
        </p>
      </header>

      {/* headline sector cards */}
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        🪖 אחוז גיוס לפי מגזר · {SLATEST}
      </p>
      <section className="mb-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.sector}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5"
          >
            <span
              className="absolute inset-x-0 top-0 h-1"
              style={{ background: c.color }}
            />
            <p className="text-base font-semibold" style={{ color: c.color }}>
              {c.sector}
            </p>
            <div className="mt-4 flex items-end justify-between gap-2">
              <div>
                <p className="text-4xl font-bold tabular-nums leading-none">
                  {c.boys ?? "—"}
                  <span className="text-lg font-medium text-muted-foreground">%</span>
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">בנים</p>
              </div>
              <div className="text-left">
                <p className="text-2xl font-semibold tabular-nums leading-none text-muted-foreground">
                  {c.girls ?? "—"}
                  <span className="text-sm">%</span>
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">בנות</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* narrative sections, organized into tabs */}
      <DashboardTabs
        tabs={[
          {
            id: "sectors",
            label: "מגזרים",
            icon: "👥",
            content: (
              <>
                <SectorDonuts />
                <SectorHeatmap />
                <SectorRanking />
              </>
            ),
          },
          {
            id: "gaps",
            label: "פערים",
            icon: "⚖️",
            content: (
              <>
                <EffectiveRate />
                <SectorFunnel />
                <CombatParadox />
                <GenderGap />
              </>
            ),
          },
          {
            id: "regions",
            label: "אזורים",
            icon: "🗺️",
            content: <RegionView />,
          },
          {
            id: "trends",
            label: "מגמות",
            icon: "📈",
            content: (
              <>
                <SectorTrend />
                <SectorChange />
              </>
            ),
          },
          {
            id: "breakdown",
            label: "פילוח",
            icon: "🔍",
            content: (
              <>
                <Subgroups />
                <CouncilCompare />
                <Leaderboards />
              </>
            ),
          },
          {
            id: "schools",
            label: "בתי ספר",
            icon: "🏫",
            content: (
              <div>
                <h2 className="mb-1 text-xl font-bold tracking-tight sm:text-2xl">
                  רמת בית הספר
                </h2>
                <p className="mb-5 text-sm text-muted-foreground">
                  צללו אל בתי הספר הבודדים מאחורי המספרים המגזריים.
                </p>
                <Explorer rows={rows} />
              </div>
            ),
          },
        ]}
      />

      <footer className="mt-12 border-t border-white/10 pt-6 text-xs text-muted-foreground">
        <div className="mb-4">
          <p className="mb-2 font-semibold text-foreground">מקורות והורדת נתונים</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href="/Recruitment-data-by-school.xlsx"
              download
              className="text-sky-400 underline-offset-2 hover:underline"
            >
              ⬇️ נתוני הגיוס הגולמיים (XLSX)
            </a>
            <a
              href="/mosdot-education-ministry.xlsx"
              download
              className="text-sky-400 underline-offset-2 hover:underline"
            >
              ⬇️ סיווג מוסדות — משרד החינוך, data.gov.il (XLSX)
            </a>
          </div>
        </div>
        <div className="space-y-1 text-center leading-5">
          <p>
            שנתון {SLATEST} = שנת לידה 2003, שלוש שנים מסיום כיתה י״ב · מקור
            הגיוס: מערכת מוסדות וערים, לשכת רחט (חופש מידע)
          </p>
          <p>
            הסיווג המגזרי אומת: 99.4% התאמה לנתוני משרד החינוך · הנתונים מכסים את
            המגזר היהודי והדרוזי · ממוצעים משוקללים לפי מספר תלמידי י״ב (בסיס
            2015; שנת 2018 מדויקת, שנים מאוחרות יותר בקירוב).
          </p>
        </div>
      </footer>
    </div>
  );
}
