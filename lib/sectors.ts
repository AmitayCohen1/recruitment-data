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
  { key: "combat", label: "אחוז קרבי", short: "קרבי" },
  { key: "officer", label: "אחוז קצונה", short: "קצונה" },
];

export const METRIC_ICON: Record<SMetric, string> = {
  enlist: "🪖",
  combat: "⚔️",
  officer: "🎖️",
  meaning: "⭐",
};

export const GENDER_ICON: Record<SGender, string> = {
  בנים: "👨",
  בנות: "👩",
};

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

/** Matrix of all metrics per sector for one gender (for the heatmap). */
export function matrix(gender: SGender, year = SLATEST) {
  return SECTORS.map((s) => {
    const p = profile(s, gender, year);
    return { sector: s, gender, enlist: p.enlist, combat: p.combat, officer: p.officer };
  });
}

/** "Per 100 youth" effective rate: enlist% × metric% (for combat/officer),
 *  or enlist itself. Reframes contribution to the whole cohort, not just enlistees. */
export function effective(metric: SMetric, gender: SGender, year = SLATEST) {
  return SECTORS.map((s) => {
    const p = profile(s, gender, year);
    const e = p.enlist ?? 0;
    const rate = (p[metric] as number) ?? 0;
    const value =
      metric === "enlist" ? e : Math.round(((e * rate) / 100) * 10) / 10;
    return { sector: s, value, enlist: e, rate };
  }).sort((a, b) => b.value - a.value);
}

/** Cascade per 100 youth for one sector + gender: enlist → combat → officer. */
export function funnel(sector: string, gender: SGender, year = SLATEST) {
  const p = profile(sector, gender, year);
  const e = p.enlist ?? 0;
  const per = (rate: number | null) =>
    Math.round(((e * (rate ?? 0)) / 100) * 10) / 10;
  return [
    { stage: "מתגייסים", icon: "🪖", per100: Math.round(e * 10) / 10 },
    { stage: "קרביים", icon: "⚔️", per100: per(p.combat) },
    { stage: "קצינים", icon: "🎖️", per100: per(p.officer) },
  ];
}

/** Subgroups for a sector + gender, sorted by metric (desc). */
export function subgroups(sector: string, gender: SGender, metric: SMetric) {
  return SUBGROUPS.filter(
    (r) => r.sector === sector && r.gender === gender && r[metric] !== null,
  ).sort((a, b) => (b[metric] as number) - (a[metric] as number));
}

/** school_key -> sector, for tagging school-level rows. */
export const SCHOOL_SECTOR = (data as { schoolSector?: Record<string, string> })
  .schoolSector ?? {};

/** Enlistment gender gap (boys − girls) per sector, latest year, sorted desc. */
export function genderGap(metric: SMetric = "enlist", year = SLATEST) {
  return SECTORS.flatMap((s) => {
    const b = row(year, s, "בנים");
    const g = row(year, s, "בנות");
    if (!b || !g || b[metric] === null || g[metric] === null) return [];
    return [
      {
        sector: s,
        boys: b[metric] as number,
        girls: g[metric] as number,
        gap: Math.round(((b[metric] as number) - (g[metric] as number)) * 10) / 10,
      },
    ];
  }).sort((a, b) => b.gap - a.gap);
}

/** All three metrics for one sector + gender, latest year (for the paradox panel). */
export function profile(sector: string, gender: SGender, year = SLATEST) {
  const r = row(year, sector, gender);
  return {
    enlist: r?.enlist ?? null,
    combat: r?.combat ?? null,
    officer: r?.officer ?? null,
    meaning: r?.meaning ?? null,
    n: r?.n ?? 0,
  };
}
