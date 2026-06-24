"use client";

import * as React from "react";
import {
  CartesianGrid,
  Cell,
  LabelList,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { ChartContainer } from "@/components/ui/chart";
import { sectorScatter, type SGender } from "@/lib/sectors";
import { GenderToggle } from "./controls";

type Pt = {
  sector: string;
  enlist: number;
  combat: number;
  fighters: number;
  color: string;
};

function ScatterTip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: Pt }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/10 bg-background/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
      <p className="mb-1 font-semibold" style={{ color: d.color }}>
        {d.sector}
      </p>
      <p className="text-muted-foreground">
        שיעור גיוס: <b className="text-foreground tabular-nums">{d.enlist}%</b>
      </p>
      <p className="text-muted-foreground">
        שיעור קרבי: <b className="text-foreground tabular-nums">{d.combat}%</b>
      </p>
      <p className="text-muted-foreground">
        לוחמים בפועל:{" "}
        <b className="text-foreground tabular-nums">
          {d.fighters.toLocaleString("he")}
        </b>
      </p>
    </div>
  );
}

export function CombatParadox({
  gender: genderProp,
}: { gender?: SGender } = {}) {
  const controlled = genderProp !== undefined;
  const [genderState, setGender] = React.useState<SGender>("בנים");
  const gender = genderProp ?? genderState;
  const data = sectorScatter(gender);

  return (
    <Panel>
      <PanelHeader
        title="גיוס מול שירות קרבי"
        subtitle="כל בועה היא מגזר — מיקום לפי שיעור גיוס (אופקי) ושיעור קרבי (אנכי), וגודל הבועה לפי מספר הלוחמים בפועל."
      >
        {!controlled && <GenderToggle value={gender} onChange={setGender} />}
      </PanelHeader>

      <ChartContainer config={{}} className="h-[360px] w-full">
        <ScatterChart margin={{ top: 16, right: 16, bottom: 24, left: 8 }}>
          <CartesianGrid strokeOpacity={0.15} />
          <XAxis
            type="number"
            dataKey="enlist"
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11 }}
            label={{
              value: "שיעור גיוס",
              position: "insideBottom",
              offset: -12,
              fontSize: 12,
              fill: "var(--color-muted-foreground)",
            }}
          />
          <YAxis
            type="number"
            dataKey="combat"
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11 }}
            width={40}
            label={{
              value: "שיעור קרבי",
              angle: -90,
              position: "insideLeft",
              fontSize: 12,
              fill: "var(--color-muted-foreground)",
            }}
          />
          <ZAxis type="number" dataKey="fighters" range={[120, 1400]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", strokeOpacity: 0.3 }}
            content={<ScatterTip />}
          />
          <Scatter data={data} fillOpacity={0.7}>
            {data.map((d) => (
              <Cell key={d.sector} fill={d.color} />
            ))}
            <LabelList
              dataKey="sector"
              position="top"
              style={{ fontSize: 11, fill: "var(--color-foreground)" }}
            />
          </Scatter>
        </ScatterChart>
      </ChartContainer>

      <p className="pt-2 text-xs leading-5 text-muted-foreground">
        מגזר יכול להציג שיעור קרבי גבוה אך לתרום מעט לוחמים בפועל (בועה קטנה),
        ולהפך — שיעור בינוני עם תרומה גדולה (בועה גדולה).
      </p>
    </Panel>
  );
}
