"use client";

import * as React from "react";
import {
  forceSimulation,
  forceX,
  forceY,
  forceCollide,
  type Simulation,
} from "d3-force";
import { scaleLinear } from "d3-scale";
import { X } from "lucide-react";
import { ChartHeader, ChartPanel } from "@/components/ui/panel";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { GenderToggle } from "@/components/sectors/controls";
import {
  Button,
  ControlGroup,
  FilterChip,
  FilterInput,
  MenuItem,
  SegmentButton,
} from "@/components/ui/control";
import { SECTOR_COLOR, sectorColor, type SGender } from "@/lib/sectors";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel } from "@/lib/i18n/labels";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import type { Gender, MetricKey } from "@/lib/data";

/** Metrics offered by the distribution toggle (excludes the derived "meaning"). */
const DIST_METRICS: MetricKey[] = ["enlist", "combat", "officer"];
import {
  schoolDots,
  schoolProfiles,
  type SchoolDot,
  type SchoolProfile,
} from "@/lib/lab";

/* ------------------------------------------------------------------ *
 *  Shared selection state — both charts respond to one filter bar:
 *  a gender toggle, a sector filter, and a school search that pins
 *  individual schools. Picked schools are highlighted; the rest fade
 *  to faint context (you never lose the full distribution).
 * ------------------------------------------------------------------ */

/** How a school should render given the active sector / pinned selection. */
type Emphasis = "on" | "dim" | "normal";

function emphasisOf(
  s: { key: number; sector: string | null },
  selected: Set<number>,
  sector: string | null,
): Emphasis {
  const anyActive = selected.size > 0 || sector != null;
  if (!anyActive) return "normal";
  const on = selected.size > 0 ? selected.has(s.key) : s.sector === sector;
  return on ? "on" : "dim";
}

/* ---------- Force-directed beeswarm: every school finds its place ----------
 *  A d3-force simulation pushes each school to its rate on the x-axis (forceX)
 *  while forceCollide stops dots overlapping — so the true density at each rate
 *  emerges as vertical thickness, no binning. */
const BEE_W = 880;
const BEE_H = 300;
const BEE_PAD = 30;
const BEE_R = 3.8;

type BeeNode = {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  d: SchoolDot;
};

