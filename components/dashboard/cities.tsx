"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ArrowDown, ArrowUp, ChevronDown, Search, X } from "lucide-react";
import { track } from "@/lib/analytics";
import { Panel, PanelHeader, ChipLegend } from "@/components/ui/panel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { GenderToggle } from "@/components/sectors/controls";
import { cn } from "@/lib/utils";
import {
  LATEST,
  type CompactRow,
  type Gender,
  type MetricKey,
} from "@/lib/data";
import {
  cityRows,
  citiesTrend,
  citySectorBreakdown,
  splitFeatured,
  BIG_CITIES,
  type CityRow,
} from "@/lib/cities";
import { SECTORS, SECTOR_COLOR, type SGender } from "@/lib/sectors";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { sectorLabel, sectorFilterLabel } from "@/lib/i18n/labels";
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

/** A featured big city: a ranked bar that expands to its by-sector split
 *  (only when no single sector is already selected). */
function FeaturedCity({
  c,
  metric,
  max,
  rows,
  gender,
  sectorFilter,
  onRemove,
  locale,
  t,
}: {
  c: CityRow;
  metric: MetricKey;
  max: number;
  rows: CompactRow[];
  gender: Gender;
  sectorFilter: string | undefined;
  onRemove: () => void;
  locale: "he" | "en";
  t: Dictionary;
}) {
  const [open, setOpen] = React.useState(false);
  const breakdown = React.useMemo(
    () => citySectorBreakdown(rows, c.council, gender, LATEST),
    [rows, c.council, gender],
  );
  const canExpand = !sectorFilter && breakdown.length > 1;
  const value = c[metric];
  const note = c.n > 0 ? t.cities.schoolsCount(c.n) : t.cities.noData;

  return (
    <div className="group rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.02]">
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={!canExpand}
          onClick={() => {
            setOpen((v) => !v);
            if (!open) track("cities_expand", { city: c.council });
          }}
          aria-expanded={open}
          className="flex flex-1 items-center gap-2 disabled:cursor-default"
        >
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
              !canExpand && "opacity-0",
            )}
          />
          <div className="flex-1">
            <Bar label={c.council} value={value} max={max} note={note} />
          </div>
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={t.cities.removeCity}
          title={t.cities.removeCity}
          className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition hover:bg-white/10 hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
        >
          <X className="size-3.5" />
        </button>
      </div>
      {open && canExpand && (
        <div className="mb-1 mt-2 space-y-1.5 ps-6">
          {breakdown.map((b) => {
            const label =
              b.sector === "אחר"
                ? t.cities.sectorOther
                : sectorLabel(b.sector, locale);
            return (
              <Bar
                key={b.sector}
                label={label}
                value={b[metric]}
                max={max}
                accent={SECTOR_COLOR[b.sector] ?? "#94a3b8"}
                note={t.cities.schoolsCount(b.n)}
              />
            );
          })}
        </div>
      )}
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

  const trendData = React.useMemo(
    () => citiesTrend(rows, featuredNames, g, metric, sectorFilter),
    [rows, g, metric, sectorFilter, featuredNames],
  );

  // Shared scale so the trend lines, featured bars and ranking are comparable.
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

  const trendConfig = Object.fromEntries(
    featuredNames.map((c) => [c, { label: c, color: colorFor(c) }]),
  ) satisfies ChartConfig;

  const inputCls =
    "h-9 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50";
  const pill =
    "inline-flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1";
  const pillBtn = (active: boolean) =>
    cn(
      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
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

      {/* trend: the big cities over time, for the chosen metric */}
      <div className="mb-2 text-sm font-medium text-muted-foreground">
        {t.cities.trendHeading}
      </div>
      <ChartContainer config={trendConfig} className="mb-6 h-[260px] w-full">
        <LineChart data={trendData} margin={{ left: 4, right: 16, top: 8, bottom: 4 }}>
          <CartesianGrid vertical={false} strokeOpacity={0.35} />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            orientation="right"
            domain={[0, 100]}
            width={40}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `${v}%`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {featuredNames.map((c) => (
            <Line
              key={c}
              dataKey={c}
              stroke={colorFor(c)}
              strokeWidth={2.25}
              dot={false}
              activeDot={{ r: 4 }}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ChartContainer>
      <ChipLegend
        className="mb-7"
        items={featuredNames.map((c) => ({ label: c, color: colorFor(c) }))}
      />

      {/* section 1: featured cities (editable) — expandable to sector split */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          {t.cities.featuredHeading}
        </span>
        <div className="flex items-center gap-2">
          {!isDefault && (
            <button
              type="button"
              onClick={() => setFeaturedNames([...BIG_CITIES])}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              {t.cities.reset}
            </button>
          )}
          <select
            value=""
            onChange={(e) => {
              addCity(e.target.value);
              e.currentTarget.value = "";
            }}
            className={cn(inputCls, "max-w-[12rem]")}
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
      </div>
      <div className="mb-7 space-y-0.5">
        {featuredSorted.map((c) => (
          <FeaturedCity
            key={c.council}
            c={c}
            metric={metric}
            max={max}
            rows={rows}
            gender={g}
            sectorFilter={sectorFilter}
            onRemove={() => removeCity(c.council)}
            locale={locale}
            t={t}
          />
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
      <div className="space-y-1.5">
        {ranked.slice(0, LIMIT).map((c, i) => (
          <Bar
            key={c.council}
            rank={i + 1}
            label={c.council}
            value={c[metric]}
            max={max}
            note={t.cities.schoolsCount(c.n)}
          />
        ))}
      </div>
      <p className="pt-3 text-center text-xs text-muted-foreground">
        {ranked.length > LIMIT
          ? t.cities.resultsNote(LIMIT, ranked.length)
          : t.cities.countNote(ranked.length)}
      </p>
    </Panel>
  );
}
