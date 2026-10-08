import { Button, Divider, Paper, Stack, Typography } from '@mui/material'
import type { Category, Transaction } from '../types'
import TransactionRow from './TransactionRow'

interface TransactionListProps {
  title: string
  items: Transaction[]
  categories: Category[]
  total: number
  totalColor: string
}

function TransactionList({ title, items, categories, total, totalColor }: TransactionListProps) {
  const sortedItems = [...items].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <Paper sx={{ p: 2, flex: 1 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Stack>
          <Typography variant="h6">{title}</Typography>
          <Typography sx={{ fontWeight: 'bold', color: totalColor }}>
            {total.toLocaleString('ru-RU')} ₽
          </Typography>
        </Stack>
        <Button variant="contained" size="small">
          + Добавить
        </Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={1.5}>
        {sortedItems.length === 0 && (
          <Typography sx={{ color: 'text.secondary' }}>Нет операций за этот месяц</Typography>
        )}

        {sortedItems.map(item => {
          const category = categories.find(c => c.id === item.categoryId)
          if (!category) return null
          return <TransactionRow key={item.id} transaction={item} category={category} />
        })}
      </Stack>
    </Paper>
  )
}

export default TransactionList
