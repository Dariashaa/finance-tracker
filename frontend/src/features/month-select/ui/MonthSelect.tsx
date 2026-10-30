import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { Box, IconButton, Typography } from '@mui/material'
import { monthLabel, shiftMonth, type MonthKey } from '@/shared/lib'

interface MonthSelectProps {
  month: MonthKey
  onChange: (month: MonthKey) => void
}

export function MonthSelect({ month, onChange }: MonthSelectProps) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
      <IconButton aria-label="Предыдущий месяц" onClick={() => onChange(shiftMonth(month, -1))}>
        <ChevronLeftIcon />
      </IconButton>
      <Typography variant="h6" sx={{ minWidth: 150, textAlign: 'center' }} aria-live="polite">
        {monthLabel(month)}
      </Typography>
      <IconButton aria-label="Следующий месяц" onClick={() => onChange(shiftMonth(month, 1))}>
        <ChevronRightIcon />
      </IconButton>
    </Box>
  )
}
