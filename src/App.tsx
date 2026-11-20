import { CssBaseline, ThemeProvider } from '@mui/material';
import DashboardPage from './components/DashboardPage';
import { theme } from './theme';

export default function App() {
  return <ThemeProvider theme={theme}><CssBaseline /><DashboardPage /></ThemeProvider>;
}
