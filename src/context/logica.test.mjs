// Tests de la lógica pura del estado del juego (runner integrado de Node: `node --test`).
// Cubren las invariantes que NO se deben romper: serialización de Sets, merge con
// defaults, racha diaria, días activos, semilla de la palabra del día, niveles y
// las condiciones de los logros.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  estadoInicial,
  niveles,
  calcularNivel,
  fechaISO,
  fechaHoy,
  fechaAyer,
  msHastaMedianoche,
  normalizarHora,
  seedFecha,
  MAX_DIAS_ACTIVOS,
  agregarDiaActivo,
  aplicarSesion,
  serializarEstado,
  hidratarEstado,
} from './logica.js';

import { logros } from '../data/datos.js';

// Estado "de juego real" a partir de los defaults, con algunos Sets poblados.
function estadoDemo() {
  const e = hidratarEstado(null);
  e.puntos = 42;
  e.palabrasVistas = new Set([1, 2, 3]);
  e.mundosCompletados = new Set([1, 2]);
  e.misionesCompletadas = new Set(['quiz-1', 'escucha-1']);
  e.logrosDesbloqueados = new Set(['primera-palabra']);
  e.diasActivos = ['2026-07-01', '2026-07-02'];
  e.cinematicasVistas = ['mundo1'];
  e.avatar = { piel: 1, ropa: 2, sombrero: 0, accesorio: 1 };
  return e;
}

// ─── Serialización de Sets ↔ arrays ───

test('serializarEstado convierte los 4 Sets en arrays y no deja Sets', () => {
  const s = serializarEstado(estadoDemo());
  for (const k of ['palabrasVistas', 'mundosCompletados', 'misionesCompletadas', 'logrosDesbloqueados']) {
    assert.ok(Array.isArray(s[k]), `${k} debería ser array`);
  }
  // Debe poder pasar por JSON sin perder datos (los Sets se perderían silenciosamente).
  const json = JSON.stringify(s);
  assert.ok(json.includes('"palabrasVistas":[1,2,3]'));
});

test('round-trip serializar → JSON → parse → hidratar conserva el estado', () => {
  const original = estadoDemo();
  const revivido = hidratarEstado(JSON.parse(JSON.stringify(serializarEstado(original))));

  // Los Sets vuelven a ser Sets con los mismos miembros.
  for (const k of ['palabrasVistas', 'mundosCompletados', 'misionesCompletadas', 'logrosDesbloqueados']) {
    assert.ok(revivido[k] instanceof Set, `${k} debería reconstruirse como Set`);
    assert.deepEqual([...revivido[k]].sort(), [...original[k]].sort());
  }
  // Escalares y objetos planos intactos.
  assert.equal(revivido.puntos, 42);
  assert.deepEqual(revivido.avatar, original.avatar);
  assert.deepEqual(revivido.diasActivos, original.diasActivos);
  assert.deepEqual(revivido.cinematicasVistas, original.cinematicasVistas);
});

// ─── hidratarEstado: defaults y merge de usuarios viejos ───

test('hidratarEstado(null) devuelve el estado inicial con Sets vacíos y frescos', () => {
  const e = hidratarEstado(null);
  assert.ok(e.palabrasVistas instanceof Set && e.palabrasVistas.size === 0);
  assert.ok(e.mundosCompletados instanceof Set && e.mundosCompletados.size === 0);
  assert.deepEqual(e.diasActivos, []);
  assert.deepEqual(e.cinematicasVistas, []);
  assert.equal(e.puntos, 0);
  assert.equal(e.nombreJugador, null);
  // No debe compartir la referencia del Set del estadoInicial (evita mutación cruzada).
  assert.notEqual(e.palabrasVistas, estadoInicial.palabrasVistas);
});

