import { Alert, Snackbar } from '@mui/material'
import { useMemo, useState, type ReactNode } from 'react'
import { NotificationsContext, type Notify } from './NotificationsContext'

interface Message {
  key: number
  text: string
  severity: 'success' | 'error'
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<Message | null>(null)
  const [open, setOpen] = useState(false)

  const notify = useMemo<Notify>(() => {
    const show = (text: string, severity: Message['severity']) => {
      setMessage({ key: Date.now(), text, severity })
      setOpen(true)
    }
    return {
      success: text => show(text, 'success'),
      error: text => show(text, 'error'),
    }
  }, [])

  return (
    <NotificationsContext.Provider value={notify}>
      {children}
      <Snackbar
        key={message?.key}
        open={open}
        autoHideDuration={4000}
        onClose={(_, reason) => reason !== 'clickaway' && setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={message?.severity ?? 'success'} variant="filled" onClose={() => setOpen(false)}>
          {message?.text}
        </Alert>
      </Snackbar>
    </NotificationsContext.Provider>
  )
}
