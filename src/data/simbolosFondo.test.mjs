import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { SIMBOLOS_FONDO } from './simbolosFondo.js';
import { PETROGLIFOS } from './petroglifos.js';
import { pathGreca } from './greca.js';

test('las figuras del fondo tienen trazos válidos', () => {
  assert.deepEqual(SIMBOLOS_FONDO.map(f => f.id), ['danzante', 'monosRama', 'figurasPlato']);
  for (const f of SIMBOLOS_FONDO) {
    assert.match(f.d, /^M/);
    assert.doesNotMatch(f.d, /NaN|undefined/);
  }
  const g = pathGreca(400, 18);
  assert.doesNotMatch(g.d, /NaN/);
  assert.ok(g.trazo > 0);
});

test('cada composición de fondo usa figuras que existen y nunca el Sol', () => {
  const src = fs.readFileSync('src/components/FondoSimbolos.js', 'utf8');
  const ids = new Set([...PETROGLIFOS, ...SIMBOLOS_FONDO].map(f => f.id));
  const usados = [...src.matchAll(/\{ id: '(\w+)'/g)].map(m => m[1]);
  assert.ok(usados.length >= 15);
  for (const id of usados) assert.ok(ids.has(id), `figura ${id}`);
  assert.ok(!usados.includes('sol'), 'el Sol no va de fondo');
  for (const [, o] of src.matchAll(/o: ([\d.]+) \}/g)) assert.ok(Number(o) <= 0.1, 'siempre tenue');
});

test('las pantallas principales llevan el fondo de símbolos', () => {
  for (const [f, v] of [['MapaScreen', 'mapa'], ['JuegosScreen', 'juegos'], ['DiccionarioScreen', 'diccionario'], ['PerfilScreen', 'progreso'], ['MundoScreen', 'mundo'], ['RaicesScreen', 'juego'], ['ApellidoScreen', 'juego']]) {
    assert.ok(fs.readFileSync(`src/screens/${f}.js`, 'utf8').includes(`<FondoSimbolos variante="${v}" />`), f);
  }
});

test('todas las pantallas de la app llevan la simbología de fondo', () => {
  const pantallas = fs.readdirSync('src/screens').filter(f => /Screen\.js$/.test(f));
  assert.ok(pantallas.length >= 20);
  for (const f of pantallas) {
    assert.ok(fs.readFileSync(`src/screens/${f}`, 'utf8').includes('<FondoSimbolos'), `${f} sin fondo de símbolos`);
  }
});
