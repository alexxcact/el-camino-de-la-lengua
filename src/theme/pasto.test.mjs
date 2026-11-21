import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { simboloDeJuego, SIMBOLO_JUEGO, SIMBOLO_MUNDO } from './pasto.js';
import { petroglifoDe } from '../data/petroglifos.js';
import { SIMBOLOS_FONDO } from '../data/simbolosFondo.js';

const existe = (id) => !!(petroglifoDe(id) || SIMBOLOS_FONDO.find(f => f.id === id));

test('cada juego tiene un sello que existe y, dentro de un mundo, usa el del mundo', () => {
  for (const id of Object.values(SIMBOLO_JUEGO)) assert.ok(existe(id), id);
  assert.equal(simboloDeJuego('quiz', 3), SIMBOLO_MUNDO[3]);
  assert.equal(simboloDeJuego('quiz'), SIMBOLO_JUEGO.quiz);
  // El Sol de los Pastos es sagrado: no se usa como sello.
  assert.ok(!Object.values(SIMBOLO_JUEGO).includes('sol'));
});

test('todas las pantallas de juego estampan su sello al abrirse', () => {
  for (const f of ['Quiz', 'Misiones', 'Escucha', 'Memoria', 'RetoDiario', 'Practica', 'Raices', 'Apellido', 'Duelo']) {
    const src = fs.readFileSync(`src/screens/${f}Screen.js`, 'utf8');
    assert.ok(src.includes('<SelloApertura simbolo='), f);
  }
  const misiones = fs.readFileSync('src/screens/MisionesScreen.js', 'utf8');
  assert.ok(misiones.includes("simboloDeJuego('dictado', mundoId)") && misiones.includes("simboloDeJuego('parejas', mundoId)"));
});
