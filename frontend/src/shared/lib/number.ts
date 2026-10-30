export function parseNumber(text: string): number {
  const normalized = text.trim().replace(/\s/g, '').replace(',', '.')
  if (normalized === '') return NaN
  return Number(normalized)
}

export function hasMoreThanTwoDecimals(value: number): boolean {
  return Math.round(value * 100) / 100 !== value
}
