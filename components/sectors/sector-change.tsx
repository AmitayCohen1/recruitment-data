"use client";

import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import {
  change,
  SECTOR_COLOR,
  SFIRST,
  SLATEST,
  S_METRICS,
  type SGender,
  type SMetric,
} from "@/lib/sectors";
import { GenderToggle, MetricTabsS } from "./controls";

export function SectorChange() {
  const [metric, setMetric] = React.useState<SMetric>("enlist");
  const [gender, setGender] = React.useState<SGender>("בנות");
  const rows = change(metric, gender).sort((a, b) => b.to - a.to);
  const label = S_METRICS.find((m) => m.key === metric)!.label;

  return (
    <Panel>
      <PanelHeader
        title="שינוי לפי מגזר"
        subtitle={`${label} · ${gender} · ${SFIRST}–${SLATEST}`}
      >
        <div className="flex flex-wrap gap-2">
          <GenderToggle value={gender} onChange={setGender} />
          <MetricTabsS value={metric} onChange={setMetric} />
        </div>
      </PanelHeader>

      <div className="space-y-5 pt-1">
        {rows.map((r) => {
          const color = SECTOR_COLOR[r.sector];
          const up = r.delta >= 0;
          const lo = Math.min(r.from, r.to);
          const hi = Math.max(r.from, r.to);
          return (
            <div key={r.sector} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-sm" style={{ color }}>
                {r.sector}
              </span>
              <div className="relative h-6 flex-1">
                {/* baseline */}
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/10" />
                {/* connector */}
                <div
                  className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
                  style={{
                    right: `${lo}%`,
                    width: `${hi - lo}%`,
                    background: color,
                    opacity: 0.4,
                  }}
                />
                {/* 2018 hollow dot */}
                <span
                  className="absolute top-1/2 size-3 -translate-y-1/2 translate-x-1/2 rounded-full border-2 bg-background"
                  style={{ right: `${r.from}%`, borderColor: color }}
                  title={`${SFIRST}: ${r.from}%`}
                />
                {/* 2024 filled dot */}
                <span
                  className="absolute top-1/2 size-3.5 -translate-y-1/2 translate-x-1/2 rounded-full"
                  style={{ right: `${r.to}%`, background: color }}
                  title={`${SLATEST}: ${r.to}%`}
                />
              </div>
              <span className="w-16 shrink-0 text-left text-sm tabular-nums text-muted-foreground">
                {r.from}→{r.to}
              </span>
              <span
                className={`flex w-16 shrink-0 items-center justify-end gap-0.5 text-sm font-semibold tabular-nums ${
                  up ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                {up ? "+" : ""}
                {r.delta}
              </span>
            </div>
          );
        })}
      </div>
      <p className="pt-5 text-xs text-muted-foreground">
        עיגול חלול = {SFIRST}. עיגול מלא = {SLATEST}.
      </p>
    </Panel>
  );
}
