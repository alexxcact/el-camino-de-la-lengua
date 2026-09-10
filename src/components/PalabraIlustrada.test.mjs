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

test('las entradas nuevas sin dibujo propio muestran su emoji aunque reutilicen un ID ilustrado', () => {
  for (const palabra of [
    { id: 6, p: 'Put', emoji: '🌋' },
    { id: 9, p: 'Pepe', emoji: '🌕' },
    { id: 55, p: 'Canchape', emoji: '🥣' },
  ]) {
    const arbol = representar(palabra);
    assert.equal(buscarNodo(arbol, n => n.type === 'Svg'), undefined);
    assert.equal(buscarNodo(arbol, n => n.type === 'Text').props.children[0], palabra.emoji);
  }
});
