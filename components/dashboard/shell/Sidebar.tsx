"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/dashboard/ui/Icon";
import { Button } from "@/components/dashboard/ui/Button";
import { Modal } from "@/components/dashboard/modals/Modal";
import { useDashboard } from "./DashboardContext";
import { initialsOf, useSession } from "./useSession";

const nav: { href: string; label: string; icon: IconName; count?: number }[] = [
  { href: "/dashboard/overview", label: "Overview", icon: "home" },
  { href: "/dashboard/payments", label: "Payments", icon: "card", count: 3 },
  { href: "/dashboard/payouts", label: "Payouts", icon: "send", count: 2 },
  { href: "/dashboard/exchange", label: "Exchange", icon: "swap" },
  { href: "/dashboard/settlements", label: "Settlements", icon: "bank" },
  { href: "/dashboard/developers", label: "Developers", icon: "code" },
  { href: "/dashboard/settings", label: "Business and team", icon: "users" },
  { href: "/dashboard/roles", label: "Roles", icon: "key" },
  { href: "/dashboard/audit-log", label: "Audit log", icon: "list" },
];

export function Sidebar() {
  const path = usePathname();
  const { mode, setMode } = useDashboard();
  const { merchant, displayName, email, signOut } = useSession();
  const businessName = merchant?.business_name ?? "Loading…";
  const [confirmLogout, setConfirmLogout] = useState(false);
  return (
    <>
    <aside className="flex w-62 shrink-0 flex-col gap-5 bg-night px-3.5 py-5 text-on-night">
      <div className="flex items-center gap-2.5 px-2 py-1">
        <span aria-hidden="true" className="size-3 rounded-full bg-signal" />
        <span className="font-display text-xl font-semibold tracking-[-0.02em]">CryptoFlow</span>
      </div>

      <button type="button" aria-label="Switch business" className="flex items-center gap-2.5 rounded-xl border border-line-night bg-night-raised p-2.5 text-left">
        <span className="grid size-[34px] place-items-center rounded-[10px] bg-signal text-[13px] font-bold text-on-signal">{initialsOf(merchant?.business_name, "··")}</span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[13px] font-semibold">{businessName}</span>
          <span className="text-xs capitalize text-on-night-muted">{merchant?.status ?? "\u00a0"}</span>
        </span>
        <Icon name="chevrons" size={14} strokeWidth={2} />
      </button>

      <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {nav.map((n) => {
          const active = path === n.href || path.startsWith(n.href + "/");
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active ? "page" : undefined}
              className={`flex h-10 items-center gap-3 rounded-[10px] px-3 text-sm font-medium transition-colors ${
                active ? "bg-night-raised text-on-night shadow-[inset_0_0_0_1px_var(--line-night)]" : "text-on-night-muted hover:bg-night-raised hover:text-on-night"
              }`}
            >
              <span className={active ? "text-signal" : ""}><Icon name={n.icon} /></span>
              <span className="flex-1">{n.label}</span>
              {n.count ? <span className="grid h-5 min-w-5 place-items-center rounded-full bg-signal px-1.5 text-[11px] font-semibold text-on-signal">{n.count}</span> : null}
            </Link>
          );
        })}
        <div className="my-1 border-t border-line-night" />
        <button type="button" onClick={() => setConfirmLogout(true)} className="flex h-10 w-full items-center gap-3 rounded-[10px] px-3 text-sm font-medium text-on-night-muted transition-colors hover:bg-night-raised hover:text-on-night">
          <Icon name="logout" size={16} />
          Sign out
        </button>
      </nav>

      <div className="flex flex-col gap-2.5 rounded-xl border border-line-night p-3">
        <span className="text-xs text-on-night-muted">Environment</span>
        <div role="radiogroup" aria-label="Environment" className="flex rounded-[10px] bg-night-raised p-[3px]">
          {(["live", "test"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => setMode(m)}
              className={`h-[30px] flex-1 rounded-lg text-[13px] capitalize transition-colors ${mode === m ? "bg-signal font-semibold text-on-signal" : "font-medium text-on-night-muted hover:text-on-night"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <Link href="/dashboard/profile" className="flex min-w-0 items-center gap-2.5 rounded-[10px] px-2.5 py-2 hover:bg-night-raised">
        <span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-brand-tint text-xs font-bold text-ink">{initialsOf(displayName)}</span>
        <span className="flex min-w-0 flex-col"><span className="truncate text-[13px] font-semibold">{displayName || "Your profile"}</span><span className="truncate text-xs text-on-night-muted">{email}</span></span>
      </Link>
    </aside>

    {confirmLogout && (
      <Modal
        title="Sign out?"
        onClose={() => setConfirmLogout(false)}
        width={400}
        footer={
          <div className="flex justify-end gap-2.5">
            <Button variant="secondary" onClick={() => setConfirmLogout(false)}>Cancel</Button>
            <Button onClick={signOut}>Sign out</Button>
          </div>
        }
      >
        <p className="text-sm text-ink-muted">You will be returned to the login screen. Any unsaved changes will be lost.</p>
      </Modal>
    )}
    </>
  );
}
