import { test } from 'node:test';
import assert from 'node:assert/strict';
import { personajes } from './datos.js';
import {
  claveRetrato, idPersonaje, datosPersonaje, nombreCorto, ANFITRIONES,
  mundoFondo, palabrasDePersonaje, significadoDe, ctxPalabra,
} from './personajesUtil.js';

test('claveRetrato acepta id con guion o clave con guion bajo y cae a pishku', () => {
  assert.equal(claveRetrato('taita-rimay'), 'taita_rimay');
  assert.equal(claveRetrato('taita_rimay'), 'taita_rimay');
  for (const k of ['kinti', 'uma', 'pishku', 'chutun']) assert.equal(claveRetrato(k), k);
  assert.equal(claveRetrato('desconocido'), 'pishku');
  assert.equal(claveRetrato(undefined), 'pishku');
  assert.equal(claveRetrato(null), 'pishku');
});

test('idPersonaje devuelve el id de datos', () => {
  assert.equal(idPersonaje('taita_rimay'), 'taita-rimay');
  assert.equal(idPersonaje('taita-rimay'), 'taita-rimay');
  assert.equal(idPersonaje('chutun'), 'chutun');
  assert.equal(idPersonaje('nadie'), 'pishku');
});

test('datosPersonaje encuentra cada personaje y devuelve null si no existe', () => {
  for (const p of personajes) {
    assert.equal(datosPersonaje(p.id), p);
    assert.equal(datosPersonaje(p.id.replace(/-/g, '_')), p);
  }
  assert.equal(datosPersonaje('nadie'), null);
  assert.equal(datosPersonaje(undefined), null);
});

test('nombreCorto sirve para mitad de frase', () => {
  assert.equal(nombreCorto('kinti'), 'el Caminante');
  assert.equal(nombreCorto('taita_rimay'), 'el guía');
  assert.equal(nombreCorto('taita-rimay'), 'el guía');
  assert.equal(nombreCorto('uma'), 'la tejedora');
  assert.equal(nombreCorto('pishku'), 'el Ave mensajera');
  assert.equal(nombreCorto('chutun'), 'la Niebla juguetona');
});

test('ANFITRIONES cubre cada tipo de misión con un id de personaje', () => {
  assert.deepEqual(ANFITRIONES, {
    quiz: 'pishku', escucha: 'pishku', parejas: 'uma', memoria: 'uma', dictado: 'taita-rimay',
  });
  for (const id of Object.values(ANFITRIONES)) assert.ok(datosPersonaje(id));
});

test('mundoFondo toma el primer fondo numérico y aplica respaldos', () => {
  assert.equal(mundoFondo('taita-rimay'), 1);
  assert.equal(mundoFondo('taita_rimay'), 1);
  assert.equal(mundoFondo('uma'), 1);
  assert.equal(mundoFondo('pishku'), 1);
  assert.equal(mundoFondo('kinti'), 4);
  assert.equal(mundoFondo('chutun'), 1);
  assert.equal(mundoFondo('nadie'), null);
});

test('palabrasDePersonaje devuelve objetos palabra sin duplicados y en orden', () => {
  const pishku = palabrasDePersonaje('pishku').map(p => p.p);
  assert.deepEqual(pishku.slice(0, 4), ['Zon', 'Ina', 'Cun', 'Cuat']);
  assert.equal(new Set(pishku).size, pishku.length);

  const guia = palabrasDePersonaje('taita-rimay');
  assert.deepEqual(guia.map(p => p.p), palabrasDePersonaje('taita_rimay').map(p => p.p));
  assert.equal(guia[0].p, 'Pud');
  assert.ok(guia.every(p => typeof p.id === 'number' && typeof p.e === 'string'));

  assert.deepEqual(palabrasDePersonaje('kinti'), []);
  assert.deepEqual(palabrasDePersonaje('chutun'), []);
  assert.deepEqual(palabrasDePersonaje('nadie'), []);
});

