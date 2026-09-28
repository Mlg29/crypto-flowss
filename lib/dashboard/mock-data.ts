/**
 * [SAMPLE DATA] Stand-in for the CryptoFlow API while the backend is built.
 * Replace each export with an RTK Query endpoint in lib/api/ as the backend adds it (see docs/dashboard/04-api-contract.md).
 * Names, amounts, banks and rates here are illustrative only.
 */
import type {
  Activity, ApiKey, Approval, Destination, Invoice, KybStep, Member, PaymentLink, PayoutBatch, SecurityRule, Settlement, Wallet, WebhookEvent,
} from "./types";

const now = Date.now();
const ago = (mins: number) => new Date(now - mins * 60000).toISOString();

export const business = { name: "Adebayo Foods Ltd", initials: "AF", tier: 2, dailyPayoutLimitUsd: 50000, usedTodayUsd: 31000 };
export const currentUser = { name: "Adaeze Okafor", firstName: "Adaeze", initials: "AO", role: "owner" as const };

export const totalBalanceUsd = "71,563.40";
export const wallets: Wallet[] = [
  { id: "w_usdt_tron", asset: "USDT", network: "Tron", balance: "42,210.50", usdValue: "42,210.50" },
  { id: "w_usdc_base", asset: "USDC", network: "Base", balance: "24,880.00", usdValue: "24,880.00" },
  { id: "w_cngn_base", asset: "cNGN", network: "Base", balance: "6,952,000", usdValue: "4,472.90" },
];

export const volume = {
  "7D": { labels: ["Mon", "Wed", "Fri", "Sun"], collected: "$38,420", paidOut: "$21,960", points: 7 },
  "30D": { labels: ["30 Aug", "9 Sep", "19 Sep", "28 Sep"], collected: "$126,904", paidOut: "$81,322", points: 15 },
  "90D": { labels: ["Jul", "Aug", "Sep", "Now"], collected: "$342,118", paidOut: "$228,540", points: 13 },
} as const;
export type Range = keyof typeof volume;

/** Deterministic sample series: [collected%, paidOut%] per bucket, relative to the tallest bucket. */
export function volumeSeries(range: Range): [number, number][] {
  const seed = { "7D": 3, "30D": 7, "90D": 11 }[range];
  return Array.from({ length: volume[range].points }, (_, i) => [
    Math.min(98, 35 + ((i * 37 + seed * 13) % 50) + i * 1.5),
    Math.min(90, 20 + ((i * 29 + seed * 7) % 40) + i),
  ]);
}

export const approvals: Approval[] = [
  { id: "ap_1", kind: "payout", title: "October contractor payroll", amount: "9,480.00 USDC", meta: "38 recipients on Base · requested by Tunde Lawal · needs 1 more approval" },
  { id: "ap_2", kind: "settlement", title: "Settle to GTBank ••4821", amount: "₦20,000,000", meta: "Manual settlement · requested by Tunde Lawal" },
];

export const activity: Activity[] = [
  { id: "a1", kind: "invoice", direction: "in", description: "Invoice INV-1042 paid", counterparty: "Kilimanjaro Retail", amount: "+1,250.00 USDT", network: "Tron", status: "settled", createdAt: ago(2) },
  { id: "a2", kind: "payout", direction: "out", description: "Bulk payout, 38 recipients", counterparty: "September contractors", amount: "−9,480.00 USDC", network: "Base", status: "completed", createdAt: ago(60) },
  { id: "a3", kind: "payment_link", direction: "in", description: "Payment link: store checkout", counterparty: "Online customer", amount: "+86.40 USDT", network: "Tron", status: "confirming", createdAt: ago(180) },
  { id: "a4", kind: "exchange", direction: "internal", description: "Converted USDT to NGN", counterparty: "Treasury", amount: "2,000.00 USDT", network: "Internal", status: "completed", createdAt: ago(1500) },
  { id: "a5", kind: "settlement", direction: "out", description: "Settlement to GTBank ••4821", counterparty: "Auto-sweep", amount: "−₦20,000,000", network: "Bank", status: "in_transit", createdAt: ago(1560) },
  { id: "a6", kind: "payout", direction: "out", description: "Payout to Studio Nine Ltd", counterparty: "Single payout", amount: "−1,140.00 USDT", network: "Tron", status: "failed", createdAt: ago(3000) },
];

