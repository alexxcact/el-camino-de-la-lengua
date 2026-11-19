import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RAICES, TIPOS_RAIZ } from './raices.js';
import {
  rondaRaices, fichasDe, huecosIniciales, colocar, quitar, esCorrecta, completos, lecturaDerechaIzquierda,
} from './raicesLogica.js';

const sinTilde = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const PROHIBIDAS = ['olvido', 'fracaso', 'perdiste', 'mal'];

test('cada palabra de Raíces se forma exactamente con sus piezas y cita su fuente', () => {
  assert.ok(RAICES.length >= 30);
  const vistas = new Set();
  for (const r of RAICES) {
    assert.ok(!vistas.has(r.palabra), `repetida ${r.palabra}`);
    vistas.add(r.palabra);
    assert.equal(sinTilde(r.piezas.map(p => p.t).join('')), sinTilde(r.palabra), r.palabra);
    assert.ok(TIPOS_RAIZ[r.tipo], `tipo de ${r.palabra}`);
    assert.ok(r.piezas.filter(p => !p.enlace).length >= 2, `${r.palabra} necesita 2 piezas`);
    for (const p of r.piezas) {
      if (p.enlace) assert.ok(p.t.length <= 2, `enlace corto en ${r.palabra}`);
      else assert.ok(p.sig && p.sig.length <= 20, `significado de ${p.t} en ${r.palabra}`);
    }
    assert.match(r.fuente, /^(Lengua de los Pastos \(ANH, 2015\)|AUKUSAN), pp?\. \d/);
    const txt = sinTilde(`${r.traduccion} ${r.piezas.map(p => p.sig || '').join(' ')}`);
    for (const w of PROHIBIDAS) assert.ok(!new RegExp(`\b${w}\b`).test(txt), `${w} en ${r.palabra}`);
  }
});

test('las fichas traen todas las piezas propias y señuelos que no se confunden', () => {
  for (const r of RAICES) {
    for (const semilla of [1, 2, 3]) {
      const fichas = fichasDe(r, RAICES, 2, semilla);
      const propias = fichas.filter(f => f.clave.startsWith('p'));
      assert.equal(propias.length, r.piezas.filter(p => !p.enlace).length);
      const textos = new Set(r.piezas.map(p => p.t.toLowerCase()));
      for (const s of fichas.filter(f => f.clave.startsWith('s'))) {
        assert.ok(!textos.has(s.t.toLowerCase()), `señuelo igual en ${r.palabra}`);
        const sentidosPropios = r.piezas.filter(p => !p.enlace).map(p => p.sig);
        assert.ok(!sentidosPropios.includes(s.sig), `señuelo ${s.t}=${s.sig} confunde en ${r.palabra}`);
      }
      // Agua / río / quebrada nunca compiten entre sí.
      const esAgua = (sig) => (sig || '').split(/[\s,:]+/).some(w => ['agua', 'río', 'quebrada'].includes(w));
      const aguas = fichas.filter(f => esAgua(f.sig));
      const propiasAgua = r.piezas.filter(p => !p.enlace && esAgua(p.sig));
      if (propiasAgua.length) assert.equal(aguas.length, propiasAgua.length, `señuelo de agua en ${r.palabra}`);
    }
  }
});

test('armar Imues: el enlace viene puesto, se colocan, se quitan y se comprueba', () => {
  const imues = RAICES.find(r => r.palabra === 'Imues');
  let h = huecosIniciales(imues);
  assert.equal(h[0].t, 'I');
  assert.equal(quitar(h, 0), h, 'el enlace no se quita');
  const fichas = fichasDe(imues, RAICES, 2, 5);
  const mu = fichas.find(f => f.t === 'mu');
  const es = fichas.find(f => f.t === 'es');
  h = colocar(h, es);
  h = colocar(h, mu);
  assert.ok(completos(h));
  assert.equal(esCorrecta(imues, h), false, 'orden al revés');
  h = quitar(quitar(h, 1), 2);
  h = colocar(colocar(h, mu), es);
  assert.equal(esCorrecta(imues, h), true);
  assert.equal(colocar(h, mu), h, 'no se coloca dos veces');
  assert.deepEqual(lecturaDerechaIzquierda(imues), ['agua', 'escondido']);
});

test('una ronda prefiere las palabras que aún no se armaron', () => {
  const armadas = RAICES.slice(0, RAICES.length - 3).map(r => r.palabra);
  const ronda = rondaRaices(RAICES, armadas, 5, 9);
  assert.equal(ronda.length, 5);
  const nuevas = ronda.filter(r => !armadas.includes(r.palabra));
  assert.equal(nuevas.length, 3);
  assert.ok(ronda.slice(0, 3).every(r => !armadas.includes(r.palabra)));
});
