import { Alert, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import DateFilter from './filters/DateFilter';
import SelectFilter from './filters/SelectFilter';
import AmountRangeFilter from './filters/AmountRangeFilter';
import { categoryFilters, getOptions, updateFilters } from '../utils/dashboard';
import type { DashboardFilters, Operation } from '../types/dashboard';

interface FiltersPanelProps {
  filters: DashboardFilters;
  onChange: (next: DashboardFilters) => void;
  rows: Operation[];
  bounds: { startDate: string; endDate: string; maxAmount: number };
  onReset: () => void;
}

export default function FiltersPanel({ filters, onChange, rows, bounds, onReset }: FiltersPanelProps) {
  const invalidDates = Boolean(filters.startDate && filters.endDate && filters.startDate > filters.endDate);
  return <Paper component="section" variant="outlined" aria-labelledby="filters-title" sx={{ p: { xs: 2, md: 2.5 } }}>
    <Stack direction="row" spacing={1} sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography id="filters-title" variant="h2" sx={{ fontSize: 14 }}>Filtrar operaciones</Typography>
      <Button size="small" onClick={onReset} sx={{ fontSize: 11 }}>Restablecer filtros</Button>
    </Stack>
    <Grid container spacing={2}>
      <Grid size={{ xs: 6, md: 3 }}><DateFilter label="Fecha inicio" value={filters.startDate} min={bounds.startDate}
        max={filters.endDate || bounds.endDate} error={invalidDates} onChange={(value) => onChange({ ...filters, startDate: value })} /></Grid>
      <Grid size={{ xs: 6, md: 3 }}><DateFilter label="Fecha fin" value={filters.endDate} min={filters.startDate || bounds.startDate}
        max={bounds.endDate} error={invalidDates} onChange={(value) => onChange({ ...filters, endDate: value })} /></Grid>
      {categoryFilters.map(({ key, column, label }) => {
        let available = rows;
        if (key === 'canton' && filters.province) available = available.filter((row) => row.provincia === filters.province);
        if ((key === 'subsector' || key === 'activity') && filters.sector) available = available.filter((row) => row.sector === filters.sector);
        if (key === 'activity' && filters.subsector) available = available.filter((row) => row.subsector === filters.subsector);
        return <Grid key={key} size={{ xs: key === 'activity' || key === 'status' ? 12 : 6, md: 3 }}>
          <SelectFilter label={label} value={filters[key]} options={getOptions(available, column).map((value) => ({ value, label: value }))}
            onChange={(value) => onChange(updateFilters(filters, key, value))} />
        </Grid>;
      })}
      <Grid size={{ xs: 12, md: 6 }}><AmountRangeFilter value={filters.amountRange} min={0} max={bounds.maxAmount}
        onChange={(amountRange) => onChange({ ...filters, amountRange })} /></Grid>
    </Grid>
    {invalidDates && <Alert severity="error" sx={{ mt: 2 }}>La fecha de inicio debe ser anterior o igual a la fecha de fin.</Alert>}
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>Los indicadores, gráficos y registros cambian con los filtros.</Typography>
  </Paper>;
}
