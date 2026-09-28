import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "positive" | "negative" | "warning" | "info" | "brand";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-300 text-ink-muted",
  positive: "bg-positive-tint text-positive",
  negative: "bg-negative-tint text-negative",
  warning: "bg-warning-tint text-warning",
  info: "bg-info-tint text-info",
  brand: "bg-brand-tint text-ink",
};

/** A status or category label. The dot plus the word carry meaning; never rely on colour alone. */
export function Badge({ tone = "neutral", children, className = "" }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-medium leading-[18px] ${tones[tone]} ${className}`}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
