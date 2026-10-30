import { createContext, useContext } from 'react'
import type { Transaction, TransactionInput } from '@/shared/api'
import type { CollectionState } from '@/shared/lib'

export type TransactionsStore = CollectionState<Transaction, TransactionInput>

export const TransactionsContext = createContext<TransactionsStore | null>(null)

export function useTransactions(): TransactionsStore {
  const value = useContext(TransactionsContext)
  if (!value) throw new Error('useTransactions нужно вызывать внутри TransactionsProvider')
  return value
}
