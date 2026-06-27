"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartHeader, ChartLegend, ChartPanel } from "@/components/ui/panel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  SECTORS,
  SECTOR_COLOR,
  trend,
  type SGender,
  type SMetric,
} from "@/lib/sectors";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { sectorLabel, genderLabel } from "@/lib/i18n/labels";

export function SectorTrend({
  metric,
  gender,
}: {
  metric: SMetric;
  gender: SGender;
}) {
  const t = useT();
  const locale = useLocale();
  const data = trend(metric, gender);
  const config = Object.fromEntries(
    SECTORS.map((s) => [s, { label: sectorLabel(s, locale), color: SECTOR_COLOR[s] }]),
  ) satisfies ChartConfig;

  return (
    <ChartPanel>
      <ChartHeader
        title={t.trend.title}
        subtitle={t.trend.subtitle}
        exportCaption={`${t.metrics[metric].short} · ${genderLabel(gender, locale)}`}
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
      <ChartLegend
        items={SECTORS.map((s) => ({ label: sectorLabel(s, locale), color: SECTOR_COLOR[s] }))}
      />
    </ChartPanel>
  );
}
