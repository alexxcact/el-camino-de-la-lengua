import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LINEAS, resolver, elegirLinea } from './dialogos.js';
import { palabras } from './datos.js';

const PERSONAJES = ['kinti', 'taita-rimay', 'uma', 'pishku', 'chutun'];
const de = (momento, personaje) =>
  LINEAS.filter(l => l.momento === momento && (!personaje || l.personaje === personaje));
const usa = (l, tok) => l.texto.includes(`{${tok}}`);
const enRango = (cuando, n) =>
  !cuando || ((cuando.nMin ?? -Infinity) <= n && n <= (cuando.nMax ?? Infinity));

test('estructura básica de cada línea', () => {
  const ids = new Set();
  const animos = ['neutral', 'feliz', 'pensativo', 'sorprendido', 'travieso'];
  for (const l of LINEAS) {
    assert.ok(l.id && !ids.has(l.id), `id duplicado o vacío: ${l.id}`);
    ids.add(l.id);
    assert.ok(PERSONAJES.includes(l.personaje), `personaje inválido en ${l.id}`);
    assert.ok(animos.includes(l.animo), `animo inválido en ${l.id}`);
    assert.equal(typeof l.texto, 'string');
    for (const [, k] of l.texto.matchAll(/\{(\w+)\}/g)) {
      assert.ok(['nombre', 'palabra', 'significado', 'n'].includes(k), `token desconocido {${k}} en ${l.id}`);
    }
  }
});

test('mínimos por momento y personaje', () => {
  const minimos = [
    ['fallo', 'chutun', 4], ['ayuda', 'taita-rimay', 2], ['ayuda', 'uma', 2],
    ['acierto', 'pishku', 4], ['dominada', 'chutun', 3],
    ['fin_exito', 'pishku', 2], ['fin_exito', 'uma', 2], ['fin_exito', 'taita-rimay', 2],
    ['fin_fallo', 'chutun', 2], ['fin_fallo', 'taita-rimay', 2],
    ['saludo_repaso', 'chutun', 2], ['saludo_racha', 'pishku', 2],
    ['saludo_regreso', 'uma', 2], ['saludo_dia', 'pishku', 2],
  ];
  for (const [m, p, min] of minimos) {
    assert.ok(de(m, p).length >= min, `${m}/${p}: ${de(m, p).length} < ${min}`);
  }
});

test('ánimos y tokens exigidos por momento', () => {
  for (const l of de('fallo', 'chutun')) {
    assert.equal(l.animo, 'travieso');
    assert.ok(usa(l, 'palabra') && usa(l, 'significado'), l.id);
  }
  for (const l of [...de('ayuda', 'taita-rimay'), ...de('ayuda', 'uma')]) assert.equal(l.animo, 'pensativo');
  const aciertosConAmbos = de('acierto', 'pishku').filter(l => usa(l, 'palabra') && usa(l, 'significado'));
  assert.ok(aciertosConAmbos.length >= 4);
  for (const l of de('acierto', 'pishku')) assert.equal(l.animo, 'feliz');
  for (const l of de('dominada', 'chutun')) {
    assert.equal(l.animo, 'sorprendido');
    assert.ok(usa(l, 'palabra'), l.id);
  }
  for (const l of de('fin_exito')) assert.equal(l.animo, 'feliz');
  for (const p of ['pishku', 'uma', 'taita-rimay']) {
    assert.ok(de('fin_exito', p).some(l => !usa(l, 'nombre')), `fin_exito/${p} necesita línea sin {nombre}`);
  }
  for (const l of de('fin_fallo', 'chutun')) {
    assert.equal(l.animo, 'travieso');
    assert.ok(usa(l, 'palabra') && usa(l, 'significado'), l.id);
  }
  for (const l of de('fin_fallo', 'taita-rimay')) {
    assert.equal(l.animo, 'pensativo');
    assert.ok(!usa(l, 'palabra') && !usa(l, 'significado'), l.id);
  }
  for (const l of de('saludo_racha', 'pishku')) assert.ok((l.cuando?.nMin ?? 0) >= 2, l.id);
  for (const l of de('saludo_dia', 'pishku')) assert.ok(usa(l, 'palabra') && usa(l, 'significado'), l.id);
  assert.ok(de('saludo_regreso', 'uma').some(l => !usa(l, 'nombre')));
});

test('heroe: cada personaje cubre n=0, n=1 y n>=2', () => {
  for (const p of PERSONAJES) {
    for (const n of [0, 1, 2, 3, 5, 40]) {
      if (p === 'taita-rimay' && n > 5) continue;
      const r = elegirLinea({ personaje: p, momento: 'heroe', ctx: { n }, semilla: 0 });
      assert.ok(r, `heroe/${p} sin línea para n=${n}`);
      assert.doesNotMatch(r.texto, /\b1 (palabras|días|mundos|hilos)\b/);
    }
    const lineas = de('heroe', p);
    for (const n of [0, 1, 2]) {
      assert.ok(lineas.some(l => l.cuando && enRango(l.cuando, n)), `heroe/${p} n=${n}`);
    }
  }
  assert.ok(elegirLinea({ momento: 'saludo_repaso', personaje: 'chutun', ctx: { n: 1 }, semilla: 0 }));
  assert.ok(elegirLinea({ momento: 'saludo_repaso', personaje: 'chutun', ctx: { n: 4 }, semilla: 0 }));
});

test('toda línea con {n} tiene cuando y nunca acepta n<2 con plural', () => {
  for (const l of LINEAS.filter(l => usa(l, 'n'))) {
    assert.ok(l.cuando, `${l.id} usa {n} sin cuando`);
    assert.ok((l.cuando.nMin ?? -Infinity) >= 2, `${l.id} acepta n<2`);
  }
});

