'use client';

import type { Transaction, Budget, Goal, NetItem, NetSnapshot } from './types';

const K = {
  tx: 'wealth_transactions_v1',
  bd: 'wealth_budgets_v1',
  gl: 'wealth_goals_v1',
  nw: 'wealth_net_items_v1',
  ns: 'wealth_net_snaps_v1',
  pf: 'wealth_prefs_v1',
};

export type Prefs = {
  currency: string;
  month: string; // YYYY-MM current view
};

function g<T>(k: string, fb: T): T {
  try { const raw = localStorage.getItem(k); if (raw) return JSON.parse(raw) as T; } catch {}
  return fb;
}
function s<T>(k: string, v: T){ localStorage.setItem(k, JSON.stringify(v)); }

export const loadTx = (): Transaction[] => g<Transaction[]>(K.tx, []);
export const saveTx = (list: Transaction[]) => s(K.tx, list);

export const loadBudgets = (): Budget[] => g<Budget[]>(K.bd, []);
export const saveBudgets = (list: Budget[]) => s(K.bd, list);

export const loadGoals = (): Goal[] => g<Goal[]>(K.gl, []);
export const saveGoals = (list: Goal[]) => s(K.gl, list);

export const loadNetItems = (): NetItem[] => g<NetItem[]>(K.nw, []);
export const saveNetItems = (list: NetItem[]) => s(K.nw, list);

export const loadNetSnaps = (): NetSnapshot[] => g<NetSnapshot[]>(K.ns, []);
export const saveNetSnaps = (list: NetSnapshot[]) => s(K.ns, list);

export const loadPrefs = (): Prefs => g<Prefs>(K.pf, { currency: 'EGP', month: new Date().toISOString().slice(0,7) });
export const savePrefs = (p: Prefs) => s(K.pf, p);

// Helpers
export function nid(): string {
  return (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2,10)) + Math.random().toString(36).slice(2,10);
}
export function monthOf(iso: string): string { return iso.slice(0,7); }
