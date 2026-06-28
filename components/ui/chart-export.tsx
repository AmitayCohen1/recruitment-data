"use client";

import * as React from "react";
import { Download, Share2, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";
import { useLocale, useT } from "@/components/i18n/locale-provider";
import { Dialog } from "@/components/ui/dialog";
import { Button, IconButton } from "@/components/ui/control";

/** Upload a chart PNG to Vercel Blob (via our route handler) and return its
 *  public URL, or null if storage isn't configured / the upload failed. */
async function uploadShareImage(blob: Blob): Promise<string | null> {
  try {
    const res = await fetch("/api/share-image", {
      method: "POST",
      headers: { "content-type": "image/png" },
      body: blob,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { url?: unknown };
    return typeof data.url === "string" ? data.url : null;
  } catch {
    return null;
  }
}

/** Capture the given panel node to a PNG blob (excludes any [data-export-ignore]).
 *  html-to-image's first pass frequently misses async resources (web fonts,
 *  emoji, freshly-laid-out flex/% widths), which shows up as garbled or
 *  ballooned elements. Waiting for fonts and rendering twice — discarding the
 *  warm-up pass — yields a complete, stable frame. */
async function nodeToBlob(node: HTMLElement): Promise<Blob | null> {
  const { toBlob } = await import("html-to-image");
  const bg = getComputedStyle(document.body).backgroundColor || "#0a0a0b";

  // iOS Safari caps a canvas at ~16.7M px; at pixelRatio 2 a tall panel blows
  // past that and toBlob silently returns null. Cap the *output* area so the
  // capture always succeeds, only dropping below 2x when the node is huge.
  const { width, height } = node.getBoundingClientRect();
  const area = Math.max(1, width * height);
  const MAX_OUTPUT_AREA = 12_000_000;
  const pixelRatio = Math.max(
    1,
    Math.min(2, Math.sqrt(MAX_OUTPUT_AREA / area)),
  );

  // Reveal [data-export-only] captions (e.g. "which metric/gender") for the
  // duration of the capture — they're hidden on screen so they don't duplicate
  // the live toggle, but the exported image should carry that context.
  const exportOnly = Array.from(
    node.querySelectorAll<HTMLElement>("[data-export-only]"),
  );
  exportOnly.forEach((el) => {
    el.style.display = "block";
  });

  try {
    // make sure fonts/emoji are ready and layout has settled before capture
    if (document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch {
        /* fonts API unsupported — proceed */
      }
    }
    await new Promise((r) =>
      requestAnimationFrame(() => requestAnimationFrame(r)),
    );

    const opts = {
      pixelRatio,
      backgroundColor: bg,
      cacheBust: true,
      filter: (n: HTMLElement) =>
        !(n instanceof HTMLElement && n.dataset.exportIgnore !== undefined),
    };

    // warm-up pass primes embedded fonts/images; the second pass is the keeper
    await toBlob(node, opts);
    return await toBlob(node, opts);
  } finally {
    exportOnly.forEach((el) => el.style.removeProperty("display"));
  }
}

export function ChartExport({
  getNode,
  name,
}: {
  getNode: () => HTMLElement | null;
  name: string;
}) {
  const t = useT();
  const locale = useLocale();
  const shareText = t.chartExport.shareText;
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  // Capture begins the instant the menu opens and lands here. By the time the
  // user taps an action the PNG is ready, so navigator.share / window.open run
  // inside the tap's activation window — mobile rejects them otherwise.
  const captureRef = React.useRef<Promise<Blob | null> | null>(null);

  const filename = `${name}.png`.replace(/\s+/g, "-");

  function openMenu() {
    const node = getNode();
    captureRef.current = node ? nodeToBlob(node) : Promise.resolve(null);
    setOpen(true);
  }

  // Awaits the pre-capture (usually already resolved); falls back to a fresh
  // capture if the menu was somehow opened without one.
  function getBlob(): Promise<Blob | null> {
    if (captureRef.current) return captureRef.current;
    const node = getNode();
    return node ? nodeToBlob(node) : Promise.resolve(null);
  }

  async function download() {
    track("chart_share", { method: "download", chart: name });
    setBusy(true);
    try {
      const blob = await getBlob();
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
    setBusy(true);
    try {
      const blob = await getBlob();
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

  // Post to X with the chart shown as the link's card image. X's composer can't
  // accept an uploaded image, so instead we host the PNG and tweet a link to a
  // /share page whose twitter:image is that PNG — X unfurls it as the card.
  async function tweet() {
    track("chart_share", { method: "x", chart: name });
    const text = `${shareText} — ${name}`;

    // Open the tab synchronously (inside the tap) so mobile doesn't block it as
    // a popup; we redirect it to X once the upload — which is async — finishes.
    const win = window.open("", "_blank");
    setBusy(true);
    try {
      const blob = await getBlob();
      const uploaded = blob ? await uploadShareImage(blob) : null;

      let shareUrl = window.location.href;
      if (uploaded) {
        const u = new URL(`/${locale}/share`, window.location.origin);
        u.searchParams.set("img", uploaded);
        u.searchParams.set("t", name);
        shareUrl = u.toString();
      }

      const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text,
      )}&url=${encodeURIComponent(shareUrl)}`;

      if (win) win.location.href = intent;
      else window.location.href = intent; // popup blocked → use the current tab
      setOpen(false);
    } catch {
      win?.close();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div data-export-ignore>
      <IconButton
        type="button"
        onClick={openMenu}
        aria-label={t.chartExport.ariaLabel}
        size="sm"
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Share2 className="size-4" />
        )}
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t.chartExport.ariaLabel}
        className="max-w-sm"
      >
        <div className="flex flex-col gap-2 sm:gap-1">
          <Button
            type="button"
            variant="ghost"
            className="h-auto w-full justify-start gap-4 rounded-2xl px-4 py-5 text-start text-lg sm:gap-3 sm:rounded-xl sm:py-3 sm:text-base"
            onClick={download}
            disabled={busy}
          >
            <Download className="size-7 shrink-0 text-muted-foreground sm:size-5" />
            {t.chartExport.downloadPng}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-auto w-full justify-start gap-4 rounded-2xl px-4 py-5 text-start text-lg sm:gap-3 sm:rounded-xl sm:py-3 sm:text-base"
            onClick={share}
            disabled={busy}
          >
            <Share2 className="size-7 shrink-0 text-muted-foreground sm:size-5" />
            {t.chartExport.share}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-auto w-full justify-start gap-4 rounded-2xl px-4 py-5 text-start text-lg sm:gap-3 sm:rounded-xl sm:py-3 sm:text-base"
            onClick={tweet}
            disabled={busy}
          >
            <span className="w-7 shrink-0 text-center text-2xl text-muted-foreground sm:w-5 sm:text-lg">
              𝕏
            </span>
            {t.chartExport.shareX} {busy && "…"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
