"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Plus, Search, X } from "lucide-react";
import { track } from "@/lib/analytics";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { GenderToggle } from "@/components/sectors/controls";
import { cn } from "@/lib/utils";
import {
  LATEST,
  type CompactRow,
  type Gender,
  type MetricKey,
} from "@/lib/data";
import { cityRows, splitFeatured, BIG_CITIES } from "@/lib/cities";
import { SECTORS, type SGender } from "@/lib/sectors";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { sectorFilterLabel } from "@/lib/i18n/labels";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const ACCENT = "#38bdf8"; // sky
const RANK_METRICS: MetricKey[] = ["enlist", "combat", "officer"];
const ALL = "הכל";
/** Quiet floor for the "all" ranking, so single-school towns don't top it. */
const MIN_SCHOOLS = 2;
const LIMIT = 50;

/** One distinct color per featured city (by BIG_CITIES order), for the trend lines. */
const CITY_COLORS = [
  "#f472b6", // pink
  "#38bdf8", // sky
  "#34d399", // emerald
  "#fbbf24", // amber
  "#c084fc", // purple
  "#fb923c", // orange
  "#f87171", // red
  "#22d3ee", // cyan
];

function pct(v: number | null) {
  return v === null ? "—" : `${v.toFixed(1)}%`;
}

/** Neutral cell color: real values white, missing muted. No good/bad threshold. */
function cellColor(v: number | null) {
  return v === null ? "text-muted-foreground" : "text-foreground";
}

type SortKey = "council" | "n" | "enlist" | "combat" | "officer" | "meaning";

const TABLE_COLS: { key: SortKey; metric: boolean }[] = [
  { key: "council", metric: false },
  { key: "n", metric: false },
  { key: "enlist", metric: true },
  { key: "combat", metric: true },
  { key: "officer", metric: true },
  { key: "meaning", metric: true },
];

function colLabels(key: SortKey, t: Dictionary): [string, string] {
  switch (key) {
    case "council":
      return [t.cities.colCouncil, t.cities.colCouncil];
    case "n":
      return [t.cities.colCount, t.cities.colCountShort];
    case "enlist":
      return [t.metrics.enlist.long, t.metrics.enlist.short];
    case "combat":
      return [t.metrics.combat.long, t.metrics.combat.short];
    case "officer":
      return [t.metrics.officer.long, t.metrics.officer.short];
    case "meaning":
      return [t.cities.colMeaning, t.cities.colMeaningShort];
  }
}

/** One ranked horizontal bar: name, fill proportional to value, value at the end. */
function Bar({
  label,
  value,
  max,
  accent = ACCENT,
  rank,
  note,
}: {
  label: string;
  value: number | null;
  max: number;
  accent?: string;
  rank?: number;
  note?: string;
}) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {rank != null && (
        <span className="w-4 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
          {rank}
        </span>
      )}
      <div className="flex w-24 shrink-0 flex-col sm:w-36">
        <span className="truncate text-sm text-foreground">{label}</span>
        {note && <span className="text-[10px] text-muted-foreground">{note}</span>}
      </div>
      <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-white/[0.04]">
        {value != null && (
          <div
            className="absolute inset-y-0 start-0 rounded-md"
            style={{ width: `${(value / max) * 100}%`, background: accent }}
          />
        )}
      </div>
      <span className="w-12 shrink-0 text-end text-sm font-bold tabular-nums text-foreground">
        {pct(value)}
      </span>
    </div>
  );
}


