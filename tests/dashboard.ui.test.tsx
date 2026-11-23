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

  render(<App />);

  try {
    const province = await screen.findByRole('combobox', { name: 'Provincia' });
    await screen.findByText(/12 registros · 24 operaciones/);
    fireEvent.change(province, { target: { value: 'GUAYAS' } });

    await screen.findByText(/2 registros · 13 operaciones/);
    assert.match(screen.getByRole('article', { name: 'Número de operaciones' }).textContent ?? '', /13/);
    assert.match(screen.getByRole('article', { name: 'Monto otorgado' }).textContent ?? '', /21\.506\.479,00/);
  } finally {
    cleanup();
  }
});
