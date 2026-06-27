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
import { ArrowDown, ArrowUp, Pause, Play } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { GenderToggle } from "@/components/sectors/controls";
import { cn } from "@/lib/utils";
import type { Gender } from "@/lib/data";
import { SECTOR_COLOR, NEUTRAL, sectorColor, type SGender } from "@/lib/sectors";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel } from "@/lib/i18n/labels";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import {
  waffles,
  schoolDots,
  movers,
  cityScatter,
  bump,
  bubbleRace,
  armyComposition,
  ridgeline,
  sankeyFlow,
  outliers,
  LAB_FIRST,
  LAB_LAST,
  type Waffle,
  type SchoolDot,
  type CityPoint,
} from "@/lib/lab";
import { BIG_CITIES, cityColor } from "@/lib/cities";

const BIG: readonly string[] = BIG_CITIES;

const WAFFLE_STAGE = {
  enlisted: "#38bdf888",
  combat: "#38bdf8",
  officer: "#a78bfa",
} as const;
const EMPTY = "rgba(255,255,255,0.06)";

/* ---------- 1) Waffle: out of 100 youth ---------- */
function WaffleCard({
  d,
  t,
  locale,
}: {
  d: Waffle;
  t: Dictionary;
  locale: Locale;
}) {
  // combat first (solid), then officers as a SEPARATE slice of enlistees — not
  // nested inside combat — then the remaining enlistees, then non-enlisted.
  // (officers are a % of enlistees, independent of combat; see sankey note.)
  const offEnd = Math.min(d.enlisted, d.combat + d.officer);
  const cells = Array.from({ length: 100 }, (_, i) => {
    if (i < d.combat) return WAFFLE_STAGE.combat;
    if (i < offEnd) return WAFFLE_STAGE.officer;
    if (i < d.enlisted) return WAFFLE_STAGE.enlisted;
    return EMPTY;
  });
  return (
    <div className="rounded-xl border border-white/10 bg-white/3 p-4">
      {/* fixed-height header so a 2-line label (e.g. "Religious-Zionist") doesn't
          push this card's grid down and break alignment with the others */}
      <div className="mb-3 flex min-h-10 items-start justify-between gap-2">
        <span className="font-bold leading-tight text-foreground">
          {sectorLabel(d.sector, locale)}
        </span>
        <span className="shrink-0 whitespace-nowrap pt-0.5 text-xs text-muted-foreground">
          {t.lab.per100}
        </span>
      </div>
      <div className="grid grid-cols-10 gap-1">
        {cells.map((c, i) => (
          <div
            key={i}
            className="aspect-square rounded-[3px]"
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-muted-foreground sm:text-xs">
        <span className="text-center whitespace-nowrap" style={{ color: WAFFLE_STAGE.enlisted }}>
          <span className="font-bold text-foreground">{d.enlisted}</span> {t.lab.enlisted}
        </span>
        <span className="text-center whitespace-nowrap" style={{ color: WAFFLE_STAGE.combat }}>
          <span className="font-bold text-foreground">{d.combat}</span> {t.lab.combat}
        </span>
        <span className="text-center whitespace-nowrap" style={{ color: WAFFLE_STAGE.officer }}>
          <span className="font-bold text-foreground">{d.officer}</span> {t.lab.officer}
        </span>
      </div>
    </div>
  );
}

/* ---------- 2) Force-directed beeswarm: every school finds its place ----------
 *  Moved here from the old D3 lab. A d3-force simulation pushes each school to
 *  its rate on the x-axis (forceX) while forceCollide stops dots overlapping —
 *  so the true density at each rate emerges as vertical thickness, no binning. */
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

function Beeswarm({ dots }: { dots: SchoolDot[] }) {
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
        {nodes.map((n) => (
          <circle
            key={`${n.d.key}-${n.d.value}`}
            cx={n.x}
            cy={n.y}
            r={BEE_R}
            fill={sectorColor(n.d.sector)}
            fillOpacity={0.85}
          >
            <title>
              {n.d.school}
              {n.d.council ? ` · ${n.d.council}` : ""} — {n.d.value}%
            </title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

/* ---------- 3) Biggest movers ---------- */
function Movers({
  risers,
  fallers,
  t,
}: {
  risers: ReturnType<typeof movers>;
  fallers: ReturnType<typeof movers>;
  t: Dictionary;
}) {
  const Row = ({ m, up }: { m: (typeof risers)[number]; up: boolean }) => (
    <div className="flex items-center gap-2 py-2 sm:gap-3">
      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
        {m.council}
      </span>
      <span
        dir="ltr"
        className="shrink-0 whitespace-nowrap text-xs text-muted-foreground tabular-nums sm:text-sm"
      >
        {m.from}% <span className="opacity-50">→</span> {m.to}%
      </span>
      <span
        className={cn(
          "inline-flex size-6 shrink-0 items-center justify-center rounded-full",
          up ? "bg-emerald-400/15 text-emerald-400" : "bg-rose-400/15 text-rose-400",
        )}
      >
        {up ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />}
      </span>
      <span
        className={cn(
          "w-16 shrink-0 whitespace-nowrap text-end text-sm font-bold tabular-nums",
          up ? "text-emerald-400" : "text-rose-400",
        )}
      >
        {Math.abs(m.delta)} {t.lab.points}
      </span>
    </div>
  );
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <div className="mb-1 text-sm font-medium text-emerald-400">
          {t.lab.risers}
        </div>
        <div className="divide-y divide-white/5">
          {risers.map((m) => (
            <Row key={m.council} m={m} up />
          ))}
        </div>
      </div>
      <div>
        <div className="mb-1 text-sm font-medium text-rose-400">
          {t.lab.fallers}
        </div>
        <div className="divide-y divide-white/5">
          {fallers.map((m) => (
            <Row key={m.council} m={m} up={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 4) Two-armies quadrant scatter ---------- */
const SC_W = 880;
const SC_H = 440;
const SC_PAD = 44;
function QuadrantScatter({
  data,
  t,
}: {
  data: ReturnType<typeof cityScatter>;
  t: Dictionary;
}) {
  const { points, medEnlist, medCombat } = data;
  // Which cities are featured (blue + labeled). Seeded with the big cities, but
  // the user can click any dot to add or remove it.
  const [featured, setFeatured] = React.useState<Set<string>>(() => new Set(BIG));
  const [hover, setHover] = React.useState<string | null>(null);
  if (!points.length) return null;

  const isF = (c: string) => featured.has(c);
  const toggle = (c: string) =>
    setFeatured((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });

  const xs = points.map((p) => p.enlist);
  const ys = points.map((p) => p.combat);
  const xMin = Math.max(0, Math.floor((Math.min(...xs) - 3) / 5) * 5);
  const xMax = Math.min(100, Math.ceil((Math.max(...xs) + 3) / 5) * 5);
  const yMin = Math.max(0, Math.floor((Math.min(...ys) - 3) / 5) * 5);
  const yMax = Math.min(100, Math.ceil((Math.max(...ys) + 3) / 5) * 5);
  const px = (v: number) =>
    SC_PAD + ((v - xMin) / (xMax - xMin)) * (SC_W - 2 * SC_PAD);
  const py = (v: number) =>
    SC_H - SC_PAD - ((v - yMin) / (yMax - yMin)) * (SC_H - 2 * SC_PAD);
  const rad = (n: number) => 3 + Math.min(8, Math.sqrt(n) * 1.4);
  const mx = px(medEnlist);
  const my = py(medCombat);
  // Draw order: rest, then featured, then the hovered dot on top.
  const depth = (p: CityPoint) =>
    hover === p.council ? 2 : isF(p.council) ? 1 : 0;
  const sorted = [...points].sort((a, b) => depth(a) - depth(b));

  // De-collide the featured labels: stack clustered ones upward, above the dots.
  const bigLabels = points
    .filter((p) => isF(p.council))
    .map((p) => ({
      council: p.council,
      x: px(p.enlist),
      dotY: py(p.combat),
      r: rad(p.n),
      y: py(p.combat) - rad(p.n) - 7,
    }))
    .sort((a, b) => a.x - b.x || a.y - b.y);
  const LGAP = 14;
  const XCLOSE = 90;
  for (let i = 1; i < bigLabels.length; i++) {
    for (let j = 0; j < i; j++) {
      if (
        Math.abs(bigLabels[i].x - bigLabels[j].x) < XCLOSE &&
        Math.abs(bigLabels[i].y - bigLabels[j].y) < LGAP
      ) {
        bigLabels[i].y = bigLabels[j].y - LGAP;
      }
    }
  }

  const hp = hover ? points.find((p) => p.council === hover) ?? null : null;
  // Flip the tooltip below the dot when it's too close to the top edge.
  const tipBelow = hp ? py(hp.combat) < 70 : false;

  return (
    <div className="overflow-x-auto">
      <div className="relative min-w-[640px] pb-6 pl-6">
        <div className="relative">
          <svg viewBox={`0 0 ${SC_W} ${SC_H}`} className="h-auto w-full">
            {/* median split */}
            <line x1={mx} x2={mx} y1={SC_PAD - 8} y2={SC_H - SC_PAD} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4" />
            <line x1={SC_PAD} x2={SC_W - SC_PAD} y1={my} y2={my} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 4" />
            {sorted.map((p) => {
              const f = isF(p.council);
              const h = hover === p.council;
              const r = rad(p.n);
              return (
                <circle
                  key={p.council}
                  cx={px(p.enlist)}
                  cy={py(p.combat)}
                  r={h ? r + 2 : r}
                  fill={f ? "#38bdf8" : "#475569"}
                  fillOpacity={f ? 0.95 : h ? 0.85 : 0.55}
                  stroke={f ? "#bae6fd" : h ? "#94a3b8" : "none"}
                  strokeWidth={f || h ? 1 : 0}
                  className="cursor-pointer"
                  onMouseEnter={() => setHover(p.council)}
                  onMouseLeave={() =>
                    setHover((cur) => (cur === p.council ? null : cur))
                  }
                  onClick={() => toggle(p.council)}
                />
              );
            })}
            {bigLabels.map((l) => (
              <g
                key={l.council}
                className="cursor-pointer"
                onClick={() => toggle(l.council)}
              >
                {l.y < l.dotY - l.r - 9 && (
                  <line x1={l.x} y1={l.dotY - l.r} x2={l.x} y2={l.y + 3} stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
                )}
                <text x={l.x} y={l.y} fill="rgba(255,255,255,0.88)" fontSize="11" textAnchor="middle">
                  {l.council}
                </text>
              </g>
            ))}
          </svg>

          {/* hover tooltip — positioned over the dot in viewBox-percent space */}
          {hp && (
            <div
              className="pointer-events-none absolute z-20 w-max rounded-lg border border-white/10 bg-zinc-900/95 px-2.5 py-1.5 text-xs shadow-xl"
              style={{
                left: `${(px(hp.enlist) / SC_W) * 100}%`,
                top: `${(py(hp.combat) / SC_H) * 100}%`,
                transform: `translate(-50%, ${
                  tipBelow
                    ? `${rad(hp.n) + 8}px`
                    : `calc(-100% - ${rad(hp.n) + 8}px)`
                })`,
              }}
            >
              <div className="font-bold text-foreground">{hp.council}</div>
              <div className="text-muted-foreground">
                {t.lab.scatterTip(hp.enlist, hp.combat)}
              </div>
              <div className="text-muted-foreground/70">{t.lab.schools(hp.n)}</div>
            </div>
          )}
        </div>

        {/* quadrant captions — HTML overlay (RTL-safe, never clipped) */}
        <div className="pointer-events-none absolute inset-0 text-[11px] leading-tight text-muted-foreground/55">
          <span className="absolute right-2 top-1 text-right">{t.lab.qTopRight}</span>
          <span className="absolute left-2 top-1 text-left">{t.lab.qTopLeft}</span>
          <span className="absolute bottom-8 right-2 text-right">{t.lab.qBottomRight}</span>
          <span className="absolute bottom-8 left-2 text-left">{t.lab.qBottomLeft}</span>
        </div>

        {/* axis labels */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 text-center text-xs text-muted-foreground">
          {t.lab.axisEnlist}
        </div>
        <div className="pointer-events-none absolute bottom-1/2 left-0 -rotate-90 text-xs text-muted-foreground">
          {t.lab.axisCombat}
        </div>
      </div>
    </div>
  );
}

/* ---------- 5) Bump chart — rank over the years ---------- */
const BP_W = 880;
const BP_H = 360;
const BP_PADX = 64;
const BP_TOP = 22;
const BP_BOT = 34;
function BumpChart({
  data,
  t,
}: {
  data: ReturnType<typeof bump>;
  t: Dictionary;
}) {
  const { years, maxRank, series } = data;
  const x = (year: number) =>
    BP_PADX + (years.indexOf(year) / (years.length - 1)) * (BP_W - 2 * BP_PADX);
  const y = (rank: number) =>
    BP_TOP + ((rank - 1) / Math.max(1, maxRank - 1)) * (BP_H - BP_TOP - BP_BOT);

  // End labels, de-collided vertically (cities often finish at the same rank).
  const endLabels = series
    .flatMap((s) => {
      const pts = s.points.filter((p) => p.rank != null);
      if (!pts.length) return [];
      const last = pts[pts.length - 1];
      return [
        {
          council: s.council,
          color: cityColor(s.council),
          x: x(last.year),
          dotY: y(last.rank as number),
          y: y(last.rank as number),
        },
      ];
    })
    .sort((a, b) => a.dotY - b.dotY);
  const GAP = 15;
  for (let i = 1; i < endLabels.length; i++) {
    if (endLabels[i].y - endLabels[i - 1].y < GAP) {
      endLabels[i].y = endLabels[i - 1].y + GAP;
    }
  }

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${BP_W} ${BP_H}`} className="h-auto w-full min-w-[640px]">
        {years.map((yr) => (
          <text key={yr} x={x(yr)} y={BP_H - 12} fill="rgba(255,255,255,0.45)" fontSize="12" textAnchor="middle">
            {yr}
          </text>
        ))}
        {series.map((s) => {
          const pts = s.points.filter((p) => p.rank != null);
          if (!pts.length) return null;
          const color = cityColor(s.council);
          const d = pts
            .map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.year)} ${y(p.rank as number)}`)
            .join(" ");
          return (
            <g key={s.council}>
              <path d={d} fill="none" stroke={color} strokeWidth={2.25} strokeLinejoin="round" />
              {pts.map((p) => (
                <circle key={p.year} cx={x(p.year)} cy={y(p.rank as number)} r={3.5} fill={color}>
                  <title>
                    {s.council} · {p.year} — {t.lab.rank} {p.rank} ({p.value}%)
                  </title>
                </circle>
              ))}
            </g>
          );
        })}
        {endLabels.map((l) => (
          <g key={l.council}>
            {Math.abs(l.y - l.dotY) > 1 && (
              <line x1={l.x} y1={l.dotY} x2={l.x + 6} y2={l.y - 3} stroke={l.color} strokeOpacity={0.4} strokeWidth={1} />
            )}
            <text x={l.x + 9} y={l.y} fill={l.color} fontSize="11" fontWeight={600} dominantBaseline="middle">
              {l.council}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ---------- 6) Bubble race — Gapminder over the years ---------- */
const BR_W = 880;
const BR_H = 470;
const BR_PAD = 48;

/** Advance an index 0..length-1 on a timer while `playing`, looping. */
function useTicker(length: number, playing: boolean, ms = 1150) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (!playing || length < 2) return;
    const id = setInterval(() => setI((p) => (p + 1) % length), ms);
    return () => clearInterval(id);
  }, [playing, length, ms]);
  return [i, setI] as const;
}

function BubbleRace({
  data,
  t,
}: {
  data: ReturnType<typeof bubbleRace>;
  t: Dictionary;
}) {
  const { years, frames, xBounds, yBounds } = data;
  const [playing, setPlaying] = React.useState(true);
  const [idx, setIdx] = useTicker(years.length, playing);
  const frame = frames[idx];
  const [xMin, xMax] = xBounds;
  const [yMin, yMax] = yBounds;
  const px = (v: number) =>
    BR_PAD + ((v - xMin) / (xMax - xMin)) * (BR_W - 2 * BR_PAD);
  const py = (v: number) =>
    BR_H - BR_PAD - ((v - yMin) / (yMax - yMin)) * (BR_H - 2 * BR_PAD);
  const rad = (n: number) => 4 + Math.min(20, Math.sqrt(n) * 2.3);
  const xticks = [xMin, Math.round((xMin + xMax) / 2), xMax];
  const yticks = [yMin, Math.round((yMin + yMax) / 2), yMax];

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10"
          aria-label={playing ? t.lab.racePause : t.lab.racePlay}
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <input
          type="range"
          min={0}
          max={years.length - 1}
          value={idx}
          onChange={(e) => {
            setPlaying(false);
            setIdx(Number(e.target.value));
          }}
          className="h-1 flex-1 cursor-pointer accent-sky-400"
        />
        <span className="w-12 shrink-0 text-end text-lg font-bold tabular-nums text-foreground">
          {frame.year}
        </span>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${BR_W} ${BR_H}`} className="h-auto w-full min-w-[640px]">
          {/* watermark year */}
          <text
            x={BR_W / 2}
            y={BR_H / 2}
            fill="rgba(255,255,255,0.05)"
            fontSize="180"
            fontWeight={800}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {frame.year}
          </text>
          {/* gridlines */}
          {xticks.map((v) => (
            <g key={`x${v}`}>
              <line x1={px(v)} x2={px(v)} y1={BR_PAD - 10} y2={BR_H - BR_PAD} stroke="rgba(255,255,255,0.07)" />
              <text x={px(v)} y={BR_H - BR_PAD + 18} fill="rgba(255,255,255,0.45)" fontSize="11" textAnchor="middle">
                {v}%
              </text>
            </g>
          ))}
          {yticks.map((v) => (
            <g key={`y${v}`}>
              <line x1={BR_PAD} x2={BR_W - BR_PAD} y1={py(v)} y2={py(v)} stroke="rgba(255,255,255,0.07)" />
              <text x={BR_PAD - 8} y={py(v) + 4} fill="rgba(255,255,255,0.45)" fontSize="11" textAnchor="end">
                {v}%
              </text>
            </g>
          ))}
          {frame.points.map((p) => (
            <circle
              key={p.council}
              cx={px(p.x)}
              cy={py(p.y)}
              r={rad(p.n)}
              fill={p.big ? "#38bdf8" : NEUTRAL}
              fillOpacity={p.big ? 0.9 : 0.4}
              stroke={p.big ? "#bae6fd" : "none"}
              strokeWidth={p.big ? 1 : 0}
              style={{ transition: "cx 800ms ease, cy 800ms ease, r 400ms ease" }}
            >
              <title>
                {p.council} · {frame.year} — {t.lab.scatterTip(p.x, p.y)}
              </title>
            </circle>
          ))}
          {frame.points
            .filter((p) => p.big)
            .map((p) => (
              <text
                key={`l${p.council}`}
                x={px(p.x)}
                y={py(p.y) - rad(p.n) - 4}
                fill="rgba(255,255,255,0.85)"
                fontSize="11"
                textAnchor="middle"
                style={{ transition: "x 800ms ease, y 800ms ease" }}
              >
                {p.council}
              </text>
            ))}
          <text x={BR_W / 2} y={BR_H - 6} fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle">
            {t.lab.axisEnlist}
          </text>
          <text x={14} y={BR_H / 2} fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle" transform={`rotate(-90 14 ${BR_H / 2})`}>
            {t.lab.axisCombat}
          </text>
        </svg>
      </div>
    </div>
  );
}

/* ---------- 7) Army composition — who fills the army over time ---------- */
const AC_W = 880;
const AC_H = 420;
const AC_PADX = 44;
const AC_TOP = 16;
const AC_BOT = 34;
function hex(n: number) {
  return Math.round(n).toString(16).padStart(2, "0");
}
function lerpColor(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((c, i) => hex(c + (pb[i] - c) * t)).join("")}`;
}

function ArmyComposition({
  data,
  t,
  locale,
}: {
  data: ReturnType<typeof armyComposition>;
  t: Dictionary;
  locale: Locale;
}) {
  const { years, series } = data;
  const n = years.length;
  const x = (i: number) => AC_PADX + (i / (n - 1)) * (AC_W - 2 * AC_PADX);
  const y = (share: number) =>
    AC_TOP + (1 - share / 100) * (AC_H - AC_TOP - AC_BOT);

  // cumulative stack: walk sectors bottom→top, each band sits on the running base
  const bands = React.useMemo(() => {
    const base = new Array(n).fill(0);
    return series.map((s) => {
      const lower = [...base];
      const upper = s.shares.map((sh, i) => lower[i] + sh);
      for (let i = 0; i < n; i++) base[i] = upper[i];
      const top = upper.map((v, i) => `${x(i)},${y(v)}`);
      const bottom = lower.map((v, i) => `${x(i)},${y(v)}`).reverse();
      return {
        sector: s.sector,
        color: s.color,
        shares: s.shares,
        counts: s.counts,
        lower,
        upper,
        d: `M ${top.join(" L ")} L ${bottom.join(" L ")} Z`,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, n]);

  return (
    <div>
      <div className="-mt-2 mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
        {series.map((s) => (
          <span key={s.sector} className="flex items-center gap-2">
            <span className="size-3 rounded-full" style={{ background: s.color }} />
            {sectorLabel(s.sector, locale)}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${AC_W} ${AC_H}`} className="h-auto w-full min-w-[640px]">
          {[0, 25, 50, 75, 100].map((p) => (
            <g key={p}>
              <line x1={AC_PADX} x2={AC_W - AC_PADX} y1={y(p)} y2={y(p)} stroke="rgba(255,255,255,0.07)" />
              <text x={AC_PADX - 8} y={y(p) + 4} fill="rgba(255,255,255,0.45)" fontSize="11" textAnchor="end" className="tabular-nums">
                {p}%
              </text>
            </g>
          ))}
          {bands.map((b) => (
            <path key={b.sector} d={b.d} fill={b.color} fillOpacity={0.82}>
              <title>
                {sectorLabel(b.sector, locale)} · {years[n - 1]} — {b.shares[n - 1]}% (
                {Math.round(b.counts[n - 1]).toLocaleString()})
              </title>
            </path>
          ))}
          {/* end-of-band share labels for the latest year — white with a dark
              halo (paint-order: stroke) so they read on any band color */}
          {bands.map((b) => {
            const mid = (b.lower[n - 1] + b.upper[n - 1]) / 2;
            if (b.upper[n - 1] - b.lower[n - 1] < 6) return null;
            return (
              <text
                key={`v${b.sector}`}
                x={x(n - 1) - 8}
                y={y(mid) + 4}
                fill="#fff"
                stroke="#0b1220"
                strokeWidth={2.75}
                fontSize="12"
                fontWeight={700}
                textAnchor="end"
                className="tabular-nums"
                style={{ paintOrder: "stroke" }}
              >
                {b.shares[n - 1]}%
              </text>
            );
          })}
          {years.map((yr, i) => (
            <text key={yr} x={x(i)} y={AC_H - 12} fill="rgba(255,255,255,0.45)" fontSize="12" textAnchor="middle" className="tabular-nums">
              {yr}
            </text>
          ))}
        </svg>
      </div>
      <p className="mt-3 text-xs text-muted-foreground/70">{t.lab.compNote}</p>
    </div>
  );
}

/* ---------- 8) Ridgeline — the distribution shifting year by year ---------- */
const RG_W = 880;
const RG_H = 540;
const RG_PADX = 64;
const RG_TOP = 18;
const RG_BOT = 40;
function Ridgeline({ data, t }: { data: ReturnType<typeof ridgeline>; t: Dictionary }) {
  const { years, ridges, maxDensity } = data;
  const n = years.length;
  const rowH = (RG_H - RG_TOP - RG_BOT) / n;
  // keep each ridge inside its own band (amp < rowH) so the years don't tangle
  const amp = rowH * 0.9;
  const bins = ridges[0]?.density.length ?? 1;
  const x = (i: number) => RG_PADX + (i / (bins - 1)) * (RG_W - 2 * RG_PADX);
  const xPct = (v: number) => RG_PADX + (v / 100) * (RG_W - 2 * RG_PADX);
  const baseline = (rowIdx: number) => RG_TOP + (rowIdx + 1) * rowH;
  // path tracing each year's median, so the eye can follow the center drift
  const medianTrack = ridges
    .map((r, i) => `${xPct(r.median)},${baseline(i)}`)
    .join(" L ");

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${RG_W} ${RG_H}`} className="h-auto w-full min-w-[640px]">
        {[0, 25, 50, 75, 100].map((p) => {
          const xx = xPct(p);
          return (
            <g key={p}>
              <line x1={xx} x2={xx} y1={RG_TOP} y2={RG_H - RG_BOT} stroke="rgba(255,255,255,0.06)" />
              <text x={xx} y={RG_H - 22} fill="rgba(255,255,255,0.45)" fontSize="11" textAnchor="middle">
                {p}%
              </text>
            </g>
          );
        })}
        {ridges.map((ridge, rowIdx) => {
          const base = baseline(rowIdx);
          const tCol = rowIdx / Math.max(1, n - 1);
          const color = lerpColor("#475569", "#38bdf8", tCol);
          const pts = ridge.density.map(
            (d, i) => `${x(i)},${base - (d / maxDensity) * amp}`,
          );
          const area = `M ${x(0)},${base} L ${pts.join(" L ")} L ${x(bins - 1)},${base} Z`;
          const line = `M ${pts.join(" L ")}`;
          const mx = xPct(ridge.median);
          return (
            <g key={ridge.year}>
              <line x1={x(0)} x2={x(bins - 1)} y1={base} y2={base} stroke="rgba(255,255,255,0.1)" />
              <path d={area} fill={color} fillOpacity={0.5} />
              <path d={line} fill="none" stroke={color} strokeWidth={1.5} />
              {/* median marker: a tick rising from the baseline + its value */}
              <line x1={mx} x2={mx} y1={base} y2={base - amp * 0.62} stroke="#fff" strokeOpacity={0.7} strokeWidth={1.25} />
              <text x={mx} y={base - amp * 0.62 - 4} fill="rgba(255,255,255,0.92)" fontSize="10.5" fontWeight={700} textAnchor="middle" className="tabular-nums">
                {ridge.median}%
              </text>
              {/* year + school count at the left margin */}
              <text x={RG_PADX - 8} y={base - 3} fill="rgba(255,255,255,0.85)" fontSize="12" fontWeight={600} textAnchor="end" className="tabular-nums">
                {ridge.year}
              </text>
              <text x={RG_PADX - 8} y={base + 9} fill="rgba(255,255,255,0.4)" fontSize="9.5" textAnchor="end" className="tabular-nums">
                {t.lab.ridgeCount(ridge.n)}
              </text>
            </g>
          );
        })}
        {/* connect the medians so the drift over years is unmistakable */}
        <path d={`M ${medianTrack}`} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={1.25} strokeDasharray="3 3" />
        <text x={RG_W / 2} y={RG_H - 6} fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle">
          {t.lab.ridgeAxis}
        </text>
      </svg>
    </div>
  );
}

/* ---------- 9) Sankey — cohort → enlisted, then combat & officers ---------- *
 *  IMPORTANT: combat and officers are BOTH subsets of enlistees, not of each
 *  other. So officers branch off the enlisted node in PARALLEL with combat —
 *  never downstream of it (an earlier version implied officers ⊂ combat, which
 *  badly overstated the officer share, especially for girls). The two outflows
 *  are drawn as disjoint slices of the enlisted bar; in reality they overlap
 *  slightly (combat officers), noted in the caption. */
const SK_W = 880;
const SK_H = 470;
const SK_PADX = 64;
const SK_TOP = 18;
const SK_BOT = 44;
const SK_COL = 16;
const SK_LANE_GAP = 16;
const SK_OFF_GAP = 7;
function Sankey({
  data,
  t,
  locale,
}: {
  data: ReturnType<typeof sankeyFlow>;
  t: Dictionary;
  locale: Locale;
}) {
  const { stages, sectors } = data;
  const val = (stageIdx: number, sector: string) =>
    stages[stageIdx]?.slices.find((s) => s.sector === sector)?.value ?? 0;
  const totalCohort = stages[0]?.total || 1;
  const usableH =
    SK_H - SK_TOP - SK_BOT - SK_LANE_GAP * Math.max(0, sectors.length - 1);
  const scale = usableH / totalCohort;
  // 3 visual columns: cohort, enlisted, outcomes (combat over officers)
  const xOf = (i: number) =>
    SK_PADX + (i / 2) * (SK_W - 2 * SK_PADX - SK_COL);
  const [x0, x1, x2] = [xOf(0), xOf(1), xOf(2)];

  const cohortOf = (sector: string) => val(0, sector);
  const lanes = sectors.map((sector, i) => {
    const laneTop =
      SK_TOP +
      sectors
        .slice(0, i)
        .reduce((acc, s) => acc + cohortOf(s) * scale + SK_LANE_GAP, 0);
    return {
      sector,
      laneTop,
      color: sectorColor(sector),
      cohortH: val(0, sector) * scale,
      enlH: val(1, sector) * scale,
      combH: val(2, sector) * scale,
      offH: val(3, sector) * scale,
    };
  });

  const fmt = (n: number) =>
    n >= 1000 ? `${Math.round(n / 100) / 10}k` : `${Math.round(n)}`;
  // a tapering ribbon from (xa, top-aligned height ha) to (xb, top yb height hb)
  const ribbon = (
    xa: number,
    ha: number,
    ya: number,
    xb: number,
    hb: number,
    yb: number,
  ) => {
    const mid = (xa + xb) / 2;
    return `M ${xa},${ya} C ${mid},${ya} ${mid},${yb} ${xb},${yb} L ${xb},${yb + hb} C ${mid},${yb + hb} ${mid},${ya + ha} ${xa},${ya + ha} Z`;
  };

  return (
    <div>
      <div className="-mt-2 mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
        {sectors.map((s) => (
          <span key={s} className="flex items-center gap-2">
            <span className="size-3 rounded-full" style={{ background: sectorColor(s) }} />
            {sectorLabel(s, locale)}
          </span>
        ))}
        <span className="flex items-center gap-2">
          <span className="h-3 w-4 rounded-[2px] border border-dashed border-white/50 bg-white/10" />
          {t.lab.sankeyOfficerLegend}
        </span>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${SK_W} ${SK_H}`} className="h-auto w-full min-w-[640px]">
          {lanes.map((lane) => {
            const top = lane.laneTop;
            const offTop = top + lane.combH + SK_OFF_GAP;
            return (
              <g key={lane.sector}>
                {/* cohort → enlisted */}
                <path d={ribbon(x0 + SK_COL, lane.cohortH, top, x1, lane.enlH, top)} fill={lane.color} fillOpacity={0.2} />
                {/* enlisted → combat (top slice of the enlisted bar) */}
                <path d={ribbon(x1 + SK_COL, lane.combH, top, x2, lane.combH, top)} fill={lane.color} fillOpacity={0.28} />
                {/* enlisted → officers (next slice; a parallel outflow, not after combat) */}
                <path
                  d={ribbon(x1 + SK_COL, lane.offH, top + lane.combH, x2, lane.offH, offTop)}
                  fill={lane.color}
                  fillOpacity={0.16}
                />
                {/* nodes */}
                <rect x={x0} y={top} width={SK_COL} height={Math.max(0.5, lane.cohortH)} rx={2} fill={lane.color} fillOpacity={0.92} />
                <rect x={x1} y={top} width={SK_COL} height={Math.max(0.5, lane.enlH)} rx={2} fill={lane.color} fillOpacity={0.92} />
                <rect x={x2} y={top} width={SK_COL} height={Math.max(0.5, lane.combH)} rx={2} fill={lane.color} fillOpacity={0.92} />
                {lane.offH > 0.5 && (
                  <rect
                    x={x2}
                    y={offTop}
                    width={SK_COL}
                    height={lane.offH}
                    rx={2}
                    fill={lane.color}
                    fillOpacity={0.4}
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth={0.75}
                    strokeDasharray="2 1.5"
                  />
                )}
              </g>
            );
          })}
          {/* column labels + totals */}
          {[
            { x: x0, label: t.lab.sankeyStages.cohort, total: stages[0].total },
            { x: x1, label: t.lab.sankeyStages.enlist, total: stages[1].total },
          ].map((c) => (
            <g key={c.label}>
              <text x={c.x + SK_COL / 2} y={SK_H - 24} fill="rgba(255,255,255,0.7)" fontSize="12" fontWeight={600} textAnchor="middle">
                {c.label}
              </text>
              <text x={c.x + SK_COL / 2} y={SK_H - 9} fill="rgba(255,255,255,0.45)" fontSize="11" textAnchor="middle" className="tabular-nums">
                {fmt(c.total)}
              </text>
            </g>
          ))}
          {/* outcomes column carries two labels (combat + officers) */}
          <text x={x2 + SK_COL / 2} y={SK_H - 24} fill="rgba(255,255,255,0.7)" fontSize="12" fontWeight={600} textAnchor="middle">
            {t.lab.sankeyStages.combat} · {fmt(stages[2].total)}
          </text>
          <text x={x2 + SK_COL / 2} y={SK_H - 9} fill="rgba(255,255,255,0.5)" fontSize="11" textAnchor="middle" className="tabular-nums">
            {t.lab.sankeyStages.officer} · {fmt(stages[3].total)}
          </text>
        </svg>
      </div>
      <p className="mt-3 text-xs text-muted-foreground/70">{t.lab.sankeyNote}</p>
    </div>
  );
}

/* ---------- 10) Outliers — who bucks the enlist→combat trend ---------- */
const OL_W = 880;
const OL_H = 440;
const OL_PAD = 46;
function OutlierList({
  rows,
  kind,
  t,
}: {
  rows: ReturnType<typeof outliers>["over"];
  kind: "over" | "under";
  t: Dictionary;
}) {
  return (
    <div>
      <div
        className={cn(
          "mb-1 text-sm font-medium",
          kind === "over" ? "text-emerald-400" : "text-rose-400",
        )}
      >
        {kind === "over" ? t.lab.outlierOver : t.lab.outlierUnder}
      </div>
      <div className="divide-y divide-white/5">
        {rows.map((m) => (
          <div key={m.council} className="flex items-center gap-2 py-2">
            <span className="min-w-0 flex-1 truncate text-sm text-foreground">{m.council}</span>
            <span dir="ltr" className="shrink-0 whitespace-nowrap text-xs text-muted-foreground tabular-nums">
              {m.enlist}% → {m.combat}%
            </span>
            <span
              className={cn(
                "w-14 shrink-0 text-end text-sm font-bold tabular-nums",
                kind === "over" ? "text-emerald-400" : "text-rose-400",
              )}
            >
              {m.resid > 0 ? "+" : ""}
              {m.resid}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
function Outliers({
  data,
  t,
}: {
  data: ReturnType<typeof outliers>;
  t: Dictionary;
}) {
  const { points, slope, intercept, xBounds, over, under } = data;
  if (!points.length) return null;
  const [xMin, xMax] = xBounds;
  const ys = points.map((p) => p.combat);
  const yMin = Math.max(0, Math.floor((Math.min(...ys) - 3) / 5) * 5);
  const yMax = Math.min(100, Math.ceil((Math.max(...ys) + 3) / 5) * 5);
  const px = (v: number) =>
    OL_PAD + ((v - xMin) / (xMax - xMin)) * (OL_W - 2 * OL_PAD);
  const py = (v: number) =>
    OL_H - OL_PAD - ((v - yMin) / (yMax - yMin)) * (OL_H - 2 * OL_PAD);
  const hi = new Map<string, "over" | "under">();
  over.forEach((p) => hi.set(p.council, "over"));
  under.forEach((p) => hi.set(p.council, "under"));
  const lineY = (x: number) => slope * x + intercept;

  return (
    <div className="space-y-5">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${OL_W} ${OL_H}`} className="h-auto w-full min-w-[640px]">
          {[xMin, Math.round((xMin + xMax) / 2), xMax].map((v) => (
            <g key={`x${v}`}>
              <text x={px(v)} y={OL_H - OL_PAD + 18} fill="rgba(255,255,255,0.45)" fontSize="11" textAnchor="middle">
                {v}%
              </text>
            </g>
          ))}
          {[yMin, Math.round((yMin + yMax) / 2), yMax].map((v) => (
            <g key={`y${v}`}>
              <line x1={OL_PAD} x2={OL_W - OL_PAD} y1={py(v)} y2={py(v)} stroke="rgba(255,255,255,0.06)" />
              <text x={OL_PAD - 8} y={py(v) + 4} fill="rgba(255,255,255,0.45)" fontSize="11" textAnchor="end">
                {v}%
              </text>
            </g>
          ))}
          {/* regression line */}
          <line
            x1={px(xMin)}
            y1={py(lineY(xMin))}
            x2={px(xMax)}
            y2={py(lineY(xMax))}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth={1.5}
            strokeDasharray="6 5"
          />
          {points.map((p) => {
            const k = hi.get(p.council);
            const color = k === "over" ? "#34d399" : k === "under" ? "#fb7185" : "#475569";
            return (
              <circle
                key={p.council}
                cx={px(p.enlist)}
                cy={py(p.combat)}
                r={k ? 5 : 3}
                fill={color}
                fillOpacity={k ? 0.95 : 0.4}
                stroke={k ? "#0b1220" : "none"}
                strokeWidth={k ? 1 : 0}
              >
                <title>
                  {p.council} — {t.lab.scatterTip(p.enlist, p.combat)} ({p.resid > 0 ? "+" : ""}
                  {p.resid})
                </title>
              </circle>
            );
          })}
          {[...over, ...under].map((p) => (
            <text
              key={`l${p.council}`}
              x={px(p.enlist)}
              y={py(p.combat) - 8}
              fill="rgba(255,255,255,0.85)"
              fontSize="10.5"
              textAnchor="middle"
            >
              {p.council}
            </text>
          ))}
          <text x={OL_W / 2} y={OL_H - 6} fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle">
            {t.lab.axisEnlist}
          </text>
          <text x={14} y={OL_H / 2} fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle" transform={`rotate(-90 14 ${OL_H / 2})`}>
            {t.lab.axisCombat}
          </text>
        </svg>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <OutlierList rows={over} kind="over" t={t} />
        <OutlierList rows={under} kind="under" t={t} />
      </div>
    </div>
  );
}

/** A lab panel that owns its OWN gender filter — each chart is independent,
 *  so toggling boys/girls on one view doesn't change the others. The data for
 *  the view is computed in the render callback from the panel's current gender;
 *  it only recomputes when this panel's own toggle flips. */
function GenderPanel({
  title,
  subtitle,
  surface,
  note,
  children,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  surface?: string;
  /** muted caption under the chart — e.g. a data-method disclosure */
  note?: React.ReactNode;
  children: (g: Gender, gender: SGender) => React.ReactNode;
}) {
  const [gender, setGender] = React.useState<SGender>("בנים");
  const g: Gender = gender === "בנים" ? "m" : "f";
  return (
    <Panel>
      <PanelHeader title={title} subtitle={subtitle}>
        <GenderToggle value={gender} onChange={setGender} surface={surface} />
      </PanelHeader>
      {children(g, gender)}
      {note && <p className="mt-3 text-xs text-muted-foreground/70">{note}</p>}
    </Panel>
  );
}

export function Lab() {
  const t = useT();
  const locale = useLocale();

  // These views are pure client-side SVG (no chart lib); render after mount so
  // the SSR HTML and first client paint can't disagree (same gate as ChartContainer).
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <SectionSkeleton panels={3} />;

  return (
    <div className="space-y-8">
      {/* 1 — waffle */}
      <GenderPanel title={t.lab.waffleTitle} subtitle={t.lab.waffleSubtitle} surface="lab_waffle">
        {(g) => (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {waffles(g).map((d) => (
              <WaffleCard key={d.sector} d={d} t={t} locale={locale} />
            ))}
          </div>
        )}
      </GenderPanel>

      {/* 2 — sankey (the pipeline) */}
      <GenderPanel title={t.lab.sankeyTitle} subtitle={t.lab.sankeySubtitle} surface="lab_sankey">
        {(g) => <Sankey data={sankeyFlow(g)} t={t} locale={locale} />}
      </GenderPanel>

      {/* 3 — beeswarm */}
      <GenderPanel title={t.lab.histTitle} subtitle={t.lab.histSubtitle} surface="lab_beeswarm">
        {(g) => (
          <>
            <div className="-mt-2 mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              {Object.entries(SECTOR_COLOR).map(([s, c]) => (
                <span key={s} className="flex items-center gap-2">
                  <span className="size-3 rounded-full" style={{ background: c }} />
                  {sectorLabel(s, locale)}
                </span>
              ))}
            </div>
            <Beeswarm dots={schoolDots(g, "combat")} />
          </>
        )}
      </GenderPanel>

      {/* 4 — two-armies scatter */}
      <GenderPanel title={t.lab.scatterTitle} subtitle={t.lab.scatterSubtitle} surface="lab_scatter" note={t.lab.unweightedNote}>
        {(g) => <QuadrantScatter data={cityScatter(g)} t={t} />}
      </GenderPanel>

      {/* 5 — bump chart */}
      <GenderPanel title={t.lab.bumpTitle(LAB_FIRST, LAB_LAST)} subtitle={t.lab.bumpSubtitle} surface="lab_bump" note={t.lab.unweightedNote}>
        {(g) => <BumpChart data={bump(g, "combat")} t={t} />}
      </GenderPanel>

      {/* 6 — movers */}
      <GenderPanel title={t.lab.moversTitle(LAB_FIRST, LAB_LAST)} subtitle={t.lab.moversSubtitle} surface="lab_movers" note={t.lab.moversNote}>
        {(g) => {
          const all = movers(g, "combat");
          return <Movers risers={all.slice(0, 6)} fallers={all.slice(-6).reverse()} t={t} />;
        }}
      </GenderPanel>

      {/* 7 — bubble race */}
      <GenderPanel title={t.lab.raceTitle} subtitle={t.lab.raceSubtitle} surface="lab_race" note={t.lab.unweightedNote}>
        {(g) => <BubbleRace data={bubbleRace(g, "enlist", "combat")} t={t} />}
      </GenderPanel>

      {/* 8 — army composition over time */}
      <GenderPanel title={t.lab.compTitle} subtitle={t.lab.compSubtitle} surface="lab_composition">
        {(g) => <ArmyComposition data={armyComposition(g, "nFighters")} t={t} locale={locale} />}
      </GenderPanel>

      {/* 9 — ridgeline */}
      <GenderPanel title={t.lab.ridgeTitle} subtitle={t.lab.ridgeSubtitle} surface="lab_ridge">
        {(g) => <Ridgeline data={ridgeline(g, "combat")} t={t} />}
      </GenderPanel>

      {/* 10 — outliers */}
      <GenderPanel title={t.lab.outlierTitle} subtitle={t.lab.outlierSubtitle} surface="lab_outliers" note={t.lab.unweightedNote}>
        {(g) => <Outliers data={outliers(g)} t={t} />}
      </GenderPanel>
    </div>
  );
}
