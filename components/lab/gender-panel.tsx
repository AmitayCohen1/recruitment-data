"use client";

import * as React from "react";
import {
  ChartFootnote,
  ChartHeader,
  ChartPanel,
} from "@/components/ui/panel";
import { GenderToggle } from "@/components/sectors/controls";
import { useLocale } from "@/components/i18n/locale-provider";
import { genderLabel } from "@/lib/i18n/labels";
import type { Gender } from "@/lib/data";
import type { SGender } from "@/lib/sectors";

/** Lab shares ONE gender value across every panel, but each card renders the
 *  control in its own header to match the dashboard's card-local filter rule. */
export const LabGenderCtx = React.createContext<{
  g: Gender;
  gender: SGender;
  setGender: (gender: SGender) => void;
}>({ g: "m", gender: "בנים", setGender: () => undefined });

export function GenderPanel({
  title,
  subtitle,
  note,
  surface,
  children,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  surface?: string;
  /** muted caption under the chart — e.g. a data-method disclosure */
  note?: React.ReactNode;
  children: (g: Gender, gender: SGender) => React.ReactNode;
}) {
  const { g, gender, setGender } = React.useContext(LabGenderCtx);
  const locale = useLocale();
  return (
    <ChartPanel>
      <ChartHeader
        title={title}
        subtitle={subtitle}
        exportCaption={genderLabel(gender, locale)}
      >
        <GenderToggle value={gender} onChange={setGender} surface={surface} />
      </ChartHeader>
      {children(g, gender)}
      {note && <ChartFootnote>{note}</ChartFootnote>}
    </ChartPanel>
  );
}
