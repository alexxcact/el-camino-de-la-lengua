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
  const colores = palabras.filter(p => p.cat === 'Colores');
  assert.equal(colores.length, 1);
  assert.equal(sesionAprobada(1, colores.length), true);
});

test('todos los dibujos del vocabulario se distinguen sin quitar palabras', () => {
  const opciones = distinguirDibujos(palabras);
  assert.deepEqual(opciones.map(p => p.id), palabras.map(p => p.id));
  const visibles = opciones.map(p => `${p.emoji}|${p.etiquetaDibujo || ''}`);
  assert.equal(new Set(visibles).size, opciones.length);
  assert.ok(palabras.every(p => !Object.hasOwn(p, 'etiquetaDibujo')));
});

test('Nina, Imba y Tulpa llevan significado; un dibujo único no necesita etiqueta', () => {
  const fuego = palabras.filter(p => ['Nina', 'Imba', 'Tulpa'].includes(p.p));
  assert.equal(fuego.length, 3);
  const puka = palabras.find(p => p.p === 'Puka');
  const opciones = distinguirDibujos([...fuego, puka]);
  assert.deepEqual(opciones.slice(0, 3).map(p => p.etiquetaDibujo), fuego.map(p => p.e));
  assert.equal(opciones[3].etiquetaDibujo, null);
  assert.equal(distinguirDibujos([fuego[0]])[0].etiquetaDibujo, null);
});
