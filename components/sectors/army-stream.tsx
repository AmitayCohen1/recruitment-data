"use client";

import * as React from "react";
import { Cell, Pie, PieChart } from "recharts";
import {
  ChartFootnote,
  ChartHeader,
  ChartLegend,
  ChartPanel,
} from "@/components/ui/panel";
import { ChartContainer } from "@/components/ui/chart";
import { GenderToggle, SegmentTabs, absMetricItems } from "@/components/sectors/controls";
import { track } from "@/lib/analytics";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel, genderLabel } from "@/lib/i18n/labels";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Gender } from "@/lib/data";
import { type AbsMetric, type SGender } from "@/lib/sectors";
import { armyComposition } from "@/lib/lab";

type Composition = ReturnType<typeof armyComposition>;

/** Latest-year composition as a pie chart: each sector's share of the selected
 *  absolute (weighted) count metric. */
function PieShareView({
  data,
  t,
  locale,
  noun,
}: {
  data: Composition;
  t: Dictionary;
  locale: Locale;
  noun: string;
}) {
  const { years, series } = data;
  const lastIndex = years.length - 1;
  const year = years[lastIndex];
  const numberLocale = locale === "he" ? "he-IL" : "en-US";
  const slices = series
    .map((s) => ({
      sector: s.sector,
      color: s.color,
      count: s.counts[lastIndex],
      share: s.shares[lastIndex],
    }))
    .filter((s) => s.count > 0);

  return (
    <div>
      <div className="grid items-center gap-5 lg:grid-cols-[minmax(260px,360px)_1fr]">
        <div className="relative mx-auto h-64 w-full max-w-[340px]">
          <ChartContainer config={{}} className="aspect-square h-full w-full">
            <PieChart>
              <Pie
                data={slices}
                dataKey="count"
                nameKey="sector"
                cx="50%"
                cy="50%"
                innerRadius="48%"
                outerRadius="88%"
                paddingAngle={1}
                stroke="rgba(2,6,23,0.7)"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {slices.map((s) => (
                  <Cell key={s.sector} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold tabular-nums">100%</span>
            <span className="text-xs font-medium text-muted-foreground">
              {year} · {noun}
            </span>
          </div>
        </div>

        <ul className="space-y-2">
          {slices.map((s) => (
            <li
              key={s.sector}
              className="flex items-baseline justify-between gap-3 text-sm"
            >
              <span className="flex min-w-0 flex-1 items-center gap-2 font-medium">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="min-w-0 truncate" style={{ color: s.color }}>
                  {sectorLabel(s.sector, locale)}
                </span>
              </span>
              <span className="flex shrink-0 items-baseline gap-2 tabular-nums">
                <span className="font-bold">
                  {Math.round(s.count).toLocaleString(numberLocale)}
                </span>
                <span className="w-12 font-semibold text-muted-foreground">
                  {s.share}%
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <ChartFootnote>{t.armyStream.pieNote(noun, year)}</ChartFootnote>
    </div>
  );
}

/** Latest-year absolute composition by sector, as a pie, with metric + gender
 *  toggles. */
export function ArmyStream() {
  const t = useT();
  const locale = useLocale();
  const [gender, setGender] = React.useState<SGender>("בנים");
  const [metric, setMetric] = React.useState<AbsMetric>("nFighters");
  const g: Gender = gender === "בנים" ? "m" : "f";

  const data = React.useMemo(() => armyComposition(g, metric), [g, metric]);
  const { series } = data;
  const noun = t.absNoun[metric];

  return (
    <ChartPanel>
      <ChartHeader
        title={t.armyStream.title}
        subtitle={t.armyStream.subtitle}
        exportCaption={`${t.armyStream.viewPie} · ${t.absMetrics[metric]} · ${genderLabel(gender, locale)}`}
      />
      <div className="-mt-2 mb-4 flex flex-wrap items-center justify-between gap-3">
        <ChartLegend
          className="m-0"
          items={series.map((s) => ({
            label: sectorLabel(s.sector, locale),
            color: s.color,
          }))}
        />
        <div className="flex flex-wrap items-center gap-2" data-export-ignore>
          <SegmentTabs
            items={absMetricItems(t)}
            value={metric}
            onChange={(m) => {
              if (metric !== m) track("army_metric", { metric: m });
              setMetric(m);
            }}
          />
          <GenderToggle value={gender} onChange={setGender} />
        </div>
      </div>
      <PieShareView data={data} t={t} locale={locale} noun={noun} />
    </ChartPanel>
  );
}
