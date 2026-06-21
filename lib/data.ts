import raw from "@/app/data/recruitment.json";

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

export const METRICS: { key: MetricKey; label: string; short: string }[] = [
  { key: "enlist", label: "אחוז גיוס", short: "גיוס" },
  { key: "combat", label: "אחוז לחימה", short: "לחימה" },
  { key: "officer", label: "אחוז קצונה", short: "קצונה" },
  { key: "meaning", label: "שירות משמעותי", short: "משמעותי" },
];

export const GENDER_LABEL: Record<Gender, string> = {
  m: "בנים",
  f: "בנות",
};

export const YEARS = Array.from(new Set(ROWS.map((r) => r.year))).sort(
  (a, b) => a - b,
);
export const LATEST = YEARS[YEARS.length - 1];

function mean(values: (number | null)[]): number | null {
  const v = values.filter((x): x is number => x !== null);
  if (!v.length) return null;
  return v.reduce((a, b) => a + b, 0) / v.length;
}

const r1 = (n: number | null) => (n === null ? null : Math.round(n * 10) / 10);

/** Average of each metric per year, split by gender. */
export function trendByYear() {
  return YEARS.map((year) => {
    const out: Record<string, number | null> & { year: number } = { year };
    for (const g of ["m", "f"] as Gender[]) {
      const rows = ROWS.filter((r) => r.year === year && r.gender === g);
      for (const m of METRICS) {
        out[`${m.key}_${g}`] = r1(mean(rows.map((r) => r[m.key])));
      }
    }
    return out;
  });
}

/** Overall latest-year average per metric + delta vs previous year. */
export function kpis() {
  const prev = YEARS[YEARS.length - 2];
  return METRICS.map((m) => {
    const cur = mean(ROWS.filter((r) => r.year === LATEST).map((r) => r[m.key]));
    const before = mean(
      ROWS.filter((r) => r.year === prev).map((r) => r[m.key]),
    );
    return {
      key: m.key,
      label: m.label,
      value: r1(cur),
      delta: cur !== null && before !== null ? r1(cur - before) : null,
      prevYear: prev,
    };
  });
}

/** Latest-year average per metric, boys vs girls. */
export function genderComparison() {
  return METRICS.map((m) => ({
    metric: m.short,
    label: m.label,
    m: r1(mean(ROWS.filter((r) => r.year === LATEST && r.gender === "m").map((r) => r[m.key]))),
    f: r1(mean(ROWS.filter((r) => r.year === LATEST && r.gender === "f").map((r) => r[m.key]))),
  }));
}

