# API contract the dashboard expects

Suggested REST shape. Types live in `lib/dashboard/types.ts`. All amounts are decimal strings. All list endpoints are cursor-paginated (`?cursor=&limit=`). Every request carries the environment through the key used (live or test).

| Screen | Method and path | Returns / body |
| --- | --- | --- |
| Shell | `GET /v1/me` | user, role, business (name, tier, limits) |
| Overview | `GET /v1/balances` | `Wallet[]` plus total in USD |
| Overview | `GET /v1/reports/volume?range=7D|30D|90D` | buckets of `{ start, collectedUsd, paidOutUsd }` |
| Overview | `GET /v1/activity` | `Activity[]` |
| Overview | `GET /v1/approvals?status=pending` | `Approval[]` |
| Overview | `POST /v1/approvals/{id}/approve` | 2FA code in body; 409 if requester tries to self-approve |
| Payments | `GET /v1/invoices?status=` / `POST /v1/invoices` | `Invoice[]` / create returns `Invoice` with `hostedUrl` |
| Payments | `GET /v1/payment-links` / `POST /v1/payment-links` | `PaymentLink[]` |
| Payouts | `GET /v1/payout-batches` | `PayoutBatch[]` |
| Payouts | `POST /v1/payouts` | single payout; server screens the address first |
| Payouts | `POST /v1/payout-batches` (multipart CSV) | `{ id, rows, ready, issues: [{ row, name, issue }] }` |
| Payouts | `GET /v1/screening?address=&network=` | `{ risk: "none" | "review" | "blocked", reasons[] }` |
| Exchange | `POST /v1/quotes` | `{ id, rate, fee, receive, expiresAt }` (30s) |
| Exchange | `POST /v1/exchanges` | `{ quoteId }` |
| Settlements | `GET /v1/destinations`, `GET /v1/settlements`, `POST /v1/settlements` | |
| Settlements | `GET/PATCH /v1/sweep-rules/{id}` | `{ enabled, schedule, threshold, destinationId }` |
| Developers | `GET/POST /v1/api-keys`, `POST /v1/api-keys/{id}/roll` | masked keys only, full secret shown once on create |
| Developers | `GET /v1/webhooks`, `GET /v1/webhooks/{id}/deliveries` | |
| Settings | `GET /v1/kyb`, `POST /v1/kyb/documents` | steps and status |
| Settings | `GET /v1/team`, `POST /v1/team/invites`, `PATCH /v1/team/{id}` | |

Webhook events the product emits: `invoice.paid`, `payout.completed`, `payout.failed`, `settlement.completed`, `exchange.completed`, `kyb.updated`.
