"use client";

import * as React from "react";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { ChartFootnote, ChartLegend } from "@/components/ui/panel";
import { GenderPanel, LabGenderCtx } from "@/components/lab/gender-panel";
import { MetricTabsS } from "@/components/sectors/controls";
import { ControlGroup, SegmentButton } from "@/components/ui/control";
import { cn } from "@/lib/utils";
import { sectorColor, type SGender, type SMetric } from "@/lib/sectors";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel } from "@/lib/i18n/labels";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import {
  waffles,
  ridgeline,
  sankeyFlow,
  outliers,
  type Waffle,
  type OutlierMetric,
} from "@/lib/lab";

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

/* ---------- 7) Army composition — who fills the army over time ---------- */
function hex(n: number) {
  return Math.round(n).toString(16).padStart(2, "0");
}
function lerpColor(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((c, i) => hex(c + (pb[i] - c) * t)).join("")}`;
}

/* ---------- 8) Ridgeline — the distribution shifting year by year ---------- */
const RG_W = 880;
const RG_H = 540;
const RG_PADX = 64;
const RG_TOP = 18;
const RG_BOT = 40;
function Ridgeline({
  data,
  t,
  axisLabel,
}: {
  data: ReturnType<typeof ridgeline>;
  t: Dictionary;
  axisLabel: string;
}) {
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
          {axisLabel}
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
      <div className="-mt-1 mb-4 flex flex-wrap items-center gap-2">
        <ChartLegend
          className="m-0"
          items={sectors.map((s) => ({
            label: sectorLabel(s, locale),
            color: sectorColor(s),
          }))}
        />
        <span className="inline-flex cursor-default items-center gap-2 text-sm text-muted-foreground">
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
      <ChartFootnote>{t.lab.sankeyNote}</ChartFootnote>
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
              {m.enlist}% → {m.value}%
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
  metric,
  t,
}: {
  data: ReturnType<typeof outliers>;
  metric: OutlierMetric;
  t: Dictionary;
}) {
  const { points, slope, intercept, xBounds, over, under } = data;
  if (!points.length) return null;
  const [xMin, xMax] = xBounds;
  const ys = points.map((p) => p.value);
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
                cy={py(p.value)}
                r={k ? 5 : 3}
                fill={color}
                fillOpacity={k ? 0.95 : 0.4}
                stroke={k ? "#0b1220" : "none"}
                strokeWidth={k ? 1 : 0}
              >
                <title>{`${p.council} — ${t.metrics.enlist.short} ${p.enlist}% · ${t.metrics[metric].short} ${p.value}% (${p.resid > 0 ? "+" : ""}${p.resid})`}</title>
              </circle>
            );
          })}
          {[...over, ...under].map((p) => (
            <text
              key={`l${p.council}`}
              x={px(p.enlist)}
              y={py(p.value) - 8}
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
            {t.metrics[metric].label}
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

function GenderScopedPanels({
  children,
  skeletonPanels,
}: {
  children: React.ReactNode;
  skeletonPanels: number;
}) {
  // One gender value for the scoped panels, surfaced through each card header
  // so filter placement stays consistent.
  const [gender, setGender] = React.useState<SGender>("בנים");
  const g = gender === "בנים" ? "m" : "f";

  // These views are pure client-side SVG (no chart lib); render after mount so
  // the SSR HTML and first client paint can't disagree (same gate as ChartContainer).
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <SectionSkeleton panels={skeletonPanels} />;

  return (
    <LabGenderCtx.Provider value={{ g, gender, setGender }}>
      <div className="space-y-8">{children}</div>
    </LabGenderCtx.Provider>
  );
}

function WafflePanel() {
  const t = useT();
  const locale = useLocale();
  return (
    <GenderPanel
      title={t.lab.waffleTitle}
      subtitle={t.lab.waffleSubtitle}
      surface="lab_waffle"
    >
      {(g) => (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {waffles(g).map((d) => (
            <WaffleCard key={d.sector} d={d} t={t} locale={locale} />
          ))}
        </div>
      )}
    </GenderPanel>
  );
}

function SankeyPanel() {
  const t = useT();
  const locale = useLocale();
  return (
    <GenderPanel
      title={t.lab.sankeyTitle}
      subtitle={t.lab.sankeySubtitle}
      surface="lab_sankey"
    >
      {(g) => <Sankey data={sankeyFlow(g)} t={t} locale={locale} />}
    </GenderPanel>
  );
}

function RidgelinePanel() {
  const t = useT();
  const [metric, setMetric] = React.useState<SMetric>("combat");
  return (
    <GenderPanel
      title={t.lab.ridgeTitle}
      subtitle={t.lab.ridgeSubtitle}
      surface="lab_ridge"
    >
      {(g) => (
        <div>
          <div className="mb-4 flex justify-end">
            <MetricTabsS
              value={metric}
              onChange={setMetric}
              surface="school_ridgeline"
            />
          </div>
          <Ridgeline
            data={ridgeline(g, metric)}
            t={t}
            axisLabel={t.metrics[metric].label}
          />
        </div>
      )}
    </GenderPanel>
  );
}

function OutliersPanel() {
  const t = useT();
  const [metric, setMetric] = React.useState<OutlierMetric>("combat");
  const metrics: OutlierMetric[] = ["combat", "officer"];
  return (
    <GenderPanel
      title={t.lab.outlierTitle}
      subtitle={t.lab.outlierSubtitle}
      surface="lab_outliers"
      note={t.lab.unweightedNote}
    >
      {(g) => (
        <div>
          <div className="mb-4 flex justify-end">
            <ControlGroup className="flex w-full sm:inline-flex sm:w-auto">
              {metrics.map((m) => (
                <SegmentButton
                  key={m}
                  type="button"
                  active={metric === m}
                  className="flex-1 px-2.5 sm:flex-none sm:px-3"
                  onClick={() => setMetric(m)}
                >
                  {t.metrics[m].short}
                </SegmentButton>
              ))}
            </ControlGroup>
          </div>
          <Outliers data={outliers(g, metric)} metric={metric} t={t} />
        </div>
      )}
    </GenderPanel>
  );
}

export function ServicePipelinePanels() {
  return (
    <GenderScopedPanels skeletonPanels={2}>
      <WafflePanel />
      <SankeyPanel />
    </GenderScopedPanels>
  );
}

export function SchoolRidgelinePanel() {
  return (
    <GenderScopedPanels skeletonPanels={1}>
      <RidgelinePanel />
    </GenderScopedPanels>
  );
}

export function CityOutliersPanel() {
  return (
    <GenderScopedPanels skeletonPanels={1}>
      <OutliersPanel />
    </GenderScopedPanels>
  );
}