export function Cities({ rows }: { rows: CompactRow[] }) {
  const t = useT();
  const locale = useLocale();
  const [gender, setGender] = React.useState<SGender>("בנים");
  const [metric, setMetric] = React.useState<MetricKey>("enlist");
  const [sector, setSector] = React.useState<string>(ALL);
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("enlist");
  const [dir, setDir] = React.useState<"asc" | "desc">("desc");

  const g: Gender = gender === "בנים" ? "m" : "f";
  const sectorFilter = sector === ALL ? undefined : sector;

  // Which cities are featured — editable by the user, persisted to localStorage.
  const [featuredNames, setFeaturedNames] = React.useState<string[]>([
    ...BIG_CITIES,
  ]);
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("cities:featured");
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr) && arr.every((x) => typeof x === "string")) {
          // Load persisted selection after mount (default renders on SSR), so the
          // first paint is deterministic — same pattern as ChartContainer.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setFeaturedNames(arr);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);
  React.useEffect(() => {
    try {
      localStorage.setItem("cities:featured", JSON.stringify(featuredNames));
    } catch {
      /* ignore */
    }
  }, [featuredNames]);

  const isDefault =
    featuredNames.length === BIG_CITIES.length &&
    featuredNames.every((c, i) => c === BIG_CITIES[i]);

  const addCity = (name: string) => {
    if (name && !featuredNames.includes(name)) {
      setFeaturedNames((prev) => [...prev, name]);
      track("cities_add", { city: name });
    }
  };
  const removeCity = (name: string) => {
    setFeaturedNames((prev) => prev.filter((c) => c !== name));
    track("cities_remove", { city: name });
  };

  // Every council in the data, for the "add city" picker.
  const allCouncils = React.useMemo(
    () =>
      [...new Set(rows.map((r) => r.c).filter((c): c is string => !!c))].sort(
        (a, b) => a.localeCompare(b, "he"),
      ),
    [rows],
  );
  const addable = allCouncils.filter((c) => !featuredNames.includes(c));

  const colorFor = (name: string) =>
    CITY_COLORS[featuredNames.indexOf(name) % CITY_COLORS.length];

  const { featured, rest } = React.useMemo(
    () => splitFeatured(cityRows(rows, g, LATEST, sectorFilter), featuredNames),
    [rows, g, sectorFilter, featuredNames],
  );

  // Shared scale so the featured bars and the ranking are comparable.
  const max = React.useMemo(() => {
    const vals = [...featured, ...rest]
      .map((c) => c[metric])
      .filter((v): v is number => v !== null);
    return Math.max(...vals, 1);
  }, [featured, rest, metric]);

  const featuredSorted = React.useMemo(
    () => [...featured].sort((a, b) => (b[metric] ?? -1) - (a[metric] ?? -1)),
    [featured, metric],
  );

  const ranked = React.useMemo(() => {
    const term = q.trim();
    const out = rest.filter(
      (c) => c.n >= MIN_SCHOOLS && (term === "" || c.council.includes(term)),
    );
    out.sort((a, b) => {
      if (sort === "council") {
        return dir === "asc"
          ? a.council.localeCompare(b.council, "he")
          : b.council.localeCompare(a.council, "he");
      }
      const av = (a[sort] as number | null) ?? -1;
      const bv = (b[sort] as number | null) ?? -1;
      return dir === "asc" ? av - bv : bv - av;
    });
    return out;
  }, [rest, sort, dir, q]);

  const setSortKey = (k: SortKey) => {
    if (k === sort) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSort(k);
      setDir(k === "council" ? "asc" : "desc");
    }
    track("cities_sort", { column: k });
  };

  React.useEffect(() => {
    const term = q.trim();
    if (term === "") return;
    const id = setTimeout(() => track("cities_search", { length: term.length }), 800);
    return () => clearTimeout(id);
  }, [q]);

  const inputCls =
    "h-9 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50";
  const pill =
    "inline-flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1";
  const pillBtn = (active: boolean) =>
    cn(
      // fixed height + centered keeps the active highlight aligned in
      // html-to-image PNG export, where emoji metrics shift the box.
      "flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium leading-none transition-colors",
      active
        ? "bg-white/10 text-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground",
    );

  return (
    <Panel>
      <PanelHeader title={t.cities.title}>
        <GenderToggle value={gender} onChange={setGender} />
      </PanelHeader>

      {/* controls: metric drives the ranking + trend; sector scopes which schools count */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className={pill}>
          {RANK_METRICS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMetric(m);
                track("cities_metric", { metric: m });
              }}
              className={pillBtn(metric === m)}
            >
              {t.metrics[m].short}
            </button>
          ))}
        </div>
        <div className={pill}>
          {[ALL, ...SECTORS].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSector(s);
                track("cities_sector", { sector: s });
              }}
              className={pillBtn(sector === s)}
            >
              {sectorFilterLabel(s, locale)}
            </button>
          ))}
        </div>
      </div>

      {/* city manager — removable chips + add picker. Controls which cities
          are featured in the bar list below. */}
      <div className="mb-6 flex flex-wrap items-center gap-1.5">
        {featuredNames.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] py-1 pe-1 ps-2.5 text-xs text-foreground"
          >
            <span
              className="size-2 rounded-full"
              style={{ background: colorFor(c) }}
            />
            {c}
            <button
              type="button"
              onClick={() => removeCity(c)}
              aria-label={t.cities.removeCity}
              title={t.cities.removeCity}
              className="rounded-full p-0.5 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <div className="relative">
          <Plus className="pointer-events-none absolute start-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <select
            value=""
            onChange={(e) => {
              addCity(e.target.value);
              e.currentTarget.value = "";
            }}
            className="h-7 rounded-full border border-dashed border-white/15 bg-transparent ps-7 pe-2 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <option value="" className="bg-popover">
              {t.cities.addCity}
            </option>
            {addable.map((c) => (
              <option key={c} value={c} className="bg-popover">
                {c}
              </option>
            ))}
          </select>
        </div>
        {!isDefault && (
          <button
            type="button"
            onClick={() => setFeaturedNames([...BIG_CITIES])}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {t.cities.reset}
          </button>
        )}
      </div>

      {/* section 1: featured cities snapshot (latest year) as a bar chart;
          click a bar to drill into that city's sector split. */}
      <div className="mb-2 text-sm font-medium text-muted-foreground">
        {t.cities.featuredHeading}
      </div>
      <div className="mb-7 space-y-1">
        {featuredSorted.map((c) => (
          <div key={c.council} className="px-2 py-1.5">
            <Bar
              label={c.council}
              value={c[metric]}
              max={max}
              accent={colorFor(c.council)}
              note={c.n > 0 ? t.cities.schoolsCount(c.n) : t.cities.noData}
            />
          </div>
        ))}
      </div>

      {/* section 2: all municipalities, ranked */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          {t.cities.restHeading}
        </span>
        <div className="relative w-full sm:w-64">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.cities.searchPlaceholder}
            className={cn(inputCls, "w-full ps-9")}
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/3 text-muted-foreground">
              {TABLE_COLS.map((col) => {
                const [long, short] = colLabels(col.key, t);
                return (
                  <th
                    key={col.key}
                    onClick={() => setSortKey(col.key)}
                    className={cn(
                      "cursor-pointer select-none whitespace-nowrap px-2.5 py-2.5 font-medium sm:px-3",
                      col.metric || col.key === "n" ? "text-center" : "text-start",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center gap-1",
                        (col.metric || col.key === "n") && "justify-center",
                      )}
                    >
                      <span className="sm:hidden">{short}</span>
                      <span className="hidden sm:inline">{long}</span>
                      {sort === col.key &&
                        (dir === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        ))}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {ranked.slice(0, LIMIT).map((c) => (
              <tr
                key={c.council}
                className="border-b border-white/5 last:border-0 hover:bg-white/3"
              >
                <td className="px-2.5 py-2.5 text-start font-medium text-foreground sm:px-3">
                  {c.council}
                </td>
                <td className="px-2.5 py-2.5 text-center tabular-nums text-muted-foreground sm:px-3">
                  {c.n}
                </td>
                {(["enlist", "combat", "officer", "meaning"] as const).map((m) => (
                  <td
                    key={m}
                    className={cn(
                      "px-2.5 py-2.5 text-center tabular-nums sm:px-3",
                      cellColor(c[m]),
                    )}
                  >
                    {pct(c[m])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="pt-3 text-center text-xs text-muted-foreground">
        {ranked.length > LIMIT
          ? t.cities.resultsNote(LIMIT, ranked.length)
          : t.cities.countNote(ranked.length)}
      </p>
    </Panel>
  );
}
