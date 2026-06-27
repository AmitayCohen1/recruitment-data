"use client";

import * as React from "react";
import { Panel, PanelHeader, PanelInsight } from "@/components/ui/panel";
import { useLocale } from "@/components/i18n/locale-provider";
import { genderLabel } from "@/lib/i18n/labels";
import type { Gender } from "@/lib/data";
import type { SGender } from "@/lib/sectors";

/** Lab shares ONE gender filter (set in the tab's top FilterBar) across every
 *  panel, passed down through this context so each panel reads the same value
 *  instead of owning its own toggle. */
export const LabGenderCtx = React.createContext<{ g: Gender; gender: SGender }>({
  g: "m",
  gender: "בנים",
});

export function GenderPanel({
  title,
  subtitle,
  insight,
  note,
  children,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  insight?: React.ReactNode;
  /** accepted for call-site compatibility; analytics now live on the shared toggle */
  surface?: string;
  /** muted caption under the chart — e.g. a data-method disclosure */
  note?: React.ReactNode;
  children: (g: Gender, gender: SGender) => React.ReactNode;
}) {
  const { g, gender } = React.useContext(LabGenderCtx);
  const locale = useLocale();
  return (
    <Panel>
      <PanelHeader title={title} subtitle={subtitle} exportCaption={genderLabel(gender, locale)} />
      {children(g, gender)}
      {note && <p className="mt-3 text-xs text-muted-foreground/70">{note}</p>}
      {insight && <PanelInsight>{insight}</PanelInsight>}
    </Panel>
  );
}