function Beeswarm({
  dots,
  selected,
  sector,
}: {
  dots: SchoolDot[];
  selected: Set<number>;
  sector: string | null;
}) {
  const x = scaleLinear().domain([0, 100]).range([BEE_PAD, BEE_W - BEE_PAD]);
  const nodes = React.useMemo(() => {
    const xs = scaleLinear().domain([0, 100]).range([BEE_PAD, BEE_W - BEE_PAD]);
    const ns: BeeNode[] = dots.map((d) => ({ x: xs(d.value), y: BEE_H / 2, d }));
    const sim: Simulation<BeeNode, undefined> = forceSimulation(ns)
      .force("x", forceX<BeeNode>((n) => xs(n.d.value)).strength(0.9))
      .force("y", forceY<BeeNode>(BEE_H / 2).strength(0.06))
      .force("collide", forceCollide<BeeNode>(BEE_R + 0.7).iterations(2))
      .stop();
    for (let i = 0; i < 280; i++) sim.tick();
    return ns;
  }, [dots]);

  // draw emphasized dots last so they sit on top of the faded crowd
  const ordered = React.useMemo(() => {
    const rank = (n: BeeNode) => (emphasisOf(n.d, selected, sector) === "on" ? 1 : 0);
    return [...nodes].sort((a, b) => rank(a) - rank(b));
  }, [nodes, selected, sector]);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${BEE_W} ${BEE_H}`} className="h-auto w-full min-w-[640px]">
        {[0, 25, 50, 75, 100].map((tick) => (
          <g key={tick}>
            <line x1={x(tick)} x2={x(tick)} y1={BEE_PAD - 8} y2={BEE_H - BEE_PAD} stroke="rgba(255,255,255,0.06)" />
            <text x={x(tick)} y={BEE_H - 6} fill="rgba(255,255,255,0.45)" fontSize="11" textAnchor="middle">
              {tick}%
            </text>
          </g>
        ))}
        {ordered.map((n) => {
          const e = emphasisOf(n.d, selected, sector);
          const isPin = selected.has(n.d.key);
          return (
            <circle
              key={`${n.d.key}-${n.d.value}`}
              cx={n.x}
              cy={n.y}
              r={e === "on" ? BEE_R + 0.8 : BEE_R}
              fill={sectorColor(n.d.sector)}
              fillOpacity={e === "dim" ? 0.12 : e === "on" ? 1 : 0.85}
              stroke={isPin ? "#fff" : "none"}
              strokeWidth={isPin ? 1.4 : 0}
            >
              <title>{`${n.d.school}${n.d.council ? ` · ${n.d.council}` : ""} — ${n.d.value}%`}</title>
            </circle>
          );
        })}
        {/* labels for pinned schools only — keeps the canvas readable */}
        {ordered
          .filter((n) => selected.has(n.d.key))
          .map((n) => (
            <text
              key={`lbl-${n.d.key}`}
              x={n.x}
              y={n.y - BEE_R - 5}
              fill="rgba(255,255,255,0.92)"
              fontSize="11"
              fontWeight={600}
              textAnchor="middle"
            >
              {n.d.school}
            </text>
          ))}
      </svg>
    </div>
  );
}

/* ---------- Card header filters: gender · sector · school search ---------- */
function SchoolFilterBar({
  gender,
  onGender,
  metric,
  onMetric,
  sector,
  onSector,
  schools,
  selected,
  onAdd,
  onRemove,
  onClear,
  t,
  locale,
}: {
  gender: SGender;
  onGender: (g: SGender) => void;
  metric: MetricKey;
  onMetric: (m: MetricKey) => void;
  sector: string | null;
  onSector: (s: string | null) => void;
  schools: SchoolProfile[];
  selected: Map<number, string>;
  onAdd: (key: number, name: string) => void;
  onRemove: (key: number) => void;
  onClear: () => void;
  t: Dictionary;
  locale: Locale;
}) {
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const matches = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return schools
      .filter(
        (s) =>
          !selected.has(s.key) &&
          (s.school.toLowerCase().includes(needle) ||
            (s.council ?? "").toLowerCase().includes(needle)),
      )
      .slice(0, 8);
  }, [q, schools, selected]);

  const sectors = Object.keys(SECTOR_COLOR);

  return (
    <div className="w-full space-y-3 sm:min-w-[min(34rem,100%)]">
      <div className="flex flex-wrap items-center gap-3">
        <GenderToggle value={gender} onChange={onGender} surface="schools_filter" />

        {/* metric toggle — which rate the distribution is drawn by */}
        <ControlGroup>
          {DIST_METRICS.map((m) => (
            <SegmentButton
              key={m}
              type="button"
              active={metric === m}
              onClick={() => onMetric(m)}
            >
              {t.metrics[m].short}
            </SegmentButton>
          ))}
        </ControlGroup>

        {/* sector chips — double as legend + filter */}
        <ControlGroup>
          <SegmentButton
            type="button"
            active={sector == null}
            onClick={() => onSector(null)}
          >
            {t.schoolFilter.allSectors}
          </SegmentButton>
          {sectors.map((s) => (
            <SegmentButton
              key={s}
              type="button"
              active={sector === s}
              onClick={() => onSector(sector === s ? null : s)}
              className="flex items-center gap-1.5"
            >
              <span className="size-2.5 rounded-full" style={{ background: SECTOR_COLOR[s] }} />
              {sectorLabel(s, locale)}
            </SegmentButton>
          ))}
        </ControlGroup>

        {/* school search */}
        <div className="relative ms-auto w-full sm:w-64">
          <FilterInput
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={t.schoolFilter.add}
            className="w-full"
          />
          {open && q.trim() && (
            <div className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-white/10 bg-zinc-900/95 p-1 shadow-xl">
              {matches.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {t.schoolFilter.noResults}
                </div>
              ) : (
                matches.map((s) => (
                  <MenuItem
                    key={s.key}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onAdd(s.key, s.school);
                      setQ("");
                    }}
                  >
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ background: sectorColor(s.sector) }}
                    />
                    <span className="truncate">{s.school}</span>
                    {s.council && (
                      <span className="ms-auto shrink-0 text-xs text-muted-foreground/70">
                        {s.council}
                      </span>
                    )}
                  </MenuItem>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* pinned schools as removable chips */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">{t.schoolFilter.selectedLabel}:</span>
          {[...selected.entries()].map(([key, name]) => (
            <FilterChip
              key={key}
              type="button"
              onClick={() => onRemove(key)}
            >
              {name}
              <X className="size-3 text-muted-foreground" />
            </FilterChip>
          ))}
          <Button
            type="button"
            variant="link"
            onClick={onClear}
            className="text-xs"
          >
            {t.schoolFilter.clear}
          </Button>
        </div>
      )}
    </div>
  );
}

/* The school distribution beeswarm with its header filters. Pure client-side
 * SVG — render after mount so SSR and first client paint agree. */
export function SchoolCharts() {
  const t = useT();
  const locale = useLocale();

  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  const [gender, setGender] = React.useState<SGender>("בנים");
  const [metric, setMetric] = React.useState<MetricKey>("combat");
  const [sector, setSector] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<Map<number, string>>(new Map());

  const g: Gender = gender === "בנים" ? "m" : "f";
  const dots = React.useMemo(() => schoolDots(g, metric), [g, metric]);
  const profiles = React.useMemo(() => schoolProfiles(g), [g]);
  const selectedKeys = React.useMemo(() => new Set(selected.keys()), [selected]);

  const addSchool = (key: number, name: string) =>
    setSelected((prev) => new Map(prev).set(key, name));
  const removeSchool = (key: number) =>
    setSelected((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  const clearSchools = () => setSelected(new Map());

  if (!mounted) return <SectionSkeleton panels={1} />;

  return (
    <ChartPanel>
      <ChartHeader title={t.lab.histTitle} subtitle={t.lab.histSubtitle}>
        <SchoolFilterBar
          gender={gender}
          onGender={setGender}
          metric={metric}
          onMetric={setMetric}
          sector={sector}
          onSector={setSector}
          schools={profiles}
          selected={selected}
          onAdd={addSchool}
          onRemove={removeSchool}
          onClear={clearSchools}
          t={t}
          locale={locale}
        />
      </ChartHeader>
      <Beeswarm dots={dots} selected={selectedKeys} sector={sector} />
    </ChartPanel>
  );
}
