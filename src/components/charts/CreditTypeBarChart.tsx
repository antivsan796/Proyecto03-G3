import { Box, Stack, Typography } from '@mui/material';
import BarChartOutlined from '@mui/icons-material/BarChartOutlined';
import ChartPanel from './ChartPanel';
import { formatMoney } from '../../utils/format';
import type { CategoryValue } from '../../types/dashboard';
import { chartColors } from '../../theme';

interface CreditTypeBarChartProps { title: string; data: CategoryValue[] }

export default function CreditTypeBarChart({ title, data }: CreditTypeBarChartProps) {
  const max = Math.max(...data.map((item) => item.amount), 1);
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  return <ChartPanel title={title} icon={<BarChartOutlined fontSize="small" />} subtitle="Monto y participación por tipo de crédito" empty={!data.length}>
    <Stack component="ul" spacing={2.5} aria-label="Montos agrupados por tipo de crédito" sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {data.map((item, index) => <Box component="li" key={item.name}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 10, maxWidth: '60%' }}>{item.name}</Typography>
          <Typography sx={{ fontSize: 10, whiteSpace: 'nowrap', fontWeight: 500 }}>{formatMoney(item.amount)}</Typography>
        </Stack>
        <Box sx={{ height: 10, bgcolor: chartColors.track, borderRadius: .5, overflow: 'hidden', my: .75 }}>
          <Box sx={{ height: '100%', width: `${item.amount / max * 100}%`, bgcolor: chartColors.series[index % 4] }} />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>{total ? (item.amount / total * 100).toFixed(1) : 0}% del monto otorgado</Typography>
      </Box>)}
    </Stack>
  </ChartPanel>;
}
