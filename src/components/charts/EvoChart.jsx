import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCompact, formatMoney, formatMonth } from '../../utils/format';

export default function EvoChart({ data, xAxisKey }) {
  return (
    <div className="line-chart" role="img" aria-label="Evolución mensual del monto otorgado, en dólares">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={data} margin={{ top: 12, right: 12, bottom: 8, left: 0 }} accessibilityLayer>
          <CartesianGrid stroke="#e8eef0" vertical={false} />
          <XAxis dataKey={xAxisKey} tickFormatter={formatMonth} tick={{ fontSize: 10 }} minTickGap={32} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={formatCompact} tick={{ fontSize: 10 }} width={48} tickLine={false} axisLine={false} />
          <Tooltip formatter={(value) => [formatMoney(value), 'Monto otorgado']} labelFormatter={formatMonth} />
          <Line type="linear" dataKey="amount" stroke="#176276" strokeWidth={2} dot={data.length < 13} activeDot={{ r: 5 }} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
