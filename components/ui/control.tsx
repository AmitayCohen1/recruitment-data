import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-0";

export const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
    focusRing,
  ),
  {
    variants: {
      variant: {
        primary:
          "border border-white/15 bg-white/12 text-foreground shadow-sm hover:bg-white/18",
        secondary:
          "border border-white/10 bg-white/4 text-foreground hover:bg-white/8",
        ghost:
          "text-muted-foreground hover:bg-white/6 hover:text-foreground",
        link:
          "h-auto rounded-md p-0 text-muted-foreground underline-offset-2 hover:text-foreground hover:underline",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-9 px-4",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
);

export function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export const iconButtonVariants = cva(
  cn(
    "inline-flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/4",
    "text-muted-foreground transition-colors hover:bg-white/8 hover:text-foreground",
    "disabled:pointer-events-none disabled:opacity-50",
    focusRing,
  ),
  {
    variants: {
      size: {
        sm: "size-8",
        md: "size-9",
        lg: "size-10",
      },
      shape: {
        square: "rounded-xl",
        circle: "rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "square",
    },
  },
);

export function IconButton({
  className,
  size,
  shape,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof iconButtonVariants>) {
  return (
    <button
      className={cn(iconButtonVariants({ size, shape }), className)}
      {...props}
    />
  );
}

export function ControlGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-white/3 p-1",
        className,
      )}
      {...props}
    />
  );
}

export function SegmentButton({
  active,
  className,
  activeClassName,
  inactiveClassName,
  ...props
}: React.ComponentProps<"button"> & {
  active: boolean;
  activeClassName?: string;
  inactiveClassName?: string;
}) {
  return (
    <button
      className={cn(
        "min-w-0 rounded-lg px-3 py-1.5 text-center text-sm font-medium transition-colors",
        focusRing,
        active
          ? cn("bg-white/10 text-foreground shadow-sm", activeClassName)
          : cn("text-muted-foreground hover:text-foreground", inactiveClassName),
        className,
      )}
      aria-pressed={active}
      {...props}
    />
  );
}

const fieldClassName = cn(
  "h-9 rounded-xl border border-white/10 bg-white/3 px-3 text-sm text-foreground outline-none transition-colors",
  "placeholder:text-muted-foreground/70 hover:border-white/15 focus-visible:border-white/20",
  "disabled:cursor-not-allowed disabled:opacity-50",
  focusRing,
);

export function FilterInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return <input className={cn(fieldClassName, className)} {...props} />;
}

export function FilterSelect({
  className,
  ...props
}: React.ComponentProps<"select">) {
  return <select className={cn(fieldClassName, className)} {...props} />;
}

export function FilterChip({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full border border-white/10 bg-white/4",
        "py-0.5 ps-2.5 pe-1.5 text-xs font-medium text-foreground transition-colors hover:bg-white/10",
        focusRing,
        className,
      )}
      {...props}
    />
  );
}

export function MenuItem({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-start text-sm transition-colors hover:bg-white/10",
        focusRing,
        className,
      )}
      {...props}
    />
  );
}
