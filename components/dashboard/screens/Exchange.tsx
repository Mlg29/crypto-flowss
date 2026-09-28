"use client";

import { useState } from "react";
import { Badge } from "@/components/dashboard/ui/Badge";
import { Button } from "@/components/dashboard/ui/Button";
import { DataTable } from "@/components/dashboard/ui/DataTable";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { conversions, EXCHANGE_FEE, exchangeAvailable, exchangeUsd, indicativeRates } from "@/lib/dashboard/mock-data";
import { money } from "@/lib/dashboard/format";

const ccys = ["USDT", "USDC", "NGN", "cNGN"];
const selectCls = "h-[38px] w-[110px] rounded-full border border-line-strong bg-surface-200 px-3 text-sm font-semibold";

/**
 * TODO: replace the local maths with POST /v1/quotes (returns a quote id valid for 30s)
 * and POST /v1/exchanges { quoteId } on confirm. Show the countdown from the quote's expiresAt.
 */
export function Exchange() {
  const [from, setFrom] = useState("USDT");
  const [to, setTo] = useState("NGN");
  const [amount, setAmount] = useState("10,000");
  const [done, setDone] = useState(false);
  const n = parseFloat(amount.replace(/,/g, "")) || 0;
  const rate = exchangeUsd[from] / exchangeUsd[to];
  const out = from === to ? n : n * (1 - EXCHANGE_FEE) * rate;
  const pick = (side: "from" | "to", v: string) => {
    setDone(false);
    if (side === "from") { if (v === to) setTo(from); setFrom(v); } else { if (v === from) setFrom(to); setTo(v); }
  };
  return (
    <>
      <PageHeader title="Exchange" sub="Convert between stablecoins, crypto and naira at a firm, locked rate." />
      <div className="grid grid-cols-12 items-start gap-4">
        <section className="card col-span-5 flex flex-col gap-3.5 p-[22px]" aria-labelledby="convert-title">
          <div className="flex items-center justify-between"><h2 id="convert-title" className="text-[15px] font-semibold">Convert</h2><Badge tone="brand">Rate locked 30s</Badge></div>
          <div className="flex flex-col gap-1.5 rounded-[14px] bg-surface-300 p-4">
            <label htmlFor="ex-amount" className="text-[13px] text-ink-muted">You convert</label>
            <div className="flex items-center gap-2.5">
              <input id="ex-amount" inputMode="decimal" value={amount} onChange={(e) => { setAmount(e.target.value); setDone(false); }} className="min-w-0 flex-1 bg-transparent font-display text-[30px] font-semibold outline-none" />
              <select aria-label="Convert from" value={from} onChange={(e) => pick("from", e.target.value)} className={selectCls}>{ccys.map((c) => <option key={c}>{c}</option>)}</select>
            </div>
            <span className="text-xs text-ink-muted">Available: {exchangeAvailable[from]}</span>
          </div>
          <div className="flex flex-col gap-1.5 rounded-[14px] bg-brand-tint p-4">
            <span className="text-[13px] text-ink-muted">You receive</span>
            <div className="flex items-center gap-2.5">
              <output className="min-w-0 flex-1 truncate font-display text-[30px] font-semibold" aria-live="polite">{money(out)} {to}</output>
              <select aria-label="Convert to" value={to} onChange={(e) => pick("to", e.target.value)} className={selectCls}>{ccys.map((c) => <option key={c}>{c}</option>)}</select>
            </div>
          </div>
          <dl className="flex flex-col gap-2 text-[13px]">
            <div className="flex justify-between"><dt className="text-ink-muted">Rate</dt><dd className="font-medium">1 {from} = {rate < 1 ? rate.toLocaleString("en-US", { maximumSignificantDigits: 4 }) : money(rate)} {to}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">Fee ({(EXCHANGE_FEE * 100).toFixed(1)}%)</dt><dd className="font-medium">{money(n * EXCHANGE_FEE)} {from}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">Lands in</dt><dd className="font-medium">{to === "NGN" ? "GTBank ••4821, same day" : `${to} wallet`}</dd></div>
          </dl>
          <Button size="lg" onClick={() => setDone(true)} disabled={n <= 0}>{done ? "Converted. View receipt" : `Convert ${amount} ${from}`}</Button>
        </section>

        <div className="col-span-7 flex flex-col gap-4">
          <section className="card flex flex-col gap-3 p-5" aria-labelledby="rates-title">
            <h2 id="rates-title" className="text-[15px] font-semibold">Indicative rates</h2>
            <div className="grid grid-cols-3 gap-3">
              {indicativeRates.map((r) => (
                <div key={r.pair} className="flex flex-col gap-1 rounded-xl border border-line bg-surface-100 p-3.5">
                  <span className="text-xs text-ink-muted">{r.pair}</span><span className="text-lg font-semibold">{r.rate}</span>
                  <span className={`text-xs ${r.up ? "text-positive" : "text-negative"}`}>{r.change}</span>
                </div>
              ))}
            </div>
          </section>
          <DataTable
            title="Recent conversions"
            rows={conversions}
            rowKey={(r) => r.id}
            columns={[
              { key: "f", header: "From", width: "1.4fr", render: (r) => <span className="font-medium">{r.from}</span> },
              { key: "t", header: "To", width: "1.4fr", render: (r) => <span className="font-medium">{r.to}</span> },
              { key: "r", header: "Rate", width: "1.2fr", render: (r) => <span className="text-[13px] text-ink-muted">{r.rate}</span> },
              { key: "s", header: "Status", width: "1fr", render: () => <Badge tone="positive">Completed</Badge> },
              { key: "w", header: "Date", width: "1fr", render: (r) => <span className="text-[13px] text-ink-muted">{r.when}</span> },
            ]}
          />
        </div>
      </div>
    </>
  );
}
