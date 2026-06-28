"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui/control";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type NavItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

/** Route-based section nav. Each section is its own URL (/[lang]/<id>), so the
 *  browser handles history, deep-links and per-route code-splitting; this only
 *  renders the bar and highlights the active segment from the pathname. */
export function TabNav({
  lang,
  items,
  hiddenItems = [],
}: {
  lang: string;
  items: NavItem[];
  hiddenItems?: NavItem[];
}) {
  const pathname = usePathname();
  const current = pathname.split("/").filter(Boolean)[1] ?? items[0]?.id;
  const activeItem =
    [...items, ...hiddenItems].find((t) => t.id === current) ?? items[0];

  const href = (id: string) => `/${lang}/${id}`;
  const onSelect = (item: NavItem) => {
    track("tab_view", { tab: item.label });
  };

  return (
    <div className="sticky top-0 z-20 -mx-4 mb-6 bg-background/80 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
      {/* mobile: dropdown menu */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="lg"
              className="group w-full justify-between rounded-2xl"
            >
              <span className="flex items-center gap-2">
                {activeItem?.icon && <span aria-hidden>{activeItem.icon}</span>}
                {activeItem?.label}
              </span>
              <ChevronDown className="size-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[var(--radix-dropdown-menu-trigger-width)]"
          >
            {items.map((t) => (
              <DropdownMenuItem
                key={t.id}
                asChild
                className={
                  current === t.id
                    ? "bg-white/15 text-white focus:bg-white/15"
                    : "text-muted-foreground"
                }
              >
                <Link
                  href={href(t.id)}
                  aria-current={current === t.id ? "page" : undefined}
                  onClick={() => onSelect(t)}
                >
                  {t.icon && <span aria-hidden>{t.icon}</span>}
                  {t.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
