# Roles and permissions

Enforce on the server; the UI only mirrors it. [PLACEHOLDER] Confirm with compliance.

| Action | Owner | Finance | Approver | Developer |
| --- | --- | --- | --- | --- |
| View balances and activity | Yes | Yes | Yes | No |
| Create invoices and payment links | Yes | Yes | No | No |
| Create payouts (single or bulk) | Yes | Yes | No | No |
| Approve payouts and settlements | Yes | No (never their own) | Yes | No |
| Convert (exchange) | Yes | Yes | No | No |
| Settle to bank or wallet | Yes | Request only | Approve | No |
| Manage destinations and sweep rules | Yes | No | No | No |
| API keys and webhooks | Yes | No | No | Yes |
| Team, roles, KYB documents, limits | Yes | No | No | No |

## Approval rules (sample policy)

- Payouts and settlements above **$5,000** need a second approver who is not the requester.
- New withdrawal addresses and bank accounts must be verified and whitelisted before use.
- Approvals require step-up 2FA.
- Tier 2 daily payout limit **$50,000**; Tier 3 after source-of-funds review.
