"use client";

import * as React from "react";
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
import { GenderToggle, MetricTabsS } from "./controls";

const config = Object.fromEntries(
  SECTORS.map((s) => [s, { label: s, color: SECTOR_COLOR[s] }]),
) satisfies ChartConfig;

export function SectorTrend() {
  const [metric, setMetric] = React.useState<SMetric>("enlist");
  const [gender, setGender] = React.useState<SGender>("בנים");
  const data = trend(metric, gender);
  const label = S_METRICS.find((m) => m.key === metric)!.label;

  return (
    <Panel>
      <PanelHeader
        title="מגמה לאורך זמן"
        subtitle={`${label} · ${gender} · ${data[0]?.year}–${data[data.length - 1]?.year}`}
      >
        <div className="flex flex-wrap gap-2">
          <GenderToggle value={gender} onChange={setGender} />
          <MetricTabsS value={metric} onChange={setMetric} />
        </div>
      </PanelHeader>
      <ChartContainer config={config} className="h-[340px] w-full">
        <LineChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} strokeOpacity={0.4} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={40}
            orientation="right"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const year = payload[0]?.payload?.year;
                  return typeof year === "number" ? `שנת ${year}` : null;
                }}
                formatter={(value, name) => (
                  <>
                    <span className="text-muted-foreground">{name}</span>
                    <span className="font-mono font-medium tabular-nums text-foreground">
                      {value.toLocaleString("he")}%
                    </span>
                  </>
                )}
              />
            }
          />
          {SECTORS.map((s) => (
            <Line
              key={s}
              dataKey={s}
              name={s}
              type="monotone"
              stroke={SECTOR_COLOR[s]}
              strokeWidth={2.5}
              dot={false}
              connectNulls
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
