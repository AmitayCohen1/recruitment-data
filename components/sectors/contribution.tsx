"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import {
  contribution,
  ABS_METRICS,
  SECTOR_COLOR,
  SLATEST,
  type AbsMetric,
  type SGender,
} from "@/lib/sectors";
import { GenderToggle } from "./controls";

export function Contribution() {
  const [metric, setMetric] = React.useState<AbsMetric>("nFighters");
  const [gender, setGender] = React.useState<SGender>("בנים");
  const rows = contribution(metric, gender);
  const def = ABS_METRICS.find((m) => m.key === metric)!;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const noun = def.label.replace(/^\S+\s/, ""); // strip emoji

  return (
    <Panel>
      <PanelHeader
        title="תרומה בפועל במספרים מוחלטים"
        subtitle={`כמה ${noun} מגיעים מכל מגזר ומה חלקם מכלל הסך הארצי · ${gender} · ${SLATEST}`}
      >
        <div className="flex flex-wrap gap-2">
          <GenderToggle value={gender} onChange={setGender} />
          <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
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
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </PanelHeader>

      <ul className="space-y-3">
        {rows.map((r) => {
          const color = SECTOR_COLOR[r.sector];
          return (
            <li
              key={r.sector}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
            >
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="flex items-baseline gap-2 truncate text-sm font-medium">
                  <span className="truncate" style={{ color }}>
                    {r.sector}
                  </span>
                  {r.rate != null && (
                    <span className="text-xs tabular-nums text-muted-foreground">
                      ({r.rate}% מתוך המתגייסים)
                    </span>
                  )}
                </span>
                <span className="flex shrink-0 items-baseline gap-2">
                  <span className="text-lg font-bold tabular-nums">
                    {r.value.toLocaleString("he")}
                  </span>
                  <span className="w-10 text-sm font-semibold tabular-nums text-muted-foreground">
                    {r.share}%
                  </span>
                </span>
              </div>
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
                <div
                  className="absolute inset-y-0 right-0 rounded-full"
                  style={{ width: `${(r.value / max) * 100}%`, background: color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="pt-4 text-xs leading-5 text-muted-foreground">
        שיעור גבוה אינו בהכרח תרומה מוחלטת גבוהה: מגזר גדול עם שיעור בינוני עשוי
        לספק יותר לוחמים ממגזר קטן עם שיעור גבוה. המספרים המוחלטים מוערכים לפי
        גודל המחזור ושיעור המדד.
      </p>
    </Panel>
  );
}
