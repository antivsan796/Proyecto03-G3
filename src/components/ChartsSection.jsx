import EvoChart from './charts/EvoChart';
import CreditTypeChart from './charts/CreditTypeChart';
import SectorChart from './charts/SectorChart';
import { groupAmounts, groupSectors } from '../utils/dashboard';

export default function ChartsSection({ operations }) {
  const charts = [
    { title: 'Evolución del monto otorgado', subtitle: 'Desembolsos agrupados por mes · USD', chart: <EvoChart data={groupAmounts(operations, 'FECHA')} xAxisKey="name" /> },
    { title: 'Monto por tipo de crédito', subtitle: 'Montos otorgados y participación del total', chart: <CreditTypeChart data={groupAmounts(operations, 'TIPO DE CREDITO')} /> },
    { title: 'Distribución por sector', subtitle: 'Cinco sectores principales y otros sectores', chart: <SectorChart data={groupSectors(operations)} /> },
  ];
  return (
    <section aria-labelledby="charts-title">
      <div className="section-heading"><h2 id="charts-title">Composición y evolución</h2><span>Montos en dólares estadounidenses</span></div>
      <div className="charts-grid">{charts.map(({ title, subtitle, chart }) => (
        <article className="chart-panel" key={title}><h3>{title}</h3><p className="chart-subtitle">{subtitle}</p>
          {operations.length ? chart : <p className="empty-chart">No hay datos para graficar con estos filtros.</p>}
        </article>
      ))}</div>
    </section>
  );
}
