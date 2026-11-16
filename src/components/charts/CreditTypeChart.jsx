import { formatMoney } from '../../utils/format';

export default function CreditTypeChart({ data }) {
  const max = Math.max(...data.map((group) => group.amount), 1);
  const total = data.reduce((sum, group) => sum + group.amount, 0);
  return (
    <ul className="credit-bars" aria-label="Montos agrupados por tipo de crédito">
      {data.map((group, index) => (
        <li key={group.name}>
          <div className="bar-label"><span>{group.name}</span><strong>{formatMoney(group.amount)}</strong></div>
          <div className="bar-track"><div className={`bar-fill bar-color-${index % 4}`} style={{ width: `${group.amount / max * 100}%` }} /></div>
          <p>{total ? (group.amount / total * 100).toFixed(1) : 0}% del monto otorgado</p>
        </li>
      ))}
    </ul>
  );
}
