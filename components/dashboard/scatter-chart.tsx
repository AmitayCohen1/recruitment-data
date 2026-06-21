"use client";

import {
  CartesianGrid,
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

export function ScatterPlot({
  points,
  year,
}: {
  points: { m: Pt[]; f: Pt[] };
  year: number;
}) {
  return (
    <Panel>
      <PanelHeader
        title="גיוס מול לחימה"
        subtitle={`כל נקודה היא בית ספר — אחוז גיוס מול אחוז לחימה, שנת ${year}. גיוס גבוה לא בהכרח מנבא לחימה גבוהה.`}
      />
      <ChartContainer config={{}} className="h-[340px] w-full">
        <ScatterChart margin={{ left: 8, right: 8, top: 8, bottom: 16 }}>
          <CartesianGrid strokeOpacity={0.5} />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            tickFormatter={(v) => `${v}%`}
            label={{ value: "אחוז גיוס", position: "bottom", offset: 0, fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 100]}
            orientation="right"
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={(v) => `${v}%`}
            label={{ value: "אחוז לחימה", angle: -90, position: "left", fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <ZAxis range={[26, 26]} />
          <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<Dot />} />
          <Scatter data={points.m} fill={SERIES.boys} fillOpacity={0.45} />
          <Scatter data={points.f} fill={SERIES.girls} fillOpacity={0.45} />
        </ScatterChart>
      </ChartContainer>
      <ChipLegend
        items={[
          { label: "בנים", color: SERIES.boys },
          { label: "בנות", color: SERIES.girls },
        ]}
      />
    </Panel>
  );
}
