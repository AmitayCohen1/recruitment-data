"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import {
  SECTORS,
  SECTOR_COLOR,
  SLATEST,
  S_METRICS,
  subgroups,
  type SGender,
  type SMetric,
} from "@/lib/sectors";
import { GenderToggle, MetricTabsS } from "./controls";

export function Subgroups() {
  const [sector, setSector] = React.useState<string>("חרדי");
  const [gender, setGender] = React.useState<SGender>("בנים");
  const [metric, setMetric] = React.useState<SMetric>("enlist");
  const color = SECTOR_COLOR[sector];
  const rows = subgroups(sector, gender, metric);
  const max = Math.max(...rows.map((r) => (r[metric] as number) ?? 0), 1);
  const label = S_METRICS.find((m) => m.key === metric)!.label;

  return (
    <Panel>
      <PanelHeader
        title="תת-קבוצות"
        subtitle={`${label} · ${sector} · ${gender} · ${SLATEST}`}
      >
        <div className="flex flex-wrap gap-2">
          <GenderToggle value={gender} onChange={setGender} />
          <MetricTabsS value={metric} onChange={setMetric} />
        </div>
      </PanelHeader>

      <div className="mb-4 inline-flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/3 p-1">
        {SECTORS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSector(s)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              sector === s ? "text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
            style={sector === s ? { background: `${SECTOR_COLOR[s]}22`, color: SECTOR_COLOR[s] } : undefined}
          >
            {s}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          אין מספיק תת-קבוצות להצגה עבור צירוף זה.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {rows.map((r) => {
            const v = (r[metric] as number) ?? 0;
            const name = r.group.includes(" - ")
              ? r.group.split(" - ")[1]
              : r.group;
            return (
              <li key={r.group} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate text-sm sm:w-32" title={`${r.group} · ${r.n} בתי ספר`}>
                  {name}
                  <span className="block text-xs text-muted-foreground">
                    {r.n} בתי ספר
                  </span>
                </span>
                <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-white/4">
                  <div
                    className="absolute inset-y-0 right-0 rounded-lg transition-all"
                    style={{ width: `${(v / max) * 100}%`, background: color }}
                  />
                </div>
                <span className="w-14 shrink-0 text-left text-sm font-semibold tabular-nums">
                  {v.toFixed(1)}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <p className="pt-4 text-xs text-muted-foreground">רוחב העמודה יחסי לערך הגבוה בתצוגה.</p>
    </Panel>
  );
}
