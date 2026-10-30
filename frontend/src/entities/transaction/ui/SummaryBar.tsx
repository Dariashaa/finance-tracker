import { Card, CardContent, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { formatMoney } from '@/shared/lib'
import type { Totals } from '../model/finance'

export function SummaryBar({ totals }: { totals: Totals }) {
  const items = [
    { label: 'Доходы', value: totals.income, color: 'success.main' },
    { label: 'Расходы', value: totals.expense, color: 'error.main' },
    { label: 'Баланс', value: totals.balance, color: totals.balance < 0 ? 'error.main' : 'text.primary' },
  ]
  return (
    <Grid container spacing={2}>
      {items.map(item => (
        <Grid key={item.label} size={{ xs: 12, sm: 4 }}>
          <Card variant="outlined">
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="caption" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="h6" sx={{ color: item.color }}>
                {formatMoney(item.value)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
