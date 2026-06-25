"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** A small hand-rolled popover matching the dashboard surfaces (see chart-export).
 *  Closes on outside-pointer / Escape. `children` may be a render function that
 *  receives a `close` callback for items that should dismiss the popover. */
export function Popover({
  trigger,
  triggerClassName,
  ariaLabel,
  align = "end",
  panelClassName,
  children,
}: {
  trigger: React.ReactNode;
  triggerClassName?: string;
  ariaLabel?: string;
  align?: "start" | "end";
  panelClassName?: string;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <div
          role="dialog"
          className={cn(
            "absolute top-full z-30 mt-1.5 rounded-xl border border-white/10 bg-background p-3 shadow-xl shadow-black/40",
            // In RTL the trigger usually sits at the row's (visual) left end,
            // so anchor the panel there and let it open toward the content.
            align === "end" ? "left-0" : "right-0",
            panelClassName,
          )}
        >
          {typeof children === "function"
            ? children(() => setOpen(false))
            : children}
        </div>
      )}
    </div>
  );
}
