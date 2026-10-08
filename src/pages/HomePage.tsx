import { useState } from 'react'
import { MenuItem, Paper, Select, Stack, Typography } from '@mui/material'
import { categories, transactions } from '../data/demoData'
import type { Transaction } from '../types'
import TransactionList from '../components/TransactionList'

const sumAmounts = (items: Transaction[]) =>
  items.reduce((sum, item) => sum + item.amount, 0)


const months = Array.from(new Set(transactions.map(item => item.date.slice(0, 7))))
  .sort()
  .reverse()


const monthLabel = (month: string) =>
  new Date(month + '-01').toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })

function HomePage() {
  const [month, setMonth] = useState(months[0])

  const monthExpenses = transactions.filter(
    item => item.type === 'expense' && item.date.startsWith(month)
  )
  const monthIncomes = transactions.filter(
    item => item.type === 'income' && item.date.startsWith(month)
  )

  const totalExpenses = sumAmounts(monthExpenses)
  const totalIncomes = sumAmounts(monthIncomes)
  const balance = totalIncomes - totalExpenses

  const summary = [
    { label: 'Доходы', value: totalIncomes, color: 'success.main' },
    { label: 'Расходы', value: totalExpenses, color: 'error.main' },
    { label: 'Баланс', value: balance, color: balance >= 0 ? 'success.main' : 'error.main' },
  ]

  return (
    <Stack spacing={3} sx={{ py: 3 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Операции</Typography>
        <Select size="small" value={month} onChange={event => setMonth(event.target.value)}>
          {months.map(m => (
            <MenuItem key={m} value={m}>
              {monthLabel(m)}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {summary.map(card => (
          <Paper key={card.label} sx={{ p: 2, flex: 1 }}>
            <Typography sx={{ color: 'text.secondary' }}>{card.label}</Typography>
            <Typography variant="h6" sx={{ color: card.color, fontWeight: 'bold' }}>
              {card.value.toLocaleString('ru-RU')} ₽
            </Typography>
          </Paper>
        ))}
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: 'flex-start' }}>
        <TransactionList
          title="Расходы"
          items={monthExpenses}
          categories={categories}
          total={totalExpenses}
          totalColor="error.main"
        />
        <TransactionList
          title="Доходы"
          items={monthIncomes}
          categories={categories}
          total={totalIncomes}
          totalColor="success.main"
        />
      </Stack>
    </Stack>
  )
}

export default HomePage
