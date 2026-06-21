"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type Tab = {
  id: string;
  label: string;
  icon?: string;
  content: React.ReactNode;
};

export function DashboardTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = React.useState(tabs[0]?.id);

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 mb-6 flex justify-center bg-background/80 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div
          role="tablist"
          className="no-scrollbar flex max-w-full gap-1.5 overflow-x-auto rounded-full border border-white/10 bg-white/[0.04] p-1.5"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={cn(
                "flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 text-base font-semibold transition-colors",
                active === t.id
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              {t.icon && (
                <span aria-hidden className="text-lg">
                  {t.icon}
                </span>
              )}
              {t.label}
            </button>
          ))}
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
