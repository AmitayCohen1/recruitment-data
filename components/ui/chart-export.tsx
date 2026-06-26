"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Check, Download, Share2, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";
import { useT } from "@/components/i18n/locale-provider";

/** Capture the given panel node to a PNG blob (excludes this control itself). */
async function nodeToBlob(node: HTMLElement): Promise<Blob | null> {
  const { toBlob } = await import("html-to-image");
  const bg =
    getComputedStyle(document.body).backgroundColor || "#0a0a0b";
  return toBlob(node, {
    pixelRatio: 2,
    backgroundColor: bg,
    cacheBust: true,
    filter: (n) =>
      !(n instanceof HTMLElement && n.dataset.exportIgnore !== undefined),
  });
}

export function ChartExport({
  getNode,
  name,
}: {
  getNode: () => HTMLElement | null;
  name: string;
}) {
  const t = useT();
  const shareText = t.chartExport.shareText;
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  // drives the mobile bottom-sheet slide-in (toggled a frame after `open`)
  const [sheetIn, setSheetIn] = React.useState(false);
  // when set, the X screenshot is on the clipboard and this is the composer URL
  const [xIntent, setXIntent] = React.useState<string | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  // the mobile sheet is portaled to <body>, outside `ref`, so track it
  // separately to keep its taps from counting as an outside-click dismiss
  const sheetRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target) || sheetRef.current?.contains(target))
        return;
      setOpen(false);
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

  // animate the mobile sheet in/out
  React.useEffect(() => {
    if (!open) {
      setSheetIn(false);
      return;
    }
    const id = requestAnimationFrame(() => setSheetIn(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  const filename = `${name}.png`.replace(/\s+/g, "-");

  async function download() {
    const node = getNode();
    if (!node) return;
    track("chart_share", { method: "download", chart: name });
    setBusy(true);
    try {
      const blob = await nodeToBlob(node);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  async function share() {
    const node = getNode();
    if (!node) return;
    setBusy(true);
    try {
      const blob = await nodeToBlob(node);
      if (!blob) return;
      const file = new File([blob], filename, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        track("chart_share", { method: "native", chart: name });
        await navigator.share({ files: [file], title: shareText });
      } else {
        // browser can't share files — fall back to a PNG download
        track("chart_share", { method: "share_fallback", chart: name });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      /* user cancelled / unsupported — ignore */
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  async function tweet() {
    track("chart_share", { method: "x", chart: name });
    const text = `${shareText} — ${name}`;
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text,
    )}&url=${encodeURIComponent(window.location.href)}`;
    const node = getNode();

    setBusy(true);
    try {
      const blob = node ? await nodeToBlob(node) : null;

      // Best path (mobile / native file sharing): attach the PNG to the share
      // sheet so the user can post it to X with the image included.
      if (blob) {
        const file = new File([blob], filename, { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], text, title: shareText });
          setOpen(false);
          return;
        }

        // Desktop: X's web intent can't carry an image, so copy the screenshot
        // to the clipboard and let the user paste it into the composer.
        if (typeof ClipboardItem !== "undefined") {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            setXIntent(intent); // reveals the "open X & paste" hint; keep menu open
            return;
          } catch {
            /* clipboard image unsupported — fall through to text-only */
          }
        }
      }

      // Last resort: text + link only (no image).
      window.open(intent, "_blank", "noopener");
      setOpen(false);
    } catch {
      /* user cancelled / unsupported — ignore */
    } finally {
      setBusy(false);
    }
  }

  const item =
    "flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-start text-base font-medium text-foreground transition-colors hover:bg-white/10 disabled:opacity-50";

  // shared action items — rendered into the desktop dropdown and the mobile sheet
  const actions = (
    <>
      <button type="button" className={item} onClick={download} disabled={busy}>
        <Download className="size-5 text-muted-foreground" />
        {t.chartExport.downloadPng}
      </button>
      <button type="button" className={item} onClick={share} disabled={busy}>
        <Share2 className="size-5 text-muted-foreground" />
        {t.chartExport.share}
      </button>
      <button type="button" className={item} onClick={tweet} disabled={busy}>
        <span className="w-5 text-center text-lg text-muted-foreground">𝕏</span>
        {t.chartExport.shareX} {busy && "…"}
      </button>
      {xIntent && (
        <a
          href={xIntent}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            setXIntent(null);
            setOpen(false);
          }}
          className="mt-1 flex items-start gap-2 rounded-lg bg-emerald-400/10 px-3 py-2 text-xs leading-5 text-emerald-200"
        >
          <Check className="mt-0.5 size-3.5 shrink-0" />
          <span>{t.chartExport.copied}</span>
        </a>
      )}
    </>
  );

  return (
    <div className="relative" ref={ref} data-export-ignore>
      <button
        type="button"
        onClick={() => {
          setXIntent(null);
          setOpen((o) => !o);
        }}
        aria-label={t.chartExport.ariaLabel}
        className="inline-flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-muted-foreground transition-colors hover:text-foreground"
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Share2 className="size-4" />
        )}
      </button>

      {/* Desktop: anchored dropdown */}
      {open && (
        <div className="absolute end-0 top-full z-30 mt-1.5 hidden min-w-60 rounded-2xl border border-white/10 bg-background p-2 shadow-xl shadow-black/40 sm:block">
          {actions}
        </div>
      )}

      {/* Mobile: bottom sheet portaled to <body> so a `fixed` position resolves
          against the viewport, not an ancestor's backdrop-filter/transform
          containing block (the panel's backdrop-blur would otherwise anchor it
          to the bottom of the component instead of the screen). */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="sm:hidden" data-export-ignore>
            <div
              onClick={() => setOpen(false)}
              className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-200 ${
                sheetIn ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              ref={sheetRef}
              role="dialog"
              aria-label={t.chartExport.ariaLabel}
              className={`fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-white/10 bg-background p-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-lg shadow-2xl shadow-black/50 transition-transform duration-200 ease-out ${
                sheetIn ? "translate-y-0" : "translate-y-full"
              }`}
            >
              <div className="mx-auto mb-3 mt-1.5 h-1.5 w-12 rounded-full bg-white/25" />
              {actions}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
