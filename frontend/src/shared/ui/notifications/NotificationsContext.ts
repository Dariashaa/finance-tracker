import { createContext, useContext } from 'react'

export interface Notify {
  success: (message: string) => void
  error: (message: string) => void
}

export const NotificationsContext = createContext<Notify | null>(null)

export function useNotify(): Notify {
  const value = useContext(NotificationsContext)
  if (!value) throw new Error('useNotify нужно вызывать внутри NotificationsProvider')
  return value
}
