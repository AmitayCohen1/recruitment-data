"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export type Tab = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
};

export function DashboardTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = React.useState(tabs[0]?.id);
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const activeTab = tabs.find((t) => t.id === active);

  const selectTab = (id: string) => {
    setActive(id);
    const tab = tabs.find((t) => t.id === id);
    track("tab_view", { tab: tab?.label ?? id });
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
    <div>
      <div className="sticky top-0 z-20 -mx-4 mb-6 bg-background/80 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        {/* mobile: dropdown */}
        <div ref={menuRef} className="relative sm:hidden">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex h-12 w-full items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-base font-semibold"
          >
            <span className="flex items-center gap-2">
              {activeTab?.icon && <span aria-hidden>{activeTab.icon}</span>}
              {activeTab?.label}
            </span>
            <ChevronDown
              className={cn(
                "size-5 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
            />
          </button>
          {open && (
            <div
              role="listbox"
              className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-background shadow-xl shadow-black/40"
            >
              {tabs.map((t) => (
                <button
                  key={t.id}
                  role="option"
                  aria-selected={active === t.id}
                  onClick={() => {
                    selectTab(t.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-3.5 text-right text-base font-medium transition-colors",
                    active === t.id
                      ? "bg-white/15 text-white"
                      : "text-muted-foreground hover:bg-white/5",
                  )}
                >
                  {t.icon && <span aria-hidden>{t.icon}</span>}
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* desktop: underline tabs — SaaS style. The baseline rule spans the
            full content column so it lines up with the cards below. */}
        <div className="hidden sm:block">
          <div
            role="tablist"
            className="flex items-stretch justify-between border-b border-white/10"
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={active === t.id}
                aria-controls={`panel-${t.id}`}
                onClick={() => selectTab(t.id)}
                className={cn(
                  "relative flex items-center gap-2 whitespace-nowrap pb-3 pt-1 text-base font-semibold transition-colors",
                  // centered white underline indicator — grows from the middle on select
                  "after:absolute after:-bottom-px after:left-1/2 after:h-0.5 after:-translate-x-1/2 after:rounded-full after:bg-white after:transition-all after:duration-200 after:content-['']",
                  active === t.id
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
              </button>
            ))}
          </div>
        </div>
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={active !== t.id}
          className="space-y-6"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
