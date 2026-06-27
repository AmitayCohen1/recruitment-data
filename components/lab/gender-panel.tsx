"use client";

import * as React from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { GenderToggle } from "@/components/sectors/controls";
import type { Gender } from "@/lib/data";
import type { SGender } from "@/lib/sectors";

export function GenderPanel({
  title,
  subtitle,
  surface,
  note,
  children,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  surface?: string;
  /** muted caption under the chart — e.g. a data-method disclosure */
  note?: React.ReactNode;
  children: (g: Gender, gender: SGender) => React.ReactNode;
}) {
  const [gender, setGender] = React.useState<SGender>("בנים");
  const g: Gender = gender === "בנים" ? "m" : "f";
  return (
    <Panel>
      <PanelHeader title={title} subtitle={subtitle}>
        <GenderToggle value={gender} onChange={setGender} surface={surface} />
      </PanelHeader>
      {children(g, gender)}
      {note && <p className="mt-3 text-xs text-muted-foreground/70">{note}</p>}
    </Panel>
  );
}
