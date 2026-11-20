import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PETROGLIFOS, COLECCIONABLES, petroglifoDelLugar } from './petroglifos.js';
import { hidratarEstado, serializarEstado, estadoInicial } from '../context/logica.js';
import { montarComponente, buscarNodo } from '../test/componentHarness.mjs';

test('petroglifos: trazos válidos, un lugar por figura y el Sol no se colecciona', () => {
  const lugares = new Set();
  for (const p of PETROGLIFOS) {
    assert.match(p.d, /^M/);
    assert.doesNotMatch(p.d, /NaN|undefined/);
    for (const n of p.d.match(/-?\d+(\.\d+)?/g)) assert.ok(+n >= 0 && +n <= Math.max(p.ancho, p.alto) + 1, `${p.id}: ${n}`);
    if (p.lugar) { assert.ok(!lugares.has(p.lugar), `lugar repetido ${p.lugar}`); lugares.add(p.lugar); }
  }
  assert.equal(PETROGLIFOS.find(p => p.id === 'sol').lugar, null, 'el Sol es sagrado: solo emblema');
  assert.equal(COLECCIONABLES.length, 9);
  for (const l of ['mundo1', 'mundo2', 'mundo3', 'mundo4', 'mundo5', 'juegos', 'mapa', 'duelo', 'raices']) assert.ok(petroglifoDelLugar(l), l);
  for (const id of ['perdiz', 'machin']) {
    const p = PETROGLIFOS.find(x => x.id === id);
    assert.match(p.nota, /Cartilla 4 «Tejido de los Pastos», p\. 8/);
    assert.ok(p.capas.length >= 1 && p.capas.every(c => /^#[0-9A-F]{6}$/.test(c.color) && c.d.startsWith('M')), `capas de ${id}`);
  }
});

test('los petroglifos encontrados se guardan y un estado viejo carga sin ellos', () => {
  const plano = JSON.parse(JSON.stringify(serializarEstado({ ...estadoInicial, petroglifosEncontrados: ['venado'] })));
  assert.deepEqual(hidratarEstado(plano).petroglifosEncontrados, ['venado']);
  const viejo = JSON.parse(JSON.stringify(serializarEstado(estadoInicial)));
  delete viejo.petroglifosEncontrados;
  assert.deepEqual(hidratarEstado(viejo).petroglifosEncontrados, []);
});

function montarEscondido(encontrados = []) {
  const llamadas = [];
  const app = montarComponente('src/components/PetroglifoEscondido.js', {
    props: { lugar: 'mundo1' },
    mocks: {
      'react-native': {
        View: 'View', Text: 'Text', TouchableOpacity: 'TouchableOpacity', StyleSheet: { create: s => s },
        Animated: { View: 'AnimatedView', Value: class { constructor(v) { this.v = v; } setValue() {} interpolate() { return 1; } }, spring: () => ({ start() {} }) },
      },
      './Petroglifo': 'Petroglifo',
      '../context/JuegoContext': { useJuego: () => ({ estado: { petroglifosEncontrados: encontrados }, descubrirPetroglifo: (id) => llamadas.push(id) }) },
      '../utils/sonidos': { sonar: { acierto() {} } },
      '../utils/feedback': { vibrar: { exito() {} } },
    },
  });
  return { app, llamadas };
}

test('tocar el petroglifo escondido lo descubre y avisa; si ya estaba, no hace nada', () => {
  const { app, llamadas } = montarEscondido();
  const boton = buscarNodo(app.tree, n => n.type === 'TouchableOpacity');
  assert.equal(boton.props.accessibilityLabel, 'Algo está tallado en la piedra');
  boton.props.onPress();
  assert.deepEqual(llamadas, ['venado']);
  assert.ok(buscarNodo(app.tree, n => n.type === 'Text' && [].concat(n.props.children).join('') === '¡Encontraste un petroglifo!'));
  app.unmount();
  const otro = montarEscondido(['venado']);
  const b2 = buscarNodo(otro.app.tree, n => n.type === 'TouchableOpacity');
  assert.equal(b2.props.disabled, true);
  assert.match(b2.props.accessibilityLabel, /Petroglifo encontrado: El venado/);
  otro.app.unmount();
});

test('la piedra de los petroglifos cuenta los encontrados y da pistas de los que faltan', () => {
  const app = montarComponente('src/components/PiedraPetroglifos.js', {
    props: { encontrados: ['venado', 'mono'] },
    mocks: { './Petroglifo': 'Petroglifo' },
  });
  const textos = [];
  buscarNodo(app.tree, n => { if (n.type === 'Text') textos.push([].concat(n.props.children).join('')); return false; });
  assert.ok(textos.some(t => t.startsWith('2 de 9 encontrados')));
  const celdas = [];
  buscarNodo(app.tree, n => { if (n.type === 'TouchableOpacity') celdas.push(n.props.accessibilityLabel); return false; });
  assert.ok(celdas.includes('El venado'));
  assert.ok(celdas.includes('Petroglifo por encontrar. En el mundo Piar'));
  assert.ok(celdas.includes('Petroglifo por encontrar. Al final del camino, en el mapa'));
  assert.ok(celdas.includes('Petroglifo por encontrar. En el Duelo de 2'));
  assert.ok(celdas.includes('Petroglifo por encontrar. En Raíces de la palabra'));
  app.unmount();
});
