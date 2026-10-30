import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useState } from 'react'
import type { Category } from '@/shared/api'
import { monthOf, todayIso, type MonthKey } from '@/shared/lib'
import { AnimatedList, EmptyState } from '@/shared/ui'
import { useCategories } from '@/entities/category'
import {
  monthsWithData,
  sumByCategory,
  transactionsOfMonth,
  useTransactions,
} from '@/entities/transaction'
import { CategoryDialog } from '@/features/category-form'
import { DeleteCategoryDialog } from '@/features/delete-category'
import { FinanceDataBoundary } from '@/features/finance-data-boundary'
import { MonthSelect } from '@/features/month-select'
import { BudgetRow } from './BudgetRow'

export function CategoriesPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" component="h1">
        Категории и бюджеты
      </Typography>
      <FinanceDataBoundary>
        <CategoriesContent />
      </FinanceDataBoundary>
    </Stack>
  )
}

function CategoriesContent() {
  const { items: categories } = useCategories()
  const { items: transactions } = useTransactions()

  const [month, setMonth] = useState<MonthKey>(() => monthsWithData(transactions).at(-1) ?? monthOf(todayIso()))
  const [editor, setEditor] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  })
  const [toDelete, setToDelete] = useState<Category | null>(null)

  const sums = sumByCategory(transactionsOfMonth(transactions, month))

  const sections = [
    { title: 'Расходы и бюджеты', type: 'expense' as const },
    { title: 'Доходы', type: 'income' as const },
  ]

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <MonthSelect month={month} onChange={setMonth} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEditor({ open: true, category: null })}>
          Добавить категорию
        </Button>
      </Box>

      <Grid container spacing={2}>
        {sections.map(section => {
          const items = categories.filter(c => c.type === section.type)
          return (
            <Grid key={section.type} size={{ xs: 12, md: 6 }}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {section.title}
                  </Typography>
                  {items.length === 0 ? (
                    <EmptyState
                      title="Категорий пока нет"
                      hint="Добавьте первую, чтобы появились операции этого типа"
                    />
                  ) : (
                    <AnimatedList
                      items={items}
                      getKey={c => c.id}
                      renderItem={c => (
                        <BudgetRow
                          category={c}
                          amount={sums.get(c.id) ?? 0}
                          onEdit={category => setEditor({ open: true, category })}
                          onDelete={setToDelete}
                        />
                      )}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <CategoryDialog
        open={editor.open}
        category={editor.category}
        onClose={() => setEditor(prev => ({ ...prev, open: false }))}
      />
      <DeleteCategoryDialog category={toDelete} onClose={() => setToDelete(null)} />
    </Stack>
  )
}
