import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTheme, CssBaseline, ThemeProvider} from '@mui/material'

const theme = createTheme({
  palette: {
    primary: { main: '#00897B' },
    success: { main: '#2E7D32' },
    error: { main: '#D32F2F' },
  },
})

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <StrictMode>
      <App />
    </StrictMode>,
  </ThemeProvider>
)
