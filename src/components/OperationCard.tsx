import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import CategoryText from './CategoryText';
import { formatDate, formatMoney, formatNumber } from '../utils/format';
import { getOperationStatusStyle } from '../utils/operationStatus';
import type { Operation } from '../types/dashboard';

interface OperationCardProps { operation: Operation }

export default function OperationCard({ operation }: OperationCardProps) {
  const details = [
    ['Tipo de operación', operation.tipoOperacion], ['Provincia / cantón', `${operation.provincia} / ${operation.canton}`],
    ['Sector', operation.sector], ['Subsector', operation.subsector], ['Actividad', operation.actividad],
  ];
  return <Card component="article"><CardContent sx={{ p: 2.5 }}>
    <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography component="time" dateTime={operation.fecha} variant="caption">{formatDate(operation.fecha)}</Typography>
      <Chip label={operation.estado} size="small" sx={{ ...getOperationStatusStyle(operation.estado), height: 23, fontSize: 9 }} />
    </Stack>
    <Typography variant="h3" sx={{ my: 2 }}>{operation.tipoCredito}</Typography>
    <Stack component="dl" spacing={1.5} sx={{ m: 0 }}>{details.map(([label, value]) => <Box key={label}>
      <Typography component="dt" sx={{ fontSize: 10, textTransform: 'uppercase', mb: .5 }} color="text.secondary">{label}</Typography>
      <Box component="dd" sx={{ m: 0, fontSize: 12, lineHeight: 1.7, overflowWrap: 'anywhere' }}><CategoryText value={value} limit={140} /></Box>
    </Box>)}</Stack>
    <Divider sx={{ my: 2 }} /><Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="caption" color="text.secondary">{formatNumber(operation.numeroOperaciones)} {operation.numeroOperaciones === 1 ? 'operación' : 'operaciones'}</Typography>
      <Typography sx={{ fontWeight: 600, fontSize: 18 }}>{formatMoney(operation.montoOtorgado)}</Typography>
    </Stack>
  </CardContent></Card>;
}
