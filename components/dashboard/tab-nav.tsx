"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/control";
import { cn } from "@/lib/utils";

export type NavItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

/** Route-based section nav. Each section is its own URL (/[lang]/<id>), so the
 *  browser handles history, deep-links and per-route code-splitting; this only
 *  renders the bar and highlights the active segment from the pathname. */
export function TabNav({ lang, items }: { lang: string; items: NavItem[] }) {
  const pathname = usePathname();
  const current = pathname.split("/").filter(Boolean)[1] ?? items[0]?.id;
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const activeItem = items.find((t) => t.id === current) ?? items[0];

  const href = (id: string) => `/${lang}/${id}`;
  const onSelect = (item: NavItem) => {
    track("tab_view", { tab: item.label });
    setOpen(false);
  };

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onClick);
    return () => document.removeEventListener("pointerdown", onClick);
  }, [open]);

  return (
    <div className="sticky top-0 z-20 -mx-4 mb-6 bg-background/80 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
      {/* mobile: dropdown */}
      <div ref={menuRef} className="relative sm:hidden">
        <Button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          size="lg"
          className="w-full justify-between rounded-2xl"
        >
          <span className="flex items-center gap-2">
            {activeItem?.icon && <span aria-hidden>{activeItem.icon}</span>}
            {activeItem?.label}
          </span>
          <ChevronDown
            className={cn(
              "size-5 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </Button>
        {open && (
          <div
            role="listbox"
            className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-background shadow-xl shadow-black/40"
          >
            {items.map((t) => (
              <Link
                key={t.id}
                href={href(t.id)}
                role="option"
                aria-selected={current === t.id}
                onClick={() => onSelect(t)}
                className={cn(
                  "flex w-full items-center gap-2 px-4 py-3.5 text-right text-base font-medium transition-colors",
                  current === t.id
                    ? "bg-white/15 text-white"
                    : "text-muted-foreground hover:bg-white/5",
                )}
              >
                {t.icon && <span aria-hidden>{t.icon}</span>}
                {t.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* desktop: underline tabs */}
      <div className="hidden sm:block">
        <div
          role="tablist"
          className="flex items-stretch justify-between border-b border-white/10"
        >
          {items.map((t) => (
            <Link
              key={t.id}
              href={href(t.id)}
              role="tab"
              aria-selected={current === t.id}
              onClick={() => onSelect(t)}
              className={cn(
                "relative flex items-center gap-2 whitespace-nowrap pb-3 pt-1 text-base font-semibold transition-colors",
                "after:absolute after:-bottom-px after:left-1/2 after:h-0.5 after:-translate-x-1/2 after:rounded-full after:bg-white after:transition-all after:duration-200 after:content-['']",
                current === t.id
                  ? "text-white after:w-12 after:opacity-100"
                  : "text-muted-foreground after:w-0 after:opacity-0 hover:text-foreground",
              )}
            >
              {t.icon && (
                <span aria-hidden className="flex">
                  {t.icon}
                </span>
              )}
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
