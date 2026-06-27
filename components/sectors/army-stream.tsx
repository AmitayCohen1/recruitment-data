"use client";

import * as React from "react";
import { scaleLinear } from "d3-scale";
import { Cell, Pie, PieChart } from "recharts";
import {
  ChartBody,
  ChartFootnote,
  ChartHeader,
  ChartLegend,
  ChartPanel,
} from "@/components/ui/panel";
import { ChartContainer } from "@/components/ui/chart";
import { GenderToggle } from "@/components/sectors/controls";
import { ControlGroup, SegmentButton } from "@/components/ui/control";
import { track } from "@/lib/analytics";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel, genderLabel } from "@/lib/i18n/labels";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Gender } from "@/lib/data";
import { ABS_METRICS, type AbsMetric, type SGender } from "@/lib/sectors";
import { armyComposition } from "@/lib/lab";

const W = 880;
const H = 380;
const PADX = 60;
const PADTOP = 28;
const PADBOT = 34;

const fmt = (n: number) =>
  n >= 1000 ? `${Math.round(n / 100) / 10}k` : `${Math.round(n)}`;

/** light fills get dark labels; dark fills get white ones */
const LIGHT_FILLS = new Set(["#fbbf24", "#34d399", "#c084fc"]);

type Composition = ReturnType<typeof armyComposition>;
type View = "count" | "share" | "pie";

const VIEWS: View[] = ["count", "share", "pie"];

/** Two stacked bars (first year vs latest): the weighted head-count for the
 *  selected absolute metric. Bar height carries the absolute total. */
function CountView({
  data,
  t,
  locale,
  noun,
}: {
  data: Composition;
  t: Dictionary;
  locale: Locale;
  noun: string;
}) {
  const { years, series } = data;
  const numberLocale = locale === "he" ? "he-IL" : "en-US";
  const yAxisLabel = t.armyStream.axisLabel(noun);

  const { bars, ticks, y } = React.useMemo(() => {
    const totals = years.map((_, i) =>
      series.reduce((sum, s) => sum + s.counts[i], 0),
    );
    const max = Math.max(1, ...totals);
    const yScale = scaleLinear().domain([0, max]).range([H - PADBOT, PADTOP]);

    const n = years.length;
    const slot = (W - 2 * PADX) / n;
    const barW = Math.min(150, slot * 0.5);

    const bars = years.map((year, i) => {
      const cx = PADX + slot * (i + 0.5);
      let base = 0;
      const segments = series.map((s) => {
        const v = s.counts[i];
        const y0 = base;
        base += v;
        return {
          sector: s.sector,
          color: s.color,
          value: v,
          top: yScale(base),
          height: yScale(y0) - yScale(base),
        };
      });
      return { year, x: cx - barW / 2, barW, total: totals[i], segments };
    });

    const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => max * f);
    return { bars, ticks, y: yScale };
  }, [series, years]);

  return (
    <ChartBody scroll>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={t.armyStream.title}
        className="h-auto w-full min-w-[640px]"
      >
        {/* y gridlines + count labels */}
        {ticks.map((v, i) => (
          <g key={`t${i}`}>
            <line
              x1={PADX}
              x2={W - PADX}
              y1={y(v)}
              y2={y(v)}
              stroke="#ffffff"
              strokeOpacity={i === 0 ? 0.14 : 0.06}
            />
            <text
              x={PADX - 10}
              y={y(v) + 4}
              textAnchor="end"
              className="fill-white/40 text-[11px] tabular-nums"
            >
              {fmt(v)}
            </text>
          </g>
        ))}
        <line
          x1={PADX}
          x2={PADX}
          y1={PADTOP}
          y2={H - PADBOT}
          stroke="#ffffff"
          strokeOpacity={0.18}
        />
        <text
          x={18}
          y={(PADTOP + H - PADBOT) / 2}
          transform={`rotate(-90 18 ${(PADTOP + H - PADBOT) / 2})`}
          textAnchor="middle"
          className="fill-white/45 text-[11px] font-medium"
        >
          {yAxisLabel}
        </text>

        {bars.map((bar) => (
          <g key={bar.year}>
            {bar.segments.map((sg) => (
              <g key={sg.sector}>
                <rect
                  x={bar.x}
                  y={sg.top}
                  width={bar.barW}
                  height={Math.max(0, sg.height)}
                  fill={sg.color}
                  fillOpacity={0.9}
                >
                  <title>{`${sectorLabel(sg.sector, locale)} · ${bar.year} — ${Math.round(sg.value).toLocaleString(numberLocale)}`}</title>
                </rect>
                {sg.height >= 16 && (
                  <text
                    x={bar.x + bar.barW / 2}
                    y={sg.top + sg.height / 2 + 4}
                    textAnchor="middle"
                    paintOrder="stroke"
                    stroke={LIGHT_FILLS.has(sg.color) ? "none" : "#0b0f17"}
                    strokeWidth={2.5}
                    className={
                      LIGHT_FILLS.has(sg.color)
                        ? "fill-zinc-950 text-[12px] font-semibold tabular-nums"
                        : "fill-white text-[12px] font-semibold tabular-nums"
                    }
                  >
                    {fmt(sg.value)}
                  </text>
                )}
              </g>
            ))}
            {/* total above the bar */}
            <text
              x={bar.x + bar.barW / 2}
              y={y(bar.total) - 8}
              textAnchor="middle"
              className="fill-white text-[13px] font-bold tabular-nums"
            >
              {fmt(bar.total)}
            </text>
            {/* year under the bar */}
            <text
              x={bar.x + bar.barW / 2}
              y={H - 12}
              textAnchor="middle"
              className="fill-white/70 text-[13px] font-semibold tabular-nums"
            >
              {bar.year}
            </text>
          </g>
        ))}
      </svg>
    </ChartBody>
  );
}

