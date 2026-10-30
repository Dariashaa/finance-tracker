import { Button, Stack, Typography } from '@mui/material'
import { lazy, Suspense } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'
import { LoadingState } from '@/shared/ui'
import { CategoriesPage } from '@/pages/categories'
import { HomePage } from '@/pages/home'
import { Layout } from '../layout/Layout'

const ReportsPage = lazy(() => import('@/pages/reports').then(m => ({ default: m.ReportsPage })))

function NotFound() {
  return (
    <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
      <Typography variant="h5" component="h1">
        Страница не найдена
      </Typography>
      <Button component={Link} to={ROUTES.home} variant="contained">
        На главную
      </Button>
    </Stack>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.categories} element={<CategoriesPage />} />
        <Route
          path={ROUTES.reports}
          element={
            <Suspense fallback={<LoadingState rows={3} />}>
              <ReportsPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
