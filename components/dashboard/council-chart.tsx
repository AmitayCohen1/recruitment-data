"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { METRICS, type MetricKey } from "@/lib/data";
import { MetricTabs } from "./metric-tabs";

type CouncilRow = { council: string; value: number | null; schools: number };

export function CouncilChart({
  data,
  year,
}: {
  data: Record<MetricKey, CouncilRow[]>;
  year: number;
}) {
  const [metric, setMetric] = React.useState<MetricKey>("enlist");
  const rows = data[metric];
  const label = METRICS.find((m) => m.key === metric)!.short;
  const max = Math.max(...rows.map((r) => r.value ?? 0), 1);

  return (
    <Panel>
      <PanelHeader
        title="מועצות מובילות"
        subtitle={`ממוצע אחוז ${label} לפי מועצה (4+ בתי ספר), שנת ${year}`}
      >
        <MetricTabs value={metric} onChange={setMetric} />
      </PanelHeader>
      <ul className="space-y-2">
        {rows.map((r, i) => {
          const v = r.value ?? 0;
          return (
            <li key={r.council} className="flex items-center gap-3">
              <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span
                className="w-32 shrink-0 truncate text-sm text-foreground"
                title={`${r.council} · ${r.schools} בתי ספר`}
              >
                {r.council}
              </span>
              <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-white/5">
                <div
                  className="absolute inset-y-0 right-0 rounded-lg bg-gradient-to-l from-sky-400 to-violet-400 transition-all"
                  style={{ width: `${(v / max) * 100}%` }}
                />
              </div>
              <span className="w-14 shrink-0 text-sm font-semibold tabular-nums text-foreground">
                {v.toFixed(1)}%
              </span>
            </li>
          );
        })}
      </ul>
      <p className="pt-4 text-xs text-muted-foreground">
        רוחב העמודה יחסי למוביל בקטגוריה ({max.toFixed(1)}%)
      </p>
    </Panel>
  );
}
