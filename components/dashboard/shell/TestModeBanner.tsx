"use client";

import { Icon } from "@/components/dashboard/ui/Icon";
import { useDashboard } from "./DashboardContext";

export function TestModeBanner() {
  const { mode } = useDashboard();
  if (mode !== "test") return null;
  return (
    <div role="status" className="flex h-9 shrink-0 items-center justify-center gap-2.5 border-b border-line bg-warning-tint text-[13px] font-medium text-warning">
      <Icon name="alert" size={15} strokeWidth={2} />
      Test mode. Transactions use testnets and move no real funds.
    </div>
  );
}
