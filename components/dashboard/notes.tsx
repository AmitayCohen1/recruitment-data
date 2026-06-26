"use client";

import { Panel, PanelHeader } from "@/components/ui/panel";
import { useT } from "@/components/i18n/locale-provider";

export function Notes() {
  const t = useT();
  return (
    <Panel className="mt-8">
      <PanelHeader
        title={t.notes.title}
        noExport
        subtitle={t.notes.subtitle}
      />
      <dl className="divide-y divide-white/5">
        {t.notes.items.map((n) => (
          <div
            key={n.label}
            className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:gap-4"
          >
            <dt className="shrink-0 font-semibold text-foreground sm:w-36">
              {n.label}
            </dt>
            <dd className="text-sm leading-6 text-muted-foreground">{n.text}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}
