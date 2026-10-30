
export type MonthKey = string

export const monthOf = (isoDate: string): MonthKey => isoDate.slice(0, 7)

/** '2025-03' → «Март 2025» */
export function monthLabel(month: MonthKey): string {
  const [year, m] = month.split('-').map(Number)
  const text = new Date(year, m - 1, 1).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
  return text.charAt(0).toUpperCase() + text.slice(1).replace(' г.', '')
}

export function shiftMonth(month: MonthKey, delta: number): MonthKey {
  const [year, m] = month.split('-').map(Number)
  const date = new Date(year, m - 1 + delta, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function monthRange(from: MonthKey, to: MonthKey): MonthKey[] {
  const result: MonthKey[] = []
  for (let current = from; current <= to; current = shiftMonth(current, 1)) result.push(current)
  return result.reverse()
}
