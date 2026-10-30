import CloseIcon from '@mui/icons-material/Close'
import { Dialog, DialogTitle, IconButton, useMediaQuery, useTheme } from '@mui/material'
import type { ReactNode } from 'react'

interface ResponsiveDialogProps {
  open: boolean
  title: string
  busy?: boolean
  onClose: () => void
  children: ReactNode
}

export function ResponsiveDialog({ open, title, busy = false, onClose, children }: ResponsiveDialogProps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullScreen={fullScreen}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ pr: 7 }}>
        {title}
        <IconButton
          aria-label="Закрыть"
          onClick={onClose}
          disabled={busy}
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {children}
    </Dialog>
  )
}
