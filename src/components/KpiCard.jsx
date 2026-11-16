export default function KpiCard({ title, value, icon, description }) {
  return (
    <article className="kpi-card" aria-label={title}>
      <div className="kpi-heading"><h2>{title}</h2><span aria-hidden="true">{icon}</span></div>
      <p className="kpi-value">{value}</p>
      <p className="kpi-description">{description}</p>
    </article>
  );
}
