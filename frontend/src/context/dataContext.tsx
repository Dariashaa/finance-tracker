import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import {
  categories as initialCategories,
  transactions as initialTransactions,
} from '../data/demoData'
import type { Category, Transaction } from '../types'

interface DataContextValue {
  categories: Category[]
  transactions: Transaction[]
  addTransaction: (data: Omit<Transaction, 'id'>) => void
  updateTransaction: (transaction: Transaction) => void
  deleteTransaction: (id: number) => void
  addCategory: (data: Omit<Category, 'id'>) => void
  updateCategory: (category: Category) => void
  deleteCategory: (id: number) => void
}

const DataContext = createContext<DataContextValue | null>(null)

const nextId = (items: { id: number }[]) => Math.max(0, ...items.map(item => item.id)) + 1

export function DataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)

  const value: DataContextValue = {
    categories,
    transactions,
    addTransaction: data =>
      setTransactions(prev => [...prev, { ...data, id: nextId(prev) }]),
    updateTransaction: transaction =>
      setTransactions(prev => prev.map(t => (t.id === transaction.id ? transaction : t))),
    deleteTransaction: id => setTransactions(prev => prev.filter(t => t.id !== id)),
    addCategory: data => setCategories(prev => [...prev, { ...data, id: nextId(prev) }]),
    updateCategory: category =>
      setCategories(prev => prev.map(c => (c.id === category.id ? category : c))),
    deleteCategory: id => setCategories(prev => prev.filter(c => c.id !== id)),
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData нужно вызывать внутри DataProvider')
  return context
}