test('significadoDe usa el campo e en minúscula', () => {
  assert.equal(significadoDe('Pa'), 'sol');
  assert.equal(significadoDe('Zon'), 'frailejón');
  assert.equal(significadoDe('NoExiste'), '');
  assert.equal(significadoDe(undefined), '');
  // Solo la inicial baja: se respeta 'Sol' dentro del campo e.
  assert.equal(significadoDe('Cuarris'), 'planta del sitio del agua');
});

test('ctxPalabra acepta id numérico o p y devuelve {} si no existe', () => {
  assert.deepEqual(ctxPalabra(1), { palabra: 'Zon', significado: 'frailejón' });
  assert.deepEqual(ctxPalabra('Pa'), { palabra: 'Pa', significado: 'sol' });
  assert.deepEqual(ctxPalabra(9999), {});
  assert.deepEqual(ctxPalabra('NoExiste'), {});
  assert.deepEqual(ctxPalabra(undefined), {});
});

test('medidasFigura usa la altura pedida y limita las figuras anchas', async () => {
  const { medidasFigura, aspectoFigura, infoFigura, FIGURA_INFO } = await import('./personajesUtil.js');
  assert.deepEqual(Object.keys(FIGURA_INFO).sort(), ['chutun', 'kinti', 'pishku', 'taita_rimay', 'uma']);
  assert.equal(infoFigura('taita-rimay'), FIGURA_INFO.taita_rimay);
  assert.equal(infoFigura('desconocido'), FIGURA_INFO.pishku);
  // Kinti es alto y estrecho: conserva la altura.
  const k = medidasFigura('kinti', 100);
  assert.equal(k.alto, 100);
  assert.equal(k.ancho, Math.round(100 * aspectoFigura('kinti')));
  // Con un tope estrecho, uma (ancha) baja la altura para no pasarse de ancho.
  const u = medidasFigura('uma', 100, 1);
  assert.equal(u.ancho, 100);
  assert.ok(u.alto < 100);
  // Ninguna figura supera 1.25x de ancho con el tope por defecto.
  for (const clave of Object.keys(FIGURA_INFO)) {
    const m = medidasFigura(clave, 200);
    assert.ok(m.ancho <= 250, `${clave} demasiado ancha`);
    assert.ok(m.alto <= 200);
  }
  // Altura inválida cae a 72.
  assert.equal(medidasFigura('kinti', NaN).alto, 72);
});

test('cajaFigura envuelve la figura con márgenes y ubica la cabeza dentro', async () => {
  const { cajaFigura, medidasFigura } = await import('./personajesUtil.js');
  for (const id of ['kinti', 'uma', 'pishku', 'chutun', 'taita-rimay']) {
    const c = cajaFigura(id, 120);
    const m = medidasFigura(id, 120);
    assert.equal(c.figAncho, m.ancho);
    assert.equal(c.figAlto, m.alto);
    assert.equal(c.ancho, c.figAncho + 2 * c.padX);
    assert.equal(c.alto, c.figAlto + c.padArriba + c.padAbajo);
    assert.ok(c.cabezaX > c.padX && c.cabezaX < c.padX + c.figAncho, id);
    assert.ok(c.cabezaY > c.padArriba && c.cabezaY < c.padArriba + c.figAlto, id);
    // La caja ya no es el cuadrado 1.4x de antes: se ajusta a la figura.
    assert.ok(c.alto < 120 * 1.3, id);
  }
});

test('medidasFigura aplica la escala propia: Chutun y Pishku salen más pequeños que un adulto', async () => {
  const { medidasFigura, FIGURA_INFO } = await import('./personajesUtil.js');
  assert.equal(medidasFigura('kinti', 200).alto, 200);
  assert.equal(medidasFigura('chutun', 200).alto, Math.round(200 * FIGURA_INFO.chutun.escala));
  assert.equal(medidasFigura('pishku', 200).alto, Math.round(200 * FIGURA_INFO.pishku.escala));
  assert.ok(medidasFigura('chutun', 200).alto < medidasFigura('kinti', 200).alto);
});
