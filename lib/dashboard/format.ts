import type { BadgeTone } from "@/components/dashboard/ui/Badge";
import type { ActivityStatus, InvoiceStatus, PayoutStatus, SettlementStatus, Role } from "./types";

export function money(v: number, dp = 2) {
  return v.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

export function relativeTime(iso: string, now = new Date()) {
  const d = new Date(iso);
  const mins = Math.round((now.getTime() - d.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  if (hrs < 48) return "Yesterday";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** One place that maps every status to its label and badge tone, so screens never disagree. */
export const statusMeta = {
  activity: {
    settled: ["Settled", "positive"], completed: ["Completed", "positive"], confirming: ["Confirming", "warning"],
    in_transit: ["In transit", "info"], failed: ["Failed", "negative"],
  } as Record<ActivityStatus, [string, BadgeTone]>,
  invoice: {
    draft: ["Draft", "neutral"], pending: ["Pending", "warning"], overdue: ["Overdue", "negative"], paid: ["Paid", "positive"], void: ["Void", "neutral"],
  } as Record<InvoiceStatus, [string, BadgeTone]>,
  payout: {
    awaiting_approval: ["Awaiting approval", "warning"], processing: ["Processing", "info"], completed: ["Completed", "positive"],
    partly_failed: ["Partly failed", "negative"], failed: ["Failed", "negative"],
  } as Record<PayoutStatus, [string, BadgeTone]>,
  settlement: {
    in_transit: ["In transit", "info"], settled: ["Settled", "positive"], returned: ["Returned", "negative"],
  } as Record<SettlementStatus, [string, BadgeTone]>,
  role: {
    owner: ["Owner", "brand"], finance: ["Finance", "info"], approver: ["Approver", "warning"], developer: ["Developer", "neutral"],
  } as Record<Role, [string, BadgeTone]>,
};

export const roleCan: Record<Role, string> = {
  owner: "Everything, including team and limits",
  finance: "Create invoices and payouts, cannot approve own",
  approver: "Approve payouts and settlements",
  developer: "API keys and webhooks, no fund movement",
};
