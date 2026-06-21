"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

type Band = { band: string; m: number; f: number };

export function DistributionChart({
  data,
  year,
}: {
  data: Record<MetricKey, Band[]>;
  year: number;
}) {
  const [metric, setMetric] = React.useState<MetricKey>("enlist");
  const label = METRICS.find((m) => m.key === metric)!.short;
  const rows = data[metric];

  return (
    <Panel>
      <PanelHeader
        title="פיזור בתי הספר"
        subtitle={`כמה בתי ספר נופלים בכל טווח של אחוז ${label}, שנת ${year}`}
      >
        <MetricTabs value={metric} onChange={setMetric} />
      </PanelHeader>
      <ChartContainer config={config} className="h-[300px] w-full">
        <BarChart data={rows} margin={{ left: 4, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} strokeOpacity={0.5} />
          <XAxis dataKey="band" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={32}
            orientation="right"
            allowDecimals={false}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="m" name="m" stackId="a" fill={SERIES.boys} />
          <Bar
            dataKey="f"
            name="f"
            stackId="a"
            fill={SERIES.girls}
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
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
