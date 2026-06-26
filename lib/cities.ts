import { YEARS, type CompactRow, type Gender, type MetricKey } from "@/lib/data";
import { SCHOOL_SECTOR } from "@/lib/sectors";

/** A city (רשות מקומית / מועצה) aggregated from its schools, for one year + gender.
 *
 *  IMPORTANT — this is an UNWEIGHTED school-average: every school in the city
 *  counts equally, because the per-school source has only rates, no student or
 *  enlistee counts. It therefore does NOT match the sector/region views, whose
 *  combat/enlist numbers are properly enlistee/cohort-weighted from the published
 *  file (which has no city breakdown). Surface it as a "ממוצע בתי ספר" and lean on
 *  `n` + a minimum-schools filter so single-school towns don't skew a plain mean. */
export type CityRow = {
  council: string;
  /** number of schools contributing in this city (year + gender) */
  n: number;
  enlist: number | null;
  combat: number | null;
  officer: number | null;
  meaning: number | null;
};

/** Israel's largest cities by population, in order — featured above the table.
 *  Names match the canonical council spellings in the dataset (see
 *  COUNCIL_CANON in build_app_data.py); confirmed present across all years. */
export const BIG_CITIES = [
  "ירושלים",
  "תל אביב - יפו",
  "חיפה",
  "ראשון לציון",
  "פתח תקווה",
  "אשדוד",
] as const;

const METRICS: MetricKey[] = ["enlist", "combat", "officer", "meaning"];

/** Aggregate the already-loaded compact rows into one row per city.
 *  Each metric is the mean over the schools that report it (nulls skipped);
 *  `n` is the school count in the city for that year + gender. */
export function cityRows(
  rows: CompactRow[],
  gender: Gender,
  year: number,
  sector?: string,
): CityRow[] {
  const groups = new Map<string, CompactRow[]>();
  for (const r of rows) {
    if (r.y !== year || r.g !== gender || !r.c) continue;
    if (sector && SCHOOL_SECTOR[String(r.k)] !== sector) continue;
    const g = groups.get(r.c);
    if (g) g.push(r);
    else groups.set(r.c, [r]);
  }

  const field: Record<MetricKey, keyof CompactRow> = {
    enlist: "e",
    combat: "cb",
    officer: "o",
    meaning: "m",
  };

  const out: CityRow[] = [];
  for (const [council, group] of groups) {
    const mean = (metric: MetricKey): number | null => {
      const vals = group
        .map((r) => r[field[metric]] as number | null)
        .filter((v): v is number => v !== null);
      if (vals.length === 0) return null;
      return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
    };
    out.push({
      council,
      n: group.length,
      ...(Object.fromEntries(METRICS.map((m) => [m, mean(m)])) as Pick<
        CityRow,
        MetricKey
      >),
    });
  }
  return out;
}

/** Split aggregated rows into the featured cities (in the given order, defaulting
 *  to BIG_CITIES, with an empty placeholder when a city has no data this year) and
 *  the rest. `names` lets the UI add/remove which cities are featured. */
export function splitFeatured(
  rows: CityRow[],
  names: readonly string[] = BIG_CITIES,
): {
  featured: CityRow[];
  rest: CityRow[];
} {
  const byName = new Map(rows.map((r) => [r.council, r]));
  const big = new Set<string>(names);
  const featured = names.map(
    (c): CityRow =>
      byName.get(c) ?? {
        council: c,
        n: 0,
        enlist: null,
        combat: null,
        officer: null,
        meaning: null,
      },
  );
  const rest = rows.filter((r) => !big.has(r.council));
  return { featured, rest };
}

const FIELD: Record<MetricKey, keyof CompactRow> = {
  enlist: "e",
  combat: "cb",
  officer: "o",
  meaning: "m",
};

export type CitySectorRow = {
  /** Hebrew sector name (חילוני / דתי לאומי / חרדי / דרוזי), or "אחר" if untagged. */
  sector: string;
  n: number;
  enlist: number | null;
  combat: number | null;
  officer: number | null;
  meaning: number | null;
};

const SECTOR_ORDER = ["חילוני", "דתי לאומי", "חרדי", "דרוזי", "אחר"];

/** A city's schools split by sector, for one year + gender. Reveals that a mixed
 *  city's overall average pools very different populations (e.g. Jerusalem's
 *  secular ~89% vs Haredi ~11%). Untagged schools fall into "אחר". */
export function citySectorBreakdown(
  rows: CompactRow[],
  council: string,
  gender: Gender,
  year: number,
): CitySectorRow[] {
  const groups = new Map<string, CompactRow[]>();
  for (const r of rows) {
    if (r.y !== year || r.g !== gender || r.c !== council) continue;
    const sector = SCHOOL_SECTOR[String(r.k)] ?? "אחר";
    const g = groups.get(sector);
    if (g) g.push(r);
    else groups.set(sector, [r]);
  }
  const out: CitySectorRow[] = [];
  for (const [sector, group] of groups) {
    const mean = (metric: MetricKey): number | null => {
      const f = FIELD[metric];
      const vals = group
        .map((r) => r[f] as number | null)
        .filter((v): v is number => v !== null);
      return vals.length
        ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
        : null;
    };
    out.push({
      sector,
      n: group.length,
      enlist: mean("enlist"),
      combat: mean("combat"),
      officer: mean("officer"),
      meaning: mean("meaning"),
    });
  }
  out.sort(
    (a, b) => SECTOR_ORDER.indexOf(a.sector) - SECTOR_ORDER.indexOf(b.sector),
  );
  return out;
}

/** One metric's value per year for a city + gender (optionally a single sector) —
 *  for the multi-city trend chart. Mean over the matching schools each year. */
export function cityTrend(
  rows: CompactRow[],
  council: string,
  gender: Gender,
  metric: MetricKey,
  sector?: string,
): { year: number; value: number | null }[] {
  const f = FIELD[metric];
  return YEARS.map((year) => {
    const vals = rows
      .filter(
        (r) =>
          r.y === year &&
          r.g === gender &&
          r.c === council &&
          (!sector || SCHOOL_SECTOR[String(r.k)] === sector),
      )
      .map((r) => r[f] as number | null)
      .filter((v): v is number => v !== null);
    const value = vals.length
      ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
      : null;
    return { year, value };
  });
}

/** Multi-city trend: [{ year, <city>: value, … }] for the given cities — one row
 *  per year, one key per city — ready for a multi-line chart. */
export function citiesTrend(
  rows: CompactRow[],
  councils: readonly string[],
  gender: Gender,
  metric: MetricKey,
  sector?: string,
): Array<Record<string, number | null>> {
  const perCity = councils.map((c) => ({
    council: c,
    series: cityTrend(rows, c, gender, metric, sector),
  }));
  return YEARS.map((year, i) => {
    const row: Record<string, number | null> = { year };
    for (const { council, series } of perCity) row[council] = series[i].value;
    return row;
  });
}
