# GAIA v1.3 — Week 6: Wealth (Full)
Route: /wealth

Sections
- QuickAdd — fast transaction entry.
- Filters — search/type/category/date filter for ledger.
- Budgets — monthly category budgets + progress bars.
- Ledger — transactions with delete.
- Goals — goals with +1k/-1k adjusters.
- NetWorth — assets/liabilities list + monthly snapshots.
- Simulator — Plans A/B; Dec 2025 start; 7 years base deposits then reinvest interest + maturities (min reinvest 1,000 EGP) until age 60; 3y fixed-rate certs; rates 15%→10%.
- WealthLevels — updated bands including "Wealthy" before "Financial Freedom".
- ExportImport — round-trip JSON for all hub data.

Notes
- All UI files begin with 'use client'. Tailwind inline only.
- You can tweak rate schedule in `lib/sim.ts` (function `rateForYear`).

