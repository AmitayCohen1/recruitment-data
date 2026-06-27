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
import { Panel, PanelHeader } from "@/components/ui/panel";
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
import type { Gender } from "@/lib/data";
import {
  schoolDots,
  schoolProfiles,
  PARALLEL_AXES,
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

/* ---------- Parallel coordinates: each school's profile across four metrics ---------- */
const PC_W = 880;
const PC_H = 440;
const PC_PADX = 64;
const PC_TOP = 30;
const PC_BOT = 46;

function ParallelCoords({
  schools,
  selected,
  sector,
  t,
}: {
  schools: SchoolProfile[];
  selected: Set<number>;
  sector: string | null;
  t: Dictionary;
}) {
  const [hoverKey, setHoverKey] = React.useState<number | null>(null);
  const [tip, setTip] = React.useState<{ x: number; y: number } | null>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);

  const n = PARALLEL_AXES.length;
  const axisX = (i: number) => PC_PADX + (i / (n - 1)) * (PC_W - 2 * PC_PADX);
  const y = scaleLinear().domain([0, 100]).range([PC_H - PC_BOT, PC_TOP]);
  const lineFor = (s: SchoolProfile) =>
    PARALLEL_AXES.map((a, i) => `${axisX(i)},${y(s[a.key])}`).join(" L ");

  const hovered = hoverKey != null ? schools.find((s) => s.key === hoverKey) : null;

  // draw emphasized lines (then the hovered line) last so they sit on top
  const ordered = React.useMemo(() => {
    const rank = (s: SchoolProfile) => {
      if (s.key === hoverKey) return 2;
      return emphasisOf(s, selected, sector) === "on" ? 1 : 0;
    };
    return [...schools].sort((a, b) => rank(a) - rank(b));
  }, [schools, hoverKey, selected, sector]);

  const opacityOf = (s: SchoolProfile) => {
    if (hoverKey != null) return s.key === hoverKey ? 0.95 : 0.05;
    const e = emphasisOf(s, selected, sector);
    if (e === "normal") return 0.22;
    return e === "on" ? 0.9 : 0.04;
  };

  return (
    <div className="relative overflow-x-auto" ref={boxRef}>
      <svg
        viewBox={`0 0 ${PC_W} ${PC_H}`}
        className="h-auto w-full min-w-[640px]"
        onMouseLeave={() => {
          setHoverKey(null);
          setTip(null);
        }}
      >
        {PARALLEL_AXES.map((a, i) => {
          const ax = axisX(i);
          return (
            <g key={a.key}>
              <line x1={ax} x2={ax} y1={y(0)} y2={y(100)} stroke="rgba(255,255,255,0.18)" />
              {[0, 25, 50, 75, 100].map((tk) => (
                <g key={tk}>
                  <line x1={ax - 3} x2={ax + 3} y1={y(tk)} y2={y(tk)} stroke="rgba(255,255,255,0.25)" />
                  <text
                    x={i === 0 ? ax - 8 : ax + 8}
                    y={y(tk) + 4}
                    fill="rgba(255,255,255,0.4)"
                    fontSize="10"
                    textAnchor={i === 0 ? "end" : "start"}
                    className="tabular-nums"
                  >
                    {tk}
                  </text>
                </g>
              ))}
              <text x={ax} y={PC_H - 14} fill="rgba(255,255,255,0.85)" fontSize="13" fontWeight={600} textAnchor="middle">
                {t.metrics[a.key].label}
              </text>
            </g>
          );
        })}

        {ordered.map((s) => {
          const e = emphasisOf(s, selected, sector);
          return (
            <path
              key={s.key}
              d={`M ${lineFor(s)}`}
              fill="none"
              stroke={sectorColor(s.sector)}
              strokeWidth={hoverKey === s.key || (e === "on" && selected.has(s.key)) ? 2.5 : 1}
              strokeOpacity={opacityOf(s)}
              className="cursor-pointer"
              onMouseEnter={(ev) => {
                setHoverKey(s.key);
                const box = boxRef.current?.getBoundingClientRect();
                if (box) setTip({ x: ev.clientX - box.left, y: ev.clientY - box.top });
              }}
              onMouseMove={(ev) => {
                const box = boxRef.current?.getBoundingClientRect();
                if (box) setTip({ x: ev.clientX - box.left, y: ev.clientY - box.top });
              }}
            />
          );
        })}

        {/* name labels at the right end of pinned lines */}
        {ordered
          .filter((s) => selected.has(s.key))
          .map((s) => (
            <text
              key={`lbl-${s.key}`}
              x={axisX(n - 1) + 6}
              y={y(s[PARALLEL_AXES[n - 1].key]) + 4}
              fill="rgba(255,255,255,0.92)"
              fontSize="11"
              fontWeight={600}
              textAnchor="start"
            >
              {s.school}
            </text>
          ))}
      </svg>

      {hovered && tip && (
        <div
          className="pointer-events-none absolute z-20 w-max max-w-[240px] -translate-x-1/2 -translate-y-full rounded-lg border border-white/10 bg-zinc-900/95 px-2.5 py-1.5 text-xs shadow-xl"
          style={{ left: tip.x, top: tip.y - 10 }}
        >
          <div className="font-bold text-foreground">{hovered.school}</div>
          {hovered.council && (
            <div className="text-muted-foreground/70">{hovered.council}</div>
          )}
          <div dir="ltr" className="mt-0.5 text-muted-foreground tabular-nums">
            {PARALLEL_AXES.map((a) => `${hovered[a.key]}%`).join(" · ")}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Shared filter bar: gender · sector · school search ---------- */
function SchoolFilterBar({
  gender,
  onGender,
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
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <GenderToggle value={gender} onChange={onGender} surface="schools_filter" />

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

/* The two school-level distribution charts, sharing one filter bar.
 * Pure client-side SVG — render after mount so SSR and first client paint
 * agree (same gate the lab uses). */
export function SchoolCharts() {
  const t = useT();
  const locale = useLocale();

  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  const [gender, setGender] = React.useState<SGender>("בנים");
  const [sector, setSector] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<Map<number, string>>(new Map());

  const g: Gender = gender === "בנים" ? "m" : "f";
  const dots = React.useMemo(() => schoolDots(g, "combat"), [g]);
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

  if (!mounted) return <SectionSkeleton panels={2} />;

  return (
    <div className="space-y-6">
      {/* one filter bar drives both charts below */}
      <SchoolFilterBar
        gender={gender}
        onGender={setGender}
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

      <Panel>
        <PanelHeader title={t.lab.histTitle} subtitle={t.lab.histSubtitle} />
        <Beeswarm dots={dots} selected={selectedKeys} sector={sector} />
      </Panel>

      <Panel>
        <PanelHeader title={t.lab.parallelTitle} subtitle={t.lab.parallelSubtitle} />
        <ParallelCoords schools={profiles} selected={selectedKeys} sector={sector} t={t} />
      </Panel>
    </div>
  );
}
