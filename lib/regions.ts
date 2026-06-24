import data from "@/app/data/regions.json";
import type { SGender, SMetric } from "@/lib/sectors";

export type RRow = {
  year: number;
  region: string;
  sector: string;
  gender: SGender;
  n: number;
  enlist: number | null;
  combat: number | null;
  officer: number | null;
  meaning: number | null;
};

export const REGIONS = data.regions as string[];
export const R_SECTORS = data.sectors as string[]; // ['הכל','חילוני','דתי לאומי','חרדי']
export const RYEARS = data.years as number[];
export const RLATEST = RYEARS[RYEARS.length - 1];
const RROWS = data.rows as RRow[];

export const REGION_COLOR: Record<string, string> = {
  מרכז: "#38bdf8", // sky
  פריפריה: "#fbbf24", // amber
  "כפרי/קיבוצים": "#34d399", // emerald
  התנחלויות: "#c084fc", // purple
  ירושלים: "#f472b6", // pink
};

/** Region ranking for a sector + gender by the chosen rate metric (raw %),
 *  using the same metric vocabulary as the rest of the dashboard. */
export function regionView(
  sector: string,
  gender: SGender,
  metric: SMetric,
  year = RLATEST,
) {
  return REGIONS.flatMap((region) => {
    const row = RROWS.find(
      (x) =>
        x.year === year &&
        x.region === region &&
        x.sector === sector &&
        x.gender === gender,
    );
    const value = row ? row[metric] : null;
    if (!row || value === null) return [];
    return [{ region, value, n: row.n }];
  }).sort((a, b) => b.value - a.value);
}
