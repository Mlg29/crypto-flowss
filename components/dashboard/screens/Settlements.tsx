"use client";

import { useState } from "react";
import { Badge } from "@/components/dashboard/ui/Badge";
import { Button } from "@/components/dashboard/ui/Button";
import { DataTable } from "@/components/dashboard/ui/DataTable";
import { Icon } from "@/components/dashboard/ui/Icon";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { Switch } from "@/components/dashboard/ui/Switch";
import { destinations, settlements, sweepRule } from "@/lib/dashboard/mock-data";
import { relativeTime, statusMeta } from "@/lib/dashboard/format";

export function Settlements() {
  const [sweep, setSweep] = useState(sweepRule.enabled); // TODO: PATCH /v1/sweep-rules/{id}
  return (
    <>
      <PageHeader title="Settlements" sub="Move funds out to your bank accounts and treasury wallets, on demand or on a schedule." actions={<Button>Settle now</Button>} />
      <div className="grid grid-cols-3 gap-4">
        {destinations.map((d, i) => (
          <div key={d.id} className="card flex flex-col gap-3 p-5">
            <div className="flex items-center gap-3">
              <span className={`grid size-9 place-items-center rounded-[10px] ${i === 0 ? "bg-night text-signal" : d.kind === "wallet" ? "bg-brand-tint text-brand" : "bg-surface-300 text-ink"}`}><Icon name={d.kind === "bank" ? "bank" : "wallet"} strokeWidth={1.9} /></span>
              <span className="flex flex-1 flex-col"><span className="text-sm font-semibold">{d.name}</span><span className="font-mono text-xs text-ink-muted">{d.detail}</span></span>
              {d.isDefault ? <Badge tone="brand">Default</Badge> : !d.verified ? <Badge tone="warning">Verifying</Badge> : null}
            </div>
            <p className="text-[13px] text-ink-muted">{d.note}</p>
          </div>
        ))}
      </div>
      <div className="card flex items-center gap-4 p-5">
        <span className="grid size-9 place-items-center rounded-[10px] bg-night text-signal"><Icon name="refresh" strokeWidth={1.9} /></span>
        <span className="flex flex-1 flex-col gap-0.5"><span className="text-sm font-semibold">Auto-sweep</span><span className="text-[13px] text-ink-muted">{sweepRule.description}</span></span>
        <Switch checked={sweep} onChange={setSweep} label="Auto-sweep" />
        <Button variant="secondary" size="sm">Edit rule</Button>
      </div>
      <DataTable
        title="Settlement history"
        rows={settlements}
        rowKey={(r) => r.id}
        columns={[
          { key: "r", header: "Reference", width: "1.2fr", render: (r) => <span className="font-mono text-[13px]">{r.id}</span> },
          { key: "d", header: "Destination", width: "1.6fr", render: (r) => r.destination },
          { key: "a", header: "Amount", width: "1.2fr", align: "right", render: (r) => <span className="font-semibold">{r.amount}</span> },
          { key: "s", header: "Status", width: "1fr", render: (r) => <Badge tone={statusMeta.settlement[r.status][1]}>{statusMeta.settlement[r.status][0]}</Badge> },
          { key: "b", header: "Bank reference", width: "1.4fr", render: (r) => <span className="font-mono text-xs text-ink-muted">{r.reference}</span> },
          { key: "w", header: "Date", width: "1fr", render: (r) => <span className="text-[13px] text-ink-muted" suppressHydrationWarning>{relativeTime(r.createdAt)}</span> },
        ]}
      />
    </>
  );
}
