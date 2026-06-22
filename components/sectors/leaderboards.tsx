"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { topSchools, LATEST, type Gender, type MetricKey } from "@/lib/data";
import { SCHOOL_SECTOR, SECTOR_COLOR, S_METRICS, type SGender, type SMetric } from "@/lib/sectors";
import { GenderToggle, MetricTabsS } from "./controls";

const toG = (g: SGender): Gender => (g === "בנים" ? "m" : "f");

function List({
  metric,
  gender,
  dir,
  title,
}: {
  metric: MetricKey;
  gender: Gender;
  dir: "top" | "bottom";
  title: string;
}) {
  const rows = topSchools(metric, gender, dir, 10);
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-muted-foreground">{title}</p>
      <ul className="divide-y divide-white/5">
        {rows.map((r, i) => {
          const sec = SCHOOL_SECTOR[String(r.key)];
          const color = sec ? SECTOR_COLOR[sec] : "#64748b";
          return (
            <li key={`${r.key}-${r.school}`} className="flex items-center gap-3 py-2">
              <span className="w-4 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: color }}
                title={sec || "לא מסווג"}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-foreground">{r.school}</div>
                {r.council && (
                  <div className="truncate text-xs text-muted-foreground">{r.council}</div>
                )}
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums">
                {r.value.toFixed(1)}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Leaderboards() {
  const [metric, setMetric] = React.useState<SMetric>("combat");
  const [gender, setGender] = React.useState<SGender>("בנים");
  const label = S_METRICS.find((m) => m.key === metric)!.label;
  const g = toG(gender);

  return (
    <Panel>
      <PanelHeader
        title="בתי ספר"
        subtitle={`${label} · ${gender} · ${LATEST}`}
      >
        <div className="flex flex-wrap gap-2">
          <GenderToggle value={gender} onChange={setGender} />
          <MetricTabsS value={metric} onChange={setMetric} />
        </div>
      </PanelHeader>
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
        <List metric={metric} gender={g} dir="top" title="הערכים הגבוהים ביותר" />
        <List metric={metric} gender={g} dir="bottom" title="הערכים הנמוכים ביותר" />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span>הנקודה הצבעונית = מגזר:</span>
        {Object.entries(SECTOR_COLOR).map(([s, c]) => (
          <span key={s} className="flex items-center gap-1">
            <span className="size-2 rounded-full" style={{ background: c }} />
            {s}
          </span>
        ))}
      </div>
    </Panel>
  );
}
