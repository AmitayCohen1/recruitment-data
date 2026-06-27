"use client";

import * as React from "react";
import { Cell, Pie, PieChart } from "recharts";
import { ChartHeader, ChartPanel } from "@/components/ui/panel";
import { ChartContainer } from "@/components/ui/chart";
import {
  profile,
  SECTORS,
  SECTOR_COLOR,
  type SGender,
  type SMetric,
} from "@/lib/sectors";
import { GenderToggle, MetricTabsS } from "./controls";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { sectorLabel, genderLabel } from "@/lib/i18n/labels";

function Donut({
  value,
  color,
  sector,
}: {
  value: number | null;
  color: string;
  sector: string;
}) {
  const v = value ?? 0;
  const data = [
    { name: "v", value: v },
    { name: "rest", value: Math.max(0, 100 - v) },
  ];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24 sm:h-32 sm:w-32">
        <ChartContainer config={{}} className="aspect-square h-24 w-24 sm:h-32 sm:w-32">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="72%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill={color} />
              <Cell fill="rgba(255,255,255,0.06)" />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold tabular-nums sm:text-2xl">
            {value === null ? "—" : `${v}%`}
          </span>
        </div>
      </div>
      <span className="text-sm font-medium" style={{ color }}>
        {sector}
      </span>
    </div>
  );
}

export function SectorDonuts({
  metric: metricProp,
  gender: genderProp,
}: { metric?: SMetric; gender?: SGender } = {}) {
  // controlled when both props are supplied (shared section filter); else standalone
  const t = useT();
  const locale = useLocale();
  const controlled = metricProp !== undefined && genderProp !== undefined;
  const [metricState, setMetric] = React.useState<SMetric>("enlist");
  const [genderState, setGender] = React.useState<SGender>("בנים");
  const metric = metricProp ?? metricState;
  const gender = genderProp ?? genderState;

  return (
    <ChartPanel>
      <ChartHeader
        title={t.sectorDonuts.title}
        subtitle={t.sectorDonuts.subtitle}
        exportCaption={`${t.metrics[metric].short} · ${genderLabel(gender, locale)}`}
      >
        {!controlled && (
          <div className="flex flex-wrap gap-2">
            <GenderToggle value={gender} onChange={setGender} surface="donuts" />
            <MetricTabsS value={metric} onChange={setMetric} surface="donuts" />
          </div>
        )}
      </ChartHeader>
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
        {SECTORS.map((s) => (
          <Donut
            key={s}
            sector={sectorLabel(s, locale)}
            color={SECTOR_COLOR[s]}
            value={profile(s, gender)[metric]}
          />
        ))}
      </div>
    </ChartPanel>
  );
}
