import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/** Year-over-year change badge: the change in percentage points vs the
 *  baseline year (2018). Green = rose, red = fell, muted = flat/unknown.
 *  `value` is already (current − baseline); pass null when either side is missing. */
export function Delta({
  value,
  title,
  className,
}: {
  value: number | null;
  title?: string;
  className?: string;
}) {
  if (value === null) {
    return (
      <span className={cn("text-[10px] text-muted-foreground/40", className)} title={title}>
        ·
      </span>
    );
  }
  const r = Math.round(value * 10) / 10;
  const pill =
    "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums leading-none";
  if (r === 0) {
    return (
      <span
        className={cn(pill, "bg-white/5 text-muted-foreground/60", className)}
        title={title}
      >
        0
      </span>
    );
  }
  const up = r > 0;
  return (
    <span
      className={cn(
        pill,
        up ? "bg-emerald-400/15 text-emerald-400" : "bg-rose-400/15 text-rose-400",
        className,
      )}
      title={title}
    >
      {up ? <ArrowUp className="size-2.5" /> : <ArrowDown className="size-2.5" />}
      {Math.abs(r).toFixed(1)}
    </span>
  );
}
