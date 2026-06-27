"use client";

import {
  ChartBody,
  ChartFootnote,
  ChartHeader,
  ChartPanel,
} from "@/components/ui/panel";
import { matrix, SECTOR_COLOR } from "@/lib/sectors";
import { useT, useLocale } from "@/components/i18n/locale-provider";
import { sectorLabel, genderLabel } from "@/lib/i18n/labels";

const COLS: { key: "enlist" | "combat" | "officer" }[] = [
  { key: "enlist" },
  { key: "combat" },
  { key: "officer" },
];

function heat(t: number) {
  // t in 0..1 — light sky wash to strong sky
  return `rgba(56, 189, 248, ${0.06 + 0.82 * t})`;
}

export function SectorHeatmap() {
  const t = useT();
  const locale = useLocale();
  const rows = [...matrix("בנים"), ...matrix("בנות")];
  // normalize each column by its own max so colors are comparable within a metric
  const maxes = Object.fromEntries(
    COLS.map((c) => [
      c.key,
      Math.max(...rows.map((r) => (r[c.key] as number) ?? 0), 1),
    ]),
  ) as Record<string, number>;

  return (
    <ChartPanel>
      <ChartHeader
        title={t.heatmap.title}
        subtitle={t.heatmap.subtitle}
      />
      <div className="grid gap-3 md:hidden">
        {rows.map((r) => (
          <div
            key={`${r.sector}-${r.gender}-card`}
            className="rounded-xl border border-white/10 bg-white/2 p-3"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-medium" style={{ color: SECTOR_COLOR[r.sector] }}>
                {sectorLabel(r.sector, locale)}
              </span>
              <span className="text-xs text-muted-foreground">{genderLabel(r.gender, locale)}</span>
            </div>
            <div className="grid gap-1.5">
              {COLS.map((c) => {
                const v = (r[c.key] as number) ?? null;
                const ht = v === null ? 0 : v / maxes[c.key];
                return (
                  <div
                    key={c.key}
                    className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-2 py-1.5"
                    style={{
                      background: heat(ht),
                      color: ht > 0.5 ? "white" : "var(--foreground)",
                    }}
                  >
                    <span className="text-xs font-medium">{t.metrics[c.key].long}</span>
                    <span className="text-sm font-semibold tabular-nums">
                      {v === null ? "—" : `${v}%`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <ChartBody scroll className="hidden md:block">
        <table className="w-full border-separate border-spacing-1 text-sm">
          <thead>
            <tr className="text-muted-foreground">
              <th className="px-2 py-1 text-right font-medium">{t.heatmap.sectorHeader}</th>
              {COLS.map((c) => (
                <th key={c.key} className="px-2 py-1 text-center font-medium">
                  {t.metrics[c.key].long}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.sector}-${r.gender}`}>
                <td className="whitespace-nowrap px-2 py-1.5 text-right">
                  <span style={{ color: SECTOR_COLOR[r.sector] }}>{sectorLabel(r.sector, locale)}</span>
                  <span className="text-muted-foreground"> · {genderLabel(r.gender, locale)}</span>
                </td>
                {COLS.map((c) => {
                  const v = (r[c.key] as number) ?? null;
                  const ht = v === null ? 0 : v / maxes[c.key];
                  return (
                    <td
                      key={c.key}
                      className="rounded-md px-2 py-1.5 text-center font-semibold tabular-nums"
                      style={{
                        background: heat(ht),
                        color: ht > 0.5 ? "white" : "var(--foreground)",
                      }}
                    >
                      {v === null ? "—" : `${v}%`}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </ChartBody>
      <ChartFootnote>{t.heatmap.footnote}</ChartFootnote>
    </ChartPanel>
  );
}
