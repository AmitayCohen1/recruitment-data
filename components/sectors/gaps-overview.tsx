"use client";

import * as React from "react";
import { Contribution } from "./contribution";
import { EffectiveRate } from "./effective-rate";
import { SectorFunnel } from "./sector-funnel";
import { CombatParadox } from "./combat-paradox";
import { GenderToggle } from "./controls";
import { FilterBar, FilterField } from "./filter-bar";
import type { SGender } from "@/lib/sectors";
import { useT } from "@/components/i18n/locale-provider";

/** Comparisons section: one shared gender filter drives all four charts; each
 *  keeps its own metric control where relevant. (Gender-gap shows both genders
 *  by definition, so it lives outside this group.) */
export function GapsOverview() {
  const t = useT();
  const [gender, setGender] = React.useState<SGender>("בנים");

  return (
    <>
      <FilterBar>
        <FilterField label={t.common.fieldGender}>
          <GenderToggle value={gender} onChange={setGender} surface="gaps" />
        </FilterField>
      </FilterBar>
      <Contribution gender={gender} />
      <EffectiveRate gender={gender} />
      <SectorFunnel gender={gender} />
      <CombatParadox gender={gender} />
    </>
  );
}
