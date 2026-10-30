import type { ReactNode } from 'react'
import { ErrorState, LoadingState } from '@/shared/ui'
import { useCategories } from '@/entities/category'
import { useTransactions } from '@/entities/transaction'


export function FinanceDataBoundary({ children }: { children: ReactNode }) {
  const categories = useCategories()
  const transactions = useTransactions()

  if (categories.status === 'error' || transactions.status === 'error') {
    const message = categories.error ?? transactions.error ?? 'Не удалось загрузить данные'
    const retry = () => {
      if (categories.status === 'error') categories.reload()
      if (transactions.status === 'error') transactions.reload()
    }
    return <ErrorState message={message} onRetry={retry} />
  }

  if (categories.status === 'loading' || transactions.status === 'loading') {
    return <LoadingState rows={5} />
  }

  return <>{children}</>
}
