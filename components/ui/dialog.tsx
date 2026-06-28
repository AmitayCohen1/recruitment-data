"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/control";

/** True below the `sm` breakpoint. Drives the mobile-vs-desktop presentation. */
function useIsMobile() {
  const [mobile, setMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return mobile;
}

/** A modal surface with two presentations behind one API:
 *  - Phones: the genuine vaul Drawer — a bottom sheet with real drag physics,
 *    velocity flick-to-dismiss, a grab handle, and background scaling.
 *  - ≥sm: a centered, zooming card (hand-rolled to match shadcn's Dialog look,
 *    no Radix, consistent with the other hand-rolled surfaces).
 *  Closes on overlay click and Escape; locks body scroll while open. Controlled
 *  via `open` / `onClose`. */
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
  const isMobile = useIsMobile();

  // Desktop enter/exit animation: `render` keeps the node mounted through the
  // exit transition; `shown` toggles a frame after mount to drive the zoom.
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

  // Escape to close + lock background scroll (desktop card only — vaul handles
  // both itself on mobile).
  React.useEffect(() => {
    if (!open || isMobile) return;
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
  }, [open, isMobile, onClose]);

  if (typeof document === "undefined") return null;

  // ── Mobile: the real vaul Drawer ──────────────────────────────────────────
  if (isMobile) {
    return (
      <Drawer.Root
        open={open}
        onOpenChange={(o) => {
          if (!o) onClose();
        }}
        shouldScaleBackground
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <Drawer.Content
            // `className` is intentionally not forwarded here: callers pass a
            // desktop width cap (e.g. max-w-sm) that would pin this full-width
            // sheet to a narrow, left-aligned strip.
            className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl border-t border-white/10 bg-background px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 outline-none"
          >
            <Drawer.Handle className="mb-4 mt-1" />
            {title ? (
              <Drawer.Title className="text-lg font-semibold tracking-tight text-foreground">
                {title}
              </Drawer.Title>
            ) : (
              <Drawer.Title className="sr-only">Dialog</Drawer.Title>
            )}
            {description && (
              <Drawer.Description className="mt-1.5 text-sm text-muted-foreground">
                {description}
              </Drawer.Description>
            )}
            <div className={title || description ? "mt-5" : ""}>{children}</div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  // ── Desktop: centered, zooming card ───────────────────────────────────────
  if (!render) return null;

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
