"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Plus, Search, X } from "lucide-react";
import { track } from "@/lib/analytics";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { GenderToggle } from "@/components/sectors/controls";
import {
  Button,
  ControlGroup,
  FilterChip,
  FilterInput,
  FilterSelect,
  SegmentButton,
} from "@/components/ui/control";
import { cn } from "@/lib/utils";
import {
  LATEST,
  FIRST,
  type CompactRow,
  type Gender,
  type MetricKey,
} from "@/lib/data";
import { cityRows, splitFeatured, BIG_CITIES, cityColor, type CityRow } from "@/lib/cities";
import { Delta } from "@/components/ui/delta";
import { SECTORS, type SGender } from "@/lib/sectors";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { sectorFilterLabel } from "@/lib/i18n/labels";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const ACCENT = "#38bdf8"; // sky
const RANK_METRICS: MetricKey[] = ["enlist", "combat", "officer"];
const ALL = "הכל";
/** Quiet floor for the "all" ranking, so single-school towns don't top it. */
const MIN_SCHOOLS = 2;

function pct(v: number | null) {
  return v === null ? "—" : `${v.toFixed(1)}%`;
}

/** Neutral cell color: real values white, missing muted. No good/bad threshold. */
function cellColor(v: number | null) {
  return v === null ? "text-muted-foreground" : "text-foreground";
}

type SortKey = "council" | "n" | "enlist" | "combat" | "officer";

const TABLE_COLS: { key: SortKey; metric: boolean }[] = [
  { key: "council", metric: false },
  { key: "n", metric: false },
  { key: "enlist", metric: true },
  { key: "combat", metric: true },
  { key: "officer", metric: true },
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
  }
}

/** One ranked horizontal bar: name, fill proportional to value, value at the end. */
function Bar({
  label,
  value,
  max,
  accent = ACCENT,
  swatch,
  rank,
  note,
}: {
  label: string;
  value: number | null;
  max: number;
  accent?: string;
  /** Identity color shown as a small dot next to the label; the bar stays neutral. */
  swatch?: string;
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
      <div className="flex w-24 shrink-0 items-center gap-1.5 sm:w-36">
        {swatch && (
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ background: swatch }}
          />
        )}
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm text-foreground">{label}</span>
          {note && <span className="text-[10px] text-muted-foreground">{note}</span>}
        </div>
      </div>
      <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-white/4">
        {value != null && (
          <div
            className="absolute inset-y-0 inset-s-0 rounded-md"
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

  // shared palette + indexing so a city keeps the same color in every chart;
  // here the order is the user's featured list (BIG_CITIES by default).
  const colorFor = (name: string) => cityColor(name, featuredNames);

  const { featured, rest } = React.useMemo(
    () => splitFeatured(cityRows(rows, g, LATEST, sectorFilter), featuredNames),
    [rows, g, sectorFilter, featuredNames],
  );

  // First-year (2018) city averages, for the change badge in the ranking table.
  const baseline = React.useMemo(() => {
    const m = new Map<string, CityRow>();
    for (const c of cityRows(rows, g, FIRST, sectorFilter)) m.set(c.council, c);
    return m;
  }, [rows, g, sectorFilter]);

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

  return (
    <Panel>
      <PanelHeader title={t.cities.title}>
        <GenderToggle value={gender} onChange={setGender} />
      </PanelHeader>

      {/* controls: metric drives the ranking + trend; sector scopes which schools count */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <ControlGroup>
          {RANK_METRICS.map((m) => (
            <SegmentButton
              key={m}
              type="button"
              active={metric === m}
              onClick={() => {
                setMetric(m);
                track("cities_metric", { metric: m });
              }}
              // Fixed height keeps emoji metric labels aligned in PNG export.
              className="flex h-8 items-center justify-center leading-none"
            >
              {t.metrics[m].short}
            </SegmentButton>
          ))}
        </ControlGroup>
        <ControlGroup>
          {[ALL, ...SECTORS].map((s) => (
            <SegmentButton
              key={s}
              type="button"
              active={sector === s}
              onClick={() => {
                setSector(s);
                track("cities_sector", { sector: s });
              }}
              className="flex h-8 items-center justify-center leading-none"
            >
              {sectorFilterLabel(s, locale)}
            </SegmentButton>
          ))}
        </ControlGroup>
      </div>

      {/* city manager — removable chips + add picker. Controls which cities
          are featured in the bar list below. */}
      <div className="mb-6 flex flex-wrap items-center gap-1.5">
        {featuredNames.map((c) => (
          <FilterChip
            key={c}
            type="button"
            onClick={() => removeCity(c)}
            aria-label={t.cities.removeCity}
            title={t.cities.removeCity}
          >
            <span
              className="size-2 rounded-full"
              style={{ background: colorFor(c) }}
            />
            {c}
            <X className="size-3 text-muted-foreground" />
          </FilterChip>
        ))}
        <div className="relative">
          <Plus className="pointer-events-none absolute inset-s-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <FilterSelect
            value=""
            onChange={(e) => {
              addCity(e.target.value);
              e.currentTarget.value = "";
            }}
            className="h-7 rounded-full border-dashed border-white/15 bg-transparent ps-7 pe-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <option value="" className="bg-popover">
              {t.cities.addCity}
            </option>
            {addable.map((c) => (
              <option key={c} value={c} className="bg-popover">
                {c}
              </option>
            ))}
          </FilterSelect>
        </div>
        {!isDefault && (
          <Button
            type="button"
            variant="link"
            onClick={() => setFeaturedNames([...BIG_CITIES])}
            className="text-xs"
          >
            {t.cities.reset}
          </Button>
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
              swatch={colorFor(c.council)}
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
          <Search className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <FilterInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.cities.searchPlaceholder}
            className="w-full ps-9"
          />
        </div>
      </div>
      <p className="mb-2 text-xs text-muted-foreground">{t.delta.legend(FIRST)}</p>
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
            {ranked.map((c) => (
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
                {(["enlist", "combat", "officer"] as const).map((m) => {
                  const base = baseline.get(c.council);
                  const cur = c[m];
                  const bv = base?.[m] ?? null;
                  return (
                    <td
                      key={m}
                      className={cn(
                        "px-2.5 py-2.5 text-center tabular-nums sm:px-3",
                        cellColor(cur),
                      )}
                    >
                      <div className="flex flex-col items-center leading-tight">
                        <span>{pct(cur)}</span>
                        <Delta
                          value={cur != null && bv != null ? cur - bv : null}
                          title={t.delta.vs(FIRST)}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="pt-3 text-center text-xs text-muted-foreground">
        {t.cities.countNote(ranked.length)}
      </p>
    </Panel>
  );
}