test('resolver reemplaza tokens', () => {
  assert.equal(resolver('{palabra} es {significado}, {nombre} ({n})', { palabra: 'X', significado: 'y', nombre: 'Ana', n: 3 }),
    'X es y, Ana (3)');
  assert.equal(resolver('n={n}', { n: 0 }), 'n=0');
});

test('elegirLinea respeta tokens: sin ctx no salen líneas con {palabra}', () => {
  for (let s = 0; s < 20; s++) {
    const r = elegirLinea({ momento: 'acierto', personaje: 'pishku', semilla: s });
    assert.ok(r);
    assert.doesNotMatch(r.texto, /\{|\}/);
    assert.ok(!usa(LINEAS.find(l => l.id === r.id), 'palabra'));
  }
  assert.equal(elegirLinea({ momento: 'fallo', personaje: 'chutun' }), null);
  assert.equal(elegirLinea({ momento: 'fallo', personaje: 'chutun', ctx: { palabra: 'X', significado: '' } }), null);
  const r = elegirLinea({ momento: 'fallo', personaje: 'chutun', ctx: { palabra: 'X', significado: 'y' }, semilla: 1 });
  assert.ok(r.texto.includes('X') && r.texto.includes('y'));
  assert.equal(r.animo, 'travieso');
  assert.equal(r.personaje, 'chutun');
});

test('elegirLinea respeta rangos de cuando', () => {
  assert.equal(elegirLinea({ momento: 'saludo_racha', personaje: 'pishku', ctx: { n: 1 } }), null);
  assert.equal(elegirLinea({ momento: 'saludo_racha', personaje: 'pishku' }), null);
  assert.equal(elegirLinea({ momento: 'heroe', personaje: 'uma', ctx: { n: 1 }, semilla: 0 }).id, 'heroe-uma-1');
  assert.equal(elegirLinea({ momento: 'heroe', personaje: 'uma', ctx: { n: 0 }, semilla: 0 }).id, 'heroe-uma-0');
  assert.equal(elegirLinea({ momento: 'heroe', personaje: 'uma', ctx: { n: 30 }, semilla: 0 }).id, 'heroe-uma-n');
  assert.equal(elegirLinea({ momento: 'heroe', personaje: 'taita-rimay', ctx: { n: 5 }, semilla: 0 }).id, 'heroe-taita-5');
});

test('elegirLinea: semilla determinista, ultima evitada, personaje con guion bajo', () => {
  const ctx = { palabra: 'X', significado: 'y' };
  const a = elegirLinea({ momento: 'fallo', personaje: 'chutun', ctx, semilla: 7 });
  const b = elegirLinea({ momento: 'fallo', personaje: 'chutun', ctx, semilla: 7 });
  assert.deepEqual(a, b);
  const cands = de('fallo', 'chutun');
  assert.equal(a.id, cands[7 % cands.length].id);
  for (let s = 0; s < 10; s++) {
    for (const ultima of cands.map(l => l.id)) {
      assert.notEqual(elegirLinea({ momento: 'fallo', personaje: 'chutun', ctx, ultima, semilla: s }).id, ultima);
      assert.notEqual(elegirLinea({ momento: 'fallo', personaje: 'chutun', ctx, ultima }).id, ultima);
    }
  }
  // única candidata: se repite aunque sea la última
  const solo = elegirLinea({ momento: 'heroe', personaje: 'kinti', ctx: { n: 0 }, ultima: 'heroe-kinti-0' });
  assert.equal(solo.id, 'heroe-kinti-0');
  assert.equal(elegirLinea({ momento: 'ayuda', personaje: 'taita_rimay', semilla: 0 }).personaje, 'taita-rimay');
  // sin personaje: cualquiera del momento
  const sinPj = elegirLinea({ momento: 'fin_exito', semilla: 3 });
  assert.equal(sinPj.animo, 'feliz');
  assert.equal(elegirLinea({ momento: 'no-existe' }), null);
});

test('ninguna línea resuelta supera 90 caracteres', () => {
  const pLarga = palabras.reduce((a, w) => (w.p.length > a.length ? w.p : a), '');
  const eLarga = palabras.reduce((a, w) => (w.e.length > a.length ? w.e : a), '').toLowerCase();
  const ctx = { nombre: 'N'.repeat(15), palabra: pLarga, significado: eLarga, n: 75 };
  for (const l of LINEAS) {
    const t = resolver(l.texto, ctx);
    assert.ok(t.length <= 90, `${l.id} (${t.length}): ${t}`);
    // Máximo 2 frases (las interjecciones "Ji, ji" / "¡Pío!" / "¡Oh!" no cuentan).
    const frases = t.split(/[.!?…]+/).map(s => s.replace(/[¡¿]/g, '').trim())
      .filter(s => s && !/^(ji|pío|oh|eso es)(,?\s*(ji|pío))*$/i.test(s));
    assert.ok(frases.length <= 2, `${l.id} demasiadas frases: ${t}`);
  }
});

test('sin términos prohibidos ni palabras del corpus escritas a mano', () => {
  const prohibidos = /\b(sagrad\w*|ritual\w*|ceremonia\w*|olvido|abandon\w*|fracaso|perdiste|mal|mayores|abuel\w*)\b/i;
  const corpus = palabras.map(w => w.p).filter(p => p.length >= 4);
  const escapar = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  for (const l of LINEAS) {
    assert.doesNotMatch(l.texto, prohibidos, l.id);
    assert.doesNotMatch(l.texto, /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, `${l.id} con emoji`);
    for (const p of corpus) {
      const re = new RegExp(`(?<![\\p{L}])${escapar(p)}(?![\\p{L}])`, 'u');
      assert.doesNotMatch(l.texto, re, `${l.id} contiene "${p}" escrito a mano`);
    }
  }
});
