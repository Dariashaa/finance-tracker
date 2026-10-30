import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import type { Category, Transaction } from '@/shared/api'
import { formatDay, formatMoney } from '@/shared/lib'
import { CategoryChip } from '@/entities/category'

interface TransactionRowProps {
  transaction: Transaction
  category: Category | undefined
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transaction: Transaction) => void
}

export function TransactionRow({ transaction, category, onEdit, onDelete }: TransactionRowProps) {
  const isIncome = transaction.type === 'income'

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        py: 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {category ? <CategoryChip category={category} /> : <Typography variant="body2">Без категории</Typography>}
        <Typography variant="caption" color="text.secondary" noWrap component="div">
          {formatDay(transaction.date)}
          {transaction.comment ? ` · ${transaction.comment}` : ''}
        </Typography>
      </Box>

      <Typography
        variant="subtitle2"
        sx={{ color: isIncome ? 'success.main' : 'error.main', whiteSpace: 'nowrap' }}
      >
        {isIncome ? '+' : '−'}
        {formatMoney(transaction.amount)}
      </Typography>

      {onEdit && (
        <Tooltip title="Изменить">
          <IconButton size="small" aria-label="Изменить" onClick={() => onEdit(transaction)}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title="Удалить">
          <IconButton size="small" aria-label="Удалить" onClick={() => onDelete(transaction)}>
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}
