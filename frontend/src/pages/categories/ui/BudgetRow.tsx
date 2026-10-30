import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Box, IconButton, LinearProgress, Tooltip, Typography } from '@mui/material'
import type { Category } from '@/shared/api'
import { formatMoney } from '@/shared/lib'
import { CategoryChip } from '@/entities/category'

interface BudgetRowProps {
  category: Category
  amount: number
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function BudgetRow({ category, amount, onEdit, onDelete }: BudgetRowProps) {
  const { limit } = category
  const hasLimit = limit !== null
  const share = hasLimit ? amount / limit : 0
  const exceeded = hasLimit && amount > limit
  const color = exceeded ? 'error' : share >= 0.8 ? 'warning' : 'primary'

  let caption = formatMoney(amount)
  if (hasLimit) {
    caption += exceeded
      ? ` из ${formatMoney(limit)} · превышение на ${formatMoney(Math.round((amount - limit) * 100) / 100)}`
      : ` из ${formatMoney(limit)} · осталось ${formatMoney(Math.round((limit - amount) * 100) / 100)}`
  }

  return (
    <Box sx={{ py: 1.25, borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <CategoryChip category={category} />
          <Typography
            variant="caption"
            component="div"
            sx={{ color: exceeded ? 'error.main' : 'text.secondary' }}
          >
            {caption}
          </Typography>
        </Box>
        <Tooltip title="Изменить">
          <IconButton size="small" aria-label={`Изменить ${category.name}`} onClick={() => onEdit(category)}>
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Удалить">
          <IconButton size="small" aria-label={`Удалить ${category.name}`} onClick={() => onDelete(category)}>
            <DeleteOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      {hasLimit && (
        <LinearProgress
          variant="determinate"
          value={Math.min(share * 100, 100)}
          color={color}
          aria-label={`Использовано ${Math.round(share * 100)}% лимита`}
          sx={{ mt: 0.75, height: 6, borderRadius: 3, '& .MuiLinearProgress-bar': { transition: 'transform 0.6s ease' } }}
        />
      )}
    </Box>
  )
}
