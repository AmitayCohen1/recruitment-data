"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/control";

/** A hand-rolled modal dialog matching shadcn/ui's Dialog look — dimmed overlay,
 *  centered card, close button, fade/zoom transition. Built without Radix to keep
 *  the dep tree lean, consistent with the other hand-rolled surfaces (see popover
 *  and chart-export). Closes on overlay click and Escape; locks body scroll while
 *  open. Controlled via `open` / `onClose`. */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  // `render` keeps the node mounted through the exit transition; `shown` drives
  // the enter/exit animation (toggled a frame after mount).
  const [render, setRender] = React.useState(open);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRender(true);
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const id = setTimeout(() => setRender(false), 200);
    return () => clearTimeout(id);
  }, [open]);

  // Escape to close + lock background scroll while open.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!render || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* overlay */}
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={onClose}
        className={cn(
          "absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm transition-opacity duration-200",
          shown ? "opacity-100" : "opacity-0",
        )}
      />
      {/* content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-background p-6 shadow-2xl shadow-black/50 transition-all duration-200",
          shown ? "scale-100 opacity-100" : "scale-95 opacity-0",
          className,
        )}
      >
        <IconButton
          type="button"
          onClick={onClose}
          aria-label="Close"
          size="sm"
          className="absolute inset-e-4 top-4"
        >
          <X className="size-4" />
        </IconButton>
        {(title || description) && (
          <div className="mb-5 pe-8">
            {title && (
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1.5 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
