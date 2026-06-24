"use client";

import * as React from "react";
import { Contribution } from "./contribution";
import { EffectiveRate } from "./effective-rate";
import { SectorFunnel } from "./sector-funnel";
import { CombatParadox } from "./combat-paradox";
import { GenderToggle } from "./controls";
import { FilterBar, FilterField } from "./filter-bar";
import type { SGender } from "@/lib/sectors";

/** Comparisons section: one shared gender filter drives all four charts; each
 *  keeps its own metric control where relevant. (Gender-gap shows both genders
 *  by definition, so it lives outside this group.) */
export function GapsOverview() {
  const [gender, setGender] = React.useState<SGender>("בנים");

  return (
    <>
      <FilterBar>
        <FilterField label="מגדר">
          <GenderToggle value={gender} onChange={setGender} />
        </FilterField>
      </FilterBar>
      <Contribution gender={gender} />
      <EffectiveRate gender={gender} />
      <SectorFunnel gender={gender} />
      <CombatParadox gender={gender} />
    </>
  );
}
