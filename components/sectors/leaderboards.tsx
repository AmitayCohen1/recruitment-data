"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { topSchools, type Gender, type MetricKey } from "@/lib/data";
import { SCHOOL_SECTOR, SECTOR_COLOR, type SGender, type SMetric } from "@/lib/sectors";
import { GenderToggle, MetricTabsS } from "./controls";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel } from "@/lib/i18n/labels";

const toG = (g: SGender): Gender => (g === "בנים" ? "m" : "f");

function List({
  metric,
  gender,
  dir,
  title,
}: {
  metric: MetricKey;
  gender: Gender;
  dir: "top" | "bottom";
  title: string;
}) {
  const rows = topSchools(metric, gender, dir, 10);
  const t = useT();
  const locale = useLocale();
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-muted-foreground">{title}</p>
      <ul className="divide-y divide-white/5">
        {rows.map((r, i) => {
          const sec = SCHOOL_SECTOR[String(r.key)];
          const color = sec ? SECTOR_COLOR[sec] : "#64748b";
          return (
            <li key={`${r.key}-${r.school}`} className="flex items-center gap-2.5 py-2 sm:gap-3">
              <span className="w-4 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: color }}
                title={sec ? sectorLabel(sec, locale) : t.leaderboards.unclassified}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-foreground">{r.school}</div>
                {r.council && (
                  <div className="truncate text-xs text-muted-foreground">{r.council}</div>
                )}
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums">
                {r.value.toFixed(1)}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Leaderboards({
  metric: metricProp,
  gender: genderProp,
}: { metric?: SMetric; gender?: SGender } = {}) {
  const controlled = metricProp !== undefined && genderProp !== undefined;
  const [metricState, setMetric] = React.useState<SMetric>("combat");
  const [genderState, setGender] = React.useState<SGender>("בנים");
  const metric = metricProp ?? metricState;
  const gender = genderProp ?? genderState;
  const g = toG(gender);
  const t = useT();
  const locale = useLocale();

  return (
    <Panel>
      <PanelHeader
        title={t.leaderboards.title}
        subtitle={t.leaderboards.subtitle}
      >
        {!controlled && (
          <div className="flex flex-wrap gap-2">
            <GenderToggle value={gender} onChange={setGender} surface="leaderboards" />
            <MetricTabsS value={metric} onChange={setMetric} surface="leaderboards" />
          </div>
        )}
      </PanelHeader>
      <div className="grid gap-x-8 gap-y-6 divide-y divide-white/10 md:grid-cols-2 md:divide-y-0 [&>*+*]:pt-6 md:[&>*+*]:pt-0">
        <List metric={metric} gender={g} dir="top" title={t.leaderboards.topTitle} />
        <List metric={metric} gender={g} dir="bottom" title={t.leaderboards.bottomTitle} />
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span>{t.leaderboards.legend}</span>
        {Object.entries(SECTOR_COLOR).map(([s, c]) => (
          <span key={s} className="flex items-center gap-1">
            <span className="size-2 rounded-full" style={{ background: c }} />
            {sectorLabel(s, locale)}
          </span>
        ))}
      </div>
    </Panel>
  );
}
