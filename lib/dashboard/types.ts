/**
 * Domain types for the merchant dashboard. They mirror the API contract in
 * docs/dashboard/04-api-contract.md. Amounts are strings in minor-safe decimal form
 * (never floats) exactly as the API returns them.
 */
import type { BadgeTone } from "@/components/dashboard/ui/Badge";

export type Asset = "USDT" | "USDC" | "cNGN" | "BTC" | "ETH";
export type Network = "Tron" | "Base" | "Ethereum" | "Solana" | "BNB Chain" | "Polygon";
export type Fiat = "NGN" | "USD";
export type Mode = "live" | "test";

export type Role = "owner" | "finance" | "approver" | "developer";

export type Wallet = { id: string; asset: Asset; network: Network; balance: string; usdValue: string };

export type ActivityKind = "invoice" | "payout" | "exchange" | "settlement" | "payment_link";
export type ActivityStatus = "settled" | "completed" | "confirming" | "in_transit" | "failed";
export type Activity = {
  id: string;
  kind: ActivityKind;
  direction: "in" | "out" | "internal";
  description: string;
  counterparty: string;
  amount: string; // display string, e.g. "+1,250.00 USDT"
  network: string;
  status: ActivityStatus;
  createdAt: string; // ISO 8601
};

export type InvoiceStatus = "draft" | "pending" | "overdue" | "paid" | "void";
export type Invoice = {
  id: string;
  number: string;
  customer: { name: string; email: string };
  amount: string;
  asset: Asset;
  network: Network;
  issuedAt: string;
  dueAt: string;
  status: InvoiceStatus;
  hostedUrl: string;
};

export type PaymentLink = { id: string; name: string; active: boolean; url: string; price: string | null; payments: number; collected: string };

export type PayoutStatus = "awaiting_approval" | "processing" | "completed" | "partly_failed" | "failed";
export type PayoutBatch = {
  id: string;
  name: string;
  recipients: number;
  amount: string;
  asset: Asset;
  network: Network;
  status: PayoutStatus;
  progress: number; // 0..1
  createdBy: string;
  createdAt: string;
};

export type Approval = { id: string; title: string; amount: string; meta: string; kind: "payout" | "settlement" };

export type Destination = { id: string; name: string; detail: string; kind: "bank" | "wallet"; isDefault: boolean; note: string; verified: boolean };

export type SettlementStatus = "in_transit" | "settled" | "returned";
export type Settlement = { id: string; destination: string; amount: string; status: SettlementStatus; reference: string; createdAt: string };

export type ApiKey = { id: string; name: string; masked: string; mode: Mode; lastUsedAt: string };
export type WebhookEvent = { id: string; type: string; responseCode: number; at: string; note?: string };

export type KybStep = { id: string; label: string; detail: string; done: boolean };
export type Member = { id: string; name: string; email: string; role: Role; initials: string };
export type SecurityRule = { id: string; label: string; detail: string; state: string; tone: BadgeTone };
