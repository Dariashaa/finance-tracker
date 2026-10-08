import { useState } from 'react'
import { Button, Divider, MenuItem, Paper, Select, Stack, Typography } from '@mui/material'
import { categories, transactions } from '../data/demoData'
import BudgetRow from '../components/BudgetRow'
import { months, monthLabel, sumAmounts } from '../utils/finance'

function CategoriesPage() {
  const [month, setMonth] = useState(months[0])

  const spentByCategory = (categoryId: number) =>
    sumAmounts(
      transactions.filter(t => t.categoryId === categoryId && t.date.startsWith(month))
    )

  const expenseCategories = categories.filter(c => c.type === 'expense')
  const incomeCategories = categories.filter(c => c.type === 'income')

  return (
    <Stack spacing={3} sx={{ py: 3 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Категории и бюджеты</Typography>
        <Stack direction="row" spacing={2}>
          <Select size="small" value={month} onChange={event => setMonth(event.target.value)}>
            {months.map(m => (
              <MenuItem key={m} value={m}>
                {monthLabel(m)}
              </MenuItem>
            ))}
          </Select>
          <Button variant="contained">+ Новая категория</Button>
        </Stack>
      </Stack>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Расходы
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2.5}>
          {expenseCategories.map(c => (
            <BudgetRow key={c.id} category={c} spent={spentByCategory(c.id)} />
          ))}
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Доходы
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={2.5}>
          {incomeCategories.map(c => (
            <BudgetRow key={c.id} category={c} spent={spentByCategory(c.id)} />
          ))}
        </Stack>
      </Paper>
    </Stack>
  )
}

export default CategoriesPage
