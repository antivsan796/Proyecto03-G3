import { formatDate, formatMoney, formatNumber } from '../utils/format';
import CategoryText from './CategoryText';

export default function OperationCard({ operation }) {
  return (
    <article className="operation-card">
      <div className="operation-heading"><time dateTime={operation.FECHA}>{formatDate(operation.FECHA)}</time>
        <span className="status-tag">{operation['ESTADO DE LA OPERACION']}</span></div>
      <h3>{operation['TIPO DE CREDITO']}</h3>
      <dl>
        <div><dt>Tipo de operación</dt><dd>{operation['TIPO DE OPERACION']}</dd></div>
        <div><dt>Provincia / cantón</dt><dd>{operation.PROVINCIA} / {operation.CANTON}</dd></div>
        <div><dt>Sector</dt><dd>{operation.SECTOR}</dd></div>
        <div><dt>Subsector</dt><dd><CategoryText value={operation.SUBSECTOR} /></dd></div>
        <div><dt>Actividad</dt><dd><CategoryText value={operation.ACTIVIDAD} limit={140} /></dd></div>
      </dl>
      <div className="operation-total"><span>{formatNumber(operation['NÚMERO DE OPERACIONES'])} {operation['NÚMERO DE OPERACIONES'] === 1 ? 'operación' : 'operaciones'}</span>
        <strong>{formatMoney(operation['MONTO OTORGADO'])}</strong></div>
    </article>
  );
}
