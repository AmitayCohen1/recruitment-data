"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Panel, PanelHeader, ChipLegend } from "@/components/ui/panel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  SECTORS,
  SECTOR_COLOR,
  S_METRICS,
  trend,
  type SGender,
  type SMetric,
} from "@/lib/sectors";

const config = Object.fromEntries(
  SECTORS.map((s) => [s, { label: s, color: SECTOR_COLOR[s] }]),
) satisfies ChartConfig;

export function SectorTrend({
  metric,
  gender,
}: {
  metric: SMetric;
  gender: SGender;
}) {
  const data = trend(metric, gender);
  const label = S_METRICS.find((m) => m.key === metric)!.label;

  return (
    <Panel>
      <PanelHeader
        title="מ‑2018 ל‑2024"
        subtitle={`המגמה בכל מגזר לאורך התקופה · ${label} · ${gender}`}
      />
      <ChartContainer config={config} className="h-[300px] w-full">
        <LineChart data={data} margin={{ left: 4, right: 16, top: 12, bottom: 4 }}>
          <CartesianGrid vertical={false} strokeOpacity={0.35} />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            orientation="right"
            domain={[0, 100]}
            width={42}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `${v}%`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {SECTORS.map((s) => (
            <Line
              key={s}
              dataKey={s}
              stroke={SECTOR_COLOR[s]}
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 0, fill: SECTOR_COLOR[s] }}
              activeDot={{ r: 5 }}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ChartContainer>
      <ChipLegend
        items={SECTORS.map((s) => ({ label: s, color: SECTOR_COLOR[s] }))}
      />
    </Panel>
  );
}
