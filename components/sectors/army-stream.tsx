"use client";

import * as React from "react";
import { scaleLinear } from "d3-scale";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { GenderToggle } from "@/components/sectors/controls";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel } from "@/lib/i18n/labels";
import type { Gender } from "@/lib/data";
import type { SGender } from "@/lib/sectors";
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

/** Fighter composition as two stacked bars (first year vs latest) — the
 *  weighted head-count of combat soldiers per sector. With only two data
 *  years this reads far cleaner than a streamgraph. */
export function ArmyStream() {
  const t = useT();
  const locale = useLocale();
  const [gender, setGender] = React.useState<SGender>("בנים");
  const g: Gender = gender === "בנים" ? "m" : "f";

  const data = React.useMemo(() => armyComposition(g, "nFighters"), [g]);
  const { years, series } = data;

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
    <Panel>
      <PanelHeader
        title={t.armyStream.title(years[0], years[years.length - 1])}
        subtitle={t.armyStream.subtitle}
      />
      <div className="-mt-2 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {series.map((s) => (
            <span key={s.sector} className="flex items-center gap-2">
              <span
                className="size-3 rounded-full"
                style={{ background: s.color }}
              />
              {sectorLabel(s.sector, locale)}
            </span>
          ))}
        </div>
        <GenderToggle value={gender} onChange={setGender} />
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[640px]">
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
                    <title>
                      {sectorLabel(sg.sector, locale)} · {bar.year} —{" "}
                      {Math.round(sg.value).toLocaleString()}
                    </title>
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
      </div>
    </Panel>
  );
}
