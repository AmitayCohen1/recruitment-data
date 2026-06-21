"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

export function DashboardTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = React.useState(tabs[0]?.id);

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 mb-6 bg-background/70 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div
          role="tablist"
          className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              onClick={() => setActive(t.id)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                active === t.id
                  ? "bg-white/10 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          hidden={active !== t.id}
          className="space-y-6"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
