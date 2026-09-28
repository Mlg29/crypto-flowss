# Screens

Layout: sidebar 248px (`night`), top bar 68px (`surface-200`), content max 1240px with 28px padding on `surface-100`. Cards are `surface-200`, 1px `line` border, radius 16px. Page titles use Bricolage Grotesque 28/34 semibold.

| Route | Purpose | Key content | Primary actions |
| --- | --- | --- | --- |
| `/dashboard/overview` | Daily snapshot | KYB tier banner, total balance + per-wallet balances, quick actions, collected vs paid out chart (7D/30D/90D), approvals queue, daily limit usage, recent activity | Create invoice, Send payout, Approve |
| `/dashboard/payments` | Get paid | Summary (outstanding, overdue, collected), Invoices table with status filters, Payment links cards | Create invoice, Copy link |
| `/dashboard/payouts` | Pay out | Summary, payout batches with status and progress | New payout (single or bulk CSV) |
| `/dashboard/exchange` | Convert | Convert card (amount, from, to, rate, fee, destination), indicative rates, recent conversions | Convert |
| `/dashboard/settlements` | Move money out | Destinations (bank, wallet) with default and verification state, auto-sweep rule, settlement history with bank references | Settle now, Edit rule |
| `/dashboard/developers` | Integrate | API keys (masked, mode, last used), webhook endpoint health, subscribed events, IP allowlist, recent deliveries | Create key, Roll key |
| `/dashboard/settings` | Business and team | KYB checklist to next tier, team with roles, security and approval rules | Upload document, Invite member |

## States every data view needs

- **Loading:** skeleton rows in tables (keep row height 52px), skeleton blocks for stat cards. No spinners on full pages.
- **Empty:** one sentence plus the primary action ("No invoices yet. Create your first invoice.").
- **Error:** inline banner in the card with a Retry button; never blank the whole screen.
- **Permission denied:** action buttons hidden, or disabled with a tooltip naming the role that can do it.
- **Test mode:** warning banner under the top bar on every screen; all figures come from the test key set.

## Status vocabulary (one source: `lib/dashboard/format.ts`)

| Object | Statuses |
| --- | --- |
| Invoice | Draft, Pending, Overdue, Paid, Void |
| Payout batch | Awaiting approval, Processing, Completed, Partly failed, Failed |
| Settlement | In transit, Settled, Returned |
| Activity | Settled, Completed, Confirming, In transit, Failed |
