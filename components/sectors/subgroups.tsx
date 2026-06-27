"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { ControlGroup, SegmentButton } from "@/components/ui/control";
import { track } from "@/lib/analytics";
import {
  SECTORS,
  SECTOR_COLOR,
  subgroups,
  type SGender,
  type SMetric,
} from "@/lib/sectors";
import { GenderToggle, MetricTabsS } from "./controls";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel } from "@/lib/i18n/labels";

export function Subgroups({
  metric: metricProp,
  gender: genderProp,
}: { metric?: SMetric; gender?: SGender } = {}) {
  const controlled = metricProp !== undefined && genderProp !== undefined;
  const [metricState, setMetric] = React.useState<SMetric>("enlist");
  const [genderState, setGender] = React.useState<SGender>("בנים");
  const metric = metricProp ?? metricState;
  const gender = genderProp ?? genderState;
  const [sector, setSector] = React.useState<string>("חרדי");
  const t = useT();
  const locale = useLocale();
  const color = SECTOR_COLOR[sector];
  const rows = subgroups(sector, gender, metric);
  const max = Math.max(...rows.map((r) => (r[metric] as number) ?? 0), 1);

  return (
    <Panel>
      <PanelHeader
        title={t.subgroups.title}
        subtitle={t.subgroups.subtitle}
      >
        {!controlled && (
          <div className="flex flex-wrap gap-2">
            <GenderToggle value={gender} onChange={setGender} surface="subgroups" />
            <MetricTabsS value={metric} onChange={setMetric} surface="subgroups" />
          </div>
        )}
      </PanelHeader>

      <ControlGroup className="mb-4">
        {SECTORS.map((s) => (
          <SegmentButton
            key={s}
            type="button"
            active={sector === s}
            onClick={() => {
              if (sector !== s) track("sector_filter", { surface: "subgroups", sector: s });
              setSector(s);
            }}
            style={sector === s ? { background: `${SECTOR_COLOR[s]}22`, color: SECTOR_COLOR[s] } : undefined}
          >
            {sectorLabel(s, locale)}
          </SegmentButton>
        ))}
      </ControlGroup>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {t.subgroups.noData}
        </p>
      ) : (
        <ul className="space-y-2.5">
          {rows.map((r) => {
            const v = (r[metric] as number) ?? 0;
            const name = r.group.includes(" - ")
              ? r.group.split(" - ")[1]
              : r.group;
            return (
              <li key={r.group} className="flex items-center gap-3">
                <span className="w-24 shrink-0 truncate text-sm sm:w-32" title={`${r.group} · ${t.subgroups.schools(r.n)}`}>
                  {name}
                  <span className="block text-xs text-muted-foreground">
                    {t.subgroups.schools(r.n)}
                  </span>
                </span>
                <div className="relative h-7 flex-1 overflow-hidden rounded-lg bg-white/4">
                  <div
                    className="absolute inset-y-0 right-0 rounded-lg transition-all"
                    style={{ width: `${(v / max) * 100}%`, background: color }}
                  />
                </div>
                <span className="w-14 shrink-0 text-left text-sm font-semibold tabular-nums">
                  {v.toFixed(1)}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <p className="pt-4 text-xs text-muted-foreground">
        {t.subgroups.footnote}
      </p>
    </Panel>
  );
}
