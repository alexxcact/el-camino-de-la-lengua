import { test } from 'node:test';
import assert from 'node:assert/strict';
import { palabras } from './datos.js';
import {
  seParecen, bancoVuelo, nuevaRonda, carrilEn, velocidad, VEL_MAX, puntosDeVuelo, textoNube,
} from './vueloLogica.js';

// Generador pseudoaleatorio con semilla, para rondas reproducibles.
function semilla(n) {
  let s = n;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

test('dos significados de agua se reconocen como parecidos', () => {
  const cual = palabras.find(p => p.p === 'Cual');
  const pi = palabras.find(p => p.p === 'Pi');
  const pa = palabras.find(p => p.p === 'Pa');
  assert.ok(seParecen(cual, pi));
  assert.ok(!seParecen(cual, pa));
});

test('quien empieza también puede volar: el banco se completa con el primer mundo', () => {
  const banco = bancoVuelo(palabras, new Set());
  assert.ok(banco.length >= 8);
  assert.ok(banco.every(p => p.mundo === 1));
  const muchas = new Set(palabras.slice(0, 20).map(p => p.id));
  assert.equal(bancoVuelo(palabras, muchas).length, 20);
});

test('cada ronda trae tres nubes distintas, una correcta y ninguna que se confunda', () => {
  for (let i = 1; i <= 300; i++) {
    const r = nuevaRonda(palabras, palabras, [], semilla(i));
    assert.equal(r.opciones.length, 3);
    assert.equal(new Set(r.opciones.map(o => o.id)).size, 3);
    assert.equal(r.opciones[r.correcto].id, r.objetivo.id);
    const otras = r.opciones.filter(o => o.id !== r.objetivo.id);
    assert.ok(otras.every(o => !seParecen(r.objetivo, o)), `${r.objetivo.p}: ${otras.map(o => o.e)}`);
  }
});

test('las palabras recientes no se repiten si hay otras', () => {
  const banco = palabras.filter(p => p.mundo === 1);
  const recientes = banco.slice(0, banco.length - 1).map(p => p.id);
  const r = nuevaRonda(banco, palabras, recientes, semilla(7));
  assert.equal(r.objetivo.id, banco[banco.length - 1].id);
});

test('el carril se decide por la altura; entre nubes no hay carril', () => {
  const centros = [100, 250, 400];
  assert.equal(carrilEn(110, centros, 100), 0);
  assert.equal(carrilEn(250, centros, 100), 1);
  assert.equal(carrilEn(175, centros, 100), -1);
});

test('la velocidad sube con los aciertos pero tiene tope, y los puntos también', () => {
  assert.ok(velocidad(5) > velocidad(0));
  assert.equal(velocidad(500), VEL_MAX);
  assert.equal(puntosDeVuelo(40), 15);
  assert.equal(puntosDeVuelo(3), 3);
  assert.equal(textoNube('Trabajo comunitario (minga)'), 'Trabajo comunitario');
});

test('Auara no puede esquivar la pregunta pasando por debajo, por encima o entre nubes', async () => {
  const { eleccionEnPaso, carrilCercano } = await import('./vueloLogica.js');
  const centros = [100, 250, 400];
  const base = { ancho: 180, aveX: 80, centros, altoNube: 90 };
  // Todavía lejos: no hay elección.
  assert.equal(eleccionEnPaso({ ...base, x: 300, y: 480 }), null);
  // Entra en la columna por debajo de la última nube: aún no elige...
  assert.equal(eleccionEnPaso({ ...base, x: 60, y: 480 }), null);
  // ...pero al llegar la mitad de la columna cuenta la nube de abajo.
  assert.equal(eleccionEnPaso({ ...base, x: -10, y: 480 }), 2);
  // Por encima de todo cuenta la de arriba; en un hueco, la más cercana.
  assert.equal(eleccionEnPaso({ ...base, x: -10, y: 10 }), 0);
  assert.equal(eleccionEnPaso({ ...base, x: -10, y: 310 }), 1);
  // Tocar una nube elige esa en cuanto la toca.
  assert.equal(eleccionEnPaso({ ...base, x: 85, y: 250 }), 1);
  assert.equal(carrilCercano(330, centros), 2);
});

test('si nadie toca la pantalla, Auara acaba perdiendo: rebotar en el suelo elige la nube de abajo', async () => {
  const { eleccionEnPaso } = await import('./vueloLogica.js');
  // Simulación del bucle con la misma física de la pantalla, sin ningún toque.
  const cielo = 700, centros = [0.19, 0.5, 0.81].map(f => cielo * f), altoNube = cielo * 0.2;
  const suelo = cielo - 22, aveX = 80, ancho = 180;
  let y = suelo, vy = 0, x = 420, elegido = null;
  for (let t = 0; t < 600 && elegido === null; t++) {
    const dt = 1 / 60;
    vy = Math.min(520, vy + 1000 * dt); y += vy * dt;
    if (y > suelo) { y = suelo; vy = -380 * 0.7; }
    x -= 140 * dt;
    elegido = eleccionEnPaso({ x, ancho, aveX, y, centros, altoNube });
  }
  assert.equal(elegido, 2);
});
