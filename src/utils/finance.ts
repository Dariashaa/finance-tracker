import { transactions } from '../data/demoData'
import type { Transaction } from '../types'

export const sumAmounts = (items: Transaction[]) =>
  items.reduce((sum, item) => sum + item.amount, 0)

export const months = Array.from(new Set(transactions.map(item => item.date.slice(0, 7))))
  .sort()
  .reverse()

export const monthLabel = (month: string) =>
  new Date(month + '-01').toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
