"use client";

import { useState } from "react";
import { Badge } from "@/components/dashboard/ui/Badge";
import { Button } from "@/components/dashboard/ui/Button";
import { DataTable } from "@/components/dashboard/ui/DataTable";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { Segmented } from "@/components/dashboard/ui/Segmented";
import { StatCard } from "@/components/dashboard/ui/StatCard";
import { useDashboard } from "@/components/dashboard/shell/DashboardContext";
import { invoiceSummary, invoices, paymentLinks } from "@/lib/dashboard/mock-data";
import { shortDate, statusMeta } from "@/lib/dashboard/format";
import type { InvoiceStatus } from "@/lib/dashboard/types";

const filters: { value: "all" | InvoiceStatus; label: string }[] = [
  { value: "all", label: "All" }, { value: "pending", label: "Pending" }, { value: "overdue", label: "Overdue" }, { value: "paid", label: "Paid" },
];

export function Payments() {
  const { openModal } = useDashboard();
  const [tab, setTab] = useState<"invoices" | "links">("invoices");
  const [filter, setFilter] = useState<"all" | InvoiceStatus>("all");
  const rows = filter === "all" ? invoices : invoices.filter((i) => i.status === filter);
  return (
    <>
      <PageHeader title="Payments" sub="Bill customers with invoices and payment links. Paid in stablecoins, settled how you choose." actions={<Button onClick={() => openModal("invoice")}>Create invoice</Button>} />
      <div className="grid grid-cols-3 gap-4">{invoiceSummary.map((s) => <StatCard key={s.label} {...s} />)}</div>
      <div className="flex items-center justify-between">
        <Segmented label="Payment type" value={tab} onChange={setTab} options={[{ value: "invoices", label: "Invoices" }, { value: "links", label: "Payment links" }]} />
        {tab === "invoices" ? (
          <div className="flex gap-2" role="group" aria-label="Filter invoices">
            {filters.map((f) => (
              <button key={f.value} type="button" aria-pressed={filter === f.value} onClick={() => setFilter(f.value)}
                className={`h-8 rounded-full border px-3 text-[13px] font-medium transition-colors ${filter === f.value ? "border-night bg-night text-on-night" : "border-line bg-surface-200 text-ink-muted hover:text-ink"}`}>{f.label}</button>
            ))}
          </div>
        ) : null}
      </div>
      {tab === "invoices" ? (
        <DataTable
          rows={rows}
          rowKey={(r) => r.id}
          empty="No invoices match this filter."
          columns={[
            { key: "no", header: "Invoice", width: "0.9fr", render: (r) => <span className="font-mono text-[13px]">{r.number}</span> },
            { key: "c", header: "Customer", width: "1.8fr", render: (r) => <span className="flex flex-col"><span className="font-medium">{r.customer.name}</span><span className="text-xs text-ink-muted">{r.customer.email}</span></span> },
            { key: "a", header: "Amount", width: "1.2fr", align: "right", render: (r) => <span className="font-semibold">{r.amount} {r.asset}</span> },
            { key: "n", header: "Network", width: "1fr", render: (r) => <span className="text-ink-muted">{r.network}</span> },
            { key: "i", header: "Issued", width: "1fr", render: (r) => <span className="text-[13px] text-ink-muted">{shortDate(r.issuedAt)}</span> },
            { key: "d", header: "Due", width: "1fr", render: (r) => <span className="text-[13px] text-ink-muted">{shortDate(r.dueAt)}</span> },
            { key: "s", header: "Status", width: "1fr", render: (r) => <Badge tone={statusMeta.invoice[r.status][1]}>{statusMeta.invoice[r.status][0]}</Badge> },
            { key: "x", header: "", width: "110px", align: "right", render: (r) => <Button variant="ghost" size="sm" onClick={() => navigator.clipboard?.writeText(r.hostedUrl)}>Copy link</Button> },
          ]}
        />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {paymentLinks.map((l) => (
            <div key={l.id} className="card flex flex-col gap-3.5 p-5">
              <div className="flex items-center justify-between"><h3 className="text-[15px] font-semibold">{l.name}</h3><Badge tone={l.active ? "positive" : "neutral"}>{l.active ? "Active" : "Expired"}</Badge></div>
              <span className="rounded-lg bg-surface-300 px-2.5 py-2 font-mono text-xs text-ink-muted">{l.url}</span>
              <dl className="grid grid-cols-3 gap-2 text-xs">
                <div><dt className="text-ink-muted">Price</dt><dd className="text-sm font-semibold">{l.price ?? "Customer sets"}</dd></div>
                <div><dt className="text-ink-muted">Payments</dt><dd className="text-sm font-semibold">{l.payments}</dd></div>
                <div><dt className="text-ink-muted">Collected</dt><dd className="text-sm font-semibold">{l.collected}</dd></div>
              </dl>
              <div className="flex gap-2"><Button variant="secondary" size="sm">Copy link</Button><Button variant="ghost" size="sm">QR code</Button></div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
