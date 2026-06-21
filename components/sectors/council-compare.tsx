"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { councilRanking, LATEST, type Gender } from "@/lib/data";
import { S_METRICS, type SGender, type SMetric } from "@/lib/sectors";
import { GenderToggle, MetricTabsS } from "./controls";

const toG = (g: SGender): Gender => (g === "בנים" ? "m" : "f");

export function CouncilCompare() {
  const [metric, setMetric] = React.useState<SMetric>("enlist");
  const [gender, setGender] = React.useState<SGender>("בנים");
  const rows = councilRanking(metric, toG(gender), 15);
  const max = Math.max(...rows.map((r) => r.value ?? 0), 1);
  const label = S_METRICS.find((m) => m.key === metric)!.short;

  return (
    <Panel>
      <PanelHeader
        title="לפי עיר ומועצה"
        subtitle={`ערים ומועצות מובילות באחוז ${label} (3+ בתי ספר), ${gender}, ${LATEST}`}
      >
        <div className="flex flex-wrap gap-2">
          <GenderToggle value={gender} onChange={setGender} />
          <MetricTabsS value={metric} onChange={setMetric} />
        </div>
      </PanelHeader>
      <ul className="space-y-2">
        {rows.map((r, i) => {
          const v = r.value ?? 0;
          return (
            <li key={r.council} className="flex items-center gap-3">
              <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span className="w-20 shrink-0 truncate text-sm sm:w-32" title={`${r.council} · ${r.schools} בתי ספר`}>
                {r.council}
              </span>
              <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-white/[0.04]">
                <div
                  className="absolute inset-y-0 right-0 rounded-lg bg-gradient-to-l from-sky-400 to-indigo-400"
                  style={{ width: `${(v / max) * 100}%` }}
                />
              </div>
              <span className="w-14 shrink-0 text-left text-sm font-semibold tabular-nums">
                {v.toFixed(1)}%
              </span>
            </li>
          );
        })}
      </ul>
      <p className="pt-4 text-xs text-muted-foreground">
        רוחב יחסי למוביל בקטגוריה. רק רשויות עם 3 בתי ספר ומעלה.
      </p>
    </Panel>
  );
}
