"use client";

import { Download, FileSpreadsheet } from "lucide-react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { useT } from "@/components/i18n/locale-provider";

/** Download hrefs, paired by index with the localized titles/descriptions. */
const HREFS = [
  "/full-recruitment-data.xlsx",
  "/Recruitment-data-by-school.xlsx",
];

export function FullData() {
  const t = useT();
  const files = t.fullData.items.map((item, i) => ({ ...item, href: HREFS[i] }));
  return (
    <Panel>
      <PanelHeader
        title={t.fullData.title}
        noExport
        subtitle={t.fullData.subtitle}
      />

      <ul className="space-y-3">
        {files.map((f) => (
          <li key={f.href}>
            <a
              href={f.href}
              download
              className="block rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-emerald-400/30 hover:bg-emerald-400/[0.06]"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="size-6 shrink-0 text-emerald-300" />
                <p className="min-w-0 flex-1 font-semibold text-foreground">
                  {f.title}
                </p>
                <Download className="size-5 shrink-0 text-muted-foreground" />
              </div>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">
                {f.desc}
              </p>
            </a>
          </li>
        ))}
      </ul>

      <p className="pt-4 text-xs leading-5 text-muted-foreground">
        {t.fullData.footnote}
      </p>
    </Panel>
  );
}
