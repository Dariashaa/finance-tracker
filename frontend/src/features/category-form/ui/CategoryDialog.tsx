import CheckIcon from '@mui/icons-material/Check'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  FormHelperText,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { useState, type FormEvent } from 'react'
import type { Category, FlowType } from '@/shared/api'
import { parseNumber, useSubmit } from '@/shared/lib'
import { ResponsiveDialog, useNotify } from '@/shared/ui'
import { useCategories } from '@/entities/category'
import { useTransactions } from '@/entities/transaction'
import {
  MAX_NAME,
  validateCategory,
  type CategoryFormErrors,
  type CategoryFormValues,
} from '../model/validate'

const COLORS = [
  '#3F51B5', '#2196F3', '#009688', '#4CAF50', '#8BC34A',
  '#FF9800', '#F44336', '#E91E63', '#9C27B0', '#795548',
]

interface CategoryDialogProps {
  open: boolean
  category: Category | null
  onClose: () => void
}

export function CategoryDialog({ open, category, onClose }: CategoryDialogProps) {
  return (
    <ResponsiveDialog open={open} title={category ? 'Изменить категорию' : 'Новая категория'} onClose={onClose}>
      <CategoryForm category={category} onClose={onClose} />
    </ResponsiveDialog>
  )
}

function CategoryForm({ category, onClose }: { category: Category | null; onClose: () => void }) {
  const isEdit = category !== null
  const { items: categories, create, update } = useCategories()
  const { items: transactions } = useTransactions()
  const notify = useNotify()
  const submit = useSubmit()

  const [values, setValues] = useState<CategoryFormValues>({
    name: category?.name ?? '',
    type: category?.type ?? 'expense',
    color: category?.color ?? COLORS[0],
    limit: category?.limit != null ? String(category.limit) : '',
  })
  const [touched, setTouched] = useState<Partial<Record<keyof CategoryFormValues, boolean>>>({})
  const [attempted, setAttempted] = useState(false)

  const typeLocked = isEdit && transactions.some(t => t.categoryId === category.id)

  const otherNames = categories.filter(c => c.id !== category?.id).map(c => c.name)
  const errors: CategoryFormErrors = validateCategory(values, otherNames)

  const errorOf = (field: keyof CategoryFormValues): string | undefined =>
    (attempted || touched[field] ? errors[field] : undefined) ?? submit.fieldErrors[field]

  const setField = <K extends keyof CategoryFormValues>(field: K, value: CategoryFormValues[K]) => {
    setValues(prev => ({ ...prev, [field]: value }))
    submit.clearFieldError(field)
  }
  const touch = (field: keyof CategoryFormValues) => setTouched(prev => ({ ...prev, [field]: true }))

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setAttempted(true)
    if (Object.keys(errors).length > 0) return

    const input = {
      name: values.name.trim(),
      type: values.type,
      color: values.color,
      limit: values.type === 'expense' && values.limit.trim() !== '' ? parseNumber(values.limit) : null,
    }
    const ok = await submit.run(() => (isEdit ? update(category.id, input) : create(input)))
    if (ok) {
      notify.success(isEdit ? 'Категория изменена' : 'Категория добавлена')
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          <TextField
            label="Название"
            value={values.name}
            onChange={e => setField('name', e.target.value)}
            onBlur={() => touch('name')}
            error={Boolean(errorOf('name'))}
            helperText={errorOf('name') ?? `${values.name.trim().length} / ${MAX_NAME}`}
            required
          />

          <Box>
            <ToggleButtonGroup
              exclusive
              fullWidth
              size="small"
              value={values.type}
              disabled={typeLocked}
              onChange={(_, next: FlowType | null) => next && setField('type', next)}
            >
              <ToggleButton value="expense">Расход</ToggleButton>
              <ToggleButton value="income">Доход</ToggleButton>
            </ToggleButtonGroup>
            {typeLocked && (
              <FormHelperText>Тип нельзя изменить, пока в категории есть операции</FormHelperText>
            )}
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Цвет
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {COLORS.map(color => (
                <Box
                  key={color}
                  component="button"
                  type="button"
                  aria-label={`Цвет ${color}`}
                  aria-pressed={values.color === color}
                  onClick={() => setField('color', color)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: 2,
                    borderColor: values.color === color ? 'text.primary' : 'transparent',
                    bgcolor: color,
                    color: '#fff',
                    cursor: 'pointer',
                    p: 0,
                    display: 'grid',
                    placeItems: 'center',
                    transition: 'transform 0.15s',
                    '&:hover': { transform: 'scale(1.12)' },
                  }}
                >
                  {values.color === color && <CheckIcon sx={{ fontSize: 18 }} />}
                </Box>
              ))}
            </Box>
            {errorOf('color') && <FormHelperText error>{errorOf('color')}</FormHelperText>}
          </Box>

          {values.type === 'expense' && (
            <TextField
              label="Месячный лимит (необязательно)"
              value={values.limit}
              onChange={e => setField('limit', e.target.value)}
              onBlur={() => touch('limit')}
              error={Boolean(errorOf('limit'))}
              helperText={errorOf('limit') ?? 'Покажем, сколько осталось до лимита'}
              slotProps={{
                htmlInput: { inputMode: 'decimal' },
                input: { endAdornment: <InputAdornment position="end">₽</InputAdornment> },
              }}
            />
          )}

          {submit.formError && <Alert severity="error">{submit.formError}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={submit.submitting}>
          Отмена
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={submit.submitting}
          startIcon={submit.submitting ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {isEdit ? 'Сохранить' : 'Добавить'}
        </Button>
      </DialogActions>
    </form>
  )
}
