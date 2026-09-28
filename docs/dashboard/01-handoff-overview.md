# Merchant dashboard: developer handoff

| Part | What it is | Use it for |
| --- | --- | --- |
| **1. Design artifacts** | "CryptoFlow Merchant Dashboard" canvas and the "CryptoFlow" design system on claude.ai | Visual reference. Press Play on the canvas to click through every screen and modal |
| **2. Handoff docs** | This folder | Screens, API contract, roles and permissions, states, motion |
| **3. Starter codebase** | This repo | The production starting point, already matching the prototype |

Ask the product owner to share both artifact links with you; they are private until shared.

**Source of truth order:** design system tokens > this codebase > canvas prototype.

## Already built

- App shell: sidebar navigation with counts, business switcher, Live/Test environment switch with banner, top bar with search, notifications and primary actions
- Seven screens: Overview, Payments, Payouts, Exchange, Settlements, Developers, Business and team
- Create invoice and New payout (single and bulk) modals: focus on open, Escape to close, focus restored on close
- Working filters, tabs, date ranges, approve buttons, exchange maths and auto-sweep switch (local state)

## Left for engineering

1. Authentication, session handling, 2FA and step-up 2FA on approvals (`app/(dashboard)/layout.tsx`)
2. API integration for every `TODO:` (see `04-api-contract.md`)
3. Role-based access in the UI (hide or disable actions per `03-roles-and-permissions.md`); enforce on the server as well
4. Live/Test: scope all API calls to the matching key set and persist the choice
5. Loading, empty and error states per `02-screens.md`
6. Responsive layout below 1280px (the prototype is desktop only)
7. Real charts (any library) fed by the reports endpoint, keeping the two series colours
