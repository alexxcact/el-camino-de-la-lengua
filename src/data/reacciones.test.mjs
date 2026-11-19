import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reaccionPara, cierreSinAprobar, numeroDe, diasEntre, elegirSaludo } from './reacciones.js';
import { palabras } from './datos.js';

const ID = palabras[0].id;
const base = { palabraId: ID, estabaFallada: false, fallosSeguidos: 0, permitirDominada: true, ultima: null };

test('un fallo: la Niebla esconde la palabra', () => {
  const r = reaccionPara({ ...base, acerto: false, fallosSeguidos: 1 });
  assert.equal(r.personaje, 'chutun');
  assert.equal(r.momento, 'fallo');
  assert.ok(r.texto.includes(palabras[0].p));
});

test('2 fallos seguidos: ayuda del guía; 3: ayuda de la tejedora', () => {
  const dos = reaccionPara({ ...base, acerto: false, fallosSeguidos: 2 });
  assert.equal(dos.personaje, 'taita-rimay');
  assert.equal(dos.momento, 'ayuda');
  const tres = reaccionPara({ ...base, acerto: false, fallosSeguidos: 3 });
  assert.equal(tres.personaje, 'uma');
  assert.equal(tres.momento, 'ayuda');
});

test('acierto de una palabra fallada: dominada; sin permiso, el Ave celebra', () => {
  const dom = reaccionPara({ ...base, acerto: true, estabaFallada: true });
  assert.equal(dom.personaje, 'chutun');
  assert.equal(dom.momento, 'dominada');
  const ave = reaccionPara({ ...base, acerto: true, estabaFallada: true, permitirDominada: false });
  assert.equal(ave.personaje, 'pishku');
  assert.equal(ave.momento, 'acierto');
});

test('palabraId inexistente: solo quedan líneas sin tokens de palabra', () => {
  const r = reaccionPara({ ...base, palabraId: 99999, acerto: false, fallosSeguidos: 2 });
  assert.ok(r, 'la ayuda sin tokens sigue siendo elegible');
  assert.ok(!/\{/.test(r.texto));
  assert.equal(reaccionPara({ ...base, palabraId: 99999, acerto: false, fallosSeguidos: 1 }), null);
});

test('cierreSinAprobar: sin falladas habla el guía; con falladas, la Niebla', () => {
  assert.equal(cierreSinAprobar([], 'Ana').personaje, 'taita-rimay');
  const n = cierreSinAprobar([ID], 'Ana');
  assert.equal(n.personaje, 'chutun');
  assert.ok(n.texto.includes(palabras[0].p));
});

test('numeroDe: cada personaje cuenta lo suyo', () => {
  const estado = {
    racha: 9, palabrasVistas: new Set([1, 2, 3]), palabrasFalladas: [4, 5],
    mundosCompletados: new Set([1]),
  };
  assert.equal(numeroDe('kinti', estado), palabras.length - 3);
  assert.equal(numeroDe('uma', estado), 3);
  assert.equal(numeroDe('chutun', estado), 2);
  assert.equal(numeroDe('taita-rimay', estado), 1);
  assert.equal(numeroDe('pishku', estado), 9);
  assert.equal(numeroDe('pishku', estado, 0), 0, 'la racha vigente manda');
});

test('diasEntre cuenta días enteros y rechaza fechas inválidas', () => {
  assert.equal(diasEntre('2026-09-01', '2026-09-05'), 4);
  assert.equal(diasEntre('2026-09-05', '2026-09-05'), 0);
  assert.equal(diasEntre(null, '2026-09-05'), null);
});

test('elegirSaludo: prioridad repaso > racha > regreso > palabra del día', () => {
  const comun = { hoy: '2026-09-05', palabraDiaId: ID, nombre: 'Ana', semilla: 1 };
  const lejos = ['2026-09-01'];
  const repaso = elegirSaludo({ ...comun, nFalladas: 2, racha: 5, diasActivos: lejos });
  assert.equal(repaso.linea.personaje, 'chutun');
  assert.equal(repaso.accion, 'repaso');

  const racha = elegirSaludo({ ...comun, racha: 5, diasActivos: lejos, retoDisponible: true });
  assert.equal(racha.linea.personaje, 'pishku');
  assert.equal(racha.accion, 'reto');
  assert.equal(elegirSaludo({ ...comun, racha: 5 }).accion, null);

  const regreso = elegirSaludo({ ...comun, racha: 0, diasActivos: lejos });
  assert.equal(regreso.linea.personaje, 'uma');

  const dia = elegirSaludo({ ...comun, racha: 1, diasActivos: ['2026-09-04', '2026-09-05'] });
  assert.equal(dia.linea.personaje, 'pishku');
  assert.ok(dia.linea.texto.includes(palabras[0].p));
});
