export type TxType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  date: string;        // ISO
  amount: number;      // positive numbers; type decides sign
  type: TxType;
  category: string;
  tags: string[];
  note?: string;
  goalId?: string;
}

export interface Budget {
  month: string;       // YYYY-MM
  category: string;
  amount: number;      // planned cap
  rollover?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  saved: number;
  note?: string;
}

export interface NetItem {
  id: string;
  name: string;
  amount: number;   // positive for asset, negative for liability
}

export interface NetSnapshot {
  month: string;    // YYYY-MM
  total: number;
}

export interface Cert {
  principal: number;
  startYear: number;
  startMonthIndex: number; // 0..11
  rate: number;            // annual
  monthsLeft: number;      // initial 36
}

export interface SimInput {
  startYear: number;             // 2025
  startMonthIndex: number;       // 11 for December
  yearsOfDeposits: number;       // 7 years
  baseMonthlyDeposit: number;    // 25000 (EGP) for Plan A; 6250 for Plan B
  minReinvest: number;           // 1000 (EGP) minimum for new certificate after horizon
}

export interface YearRow {
  year: number;
  age: number;
  depositsYTD: number;
  monthlyInterestDec: number;
  netWorthEnd: number;
  activePrincipalEnd: number;
  cashEnd: number;
}

export interface SimResult {
  planName: string;
  rows: YearRow[];
  totals: { deposited: number; cash: number; activePrincipal: number; netWorth: number; };
}
