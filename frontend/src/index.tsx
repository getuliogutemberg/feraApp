import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "./context/AuthContext.tsx";
import './index.css'
import App from './App.tsx'
import { createTheme, ThemeProvider } from '@mui/material';





const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: "rgba(16, 28, 68, 1)" } ,
    secondary: { main: 'rgba(49, 131, 207, 1)' } ,
    background: {
      default: "#FFF" ,
      paper: "#F5F5F5" ,
    },
  },
  
});



createRoot(document.getElementById('root')!).render(
  <AuthProvider>
  <StrictMode>
    <ThemeProvider theme={theme}>
    <App />
    </ThemeProvider>
  </StrictMode>
  </AuthProvider>,
)
