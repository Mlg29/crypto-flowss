"use client";

import { useState } from "react";
import { Button } from "@/components/dashboard/ui/Button";
import { Icon } from "@/components/dashboard/ui/Icon";
import { Segmented } from "@/components/dashboard/ui/Segmented";
import { bulkValidation } from "@/lib/dashboard/mock-data";
import { Modal, Field, inputCls } from "./Modal";

/**
 * Single payout or bulk CSV upload.
 * TODO: single -> POST /v1/payouts after GET /v1/screening?address=...; bulk -> POST /v1/payout-batches (multipart CSV), then show validation.
 */
export function PayoutModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"single" | "bulk">("bulk");
  return (
    <Modal
      title="New payout"
      width={620}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between pt-1.5">
          <span className="text-xs text-ink-muted">Every recipient address is screened before funds move.</span>
          <div className="flex gap-2.5">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={onClose}>{tab === "bulk" ? `Submit ${bulkValidation.ready} for approval` : "Send payout"}</Button>
          </div>
        </div>
      }
    >
      <Segmented label="Payout type" value={tab} onChange={setTab} options={[{ value: "single", label: "Single payout" }, { value: "bulk", label: "Bulk upload" }]} />

      {tab === "single" ? (
        <div className="flex flex-col gap-3.5">
          <Field id="po-name" label="Recipient name"><input id="po-name" className={inputCls} placeholder="Business or person" /></Field>
          <Field id="po-address" label="Wallet address"><input id="po-address" className={`${inputCls} font-mono text-[13px]`} placeholder="Paste a Tron, Base or Ethereum address" /></Field>
          <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-3">
            <Field id="po-amount" label="Amount"><input id="po-amount" inputMode="decimal" className={inputCls} placeholder="0.00" /></Field>
            <Field id="po-asset" label="Asset"><select id="po-asset" className={inputCls}><option>USDT</option><option>USDC</option></select></Field>
            <Field id="po-network" label="Network"><select id="po-network" className={inputCls}><option>Tron</option><option>Base</option></select></Field>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-positive-tint px-3.5 py-3 text-[13px] font-medium text-positive">
            <Icon name="shield" size={16} strokeWidth={2} />Address screened. No sanctions or risk flags. Network fee: 1.00 USDT.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-3.5 rounded-[14px] border-[1.5px] border-dashed border-line-strong bg-surface-100 p-4">
            <span className="grid size-9 place-items-center rounded-[10px] bg-brand-tint text-brand"><Icon name="file" /></span>
            <span className="flex flex-1 flex-col"><span className="text-sm font-semibold">{bulkValidation.fileName}</span><span className="text-xs text-ink-muted">{bulkValidation.rows} rows · uploaded just now</span></span>
            <Button variant="ghost" size="sm">Replace file</Button>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="flex flex-col rounded-xl bg-positive-tint p-3 text-positive"><span className="text-xl font-bold">{bulkValidation.ready}</span><span className="text-xs font-medium">Ready to pay</span></div>
            <div className="flex flex-col rounded-xl bg-negative-tint p-3 text-negative"><span className="text-xl font-bold">{bulkValidation.issues.length}</span><span className="text-xs font-medium">Need attention</span></div>
            <div className="flex flex-col rounded-xl bg-surface-300 p-3"><span className="text-xl font-bold">9,480.00</span><span className="text-xs font-medium text-ink-muted">USDC total on Base</span></div>
          </div>
          <ul className="overflow-hidden rounded-xl border border-line">
            {bulkValidation.issues.map((x) => (
              <li key={x.row} className="grid grid-cols-[0.5fr_1.4fr_2.4fr] items-center gap-3 border-b border-line px-4 py-3 text-sm last:border-b-0">
                <span className="font-mono text-xs text-ink-muted">Row {x.row}</span><span className="font-medium">{x.name}</span><span className="text-[13px] text-negative">{x.issue}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2.5 rounded-xl bg-warning-tint px-3.5 py-3 text-[13px] font-medium text-warning">
            <Icon name="lock" size={16} strokeWidth={2} />Over $5,000: this batch needs one more approval (Ifeoma Eze) before it sends.
          </div>
        </div>
      )}
    </Modal>
  );
}
