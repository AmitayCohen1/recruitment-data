import {
  compactRows,
  LATEST,
  YEARS,
  type Gender,
  type MetricKey,
} from "@/lib/data";
import {
  SECTORS,
  SYEARS,
  profile,
  SCHOOL_SECTOR,
  ROWS_S,
  SLATEST,
  sectorColor,
  type SGender,
  type SectorRow,
} from "@/lib/sectors";
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

/* ------------------------------------------------------------------ *
 *  6) Bubble race — every municipality placed in (xMetric, yMetric)
 *     space, one frame per year, for a Gapminder-style animation.
 *     Bubble size = number of schools. Axis bounds are global across
 *     all years so the field doesn't jump between frames.
 * ------------------------------------------------------------------ */
export type BubblePoint = {
  council: string;
  x: number;
  y: number;
  n: number;
  big: boolean;
};
export type BubbleFrame = { year: number; points: BubblePoint[] };

export function bubbleRace(
  gender: Gender,
  xMetric: MetricKey = "enlist",
  yMetric: MetricKey = "combat",
  minSchools = 3,
): {
  years: number[];
  frames: BubbleFrame[];
  xBounds: [number, number];
  yBounds: [number, number];
} {
  const big = new Set<string>(BIG_CITIES);
  const frames: BubbleFrame[] = YEARS.map((year) => ({
    year,
    points: cityRows(ROWS, gender, year)
      .filter(
        (c) => c.n >= minSchools && c[xMetric] != null && c[yMetric] != null,
      )
      .map((c) => ({
        council: c.council,
        x: c[xMetric] as number,
        y: c[yMetric] as number,
        n: c.n,
        big: big.has(c.council),
      })),
  }));
  const xs = frames.flatMap((f) => f.points.map((p) => p.x));
  const ys = frames.flatMap((f) => f.points.map((p) => p.y));
  const pad = (lo: number, hi: number): [number, number] => [
    Math.max(0, Math.floor((lo - 3) / 5) * 5),
    Math.min(100, Math.ceil((hi + 3) / 5) * 5),
  ];
  return {
    years: [...YEARS],
    frames,
    xBounds: xs.length ? pad(Math.min(...xs), Math.max(...xs)) : [0, 100],
    yBounds: ys.length ? pad(Math.min(...ys), Math.max(...ys)) : [0, 100],
  };
}

/* ------------------------------------------------------------------ *
 *  7) Ridgeline — the full national distribution of a metric across
 *     all schools, one smoothed density ridge per year, so the whole
 *     cohort's shift over time reads as a single stacked image.
 * ------------------------------------------------------------------ */
export type Ridge = { year: number; density: number[]; median: number; n: number };

export function ridgeline(
  gender: Gender,
  metric: MetricKey = "combat",
  bins = 50,
): { years: number[]; ridges: Ridge[]; maxDensity: number } {
  const f = FIELD[metric];
  const ridges: Ridge[] = YEARS.map((year) => {
    const hist = new Array(bins).fill(0);
    const vals: number[] = [];
    for (const r of ROWS) {
      if (r.y !== year || r.g !== gender) continue;
      const v = r[f] as number | null;
      if (v == null) continue;
      const bin = Math.min(bins - 1, Math.max(0, Math.floor((v / 100) * bins)));
      hist[bin] += 1;
      vals.push(v);
    }
    // light 3-tap smoothing, then normalize to a share-per-bin density
    const sm = hist.map((_, i) => {
      const a = hist[i - 1] ?? 0;
      const b = hist[i];
      const c = hist[i + 1] ?? 0;
      return (a + 2 * b + c) / 4;
    });
    const total = vals.length;
    const density = total ? sm.map((v) => v / total) : sm;
    return {
      year,
      density,
      median: Math.round(median(vals) * 10) / 10,
      n: total,
    };
  });
  const maxDensity = Math.max(0.0001, ...ridges.flatMap((r) => r.density));
  return { years: [...YEARS], ridges, maxDensity };
}

/* ------------------------------------------------------------------ *
 *  8) Sankey flow — the enlist → combat → officer pipeline for the
 *     whole population (latest year, one gender), built from the
 *     enlistee/cohort-weighted absolute counts. Each stage is split
 *     by sector so the ribbons keep their color as they narrow.
 * ------------------------------------------------------------------ */
export type SankeyStageKey = "cohort" | "enlist" | "combat" | "officer";
export type SankeySlice = { sector: string; color: string; value: number };
export type SankeyStage = { key: SankeyStageKey; total: number; slices: SankeySlice[] };

const COUNT_FIELD: Record<SankeyStageKey, keyof SectorRow> = {
  cohort: "nCohort",
  enlist: "nEnlistees",
  combat: "nFighters",
  officer: "nOfficers",
};
const SANKEY_STAGES: SankeyStageKey[] = ["cohort", "enlist", "combat", "officer"];

