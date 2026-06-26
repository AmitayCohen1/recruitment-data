"use client";

import * as React from "react";
import { Contribution } from "./contribution";
import { CombatParadox } from "./combat-paradox";
import { GenderToggle } from "./controls";
import { FilterBar, FilterField } from "./filter-bar";
import type { SGender } from "@/lib/sectors";
import { useT } from "@/components/i18n/locale-provider";

/** "Why it differs": one shared gender filter drives the two complementary
 *  views — absolute contribution (volume) and rate-vs-volume. The per-100
 *  effective-rate and the funnel were folded away; they re-argued the same
 *  point. (Gender-gap shows both genders by definition, so it lives outside.) */
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
      <CombatParadox gender={gender} />
    </>
  );
}
