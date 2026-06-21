"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Panel, PanelHeader, ChipLegend } from "@/components/ui/panel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { METRICS, SERIES, type MetricKey } from "@/lib/data";
import { MetricTabs } from "./metric-tabs";

const config = {
  m: { label: "בנים", color: SERIES.boys },
  f: { label: "בנות", color: SERIES.girls },
} satisfies ChartConfig;

export function TrendChart({
  data,
}: {
  data: Record<string, number | null>[];
}) {
  const [metric, setMetric] = React.useState<MetricKey>("enlist");
  const label = METRICS.find((m) => m.key === metric)!.short;

  return (
    <Panel>
      <PanelHeader
        title="מגמה לאורך השנים"
        subtitle={`ממוצע בתי הספר באחוז ${label}, ${data[0]?.year}–${data[data.length - 1]?.year}`}
      >
        <MetricTabs value={metric} onChange={setMetric} />
      </PanelHeader>
      <ChartContainer config={config} className="h-[300px] w-full">
        <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="fillBoys" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES.boys} stopOpacity={0.4} />
              <stop offset="100%" stopColor={SERIES.boys} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="fillGirls" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SERIES.girls} stopOpacity={0.4} />
              <stop offset="100%" stopColor={SERIES.girls} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeOpacity={0.5} />
          <XAxis dataKey="year" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={40}
            orientation="right"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Area
            dataKey={`${metric}_m`}
            name="m"
            type="monotone"
            stroke={SERIES.boys}
            strokeWidth={2.5}
            fill="url(#fillBoys)"
            connectNulls
          />
          <Area
            dataKey={`${metric}_f`}
            name="f"
            type="monotone"
            stroke={SERIES.girls}
            strokeWidth={2.5}
            fill="url(#fillGirls)"
            connectNulls
          />
        </AreaChart>
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
