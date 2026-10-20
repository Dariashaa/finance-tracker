import { useState } from 'react'
import { MenuItem, Paper, Select, Stack, Typography } from '@mui/material'
import { useData } from '../context/dataContext'
import TransactionList from '../components/TransactionList'
import TransactionDialog from '../components/TransactionDialog'
import { getMonths, monthLabel, sumAmounts } from '../utils/finance'
import type { Transaction } from '../types'


type DialogState = { type: 'income' | 'expense'; transaction: Transaction | null } | null

function HomePage() {
  const { categories, transactions, addTransaction, updateTransaction, deleteTransaction } =
    useData()

  const months = getMonths(transactions)
  const [selectedMonth, setSelectedMonth] = useState(months[0] ?? '')

  const month = months.includes(selectedMonth) ? selectedMonth : (months[0] ?? '')

  const [dialog, setDialog] = useState<DialogState>(null)

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

  const handleSave = (data: Omit<Transaction, 'id'>) => {
    if (dialog?.transaction) {
      updateTransaction({ ...data, id: dialog.transaction.id })
    } else {
      addTransaction(data)
    }
    setSelectedMonth(data.date.slice(0, 7))
    setDialog(null)
  }

  const handleDelete = () => {
    if (dialog?.transaction) deleteTransaction(dialog.transaction.id)
    setDialog(null)
  }

  const defaultDate = `${month || new Date().toISOString().slice(0, 7)}-01`

  return (
    <Stack spacing={3} sx={{ py: 3 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5">Операции</Typography>
        <Select size="small" value={month} onChange={event => setSelectedMonth(event.target.value)}>
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
          onAdd={() => setDialog({ type: 'expense', transaction: null })}
          onEdit={transaction => setDialog({ type: 'expense', transaction })}
        />
        <TransactionList
          title="Доходы"
          items={monthIncomes}
          categories={categories}
          total={totalIncomes}
          totalColor="success.main"
          onAdd={() => setDialog({ type: 'income', transaction: null })}
          onEdit={transaction => setDialog({ type: 'income', transaction })}
        />
      </Stack>

      {dialog && (
        <TransactionDialog
          type={dialog.type}
          initial={dialog.transaction}
          defaultDate={defaultDate}
          categories={categories}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setDialog(null)}
        />
      )}
    </Stack>
  )
}

export default HomePage