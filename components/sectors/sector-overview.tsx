"use client";

import * as React from "react";
import { SectorDonuts } from "./sector-donuts";
import { SectorChange } from "./sector-change";
import { GenderToggle, MetricTabsS } from "./controls";
import type { SGender, SMetric } from "@/lib/sectors";

/** Sector overview: one shared metric+gender filter drives both the per-sector
 *  donuts and the 2018→2024 change view, so the reader filters once. */
export function SectorOverview() {
  const [metric, setMetric] = React.useState<SMetric>("enlist");
  const [gender, setGender] = React.useState<SGender>("בנים");

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="text-sm font-semibold text-foreground">
          סינון משותף לקטע זה
        </span>
        <div className="flex flex-wrap gap-2">
          <GenderToggle value={gender} onChange={setGender} />
          <MetricTabsS value={metric} onChange={setMetric} />
        </div>
      </div>
      <SectorDonuts metric={metric} gender={gender} />
      <SectorChange metric={metric} gender={gender} />
    </>
  );
}