export function sankeyFlow(
  gender: Gender,
  year = SLATEST,
): { stages: SankeyStage[]; sectors: string[] } {
  const g = toS(gender);
  const rows = ROWS_S.filter((r) => r.year === year && r.gender === g);
  const sectors = SECTORS.filter((s) =>
    rows.some((r) => r.sector === s && (r.nCohort ?? 0) > 0),
  );
  const stages = SANKEY_STAGES.map((key) => {
    const field = COUNT_FIELD[key];
    const slices = sectors.map((sector) => {
      const r = rows.find((x) => x.sector === sector);
      return {
        sector,
        color: sectorColor(sector),
        value: (r?.[field] as number | undefined) ?? 0,
      };
    });
    return { key, total: slices.reduce((a, b) => a + b.value, 0), slices };
  });
  return { stages, sectors };
}

/* ------------------------------------------------------------------ *
 *  7b) Army composition — who actually fills the army over time. For
 *      each year, each sector's SHARE of all combat soldiers (or any
 *      absolute count), from the enlistee/cohort-weighted counts. A
 *      100%-stacked story: rates say one thing, head-counts another.
 * ------------------------------------------------------------------ */
export type CompField = "nFighters" | "nEnlistees" | "nOfficers" | "nCohort";
export type CompSeries = {
  sector: string;
  color: string;
  shares: number[]; // 0..100, one per year
  counts: number[]; // absolute, one per year
};

export function armyComposition(
  gender: Gender,
  field: CompField = "nFighters",
): { years: number[]; series: CompSeries[]; totals: number[] } {
  const g = toS(gender);
  const totals = SYEARS.map((year) =>
    SECTORS.reduce((sum, sector) => {
      const r = ROWS_S.find(
        (x) => x.year === year && x.sector === sector && x.gender === g,
      );
      return sum + ((r?.[field] as number | undefined) ?? 0);
    }, 0),
  );
  const series = SECTORS.map((sector) => {
    const counts = SYEARS.map((year) => {
      const r = ROWS_S.find(
        (x) => x.year === year && x.sector === sector && x.gender === g,
      );
      return (r?.[field] as number | undefined) ?? 0;
    });
    return {
      sector,
      color: sectorColor(sector),
      counts,
      shares: counts.map((c, i) =>
        totals[i] ? Math.round((1000 * c) / totals[i]) / 10 : 0,
      ),
    };
  });
  return { years: [...SYEARS], series, totals };
}

/* ------------------------------------------------------------------ *
 * 11) 3D school cloud — every school as a point in (enlist, combat,
 *     officer) space, colored by sector. Three real axes you can't
 *     show flat; orbit to read the joint distribution.
 * ------------------------------------------------------------------ */
export type CloudPoint = {
  key: number;
  school: string;
  council: string | null;
  sector: string | null;
  year: number;
  enlist: number;
  combat: number;
  officer: number;
};

/** Schools as points in (enlist, combat, officer) space. By default just the
 *  latest year (one point per school); with `allYears`, every school-year that
 *  reports all three rates becomes its own point, so a school traces a path
 *  across the years. */
export function schoolCloud(gender: Gender, allYears = false): CloudPoint[] {
  return ROWS.flatMap((r) => {
    if (r.g !== gender) return [];
    if (!allYears && r.y !== LATEST) return [];
    const e = r.e as number | null;
    const cb = r.cb as number | null;
    const o = r.o as number | null;
    if (e == null || cb == null || o == null) return [];
    return [
      {
        key: r.k,
        school: r.s,
        council: r.c,
        sector: SCHOOL_SECTOR[String(r.k)] ?? null,
        year: r.y,
        enlist: e,
        combat: cb,
        officer: o,
      },
    ];
  });
}

/* ------------------------------------------------------------------ *
 *  Parallel coordinates — one polyline per school across the three
 *  metrics (enlist → combat → officer), latest year. Unlike the
 *  scatter, this view shows the full multivariate profile, so the
 *  low-spread officer axis still reads honestly side by side.
 * ------------------------------------------------------------------ */
export const PARALLEL_AXES: { key: MetricKey; label?: string }[] = [
  { key: "enlist" },
  { key: "combat" },
  { key: "officer" },
];

export type SchoolProfile = {
  key: number;
  school: string;
  council: string | null;
  sector: string | null;
  enlist: number;
  combat: number;
  officer: number;
  meaning: number;
};

export function schoolProfiles(gender: Gender): SchoolProfile[] {
  return ROWS.flatMap((r) => {
    if (r.g !== gender || r.y !== LATEST) return [];
    const e = r.e as number | null;
    const cb = r.cb as number | null;
    const o = r.o as number | null;
    const m = r.m as number | null;
    if (e == null || cb == null || o == null || m == null) return [];
    return [
      {
        key: r.k,
        school: r.s,
        council: r.c,
        sector: SCHOOL_SECTOR[String(r.k)] ?? null,
        enlist: e,
        combat: cb,
        officer: o,
        meaning: m,
      },
    ];
  });
}

