import { createTheme } from '@mui/material'

export const theme = createTheme({
  palette: {
    primary: { main: '#3F51B5' },
    success: { main: '#2E7D32' },
    error: { main: '#D32F2F' },
    background: { default: '#F5F6FA' },
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: 'Roboto, "Segoe UI", system-ui, sans-serif' },
})