const AC_W = 880;
const AC_H = 420;
const AC_PADX = 44;
const AC_TOP = 16;
const AC_BOT = 34;

/** Same numbers normalized to 100% and stacked across every year — each band's
 *  height is that sector's share of the selected count metric in that year. */
function ShareView({
  data,
  t,
  locale,
  noun,
}: {
  data: Composition;
  t: Dictionary;
  locale: Locale;
  noun: string;
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
      <ChartBody scroll>
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
              <title>{`${sectorLabel(b.sector, locale)} · ${years[n - 1]} — ${b.shares[n - 1]}% (${Math.round(b.counts[n - 1]).toLocaleString()})`}</title>
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
      </ChartBody>
      <ChartFootnote>{t.armyStream.shareNote(noun)}</ChartFootnote>
    </div>
  );
}

/** Latest-year composition as a pie chart for the same national share story. */
function PieShareView({
  data,
  t,
  locale,
  noun,
}: {
  data: Composition;
  t: Dictionary;
  locale: Locale;
  noun: string;
}) {
  const { years, series } = data;
  const lastIndex = years.length - 1;
  const year = years[lastIndex];
  const numberLocale = locale === "he" ? "he-IL" : "en-US";
  const slices = series
    .map((s) => ({
      sector: s.sector,
      color: s.color,
      count: s.counts[lastIndex],
      share: s.shares[lastIndex],
    }))
    .filter((s) => s.count > 0);

  return (
    <div>
      <div className="grid items-center gap-5 lg:grid-cols-[minmax(260px,360px)_1fr]">
        <div className="relative mx-auto h-64 w-full max-w-[340px]">
          <ChartContainer config={{}} className="aspect-square h-full w-full">
            <PieChart>
              <Pie
                data={slices}
                dataKey="count"
                nameKey="sector"
                cx="50%"
                cy="50%"
                innerRadius="48%"
                outerRadius="88%"
                paddingAngle={1}
                stroke="rgba(2,6,23,0.7)"
                strokeWidth={2}
                isAnimationActive={false}
              >
                {slices.map((s) => (
                  <Cell key={s.sector} fill={s.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold tabular-nums">100%</span>
            <span className="text-xs font-medium text-muted-foreground">
              {year} · {noun}
            </span>
          </div>
        </div>

        <ul className="space-y-2">
          {slices.map((s) => (
            <li
              key={s.sector}
              className="flex items-baseline justify-between gap-3 text-sm"
            >
              <span className="flex min-w-0 flex-1 items-center gap-2 font-medium">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="min-w-0 truncate" style={{ color: s.color }}>
                  {sectorLabel(s.sector, locale)}
                </span>
              </span>
              <span className="flex shrink-0 items-baseline gap-2 tabular-nums">
                <span className="font-bold">
                  {Math.round(s.count).toLocaleString(numberLocale)}
                </span>
                <span className="w-12 font-semibold text-muted-foreground">
                  {s.share}%
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <ChartFootnote>{t.armyStream.pieNote(noun, year)}</ChartFootnote>
    </div>
  );
}

/** Absolute composition by sector, with toggles for metric, gender, and
 *  count-vs-share view. */
export function ArmyStream() {
  const t = useT();
  const locale = useLocale();
  const [gender, setGender] = React.useState<SGender>("בנים");
  const [view, setView] = React.useState<View>("pie");
  const [metric, setMetric] = React.useState<AbsMetric>("nFighters");
  const g: Gender = gender === "בנים" ? "m" : "f";

  const data = React.useMemo(() => armyComposition(g, metric), [g, metric]);
  const { series } = data;
  const noun = t.absNoun[metric];

  return (
    <ChartPanel>
      <ChartHeader
        title={t.armyStream.title}
        subtitle={t.armyStream.subtitle}
        exportCaption={`${
          view === "count"
            ? t.armyStream.viewCount
            : view === "pie"
              ? t.armyStream.viewPie
              : t.armyStream.viewShare
        } · ${t.absMetrics[metric]} · ${genderLabel(gender, locale)}`}
      />
      <div className="-mt-2 mb-4 flex flex-wrap items-center justify-between gap-3">
        <ChartLegend
          className="m-0"
          items={series.map((s) => ({
            label: sectorLabel(s.sector, locale),
            color: s.color,
          }))}
        />
        <div className="flex flex-wrap items-center gap-2" data-export-ignore>
          <ControlGroup>
            {VIEWS.map((v) => (
              <SegmentButton
                key={v}
                type="button"
                active={view === v}
                onClick={() => {
                  if (view !== v) track("army_view", { view: v });
                  setView(v);
                }}
              >
                {v === "count"
                  ? t.armyStream.viewCount
                  : v === "pie"
                    ? t.armyStream.viewPie
                    : t.armyStream.viewShare}
              </SegmentButton>
            ))}
          </ControlGroup>
          <ControlGroup>
            {ABS_METRICS.map((m) => (
              <SegmentButton
                key={m.key}
                type="button"
                active={metric === m.key}
                onClick={() => {
                  if (metric !== m.key) track("army_metric", { metric: m.key });
                  setMetric(m.key);
                }}
              >
                {t.absMetrics[m.key]}
              </SegmentButton>
            ))}
          </ControlGroup>
          <GenderToggle value={gender} onChange={setGender} />
        </div>
      </div>
      {view === "count" ? (
        <CountView data={data} t={t} locale={locale} noun={noun} />
      ) : view === "pie" ? (
        <PieShareView data={data} t={t} locale={locale} noun={noun} />
      ) : (
        <ShareView data={data} t={t} locale={locale} noun={noun} />
      )}
    </ChartPanel>
  );
}
