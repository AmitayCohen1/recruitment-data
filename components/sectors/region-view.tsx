"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import {
  R_METRICS,
  R_SECTORS,
  REGION_COLOR,
  RLATEST,
  regionView,
  type RGender,
  type RMetric,
} from "@/lib/regions";

const pill =
  "inline-flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1";
const btn = (active: boolean) =>
  cn(
    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
    active
      ? "bg-white/10 text-foreground shadow-sm"
      : "text-muted-foreground hover:text-foreground",
  );

export function RegionView() {
  const [sector, setSector] = React.useState<string>("הכל");
  const [gender, setGender] = React.useState<RGender>("בנים");
  const [metric, setMetric] = React.useState<RMetric>("combat");
  const def = R_METRICS.find((m) => m.key === metric)!;
  const rows = regionView(sector, gender, metric);
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <Panel>
      <PanelHeader
        title="אזורים"
        subtitle={
          def.util
            ? `${def.label} · ${sector === "הכל" ? "כל המגזרים" : sector} · ${gender} · ${RLATEST}`
            : `שיעור גיוס · ${sector === "הכל" ? "כל המגזרים" : sector} · ${gender} · ${RLATEST}`
        }
      >
        <div className="flex flex-wrap gap-2">
          {/* gender */}
          <div className={pill}>
            {(["בנים", "בנות"] as RGender[]).map((g) => (
              <button key={g} type="button" className={btn(gender === g)} onClick={() => setGender(g)}>
                {g === "בנים" ? "👨" : "👩"} {g}
              </button>
            ))}
          </div>
          {/* metric */}
          <div className={pill}>
            {R_METRICS.map((m) => (
              <button key={m.key} type="button" className={btn(metric === m.key)} onClick={() => setMetric(m.key)}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </PanelHeader>

      {/* sector filter */}
      <div className="mb-4 inline-flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {R_SECTORS.map((s) => (
          <button key={s} type="button" className={btn(sector === s)} onClick={() => setSector(s)}>
            {s}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          אין נתונים מספיקים עבור צירוף זה.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r, i) => {
            const color = REGION_COLOR[r.region] ?? "#94a3b8";
            return (
              <li key={r.region} className="flex items-center gap-3">
                <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <span className="w-24 shrink-0 truncate text-sm sm:w-32" style={{ color }}>
                  {r.region}
                </span>
                <div className="relative h-8 flex-1 overflow-hidden rounded-lg bg-white/[0.04]">
                  <div
                    className="absolute inset-y-0 right-0 rounded-lg"
                    style={{ width: `${(r.value / max) * 100}%`, background: color }}
                  />
                </div>
                {def.util && (
                  <span className="hidden w-24 shrink-0 text-left text-xs tabular-nums text-muted-foreground sm:block">
                    {r.enlist}% × {r.rate}%
                  </span>
                )}
                <span className="w-12 shrink-0 text-left text-base font-bold tabular-nums">
                  {def.util ? r.value : `${r.value}%`}
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <p className="pt-4 text-xs leading-5 text-muted-foreground">
        {def.util
          ? "קרבי וקצונה מוצגים ל־100 בני נוער."
          : "רוחב העמודה יחסי לערך הגבוה בתצוגה."}
      </p>
    </Panel>
  );
}
