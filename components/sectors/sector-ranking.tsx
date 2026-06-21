"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import {
  ranking,
  SECTOR_COLOR,
  S_METRICS,
  SLATEST,
  type SMetric,
} from "@/lib/sectors";
import { MetricTabsS } from "./controls";

export function SectorRanking() {
  const [metric, setMetric] = React.useState<SMetric>("enlist");
  const rows = ranking(metric);
  const label = S_METRICS.find((m) => m.key === metric)!.short;

  return (
    <Panel>
      <PanelHeader
        title="הדירוג: מי מתגייס?"
        subtitle={`ממוצע אחוז ${label} לפי מגזר ומגדר, שנת ${SLATEST}`}
      >
        <MetricTabsS value={metric} onChange={setMetric} />
      </PanelHeader>
      <ul className="space-y-2.5">
        {rows.map((r, i) => {
          const color = SECTOR_COLOR[r.sector];
          return (
            <li key={`${r.sector}-${r.gender}`} className="flex items-center gap-3">
              <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span className="w-24 shrink-0 truncate text-sm sm:w-40">
                <span style={{ color }}>{r.sector}</span>
                <span className="text-muted-foreground"> · {r.gender}</span>
              </span>
              <div className="relative h-8 flex-1 overflow-hidden rounded-lg bg-white/[0.04]">
                <div
                  className="absolute inset-y-0 right-0 rounded-lg transition-all"
                  style={{
                    width: `${r.value}%`,
                    background: color,
                    opacity: r.gender === "בנות" ? 0.55 : 1,
                  }}
                />
              </div>
              <span className="w-12 shrink-0 text-left text-sm font-semibold tabular-nums sm:w-16">
                {r.value.toFixed(1)}%
              </span>
            </li>
          );
        })}
      </ul>
      <p className="pt-4 text-xs text-muted-foreground">
        העמודות בקנה מידה מלא של 0–100%. גוון בהיר = בנות, גוון מלא = בנים.
      </p>
    </Panel>
  );
}
