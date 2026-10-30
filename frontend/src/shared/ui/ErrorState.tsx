import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined'
import { Alert, Button } from '@mui/material'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Alert
      severity="error"
      icon={<ErrorOutlinedIcon />}
      action={
        onRetry && (
          <Button color="inherit" size="small" onClick={onRetry}>
            Повторить
          </Button>
        )
      }
    >
      {message}
    </Alert>
  )
}