export const invoices: Invoice[] = [
  { id: "inv_1046", number: "INV-1046", customer: { name: "Kilimanjaro Retail Ltd", email: "accounts@kilimanjaro.co.ke" }, amount: "4,250.00", asset: "USDT", network: "Tron", issuedAt: "2026-09-28", dueAt: "2026-10-12", status: "pending", hostedUrl: "https://pay.cryptoflow.io/i/inv_1046" },
  { id: "inv_1045", number: "INV-1045", customer: { name: "Accra Fresh Markets", email: "ap@accrafresh.com.gh" }, amount: "12,800.00", asset: "USDC", network: "Base", issuedAt: "2026-09-25", dueAt: "2026-10-09", status: "pending", hostedUrl: "https://pay.cryptoflow.io/i/inv_1045" },
  { id: "inv_1044", number: "INV-1044", customer: { name: "Dubai Spice Traders", email: "finance@dubaispice.ae" }, amount: "6,420.00", asset: "USDT", network: "Ethereum", issuedAt: "2026-09-20", dueAt: "2026-09-27", status: "overdue", hostedUrl: "https://pay.cryptoflow.io/i/inv_1044" },
  { id: "inv_1043", number: "INV-1043", customer: { name: "Lekki Hotels Group", email: "payables@lekkihotels.ng" }, amount: "3,150.00", asset: "USDT", network: "Tron", issuedAt: "2026-09-18", dueAt: "2026-09-25", status: "overdue", hostedUrl: "https://pay.cryptoflow.io/i/inv_1043" },
  { id: "inv_1042", number: "INV-1042", customer: { name: "Kilimanjaro Retail Ltd", email: "accounts@kilimanjaro.co.ke" }, amount: "1,250.00", asset: "USDT", network: "Tron", issuedAt: "2026-09-15", dueAt: "2026-09-29", status: "paid", hostedUrl: "https://pay.cryptoflow.io/i/inv_1042" },
  { id: "inv_1041", number: "INV-1041", customer: { name: "Cape Logistics (Pty)", email: "ar@capelogistics.co.za" }, amount: "9,900.00", asset: "USDC", network: "Base", issuedAt: "2026-09-10", dueAt: "2026-09-24", status: "paid", hostedUrl: "https://pay.cryptoflow.io/i/inv_1041" },
  { id: "inv_1040", number: "INV-1040", customer: { name: "Abuja Office Supplies", email: "hello@abujaoffice.ng" }, amount: "740.00", asset: "USDT", network: "Tron", issuedAt: "2026-09-02", dueAt: "2026-09-16", status: "void", hostedUrl: "https://pay.cryptoflow.io/i/inv_1040" },
];

export const invoiceSummary = [
  { label: "Outstanding", value: "26,620.00", sub: "USD equivalent · 4 invoices" },
  { label: "Overdue", value: "9,570.00", sub: "2 invoices · reminders scheduled" },
  { label: "Collected this month", value: "126,904.00", sub: "USD equivalent · 61 payments" },
];

export const paymentLinks: PaymentLink[] = [
  { id: "pl_1", name: "Online store checkout", active: true, url: "pay.cryptoflow.io/adebayo/store", price: null, payments: 214, collected: "18,402 USDT" },
  { id: "pl_2", name: "Wholesale deposit", active: true, url: "pay.cryptoflow.io/adebayo/deposit", price: "500.00 USDT", payments: 37, collected: "18,500 USDT" },
  { id: "pl_3", name: "Trade fair 2025 stand", active: false, url: "pay.cryptoflow.io/adebayo/fair25", price: "250.00 USDC", payments: 12, collected: "3,000 USDC" },
];

