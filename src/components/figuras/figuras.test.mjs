import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { montarComponente } from '../../test/componentHarness.mjs';
import { FIGURA_INFO } from '../../data/personajesUtil.js';

// react-native-svg simulado: cada elemento es un string con su nombre.
const svgMock = new Proxy({ __esModule: true }, {
  get: (obj, k) => (k in obj ? obj[k] : k === 'default' ? 'Svg' : String(k)),
});

const FIGURAS = {
  kinti: 'FiguraKinti',
  uma: 'FiguraUma',
  pishku: 'FiguraPishku',
  chutun: 'FiguraChutun',
  taita_rimay: 'FiguraTaitaRimay',
};
const ANIMOS = ['neutral', 'feliz', 'pensativo', 'sorprendido', 'travieso'];
const PROHIBIDOS = /^(Fe|Filter|Text|TSpan|TextPath|Mask|Pattern|Image|ForeignObject)/;

// Expande los subcomponentes (funciones) hasta dejar solo elementos SVG.
function expandir(nodo) {
  if (Array.isArray(nodo)) return nodo.map(expandir);
  if (!nodo || typeof nodo !== 'object') return nodo;
  if (typeof nodo.type === 'function') return expandir(nodo.type(nodo.props));
  return { ...nodo, props: { ...nodo.props, children: expandir(nodo.props?.children) } };
}

function tipos(nodo, out = new Map()) {
  if (Array.isArray(nodo)) { nodo.forEach(n => tipos(n, out)); return out; }
  if (!nodo || typeof nodo !== 'object') return out;
  out.set(nodo.type, (out.get(nodo.type) || 0) + 1);
  tipos(nodo.props?.children, out);
  return out;
}

function montar(nombre, props = {}, exportName = 'default') {
  const app = montarComponente(`src/components/figuras/${nombre}.js`, {
    props, exportName, mocks: { 'react-native-svg': svgMock },
  });
  return expandir(app.tree);
}

const firma = arbol => JSON.stringify(arbol);

for (const [clave, nombre] of Object.entries(FIGURAS)) {
  const info = FIGURA_INFO[clave];

  test(`${clave}: viewBox raíz = FIGURA_INFO (${info.ancho}x${info.alto})`, () => {
    const arbol = montar(nombre, { width: 100, height: 100 });
    assert.equal(arbol.type, 'Svg');
    const [x, y, w, h] = arbol.props.viewBox.trim().split(/\s+/).map(Number);
    assert.deepEqual([x, y, w, h], [0, 0, info.ancho, info.alto]);
  });

  test(`${clave}: los 5 ánimos y ojosCerrados se dibujan sin elementos prohibidos`, () => {
    const firmas = new Set();
    for (const animo of ANIMOS) {
      for (const ojosCerrados of [false, true]) {
        const arbol = montar(nombre, { width: 120, height: 120, animo, ojosCerrados });
        const usados = [...tipos(arbol).keys()];
        const malos = usados.filter(t => typeof t !== 'string' || PROHIBIDOS.test(t));
        assert.deepEqual(malos, [], `${animo}/${ojosCerrados}: ${malos.join(', ')}`);
        assert.ok((tipos(arbol).get('Path') || 0) > 10, 'la figura tiene trazos');
        firmas.add(firma(arbol));
      }
    }
    // Cada ánimo cambia la cara, y cerrar los ojos también.
    assert.ok(firmas.size >= 8, `solo ${firmas.size} variantes distintas`);
    const abierto = firma(montar(nombre, { animo: 'neutral' }));
    assert.notEqual(firma(montar(nombre, { animo: 'neutral', ojosCerrados: true })), abierto);
    assert.notEqual(firma(montar(nombre, { animo: 'feliz' })), abierto);
  });

  test(`${clave}: BUSTO_VIEWBOX es cuadrado y se aplica como viewBox`, () => {
    const fuente = fs.readFileSync(`src/components/figuras/${nombre}.js`, 'utf8');
    const busto = fuente.match(/export const BUSTO_VIEWBOX = '([^']+)'/)[1];
    const [, , w, h] = busto.split(/\s+/).map(Number);
    assert.equal(w, h);
    const arbol = montar(nombre, { width: 64, height: 64, viewBox: busto });
    assert.equal(arbol.props.viewBox, busto);
  });
}

test('pishku: sinAlaDelantera quita el ala y PishkuAlaDelantera la dibuja aparte', () => {
  const completo = tipos(montar('FiguraPishku', {})).get('Path');
  const sinAla = tipos(montar('FiguraPishku', { sinAlaDelantera: true })).get('Path');
  const ala = montar('FiguraPishku', { width: 50, height: 50 }, 'PishkuAlaDelantera');
  assert.ok(sinAla < completo);
  assert.equal(ala.type, 'Svg');
  assert.equal(ala.props.viewBox, `0 0 ${FIGURA_INFO.pishku.ancho} ${FIGURA_INFO.pishku.alto}`);
  assert.ok((tipos(ala).get('Path') || 0) > 0);
});

