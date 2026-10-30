import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'
import type { Category, FlowType, Transaction } from '@/shared/api'
import { formatMoney } from '@/shared/lib'
import { AnimatedList, EmptyState } from '@/shared/ui'
import { TransactionRow } from '@/entities/transaction'

interface TransactionColumnProps {
  type: FlowType
  transactions: Transaction[]
  categories: Category[]
  onAdd: (type: FlowType) => void
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

const TEXT = {
  expense: { title: 'Расходы', empty: 'Расходов за месяц нет', add: 'Добавить расход' },
  income: { title: 'Доходы', empty: 'Доходов за месяц нет', add: 'Добавить доход' },
}

export function TransactionColumn({
  type,
  transactions,
  categories,
  onAdd,
  onEdit,
  onDelete,
}: TransactionColumnProps) {
  const text = TEXT[type]
  const total = transactions.reduce((sum, t) => sum + t.amount, 0)
  const categoryById = new Map(categories.map(c => [c.id, c]))

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, gap: 1 }}>
          <Box>
            <Typography variant="h6">{text.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatMoney(Math.round(total * 100) / 100)}
            </Typography>
          </Box>
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => onAdd(type)}>
            {text.add}
          </Button>
        </Box>

        {transactions.length === 0 ? (
          <EmptyState title={text.empty} hint="Нажмите кнопку выше, чтобы добавить первую запись" />
        ) : (
          <AnimatedList
            items={transactions}
            getKey={t => t.id}
            renderItem={t => (
              <TransactionRow
                transaction={t}
                category={categoryById.get(t.categoryId)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          />
        )}
      </CardContent>
    </Card>
  )
}
