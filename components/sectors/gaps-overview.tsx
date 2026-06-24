"use client";

import * as React from "react";
import { Contribution } from "./contribution";
import { EffectiveRate } from "./effective-rate";
import { SectorFunnel } from "./sector-funnel";
import { CombatParadox } from "./combat-paradox";
import { GenderToggle } from "./controls";
import type { SGender } from "@/lib/sectors";

/** Comparisons section: one shared gender filter drives all four charts; each
 *  keeps its own metric control where relevant. (Gender-gap shows both genders
 *  by definition, so it lives outside this group.) */
export function GapsOverview() {
  const [gender, setGender] = React.useState<SGender>("בנים");

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="text-sm font-semibold text-foreground">
          סינון משותף לקטע זה
        </span>
        <GenderToggle value={gender} onChange={setGender} />
      </div>
      <Contribution gender={gender} />
      <EffectiveRate gender={gender} />
      <SectorFunnel gender={gender} />
      <CombatParadox gender={gender} />
    </>
  );
}
