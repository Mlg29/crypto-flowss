"use client";

import { useState } from "react";
import { Button } from "@/components/dashboard/ui/Button";
import { Modal, Field, inputCls } from "./Modal";

/** TODO: submit to POST /v1/invoices (docs/dashboard/04-api-contract.md) and show the hosted link on success. */
export function InvoiceModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ customer: "", email: "", amount: "", asset: "USDT", network: "Tron", due: "", settle: "keep", memo: "" });
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.customer && /@/.test(form.email) && Number(form.amount.replace(/,/g, "")) > 0;
  return (
    <Modal
      title="Create invoice"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2.5 pt-1.5">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="secondary" onClick={onClose}>Save draft</Button>
          <Button onClick={onClose} disabled={!valid}>Send invoice</Button>
        </div>
      }
    >
      <Field id="inv-customer" label="Customer"><input id="inv-customer" className={inputCls} value={form.customer} onChange={set("customer")} placeholder="Company name" /></Field>
      <Field id="inv-email" label="Billing email"><input id="inv-email" type="email" className={inputCls} value={form.email} onChange={set("email")} placeholder="accounts@company.com" /></Field>
      <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-3">
        <Field id="inv-amount" label="Amount"><input id="inv-amount" inputMode="decimal" className={inputCls} value={form.amount} onChange={set("amount")} placeholder="0.00" /></Field>
        <Field id="inv-asset" label="Asset"><select id="inv-asset" className={inputCls} value={form.asset} onChange={set("asset")}><option>USDT</option><option>USDC</option></select></Field>
        <Field id="inv-network" label="Network"><select id="inv-network" className={inputCls} value={form.network} onChange={set("network")}><option>Tron</option><option>Base</option><option>Ethereum</option></select></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field id="inv-due" label="Due date"><input id="inv-due" type="date" className={inputCls} value={form.due} onChange={set("due")} /></Field>
        <Field id="inv-settle" label="On payment">
          <select id="inv-settle" className={inputCls} value={form.settle} onChange={set("settle")}>
            <option value="keep">Keep in {form.asset} wallet</option>
            <option value="settle">Convert and settle to GTBank ••4821</option>
          </select>
        </Field>
      </div>
      <Field id="inv-memo" label="Description"><input id="inv-memo" className={inputCls} value={form.memo} onChange={set("memo")} placeholder="What is this invoice for?" /></Field>
    </Modal>
  );
}
