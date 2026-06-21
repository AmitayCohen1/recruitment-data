"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Panel, PanelHeader, ChipLegend } from "@/components/ui/panel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { SERIES } from "@/lib/data";

const config = {
  m: { label: "בנים", color: SERIES.boys },
  f: { label: "בנות", color: SERIES.girls },
} satisfies ChartConfig;

export function GenderBars({
  data,
  year,
}: {
  data: { metric: string; m: number | null; f: number | null }[];
  year: number;
}) {
  return (
    <Panel>
      <PanelHeader
        title="בנים מול בנות"
        subtitle={`ממוצע בתי הספר לפי מדד, שנת ${year}`}
      />
      <ChartContainer config={config} className="h-[300px] w-full">
        <BarChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
          <CartesianGrid vertical={false} strokeOpacity={0.5} />
          <XAxis dataKey="metric" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={40}
            orientation="right"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="m" name="m" fill={SERIES.boys} radius={[5, 5, 0, 0]} />
          <Bar dataKey="f" name="f" fill={SERIES.girls} radius={[5, 5, 0, 0]} />
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
