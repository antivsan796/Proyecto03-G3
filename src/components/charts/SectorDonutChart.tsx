import { Box, Stack, Typography } from '@mui/material';
import DonutLargeOutlined from '@mui/icons-material/DonutLargeOutlined';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import ChartPanel from './ChartPanel';
import { formatMoney } from '../../utils/format';
import type { CategoryValue } from '../../types/dashboard';
import { chartColors } from '../../theme';

interface SectorDonutChartProps { title: string; data: CategoryValue[] }

export default function SectorDonutChart({ title, data }: SectorDonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  return <ChartPanel title={title} icon={<DonutLargeOutlined fontSize="small" />} subtitle="Participación por sector económico" empty={!data.length}>
    <Box sx={{ height: 170, position: 'relative' }} role="img" aria-label="Distribución del monto por sector económico">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <PieChart accessibilityLayer>
          <Pie data={data} dataKey="amount" nameKey="name" innerRadius="62%" outerRadius="88%" paddingAngle={2} isAnimationActive={false}>
            {data.map((item, index) => <Cell key={item.name} fill={chartColors.series[index % chartColors.series.length]} />)}
          </Pie>
          <Tooltip formatter={(value) => formatMoney(Number(value))} />
        </PieChart>
      </ResponsiveContainer>
      <Box aria-hidden="true" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
        <Typography sx={{ fontSize: 22 }}>100%</Typography><Typography sx={{ fontSize: 10 }} color="text.secondary">del monto</Typography>
      </Box>
    </Box>
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', p: 0, mb: 0 }}>
      {data.map((item, index) => <Stack component="li" key={item.name} direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
        <Box sx={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, bgcolor: chartColors.series[index % chartColors.series.length] }} />
        <Typography sx={{ fontSize: 10, flex: 1 }}>{item.name}</Typography>
        <Typography sx={{ fontSize: 11, fontWeight: 500 }}>{total ? (item.amount / total * 100).toFixed(1) : 0}%</Typography>
      </Stack>)}
    </Stack>
  </ChartPanel>;
}
