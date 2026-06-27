"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useT } from "@/components/i18n/locale-provider";
import { Skeleton } from "@/components/ui/skeleton";

/** Three.js / WebGL is heavy and touches `window`, so the scene loads
 *  client-only (no SSR) and only after first paint, so the rest of the
 *  Overview tab stays snappy and never pays for WebGL up front. */
const SectorBarsScene = dynamic(
  () => import("@/components/lab/three-scenes").then((m) => m.SectorBarsScene),
  { ssr: false },
);

export function SectorBars3D() {
  const t = useT();
  const [show, setShow] = React.useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setShow(true), []);

  if (!show) {
    return (
      <div className="relative">
        <Skeleton className="h-[440px] w-full rounded-2xl" />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
          {t.three.loading}
        </span>
      </div>
    );
  }

  return <SectorBarsScene />;
}
