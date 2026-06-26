"use client";

import * as React from "react";
import { Check, Download, Share2, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";
import { useT } from "@/components/i18n/locale-provider";
import { Dialog } from "@/components/ui/dialog";

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
  // when set, the X screenshot is on the clipboard and this is the composer URL
  const [xIntent, setXIntent] = React.useState<string | null>(null);

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

  // One large, touch-friendly row per action inside the modal.
  const item =
    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-start text-base font-medium text-foreground transition-colors hover:bg-white/5 disabled:opacity-50";

  return (
    <div data-export-ignore>
      <button
        type="button"
        onClick={() => {
          setXIntent(null);
          setOpen(true);
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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t.chartExport.ariaLabel}
        className="max-w-sm"
      >
        <div className="flex flex-col gap-1">
          <button type="button" className={item} onClick={download} disabled={busy}>
            <Download className="size-5 shrink-0 text-muted-foreground" />
            {t.chartExport.downloadPng}
          </button>
          <button type="button" className={item} onClick={share} disabled={busy}>
            <Share2 className="size-5 shrink-0 text-muted-foreground" />
            {t.chartExport.share}
          </button>
          <button type="button" className={item} onClick={tweet} disabled={busy}>
            <span className="w-5 shrink-0 text-center text-lg text-muted-foreground">
              𝕏
            </span>
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
              className="mt-2 flex items-start gap-2 rounded-xl bg-emerald-400/10 px-4 py-3 text-sm leading-5 text-emerald-200"
            >
              <Check className="mt-0.5 size-4 shrink-0" />
              <span>{t.chartExport.copied}</span>
            </a>
          )}
        </div>
      </Dialog>
    </div>
  );
}
