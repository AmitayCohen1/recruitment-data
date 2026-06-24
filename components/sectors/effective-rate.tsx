"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import { effective, SECTOR_COLOR, type SGender } from "@/lib/sectors";
import { GenderToggle } from "./controls";

type EffMetric = "combat" | "officer";
export function EffectiveRate() {
  const [metric, setMetric] = React.useState<EffMetric>("combat");
  const [gender, setGender] = React.useState<SGender>("בנים");
  const rows = effective(metric, gender);
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <Panel>
      <PanelHeader
        title="לוחמים וקצינים מתוך 100 בני נוער"
        subtitle="כמה מכל 100 בני נוער מגיעים בפועל לשירות קרבי או לקצונה בכל מגזר."
      >
        <div className="flex flex-wrap gap-2">
          <GenderToggle value={gender} onChange={setGender} />
          <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {(["combat", "officer"] as EffMetric[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setMetric(k)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  metric === k
                    ? "bg-white/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {k === "combat" ? "⚔️ קרבי" : "🎖️ קצונה"}
              </button>
            ))}
          </div>
        </div>
      </PanelHeader>

      <ul className="space-y-3">
        {rows.map((r, i) => {
          const color = SECTOR_COLOR[r.sector];
          return (
            <li
              key={r.sector}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
            >
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="flex items-baseline gap-2 truncate text-sm font-medium">
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="truncate" style={{ color }}>
                    {r.sector}
                  </span>
                </span>
                <span className="flex shrink-0 items-baseline gap-2">
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {r.enlist}% × {r.rate}%
                  </span>
                  <span className="text-lg font-bold tabular-nums">
                    {r.value}
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
        חישוב המדד: שיעור גיוס מתוך המחזור × שיעור התפקיד מתוך המתגייסים.
      </p>
    </Panel>
  );
}
