import { Grid, Typography } from '@mui/material';
import TimeSeriesChart from './charts/TimeSeriesChart';
import CreditTypeBarChart from './charts/CreditTypeBarChart';
import SectorDonutChart from './charts/SectorDonutChart';
import type { CategoryValue, TimePoint } from '../types/dashboard';

interface ChartsSectionProps { timeSeries: TimePoint[]; byCreditType: CategoryValue[]; bySector: CategoryValue[] }

export default function ChartsSection({ timeSeries, byCreditType, bySector }: ChartsSectionProps) {
  return <section aria-labelledby="charts-title">
    <Typography id="charts-title" variant="h2" sx={{ mb: 1.5 }}>Composición y evolución</Typography>
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}><TimeSeriesChart title="Evolución del monto otorgado" data={timeSeries} /></Grid>
      <Grid size={{ xs: 12, md: 4 }}><CreditTypeBarChart title="Monto por tipo de crédito" data={byCreditType} /></Grid>
      <Grid size={{ xs: 12, md: 4 }}><SectorDonutChart title="Distribución por sector" data={bySector} /></Grid>
    </Grid>
  </section>;
}
