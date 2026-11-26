import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  pretendToBeVisual: true,
  url: 'http://localhost',
});

Object.defineProperties(globalThis, {
  window: { configurable: true, value: dom.window },
  document: { configurable: true, value: dom.window.document },
  navigator: { configurable: true, value: dom.window.navigator },
  HTMLElement: { configurable: true, value: dom.window.HTMLElement },
  IS_REACT_ACT_ENVIRONMENT: { configurable: true, writable: true, value: true },
});

Object.defineProperty(dom.window, 'matchMedia', {
  value: (media: string) => ({
    matches: false,
    media,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  }),
});

Object.defineProperty(dom.window.HTMLElement.prototype, 'getBoundingClientRect', {
  value: () => new dom.window.DOMRect(0, 0, 600, 300),
});

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, 'ResizeObserver', { configurable: true, value: ResizeObserverStub });
Object.defineProperty(dom.window, 'ResizeObserver', { value: ResizeObserverStub });

test('cambiar provincia actualiza los registros y los indicadores del dashboard', async () => {
  const { cleanup, fireEvent, render, screen } = await import('@testing-library/react');
  const { default: App } = await import('../src/App');
  const { formatMoney, formatNumber } = await import('../src/utils/format');

  render(<App />);

  try {
    const province = await screen.findByRole('combobox', { name: 'Provincia' });
    const exampleSwitch = await screen.findByRole('switch', { name: 'Usar datos de ejemplo' });
    assert.equal((exampleSwitch as HTMLInputElement).checked, false);
    await screen.findByText(`588 registros · ${formatNumber(1206)} operaciones`);
    await screen.findByText('Último registro de los datos mostrados: 31/07/2026');
    assert.ok(screen.getByText(/Derechos reservados © 2026/));
    assert.equal(screen.queryByText('CFN B.P. / Grupo 3'), null);

    fireEvent.change(province, { target: { value: 'GUAYAS' } });

    await screen.findByText(`154 registros · ${formatNumber(208)} operaciones`);
    assert.match(screen.getByRole('article', { name: 'Número de operaciones' }).textContent ?? '', /208/);
    assert.match(screen.getByRole('article', { name: 'Monto otorgado' }).textContent ?? '', new RegExp(formatMoney(551553175.14).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

    fireEvent.click(exampleSwitch);
    await screen.findByText(`12 registros · ${formatNumber(24)} operaciones`);
  } finally {
    cleanup();
    const [{ goOffline }, { database }] = await Promise.all([
      import('firebase/database'),
      import('../src/firebase/firebase'),
    ]);
    goOffline(database);
  }
});

test('la tabla no muestra controles de ordenamiento por flechas', async () => {
  const { cleanup, render, screen } = await import('@testing-library/react');
  const { default: OperationsTable } = await import('../src/components/OperationsTable');

  render(<OperationsTable rows={[]} page={1} rowsPerPage={6} />);

  try {
    assert.equal(screen.queryByRole('button', { name: /^Ordenar por / }), null);
    assert.ok(screen.getByText('Tipo de operación'));
  } finally {
    cleanup();
  }
});

test('el selector de fecha está junto al título del detalle y no restablece filtros', async () => {
  const { cleanup, render, screen } = await import('@testing-library/react');
  const { default: OperationsSection } = await import('../src/components/OperationsSection');
  let reset = false;

  render(<OperationsSection rows={[]} page={1} rowsPerPage={6} order="newest" onOrderChange={() => {}}
    onPageChange={() => {}} onReset={() => { reset = true; }} />);

  try {
    assert.ok(screen.getByRole('combobox', { name: 'Ordenar por fecha' }));
    assert.equal(screen.queryByRole('button', { name: 'Restablecer filtros' }), null);
    assert.equal(reset, false);
  } finally {
    cleanup();
  }
});
