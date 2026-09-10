import { test } from 'node:test';
import assert from 'node:assert/strict';
import { palabras } from '../data/datos.js';
import { bancoDuelo, filtrarBancoDuelo, generarPreguntaDuelo } from './duelo.js';

test('Duelo respeta desde la primera palabra aprendida; Mundo 1 solo sin progreso', () => {
  const poyo = palabras.find(p => p.p === 'Poyo');
  assert.ok(poyo);
  assert.notEqual(poyo.mundo, 1);
  assert.deepEqual(bancoDuelo(palabras, new Set([poyo.id])), [poyo]);
  assert.deepEqual(bancoDuelo(palabras, new Set()), palabras.filter(p => p.mundo === 1));
});

test('todos los filtros conservan objetivos y distractores dentro del banco elegido', () => {
  const categorias = [...new Set(palabras.map(p => p.cat))];
  for (const categoria of categorias) {
    const banco = filtrarBancoDuelo(palabras, 'categoria', null, categoria);
    assert.deepEqual(banco, palabras.filter(p => p.cat === categoria));
    const ids = new Set(banco.map(p => p.id));
    // Fuerza cada tipo de pregunta sin depender de la elección aleatoria.
    for (const random of [() => 0, () => 0.5, () => 0.99]) {
      const pregunta = generarPreguntaDuelo(banco, random);
      if (pregunta.tipo === 'relampago') {
        assert.ok(pregunta.tiles.every(t => ids.has(t.id)));
        assert.equal(new Set(pregunta.tiles.map(t => t.key)).size, pregunta.tiles.length);
        for (const tile of pregunta.tiles) {
          assert.equal(pregunta.tiles.filter(t => t.id === tile.id && t.lado !== tile.lado).length, 1);
        }
      } else {
        assert.ok(ids.has(pregunta.target.id));
        assert.ok(pregunta.opciones.length >= 2);
        assert.ok(pregunta.opciones.every(p => ids.has(p.id)));
        assert.equal(pregunta.opciones.filter(p => p.id === pregunta.target.id).length, 1);
      }
    }
  }
  const pocas = palabras.filter(p => p.mundo === 2).slice(0, 2);
  assert.deepEqual(filtrarBancoDuelo([...pocas, palabras[0]], 'mundo', 2), pocas);
  assert.deepEqual(filtrarBancoDuelo(palabras, 'categoria', null, 'inexistente'), []);
  assert.equal(generarPreguntaDuelo([]), null);
});

test('una categoría de una palabra ofrece una pareja jugable', () => {
  const banco = filtrarBancoDuelo(palabras, 'categoria', null, 'Lugares');
  assert.equal(banco.length, 1);
  const pregunta = generarPreguntaDuelo(banco);
  assert.equal(pregunta.tipo, 'relampago');
  assert.equal(pregunta.tiles.length, 2);
  assert.ok(pregunta.tiles.every(t => t.id === banco[0].id));
  assert.notEqual(pregunta.tiles[0].lado, pregunta.tiles[1].lado);
});
