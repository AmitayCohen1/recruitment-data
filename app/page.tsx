import {
  Award,
  Crosshair,
  Star,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { GenderBars } from "@/components/dashboard/gender-bars";
import { CouncilChart } from "@/components/dashboard/council-chart";
import { DistributionChart } from "@/components/dashboard/distribution-chart";
import { BandCombatChart } from "@/components/dashboard/band-combat-chart";
import { Movers } from "@/components/dashboard/movers";
import { Explorer } from "@/components/dashboard/explorer";
import { DashboardTabs } from "@/components/dashboard/tabs";
import {
  compactRows,
  distribution,
  genderComparison,
  highlights,
  kpis,
  combatByEnlistBand,
  schoolMovers,
  topCouncils,
  trendByYear,
  LATEST,
  METRICS,
  TOTAL_COUNCILS,
  TOTAL_SCHOOLS,
  YEARS,
  type MetricKey,
} from "@/lib/data";

const KPI_ICONS: Record<MetricKey, LucideIcon> = {
  enlist: Users,
  combat: Crosshair,
  officer: Star,
  meaning: Award,
};

export default function Home() {
  const trend = trendByYear();
  const kpiData = kpis();
  const gender = genderComparison();
  const rows = compactRows();
  const hl = highlights();
  const bandCombat = combatByEnlistBand();

  const byMetric = <T,>(fn: (m: MetricKey) => T) =>
    Object.fromEntries(METRICS.map((m) => [m.key, fn(m.key)])) as Record<
      MetricKey,
      T
    >;

  const councilsByMetric = byMetric((m) => topCouncils(m, 12));
  const distByMetric = byMetric((m) => distribution(m));
  const moversByMetric = byMetric((m) => schoolMovers(m, YEARS[0], 8));

  const highlightCards = [
    {
      label: "בתי ספר עם גיוס 90%+",
      value: `${hl.highEnlist}%`,
      hint: "מכלל בתי הספר",
      tone: "text-emerald-400",
    },
    {
      label: "בתי ספר עם גיוס מתחת ל-50%",
      value: `${hl.lowEnlist}%`,
      hint: "הזנב התחתון",
      tone: "text-rose-400",
    },
    {
      label: "פער גיוס בנים–בנות",
      value: `${hl.genderGap} נק׳`,
      hint: `לטובת ${(hl.genderGap ?? 0) >= 0 ? "הבנים" : "הבנות"}`,
      tone: "text-sky-400",
    },
    {
      label: "ממוצע לחימה ארצי",
      value: `${hl.combatAvg}%`,
      hint: `שנת ${LATEST}`,
      tone: "text-violet-400",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      {/* header */}
      <header className="mb-10">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          נתוני גיוס לפי בתי ספר · צה״ל · {YEARS[0]}–{LATEST}
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          לוח מחוונים — גיוס, לחימה וקצונה
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          ניתוח אינטראקטיבי של {TOTAL_SCHOOLS.toLocaleString("he")} בתי ספר
          ב־{TOTAL_COUNCILS.toLocaleString("he")} מועצות. כל הנתונים מוצגים
          כממוצע אחוזים של בתי הספר.
        </p>
      </header>

      {/* KPI stat tiles */}
      <section className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpiData.map((k) => {
          const Icon = KPI_ICONS[k.key as MetricKey];
          const up = (k.delta ?? 0) >= 0;
          return (
            <div
              key={k.key}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/[0.06] text-muted-foreground">
                  <Icon className="size-[18px]" />
                </span>
                <span className="text-sm text-muted-foreground">{k.label}</span>
              </div>
              <p className="text-4xl font-bold tabular-nums tracking-tight">
                {k.value}
                <span className="text-xl font-medium text-muted-foreground">
                  %
                </span>
              </p>
              {k.delta !== null && (
                <p
                  className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${
                    up ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {up ? (
                    <TrendingUp className="size-3.5" />
                  ) : (
                    <TrendingDown className="size-3.5" />
                  )}
                  {up ? "+" : ""}
                  {k.delta} נק׳ לעומת {k.prevYear}
                </p>
              )}
            </div>
          );
        })}
      </section>

      {/* highlights strip */}
      <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {highlightCards.map((h) => (
          <div
            key={h.label}
            className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
          >
            <p className={`text-3xl font-bold tabular-nums ${h.tone}`}>
              {h.value}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{h.label}</p>
            <p className="text-xs text-muted-foreground">{h.hint}</p>
          </div>
        ))}
      </section>

      {/* charts, organized into tabs */}
      <DashboardTabs
        tabs={[
          {
            id: "trends",
            label: "מגמות",
            content: (
              <>
                <TrendChart data={trend} />
                <DistributionChart data={distByMetric} year={LATEST} />
                <Movers data={moversByMetric} />
              </>
            ),
          },
          {
            id: "compare",
            label: "השוואות",
            content: (
              <>
                <GenderBars data={gender} year={LATEST} />
                <BandCombatChart data={bandCombat} year={LATEST} />
                <CouncilChart data={councilsByMetric} year={LATEST} />
              </>
            ),
          },
          {
            id: "schools",
            label: "בתי ספר",
            content: <Explorer rows={rows} />,
          },
        ]}
      />

      <footer className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-muted-foreground">
        שנתון {LATEST} = שנת לידה 2003, שלוש שנים מסיום כיתה י״ב · המקור: מערכת
        מוסדות וערים, לשכת רחט · שורות ללא נתוני גיוס/לחימה/קצונה הוסרו מהחישוב
      </footer>
    </div>
  );
}