/** Top councils by a metric (latest year, both genders), with at least minSchools. */
export function topCouncils(metric: MetricKey, n = 12, minSchools = 4) {
  const byCouncil = new Map<string, (number | null)[]>();
  const schools = new Map<string, Set<number>>();
  for (const r of ROWS) {
    if (r.year !== LATEST || !r.council) continue;
    if (!byCouncil.has(r.council)) {
      byCouncil.set(r.council, []);
      schools.set(r.council, new Set());
    }
    byCouncil.get(r.council)!.push(r[metric]);
    schools.get(r.council)!.add(r.key);
  }
  return Array.from(byCouncil.entries())
    .map(([council, vals]) => ({
      council,
      value: r1(mean(vals)),
      schools: schools.get(council)!.size,
    }))
    .filter((c) => c.value !== null && c.schools >= minSchools)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    .slice(0, n);
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
export const TOTAL_COUNCILS = new Set(
  ROWS.filter((r) => r.council).map((r) => r.council),
).size;

/** Shared series colors (also used as recharts fills). */
export const SERIES = {
  boys: "#38bdf8", // sky
  girls: "#a78bfa", // violet
  low: "#fb7185", // rose
  mid: "#fbbf24", // amber
  high: "#34d399", // emerald
} as const;

/** Histogram: how many schools fall in each band of a metric (latest year). */
const BANDS = [
  { label: "<50%", min: -1, max: 50, tone: "low" as const },
  { label: "50–60%", min: 50, max: 60, tone: "low" as const },
  { label: "60–70%", min: 60, max: 70, tone: "mid" as const },
  { label: "70–80%", min: 70, max: 80, tone: "mid" as const },
  { label: "80–90%", min: 80, max: 90, tone: "high" as const },
  { label: "90–100%", min: 90, max: 101, tone: "high" as const },
];

export function distribution(metric: MetricKey = "enlist", year = LATEST) {
  return BANDS.map((b) => {
    const inBand = (g: Gender) =>
      ROWS.filter(
        (r) =>
          r.year === year &&
          r.gender === g &&
          r[metric] !== null &&
          (r[metric] as number) > b.min &&
          (r[metric] as number) <= b.max,
      ).length;
    return { band: b.label, tone: b.tone, m: inBand("m"), f: inBand("f") };
  });
}

/** Average combat % per enlistment band (latest year), split by gender.
 *  Shows whether combat rate actually rises with enlistment. */
export function combatByEnlistBand(year = LATEST) {
  return BANDS.map((b) => {
    const avgFor = (g: Gender) =>
      r1(
        mean(
          ROWS.filter(
            (r) =>
              r.year === year &&
              r.gender === g &&
              r.enlist !== null &&
              (r.enlist as number) > b.min &&
              (r.enlist as number) <= b.max &&
              r.combat !== null,
          ).map((r) => r.combat),
        ),
      );
    return { band: b.label, m: avgFor("m"), f: avgFor("f") };
  });
}

/** Scatter points: enlistment (x) vs combat (y) per school, latest year. */
export type ScatterPt = {
  x: number;
  y: number;
  school: string;
  council: string | null;
};

export function scatter(year = LATEST) {
  const pts: { m: ScatterPt[]; f: ScatterPt[] } = { m: [], f: [] };
  for (const r of ROWS) {
    if (r.year !== year || r.enlist === null || r.combat === null) continue;
    pts[r.gender].push({
      x: r.enlist,
      y: r.combat,
      school: r.school,
      council: r.council,
    });
  }
  return pts;
}

/** Biggest movers between a base year and the latest year, per school+gender. */
export function schoolMovers(
  metric: MetricKey = "enlist",
  baseYear = YEARS[0],
  n = 8,
) {
  const base = new Map<string, number>();
  for (const r of ROWS) {
    if (r.year === baseYear && r[metric] !== null)
      base.set(`${r.key}-${r.gender}`, r[metric] as number);
  }
  const moves: {
    school: string;
    gender: Gender;
    council: string | null;
    base: number;
    latest: number;
    delta: number;
  }[] = [];
  for (const r of ROWS) {
    if (r.year !== LATEST || r[metric] === null) continue;
    const b = base.get(`${r.key}-${r.gender}`);
    if (b === undefined) continue;
    moves.push({
      school: r.school,
      gender: r.gender,
      council: r.council,
      base: r1(b)!,
      latest: r1(r[metric])!,
      delta: r1((r[metric] as number) - b)!,
    });
  }
  const sorted = [...moves].sort((a, b) => b.delta - a.delta);
  return {
    baseYear,
    up: sorted.slice(0, n),
    down: sorted.slice(-n).reverse(),
  };
}

/** Headline facts for the highlights strip. */
export function highlights() {
  const y = ROWS.filter((r) => r.year === LATEST && r.enlist !== null);
  const share = (pred: (v: number) => boolean) =>
    Math.round((y.filter((r) => pred(r.enlist as number)).length / y.length) * 100);
  const boys = mean(
    ROWS.filter((r) => r.year === LATEST && r.gender === "m").map((r) => r.enlist),
  );
  const girls = mean(
    ROWS.filter((r) => r.year === LATEST && r.gender === "f").map((r) => r.enlist),
  );
  return {
    highEnlist: share((v) => v >= 90),
    lowEnlist: share((v) => v < 50),
    genderGap: boys !== null && girls !== null ? r1(boys - girls) : null,
    combatAvg: r1(
      mean(ROWS.filter((r) => r.year === LATEST).map((r) => r.combat)),
    ),
  };
}
