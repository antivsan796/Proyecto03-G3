import { Box, Button, Chip, MenuItem, Paper, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import OperationsTable from './OperationsTable';
import OperationCardList from './OperationCardList';
import PaginationControl from './PaginationControl';
import { getMetrics, getPage } from '../utils/dashboard';
import { formatNumber } from '../utils/format';
import type { DateOrder, Operation } from '../types/dashboard';

interface OperationsSectionProps {
  rows: Operation[]; page: number; rowsPerPage: number;
  order: DateOrder; onOrderChange: (order: DateOrder) => void; onPageChange: (page: number) => void; onReset: () => void;
}

export default function OperationsSection({ rows, page, rowsPerPage, order, onOrderChange, onPageChange, onReset }: OperationsSectionProps) {
  const desktop = useMediaQuery(useTheme().breakpoints.up('md'));
  const pagination = getPage(rows, page, rowsPerPage);
  const visibleRows = pagination.data;
  const totalOperations = getMetrics(rows).operations;

  return <Box component="section" aria-labelledby="operations-title" sx={{ mt: 3 }}>
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 1.5, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ alignItems: { xs: 'stretch', md: 'center' } }}>
        <Typography variant="h2" id="operations-title">Detalle de operaciones</Typography>
        <TextField select label="Ordenar por fecha" value={order}
          onChange={(event) => onOrderChange(event.target.value as DateOrder)} sx={{ width: { xs: '100%', md: 285 } }}>
          <MenuItem value="newest">De más reciente a más antigua</MenuItem><MenuItem value="oldest">De más antigua a más reciente</MenuItem>
        </TextField>
      </Stack>
      <Chip role="status" label={`${formatNumber(rows.length)} registros · ${formatNumber(totalOperations)} operaciones`} size="small" sx={{ bgcolor: '#e5eff1', fontSize: 11 }} />
    </Stack>
    {rows.length ? <>
      {desktop ? <OperationsTable rows={rows} page={pagination.page} rowsPerPage={rowsPerPage} /> : <OperationCardList rows={visibleRows} />}
      <Paper variant="outlined" sx={{ p: 1.5, mt: desktop ? 0 : 2 }}><Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">Mostrando {pagination.start + 1}–{pagination.start + visibleRows.length} de {formatNumber(rows.length)} registros</Typography>
        <PaginationControl page={pagination.page} count={pagination.totalPages} onChange={onPageChange} />
      </Stack></Paper>
    </> : <Paper variant="outlined" sx={{ textAlign: 'center', p: 4 }}><Typography variant="h3">No hay operaciones con estos filtros</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>Prueba otro período o restablece los filtros.</Typography><Button variant="outlined" onClick={onReset}>Mostrar todas las operaciones</Button></Paper>}
  </Box>;
}
