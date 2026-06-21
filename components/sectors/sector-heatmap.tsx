"use client";

import { Panel, PanelHeader } from "@/components/ui/panel";
import { matrix, SECTOR_COLOR, SLATEST } from "@/lib/sectors";

const COLS: { key: "enlist" | "combat" | "officer"; label: string }[] = [
  { key: "enlist", label: "🪖 גיוס" },
  { key: "combat", label: "⚔️ קרבי" },
  { key: "officer", label: "🎖️ קצונה" },
];

function heat(t: number) {
  // t in 0..1 — light sky wash to strong sky
  return `rgba(56, 189, 248, ${0.06 + 0.82 * t})`;
}

export function SectorHeatmap() {
  const rows = [...matrix("בנים"), ...matrix("בנות")];
  // normalize each column by its own max so colors are comparable within a metric
  const maxes = Object.fromEntries(
    COLS.map((c) => [
      c.key,
      Math.max(...rows.map((r) => (r[c.key] as number) ?? 0), 1),
    ]),
  ) as Record<string, number>;

  return (
    <Panel>
      <PanelHeader
        title="כל ההשוואות במבט אחד"
        subtitle={`מפת חום של כל המגזרים והמדדים, ${SLATEST}. ככל שהתא כהה/חזק יותר — הערך גבוה יותר (יחסית לעמודה).`}
      />
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1 text-sm">
          <thead>
            <tr className="text-muted-foreground">
              <th className="px-2 py-1 text-right font-medium">מגזר</th>
              {COLS.map((c) => (
                <th key={c.key} className="px-2 py-1 text-center font-medium">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.sector}-${r.gender}`}>
                <td className="whitespace-nowrap px-2 py-1.5 text-right">
                  <span style={{ color: SECTOR_COLOR[r.sector] }}>{r.sector}</span>
                  <span className="text-muted-foreground"> · {r.gender}</span>
                </td>
                {COLS.map((c) => {
                  const v = (r[c.key] as number) ?? null;
                  const t = v === null ? 0 : v / maxes[c.key];
                  return (
                    <td
                      key={c.key}
                      className="rounded-md px-2 py-1.5 text-center font-semibold tabular-nums"
                      style={{
                        background: heat(t),
                        color: t > 0.5 ? "white" : "var(--foreground)",
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
      </div>
      <p className="pt-3 text-xs text-muted-foreground">
        עוצמת הצבע מנורמלת לכל עמודה בנפרד (קצונה בטווח נמוך מגיוס, ולכן צבעיה כהים
        יחסית לערכים שלה).
      </p>
    </Panel>
  );
}
