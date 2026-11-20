import { Link, Stack, Typography } from '@mui/material';
import { formatDate } from '../utils/format';

interface FooterProps { datasetSource: string; lastUpdate: string }

export default function Footer({ datasetSource, lastUpdate }: FooterProps) {
  return <Stack component="footer" direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ pt: 3, justifyContent: 'space-between' }}>
    <Typography variant="caption" color="text.secondary">Fuente: <Link color="inherit" target="_blank" rel="noreferrer"
      href="https://www.datosabiertos.gob.ec/dataset/serie-mensual-de-volumen-de-credito-y-contingentes">{datasetSource}</Link></Typography>
    <Typography variant="caption" color="text.secondary">Último registro de los datos mostrados: {formatDate(lastUpdate)}</Typography>
  </Stack>;
}
