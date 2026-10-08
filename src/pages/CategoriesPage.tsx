import { useState } from 'react'
import {
  Alert,
  Button,
  Divider,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material'
import { useData } from '../context/dataContext'
import BudgetRow from '../components/BudgetRow'
import CategoryDialog from '../components/CategoryDialog'
import { getMonths, monthLabel, sumAmounts } from '../utils/finance'
import type { Category } from '../types'

function CategoriesPage() {
  const { categories, transactions, addCategory, updateCategory, deleteCategory } = useData()

  const months = getMonths(transactions)
  const [selectedMonth, setSelectedMonth] = useState(months[0] ?? '')
  const month = months.includes(selectedMonth) ? selectedMonth : (months[0] ?? '')

  const [editing, setEditing] = useState<Category | 'new' | null>(null)
  const [message, setMessage] = useState('')

  const spentByCategory = (categoryId: number) =>
    sumAmounts(
      transactions.filter(t => t.categoryId === categoryId && t.date.startsWith(month))
    )

  const expenseCategories = categories.filter(c => c.type === 'expense')
  const incomeCategories = categories.filter(c => c.type === 'income')

  const handleSave = (data: Omit<Category, 'id'>) => {
    if (editing && editing !== 'new') {
      updateCategory({ ...data, id: editing.id })
    } else {
      addCategory(data)
    }
    setEditing(null)
  }

  const handleDelete = (category: Category) => {
    if (transactions.some(t => t.categoryId === category.id)) {
      setMessage(`Нельзя удалить «${category.name}»: в ней есть операции`)
      return
    }
    if (window.confirm(`Удалить категорию «${category.name}»?`)) {
      deleteCategory(category.id)
    }
  }

  const renderGroup = (title: string, items: Category[]) => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={2.5}>
        {items.length === 0 && (
          <Typography sx={{ color: 'text.secondary' }}>Категорий пока нет</Typography>
        )}
        {items.map(c => (
          <BudgetRow
            key={c.id}
            category={c}
            spent={spentByCategory(c.id)}
            onEdit={() => setEditing(c)}
            onDelete={() => handleDelete(c)}
          />
        ))}
      </Stack>
    </Paper>
  )

  return (
    <Stack spacing={3} sx={{ py: 3 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Категории и бюджеты</Typography>
        <Stack direction="row" spacing={2}>
          <Select size="small" value={month} onChange={event => setSelectedMonth(event.target.value)}>
            {months.map(m => (
              <MenuItem key={m} value={m}>
                {monthLabel(m)}
              </MenuItem>
            ))}
          </Select>
          <Button variant="contained" onClick={() => setEditing('new')}>
            + Новая категория
          </Button>
        </Stack>
      </Stack>

      {renderGroup('Расходы', expenseCategories)}
      {renderGroup('Доходы', incomeCategories)}

      {editing !== null && (
        <CategoryDialog
          initial={editing === 'new' ? null : editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      <Snackbar
        open={message !== ''}
        autoHideDuration={4000}
        onClose={() => setMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="warning" onClose={() => setMessage('')}>
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  )
}

export default CategoriesPage