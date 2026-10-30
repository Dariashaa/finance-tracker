import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import { AppBar, Box, Container, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'

const TABS = [
  { label: 'Операции', to: ROUTES.home },
  { label: 'Категории и бюджеты', to: ROUTES.categories },
  { label: 'Отчёты и экспорт', to: ROUTES.reports },
]

/** Каркас страниц: шапка с навигацией и область содержимого. */
export function Layout() {
  const { pathname } = useLocation()
  // Подсвечиваем вкладку, чей адрес совпал; на неизвестном адресе — ни одной
  const current = TABS.find(tab => tab.to === pathname)?.to ?? false

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="sticky" color="primary" elevation={0}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <AccountBalanceWalletOutlinedIcon />
          <Typography variant="h6" component="span" sx={{ mr: 2 }}>
            Личный финучёт
          </Typography>
          <Tabs
            value={current}
            textColor="inherit"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons={false}
            sx={{ minHeight: 48 }}
          >
            {TABS.map(tab => (
              <Tab key={tab.to} value={tab.to} label={tab.label} component={Link} to={tab.to} />
            ))}
          </Tabs>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* key заставляет анимацию появления запускаться заново при каждой смене страницы */}
        <Box
          key={pathname}
          sx={{
            animation: 'pageIn 0.25s ease-out',
            '@keyframes pageIn': {
              from: { opacity: 0, transform: 'translateY(8px)' },
              to: { opacity: 1, transform: 'none' },
            },
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        >
          <Outlet />
        </Box>
      </Container>
    </Box>
  )
}
