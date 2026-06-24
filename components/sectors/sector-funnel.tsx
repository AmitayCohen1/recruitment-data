"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import {
  funnel,
  SECTORS,
  SECTOR_COLOR,
  SLATEST,
  type SGender,
} from "@/lib/sectors";
import { GenderToggle } from "./controls";

export function SectorFunnel() {
  const [gender, setGender] = React.useState<SGender>("בנים");

  return (
    <Panel>
      <PanelHeader
        title="מסלול הגיוס בכל מגזר"
        subtitle={`כמה מתוך 100 בני נוער עוברים מגיוס ללחימה ולקצונה · ${gender} · ${SLATEST}`}
      >
        <GenderToggle value={gender} onChange={setGender} />
      </PanelHeader>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SECTORS.map((s) => {
          const color = SECTOR_COLOR[s];
          const stages = funnel(s, gender);
          return (
            <div
              key={s}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <p className="mb-3 text-center text-sm font-semibold" style={{ color }}>
                {s}
              </p>
              <div className="space-y-2.5">
                {stages.map((st, idx) => (
                  <div key={st.stage}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {st.stage}
                      </span>
                      <span className="font-bold tabular-nums">{st.per100}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.04]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${st.per100}%`,
                          background: color,
                          opacity: 1 - idx * 0.28,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <p className="pt-4 text-xs text-muted-foreground">
        כל שלב מוצג ביחס ל־100 בני נוער במחזור, לא רק ביחס למתגייסים.
      </p>
    </Panel>
  );
}