test('hidratarEstado mergea campos nuevos a default para un usuario viejo', () => {
  // Guardado "antiguo": solo tenía puntos y palabrasVistas, sin campos recientes.
  const viejo = { puntos: 8, palabrasVistas: [5, 6] };
  const e = hidratarEstado(viejo);
  assert.equal(e.puntos, 8);
  assert.deepEqual([...e.palabrasVistas].sort(), [5, 6]);
  // Campos nuevos rellenados con defaults seguros.
  assert.equal(e.duelosJugados, 0);
  assert.equal(e.horaNotificacion, 16);
  assert.deepEqual(e.avatar, { piel: 0, ropa: 0, sombrero: 0, accesorio: 1 - 1 }); // {0,0,0,0}
  assert.deepEqual(e.avatarDesbloqueados, { ropa: [0], sombrero: [0], accesorio: [0] });
  assert.deepEqual(e.diasActivos, []);
});

test('hidratarEstado corrige diasActivos/cinematicasVistas si no son arrays', () => {
  const e = hidratarEstado({ diasActivos: 'corrupto', cinematicasVistas: null });
  assert.deepEqual(e.diasActivos, []);
  assert.deepEqual(e.cinematicasVistas, []);
});

test('hidratarEstado hace merge profundo del avatar (mantiene lo guardado, completa lo faltante)', () => {
  const e = hidratarEstado({ avatar: { ropa: 3 } });
  assert.deepEqual(e.avatar, { piel: 0, ropa: 3, sombrero: 0, accesorio: 0 });
});

// ─── Racha diaria (aplicarSesion) ───

test('aplicarSesion: misma sesión del día no cambia nada', () => {
  const base = { ...hidratarEstado(null), ultimaSesion: fechaHoy(), racha: 4, palabrasHoy: 7 };
  const r = aplicarSesion(base);
  assert.equal(r, base); // devuelve la misma referencia
  assert.equal(r.racha, 4);
  assert.equal(r.palabrasHoy, 7);
});

test('aplicarSesion: jugó ayer → racha +1 y palabrasHoy se reinicia', () => {
  const base = { ...hidratarEstado(null), ultimaSesion: fechaAyer(), racha: 4, palabrasHoy: 7 };
  const r = aplicarSesion(base);
  assert.equal(r.racha, 5);
  assert.equal(r.palabrasHoy, 0);
  assert.equal(r.ultimaSesion, fechaHoy());
});

test('aplicarSesion: hueco de días → racha vuelve a 1', () => {
  const base = { ...hidratarEstado(null), ultimaSesion: '2000-01-01', racha: 9, mejorRacha: 9 };
  const r = aplicarSesion(base);
  assert.equal(r.racha, 1);
  assert.equal(r.mejorRacha, 9); // mejorRacha no baja
});

test('aplicarSesion: mejorRacha se actualiza cuando la racha nueva la supera', () => {
  const base = { ...hidratarEstado(null), ultimaSesion: fechaAyer(), racha: 6, mejorRacha: 6 };
  const r = aplicarSesion(base);
  assert.equal(r.racha, 7);
  assert.equal(r.mejorRacha, 7);
});

// ─── Días activos ───

test('la siguiente medianoche usa la fecha local y cruza fin de mes y año', () => {
  assert.equal(msHastaMedianoche(new Date(2026, 8, 5, 23, 59, 59, 500)), 500);
  assert.equal(msHastaMedianoche(new Date(2026, 8, 30, 23, 59)), 60000);
  assert.equal(msHastaMedianoche(new Date(2026, 11, 31, 23, 59)), 60000);
  assert.ok(msHastaMedianoche(new Date(2026, 8, 6, 0, 0)) > 0);
});

test('normalizarHora conserva medianoche y las 24 horas seleccionables', () => {
  for (let hora = 0; hora < 24; hora++) {
    assert.equal(normalizarHora(hora), hora);
    assert.equal(normalizarHora(String(hora)), hora);
  }
  assert.equal(normalizarHora(-1), 0);
  assert.equal(normalizarHora(24), 23);
  for (const invalida of [null, undefined, '', 'no es una hora']) {
    assert.equal(normalizarHora(invalida), 16);
  }
});

test('agregarDiaActivo añade hoy una sola vez (idempotente)', () => {
  const base = hidratarEstado(null);
  const a = agregarDiaActivo(base);
  assert.deepEqual(a.diasActivos, [fechaHoy()]);
  const b = agregarDiaActivo(a);
  assert.equal(b, a); // ya estaba hoy → misma referencia, sin duplicar
});

