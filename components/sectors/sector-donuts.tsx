"use client";

import * as React from "react";
import Image from "next/image";
import { Panel, PanelHeader } from "@/components/ui/panel";
import {
  profile,
  SECTORS,
  SECTOR_COLOR,
  sectorImg,
  type SGender,
  type SMetric,
} from "@/lib/sectors";
import { GenderToggle, MetricTabsS } from "./controls";

function SectorCard({
  value,
  color,
  sector,
  img,
}: {
  value: number | null;
  color: string;
  sector: string;
  img: string;
}) {
  const v = value ?? 0;
  return (
    <div className="group relative aspect-[4/5] overflow-hidden rounded-xl">
      <Image
        src={img}
        alt={sector}
        fill
        sizes="(min-width: 640px) 25vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* readability scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
      {/* sector accent on top edge */}
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: color }}
      />
      {/* content */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <span className="block truncate text-xs font-medium text-white/80 sm:text-sm">
          {sector}
        </span>
        <span className="block text-xl font-bold leading-tight tabular-nums text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] sm:text-3xl">
          {value === null ? "—" : `${v}%`}
        </span>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${v}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}

function SectorRow({
  value,
  color,
  sector,
  img,
}: {
  value: number | null;
  color: string;
  sector: string;
  img: string;
}) {
  const v = value ?? 0;
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
        <Image src={img} alt={sector} fill sizes="56px" className="object-cover" />
        <div
          className="absolute inset-x-0 bottom-0 h-1"
          style={{ backgroundColor: color }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-sm font-medium text-white/90">
            {sector}
          </span>
          <span className="shrink-0 text-xl font-bold tabular-nums text-white">
            {value === null ? "—" : `${v}%`}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${v}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}

export function SectorDonuts({
  metric: metricProp,
  gender: genderProp,
}: { metric?: SMetric; gender?: SGender } = {}) {
  // controlled when both props are supplied (shared section filter); else standalone
  const controlled = metricProp !== undefined && genderProp !== undefined;
  const [metricState, setMetric] = React.useState<SMetric>("enlist");
  const [genderState, setGender] = React.useState<SGender>("בנים");
  const metric = metricProp ?? metricState;
  const gender = genderProp ?? genderState;

  return (
    <Panel>
      <PanelHeader
        title="מדד נבחר לפי מגזר"
        subtitle="השוואה מהירה של כל מגזר במדד שנבחר."
      >
        {!controlled && (
          <div className="flex flex-wrap gap-2">
            <GenderToggle value={gender} onChange={setGender} />
            <MetricTabsS value={metric} onChange={setMetric} />
          </div>
        )}
      </PanelHeader>
      {/* mobile: scannable list rows */}
      <div className="flex flex-col gap-4 sm:hidden">
        {SECTORS.map((s) => (
          <SectorRow
            key={s}
            sector={s}
            color={SECTOR_COLOR[s]}
            img={sectorImg(s, gender)}
            value={profile(s, gender)[metric]}
          />
        ))}
      </div>
      {/* sm+: portrait cards */}
      <div className="hidden gap-3 sm:grid sm:grid-cols-4">
        {SECTORS.map((s) => (
          <SectorCard
            key={s}
            sector={s}
            color={SECTOR_COLOR[s]}
            img={sectorImg(s, gender)}
            value={profile(s, gender)[metric]}
          />
        ))}
      </div>
    </Panel>
  );
}
