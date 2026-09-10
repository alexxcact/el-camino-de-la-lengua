import { test } from 'node:test';
import assert from 'node:assert/strict';
import { palabras } from '../data/datos.js';
import { distinguirDibujos, sesionAprobada } from './ejercicios.js';

test('las prácticas pequeñas pueden aprobarse y las largas exigen el 60%', () => {
  for (const total of [1, 2, 4, 5, 10, 15]) {
    assert.equal(sesionAprobada(total, total), true);
    assert.equal(sesionAprobada(0, total), false);
  }
  assert.equal(sesionAprobada(0, 0), false);
  assert.equal(sesionAprobada(2, 5), false);
  assert.equal(sesionAprobada(3, 5), true);
  assert.equal(sesionAprobada(3, 15), false);
  assert.equal(sesionAprobada(8, 15), false);
  assert.equal(sesionAprobada(9, 15), true);
  const lugares = palabras.filter(p => p.cat === 'Lugares');
  assert.equal(lugares.length, 1);
  assert.equal(sesionAprobada(1, lugares.length), true);
  const colores = palabras.filter(p => p.cat === 'Colores');
  assert.equal(colores.length, 3);
  assert.equal(sesionAprobada(1, colores.length), false);
  assert.equal(sesionAprobada(2, colores.length), true);
});

test('todos los dibujos del vocabulario se distinguen sin quitar palabras', () => {
  const opciones = distinguirDibujos(palabras);
  assert.deepEqual(opciones.map(p => p.id), palabras.map(p => p.id));
  const visibles = opciones.map(p => `${p.emoji}|${p.etiquetaDibujo || ''}`);
  assert.equal(new Set(visibles).size, opciones.length);
  assert.ok(palabras.every(p => !Object.hasOwn(p, 'etiquetaDibujo')));
});

test('las entradas de leña y agua llevan significado al repetir dibujo; uno único no necesita etiqueta', () => {
  const cuanda = palabras.find(p => p.p === 'Cuanda');
  assert.ok(cuanda);
  for (const terminos of [['Chu', 'Chula', 'Chular', 'Chuma'], ['Cual', 'Pi', 'Es']]) {
    const repetidas = palabras.filter(p => terminos.includes(p.p));
    assert.equal(repetidas.length, terminos.length);
    assert.equal(new Set(repetidas.map(p => p.emoji)).size, 1);
    const opciones = distinguirDibujos([...repetidas, cuanda]);
    assert.deepEqual(opciones.slice(0, -1).map(p => p.etiquetaDibujo), repetidas.map(p => p.e));
    assert.equal(opciones.at(-1).etiquetaDibujo, null);
    assert.equal(distinguirDibujos([repetidas[0]])[0].etiquetaDibujo, null);
  }
});
