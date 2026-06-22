"use client";

import * as React from "react";
import { Cell, Pie, PieChart } from "recharts";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { ChartContainer } from "@/components/ui/chart";
import {
  profile,
  SECTORS,
  SECTOR_COLOR,
  SLATEST,
  S_METRICS,
  type SGender,
  type SMetric,
} from "@/lib/sectors";
import { GenderToggle, MetricTabsS } from "./controls";

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
      <div className="relative h-28 w-28">
        <ChartContainer config={{}} className="aspect-square h-28 w-28">
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
          <span className="text-xl font-bold tabular-nums">
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

export function SectorDonuts() {
  const [metric, setMetric] = React.useState<SMetric>("enlist");
  const [gender, setGender] = React.useState<SGender>("בנים");
  const label = S_METRICS.find((m) => m.key === metric)!.label;

  return (
    <Panel>
      <PanelHeader
        title="מבט לפי מגזר"
        subtitle={`${label} · ${gender} · ${SLATEST}`}
      >
        <div className="flex flex-wrap gap-2">
          <GenderToggle value={gender} onChange={setGender} />
          <MetricTabsS value={metric} onChange={setMetric} />
        </div>
      </PanelHeader>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {SECTORS.map((s) => (
          <Donut
            key={s}
            sector={s}
            color={SECTOR_COLOR[s]}
            value={profile(s, gender)[metric]}
          />
        ))}
      </div>
    </Panel>
  );
}
