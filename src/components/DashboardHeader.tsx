import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onExport: () => void;
  exportDisabled: boolean;
}

export default function DashboardHeader({ title, subtitle, onExport, exportDisabled }: DashboardHeaderProps) {
  return <Box component="header">
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="xl"><Toolbar disableGutters sx={{ justifyContent: 'space-between', gap: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', p: .6, borderRadius: 1 }}><BarChartOutlined /></Box>
          <Typography sx={{ fontSize: { xs: 10, sm: 12 }, fontWeight: 700 }}>DASHBOARD INFORMATIVO</Typography>
        </Stack>
      </Toolbar></Container>
    </AppBar>
    <Container maxWidth="xl" sx={{ pt: 4, pb: 2.5 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}>
        <Box><Typography variant="overline" color="text.secondary" sx={{ fontSize: 10, letterSpacing: 1.5 }}>Resumen general</Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: 23, md: 30 }, maxWidth: 1000 }}>{title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{subtitle}</Typography></Box>
        <Button variant="outlined" size="small" startIcon={<FileDownloadOutlined />} onClick={onExport} disabled={exportDisabled} sx={{ flexShrink: 0 }}>Exportar CSV</Button>
      </Stack>
    </Container>
  </Box>;
}
