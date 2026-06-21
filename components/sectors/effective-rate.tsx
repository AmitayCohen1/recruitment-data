"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import { effective, SECTOR_COLOR, SLATEST, type SGender } from "@/lib/sectors";
import { GenderToggle } from "./controls";

type EffMetric = "combat" | "officer";
const META: Record<EffMetric, { icon: string; noun: string }> = {
  combat: { icon: "⚔️", noun: "לוחמים קרביים" },
  officer: { icon: "🎖️", noun: "קצינים" },
};

export function EffectiveRate() {
  const [metric, setMetric] = React.useState<EffMetric>("combat");
  const [gender, setGender] = React.useState<SGender>("בנים");
  const rows = effective(metric, gender);
  const max = Math.max(...rows.map((r) => r.value), 1);
  const m = META[metric];

  return (
    <Panel>
      <PanelHeader
        title="התרומה האמיתית: על כל 100 בני נוער"
        subtitle={`כמה ${m.noun} יוצאים מכל 100 בני נוער במגזר (גיוס × שיעור התפקיד) — מדד התרומה לכלל השנתון, לא רק מבין המתגייסים. ${gender}, ${SLATEST}.`}
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
                {META[k].icon} {k === "combat" ? "קרביים" : "קצינים"}
              </button>
            ))}
          </div>
        </div>
      </PanelHeader>

      <ul className="space-y-3">
        {rows.map((r, i) => {
          const color = SECTOR_COLOR[r.sector];
          return (
            <li key={r.sector} className="flex items-center gap-3">
              <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span className="w-24 shrink-0 truncate text-sm sm:w-28" style={{ color }}>
                {r.sector}
              </span>
              <div className="relative h-8 flex-1 overflow-hidden rounded-lg bg-white/[0.04]">
                <div
                  className="absolute inset-y-0 right-0 rounded-lg"
                  style={{ width: `${(r.value / max) * 100}%`, background: color }}
                />
              </div>
              <span className="w-28 shrink-0 text-left text-xs tabular-nums text-muted-foreground">
                {r.enlist}% × {r.rate}%
              </span>
              <span className="w-12 shrink-0 text-left text-base font-bold tabular-nums">
                {r.value}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="pt-4 text-xs leading-5 text-muted-foreground">
        המספר הימני = אחוז הגיוס × שיעור התפקיד מבין המתגייסים. הנתון השמאלי ={" "}
        {m.noun} לכל 100 בני נוער במגזר. כך, למשל, מגזר שמתגייס פחות אך עם שיעור
        קרבי גבוה יכול לתרום יותר לוחמים פר נפש.
      </p>
    </Panel>
  );
}
