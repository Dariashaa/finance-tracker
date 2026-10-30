import { hasMoreThanTwoDecimals, parseNumber } from '@/shared/lib'

export interface TransactionFormValues {
  amount: string
  date: string
  categoryId: number | ''
  comment: string
}

export type TransactionFormErrors = Partial<Record<keyof TransactionFormValues, string>>

export const MAX_AMOUNT = 9_999_999_999.99
export const MAX_COMMENT = 255

export function validateTransaction(values: TransactionFormValues): TransactionFormErrors {
  const errors: TransactionFormErrors = {}

  const amount = parseNumber(values.amount)
  if (values.amount.trim() === '') errors.amount = 'Введите сумму'
  else if (Number.isNaN(amount)) errors.amount = 'Сумма должна быть числом'
  else if (amount <= 0) errors.amount = 'Сумма должна быть больше нуля'
  else if (hasMoreThanTwoDecimals(amount)) errors.amount = 'Не больше двух знаков после запятой'
  else if (amount > MAX_AMOUNT) errors.amount = 'Слишком большая сумма'

  if (!values.date) errors.date = 'Укажите дату'
  else if (Number.isNaN(Date.parse(values.date)) || values.date < '2000-01-01') {
    errors.date = 'Укажите корректную дату'
  }

  if (values.categoryId === '') errors.categoryId = 'Выберите категорию'

  if (values.comment.length > MAX_COMMENT) {
    errors.comment = `Не больше ${MAX_COMMENT} символов`
  }

  return errors
}
