
export type FlowType = 'income' | 'expense'

export interface Category {
  id: number
  name: string
  type: FlowType
  color: string
  limit: number | null
}

export type CategoryInput = Omit<Category, 'id'>

export interface Transaction {
  id: number
  type: FlowType
  amount: number
  date: string
  categoryId: number
  comment: string | null
}

export type TransactionInput = Omit<Transaction, 'id' | 'type'>

export interface CollectionApi<T, TInput> {
  list: () => Promise<T[]>
  create: (input: TInput) => Promise<T>
  update: (id: number, input: TInput) => Promise<T>
  remove: (id: number) => Promise<void>
}
