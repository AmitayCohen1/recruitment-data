"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, MoreHorizontal, Search } from "lucide-react";
import { track } from "@/lib/analytics";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Popover } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  YEARS,
  LATEST,
  type CompactRow,
  type Gender,
} from "@/lib/data";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { genderLabelFromCode } from "@/lib/i18n/labels";
import { htmlLang } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type SortKey = "e" | "cb" | "o" | "m" | "s";

const COLUMNS: { key: SortKey; metric: boolean }[] = [
  { key: "s", metric: false },
  { key: "e", metric: true },
  { key: "cb", metric: true },
  { key: "o", metric: true },
  { key: "m", metric: true },
];

/** Localized [long, short] header labels per column. */
function colLabels(key: SortKey, t: Dictionary): [string, string] {
  switch (key) {
    case "s":
      return [t.explorer.colSchool, t.explorer.colSchool];
    case "e":
      return [t.metrics.enlist.long, t.metrics.enlist.short];
    case "cb":
      return [t.metrics.combat.long, t.metrics.combat.short];
    case "o":
      return [t.metrics.officer.long, t.metrics.officer.short];
    case "m":
      return [t.explorer.colMeaning, t.explorer.colMeaningShort];
  }
}

function pct(v: number | null) {
  return v === null ? "—" : `${v.toFixed(1)}%`;
}

function pctColor(v: number | null) {
  if (v === null) return "text-muted-foreground";
  if (v >= 80) return "text-emerald-400 font-medium";
  if (v >= 50) return "text-foreground";
  return "text-rose-400";
}

const LIMIT = 150;

