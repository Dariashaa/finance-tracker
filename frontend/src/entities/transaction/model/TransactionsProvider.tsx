import type { ReactNode } from 'react'
import { api } from '@/shared/api'
import { useCollection } from '@/shared/lib'
import { TransactionsContext } from './TransactionsContext'

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const store = useCollection(api.transactions)
  return <TransactionsContext.Provider value={store}>{children}</TransactionsContext.Provider>
}
