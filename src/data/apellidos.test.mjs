import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APELLIDOS } from './apellidos.js';
import { buscarApellidos, normalizarApellido, indiceApellidos, partesDe, lecturaApellido } from './apellidosLogica.js';

const sinTilde = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const FUENTE = /^(Lengua de los Pastos \(ANH, 2015\), pp?\. \d|AUKUSAN, pp?\. \d+(-\d+)? del PDF)/;

test('cada apellido se forma con sus piezas, cita su fuente y no repite formas', () => {
  assert.ok(APELLIDOS.length >= 40);
  const formas = new Set();
  for (const a of APELLIDOS) {
    for (const f of [a.apellido, ...(a.variantes || [])]) {
      const k = normalizarApellido(f);
      assert.ok(!formas.has(k), `forma repetida ${f}`);
      formas.add(k);
    }
    assert.match(a.fuente, FUENTE, a.apellido);
    if (a.piezas.length) {
      assert.equal(sinTilde(a.piezas.map(p => p.t).join('')), sinTilde(a.apellido), a.apellido);
      assert.ok(a.traduccion, `traducción de ${a.apellido}`);
      for (const p of a.piezas) if (!p.enlace) assert.ok(p.sig, `sig de ${p.t} en ${a.apellido}`);
    } else {
      assert.ok(a.totem, `${a.apellido} sin piezas debe al menos traer tótem`);
    }
    if (a.totem) assert.equal(a.fuenteTotem, 'AUKUSAN, p. 148 del PDF');
    if (a.otraLectura) assert.match(a.otraLectura.fuente, FUENTE);
    const txt = sinTilde(`${a.traduccion} ${a.otraLectura?.traduccion || ''} ${a.piezas.map(p => p.sig || '').join(' ')}`);
    for (const w of ['olvido', 'fracaso', 'perdiste', 'mal']) assert.ok(!new RegExp(`(?<![\\p{L}])${w}(?![\\p{L}])`, 'u').test(txt), `${w} en ${a.apellido}`);
  }
  for (const excluido of ['Tapia', 'Pinchao']) assert.ok(!formas.has(normalizarApellido(excluido)), `${excluido} está excluido`);
});

test('los tótems que da el AUKUSAN quedan en su apellido', () => {
  const t = Object.fromEntries(APELLIDOS.filter(a => a.totem).map(a => [a.apellido, a.totem]));
  assert.deepEqual(t, { Aramues: 'águila', Cuaspud: 'agua', Ipaz: 'fuego', Tepud: 'bejuco' });
});

test('la búsqueda ignora mayúsculas y tildes, acepta variantes y dos apellidos', () => {
  const r = buscarApellidos('  CUASPUD tarapues ', APELLIDOS);
  assert.deepEqual(r.encontrados.map(e => e.entrada.apellido), ['Cuaspud', 'Tarapués']);
  assert.deepEqual(r.noEncontrados, []);
  assert.equal(buscarApellidos('Kuaspud', APELLIDOS).encontrados[0].entrada.apellido, 'Cuaspud');
  const otro = buscarApellidos('Pérez Cuaspud cuaspud', APELLIDOS);
  assert.deepEqual(otro.noEncontrados, ['Pérez']);
  assert.equal(otro.encontrados.length, 1, 'repetido cuenta una vez');
  assert.deepEqual(buscarApellidos('', APELLIDOS), { encontrados: [], noEncontrados: [] });
  assert.deepEqual(partesDe('Cuaspud-Tepud / a'), ['Cuaspud', 'Tepud']);
  assert.equal(indiceApellidos(APELLIDOS).size >= APELLIDOS.length, true);
  assert.deepEqual(lecturaApellido(APELLIDOS.find(a => a.apellido === 'Cuaspud')), ['señor, cerro', 'agua']);
});

test('un apellido y su variante cuentan una vez; partículas y números no se buscan', () => {
  assert.equal(buscarApellidos('Tapie Tapies', APELLIDOS).encontrados.length, 1);
  assert.equal(buscarApellidos('Cuaspud Kuaspud', APELLIDOS).encontrados.length, 1);
  assert.deepEqual(buscarApellidos('Cuaspud de la Cruz', APELLIDOS).noEncontrados, ['Cruz']);
  assert.deepEqual(partesDe('123 -- de la'), []);
});

test('Ipaz usa la lectura de la ANH y guarda la del AUKUSAN como otra lectura', () => {
  const ipaz = APELLIDOS.find(a => a.apellido === 'Ipaz');
  assert.equal(ipaz.traduccion, 'Familia apartada');
  assert.match(ipaz.fuente, /ANH, 2015\), p\. 73/);
  assert.equal(ipaz.otraLectura.traduccion, 'Familia del fuego');
  assert.equal(ipaz.totem, 'fuego');
});
