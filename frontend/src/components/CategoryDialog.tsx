import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material'
import type { Category } from '../types'

// Набор цветов на выбор
const COLORS = [
  '#3F51B5',
  '#2196F3',
  '#009688',
  '#4CAF50',
  '#FF9800',
  '#F44336',
  '#795548',
  '#9C27B0',
]

interface CategoryDialogProps {
  initial: Category | null // null = создание, объект = редактирование
  onSave: (data: Omit<Category, 'id'>) => void
  onClose: () => void
}

function CategoryDialog({ initial, onSave, onClose }: CategoryDialogProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [type, setType] = useState<'income' | 'expense'>(initial?.type ?? 'expense')
  const [color, setColor] = useState(initial?.color ?? COLORS[0])
  const [limit, setLimit] = useState(initial?.limit !== undefined ? String(initial.limit) : '')

  const limitInvalid = limit !== '' && Number(limit) <= 0
  const isValid = name.trim() !== '' && !limitInvalid

  const handleSave = () => {
    if (!isValid) return
    onSave({
      name: name.trim(),
      type,
      color,
      // Лимит бывает только у расходов и только если поле заполнено
      limit: type === 'expense' && limit !== '' ? Number(limit) : undefined,
    })
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{initial ? 'Редактировать категорию' : 'Новая категория'}</DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            label="Название"
            value={name}
            onChange={event => setName(event.target.value)}
            autoFocus
            fullWidth
          />

          {/* Тип нельзя менять у существующей категории: к ней уже привязаны операции */}
          <FormControl disabled={initial !== null}>
            <FormLabel>Тип</FormLabel>
            <RadioGroup
              row
              value={type}
              onChange={event => setType(event.target.value as 'income' | 'expense')}
            >
              <FormControlLabel value="expense" control={<Radio />} label="Расход" />
              <FormControlLabel value="income" control={<Radio />} label="Доход" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel sx={{ mb: 1 }}>Цвет</FormLabel>
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
              {COLORS.map(c => (
                <Box
                  key={c}
                  onClick={() => setColor(c)}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: c,
                    cursor: 'pointer',
                    border: '3px solid',
                    borderColor: color === c ? 'text.primary' : 'transparent',
                  }}
                />
              ))}
            </Stack>
          </FormControl>

          {type === 'expense' && (
            <TextField
              label="Лимит в месяц, ₽ (необязательно)"
              type="number"
              value={limit}
              onChange={event => setLimit(event.target.value)}
              error={limitInvalid}
              helperText={limitInvalid ? 'Лимит должен быть больше нуля' : 'Оставьте пустым, если лимита нет'}
              fullWidth
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Отмена</Button>
        <Button variant="contained" onClick={handleSave} disabled={!isValid}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CategoryDialog