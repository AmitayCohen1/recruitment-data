import {
  compactRows,
  LATEST,
  YEARS,
  type Gender,
  type MetricKey,
} from "@/lib/data";
import { SECTORS, profile, SCHOOL_SECTOR, type SGender } from "@/lib/sectors";
import { cityRows, BIG_CITIES } from "@/lib/cities";

const ROWS = compactRows();
const FIELD: Record<MetricKey, keyof (typeof ROWS)[number]> = {
  enlist: "e",
  combat: "cb",
  officer: "o",
  meaning: "m",
};

const toS = (g: Gender): SGender => (g === "m" ? "בנים" : "בנות");

/* ------------------------------------------------------------------ *
 *  1) "Out of 100 youth" — the cascade per sector, as integer counts
 *     for a 10×10 waffle: of 100 in the cohort, how many enlist, of
 *     those how many serve in combat, of those how many are officers.
 * ------------------------------------------------------------------ */
export type Waffle = {
  sector: string;
  enlisted: number;
  combat: number;
  officer: number;
};

export function waffles(gender: Gender): Waffle[] {
  return SECTORS.map((s) => {
    const p = profile(s, toS(gender));
    const e = p.enlist ?? 0;
    const c = p.combat ?? 0;
    const o = p.officer ?? 0;
    return {
      sector: s,
      enlisted: Math.round(e),
      combat: Math.round((e * c) / 100),
      officer: Math.round((e * o) / 100),
    };
  });
}

/* ------------------------------------------------------------------ *
 *  2) Every school as a dot — the full distribution behind the
 *     averages, tagged by sector. (For a beeswarm.)
 * ------------------------------------------------------------------ */
export type SchoolDot = {
  key: number;
  school: string;
  council: string | null;
  value: number;
  sector: string | null;
};

export function schoolDots(
  gender: Gender,
  metric: MetricKey = "combat",
): SchoolDot[] {
  const f = FIELD[metric];
  return ROWS.flatMap((r) => {
    if (r.y !== LATEST || r.g !== gender) return [];
    const v = r[f] as number | null;
    if (v == null) return [];
    return [
      {
        key: r.k,
        school: r.s,
        council: r.c,
        value: v,
        sector: SCHOOL_SECTOR[String(r.k)] ?? null,
      },
    ];
  });
}

/* ------------------------------------------------------------------ *
 *  3) Biggest movers — councils whose rate shifted most from the
 *     first year to the latest. The story of change, not the snapshot.
 * ------------------------------------------------------------------ */
export type Mover = {
  council: string;
  from: number;
  to: number;
  delta: number;
  n: number;
};

export function movers(
  gender: Gender,
  metric: MetricKey = "combat",
  opts: { first?: number; minSchools?: number } = {},
): Mover[] {
  const f = FIELD[metric];
  const first = opts.first ?? 2018;
  const minSchools = opts.minSchools ?? 4;

  const mean = (year: number, council: string) => {
    const vals = ROWS.flatMap((r) =>
      r.y === year && r.g === gender && r.c === council && r[f] != null
        ? [r[f] as number]
        : [],
    );
    return vals.length
      ? { mean: vals.reduce((a, b) => a + b, 0) / vals.length, n: vals.length }
      : null;
  };

  const councils = [...new Set(ROWS.map((r) => r.c).filter((c): c is string => !!c))];
  const out: Mover[] = [];
  for (const council of councils) {
    const a = mean(first, council);
    const b = mean(LATEST, council);
    if (!a || !b || b.n < minSchools) continue;
    out.push({
      council,
      from: Math.round(a.mean * 10) / 10,
      to: Math.round(b.mean * 10) / 10,
      delta: Math.round((b.mean - a.mean) * 10) / 10,
      n: b.n,
    });
  }
  return out.sort((x, y) => y.delta - x.delta);
}

export const LAB_FIRST = 2018;
export const LAB_LAST = LATEST;

const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/* ------------------------------------------------------------------ *
 *  4) "Two armies" — every city placed by enlistment (x) and combat
 *     (y). Quadrant lines at the medians split the field.
 * ------------------------------------------------------------------ */
export type CityPoint = {
  council: string;
  enlist: number;
  combat: number;
  n: number;
  big: boolean;
};

export function cityScatter(
  gender: Gender,
  minSchools = 3,
): { points: CityPoint[]; medEnlist: number; medCombat: number } {
  const big = new Set<string>(BIG_CITIES);
  const points = cityRows(ROWS, gender, LATEST)
    .filter((c) => c.n >= minSchools && c.enlist != null && c.combat != null)
    .map((c) => ({
      council: c.council,
      enlist: c.enlist as number,
      combat: c.combat as number,
      n: c.n,
      big: big.has(c.council),
    }));
  return {
    points,
    medEnlist: Math.round(median(points.map((p) => p.enlist)) * 10) / 10,
    medCombat: Math.round(median(points.map((p) => p.combat)) * 10) / 10,
  };
}

/* ------------------------------------------------------------------ *
 *  5) Bump chart — each tracked city's RANK (among all qualifying
 *     cities) on the chosen metric, year by year.
 * ------------------------------------------------------------------ */
export type BumpPoint = { year: number; rank: number | null; value: number | null };
export type BumpSeries = { council: string; points: BumpPoint[] };

export function bump(
  gender: Gender,
  metric: MetricKey = "combat",
  cities: readonly string[] = BIG_CITIES,
  minSchools = 3,
): { years: number[]; maxRank: number; series: BumpSeries[] } {
  const f = metric;
  let maxRank = 0;
  const rankByYear = new Map<number, Map<string, { rank: number; value: number }>>();
  for (const year of YEARS) {
    const ranked = cityRows(ROWS, gender, year)
      .filter((c) => c.n >= minSchools && c[f] != null)
      .sort((a, b) => (b[f] as number) - (a[f] as number));
    maxRank = Math.max(maxRank, ranked.length);
    const m = new Map<string, { rank: number; value: number }>();
    ranked.forEach((c, i) => m.set(c.council, { rank: i + 1, value: c[f] as number }));
    rankByYear.set(year, m);
  }
  const series = cities.map((council) => ({
    council,
    points: YEARS.map((year) => {
      const hit = rankByYear.get(year)?.get(council);
      return { year, rank: hit?.rank ?? null, value: hit?.value ?? null };
    }),
  }));
  return { years: [...YEARS], maxRank, series };
}