export const payoutSummary = [
  { label: "Paid out, 30 days", value: "81,322.75", sub: "USD equivalent · 214 recipients" },
  { label: "Awaiting approval", value: "9,480.00", sub: "USDC · 1 batch" },
  { label: "Success rate", value: "99.2%", sub: "2 failed this month, both refunded" },
];

export const payoutBatches: PayoutBatch[] = [
  { id: "bpo_01JA7Q", name: "October contractor payroll", recipients: 38, amount: "9,480.00", asset: "USDC", network: "Base", status: "awaiting_approval", progress: 0, createdBy: "Tunde Lawal", createdAt: ago(90) },
  { id: "bpo_01JA2M", name: "Supplier run, week 39", recipients: 12, amount: "31,200.00", asset: "USDT", network: "Tron", status: "processing", progress: 0.66, createdBy: "Tunde Lawal", createdAt: ago(240) },
  { id: "bpo_01J9XK", name: "September contractor payroll", recipients: 36, amount: "8,940.00", asset: "USDC", network: "Base", status: "completed", progress: 1, createdBy: "Tunde Lawal", createdAt: "2026-08-30T10:00:00Z" },
  { id: "bpo_01J9TB", name: "Farmer co-op advances", recipients: 120, amount: "14,400.00", asset: "USDT", network: "Tron", status: "partly_failed", progress: 0.98, createdBy: "Adaeze Okafor", createdAt: "2026-08-22T10:00:00Z" },
];

export const bulkValidation = {
  fileName: "october-contractors.csv", rows: 40, ready: 38, total: "9,480.00 USDC on Base",
  issues: [
    { row: 14, name: "Grace Mensah", issue: "Bitcoin address on a USDC (Base) payout. Ask for a Base address." },
    { row: 27, name: "Musa Bello", issue: "Amount is blank." },
  ],
};

export const indicativeRates = [
  { pair: "USDT / NGN", rate: "1,550.00", change: "+0.4% today", up: true },
  { pair: "USDC / NGN", rate: "1,549.20", change: "+0.3% today", up: true },
  { pair: "BTC / USDT", rate: "65,000.00", change: "−1.2% today", up: false },
];
export const exchangeUsd: Record<string, number> = { USDT: 1, USDC: 1, NGN: 1 / 1550, cNGN: 1 / 1550 };
export const exchangeAvailable: Record<string, string> = { USDT: "42,210.50 USDT", USDC: "24,880.00 USDC", NGN: "₦0.00", cNGN: "6,952,000 cNGN" };
export const EXCHANGE_FEE = 0.005;

export const conversions = [
  { id: "cx1", from: "2,000.00 USDT", to: "₦3,084,500", rate: "1 USDT = 1,542.25 NGN", when: "Yesterday" },
  { id: "cx2", from: "5,000.00 USDC", to: "4,997.50 USDT", rate: "1 USDC = 0.9995 USDT", when: "24 Sep" },
  { id: "cx3", from: "10,000.00 USDT", to: "₦15,380,000", rate: "1 USDT = 1,538.00 NGN", when: "19 Sep" },
];

export const destinations: Destination[] = [
  { id: "d1", name: "GTBank ••4821", detail: "NGN current account", kind: "bank", isDefault: true, verified: true, note: "Same-day settlement on weekdays before 15:00." },
  { id: "d2", name: "Treasury wallet", detail: "TQ5x…9kLm · USDT on Tron", kind: "wallet", isDefault: false, verified: true, note: "Whitelisted. Withdrawals need 2 approvals." },
  { id: "d3", name: "Access Bank ••1190", detail: "USD domiciliary account", kind: "bank", isDefault: false, verified: false, note: "Verification in progress, usually 1 business day." },
];
export const sweepRule = { enabled: true, description: "Every weekday at 17:00, convert USDT above 10,000 to naira and settle to GTBank ••4821." };