test('agregarDiaActivo recorta el historial a MAX_DIAS_ACTIVOS', () => {
  // 90 fechas antiguas distintas (ninguna es hoy) + hoy = 91 → debe quedar en 90.
  const viejas = Array.from({ length: MAX_DIAS_ACTIVOS }, (_, i) => `2020-01-${String((i % 28) + 1).padStart(2, '0')}#${i}`);
  const r = agregarDiaActivo({ ...hidratarEstado(null), diasActivos: viejas });
  assert.equal(r.diasActivos.length, MAX_DIAS_ACTIVOS);
  assert.equal(r.diasActivos[r.diasActivos.length - 1], fechaHoy()); // hoy es el más reciente
  assert.equal(r.diasActivos.includes(viejas[0]), false);            // se cayó el más viejo
});

// ─── seedFecha (palabra del día determinística) ───

test('seedFecha es determinística y entera no negativa', () => {
  assert.equal(seedFecha('2026-07-19'), seedFecha('2026-07-19'));
  assert.notEqual(seedFecha('2026-07-19'), seedFecha('2026-07-20'));
  assert.ok(Number.isInteger(seedFecha('2026-07-19')));
  assert.ok(seedFecha('2026-07-19') >= 0);
});

// ─── Fechas / niveles ───

test('fechaISO formatea con ceros a la izquierda', () => {
  assert.equal(fechaISO(new Date(2026, 0, 5)), '2026-01-05'); // mes 0 = enero
});

test('calcularNivel respeta los umbrales de niveles', () => {
  assert.equal(calcularNivel(0), 1);
  assert.equal(calcularNivel(9), 1);
  assert.equal(calcularNivel(10), 2);
  assert.equal(calcularNivel(49), 4);
  assert.equal(calcularNivel(50), niveles.length); // 5
});

// ─── Condiciones de los logros (datos.js) ───

test('ningún logro.cond lanza excepción con el estado inicial', () => {
  const e = hidratarEstado(null);
  for (const l of logros) {
    assert.doesNotThrow(() => l.cond(e), `logro ${l.id} lanzó con estado inicial`);
  }
});

test('con el estado inicial no se desbloquea ningún logro', () => {
  const e = hidratarEstado(null);
  assert.equal(logros.filter(l => l.cond(e)).length, 0);
});

test('condiciones concretas de logros por progreso', () => {
  const cond = (id) => logros.find(l => l.id === id).cond;

  const e = hidratarEstado(null);
  e.palabrasVistas = new Set([1]);
  assert.equal(cond('primera-palabra')(e), true);
  assert.equal(cond('explorador')(e), false);

  e.palabrasVistas = new Set(Array.from({ length: 10 }, (_, i) => i + 1));
  assert.equal(cond('explorador')(e), true);

  e.mundosCompletados = new Set([1]);
  assert.equal(cond('warmi-urku')(e), true);
  assert.equal(cond('camino-completo')(e), false);
});

test('logro "oído fino" cuenta misiones de escucha completadas', () => {
  const cond = logros.find(l => l.id === 'oido-fino').cond;
  const e = hidratarEstado(null);
  e.misionesCompletadas = new Set(['escucha-1', 'escucha-2', 'escucha-3', 'escucha-4', 'quiz-1']);
  assert.equal(cond(e), false); // solo 4 de escucha
  e.misionesCompletadas.add('escucha-5');
  assert.equal(cond(e), true);  // ya 5
});

test('logro "El Camino Completo" y "Taita de la Lengua" con progreso máximo', () => {
  const e = hidratarEstado(null);
  e.mundosCompletados = new Set([1, 2, 3, 4, 5]);
  e.palabrasVistas = new Set(Array.from({ length: 75 }, (_, i) => i + 1));
  assert.equal(logros.find(l => l.id === 'camino-completo').cond(e), true);
  assert.equal(logros.find(l => l.id === 'taita-lengua').cond(e), true);
});
