import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CategoryText from './CategoryText';
import { formatDate, formatMoney, formatNumber } from '../utils/format';
import { getOperationStatusStyle } from '../utils/operationStatus';
import type { Operation } from '../types/dashboard';

interface OperationsTableProps { rows: Operation[]; page: number; rowsPerPage: number }
const headers = ['Fecha', 'Tipo de crédito', 'Tipo de operación', 'Estado', 'Provincia / cantón', 'Sector', 'Subsector', 'Actividad', 'Operaciones', 'Monto · USD'];

export default function OperationsTable({ rows, page, rowsPerPage }: OperationsTableProps) {
  const visibleRows = rows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  return <TableContainer component={Paper} variant="outlined"><Table size="small" sx={{ minWidth: 1000, tableLayout: 'fixed',
    '& th, & td': { fontSize: 10, verticalAlign: 'top', py: 2, px: 1, lineHeight: 1.65, overflowWrap: 'anywhere' },
    '& th': { bgcolor: '#f8fafb', color: 'text.secondary', fontWeight: 500 } }}>
    <caption style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>Detalle de operaciones crediticias de la página actual</caption>
    <TableHead><TableRow>{headers.map((label, index) => <TableCell key={label} align={index > 7 ? 'right' : 'left'}
      sx={{ width: `${[7, 10, 7, 9, 10, 10, 11, 17, 7, 12][index]}%` }}>{label}</TableCell>)}</TableRow></TableHead>
    <TableBody>{visibleRows.map((row) => <TableRow key={row.id} hover>
      <TableCell>{formatDate(row.fecha)}</TableCell><TableCell>{row.tipoCredito}</TableCell><TableCell>{row.tipoOperacion}</TableCell>
      <TableCell><Chip label={row.estado} size="small" sx={{ ...getOperationStatusStyle(row.estado), fontSize: 8, height: 'auto', '& .MuiChip-label': { whiteSpace: 'normal', px: .75, py: .3 } }} /></TableCell>
      <TableCell>{row.provincia}<Typography component="span" sx={{ fontSize: 9, display: 'block' }} color="text.secondary">{row.canton}</Typography></TableCell>
      <TableCell>{row.sector}</TableCell><TableCell><CategoryText value={row.subsector} limit={70} /></TableCell>
      <TableCell><CategoryText value={row.actividad} /></TableCell>
      <TableCell align="right">{formatNumber(row.numeroOperaciones)}</TableCell><TableCell align="right">{formatMoney(row.montoOtorgado)}</TableCell>
    </TableRow>)}</TableBody>
  </Table></TableContainer>;
}
