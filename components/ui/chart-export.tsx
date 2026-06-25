"use client";

import * as React from "react";
import { Download, Share2, Loader2 } from "lucide-react";
import { track } from "@vercel/analytics";

const SHARE_TEXT = "נתוני גיוס לפי בתי ספר ומגזרים";

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
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
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
        await navigator.share({ files: [file], title: SHARE_TEXT });
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

  function tweet() {
    track("chart_share", { method: "x", chart: name });
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${SHARE_TEXT} — ${name}`);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "noopener",
    );
    setOpen(false);
  }

  const item =
    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-sm text-foreground transition-colors hover:bg-white/10 disabled:opacity-50";

  return (
    <div className="relative" ref={ref} data-export-ignore>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="שיתוף וייצוא"
        className="inline-flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-muted-foreground transition-colors hover:text-foreground"
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Share2 className="size-4" />
        )}
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1.5 min-w-44 rounded-xl border border-white/10 bg-background p-1 shadow-xl shadow-black/40">
          <button type="button" className={item} onClick={download} disabled={busy}>
            <Download className="size-4 text-muted-foreground" />
            הורדה כתמונה (PNG)
          </button>
          <button type="button" className={item} onClick={share} disabled={busy}>
            <Share2 className="size-4 text-muted-foreground" />
            שיתוף…
          </button>
          <button type="button" className={item} onClick={tweet}>
            <span className="w-4 text-center text-muted-foreground">𝕏</span>
            שיתוף ב‑X
          </button>
        </div>
      )}
    </div>
  );
}
