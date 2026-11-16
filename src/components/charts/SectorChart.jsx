import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatMoney } from '../../utils/format';

const colors = ['#176276', '#259295', '#75a8b9', '#c49a54', '#84949f', '#d5dfe3'];

export default function SectorChart({ data }) {
  const total = data.reduce((sum, group) => sum + group.amount, 0);
  return (
    <div className="sector-chart">
      <div className="donut-chart" role="img" aria-label="Distribución del monto otorgado por sector económico">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart accessibilityLayer>
            <Pie data={data} dataKey="amount" nameKey="name" innerRadius="63%" outerRadius="88%" paddingAngle={2} isAnimationActive={false}>
              {data.map((group, index) => <Cell key={group.name} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip formatter={(value) => formatMoney(value)} />
          </PieChart>
        </ResponsiveContainer>
        <span className="donut-label" aria-hidden="true"><strong>100%</strong><span>del monto</span></span>
      </div>
      <ul className="sector-legend">
        {data.map((group, index) => (
          <li key={group.name}><span className="legend-dot" style={{ background: colors[index % colors.length] }} />
            <span>{group.name}</span><strong>{total ? (group.amount / total * 100).toFixed(1) : 0}%</strong></li>
        ))}
      </ul>
    </div>
  );
}
