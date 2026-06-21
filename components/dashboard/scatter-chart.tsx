"use client";

import {
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Panel, PanelHeader, ChipLegend } from "@/components/ui/panel";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { SERIES } from "@/lib/data";

type Pt = { x: number; y: number; school: string; council: string | null };

function Dot({ active, payload }: { active?: boolean; payload?: { payload: Pt }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/10 bg-popover/95 px-3 py-2 text-sm shadow-xl backdrop-blur">
      <div className="font-semibold text-foreground">{d.school}</div>
      {d.council && (
        <div className="text-xs text-muted-foreground">{d.council}</div>
      )}
      <div className="mt-1 flex gap-3 tabular-nums text-muted-foreground">
        <span>
          גיוס <span className="text-foreground">{d.x}%</span>
        </span>
        <span>
          לחימה <span className="text-foreground">{d.y}%</span>
        </span>
      </div>
    </div>
  );
}

function avg(arr: number[]) {
  return arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : 0;
}

export function ScatterPlot({
  points,
  year,
}: {
  points: { m: Pt[]; f: Pt[] };
  year: number;
}) {
  const all = [...points.m, ...points.f];
  const avgX = avg(all.map((p) => p.x)); // ממוצע גיוס
  const avgY = avg(all.map((p) => p.y)); // ממוצע לחימה

  return (
    <Panel>
      <PanelHeader
        title="גיוס מול לחימה"
        subtitle={`כל נקודה היא בית ספר, שנת ${year}. הקווים המקווקווים הם הממוצע הארצי — גיוס ${avgX}% ולחימה ${avgY}%. שימו לב: גיוס גבוה לא בהכרח מביא ללחימה גבוהה.`}
      />
      <ChartContainer config={{}} className="h-[460px] w-full">
        <ScatterChart margin={{ left: 8, right: 8, top: 16, bottom: 24 }}>
          <CartesianGrid strokeOpacity={0.35} />
          {/* "sweet spot": above-average on both axes */}
          <ReferenceArea
            x1={avgX}
            x2={100}
            y1={avgY}
            y2={100}
            fill={SERIES.high}
            fillOpacity={0.05}
            stroke="none"
          />
          <ReferenceLine
            x={avgX}
            stroke="white"
            strokeOpacity={0.3}
            strokeDasharray="4 4"
          />
          <ReferenceLine
            y={avgY}
            stroke="white"
            strokeOpacity={0.3}
            strokeDasharray="4 4"
          />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            tickFormatter={(v) => `${v}%`}
            label={{
              value: "אחוז גיוס (0% משמאל ← 100% מימין)",
              position: "bottom",
              offset: 4,
              fill: "var(--muted-foreground)",
              fontSize: 12,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 100]}
            orientation="right"
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v) => `${v}%`}
          />
          <ZAxis range={[16, 16]} />
          <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<Dot />} />
          <Scatter data={points.m} fill={SERIES.boys} fillOpacity={0.4} />
          <Scatter data={points.f} fill={SERIES.girls} fillOpacity={0.4} />
        </ScatterChart>
      </ChartContainer>
      {/* quadrant key */}
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
        <span>↗ ימין־למעלה: גיוס גבוה ולחימה גבוהה</span>
        <span>↘ ימין־למטה: גיוס גבוה, לחימה נמוכה</span>
        <span>↖ שמאל־למעלה: גיוס נמוך, לחימה גבוהה</span>
        <span>↙ שמאל־למטה: גיוס נמוך ולחימה נמוכה</span>
      </div>
      <ChipLegend
        items={[
          { label: "בנים", color: SERIES.boys },
          { label: "בנות", color: SERIES.girls },
        ]}
      />
    </Panel>
  );
}