// ── Integración en PersonajeVivo (parpadeo y ala de Pishku) ──
function animatedMock() {
  class Value {
    constructor(v) { this.v = v; }
    setValue(v) { this.v = v; }
    interpolate(cfg) { return { interpolado: cfg }; }
  }
  const anim = () => ({ start() {}, stop() {} });
  return {
    Value, timing: anim, loop: anim, sequence: anim, parallel: anim, delay: anim,
    View: 'Animated.View',
  };
}

function montarVivo(personaje, reduce = false) {
  const rn = {
    View: 'View', Pressable: 'Pressable', StyleSheet: { create: s => s, absoluteFill: {} },
    Animated: animatedMock(),
    AccessibilityInfo: { isReduceMotionEnabled: () => Promise.resolve(reduce) },
    Easing: { inOut: f => f, sin: x => x },
  };
  return montarComponente('src/components/PersonajeVivo.js', {
    props: { personaje, tamano: 100, animo: 'feliz' },
    mocks: { 'react-native': rn, 'react-native-svg': svgMock },
  });
}

const buscarTodos = (nodo, pred, out = []) => {
  if (Array.isArray(nodo)) { nodo.forEach(n => buscarTodos(n, pred, out)); return out; }
  if (!nodo || typeof nodo !== 'object') return out;
  if (pred(nodo)) out.push(nodo);
  buscarTodos(nodo.props?.children, pred, out);
  return out;
};
// Capa Animated.View que contiene directamente al ala.
const capaDelAla = (arbol, ala) => buscarTodos(arbol, n => n.type === 'Animated.View'
  && [].concat(n.props.children).includes(ala))[0];
const figuraEn = arbol => buscarTodos(arbol, n => typeof n.type === 'function' && 'ojosCerrados' in (n.props || {}))[0];

test('PersonajeVivo dibuja la figura vectorial con su ánimo y parpadea', async () => {
  const app = montarVivo('kinti');
  await app.settle();
  let fig = figuraEn(app.tree);
  assert.equal(fig.type.name, 'FiguraKinti');
  assert.equal(fig.props.animo, 'feliz');
  assert.equal(fig.props.ojosCerrados, false);
  assert.equal(buscarTodos(app.tree, n => n.type === 'Image').length, 0);

  const t0 = new Date(2026, 8, 5, 12).getTime();
  app.setTime(new Date(t0 + 5001));
  app.fireTimers();
  assert.equal(figuraEn(app.tree).props.ojosCerrados, true);
  app.setTime(new Date(t0 + 5001 + 140));
  app.fireTimers();
  fig = figuraEn(app.tree);
  assert.equal(fig.props.ojosCerrados, false);
  assert.equal(app.timers, 1, 'queda programado el siguiente parpadeo');
  app.unmount();
  app.fireTimers();
});

test('PersonajeVivo de Pishku separa el ala delantera en una capa que gira sobre el hombro', async () => {
  const app = montarVivo('pishku');
  await app.settle();
  const fig = figuraEn(app.tree);
  assert.equal(fig.type.name, 'FiguraPishku');
  assert.equal(fig.props.sinAlaDelantera, true);
  const ala = buscarTodos(app.tree, n => typeof n.type === 'function' && n.type.name === 'PishkuAlaDelantera')[0];
  assert.ok(ala);
  const capa = capaDelAla(app.tree, ala);
  assert.ok(capa);
  const estilo = Object.assign({}, ...[].concat(capa.props.style).filter(Boolean));
  assert.ok(Array.isArray(estilo.transformOrigin));
  assert.equal(estilo.transform.length, 1);
  assert.ok(estilo.transform[0].rotate);
  assert.ok(capa, 'el ala gira en su propia capa animada');
});

test('PersonajeVivo con reducir movimiento mantiene el parpadeo pero el ala no aletea', async () => {
  const app = montarVivo('pishku', true);
  await app.settle();
  assert.ok(app.timers >= 1);
  const ala = buscarTodos(app.tree, n => typeof n.type === 'function' && n.type.name === 'PishkuAlaDelantera')[0];
  assert.ok(ala);
  const capa = capaDelAla(app.tree, ala);
  const estilo = Object.assign({}, ...[].concat(capa.props.style).filter(Boolean));
  assert.equal(estilo.transform.length, 0, 'sin aleteo');
});

test('RetratoMini dibuja el busto vectorial cuadrado', () => {
  const app = montarComponente('src/components/RetratosPersonaje.js', {
    props: { personaje: 'taita-rimay', size: 40 },
    mocks: { 'react-native-svg': svgMock },
  });
  const fig = app.tree.props.children[0];
  assert.equal(fig.type.name, 'FiguraTaitaRimay');
  assert.equal(fig.props.width, 40);
  assert.equal(fig.props.height, 40);
  assert.equal(fig.props.viewBox, '143 66 150 150');
});
