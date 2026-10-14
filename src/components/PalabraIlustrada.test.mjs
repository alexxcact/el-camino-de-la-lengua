import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarComponente, buscarNodo } from '../test/componentHarness.mjs';

function representar(palabra) {
  return montarComponente('src/components/PalabraIlustrada.js', {
    props: { palabra },
    mocks: {
      'react-native-svg': {
        __esModule: true,
        default: 'Svg',
        Circle: 'Circle', Ellipse: 'Ellipse', G: 'G', Line: 'Line', Path: 'Path',
        Rect: 'Rect', Polygon: 'Polygon', Polyline: 'Polyline', Defs: 'Defs', ClipPath: 'ClipPath',
      },
    },
  }).tree;
}

test('reasignar un ID conserva la ilustración del término y no hereda el dibujo anterior', () => {
  const frailejon = representar({ id: 1, p: 'Zon', emoji: '🌿' });
  const mismoTerminoConOtroId = representar({ id: 55, p: 'Zon', emoji: '🌿' });
  const sol = representar({ id: 7, p: 'Pa', emoji: '☀️' });

  assert.ok(buscarNodo(frailejon, n => n.type === 'Svg'));
  assert.equal(JSON.stringify(frailejon), JSON.stringify(mismoTerminoConOtroId));
  assert.notEqual(JSON.stringify(frailejon), JSON.stringify(sol));
});

test('una palabra sin dibujo propio cae a su emoji', () => {
  const desconocida = representar({ id: 999, p: 'PalabraSinDibujo', emoji: '🔤' });
  assert.equal(buscarNodo(desconocida, n => n.type === 'Svg'), undefined);
  assert.equal(buscarNodo(desconocida, n => n.type === 'Text').props.children[0], '🔤');
});

test('las entradas del corpus tienen ilustración propia y no muestran emoji', () => {
  for (const palabra of [
    { id: 6, p: 'Put', emoji: '🌋' },
    { id: 9, p: 'Pepe', emoji: '🌕' },
    { id: 55, p: 'Canchape', emoji: '🥣' },
    { id: 61, p: 'Cual', emoji: '💧' },
    { id: 74, p: 'Cusumbe', emoji: '🐾' },
  ]) {
    const nodo = representar(palabra);
    assert.ok(buscarNodo(nodo, n => n.type === 'Svg'), `${palabra.p} debería tener dibujo`);
    assert.equal(buscarNodo(nodo, n => n.type === 'Text'), undefined);
  }
});