/* ------------------------------------------------------------------ *
 *  City trajectories — each tracked city's PATH through (enlist,
 *  combat) space, one node per year. The static, see-all-years
 *  counterpart to the animated bubble race.
 * ------------------------------------------------------------------ */
export type TrajPoint = { year: number; enlist: number; combat: number };
export type Trajectory = { council: string; points: TrajPoint[] };

export function cityTrajectories(
  gender: Gender,
  cities: readonly string[] = BIG_CITIES,
  minSchools = 3,
): { trajectories: Trajectory[]; xBounds: [number, number]; yBounds: [number, number] } {
  const want = new Set(cities);
  const byCity = new Map<string, TrajPoint[]>();
  for (const year of YEARS) {
    for (const c of cityRows(ROWS, gender, year)) {
      if (!want.has(c.council) || c.n < minSchools) continue;
      if (c.enlist == null || c.combat == null) continue;
      const arr = byCity.get(c.council) ?? [];
      arr.push({ year, enlist: c.enlist as number, combat: c.combat as number });
      byCity.set(c.council, arr);
    }
  }
  const trajectories = [...byCity.entries()]
    .map(([council, points]) => ({ council, points }))
    .filter((tr) => tr.points.length >= 2);
  const xs = trajectories.flatMap((tr) => tr.points.map((p) => p.enlist));
  const ys = trajectories.flatMap((tr) => tr.points.map((p) => p.combat));
  const pad = (lo: number, hi: number): [number, number] => [
    Math.max(0, Math.floor((lo - 3) / 5) * 5),
    Math.min(100, Math.ceil((hi + 3) / 5) * 5),
  ];
  return {
    trajectories,
    xBounds: xs.length ? pad(Math.min(...xs), Math.max(...xs)) : [0, 100],
    yBounds: ys.length ? pad(Math.min(...ys), Math.max(...ys)) : [0, 100],
  };
}

/* ------------------------------------------------------------------ *
 * 14) Sector bars — the core comparison (one bar per sector × metric),
 *     enlistee/cohort-weighted rates. Classic grouped-bar data, reused
 *     for the 3D bar matrix.
 * ------------------------------------------------------------------ */
export type SectorBar = {
  sector: string;
  color: string;
  enlist: number;
  combat: number;
  officer: number;
};

export function sectorBars(gender: Gender): SectorBar[] {
  return SECTORS.map((s) => {
    const p = profile(s, toS(gender));
    return {
      sector: s,
      color: sectorColor(s),
      enlist: Math.round(p.enlist ?? 0),
      combat: Math.round(p.combat ?? 0),
      officer: Math.round(p.officer ?? 0),
    };
  });
}

/* ------------------------------------------------------------------ *
 *  9) Outliers — fit outcome ≈ a·enlist + b across municipalities, then
 *     rank by residual: who lands far above/below what their enlistment
 *     rate predicts. The buck-the-trend story.
 * ------------------------------------------------------------------ */
export type OutlierMetric = Exclude<MetricKey, "enlist">;
export type OutlierPoint = {
  council: string;
  enlist: number;
  value: number;
  n: number;
  fitted: number;
  resid: number;
};

export function outliers(
  gender: Gender,
  metric: OutlierMetric = "combat",
  minSchools = 4,
  year = LATEST,
): {
  points: OutlierPoint[];
  slope: number;
  intercept: number;
  xBounds: [number, number];
  over: OutlierPoint[];
  under: OutlierPoint[];
} {
  const base = cityRows(ROWS, gender, year)
    .filter((c) => c.n >= minSchools && c.enlist != null && c[metric] != null)
    .map((c) => ({
      council: c.council,
      enlist: c.enlist as number,
      value: c[metric] as number,
      n: c.n,
    }));

  const N = base.length;
  const mx = base.reduce((a, b) => a + b.enlist, 0) / Math.max(1, N);
  const my = base.reduce((a, b) => a + b.value, 0) / Math.max(1, N);
  let sxy = 0;
  let sxx = 0;
  for (const p of base) {
    sxy += (p.enlist - mx) * (p.value - my);
    sxx += (p.enlist - mx) ** 2;
  }
  const slope = sxx ? sxy / sxx : 0;
  const intercept = my - slope * mx;

  const points: OutlierPoint[] = base
    .map((p) => {
      const fitted = slope * p.enlist + intercept;
      return {
        ...p,
        fitted: Math.round(fitted * 10) / 10,
        resid: Math.round((p.value - fitted) * 10) / 10,
      };
    })
    .sort((a, b) => b.resid - a.resid);

  const xs = base.map((p) => p.enlist);
  const xBounds: [number, number] = xs.length
    ? [
        Math.max(0, Math.floor((Math.min(...xs) - 3) / 5) * 5),
        Math.min(100, Math.ceil((Math.max(...xs) + 3) / 5) * 5),
      ]
    : [0, 100];

  return {
    points,
    slope,
    intercept,
    xBounds,
    over: points.slice(0, 6),
    under: points.slice(-6).reverse(),
  };
}
