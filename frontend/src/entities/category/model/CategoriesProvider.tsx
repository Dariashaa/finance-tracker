import type { ReactNode } from 'react'
import { api } from '@/shared/api'
import { useCollection } from '@/shared/lib'
import { CategoriesContext } from './CategoriesContext'

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const store = useCollection(api.categories)
  return <CategoriesContext.Provider value={store}>{children}</CategoriesContext.Provider>
}
