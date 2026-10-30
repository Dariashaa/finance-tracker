import { createContext, useContext } from 'react'
import type { Category, CategoryInput } from '@/shared/api'
import type { CollectionState } from '@/shared/lib'

export type CategoriesStore = CollectionState<Category, CategoryInput>

export const CategoriesContext = createContext<CategoriesStore | null>(null)


export function useCategories(): CategoriesStore {
  const value = useContext(CategoriesContext)
  if (!value) throw new Error('useCategories нужно вызывать внутри CategoriesProvider')
  return value
}
