import { hasMoreThanTwoDecimals, parseNumber } from '@/shared/lib'
import type { FlowType } from '@/shared/api'

export interface CategoryFormValues {
  name: string
  type: FlowType
  color: string
  limit: string
}

export type CategoryFormErrors = Partial<Record<keyof CategoryFormValues, string>>

export const MAX_NAME = 100

export function validateCategory(values: CategoryFormValues, existingNames: string[]): CategoryFormErrors {
  const errors: CategoryFormErrors = {}
  const name = values.name.trim()

  if (!name) errors.name = 'Введите название'
  else if (name.length > MAX_NAME) errors.name = `Не больше ${MAX_NAME} символов`
  else if (existingNames.some(n => n.trim().toLowerCase() === name.toLowerCase())) {
    errors.name = 'Категория с таким названием уже есть'
  }

  if (!/^#[0-9A-Fa-f]{6}$/.test(values.color)) errors.color = 'Выберите цвет'

  if (values.type === 'expense' && values.limit.trim() !== '') {
    const limit = parseNumber(values.limit)
    if (Number.isNaN(limit)) errors.limit = 'Лимит должен быть числом'
    else if (limit <= 0) errors.limit = 'Лимит должен быть больше нуля'
    else if (hasMoreThanTwoDecimals(limit)) errors.limit = 'Не больше двух знаков после запятой'
  }

  return errors
}
