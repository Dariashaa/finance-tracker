import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import type { Category, Transaction } from '../types'

interface TransactionDialogProps {
  type: 'income' | 'expense' // 
  initial: Transaction | null 
  defaultDate: string 
  categories: Category[]
  onSave: (data: Omit<Transaction, 'id'>) => void
  onDelete: () => void
  onClose: () => void
}

function TransactionDialog({
  type,
  initial,
  defaultDate,
  categories,
  onSave,
  onDelete,
  onClose,
}: TransactionDialogProps) {

  const [amount, setAmount] = useState(initial ? String(initial.amount) : '')
  const [date, setDate] = useState(initial?.date ?? defaultDate)
  const [categoryId, setCategoryId] = useState<number | ''>(initial?.categoryId ?? '')
  const [comment, setComment] = useState(initial?.comment ?? '')

  const availableCategories = categories.filter(c => c.type === type)

  const isValid = Number(amount) > 0 && date !== '' && categoryId !== ''

  const handleSave = () => {
    if (!isValid || categoryId === '') return
    onSave({
      type,
      amount: Number(amount),
      date,
      categoryId,
      comment: comment.trim() === '' ? undefined : comment.trim(),
    })
  }

  const typeName = type === 'expense' ? 'расход' : 'доход'

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {initial ? `Редактировать ${typeName}` : `Новый ${typeName}`}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Сумма, ₽"
            type="number"
            value={amount}
            onChange={event => setAmount(event.target.value)}
            error={amount !== '' && Number(amount) <= 0}
            helperText={amount !== '' && Number(amount) <= 0 ? 'Сумма должна быть больше нуля' : ''}
            autoFocus
            fullWidth
          />
          <TextField
            label="Дата"
            type="date"
            value={date}
            onChange={event => setDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
          <TextField
            select
            label="Категория"
            value={categoryId}
            onChange={event => setCategoryId(Number(event.target.value))}
            fullWidth
          >
            {availableCategories.map(c => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Комментарий (необязательно)"
            value={comment}
            onChange={event => setComment(event.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {initial && (
          <Button color="error" onClick={onDelete} sx={{ mr: 'auto' }}>
            Удалить
          </Button>
        )}
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSave} disabled={!isValid}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TransactionDialog