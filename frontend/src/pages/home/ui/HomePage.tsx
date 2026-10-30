import { Box, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import type { FlowType, Transaction } from '@/shared/api'
import { monthOf, todayIso, type MonthKey } from '@/shared/lib'
import { useCategories } from '@/entities/category'
import {
  calcTotals,
  monthsWithData,
  SummaryBar,
  transactionsOfMonth,
  useTransactions,
} from '@/entities/transaction'
import { DeleteTransactionDialog } from '@/features/delete-transaction'
import { ExportCsvButton } from '@/features/export-csv'
import { FinanceDataBoundary } from '@/features/finance-data-boundary'
import { MonthSelect } from '@/features/month-select'
import { TransactionDialog } from '@/features/transaction-form'
import { TransactionColumn } from './TransactionColumn'

export function HomePage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h1">
        Операции
      </Typography>
      <FinanceDataBoundary>
        <HomeContent />
      </FinanceDataBoundary>
    </Stack>
  )
}

interface EditorState {
  open: boolean
  transaction: Transaction | null
  type: FlowType
}

function HomeContent() {
  const { items: categories } = useCategories()
  const { items: transactions } = useTransactions()

  const [month, setMonth] = useState<MonthKey>(() => monthsWithData(transactions).at(-1) ?? monthOf(todayIso()))
  const [editor, setEditor] = useState<EditorState>({ open: false, transaction: null, type: 'expense' })
  const [toDelete, setToDelete] = useState<Transaction | null>(null)

  const monthItems = transactionsOfMonth(transactions, month)
  const totals = calcTotals(monthItems)

  const openCreate = (type: FlowType) => setEditor({ open: true, transaction: null, type })
  const openEdit = (transaction: Transaction) =>
    setEditor({ open: true, transaction, type: transaction.type })

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <MonthSelect month={month} onChange={setMonth} />
        <ExportCsvButton transactions={monthItems} categories={categories} fileSuffix={month} />
      </Box>

      <SummaryBar totals={totals} />

      <Grid container spacing={2}>
        {(['expense', 'income'] as const).map(type => (
          <Grid key={type} size={{ xs: 12, md: 6 }}>
            <TransactionColumn
              type={type}
              transactions={monthItems.filter(t => t.type === type)}
              categories={categories}
              onAdd={openCreate}
              onEdit={openEdit}
              onDelete={setToDelete}
            />
          </Grid>
        ))}
      </Grid>

      <TransactionDialog
        open={editor.open}
        transaction={editor.transaction}
        defaultType={editor.type}
        onClose={() => setEditor(prev => ({ ...prev, open: false }))}
      />
      <DeleteTransactionDialog transaction={toDelete} onClose={() => setToDelete(null)} />
    </Stack>
  )
}
