"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { R_SECTORS, REGION_COLOR, regionView } from "@/lib/regions";
import { NEUTRAL, type SGender, type SMetric } from "@/lib/sectors";
import { GenderToggle, MetricTabsS } from "./controls";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { regionLabel, sectorFilterLabel } from "@/lib/i18n/labels";

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
      <div className="mb-4 inline-flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
        {R_SECTORS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              if (sector !== s) track("sector_filter", { surface: "region", sector: s });
              setSector(s);
            }}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              sector === s
                ? "bg-white/10 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {sectorFilterLabel(s, locale)}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {t.common.noData}
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r, i) => {
            const color = REGION_COLOR[r.region] ?? NEUTRAL;
            return (
              <li key={r.region} className="flex items-center gap-3">
                <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <span
                  className="w-24 shrink-0 truncate text-sm sm:w-32"
                  style={{ color }}
                >
                  {regionLabel(r.region, locale)}
                </span>
                <div className="relative h-8 flex-1 overflow-hidden rounded-lg bg-white/[0.04]">
                  <div
                    className="absolute inset-y-0 right-0 rounded-lg"
                    style={{
                      width: `${(r.value / max) * 100}%`,
                      background: color,
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
