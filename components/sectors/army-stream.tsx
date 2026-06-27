"use client";

import * as React from "react";
import {
  stack,
  stackOffsetWiggle,
  stackOrderInsideOut,
  area,
  curveBasis,
  type SeriesPoint,
} from "d3-shape";
import { scaleLinear } from "d3-scale";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { GenderToggle } from "@/components/sectors/controls";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel } from "@/lib/i18n/labels";
import type { Gender } from "@/lib/data";
import { NEUTRAL, type SGender } from "@/lib/sectors";
import { armyComposition } from "@/lib/lab";

const W = 880;
const H = 380;
const PADX = 44;
const PADY = 28;

/** Streamgraph of who fills the army over time: the (weighted) head-count of
 *  combat soldiers per sector each year, stacked with a wiggle offset so the
 *  whole flow reads as a single river that swells and narrows. */
export function ArmyStream() {
  const t = useT();
  const locale = useLocale();
  const [gender, setGender] = React.useState<SGender>("בנים");
  const g: Gender = gender === "בנים" ? "m" : "f";

  const data = React.useMemo(() => armyComposition(g, "nFighters"), [g]);
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
      .range([PADX, W - PADX]);
    const y = scaleLinear().domain([lo, hi]).range([H - PADY, PADY]);
    return { layers, x, y, colorOf };
  }, [series, years]);

  const areaGen = area<SeriesPoint<Record<string, number>>>()
    .x((_d, i) => x(i))
    .y0((d) => y(d[0]))
    .y1((d) => y(d[1]))
    .curve(curveBasis);

  return (
    <Panel>
      <PanelHeader
        title={t.armyStream.title}
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
          {layers.map((layer) => (
            <path
              key={layer.key}
              d={areaGen(layer) ?? undefined}
              fill={colorOf.get(layer.key) ?? NEUTRAL}
              fillOpacity={0.85}
            >
              <title>{sectorLabel(layer.key, locale)}</title>
            </path>
          ))}
          {years.map((yr, i) => (
            <text
              key={yr}
              x={x(i)}
              y={H - 8}
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
    </Panel>
  );
}
