"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useT } from "@/components/i18n/locale-provider";
import { Skeleton } from "@/components/ui/skeleton";

/** Three.js / WebGL is heavy and touches `window`, so the scenes load
 *  client-only (no SSR) and only once this tab is on screen. */
const ThreeScenes = dynamic(
  () => import("./three-scenes").then((m) => m.ThreeScenes),
  { ssr: false },
);

export function ThreeLab() {
  const t = useT();
  const [show, setShow] = React.useState(false);

  // Defer mounting the WebGL canvases until after first paint so switching
  // to this tab stays snappy; the rest of the dashboard never pays for them.
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

  return <ThreeScenes />;
}
