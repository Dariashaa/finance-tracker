import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  hint?: string
  action?: ReactNode
}

export function EmptyState({ title, hint, action }: EmptyStateProps) {
  return (
    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
      <InboxOutlinedIcon sx={{ fontSize: 48, opacity: 0.5 }} />
      <Typography variant="subtitle1" color="text.primary">
        {title}
      </Typography>
      {hint && <Typography variant="body2">{hint}</Typography>}
      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Box>
  )
}
