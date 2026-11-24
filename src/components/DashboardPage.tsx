import { lazy, Suspense } from 'react';
import { Alert, Box, Button, CircularProgress, Container, FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import DashboardHeader from './DashboardHeader';
import FiltersPanel from './FiltersPanel';
import KpiSection from './KpiSection';
import OperationsSection from './OperationsSection';
import Footer from './Footer';
import { useDashboardData } from '../hooks/useDashboardData';
import { toCsv } from '../utils/dashboard';

const ChartsSection = lazy(() => import('./ChartsSection'));

export default function DashboardPage() {
  const data = useDashboardData();
  const lastShownDate = data.filteredRows.reduce((latest, row) => row.fecha > latest ? row.fecha : latest, '');

  function resetFilters() {
    data.resetFilters();
  }

  function exportCsv() {
    const url = URL.createObjectURL(new Blob([toCsv(data.filteredRows)], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'operaciones_cfn_filtradas.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <>
    <Box component="a" href="#main" sx={{ position: 'fixed', top: -100, left: 12, zIndex: 1500, bgcolor: 'background.paper', p: 2, '&:focus': { top: 10 } }}>Ir al contenido</Box>
    <DashboardHeader title="Operaciones de Corporación Financiera Nacional B.P."
      subtitle="Una visión del financiamiento, su evolución y su distribución."
      onExport={exportCsv} exportDisabled={data.status !== 'ready' || !data.filteredRows.length} />
    <Container component="main" id="main" maxWidth="xl" sx={{ pb: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={.5} sx={{ mb: 2, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
        <Typography variant="caption" color="text.secondary" role="status">
          {data.status === 'ready' ? `${data.useExamples ? 'Datos de ejemplo' : 'Dataset validado'} · ${data.rows.length} registros` : 'Preparando datos…'}
        </Typography>
        <FormControlLabel sx={{ m: 0 }} label={<Typography variant="caption">Usar datos de ejemplo</Typography>}
          control={<Switch size="small" checked={data.useExamples} disabled={data.status === 'loading'} onChange={(_, checked) => data.changeDataMode(checked)} />} />
      </Stack>
      {data.status === 'loading' && <Stack spacing={2} sx={{ py: 6, alignItems: 'center' }} role="status"><CircularProgress /><Typography>Cargando operaciones crediticias…</Typography></Stack>}
      {data.status === 'error' && <Alert severity="error" action={<Button color="inherit" onClick={() => window.location.reload()}>Reintentar</Button>}>No se pudieron cargar los datos.</Alert>}
      {data.status === 'ready' && <>
        <FiltersPanel filters={data.filters} onChange={data.changeFilters} rows={data.rows} bounds={data.bounds} onReset={resetFilters} />
        <KpiSection metrics={data.metrics} />
        <Suspense fallback={<Typography role="status" sx={{ py: 4 }}>Cargando gráficos…</Typography>}>
          <ChartsSection timeSeries={data.timeSeries} byCreditType={data.byCreditType} bySector={data.bySector} />
        </Suspense>
        <OperationsSection rows={data.filteredRows} page={data.page} rowsPerPage={data.rowsPerPage} onPageChange={data.setPage}
          order={data.order} onOrderChange={data.changeOrder} onReset={resetFilters} />
        <Footer datasetSource="Corporación Financiera Nacional B.P." lastUpdate={lastShownDate} />
      </>}
    </Container>
  </>;
}
