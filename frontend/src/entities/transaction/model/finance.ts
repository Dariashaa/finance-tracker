import type { Transaction } from '@/shared/api'
import { monthOf, type MonthKey } from '@/shared/lib'


export function transactionsOfMonth(transactions: Transaction[], month: MonthKey): Transaction[] {
  return transactions
    .filter(t => monthOf(t.date) === month)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
}

export interface Totals {
  income: number
  expense: number
  balance: number
}

export function calcTotals(transactions: Transaction[]): Totals {
  let income = 0
  let expense = 0
  for (const t of transactions) {
    if (t.type === 'income') income += t.amount
    else expense += t.amount
  }
  const round = (n: number) => Math.round(n * 100) / 100
  return { income: round(income), expense: round(expense), balance: round(income - expense) }
}

export function sumByCategory(transactions: Transaction[]): Map<number, number> {
  const sums = new Map<number, number>()
  for (const t of transactions) sums.set(t.categoryId, (sums.get(t.categoryId) ?? 0) + t.amount)
  return sums
}

export function monthsWithData(transactions: Transaction[]): MonthKey[] {
  return [...new Set(transactions.map(t => monthOf(t.date)))].sort()
}
