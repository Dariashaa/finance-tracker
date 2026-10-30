import { CssBaseline, ThemeProvider } from '@mui/material'
import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { NotificationsProvider } from '@/shared/ui'
import { CategoriesProvider } from '@/entities/category'
import { TransactionsProvider } from '@/entities/transaction'
import { theme } from './theme'


export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationsProvider>
        <BrowserRouter>
          <CategoriesProvider>
            <TransactionsProvider>{children}</TransactionsProvider>
          </CategoriesProvider>
        </BrowserRouter>
      </NotificationsProvider>
    </ThemeProvider>
  )
}
