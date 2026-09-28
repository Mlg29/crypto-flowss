import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export function Loading({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 px-5 py-14 text-sm text-ink-muted">
      <span className="spin size-5 rounded-full border-2 border-brand border-t-transparent" />{label}
    </div>
  );
}

export function Empty({ icon = "list", title, children }: { icon?: IconName; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-surface-300 text-ink-muted"><Icon name={icon} /></span>
      <p className="text-sm font-semibold">{title}</p>
      {children ? <div className="max-w-[420px] text-[13px] text-ink-muted">{children}</div> : null}
    </div>
  );
}

export function ErrorState({ onRetry, message = "Could not load this. Check your connection and try again." }: { onRetry?: () => void; message?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-14 text-center text-sm text-ink-muted">
      <span className="grid size-11 place-items-center rounded-full bg-negative-tint text-negative"><Icon name="alert" /></span>
      <p>{message}</p>
      {onRetry ? <button type="button" onClick={onRetry} className="font-semibold text-brand hover:underline">Try again</button> : null}
    </div>
  );
}

/** Lower-case API statuses to a badge tone. */
export function statusTone(status: string): "positive" | "warning" | "negative" | "neutral" | "info" {
  const s = status.toLowerCase();
  if (["active", "approved", "verified", "success", "completed"].includes(s)) return "positive";
  if (["pending", "inactive", "invited", "in_review", "submitted"].includes(s)) return "warning";
  if (["suspended", "rejected", "failed", "blocked", "expired", "revoked"].includes(s)) return "negative";
  return "neutral";
}

export function humanize(s: string) {
  const t = s.replace(/[_.:-]+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function dateTime(iso?: string) {
  if (!iso) return "–";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "–" : d.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function dateOnly(iso?: string) {
  if (!iso) return "–";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "–" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
