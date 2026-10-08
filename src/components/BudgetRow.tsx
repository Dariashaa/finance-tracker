import { IconButton, LinearProgress, Stack, Typography } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Category } from '../types'

interface BudgetRowProps {
  category: Category
  spent: number 
}


const progressColor = (percent: number) => {
  if (percent > 100) return 'error'
  if (percent >= 70) return 'warning'
  return 'success'
}

function BudgetRow({ category, spent }: BudgetRowProps) {
  const hasLimit = category.type === 'expense' && category.limit !== undefined
  const limit = category.limit ?? 0
  const percent = hasLimit && limit > 0 ? Math.round((spent / limit) * 100) : 0

  return (
    <Stack spacing={0.5}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: category.color,
            flexShrink: 0,
          }}
        />
        <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>{category.name}</Typography>

        {category.type === 'expense' && (
          <Typography sx={{ color: 'text.secondary' }}>
            {hasLimit
              ? `${spent.toLocaleString('ru-RU')} / ${limit.toLocaleString('ru-RU')} ₽`
              : `${spent.toLocaleString('ru-RU')} ₽ · без лимита`}
          </Typography>
        )}

        <IconButton size="small" aria-label="Изменить">
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" aria-label="Удалить">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Stack>

      {hasLimit && (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(percent, 100)}
            color={progressColor(percent)}
            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
          />
          <Typography
            variant="body2"
            sx={{ minWidth: 48, textAlign: 'right', color: percent > 100 ? 'error.main' : 'text.secondary' }}
          >
            {percent}%
          </Typography>
        </Stack>
      )}

      {hasLimit && percent > 100 && (
        <Typography variant="body2" sx={{ color: 'error.main' }}>
          Превышен на {(spent - limit).toLocaleString('ru-RU')} ₽
        </Typography>
      )}
    </Stack>
  )
}

export default BudgetRow
