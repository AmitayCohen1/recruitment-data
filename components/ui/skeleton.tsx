import { cn } from "@/lib/utils";

/** Base shimmer block. Server-safe (no hooks) so it works in loading.tsx and
 *  inside client mount-gates alike. */
export function Skeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/[0.06]", className)}
      {...props}
    />
  );
}

/** A placeholder shaped like a chart Panel: title, subtitle, chart area. */
export function PanelSkeleton({
  chartClassName = "h-[260px]",
}: {
  chartClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
      <div className="mb-5 space-y-2">
        <Skeleton className="h-6 w-2/5" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className={cn("w-full rounded-xl", chartClassName)} />
    </div>
  );
}

/** Whole-section placeholder: optional heading + N panels. Used by loading.tsx
 *  (shown while a section's route/chunk streams in) and client mount-gates. */
export function SectionSkeleton({
  heading = false,
  panels = 2,
  firstTall = false,
}: {
  heading?: boolean;
  panels?: number;
  firstTall?: boolean;
}) {
  return (
    <div className="space-y-6">
      {heading && (
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
      )}
      {Array.from({ length: panels }).map((_, i) => (
        <PanelSkeleton
          key={i}
          chartClassName={firstTall && i === 0 ? "h-[440px]" : "h-[260px]"}
        />
      ))}
    </div>
  );
}
