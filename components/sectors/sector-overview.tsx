"use client";

import * as React from "react";
import { SectorDonuts } from "./sector-donuts";
import { SectorTrend } from "./sector-trend";
import { GenderToggle, MetricTabsS } from "./controls";
import type { SGender, SMetric } from "@/lib/sectors";

/** Sector overview: a top toolbar of controls drives both the per-sector
 *  snapshot (donuts) and the 2018→2024 trend line — filter once. */
export function SectorOverview() {
  const [metric, setMetric] = React.useState<SMetric>("enlist");
  const [gender, setGender] = React.useState<SGender>("בנים");

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
        <GenderToggle value={gender} onChange={setGender} />
        <MetricTabsS value={metric} onChange={setMetric} />
      </div>
      <SectorDonuts metric={metric} gender={gender} />
      <SectorTrend metric={metric} gender={gender} />
    </>
  );
}
