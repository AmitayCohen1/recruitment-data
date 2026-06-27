"use client";

import { SectorDonuts } from "./sector-donuts";

/** Sector overview: keep the filter controls in the chart card header so the
 *  tab uses the same placement pattern as the rest of the dashboard. */
export function SectorOverview() {
  return (
    <>
      <SectorDonuts />
    </>
  );
}
