"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { ControlGroup, SegmentButton } from "@/components/ui/control";
import { track } from "@/lib/analytics";
import { R_SECTORS, regionView } from "@/lib/regions";
import { type SGender, type SMetric } from "@/lib/sectors";
import { GenderToggle, MetricTabsS } from "./controls";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { regionLabel, sectorFilterLabel, genderLabel } from "@/lib/i18n/labels";

// Every bar encodes the same metric — length carries the value, so one accent
// keeps the ranking readable without rainbow noise. Order is shown by the rank number.
const ACCENT = "#38bdf8"; // sky

export function RegionView({
  metric: metricProp,
  gender: genderProp,
}: { metric?: SMetric; gender?: SGender } = {}) {
  const controlled = metricProp !== undefined && genderProp !== undefined;
  const [metricState, setMetric] = React.useState<SMetric>("enlist");
  const [genderState, setGender] = React.useState<SGender>("בנים");
  const metric = metricProp ?? metricState;
  const gender = genderProp ?? genderState;
  const [sector, setSector] = React.useState<string>("הכל");
  const t = useT();
  const locale = useLocale();

  const rows = regionView(sector, gender, metric);
  const max = Math.max(...rows.map((r) => r.value), 1);
  const label = t.metrics[metric].label;

  return (
    <Panel>
      <PanelHeader
        title={t.regionView.title}
        subtitle={t.regionView.subtitle(label)}
      >
        {!controlled && (
          <div className="flex flex-wrap gap-2">
            <GenderToggle value={gender} onChange={setGender} surface="region" />
            <MetricTabsS value={metric} onChange={setMetric} surface="region" />
          </div>
        )}
      </PanelHeader>

      {/* which sector's regions — this chart's own axis selector */}
      <ControlGroup className="mb-4">
        {R_SECTORS.map((s) => (
          <SegmentButton
            key={s}
            type="button"
            active={sector === s}
            onClick={() => {
              if (sector !== s) track("sector_filter", { surface: "region", sector: s });
              setSector(s);
            }}
          >
            {sectorFilterLabel(s, locale)}
          </SegmentButton>
        ))}
      </ControlGroup>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {t.common.noData}
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r, i) => {
            return (
              <li key={r.region} className="flex items-center gap-3">
                <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <span className="w-24 shrink-0 truncate text-sm text-foreground sm:w-32">
                  {regionLabel(r.region, locale)}
                </span>
                <div className="relative h-8 flex-1 overflow-hidden rounded-lg bg-white/4">
                  <div
                    className="absolute inset-y-0 right-0 rounded-lg"
                    style={{
                      width: `${(r.value / max) * 100}%`,
                      background: ACCENT,
                    }}
                  />
                </div>
                <span className="w-12 shrink-0 text-left text-base font-bold tabular-nums">
                  {r.value}%
                </span>
              </li>
            );
          })}
        </ul>
      )}
      <p className="pt-4 text-xs leading-5 text-muted-foreground">
        {t.regionView.footnote}
      </p>
    </Panel>
  );
}
