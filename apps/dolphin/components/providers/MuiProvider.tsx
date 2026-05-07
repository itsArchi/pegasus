'use client'

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { red } from '@mui/material/colors'

const theme = createTheme({
  palette: {
    primary: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    secondary: { main: '#ffffff', contrastText: '#dc2626' },
    error: { main: red[700] },
    background: { default: '#f9fafb', paper: '#ffffff' },
    text: { primary: '#111827', secondary: '#6b7280' },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 8,
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(220,38,38,0.3)',
          '&:hover': { boxShadow: '0 6px 20px 0 rgba(220,38,38,0.4)' },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: '#dc2626',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 700, borderRadius: 6 } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
  },
})

export default function MuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
