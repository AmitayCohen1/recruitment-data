"use client";

import * as React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { GenderToggle } from "@/components/sectors/controls";
import { cn } from "@/lib/utils";
import type { Gender } from "@/lib/data";
import { SECTOR_COLOR, type SGender } from "@/lib/sectors";
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
  LAB_FIRST,
  LAB_LAST,
  type Waffle,
  type SchoolDot,
  type CityPoint,
} from "@/lib/lab";
import { BIG_CITIES } from "@/lib/cities";

const BIG: readonly string[] = BIG_CITIES;

/** distinct color per featured city, matching their order */
const CITY_COLORS = [
  "#f472b6",
  "#38bdf8",
  "#34d399",
  "#fbbf24",
  "#c084fc",
  "#fb923c",
];
const cityColor = (name: string) =>
  CITY_COLORS[Math.max(0, BIG.indexOf(name)) % CITY_COLORS.length];

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
  const cells = Array.from({ length: 100 }, (_, i) => {
    if (i < d.officer) return WAFFLE_STAGE.officer;
    if (i < d.combat) return WAFFLE_STAGE.combat;
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

/* ---------- 2) Dot histogram: every school is a dot ---------- */
const W = 880;
const H = 320;
const PAD = 28;
const BASELINE = H - 24;
const R = 3.1;
const STEP = 2 * R + 0.6;
const SECTOR_ORDER = ["חילוני", "דתי לאומי", "חרדי", "דרוזי"];

function Beeswarm({ dots }: { dots: SchoolDot[] }) {
  // Bin by combat rate (x); stack schools UP within each bin so a column's
  // height = the NUMBER of schools at that rate. Vertical position = count.
  const placed = React.useMemo(() => {
    const order = (s: string | null) =>
      s ? SECTOR_ORDER.indexOf(s) + 1 || 99 : 100;
    const counts = new Map<number, number>();
    return [...dots]
      .sort((a, b) => a.value - b.value || order(a.sector) - order(b.sector))
      .map((d) => {
        const bin = Math.round(d.value);
        const x = PAD + (bin / 100) * (W - 2 * PAD);
        const slot = counts.get(bin) ?? 0;
        counts.set(bin, slot + 1);
        const y = BASELINE - (slot + 0.5) * STEP;
        return { ...d, x, y };
      });
  }, [dots]);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[640px]">
        {/* baseline + axis */}
        <line x1={PAD} x2={W - PAD} y1={BASELINE + 2} y2={BASELINE + 2} stroke="rgba(255,255,255,0.12)" />
        {[0, 25, 50, 75, 100].map((t) => {
          const x = PAD + (t / 100) * (W - 2 * PAD);
          return (
            <g key={t}>
              <line x1={x} x2={x} y1={BASELINE + 2} y2={BASELINE + 8} stroke="rgba(255,255,255,0.2)" />
              <text x={x} y={H - 4} fill="rgba(255,255,255,0.45)" fontSize="11" textAnchor="middle">
                {t}%
              </text>
            </g>
          );
        })}
        {placed.map((d) => (
          <circle
            key={`${d.key}-${d.value}`}
            cx={d.x}
            cy={Math.max(8, d.y)}
            r={R}
            fill={d.sector ? (SECTOR_COLOR[d.sector] ?? "#94a3b8") : "#64748b"}
            fillOpacity={0.85}
          >
            <title>
              {d.school}
              {d.council ? ` · ${d.council}` : ""} — {d.value}%
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
      <span
        className={cn(
          "inline-flex size-7 shrink-0 items-center justify-center rounded-full",
          up ? "bg-emerald-400/15 text-emerald-400" : "bg-rose-400/15 text-rose-400",
        )}
      >
        {up ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
        {m.council}
      </span>
      <span className="shrink-0 whitespace-nowrap text-xs text-muted-foreground tabular-nums sm:text-sm">
        {m.from}% <span className="opacity-50">→</span> {m.to}%
      </span>
      <span
        className={cn(
          "shrink-0 whitespace-nowrap text-sm font-bold tabular-nums",
          up ? "text-emerald-400" : "text-rose-400",
        )}
      >
        {m.delta > 0 ? "+" : ""}
        {m.delta} {t.lab.points}
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

export function Lab() {
  const t = useT();
  const locale = useLocale();
  const [gender, setGender] = React.useState<SGender>("בנים");
  const g: Gender = gender === "בנים" ? "m" : "f";

  // These views are pure client-side SVG (no chart lib); render after mount so
  // the SSR HTML and first client paint can't disagree (same gate as ChartContainer).
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  const w = React.useMemo(() => waffles(g), [g]);
  const dots = React.useMemo(() => schoolDots(g, "combat"), [g]);
  const scatter = React.useMemo(() => cityScatter(g), [g]);
  const bumpData = React.useMemo(() => bump(g, "combat"), [g]);
  const allMovers = React.useMemo(() => movers(g, "combat"), [g]);
  const risers = allMovers.slice(0, 6);
  const fallers = allMovers.slice(-6).reverse();

  if (!mounted) return <div className="min-h-[480px]" />;

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <GenderToggle value={gender} onChange={setGender} />
      </div>

      {/* 1 — waffle */}
      <Panel>
        <PanelHeader title={t.lab.waffleTitle} subtitle={t.lab.waffleSubtitle} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {w.map((d) => (
            <WaffleCard key={d.sector} d={d} t={t} locale={locale} />
          ))}
        </div>
      </Panel>

      {/* 2 — beeswarm */}
      <Panel>
        <PanelHeader title={t.lab.histTitle} subtitle={t.lab.histSubtitle} />
        <div className="-mt-2 mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {Object.entries(SECTOR_COLOR).map(([s, c]) => (
            <span key={s} className="flex items-center gap-2">
              <span className="size-3 rounded-full" style={{ background: c }} />
              {sectorLabel(s, locale)}
            </span>
          ))}
        </div>
        <Beeswarm dots={dots} />
      </Panel>

      {/* 3 — two-armies scatter */}
      <Panel>
        <PanelHeader
          title={t.lab.scatterTitle}
          subtitle={t.lab.scatterSubtitle}
        />
        <QuadrantScatter data={scatter} t={t} />
      </Panel>

      {/* 4 — bump chart */}
      <Panel>
        <PanelHeader
          title={t.lab.bumpTitle(LAB_FIRST, LAB_LAST)}
          subtitle={t.lab.bumpSubtitle}
        />
        <BumpChart data={bumpData} t={t} />
      </Panel>

      {/* 5 — movers */}
      <Panel>
        <PanelHeader
          title={t.lab.moversTitle(LAB_FIRST, LAB_LAST)}
          subtitle={t.lab.moversSubtitle}
        />
        <Movers risers={risers} fallers={fallers} t={t} />
      </Panel>
    </div>
  );
}