export function Explorer({
  rows,
  zeroRows = [],
}: {
  rows: CompactRow[];
  zeroRows?: CompactRow[];
}) {
  const t = useT();
  const locale = useLocale();
  const [year, setYear] = React.useState<number>(LATEST);
  const [gender, setGender] = React.useState<Gender | "all">("all");
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("e");
  const [dir, setDir] = React.useState<"asc" | "desc">("desc");
  const [showZero, setShowZero] = React.useState(false);

  const filtered = React.useMemo(() => {
    const term = q.trim();
    const source = showZero ? [...rows, ...zeroRows] : rows;
    const out = source.filter(
      (r) =>
        r.y === year &&
        (gender === "all" || r.g === gender) &&
        (term === "" ||
          r.s.includes(term) ||
          (r.c ? r.c.includes(term) : false)),
    );
    out.sort((a, b) => {
      if (sort === "s") {
        return dir === "asc"
          ? a.s.localeCompare(b.s, "he")
          : b.s.localeCompare(a.s, "he");
      }
      const av = a[sort] ?? -1;
      const bv = b[sort] ?? -1;
      return dir === "asc" ? av - bv : bv - av;
    });
    return out;
  }, [rows, zeroRows, showZero, year, gender, q, sort, dir]);

  const setSortKey = (k: SortKey) => {
    if (k === sort) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSort(k);
      setDir(k === "s" ? "asc" : "desc");
    }
    track("explorer_sort", { column: k });
  };

  // Debounced search tracking — fires once the user pauses typing.
  React.useEffect(() => {
    const term = q.trim();
    if (term === "") return;
    const id = setTimeout(() => track("explorer_search", { length: term.length }), 800);
    return () => clearTimeout(id);
  }, [q]);

  const inputCls =
    "h-9 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

  return (
    <Panel>
      <PanelHeader
        title={t.explorer.title}
        subtitle={t.explorer.subtitle}
      />

      <div className="mb-4 space-y-2">
        {/* search — its own full-width row */}
        <div className="relative">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.explorer.searchPlaceholder}
            className={cn(inputCls, "w-full ps-9")}
          />
        </div>

        {/* controls row — primary filters inline, secondary tucked into a popover */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={year}
            onChange={(e) => {
              const y = Number(e.target.value);
              setYear(y);
              track("explorer_year", { year: y });
            }}
            className={inputCls}
          >
            {[...YEARS].reverse().map((y) => (
              <option key={y} value={y} className="bg-popover">
                {y}
              </option>
            ))}
          </select>

          <div className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/3 p-1">
            {(["all", "m", "f"] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setGender(g);
                  track("explorer_gender", { gender: g });
                }}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors sm:px-3",
                  gender === g
                    ? "bg-white/10 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {g === "all"
                  ? t.explorer.genderAll
                  : g === "m"
                    ? t.explorer.genderBoys
                    : t.explorer.genderGirls}
              </button>
            ))}
          </div>

          {zeroRows.length > 0 && (
            <Popover
              ariaLabel={t.explorer.moreFilters}
              triggerClassName={cn(
                "relative inline-flex size-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors hover:text-foreground",
                showZero
                  ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                  : "border-white/10 bg-white/3",
              )}
              trigger={
                <>
                  <MoreHorizontal className="size-4" />
                  {showZero && (
                    <span className="absolute -left-0.5 -top-0.5 size-2 rounded-full bg-emerald-400 ring-2 ring-background" />
                  )}
                </>
              }
            >
              <label className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={showZero}
                  onChange={(e) => setShowZero(e.target.checked)}
                  className="size-4 accent-emerald-400"
                />
                {t.explorer.showZero}
              </label>
            </Popover>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/3 text-muted-foreground">
              {COLUMNS.map((c) => {
                const [long, short] = colLabels(c.key, t);
                return (
                <th
                  key={c.key}
                  className={cn(
                    "cursor-pointer select-none whitespace-nowrap px-2.5 py-2.5 sm:px-3 font-medium",
                    c.metric ? "text-center" : "text-start",
                  )}
                  onClick={() => setSortKey(c.key)}
                >
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      c.metric && "justify-center",
                    )}
                  >
                    <span className="sm:hidden">{short}</span>
                    <span className="hidden sm:inline">{long}</span>
                    {sort === c.key &&
                      (dir === "asc" ? (
                        <ArrowUp className="size-3" />
                      ) : (
                        <ArrowDown className="size-3" />
                      ))}
                  </span>
                </th>
                );
              })}
              {gender === "all" && (
                <th className="px-2.5 py-2.5 sm:px-3 text-center font-medium">
                  {t.explorer.genderHeader}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, LIMIT).map((r) => (
              <tr
                key={`${r.k}-${r.g}`}
                className="border-b border-white/5 last:border-0 hover:bg-white/3"
              >
                <td className="px-2.5 py-2.5 sm:px-3 text-start">
                  <div className="font-medium text-foreground">{r.s}</div>
                  {r.c && (
                    <div className="text-xs text-muted-foreground">{r.c}</div>
                  )}
                </td>
                <td className={cn("px-2.5 py-2.5 sm:px-3 text-center tabular-nums", pctColor(r.e))}>
                  {pct(r.e)}
                </td>
                <td className={cn("px-2.5 py-2.5 sm:px-3 text-center tabular-nums", pctColor(r.cb))}>
                  {pct(r.cb)}
                </td>
                <td className={cn("px-2.5 py-2.5 sm:px-3 text-center tabular-nums", pctColor(r.o))}>
                  {pct(r.o)}
                </td>
                <td className={cn("px-2.5 py-2.5 sm:px-3 text-center tabular-nums", pctColor(r.m))}>
                  {pct(r.m)}
                </td>
                {gender === "all" && (
                  <td className="px-2.5 py-2.5 sm:px-3 text-center text-muted-foreground">
                    {genderLabelFromCode(r.g, locale)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length > LIMIT && (
        <p className="pt-3 text-center text-xs text-muted-foreground">
          {t.explorer.resultsNote(
            LIMIT,
            filtered.length.toLocaleString(htmlLang(locale)),
          )}
        </p>
      )}
    </Panel>
  );
}
