"use client";

import { Badge } from "@/components/dashboard/ui/Badge";
import { Button } from "@/components/dashboard/ui/Button";
import { DataTable } from "@/components/dashboard/ui/DataTable";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { StatCard } from "@/components/dashboard/ui/StatCard";
import { useDashboard } from "@/components/dashboard/shell/DashboardContext";
import { payoutBatches, payoutSummary } from "@/lib/dashboard/mock-data";
import { relativeTime, statusMeta } from "@/lib/dashboard/format";

export function Payouts() {
  const { openModal } = useDashboard();
  return (
    <>
      <PageHeader title="Payouts" sub="Pay one recipient or thousands. Payouts above $5,000 need a second approval." actions={<Button onClick={() => openModal("payout")}>New payout</Button>} />
      <div className="grid grid-cols-3 gap-4">{payoutSummary.map((s) => <StatCard key={s.label} {...s} />)}</div>
      <DataTable
        title="Payout batches"
        rows={payoutBatches}
        rowKey={(r) => r.id}
        columns={[
          { key: "b", header: "Batch", width: "2fr", render: (r) => <span className="flex flex-col"><span className="font-medium">{r.name}</span><span className="font-mono text-xs text-ink-muted">{r.id}</span></span> },
          { key: "r", header: "Recipients", width: "0.8fr", render: (r) => r.recipients },
          { key: "a", header: "Amount", width: "1.2fr", align: "right", render: (r) => <span className="font-semibold">{r.amount} {r.asset}</span> },
          { key: "n", header: "Network", width: "1fr", render: (r) => <span className="text-ink-muted">{r.network}</span> },
          { key: "s", header: "Status", width: "1.3fr", render: (r) => (
            <span className="flex flex-col gap-1.5">
              <Badge tone={statusMeta.payout[r.status][1]}>{statusMeta.payout[r.status][0]}</Badge>
              <span className="h-1 overflow-hidden rounded-full bg-surface-300" role="progressbar" aria-valuenow={Math.round(r.progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Batch progress"><span className="block h-1 bg-brand" style={{ width: `${r.progress * 100}%` }} /></span>
            </span>
          ) },
          { key: "c", header: "Created by", width: "1.2fr", render: (r) => <span className="text-ink-muted">{r.createdBy}</span> },
          { key: "d", header: "Date", width: "1fr", render: (r) => <span className="text-[13px] text-ink-muted" suppressHydrationWarning>{relativeTime(r.createdAt)}</span> },
        ]}
      />
    </>
  );
}
