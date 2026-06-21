"use client";

import * as React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import {
  GENDER_LABEL,
  LATEST,
  METRICS,
  type Gender,
  type MetricKey,
} from "@/lib/data";
import { MetricTabs } from "./metric-tabs";

type Move = {
  school: string;
  gender: Gender;
  council: string | null;
  base: number;
  latest: number;
  delta: number;
};
type MoverSet = { baseYear: number; up: Move[]; down: Move[] };

function Row({ m, positive }: { m: Move; positive: boolean }) {
  return (
    <li className="flex items-center gap-3 py-2">
      <span
        className="flex h-7 w-14 shrink-0 items-center justify-center gap-0.5 rounded-md text-xs font-semibold tabular-nums"
        style={{
          backgroundColor: positive ? "#34d39922" : "#fb718522",
          color: positive ? "#34d399" : "#fb7185",
        }}
      >
        {positive ? "+" : ""}
        {m.delta}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm text-foreground">{m.school}</div>
        <div className="truncate text-xs text-muted-foreground">
          {m.council ? `${m.council} · ` : ""}
          {GENDER_LABEL[m.gender]}
        </div>
      </div>
      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
        {m.base}% ← {m.latest}%
      </span>
    </li>
  );
}

export function Movers({ data }: { data: Record<MetricKey, MoverSet> }) {
  const [metric, setMetric] = React.useState<MetricKey>("enlist");
  const set = data[metric];
  const label = METRICS.find((m) => m.key === metric)!.short;

  return (
    <Panel>
      <PanelHeader
        title="השינויים הגדולים ביותר"
        subtitle={`בתי ספר עם השינוי הגדול ביותר באחוז ${label} מאז ${set.baseYear} ועד ${LATEST}`}
      >
        <MetricTabs value={metric} onChange={setMetric} />
      </PanelHeader>
      <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <TrendingUp className="size-4" /> עלייה
          </div>
          <ul className="divide-y divide-white/5">
            {set.up.map((m) => (
              <Row key={`${m.school}-${m.gender}`} m={m} positive />
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-rose-400">
            <TrendingDown className="size-4" /> ירידה
          </div>
          <ul className="divide-y divide-white/5">
            {set.down.map((m) => (
              <Row key={`${m.school}-${m.gender}`} m={m} positive={false} />
            ))}
          </ul>
        </div>
      </div>
    </Panel>
  );
}
