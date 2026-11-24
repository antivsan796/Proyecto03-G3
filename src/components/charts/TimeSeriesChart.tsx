import { Box } from '@mui/material';
import ShowChartOutlined from '@mui/icons-material/ShowChartOutlined';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ChartPanel from './ChartPanel';
import { formatCompact, formatMoney, formatMonth } from '../../utils/format';
import type { TimePoint } from '../../types/dashboard';
import { chartColors } from '../../theme';

interface TimeSeriesChartProps { title: string; data: TimePoint[] }

export default function TimeSeriesChart({ title, data }: TimeSeriesChartProps) {
  return <ChartPanel title={title} icon={<ShowChartOutlined fontSize="small" />} subtitle="Montos desembolsados por mes · USD" empty={!data.length}>
    <Box sx={{ height: 300, width: '100%', minWidth: 0 }} role="img" aria-label="Evolución mensual del monto otorgado en dólares">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={data} margin={{ top: 12, right: 10, bottom: 8, left: 0 }} accessibilityLayer>
          <CartesianGrid stroke={chartColors.grid} vertical={false} />
          <XAxis dataKey="name" tickFormatter={formatMonth} tick={{ fontSize: 10 }} minTickGap={32} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={formatCompact} tick={{ fontSize: 10 }} width={48} tickLine={false} axisLine={false} />
          <Tooltip formatter={(value) => [formatMoney(Number(value)), 'Monto otorgado']} labelFormatter={(value) => formatMonth(String(value))} />
          <Line type="linear" dataKey="amount" stroke={chartColors.series[0]} strokeWidth={2} dot={data.length < 13} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  </ChartPanel>;
}
