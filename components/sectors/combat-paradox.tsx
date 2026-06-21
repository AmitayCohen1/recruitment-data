"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import {
  profile,
  SECTOR_COLOR,
  SLATEST,
  type SGender,
} from "@/lib/sectors";
import { GenderToggle } from "./controls";

const A = "דתי לאומי";
const B = "חילוני";
const METRICS: { key: "enlist" | "combat" | "officer"; label: string }[] = [
  { key: "enlist", label: "🪖 גיוס" },
  { key: "combat", label: "⚔️ קרבי" },
  { key: "officer", label: "🎖️ קצונה" },
];

function Bar({ value, color }: { value: number | null; color: string }) {
  return (
    <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-white/[0.04]">
      <div
        className="absolute inset-y-0 right-0 rounded-md"
        style={{ width: `${value ?? 0}%`, background: color }}
      />
    </div>
  );
}

export function CombatParadox() {
  const [gender, setGender] = React.useState<SGender>("בנים");
  const a = profile(A, gender);
  const b = profile(B, gender);
  const cA = SECTOR_COLOR[A];
  const cB = SECTOR_COLOR[B];

  return (
    <Panel>
      <PanelHeader
        title="הפרדוקס: פחות מתגייסים, יותר נלחמים"
        subtitle={`${A} מול ${B}, ${gender}, ${SLATEST} — מתגייסים בשיעור נמוך יותר, אך מגיעים לתפקידים קרביים ולקצונה בשיעור גבוה יותר.`}
      >
        <GenderToggle value={gender} onChange={setGender} />
      </PanelHeader>

      <div className="mb-4 flex items-center justify-end gap-5 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full" style={{ background: cA }} />
          {A}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full" style={{ background: cB }} />
          {B}
        </span>
      </div>

      <div className="space-y-5">
        {METRICS.map((m) => (
          <div key={m.key}>
            <p className="mb-1.5 text-sm font-medium text-muted-foreground">
              {m.label}
            </p>
            <div className="flex items-center gap-3">
              <Bar value={a[m.key]} color={cA} />
              <span className="w-14 shrink-0 text-sm font-semibold tabular-nums" style={{ color: cA }}>
                {a[m.key] ?? "—"}%
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-3">
              <Bar value={b[m.key]} color={cB} />
              <span className="w-14 shrink-0 text-sm font-semibold tabular-nums" style={{ color: cB }}>
                {b[m.key] ?? "—"}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {gender === "בנים" && (
        <p className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-muted-foreground">
          בנים דתיים-לאומיים מתגייסים בשיעור נמוך ב־
          <span className="font-semibold text-foreground">
            {Math.round((b.enlist ?? 0) - (a.enlist ?? 0))} נק׳
          </span>{" "}
          מחילונים, אך שיעור הקרביים שלהם גבוה ב־
          <span className="font-semibold text-emerald-400">
            {Math.round((a.combat ?? 0) - (b.combat ?? 0))} נק׳
          </span>
          .
        </p>
      )}
    </Panel>
  );
}
