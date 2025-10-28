'use client';

import type { Cert, SimInput, SimResult, YearRow } from './types';

/**
 * Updated assumptions per user:
 * - During first 7 years (deposit horizon), each month opens a cert for (base deposit + any accumulated pot).
 *   Pot accumulates: monthly interest from existing certs + matured principals.
 * - After 7 years, user stops base deposits but keeps reinvesting *everything* (monthly interest + matured principals).
 *   A new cert is opened whenever the pot >= minReinvest (e.g., 1,000 EGP). Remainder (< min) carries forward as cash.
 * - All certs are 36 months (3 years) fixed-rate at the year-of-origination rate (coupon monthly, not compounding inside).
 * - Net worth = active principal (locked) + cash remainder carried.
 * - Rate schedule: 2025:15%, 2026:14%, 2027:13%, 2028:12%, 2029:11%, 2030+:10% (floor).
 */
function rateForYear(y: number): number {
  if (y <= 2025) return 0.15;
  if (y === 2026) return 0.14;
  if (y === 2027) return 0.13;
  if (y === 2028) return 0.12;
  if (y === 2029) return 0.11;
  return 0.10;
}

function ageAtDec31(year: number): number { return year - 1991; } // born 1991-08-10

function pushDecRow(rows: YearRow[], year: number, depositsYTD: number, monthlyInterestDec: number, activePrincipal: number, cash: number) {
  rows.push({
    year,
    age: ageAtDec31(year),
    depositsYTD: Math.round(depositsYTD),
    monthlyInterestDec: Math.round(monthlyInterestDec),
    activePrincipalEnd: Math.round(activePrincipal),
    cashEnd: Math.round(cash),
    netWorthEnd: Math.round(activePrincipal + cash),
  });
}

export function simulate(planName: string, input: SimInput): SimResult {
  const termMonths = 36;
  const lastYear = 2051; // age 60
  const finalMonthIndex = 11; // December

  let year = input.startYear;
  let month = input.startMonthIndex; // 0..11
  const monthsOfDeposits = input.yearsOfDeposits * 12;
  let depositsDone = 0;

  let certs: Cert[] = [];
  let cash = 0;                 // remainder below minReinvest
  let pot = 0;                  // accumulates interest + maturities (+ base during horizon)
  const rows: YearRow[] = [];
  let depositsThisYear = 0;
  let totalDeposited = 0;

  while (year < lastYear || (year === lastYear && month <= finalMonthIndex)) {
    // 1) Monthly coupon interest from active certs
    const monthlyInterest = certs.reduce((sum, c) => sum + c.principal * c.rate / 12, 0);
    pot += monthlyInterest;

    // 2) Maturities at end of month -> principal returned; add to pot (to be re-invested)
    const nextCerts: Cert[] = [];
    for (const c of certs) {
      const left = c.monthsLeft - 1;
      if (left <= 0) {
        pot += c.principal;
      } else {
        nextCerts.push({ ...c, monthsLeft: left });
      }
    }
    certs = nextCerts;

    // 3) Opening new certificates
    const inHorizon = depositsDone < monthsOfDeposits;
    if (inHorizon) {
      // During horizon: add base deposit to pot and open a new cert for the entire pot
      pot += input.baseMonthlyDeposit;
      const r = rateForYear(year);
      certs.push({ principal: pot, startYear: year, startMonthIndex: month, rate: r, monthsLeft: termMonths });
      depositsThisYear += pot;
      totalDeposited += pot;
      pot = 0;
      depositsDone += 1;
    } else {
      // After horizon: if pot >= minReinvest, open a cert for the full pot; else let it accumulate (cash shown as remainder)
      if (pot >= input.minReinvest) {
        const r = rateForYear(year);
        certs.push({ principal: pot, startYear: year, startMonthIndex: month, rate: r, monthsLeft: termMonths });
        depositsThisYear += pot;
        totalDeposited += pot;
        pot = 0;
      }
    }

    // 4) For reporting, any leftover pot under min threshold is considered cash remainder
    cash = pot;

    // 5) December snapshot
    if (month === 11) {
      const activePrincipal = certs.reduce((s,c)=>s+c.principal,0);
      const decMonthlyInterest = certs.reduce((s,c)=>s + c.principal * c.rate / 12, 0);
      pushDecRow(rows, year, depositsThisYear, decMonthlyInterest, activePrincipal, cash);
      depositsThisYear = 0;
    }

    // 6) Next month
    month += 1;
    if (month >= 12) { month = 0; year += 1; }
  }

  const totals = {
    deposited: Math.round(totalDeposited),
    cash: Math.round(cash),
    activePrincipal: Math.round(certs.reduce((s,c)=>s+c.principal,0)),
    netWorth:  Math.round(cash + certs.reduce((s,c)=>s+c.principal,0)),
  };

  return { planName, rows, totals };
}
