import { ApiError } from './ApiError'
import { demoCategories, demoTransactions } from './demoData'
import type { Category, CategoryInput, CollectionApi, Transaction, TransactionInput } from './types'

const LATENCY_MS = 500

let categories: Category[] = demoCategories.map(c => ({ ...c }))
let transactions: Transaction[] = demoTransactions.map(t => ({ ...t }))

const nextId = (items: { id: number }[]) => Math.max(0, ...items.map(item => item.id)) + 1

function isFailureMode(): boolean {
  return new URLSearchParams(window.location.search).get('demo') === 'error'
}


function request<T>(action: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isFailureMode()) {
        reject(new ApiError(503, 'Сервер временно недоступен. Попробуйте позже.'))
        return
      }
      try {
        resolve(structuredClone(action()))
      } catch (error) {
        reject(error)
      }
    }, LATENCY_MS)
  })
}

const MAX_AMOUNT = 9_999_999_999.99
const hasMoreThanTwoDecimals = (value: number) => Math.round(value * 100) / 100 !== value

function validationError(fieldErrors: Record<string, string>): never {
  throw new ApiError(422, 'Некорректные данные запроса', fieldErrors)
}

function checkCategory(input: CategoryInput, excludeId?: number) {
  const errors: Record<string, string> = {}
  const name = input.name.trim()

  if (!name) errors.name = 'Значение не может быть пустым'
  else if (name.length > 100) errors.name = 'Максимальная длина: 100 символов'
  if (!/^#[0-9A-Fa-f]{6}$/.test(input.color)) errors.color = 'Значение имеет неверный формат'
  if (input.limit !== null) {
    if (input.type === 'income') errors.limit = 'Лимит можно задать только для категории расходов'
    else if (!(input.limit > 0)) errors.limit = 'Значение должно быть больше 0'
    else if (hasMoreThanTwoDecimals(input.limit)) errors.limit = 'Не больше 2 знаков после запятой'
  }
  if (Object.keys(errors).length > 0) validationError(errors)

  const taken = categories.some(
    c => c.id !== excludeId && c.name.toLowerCase() === name.toLowerCase(),
  )
  if (taken) throw new ApiError(409, `Категория «${name}» уже существует`, { name: 'Такая категория уже есть' })
}

function checkTransaction(input: TransactionInput): Category {
  const errors: Record<string, string> = {}
  if (!(input.amount > 0)) errors.amount = 'Значение должно быть больше 0'
  else if (hasMoreThanTwoDecimals(input.amount)) errors.amount = 'Не больше 2 знаков после запятой'
  else if (input.amount > MAX_AMOUNT) errors.amount = 'Слишком большое число'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || Number.isNaN(Date.parse(input.date))) {
    errors.date = 'Неверная дата, нужен формат ГГГГ-ММ-ДД'
  }
  if ((input.comment ?? '').length > 255) errors.comment = 'Максимальная длина: 255 символов'
  if (Object.keys(errors).length > 0) validationError(errors)

  const category = categories.find(c => c.id === input.categoryId)
  if (!category) {
    throw new ApiError(422, `Категория с id=${input.categoryId} не найдена`, {
      categoryId: 'Категория не найдена',
    })
  }
  return category
}

const categoriesApi: CollectionApi<Category, CategoryInput> = {
  list: () => request(() => categories),

  create: input =>
    request(() => {
      checkCategory(input)
      const category: Category = { ...input, name: input.name.trim(), id: nextId(categories) }
      categories = [...categories, category]
      return category
    }),

  update: (id, input) =>
    request(() => {
      const current = categories.find(c => c.id === id)
      if (!current) throw new ApiError(404, `Категория с id=${id} не найдена`)
      checkCategory(input, id)
      if (input.type !== current.type && transactions.some(t => t.categoryId === id)) {
        throw new ApiError(409, 'Нельзя изменить тип категории, в которой есть операции')
      }
      const updated: Category = { ...input, name: input.name.trim(), id }
      categories = categories.map(c => (c.id === id ? updated : c))
      return updated
    }),

  remove: id =>
    request(() => {
      const current = categories.find(c => c.id === id)
      if (!current) throw new ApiError(404, `Категория с id=${id} не найдена`)
      if (transactions.some(t => t.categoryId === id)) {
        throw new ApiError(409, `Нельзя удалить категорию «${current.name}»: в ней есть операции`)
      }
      categories = categories.filter(c => c.id !== id)
    }),
}

const transactionsApi: CollectionApi<Transaction, TransactionInput> = {
  list: () => request(() => transactions),

  create: input =>
    request(() => {
      const category = checkTransaction(input)
      const transaction: Transaction = {
        ...input,
        comment: input.comment?.trim() || null,
        id: nextId(transactions),
        type: category.type,
      }
      transactions = [...transactions, transaction]
      return transaction
    }),

  update: (id, input) =>
    request(() => {
      const current = transactions.find(t => t.id === id)
      if (!current) throw new ApiError(404, `Операция с id=${id} не найдена`)
      const category = checkTransaction(input)
      if (category.type !== current.type) {
        throw new ApiError(422, 'Нельзя перенести операцию в категорию другого типа', {
          categoryId: 'Выберите категорию того же типа',
        })
      }
      const updated: Transaction = { ...input, comment: input.comment?.trim() || null, id, type: category.type }
      transactions = transactions.map(t => (t.id === id ? updated : t))
      return updated
    }),

  remove: id =>
    request(() => {
      if (!transactions.some(t => t.id === id)) throw new ApiError(404, `Операция с id=${id} не найдена`)
      transactions = transactions.filter(t => t.id !== id)
    }),
}

export const demoServer = { categories: categoriesApi, transactions: transactionsApi }
