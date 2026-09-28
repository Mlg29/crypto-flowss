"use client";

import { Button } from "@/components/dashboard/ui/Button";
import { Icon } from "@/components/dashboard/ui/Icon";
import { useDashboard } from "./DashboardContext";

export function Topbar() {
  const { openModal } = useDashboard();
  return (
    <header className="flex h-[68px] shrink-0 items-center gap-4 border-b border-line bg-surface-200 px-7">
      <label className="flex h-10 max-w-[460px] flex-1 items-center gap-2 rounded-[10px] bg-surface-300 px-3 text-ink-muted">
        <Icon name="search" size={16} />
        <span className="sr-only">Search</span>
        <input placeholder="Search invoices, payouts, addresses, tx hash" className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted" />
        <kbd className="rounded-[5px] border border-line px-1.5 font-mono text-[11px]">⌘K</kbd>
      </label>
      <div className="flex-1" />
      <Button variant="ghost" aria-label="Help"><Icon name="help" /></Button>
      <Button variant="ghost" aria-label="Notifications, 3 unread" className="relative">
        <Icon name="bell" />
        <span className="absolute right-3 top-2 size-2 rounded-full border-2 border-surface-200 bg-negative" />
      </Button>
      <Button variant="secondary" onClick={() => openModal("payout")}>Send payout</Button>
      <Button onClick={() => openModal("invoice")}><Icon name="plus" size={16} strokeWidth={2.2} />Create invoice</Button>
    </header>
  );
}
