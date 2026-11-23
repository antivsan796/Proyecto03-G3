import { Box, Button, Chip, MenuItem, Paper, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import OperationsTable from './OperationsTable';
import OperationCardList from './OperationCardList';
import PaginationControl from './PaginationControl';
import { formatNumber } from '../utils/format';
import type { DateOrder, Operation } from '../types/dashboard';

interface OperationsSectionProps {
  rows: Operation[]; visibleRows: Operation[]; totalOperations: number; page: number; rowsPerPage: number; totalPages: number;
  order: DateOrder; onOrderChange: (order: DateOrder) => void; onPageChange: (page: number) => void; onReset: () => void;
}

export default function OperationsSection({ rows, visibleRows, totalOperations, page, rowsPerPage, totalPages, order, onOrderChange, onPageChange, onReset }: OperationsSectionProps) {
  const desktop = useMediaQuery(useTheme().breakpoints.up('md'));
  return <Box component="section" aria-labelledby="operations-title" sx={{ mt: 3 }}>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 1.5, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}>
      <Typography variant="h2" id="operations-title">Detalle de operaciones</Typography>
      <Chip role="status" label={`${formatNumber(rows.length)} registros · ${formatNumber(totalOperations)} operaciones`} size="small" sx={{ bgcolor: '#e5eff1', fontSize: 11 }} />
    </Stack>
    <Stack sx={{ mb: 1.5, alignItems: { xs: 'stretch', sm: 'flex-end' } }}><TextField select label="Ordenar por fecha" value={order}
      onChange={(event) => onOrderChange(event.target.value as DateOrder)} sx={{ width: { xs: '100%', sm: 285 } }}>
      <MenuItem value="newest">De más reciente a más antigua</MenuItem><MenuItem value="oldest">De más antigua a más reciente</MenuItem>
    </TextField></Stack>
    {rows.length ? <>
      {desktop ? <OperationsTable rows={rows} page={page} rowsPerPage={rowsPerPage} /> : <OperationCardList rows={visibleRows} />}
      <Paper variant="outlined" sx={{ p: 1.5, mt: desktop ? 0 : 2 }}><Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">Mostrando {(page - 1) * rowsPerPage + 1}–{(page - 1) * rowsPerPage + visibleRows.length} de {formatNumber(rows.length)} registros</Typography>
        <PaginationControl page={page} count={totalPages} onChange={onPageChange} />
      </Stack></Paper>
    </> : <Paper variant="outlined" sx={{ textAlign: 'center', p: 4 }}><Typography variant="h3">No hay operaciones con estos filtros</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>Prueba otro período o restablece los filtros.</Typography><Button variant="outlined" onClick={onReset}>Mostrar todas las operaciones</Button></Paper>}
  </Box>;
}
