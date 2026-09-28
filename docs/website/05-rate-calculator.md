# Rate calculator

File: `components/sections/RateCalculator.tsx`. Maths and data: `lib/rates.ts`.

## Behaviour

- Inputs: amount (text, `inputMode="decimal"`, accepts digits, commas and one decimal point), send currency, receive currency.
- Picking the same currency on both sides swaps them. The switch button swaps and rotates.
- `receive = (amount - fee) * rate`, where `fee = amount * FEE_RATE` in the send currency, and `rate = from.usd / to.usd`.
- Display precision per currency (`dp`): 2 for USDT, USDC, NGN, cNGN; 6 for BTC; 5 for ETH. Rates under 1 show 4 significant digits.
- Rate lock: 30-second countdown, restarts on any quote change; at zero it refreshes the rate (currently a no-op, see TODO) and restarts.
- Invalid input: error text "Enter a number, for example 25,000", `aria-invalid`, red outline, shake.
- "Get a firm quote": loading, then confirmation, then idle. Currently mocked; wire it to the demo or quote form.
- Labelled "Indicative" with a footnote: firm rates and fees are shown before acceptance.

## Placeholders to replace

In `lib/rates.ts`:

- `CURRENCIES[].usd`: fixed example prices (BTC 65,000, ETH 3,200, NGN at 1,550 per USD)
- `FEE_RATE`: 0.5% example
- `getIndicativeRates()`: returns the fixed list

## Suggested API contract

Indicative prices for the marketing site (public, cacheable 15 to 30 seconds):

```
GET /v1/public/indicative-rates
200 {
  "asOf": "2026-09-26T10:30:00Z",
  "base": "USD",
  "feeRate": 0.005,
  "currencies": [
    { "code": "USDT", "name": "Tether USD", "usd": 1.0, "dp": 2 },
    { "code": "NGN",  "name": "Nigerian naira, to bank", "usd": 0.000645, "dp": 2 }
  ]
}
```

Implementation notes:

1. Fetch in a Server Component or route handler with `next: { revalidate: 15 }` and pass the list to `RateCalculator` as a prop, or poll client-side every 30 seconds when the lock expires (the TODO in the countdown effect).
2. Keep the indicative label. Firm quotes come from the authenticated quotes API after sign-in.
3. If pairs have their own spreads, return per-pair rates instead of USD prices and change `quote()` accordingly.
4. On fetch failure, keep the last good rates and show "Rates updating" instead of stale numbers after 2 minutes.
