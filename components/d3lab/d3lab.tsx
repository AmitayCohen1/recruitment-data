"use client";

import * as React from "react";
import {
  forceSimulation,
  forceX,
  forceY,
  forceCollide,
  type Simulation,
} from "d3-force";
import { contourDensity } from "d3-contour";
import { Delaunay } from "d3-delaunay";
import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";
import {
  stack,
  stackOffsetWiggle,
  stackOrderInsideOut,
  area,
  curveBasis,
  type SeriesPoint,
} from "d3-shape";
import { hierarchy, type HierarchyNode } from "d3-hierarchy";
import { Treemap, Pack } from "@visx/hierarchy";

import { Panel, PanelHeader } from "@/components/ui/panel";
import { GenderToggle } from "@/components/sectors/controls";
import { cn } from "@/lib/utils";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel } from "@/lib/i18n/labels";
import { SECTOR_COLOR, type SGender } from "@/lib/sectors";
import type { Gender, MetricKey } from "@/lib/data";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import {
  schoolDots,
  schoolCloud,
  cityScatter,
  armyComposition,
  sectorCityTree,
  type SchoolDot,
  type CloudPoint,
} from "@/lib/lab";

const SLATE = "#64748b";
const sectorColor = (s: string | null) => (s ? SECTOR_COLOR[s] ?? SLATE : SLATE);

