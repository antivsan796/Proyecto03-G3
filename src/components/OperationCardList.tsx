import { Grid } from '@mui/material';
import OperationCard from './OperationCard';
import type { Operation } from '../types/dashboard';

interface OperationCardListProps { rows: Operation[] }

export default function OperationCardList({ rows }: OperationCardListProps) {
  return <Grid container spacing={2} aria-label="Tarjetas de operaciones">{rows.map((row) =>
    <Grid key={row.id} size={{ xs: 12, sm: 6 }}><OperationCard operation={row} /></Grid>,
  )}</Grid>;
}
