import { createTheme } from '@mui/material/styles';
import { esES } from '@mui/material/locale';

export const chartColors = {
  series: ['#176276', '#259295', '#75a8b9', '#c49a54', '#84949f', '#d5dfe3'],
  track: '#f0f4f5',
  grid: '#e8eef0',
} as const;

export const theme = createTheme({
  palette: {
    primary: { main: '#145c6e' },
    secondary: { main: '#259295' },
    background: { default: '#f3f6f6', paper: '#ffffff' },
    text: { primary: '#1c343e', secondary: '#5b7079' },
    divider: '#dce5e7',
  },
  typography: {
    fontFamily: '"Segoe UI", system-ui, sans-serif',
    h1: { fontSize: '1.8rem', fontWeight: 600, letterSpacing: '-0.035em' },
    h2: { fontSize: '1rem', fontWeight: 600 },
    h3: { fontSize: '0.9rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCard: { defaultProps: { variant: 'outlined' } },
    MuiTextField: { defaultProps: { size: 'small', fullWidth: true } },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCssBaseline: { styleOverrides: { body: { margin: 0 }, '*:focus-visible': { outline: '3px solid #bd8b35', outlineOffset: 3 } } },
  },
}, esES);
