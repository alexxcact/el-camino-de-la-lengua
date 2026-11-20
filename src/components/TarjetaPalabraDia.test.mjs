import { test } from 'node:test';
import assert from 'node:assert/strict';
import { palabras } from '../data/datos.js';
import { montarComponente, buscarNodo } from '../test/componentHarness.mjs';

function texto(nodo) {
  if (Array.isArray(nodo)) return nodo.map(texto).join('');
  if (typeof nodo === 'string' || typeof nodo === 'number') return String(nodo);
  return nodo?.props ? texto(nodo.props.children) : '';
}
const todoTexto = (arbol) => {
  const out = [];
  const rec = (n) => { if (Array.isArray(n)) return n.forEach(rec); if (n?.type === 'Text') out.push(texto(n)); if (n?.props) rec(n.props.children); };
  rec(arbol);
  return out.join(' | ');
};

function montar(p, props = {}) {
  const dichas = [];
  const palabra = palabras.find(w => w.p === p);
  const app = montarComponente('src/components/TarjetaPalabraDia.js', {
    props: { palabra, retoCompletado: false, onReto: () => {}, racha: 3, fecha: new Date(2026, 10, 19), ...props },
    mocks: {
      './PalabraIlustrada': 'PalabraIlustrada',
      'react-native-svg': { default: 'Svg', Path: 'Path', Rect: 'Rect' },
      '../utils/voz': { decirPalabra: (t) => dichas.push(t) },
    },
  });
  return { app, dichas };
}

test('la tarjeta muestra fecha, grafía, ejemplo, mundo y la ilustración propia (sin emojis)', () => {
  const { app, dichas } = montar('Guango');
  const t = todoTexto(app.tree);
  assert.match(t, /jueves 19 de noviembre/);
  assert.match(t, /se escribe: guango/);
  assert.match(t, /Mundo 3 · Paskal/);
  assert.match(t, /copo de lana o algodón/);
  assert.ok(buscarNodo(app.tree, n => n.type === 'PalabraIlustrada'));
  assert.ok(!/[\u{1F300}-\u{1FAFF}✨]/u.test(t), 'sin emojis decorativos');
  buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && n.props.accessibilityLabel?.startsWith('Escuchar')).props.onPress();
  assert.deepEqual(dichas, ['Guango']);
  app.unmount();
});

test('el reto enseña la racha', () => {
  let abierto = 0;
  const { app } = montar('Es', { onReto: () => { abierto++; } });
  const t = todoTexto(app.tree);
  const reto = buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && n.props.accessibilityLabel === 'Empezar el Reto del día');
  assert.match(texto(reto), /3/);
  reto.props.onPress();
  assert.equal(abierto, 1);
  app.unmount();
});

test('con el reto hecho no hay botón y se celebra la racha', () => {
  const { app } = montar('Zon', { retoCompletado: true });
  const t = todoTexto(app.tree);
  assert.match(t, /Reto de hoy completado/);
  assert.match(t, /3 días seguidos/);
  assert.equal(buscarNodo(app.tree, n => n.props?.accessibilityLabel === 'Empezar el Reto del día'), undefined);
  app.unmount();
});
