import data from "@/app/data/sectors.json";

export type SGender = "בנים" | "בנות";
export type SMetric = "enlist" | "combat" | "officer" | "meaning";

export type SectorRow = {
  year: number;
  sector: string;
  gender: SGender;
  n: number;
  enlist: number | null;
  combat: number | null;
  officer: number | null;
  meaning: number | null;
};

export type SubgroupRow = SectorRow & { group: string };

export const SECTORS = data.sectors as string[];
export const SYEARS = data.years as number[];
export const SLATEST = SYEARS[SYEARS.length - 1];
export const SFIRST = SYEARS[0];
export const ROWS_S = data.byYearSector as SectorRow[];
export const SUBGROUPS = data.subgroups as SubgroupRow[];

export const S_METRICS: { key: SMetric; label: string; short: string }[] = [
  { key: "enlist", label: "אחוז גיוס", short: "גיוס" },
  { key: "combat", label: "אחוז לחימה", short: "לחימה" },
  { key: "officer", label: "אחוז קצונה", short: "קצונה" },
];

export const SECTOR_COLOR: Record<string, string> = {
  חילוני: "#38bdf8", // sky
  "דתי לאומי": "#34d399", // emerald
  חרדי: "#fbbf24", // amber
  דרוזי: "#c084fc", // purple
};

export const SECTOR_EN: Record<string, string> = {
  חילוני: "Secular",
  "דתי לאומי": "Religious-Zionist",
  חרדי: "Haredi",
  דרוזי: "Druze",
};

const row = (year: number, sector: string, gender: SGender) =>
  ROWS_S.find(
    (r) => r.year === year && r.sector === sector && r.gender === gender,
  );

/** Sector × gender rows for one year, sorted by a metric (desc). */
export function ranking(metric: SMetric, year = SLATEST) {
  const out: { sector: string; gender: SGender; value: number; n: number }[] =
    [];
  for (const s of SECTORS) {
    for (const g of ["בנים", "בנות"] as SGender[]) {
      const r = row(year, s, g);
      if (r && r[metric] !== null)
        out.push({ sector: s, gender: g, value: r[metric] as number, n: r.n });
    }
  }
  return out.sort((a, b) => b.value - a.value);
}

/** Trend over years for one gender: [{year, <sector>: value, ...}]. */
export function trend(metric: SMetric, gender: SGender) {
  return SYEARS.map((year) => {
    const o: Record<string, number | null> & { year: number } = { year };
    for (const s of SECTORS) {
      const r = row(year, s, gender);
      o[s] = r ? r[metric] : null;
    }
    return o;
  });
}

/** 2018 → 2024 change per sector × gender for one metric. */
export function change(metric: SMetric, gender: SGender) {
  return SECTORS.flatMap((s) => {
    const a = row(SFIRST, s, gender);
    const b = row(SLATEST, s, gender);
    if (!a || !b || a[metric] === null || b[metric] === null) return [];
    return [
      {
        sector: s,
        gender,
        from: a[metric] as number,
        to: b[metric] as number,
        delta: Math.round(((b[metric] as number) - (a[metric] as number)) * 10) / 10,
      },
    ];
  });
}

/** Latest-year headline numbers per sector (both genders). */
export function headline() {
  return SECTORS.map((s) => ({
    sector: s,
    en: SECTOR_EN[s],
    color: SECTOR_COLOR[s],
    boys: row(SLATEST, s, "בנים")?.enlist ?? null,
    girls: row(SLATEST, s, "בנות")?.enlist ?? null,
    boysCombat: row(SLATEST, s, "בנים")?.combat ?? null,
  }));
}

/** Subgroups for a sector + gender, sorted by metric (desc). */
export function subgroups(sector: string, gender: SGender, metric: SMetric) {
  return SUBGROUPS.filter(
    (r) => r.sector === sector && r.gender === gender && r[metric] !== null,
  ).sort((a, b) => (b[metric] as number) - (a[metric] as number));
}
