/**
 * Indicative rates for the homepage calculator.
 *
 * [PLACEHOLDER] These are fixed example prices. Before launch, replace
 * `getIndicativeRates()` with a call to the CryptoFlow pricing service
 * (see docs/website/05-rate-calculator.md for the expected API contract) and set
 * FEE_RATE from the real fee schedule.
 */
export type Currency = {
  code: string;
  name: string;
  /** Price of one unit in USD. */
  usd: number;
  /** Decimal places to display. */
  dp: number;
};

export const FEE_RATE = 0.005; // 0.5% [PLACEHOLDER]
export const RATE_LOCK_SECONDS = 30;

export const CURRENCIES: Currency[] = [
  { code: "USDT", name: "Tether USD", usd: 1, dp: 2 },
  { code: "USDC", name: "USD Coin", usd: 1, dp: 2 },
  { code: "BTC", name: "Bitcoin", usd: 65000, dp: 6 },
  { code: "ETH", name: "Ether", usd: 3200, dp: 5 },
  { code: "NGN", name: "Nigerian naira, to bank", usd: 1 / 1550, dp: 2 },
  { code: "cNGN", name: "Compliant naira stablecoin", usd: 1 / 1550, dp: 2 },
];

export function getIndicativeRates(): Currency[] {
  return CURRENCIES;
}

export type Quote = {
  from: Currency;
  to: Currency;
  amount: number;
  fee: number;
  rate: number;
  receive: number;
};

export function quote(currencies: Currency[], fromCode: string, toCode: string, amount: number): Quote {
  const from = currencies.find((c) => c.code === fromCode) ?? currencies[0];
  const to = currencies.find((c) => c.code === toCode) ?? currencies[1];
  const rate = from.usd / to.usd;
  const fee = amount * FEE_RATE;
  const receive = from.code === to.code ? amount : Math.max(0, (amount - fee) * rate);
  return { from, to, amount, fee, rate, receive };
}

export function formatAmount(v: number, dp: number) {
  return v.toLocaleString("en-US", { minimumFractionDigits: Math.min(dp, 2), maximumFractionDigits: dp });
}

export function formatRate(rate: number) {
  return rate < 1 ? rate.toLocaleString("en-US", { maximumSignificantDigits: 4 }) : formatAmount(rate, 2);
}

/** Accepts digits, commas and one decimal point. */
export function parseAmount(input: string): number | null {
  if (!/^[0-9,]*\.?[0-9]*$/.test(input)) return null;
  const n = parseFloat(input.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}
