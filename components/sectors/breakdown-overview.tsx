"use client";

import { Subgroups } from "./subgroups";
import { Leaderboards } from "./leaderboards";

/** Breakdowns & regions: each card owns its visible filters in the header.
 *  Each view keeps its own axis selector where it genuinely needs one. */
export function BreakdownOverview() {
  return (
    <>
      <Subgroups />
      <Leaderboards />
    </>
  );
}
