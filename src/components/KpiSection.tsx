import { Grid } from '@mui/material';
import KpiCard from './KpiCard';
import type { Metrics } from '../types/dashboard';

interface KpiSectionProps { metrics: Metrics }

export default function KpiSection({ metrics }: KpiSectionProps) {
  return <Grid component="section" container spacing={2} aria-label="Indicadores del período seleccionado" aria-live="polite" sx={{ my: 2.5 }}>
    <Grid size={{ xs: 12, md: 4 }}><KpiCard title="Monto otorgado" value={metrics.amount} unit="USD" helperText="Total desembolsado en el período seleccionado" /></Grid>
    <Grid size={{ xs: 12, md: 4 }}><KpiCard title="Número de operaciones" value={metrics.operations} helperText="Suma de operaciones de los registros seleccionados" /></Grid>
    <Grid size={{ xs: 12, md: 4 }}><KpiCard title="Monto promedio por operación" value={metrics.average} unit="USD" helperText="Monto otorgado / número de operaciones" /></Grid>
  </Grid>;
}
