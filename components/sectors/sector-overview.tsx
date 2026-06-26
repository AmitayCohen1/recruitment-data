"use client";

import * as React from "react";
import { SectorDonuts } from "./sector-donuts";
import { SectorTrend } from "./sector-trend";
import { GenderToggle, MetricTabsS } from "./controls";
import { FilterBar, FilterField } from "./filter-bar";
import type { SGender, SMetric } from "@/lib/sectors";
import { useT } from "@/components/i18n/locale-provider";

/** Sector overview: a shared gender+metric toolbar drives the per-sector donut
 *  snapshot and the 2018→2024 trend line — filter once, both update. */
export function SectorOverview() {
  const t = useT();
  const [metric, setMetric] = React.useState<SMetric>("enlist");
  const [gender, setGender] = React.useState<SGender>("בנים");

  return (
    <>
      <FilterBar>
        <FilterField label={t.common.fieldGender}>
          <GenderToggle value={gender} onChange={setGender} surface="overview" />
        </FilterField>
        <FilterField label={t.common.fieldMetric}>
          <MetricTabsS value={metric} onChange={setMetric} surface="overview" />
        </FilterField>
      </FilterBar>
      <SectorDonuts metric={metric} gender={gender} />
      <SectorTrend metric={metric} gender={gender} />
    </>
  );
}
