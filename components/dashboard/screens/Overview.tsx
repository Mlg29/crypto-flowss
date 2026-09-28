"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/dashboard/ui/Badge";
import { Button, ButtonLink } from "@/components/dashboard/ui/Button";
import { DataTable } from "@/components/dashboard/ui/DataTable";
import { Icon, type IconName } from "@/components/dashboard/ui/Icon";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { Segmented } from "@/components/dashboard/ui/Segmented";
import { useDashboard } from "@/components/dashboard/shell/DashboardContext";
import { useSession } from "@/components/dashboard/shell/useSession";
import { activity, approvals, business, totalBalanceUsd, volume, volumeSeries, wallets, type Range } from "@/lib/dashboard/mock-data";
import { money, relativeTime, statusMeta } from "@/lib/dashboard/format";
import type { Activity } from "@/lib/dashboard/types";

const activityIcon: Record<Activity["kind"], IconName> = { invoice: "in", payment_link: "in", payout: "out", exchange: "swap", settlement: "bank" };

export function Overview() {
  const { openModal } = useDashboard();
  const { firstName } = useSession();
  const [range, setRange] = useState<Range>("30D");
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const series = volumeSeries(range);
  const usedPct = Math.round((business.usedTodayUsd / business.dailyPayoutLimitUsd) * 100);
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  const quick: { label: string; sub: string; icon: IconName; onClick?: () => void; href?: string }[] = [
    { label: "Create invoice", sub: "Bill a customer", icon: "file", onClick: () => openModal("invoice") },
    { label: "Send payout", sub: "Single or bulk", icon: "send", onClick: () => openModal("payout") },
    { label: "Convert", sub: "Locked-rate exchange", icon: "swap", href: "/dashboard/exchange" },
    { label: "Settle to bank", sub: "GTBank ••4821", icon: "bank", href: "/dashboard/settlements" },
  ];

  return (
    <>
      <PageHeader
        eyebrow={today}
        title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        actions={<Segmented label="Date range" value={range} onChange={setRange} options={(["7D", "30D", "90D"] as const).map((r) => ({ value: r, label: r }))} />}
      />

      <div className="flex items-center gap-4 rounded-2xl bg-brand-tint px-5 py-4">
        <span className="grid size-9 place-items-center rounded-[10px] bg-surface-200 text-brand"><Icon name="shield" strokeWidth={2} /></span>
        <span className="flex flex-1 flex-col gap-0.5">
          <span className="text-sm font-semibold">Business verified · Tier {business.tier}</span>
          <span className="text-[13px] text-ink-muted">Daily payout limit ${money(business.dailyPayoutLimitUsd, 0)}. Add source-of-funds documents to move to Tier 3 and raise your limits.</span>
        </span>
        <ButtonLink href="/dashboard/settings" variant="secondary" size="sm">Raise limits</ButtonLink>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col gap-2.5 rounded-2xl bg-night p-5 text-on-night">
          <span className="text-[13px] text-on-night-muted">Total balance</span>
          <span className="font-display text-[32px] font-semibold leading-9 tracking-[-0.02em]">${totalBalanceUsd}</span>
          <span className="flex items-center gap-2 text-xs text-on-night-muted"><span className="rounded-full bg-signal px-2 py-0.5 font-semibold text-on-signal">+12.4%</span>vs last month · {wallets.length + 1} wallets</span>
        </div>
        {wallets.map((w) => (
          <div key={w.id} className="card flex flex-col gap-2.5 p-5">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="grid size-[26px] place-items-center rounded-full bg-surface-300 text-[11px] font-bold">{w.asset === "cNGN" ? "₦" : w.asset[0]}</span>
              <span className="text-[13px] font-semibold">{w.asset}</span><span className="text-xs text-ink-muted">{w.network}</span>
            </span>
            <span className="font-display text-[26px] font-semibold leading-8 tracking-[-0.02em]">{w.balance}</span>
            <span className="text-xs text-ink-muted">≈ ${w.usdValue}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {quick.map((q) => {
          const inner = (
            <>
              <span className="grid size-9 place-items-center rounded-[10px] bg-night text-signal"><Icon name={q.icon} strokeWidth={1.9} /></span>
              <span className="flex flex-col text-left"><span className="text-sm font-semibold">{q.label}</span><span className="text-xs text-ink-muted">{q.sub}</span></span>
            </>
          );
          const cls = "card flex items-center gap-3 px-4 py-3.5 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]";
          return q.href ? <Link key={q.label} href={q.href} className={cls}>{inner}</Link> : <button key={q.label} type="button" onClick={q.onClick} className={cls}>{inner}</button>;
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <section className="card col-span-2 flex flex-col gap-4 p-5" aria-labelledby="vol-title">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <h2 id="vol-title" className="text-[15px] font-semibold">Collected vs paid out</h2>
              <span className="text-[13px] text-ink-muted">{{ "7D": "Last 7 days", "30D": "Last 30 days", "90D": "Last 90 days" }[range]}, in USD equivalent</span>
            </div>
            <div className="flex gap-4 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-[3px] bg-brand" />Collected {volume[range].collected}</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-[3px] bg-night" />Paid out {volume[range].paidOut}</span>
            </div>
          </div>
          {/* TODO: replace with your charting library of choice fed by GET /v1/reports/volume; keep these two colours. */}
          <div role="img" aria-label={`Bar chart. Collected ${volume[range].collected}, paid out ${volume[range].paidOut}.`} className="flex h-[200px] items-end gap-2.5 border-b border-line pb-1">
            {series.map(([a, b], i) => (
              <div key={i} className="flex h-full flex-1 items-end gap-[3px]">
                <span className="bar flex-1 rounded-t bg-brand" style={{ height: `${a}%` }} />
                <span className="bar flex-1 rounded-t bg-night" style={{ height: `${b}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between font-mono text-[11px] text-ink-muted">{volume[range].labels.map((l) => <span key={l}>{l}</span>)}</div>
        </section>

        <section className="card flex flex-col gap-3.5 p-5" aria-labelledby="appr-title">
          <div className="flex items-center justify-between"><h2 id="appr-title" className="text-[15px] font-semibold">Needs your approval</h2><Badge tone="warning">{approvals.filter((a) => !approved[a.id]).length} pending</Badge></div>
          {approvals.map((a) => (
            <div key={a.id} className="flex flex-col gap-2.5 rounded-xl border border-line bg-surface-100 p-3.5">
              <div className="flex justify-between gap-2 text-sm font-semibold"><span>{a.title}</span><span>{a.amount}</span></div>
              <span className="text-xs text-ink-muted">{a.meta}</span>
              <div className="flex gap-2">
                {/* TODO: POST /v1/approvals/{id}/approve, requires step-up 2FA */}
                <Button size="sm" disabled={approved[a.id]} onClick={() => setApproved((s) => ({ ...s, [a.id]: true }))}>{approved[a.id] ? "Approved" : "Approve"}</Button>
                <Button size="sm" variant="ghost">Review</Button>
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex justify-between text-xs"><span className="text-ink-muted">Payout limit used today</span><span className="font-semibold">${money(business.usedTodayUsd, 0)} of ${money(business.dailyPayoutLimitUsd, 0)}</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-300" role="progressbar" aria-valuenow={usedPct} aria-valuemin={0} aria-valuemax={100} aria-label="Payout limit used today"><div className="h-2 rounded-full bg-brand" style={{ width: `${usedPct}%` }} /></div>
          </div>
        </section>
      </div>

      <DataTable
        title="Recent activity"
        action={<Button variant="ghost" size="sm">View all</Button>}
        rows={activity}
        rowKey={(r) => r.id}
        columns={[
          { key: "i", header: "", width: "36px", render: (r) => (
            <span className={`grid size-8 place-items-center rounded-[10px] ${r.direction === "in" ? "bg-positive-tint text-positive" : "bg-surface-300 text-ink"}`}><Icon name={activityIcon[r.kind]} size={15} strokeWidth={2} /></span>
          ) },
          { key: "d", header: "Description", width: "2.2fr", render: (r) => <span className="font-medium">{r.description}</span> },
          { key: "c", header: "Counterparty", width: "1.4fr", render: (r) => <span className="text-ink-muted">{r.counterparty}</span> },
          { key: "a", header: "Amount", width: "1.2fr", align: "right", render: (r) => <span className={`font-semibold ${r.direction === "in" ? "text-positive" : ""}`}>{r.amount}</span> },
          { key: "n", header: "Network", width: "1fr", render: (r) => <span className="text-ink-muted">{r.network}</span> },
          { key: "s", header: "Status", width: "1fr", render: (r) => <Badge tone={statusMeta.activity[r.status][1]}>{statusMeta.activity[r.status][0]}</Badge> },
          { key: "t", header: "Date", width: "0.9fr", render: (r) => <span className="text-[13px] text-ink-muted" suppressHydrationWarning>{relativeTime(r.createdAt)}</span> },
        ]}
      />
    </>
  );
}
