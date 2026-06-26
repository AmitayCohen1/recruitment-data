"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import {
  contribution,
  ABS_METRICS,
  SECTOR_COLOR,
  type AbsMetric,
  type SGender,
} from "@/lib/sectors";
import { GenderToggle } from "./controls";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel } from "@/lib/i18n/labels";

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
  const noun = t.absNoun[metric];

  return (
    <Panel>
      <PanelHeader
        title={t.contribution.title}
        subtitle={t.contribution.subtitle(noun)}
      >
        <div className="flex flex-wrap gap-2">
          {!controlled && (
            <GenderToggle value={gender} onChange={setGender} surface="contribution" />
          )}
          <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {ABS_METRICS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMetric(m.key)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  metric === m.key
                    ? "bg-white/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.absMetrics[m.key]}
              </button>
            ))}
          </div>
        </div>
      </PanelHeader>

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

      <p className="pt-4 text-xs leading-5 text-muted-foreground">
        {t.contribution.footnote}
      </p>
    </Panel>
  );
}
