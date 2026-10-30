import type { Category, Transaction } from '@/shared/api'
import { monthLabel, monthOf, type MonthKey } from '@/shared/lib'

export interface Slice {
  name: string
  value: number
  color: string
}

export function expenseBreakdown(
  transactions: Transaction[],
  categories: Category[],
  month: MonthKey,
): Slice[] {
  const sums = new Map<number, number>()
  for (const t of transactions) {
    if (t.type === 'expense' && monthOf(t.date) === month) {
      sums.set(t.categoryId, (sums.get(t.categoryId) ?? 0) + t.amount)
    }
  }
  return categories
    .filter(c => sums.has(c.id))
    .map(c => ({ name: c.name, value: Math.round(sums.get(c.id)! * 100) / 100, color: c.color }))
    .sort((a, b) => b.value - a.value)
}

export interface MonthPoint {
  month: MonthKey
  label: string
  income: number
  expense: number
}

export function monthlySeries(transactions: Transaction[], limit = 6): MonthPoint[] {
  const byMonth = new Map<MonthKey, MonthPoint>()
  for (const t of transactions) {
    const key = monthOf(t.date)
    const point = byMonth.get(key) ?? { month: key, label: monthLabel(key).split(' ')[0], income: 0, expense: 0 }
    point[t.type] += t.amount
    byMonth.set(key, point)
  }
  return [...byMonth.values()].sort((a, b) => a.month.localeCompare(b.month)).slice(-limit)
}
