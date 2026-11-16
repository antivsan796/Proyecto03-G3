export default function CategoryText({ value, limit = 100 }) {
  if (value.length <= limit) return <span>{value}</span>;
  return (
    <details className="category-detail">
      <summary><span className="detail-preview">{value.slice(0, limit)}… </span>
        <span className="detail-more">Ver más</span><span className="detail-less">Ver menos</span></summary>
      <p>{value}</p>
    </details>
  );
}
