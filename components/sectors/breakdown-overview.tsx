"use client";

import * as React from "react";
import { Subgroups } from "./subgroups";
import { Leaderboards } from "./leaderboards";
import { GenderToggle, MetricTabsS } from "./controls";
import { FilterBar, FilterField } from "./filter-bar";
import type { SGender, SMetric } from "@/lib/sectors";
import { useT } from "@/components/i18n/locale-provider";

/** Breakdowns & regions: one shared gender+metric filter drives the subgroup,
 *  region, and school-extremes views. Each view keeps only its own axis
 *  selector (e.g. which sector to drill into) where it genuinely needs one. */
export function BreakdownOverview() {
  const t = useT();
  const [metric, setMetric] = React.useState<SMetric>("enlist");
  const [gender, setGender] = React.useState<SGender>("בנים");

  return (
    <>
      <FilterBar>
        <FilterField label={t.common.fieldGender}>
          <GenderToggle value={gender} onChange={setGender} surface="breakdown" />
        </FilterField>
        <FilterField label={t.common.fieldMetric}>
          <MetricTabsS value={metric} onChange={setMetric} surface="breakdown" />
        </FilterField>
      </FilterBar>
      <Subgroups metric={metric} gender={gender} />
      <Leaderboards metric={metric} gender={gender} />
    </>
  );
}
