import raw from "@/app/data/recruitment.json";
import zeroRaw from "@/app/data/zero-schools.json";

export type Gender = "m" | "f";
export type MetricKey = "enlist" | "combat" | "officer" | "meaning";

export type Row = {
  year: number;
  gender: Gender;
  key: number;
  school: string;
  council: string | null;
  enlist: number | null;
  combat: number | null;
  officer: number | null;
  meaning: number | null;
};

const ROWS = raw as Row[];

export const GENDER_LABEL: Record<Gender, string> = {
  m: "בנים",
  f: "בנות",
};

export const YEARS = Array.from(new Set(ROWS.map((r) => r.year))).sort(
  (a, b) => a - b,
);
export const LATEST = YEARS[YEARS.length - 1];

const r1 = (n: number | null) => (n === null ? null : Math.round(n * 10) / 10);

/** Council ranking for one gender + metric (latest year), top N with min schools. */
export function councilRanking(
  metric: MetricKey,
  gender: Gender,
  n = 15,
  minSchools = 3,
  year = LATEST,
) {
  const vals = new Map<string, (number | null)[]>();
  for (const r of ROWS) {
    if (r.year !== year || r.gender !== gender || !r.council) continue;
    if (!vals.has(r.council)) vals.set(r.council, []);
    vals.get(r.council)!.push(r[metric]);
  }
  return Array.from(vals.entries())
    .map(([council, v]) => {
      const nums = v.filter((x): x is number => x !== null);
      return {
        council,
        value: nums.length ? r1(nums.reduce((a, b) => a + b, 0) / nums.length) : null,
        schools: nums.length,
      };
    })
    .filter((c) => c.value !== null && c.schools >= minSchools)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    .slice(0, n);
}

/** Top or bottom N schools for one gender + metric (latest year). */
export function topSchools(
  metric: MetricKey,
  gender: Gender,
  dir: "top" | "bottom" = "top",
  n = 10,
  year = LATEST,
) {
  const rows = ROWS.filter(
    (r) => r.year === year && r.gender === gender && r[metric] !== null,
  ).map((r) => ({
    key: r.key,
    school: r.school,
    council: r.council,
    value: r[metric] as number,
  }));
  rows.sort((a, b) => (dir === "top" ? b.value - a.value : a.value - b.value));
  return rows.slice(0, n);
}

/** Compact rows for the client-side explorer table. */
export type CompactRow = {
  k: number;
  y: number;
  g: Gender;
  s: string;
  c: string | null;
  e: number | null;
  cb: number | null;
  o: number | null;
  m: number | null;
};

export function compactRows(): CompactRow[] {
  return ROWS.map((r) => ({
    k: r.key,
    y: r.year,
    g: r.gender,
    s: r.school,
    c: r.council,
    e: r.enlist,
    cb: r.combat,
    o: r.officer,
    m: r.meaning,
  }));
}

export const TOTAL_SCHOOLS = new Set(ROWS.map((r) => r.key)).size;

/** Zero-enlistment schools (filtered out of the main analysis). Surfaced as an
 *  opt-in layer in the explorer for full transparency; combat/officer/meaning
 *  are undefined since there are no recruits. */
type ZeroRaw = { y: number; g: Gender; k: number; s: string; c: string | null };

export function zeroRows(): CompactRow[] {
  return (zeroRaw as ZeroRaw[]).map((r) => ({
    k: r.k,
    y: r.y,
    g: r.g,
    s: r.s,
    c: r.c,
    e: 0,
    cb: null,
    o: null,
    m: null,
  }));
}
