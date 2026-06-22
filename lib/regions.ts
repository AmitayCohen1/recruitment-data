import data from "@/app/data/regions.json";

export type RGender = "בנים" | "בנות";
export type RMetric = "enlist" | "combat" | "officer";

export type RRow = {
  year: number;
  region: string;
  sector: string;
  gender: RGender;
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

export const R_METRICS: {
  key: RMetric;
  /** how to compute the displayed value */
  util: boolean;
  label: string;
}[] = [
  { key: "enlist", util: false, label: "שיעור גיוס" },
  {
    key: "combat",
    util: true,
    label: "קרביים ל־100",
  },
  {
    key: "officer",
    util: true,
    label: "קצינים ל־100",
  },
];

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Region ranking for a sector + gender + metric.
 *  For combat/officer the value is per 100 youth (enlist × rate / 100). */
export function regionView(
  sector: string,
  gender: RGender,
  metric: RMetric,
  year = RLATEST,
) {
  const def = R_METRICS.find((m) => m.key === metric)!;
  return REGIONS.flatMap((region) => {
    const row = RROWS.find(
      (x) =>
        x.year === year &&
        x.region === region &&
        x.sector === sector &&
        x.gender === gender,
    );
    if (!row || row.enlist === null) return [];
    const e = row.enlist;
    const rate = row[metric];
    if (rate === null && metric !== "enlist") return [];
    const value = def.util ? r1((e * (rate ?? 0)) / 100) : e;
    return [{ region, value, enlist: e, rate: rate ?? 0, n: row.n }];
  }).sort((a, b) => b.value - a.value);
}
