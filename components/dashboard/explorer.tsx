"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, MoreHorizontal, Search } from "lucide-react";
import { track } from "@/lib/analytics";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Popover } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  GENDER_LABEL,
  YEARS,
  LATEST,
  type CompactRow,
  type Gender,
} from "@/lib/data";

type SortKey = "e" | "cb" | "o" | "m" | "s";

const COLUMNS: { key: SortKey; label: string; short: string; metric: boolean }[] = [
  { key: "s", label: "בית ספר", short: "בית ספר", metric: false },
  { key: "e", label: "🪖 שיעור גיוס", short: "🪖 גיוס", metric: true },
  { key: "cb", label: "⚔️ שירות קרבי מתוך מתגייסים", short: "⚔️ קרבי", metric: true },
  { key: "o", label: "🎖️ קצונה מתוך מתגייסים", short: "🎖️ קצונה", metric: true },
  { key: "m", label: "שירות משמעותי", short: "משמעותי", metric: true },
];

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
        title="טבלת השוואה לפי בית ספר"
        subtitle="חיפוש וסינון בתי ספר לפי שנה, מגדר, רשות ומדדי הגיוס המרכזיים."
      />

      <div className="mb-4 space-y-2">
        {/* search — its own full-width row */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש לפי שם בית ספר או רשות…"
            className={cn(inputCls, "w-full pr-9")}
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
                {g === "all" ? "הכל" : g === "m" ? "👨 בנים" : "👩 בנות"}
              </button>
            ))}
          </div>

          {zeroRows.length > 0 && (
            <Popover
              ariaLabel="עוד מסננים"
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
                הצגת בתי ספר ללא מתגייסים
              </label>
            </Popover>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/3 text-muted-foreground">
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "cursor-pointer select-none whitespace-nowrap px-2.5 py-2.5 sm:px-3 font-medium",
                    c.metric ? "text-center" : "text-right",
                  )}
                  onClick={() => setSortKey(c.key)}
                >
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      c.metric && "justify-center",
                    )}
                  >
                    <span className="sm:hidden">{c.short}</span>
                    <span className="hidden sm:inline">{c.label}</span>
                    {sort === c.key &&
                      (dir === "asc" ? (
                        <ArrowUp className="size-3" />
                      ) : (
                        <ArrowDown className="size-3" />
                      ))}
                  </span>
                </th>
              ))}
              {gender === "all" && (
                <th className="px-2.5 py-2.5 sm:px-3 text-center font-medium">מגדר</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, LIMIT).map((r) => (
              <tr
                key={`${r.k}-${r.g}`}
                className="border-b border-white/5 last:border-0 hover:bg-white/3"
              >
                <td className="px-2.5 py-2.5 sm:px-3 text-right">
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
                    {GENDER_LABEL[r.g]}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length > LIMIT && (
        <p className="pt-3 text-center text-xs text-muted-foreground">
          מוצגים {LIMIT} מתוך {filtered.length.toLocaleString("he")} תוצאות.
          צמצמו באמצעות חיפוש, שנה או מגדר.
        </p>
      )}
    </Panel>
  );
}