/* hex color interpolation, matching the lab's helper */
function hex(n: number) {
  return Math.round(Math.max(0, Math.min(255, n)))
    .toString(16)
    .padStart(2, "0");
}
function lerpColor(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((c, i) => hex(c + (pb[i] - c) * t)).join("")}`;
}

/* small inline metric switch (enlist / combat / officer) */
const METRIC_KEYS: MetricKey[] = ["enlist", "combat", "officer"];
function MetricSwitch({
  value,
  onChange,
  t,
}: {
  value: MetricKey;
  onChange: (m: MetricKey) => void;
  t: Dictionary;
}) {
  return (
    <div className="inline-flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
      {METRIC_KEYS.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={cn(
            // fixed height + centered, normalized line-height: keeps the
            // selected highlight box aligned even in html-to-image PNG export,
            // where emoji font metrics would otherwise shift the padding box.
            "flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium leading-none transition-colors",
            value === m
              ? "bg-white/15 text-white"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {t.metrics[m].short}
        </button>
      ))}
    </div>
  );
}

function SectorLegend({ locale }: { locale: Locale }) {
  return (
    <div className="-mt-2 mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
      {Object.entries(SECTOR_COLOR).map(([s, c]) => (
        <span key={s} className="flex items-center gap-2">
          <span className="size-3 rounded-full" style={{ background: c }} />
          {sectorLabel(s, locale)}
        </span>
      ))}
    </div>
  );
}

/* ================================================================== *
 * 1) Force-directed beeswarm
 * ================================================================== */
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
  const nodes = React.useMemo(() => {
    const x = scaleLinear()
      .domain([0, 100])
      .range([BEE_PAD, BEE_W - BEE_PAD]);
    const ns: BeeNode[] = dots.map((d) => ({
      x: x(d.value),
      y: BEE_H / 2,
      d,
    }));
    const sim: Simulation<BeeNode, undefined> = forceSimulation(ns)
      .force("x", forceX<BeeNode>((n) => x(n.d.value)).strength(0.9))
      .force("y", forceY<BeeNode>(BEE_H / 2).strength(0.06))
      .force("collide", forceCollide<BeeNode>(BEE_R + 0.7).iterations(2))
      .stop();
    for (let i = 0; i < 280; i++) sim.tick();
    return ns;
  }, [dots]);

  const x = scaleLinear()
    .domain([0, 100])
    .range([BEE_PAD, BEE_W - BEE_PAD]);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${BEE_W} ${BEE_H}`} className="h-auto w-full min-w-[640px]">
        {[0, 25, 50, 75, 100].map((tick) => (
          <g key={tick}>
            <line
              x1={x(tick)}
              x2={x(tick)}
              y1={BEE_PAD - 8}
              y2={BEE_H - BEE_PAD}
              stroke="rgba(255,255,255,0.06)"
            />
            <text
              x={x(tick)}
              y={BEE_H - 6}
              fill="rgba(255,255,255,0.45)"
              fontSize="11"
              textAnchor="middle"
            >
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

/* ================================================================== *
 * 2) Density contours (enlist × combat)
 * ================================================================== */
const CT_W = 880;
const CT_H = 460;
const CT_PAD = 46;

function Contours({ points, t }: { points: CloudPoint[]; t: Dictionary }) {
  // school-level points give a richer field than the city aggregates
  const schools = React.useMemo(() => points, [points]);

  const { paths, dots, xTicks, yTicks, px, py } = React.useMemo(() => {
    const xs = schools.map((p) => p.enlist);
    const ys = schools.map((p) => p.combat);
    const [x0 = 0, x1 = 100] = extent(xs);
    const [y0 = 0, y1 = 100] = extent(ys);
    const xMin = Math.max(0, Math.floor((x0 - 3) / 5) * 5);
    const xMax = Math.min(100, Math.ceil((x1 + 3) / 5) * 5);
    const yMin = Math.max(0, Math.floor((y0 - 3) / 5) * 5);
    const yMax = Math.min(100, Math.ceil((y1 + 3) / 5) * 5);
    const px = scaleLinear()
      .domain([xMin, xMax])
      .range([CT_PAD, CT_W - CT_PAD]);
    const py = scaleLinear()
      .domain([yMin, yMax])
      .range([CT_H - CT_PAD, CT_PAD]);

    const pix: [number, number][] = schools.map((p) => [
      px(p.enlist),
      py(p.combat),
    ]);
    const contours = contourDensity<[number, number]>()
      .x((d) => d[0])
      .y((d) => d[1])
      .size([CT_W, CT_H])
      .bandwidth(22)
      .thresholds(14)(pix);

    const maxVal = contours.reduce((m, c) => Math.max(m, c.value), 0) || 1;
    const toPath = (coords: number[][][][]) =>
      coords
        .map((poly) =>
          poly
            .map(
              (ring) =>
                "M" + ring.map((pt) => `${pt[0]},${pt[1]}`).join("L") + "Z",
            )
            .join(""),
        )
        .join("");

    const paths = contours.map((c, i) => {
      const tt = c.value / maxVal;
      return {
        key: i,
        d: toPath(c.coordinates),
        fill: lerpColor("#0b2740", "#7dd3fc", tt),
        opacity: 0.18 + 0.62 * tt,
      };
    });

    return {
      paths,
      dots: schools.map((p, i) => ({ x: pix[i][0], y: pix[i][1], p })),
      xTicks: [xMin, Math.round((xMin + xMax) / 2), xMax],
      yTicks: [yMin, Math.round((yMin + yMax) / 2), yMax],
      px,
      py,
    };
  }, [schools]);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${CT_W} ${CT_H}`} className="h-auto w-full min-w-[640px]">
        {paths.map((p) => (
          <path key={p.key} d={p.d} fill={p.fill} fillOpacity={p.opacity} />
        ))}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={1.6} fill="#e2e8f0" fillOpacity={0.5}>
            <title>
              {d.p.school} — {t.lab.scatterTip(d.p.enlist, d.p.combat)}
            </title>
          </circle>
        ))}
        {xTicks.map((v) => (
          <text
            key={`x${v}`}
            x={px(v)}
            y={CT_H - CT_PAD + 18}
            fill="rgba(255,255,255,0.45)"
            fontSize="11"
            textAnchor="middle"
          >
            {v}%
          </text>
        ))}
        {yTicks.map((v) => (
          <text
            key={`y${v}`}
            x={CT_PAD - 8}
            y={py(v) + 4}
            fill="rgba(255,255,255,0.45)"
            fontSize="11"
            textAnchor="end"
          >
            {v}%
          </text>
        ))}
        <text
          x={CT_W / 2}
          y={CT_H - 6}
          fill="rgba(255,255,255,0.5)"
          fontSize="12"
          textAnchor="middle"
        >
          {t.lab.axisEnlist}
        </text>
        <text
          x={14}
          y={CT_H / 2}
          fill="rgba(255,255,255,0.5)"
          fontSize="12"
          textAnchor="middle"
          transform={`rotate(-90 14 ${CT_H / 2})`}
        >
          {t.lab.axisCombat}
        </text>
      </svg>
    </div>
  );
}

/* ================================================================== *
 * 3) Voronoi scatter — hover anywhere
 * ================================================================== */
const VR_W = 880;
const VR_H = 460;
const VR_PAD = 46;

function VoronoiScatter({
  data,
  t,
}: {
  data: ReturnType<typeof cityScatter>;
  t: Dictionary;
}) {
  const { points } = data;
  const [hover, setHover] = React.useState<number | null>(null);

  const { cells, px, py, xTicks, yTicks } = React.useMemo(() => {
    const xs = points.map((p) => p.enlist);
    const ys = points.map((p) => p.combat);
    const [x0 = 0, x1 = 100] = extent(xs);
    const [y0 = 0, y1 = 100] = extent(ys);
    const xMin = Math.max(0, Math.floor((x0 - 3) / 5) * 5);
    const xMax = Math.min(100, Math.ceil((x1 + 3) / 5) * 5);
    const yMin = Math.max(0, Math.floor((y0 - 3) / 5) * 5);
    const yMax = Math.min(100, Math.ceil((y1 + 3) / 5) * 5);
    const px = scaleLinear()
      .domain([xMin, xMax])
      .range([VR_PAD, VR_W - VR_PAD]);
    const py = scaleLinear()
      .domain([yMin, yMax])
      .range([VR_H - VR_PAD, VR_PAD]);

    const delaunay = Delaunay.from(
      points,
      (p) => px(p.enlist),
      (p) => py(p.combat),
    );
    const voronoi = delaunay.voronoi([0, 0, VR_W, VR_H]);
    const cells = points.map((_, i) => voronoi.renderCell(i));

    return {
      cells,
      px,
      py,
      xTicks: [xMin, Math.round((xMin + xMax) / 2), xMax],
      yTicks: [yMin, Math.round((yMin + yMax) / 2), yMax],
    };
  }, [points]);

  const hp = hover != null ? points[hover] : null;
  const tipBelow = hp ? py(hp.combat) < 70 : false;

  return (
    <div className="overflow-x-auto">
      <div className="relative min-w-[640px]">
        <svg viewBox={`0 0 ${VR_W} ${VR_H}`} className="h-auto w-full">
          {yTicks.map((v) => (
            <g key={`y${v}`}>
              <line
                x1={VR_PAD}
                x2={VR_W - VR_PAD}
                y1={py(v)}
                y2={py(v)}
                stroke="rgba(255,255,255,0.06)"
              />
              <text
                x={VR_PAD - 8}
                y={py(v) + 4}
                fill="rgba(255,255,255,0.45)"
                fontSize="11"
                textAnchor="end"
              >
                {v}%
              </text>
            </g>
          ))}
          {/* invisible voronoi cells drive the hover */}
          {cells.map((d, i) => (
            <path
              key={i}
              d={d ?? undefined}
              fill="transparent"
              stroke={hover === i ? "rgba(56,189,248,0.35)" : "transparent"}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover((cur) => (cur === i ? null : cur))}
            />
          ))}
          {points.map((p, i) => {
            const h = hover === i;
            const r = 3 + Math.min(8, Math.sqrt(p.n) * 1.4);
            return (
              <circle
                key={p.council}
                cx={px(p.enlist)}
                cy={py(p.combat)}
                r={h ? r + 2 : r}
                fill={p.big ? "#38bdf8" : "#64748b"}
                fillOpacity={p.big ? 0.9 : h ? 0.85 : 0.5}
                stroke={h ? "#bae6fd" : p.big ? "#bae6fd" : "none"}
                strokeWidth={h || p.big ? 1 : 0}
                className="pointer-events-none"
              />
            );
          })}
          {xTicks.map((v) => (
            <text
              key={`x${v}`}
              x={px(v)}
              y={VR_H - VR_PAD + 18}
              fill="rgba(255,255,255,0.45)"
              fontSize="11"
              textAnchor="middle"
            >
              {v}%
            </text>
          ))}
          <text
            x={VR_W / 2}
            y={VR_H - 6}
            fill="rgba(255,255,255,0.5)"
            fontSize="12"
            textAnchor="middle"
          >
            {t.lab.axisEnlist}
          </text>
          <text
            x={14}
            y={VR_H / 2}
            fill="rgba(255,255,255,0.5)"
            fontSize="12"
            textAnchor="middle"
            transform={`rotate(-90 14 ${VR_H / 2})`}
          >
            {t.lab.axisCombat}
          </text>
        </svg>
        {hp && (
          <div
            className="pointer-events-none absolute z-20 w-max rounded-lg border border-white/10 bg-zinc-900/95 px-2.5 py-1.5 text-xs shadow-xl"
            style={{
              left: `${(px(hp.enlist) / VR_W) * 100}%`,
              top: `${(py(hp.combat) / VR_H) * 100}%`,
              transform: `translate(-50%, ${tipBelow ? "12px" : "calc(-100% - 12px)"})`,
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
    </div>
  );
}

/* ================================================================== *
 * 4) + 5) Treemap & circle-pack hierarchy
 * ================================================================== */
type HNode = {
  name: string;
  color?: string;
  combat?: number;
  value?: number;
  children?: HNode[];
};

function buildRoot(
  branches: ReturnType<typeof sectorCityTree>,
): HierarchyNode<HNode> {
  const data: HNode = {
    name: "root",
    children: branches.map((b) => ({
      name: b.sector,
      color: b.color,
      children: b.cities.map((c) => ({
        name: c.city,
        color: b.color,
        combat: c.combat,
        value: c.n,
      })),
    })),
  };
  return hierarchy(data)
    .sum((d) => d.value ?? 0)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
}

const leafFill = (color: string, combat: number) => ({
  fill: color,
  opacity: 0.3 + 0.65 * Math.min(1, combat / 100),
});

const TM_W = 880;
const TM_H = 470;

function TreemapView({
  branches,
  locale,
}: {
  branches: ReturnType<typeof sectorCityTree>;
  locale: Locale;
}) {
  const root = React.useMemo(() => buildRoot(branches), [branches]);
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${TM_W} ${TM_H}`} className="h-auto w-full min-w-[640px]">
        <Treemap<HNode> root={root} size={[TM_W, TM_H]} round paddingInner={1.5}>
          {(treemap) => (
            <g>
              {treemap.descendants().map((node, i) => {
                const w = node.x1 - node.x0;
                const h = node.y1 - node.y0;
                if (node.depth === 1) {
                  // sector frame + label
                  return (
                    <g key={`s${i}`} transform={`translate(${node.x0},${node.y0})`}>
                      <rect
                        width={w}
                        height={h}
                        fill="none"
                        stroke={node.data.color}
                        strokeOpacity={0.5}
                        rx={3}
                      />
                      <text
                        x={6}
                        y={14}
                        fontSize="12"
                        fontWeight={700}
                        fill={node.data.color ?? "#fff"}
                      >
                        {sectorLabel(node.data.name, locale)}
                      </text>
                    </g>
                  );
                }
                if (node.depth !== 2) return null;
                const { fill, opacity } = leafFill(
                  node.data.color ?? SLATE,
                  node.data.combat ?? 0,
                );
                return (
                  <g key={`c${i}`} transform={`translate(${node.x0},${node.y0})`}>
                    <rect
                      width={w}
                      height={h}
                      fill={fill}
                      fillOpacity={opacity}
                      stroke="rgba(0,0,0,0.3)"
                      strokeWidth={0.5}
                      rx={2}
                    >
                      <title>
                        {node.data.name} — {node.data.value} · {node.data.combat}%
                      </title>
                    </rect>
                    {w > 42 && h > 22 && (
                      <text
                        x={4}
                        y={14}
                        fontSize="10.5"
                        fill="rgba(255,255,255,0.92)"
                      >
                        {node.data.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </Treemap>
      </svg>
    </div>
  );
}

const PK = 560;

function PackView({
  branches,
  locale,
}: {
  branches: ReturnType<typeof sectorCityTree>;
  locale: Locale;
}) {
  const root = React.useMemo(() => buildRoot(branches), [branches]);
  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${PK} ${PK}`}
        className="mx-auto h-auto w-full max-w-[600px]"
      >
        <Pack<HNode> root={root} size={[PK, PK]} padding={3}>
          {(packData) => {
            const circles = packData.descendants();
            return (
              <g>
                {circles.map((node, i) => {
                  if (node.depth === 1) {
                    return (
                      <g key={`s${i}`}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.r}
                          fill="none"
                          stroke={node.data.color}
                          strokeOpacity={0.4}
                        />
                        <text
                          x={node.x}
                          y={node.y - node.r + 14}
                          fontSize="12"
                          fontWeight={700}
                          textAnchor="middle"
                          fill={node.data.color ?? "#fff"}
                        >
                          {sectorLabel(node.data.name, locale)}
                        </text>
                      </g>
                    );
                  }
                  if (node.depth !== 2) return null;
                  const { fill, opacity } = leafFill(
                    node.data.color ?? SLATE,
                    node.data.combat ?? 0,
                  );
                  return (
                    <g key={`c${i}`}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.r}
                        fill={fill}
                        fillOpacity={opacity}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth={0.5}
                      >
                        <title>
                          {node.data.name} — {node.data.value} · {node.data.combat}%
                        </title>
                      </circle>
                      {node.r > 16 && (
                        <text
                          x={node.x}
                          y={node.y + 3}
                          fontSize="9.5"
                          textAnchor="middle"
                          fill="rgba(255,255,255,0.92)"
                        >
                          {node.data.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          }}
        </Pack>
      </svg>
    </div>
  );
}

/* ================================================================== *
 * 6) Streamgraph — army composition over time
 * ================================================================== */
const ST_W = 880;
const ST_H = 380;
const ST_PADX = 44;
const ST_PADY = 28;

function Streamgraph({
  data,
  locale,
}: {
  data: ReturnType<typeof armyComposition>;
  locale: Locale;
}) {
  const { years, series } = data;

  const { layers, x, y, colorOf } = React.useMemo(() => {
    const keys = series.map((s) => s.sector);
    const colorOf = new Map(series.map((s) => [s.sector, s.color]));
    const rows: Record<string, number>[] = years.map((year, i) => {
      const row: Record<string, number> = { year };
      series.forEach((s) => (row[s.sector] = s.counts[i]));
      return row;
    });
    const layers = stack<Record<string, number>>()
      .keys(keys)
      .offset(stackOffsetWiggle)
      .order(stackOrderInsideOut)(rows);

    let lo = Infinity;
    let hi = -Infinity;
    for (const layer of layers)
      for (const p of layer) {
        lo = Math.min(lo, p[0]);
        hi = Math.max(hi, p[1]);
      }
    const x = scaleLinear()
      .domain([0, years.length - 1])
      .range([ST_PADX, ST_W - ST_PADX]);
    const y = scaleLinear()
      .domain([lo, hi])
      .range([ST_H - ST_PADY, ST_PADY]);
    return { layers, x, y, colorOf };
  }, [series, years]);

  const areaGen = area<SeriesPoint<Record<string, number>>>()
    .x((_d, i) => x(i))
    .y0((d) => y(d[0]))
    .y1((d) => y(d[1]))
    .curve(curveBasis);

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
        <svg viewBox={`0 0 ${ST_W} ${ST_H}`} className="h-auto w-full min-w-[640px]">
          {layers.map((layer) => (
            <path
              key={layer.key}
              d={areaGen(layer) ?? undefined}
              fill={colorOf.get(layer.key) ?? SLATE}
              fillOpacity={0.85}
            >
              <title>{sectorLabel(layer.key, locale)}</title>
            </path>
          ))}
          {years.map((yr, i) => (
            <text
              key={yr}
              x={x(i)}
              y={ST_H - 8}
              fill="rgba(255,255,255,0.45)"
              fontSize="12"
              textAnchor="middle"
              className="tabular-nums"
            >
              {yr}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ================================================================== *
 * root
 * ================================================================== */
export function D3Lab() {
  const t = useT();
  const locale = useLocale();
  const [gender, setGender] = React.useState<SGender>("בנים");
  const g: Gender = gender === "בנים" ? "m" : "f";
  const [beeMetric, setBeeMetric] = React.useState<MetricKey>("combat");

  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  const dots = React.useMemo(() => schoolDots(g, beeMetric), [g, beeMetric]);
  const cloud = React.useMemo(() => schoolCloud(g), [g]);
  const scatter = React.useMemo(() => cityScatter(g), [g]);
  const tree = React.useMemo(() => sectorCityTree(g), [g]);
  const stream = React.useMemo(() => armyComposition(g, "nFighters"), [g]);

  if (!mounted) return <div className="min-h-[480px]" />;

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <GenderToggle value={gender} onChange={setGender} />
      </div>

      {/* 1 — force beeswarm */}
      <Panel>
        <PanelHeader title={t.d3.beeTitle} subtitle={t.d3.beeSubtitle} />
        <div className="-mt-1 mb-4 flex flex-wrap items-center justify-between gap-3">
          <MetricSwitch value={beeMetric} onChange={setBeeMetric} t={t} />
        </div>
        <SectorLegend locale={locale} />
        <Beeswarm dots={dots} />
      </Panel>

      {/* 2 — density contours */}
      <Panel>
        <PanelHeader title={t.d3.contourTitle} subtitle={t.d3.contourSubtitle} />
        <Contours points={cloud} t={t} />
      </Panel>

      {/* 3 — voronoi scatter */}
      <Panel>
        <PanelHeader title={t.d3.voronoiTitle} subtitle={t.d3.voronoiSubtitle} />
        <VoronoiScatter data={scatter} t={t} />
      </Panel>

      {/* 4 — treemap */}
      <Panel>
        <PanelHeader title={t.d3.treemapTitle} subtitle={t.d3.treemapSubtitle} />
        <SectorLegend locale={locale} />
        <TreemapView branches={tree} locale={locale} />
      </Panel>

      {/* 5 — circle packing */}
      <Panel>
        <PanelHeader title={t.d3.packTitle} subtitle={t.d3.packSubtitle} />
        <PackView branches={tree} locale={locale} />
      </Panel>

      {/* 6 — streamgraph */}
      <Panel>
        <PanelHeader title={t.d3.streamTitle} subtitle={t.d3.streamSubtitle} />
        <Streamgraph data={stream} locale={locale} />
      </Panel>
    </div>
  );
}
