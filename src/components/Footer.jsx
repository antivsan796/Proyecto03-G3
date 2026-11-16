import { formatDate } from '../utils/format';

export default function Footer({ datasetSource, lastUpdate }) {
  return (
    <footer className="site-footer"><span>Fuente: <a href="https://www.datosabiertos.gob.ec/dataset/serie-mensual-de-volumen-de-credito-y-contingentes" target="_blank" rel="noreferrer">{datasetSource}</a></span>
      <span>Último registro del dataset: {formatDate(lastUpdate)}</span></footer>
  );
}