export const settlements: Settlement[] = [
  { id: "stl_7Q2K", destination: "GTBank ••4821", amount: "₦20,000,000", status: "in_transit", reference: "NIP/000013260927", createdAt: ago(1500) },
  { id: "stl_7P8D", destination: "GTBank ••4821", amount: "₦15,380,000", status: "settled", reference: "NIP/000013260919", createdAt: "2026-09-19T15:00:00Z" },
  { id: "stl_7N1A", destination: "Treasury wallet", amount: "25,000.00 USDT", status: "settled", reference: "tx 0x8a4f…c21e", createdAt: "2026-09-12T15:00:00Z" },
  { id: "stl_7M5C", destination: "Access Bank ••1190", amount: "$5,000.00", status: "returned", reference: "Account not yet verified", createdAt: "2026-09-08T15:00:00Z" },
];

export const apiKeys: ApiKey[] = [
  { id: "k1", name: "Production server", masked: "sk_live_••••••••••••7f3c", mode: "live", lastUsedAt: ago(2) },
  { id: "k2", name: "Staging", masked: "sk_test_••••••••••••a91d", mode: "test", lastUsedAt: ago(300) },
  { id: "k3", name: "Publishable (checkout)", masked: "pk_live_4hG8…Qm2x", mode: "live", lastUsedAt: ago(60) },
];
export const webhook = {
  url: "https://api.adebayofoods.com/hooks/cryptoflow", healthy: true, deliveryRate7d: "99.8%", secretMasked: "whsec_••••••2b91",
  subscribed: ["invoice.paid", "payout.completed", "payout.failed", "settlement.completed", "exchange.completed", "kyb.updated"],
  allowlist: ["102.89.34.10", "102.89.34.11"],
};
export const webhookEvents: WebhookEvent[] = [
  { id: "e1", type: "invoice.paid", responseCode: 200, at: ago(2) },
  { id: "e2", type: "payout.completed", responseCode: 200, at: ago(60) },
  { id: "e3", type: "settlement.completed", responseCode: 200, at: ago(1500) },
  { id: "e4", type: "payout.failed", responseCode: 500, at: ago(3000), note: "retried ok" },
  { id: "e5", type: "exchange.completed", responseCode: 200, at: "2026-09-24T12:00:00Z" },
  { id: "e6", type: "kyb.updated", responseCode: 200, at: "2026-09-20T12:00:00Z" },
];

export const kybSteps: KybStep[] = [
  { id: "cac", label: "Certificate of incorporation (CAC)", detail: "Verified 12 Aug", done: true },
  { id: "directors", label: "Directors and IDs", detail: "2 directors verified", done: true },
  { id: "address", label: "Proof of business address", detail: "Verified 12 Aug", done: true },
  { id: "ubo", label: "Ultimate beneficial owners", detail: "Declared and screened", done: true },
  { id: "sof", label: "Source of funds", detail: "Needed for Tier 3 (limits above $50,000 a day)", done: false },
];

export const team: Member[] = [
  { id: "m1", name: "Adaeze Okafor", email: "adaeze@adebayofoods.ng", role: "owner", initials: "AO" },
  { id: "m2", name: "Tunde Lawal", email: "tunde@adebayofoods.ng", role: "finance", initials: "TL" },
  { id: "m3", name: "Ifeoma Eze", email: "ifeoma@adebayofoods.ng", role: "approver", initials: "IE" },
  { id: "m4", name: "Chidi Nwosu", email: "chidi@adebayofoods.ng", role: "developer", initials: "CN" },
];

export const securityRules: SecurityRule[] = [
  { id: "r1", label: "Two-person approval", detail: "Payouts and settlements above $5,000 need a second approver", state: "On", tone: "positive" },
  { id: "r2", label: "Two-factor authentication", detail: "Required for every team member", state: "Enforced", tone: "positive" },
  { id: "r3", label: "Withdrawal address whitelist", detail: "Funds can only leave to saved, verified addresses", state: "On", tone: "positive" },
  { id: "r4", label: "Session timeout", detail: "Sign out after 30 minutes of inactivity", state: "30 min", tone: "neutral" },
];
