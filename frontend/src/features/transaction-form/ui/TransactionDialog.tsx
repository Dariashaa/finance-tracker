import {
  Alert,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import { useState, type FormEvent } from 'react'
import type { FlowType, Transaction } from '@/shared/api'
import { parseNumber, todayIso, useSubmit } from '@/shared/lib'
import { ResponsiveDialog, useNotify } from '@/shared/ui'
import { CategoryChip, useCategories } from '@/entities/category'
import { useTransactions } from '@/entities/transaction'
import {
  MAX_COMMENT,
  validateTransaction,
  type TransactionFormErrors,
  type TransactionFormValues,
} from '../model/validate'

interface TransactionDialogProps {
  open: boolean
  transaction: Transaction | null
  defaultType: FlowType
  onClose: () => void
}

export function TransactionDialog({ open, transaction, defaultType, onClose }: TransactionDialogProps) {
  const isEdit = transaction !== null
  const title = isEdit ? 'Изменить операцию' : 'Новая операция'

  return (
    <ResponsiveDialog open={open} title={title} onClose={onClose}>
      <TransactionForm transaction={transaction} defaultType={defaultType} onClose={onClose} />
    </ResponsiveDialog>
  )
}

interface FormProps {
  transaction: Transaction | null
  defaultType: FlowType
  onClose: () => void
}

function TransactionForm({ transaction, defaultType, onClose }: FormProps) {
  const isEdit = transaction !== null
  const { items: categories } = useCategories()
  const { create, update } = useTransactions()
  const notify = useNotify()
  const submit = useSubmit()

  const [type, setType] = useState<FlowType>(transaction?.type ?? defaultType)
  const [values, setValues] = useState<TransactionFormValues>({
    amount: transaction ? String(transaction.amount) : '',
    date: transaction?.date ?? todayIso(),
    categoryId: transaction?.categoryId ?? '',
    comment: transaction?.comment ?? '',
  })
  const [touched, setTouched] = useState<Partial<Record<keyof TransactionFormValues, boolean>>>({})
  const [attempted, setAttempted] = useState(false)

  const availableCategories = categories.filter(c => c.type === type)
  const errors: TransactionFormErrors = validateTransaction(values)

  const errorOf = (field: keyof TransactionFormValues): string | undefined =>
    (attempted || touched[field] ? errors[field] : undefined) ?? submit.fieldErrors[field]

  const setField = <K extends keyof TransactionFormValues>(field: K, value: TransactionFormValues[K]) => {
    setValues(prev => ({ ...prev, [field]: value }))
    submit.clearFieldError(field)
  }
  const touch = (field: keyof TransactionFormValues) => setTouched(prev => ({ ...prev, [field]: true }))

  const changeType = (next: FlowType) => {
    setType(next)
    setValues(prev => ({ ...prev, categoryId: '' }))
    setTouched(prev => ({ ...prev, categoryId: false }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setAttempted(true)
    if (Object.keys(errors).length > 0 || values.categoryId === '') return

    const input = {
      amount: parseNumber(values.amount),
      date: values.date,
      categoryId: values.categoryId,
      comment: values.comment.trim() || null,
    }
    const ok = await submit.run(() => (isEdit ? update(transaction.id, input) : create(input)))
    if (ok) {
      notify.success(isEdit ? 'Операция изменена' : 'Операция добавлена')
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            value={type}
            disabled={isEdit}
            onChange={(_, next: FlowType | null) => next && changeType(next)}
          >
            <ToggleButton value="expense">Расход</ToggleButton>
            <ToggleButton value="income">Доход</ToggleButton>
          </ToggleButtonGroup>

          <TextField
            label="Сумма, ₽"
            value={values.amount}
            onChange={e => setField('amount', e.target.value)}
            onBlur={() => touch('amount')}
            error={Boolean(errorOf('amount'))}
            helperText={errorOf('amount')}
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
            required
          />

          <TextField
            select
            label="Категория"
            value={values.categoryId}
            onChange={e => setField('categoryId', Number(e.target.value))}
            onBlur={() => touch('categoryId')}
            error={Boolean(errorOf('categoryId'))}
            helperText={
              errorOf('categoryId') ??
              (availableCategories.length === 0 ? 'Сначала создайте категорию этого типа' : undefined)
            }
            required
          >
            {availableCategories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                <CategoryChip category={category} />
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="date"
            label="Дата"
            value={values.date}
            onChange={e => setField('date', e.target.value)}
            onBlur={() => touch('date')}
            error={Boolean(errorOf('date'))}
            helperText={errorOf('date')}
            slotProps={{ inputLabel: { shrink: true } }}
            required
          />

          <TextField
            label="Комментарий"
            value={values.comment}
            onChange={e => setField('comment', e.target.value)}
            onBlur={() => touch('comment')}
            error={Boolean(errorOf('comment'))}
            helperText={errorOf('comment') ?? `${values.comment.length} / ${MAX_COMMENT}`}
            multiline
            minRows={2}
          />

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
