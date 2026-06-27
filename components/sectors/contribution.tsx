"use client";

import * as React from "react";
import {
  ChartFootnote,
  ChartHeader,
  ChartPanel,
} from "@/components/ui/panel";
import {
  contribution,
  SECTOR_COLOR,
  type AbsMetric,
  type SGender,
} from "@/lib/sectors";
import { GenderToggle, SegmentTabs, absMetricItems } from "./controls";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel, genderLabel } from "@/lib/i18n/labels";

export function Contribution({
  gender: genderProp,
}: { gender?: SGender } = {}) {
  const t = useT();
  const locale = useLocale();
  const controlled = genderProp !== undefined;
  const [metric, setMetric] = React.useState<AbsMetric>("nFighters");
  const [genderState, setGender] = React.useState<SGender>("בנים");
  const gender = genderProp ?? genderState;
  const rows = contribution(metric, gender);

  return (
    <ChartPanel>
      <ChartHeader
        title={t.contribution.title}
        subtitle={t.contribution.subtitle}
        exportCaption={`${t.absMetrics[metric]} · ${genderLabel(gender, locale)}`}
      >
        <div className="flex flex-wrap gap-2">
          {!controlled && (
            <GenderToggle value={gender} onChange={setGender} surface="contribution" />
          )}
          <SegmentTabs items={absMetricItems(t)} value={metric} onChange={setMetric} />
        </div>
      </ChartHeader>

      {/* 100% stacked composition bar — each sector's share of the national total */}
      <div className="flex h-10 w-full overflow-hidden rounded-xl border border-white/10">
        {rows.map((r) => (
          <div
            key={r.sector}
            className="flex items-center justify-center"
            style={{ width: `${r.share}%`, background: SECTOR_COLOR[r.sector] }}
            title={`${sectorLabel(r.sector, locale)}: ${r.value.toLocaleString("he")} (${r.share}%)`}
          >
            {r.share >= 8 && (
              <span className="text-xs font-bold tabular-nums text-black/75">
                {r.share}%
              </span>
            )}
          </div>
        ))}
      </div>

      {/* legend: absolute count + share + underlying rate */}
      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li
            key={r.sector}
            className="flex items-baseline justify-between gap-3 text-sm"
          >
            <span className="flex min-w-0 flex-1 items-baseline gap-2 font-medium">
              <span
                className="size-2.5 shrink-0 translate-y-0.5 rounded-full"
                style={{ background: SECTOR_COLOR[r.sector] }}
              />
              <span
                className="shrink-0"
                style={{ color: SECTOR_COLOR[r.sector] }}
              >
                {sectorLabel(r.sector, locale)}
              </span>
              {r.rate != null && (
                <span className="min-w-0 truncate text-xs tabular-nums text-muted-foreground">
                  {t.contribution.ofEnlistees(r.rate)}
                </span>
              )}
            </span>
            <span className="flex shrink-0 items-baseline gap-2 tabular-nums">
              <span className="font-bold">{r.value.toLocaleString("he")}</span>
              <span className="w-9 font-semibold text-muted-foreground">
                {r.share}%
              </span>
            </span>
          </li>
        ))}
      </ul>

      <ChartFootnote>{t.contribution.footnote}</ChartFootnote>
    </ChartPanel>
  );
}
