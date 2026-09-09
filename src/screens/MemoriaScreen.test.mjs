import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarComponente, buscarNodo } from '../test/componentHarness.mjs';

function memoria() {
  const completadas = [];
  let perfectas = 0;
  const noop = () => {};
  const nativos = {
    View: 'View', Text: 'Text', TouchableOpacity: 'TouchableOpacity', ScrollView: 'ScrollView',
    StyleSheet: {
      create: s => s,
      absoluteFillObject: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
    },
    Animated: {
      View: 'Animated.View',
      Value: class { interpolate(config) { return config; } },
      timing: () => ({ start: noop, stop: noop }),
    },
  };
  const app = montarComponente('src/screens/MemoriaScreen.js', {
    props: { route: { params: { mundoId: 1 } }, navigation: { goBack: noop } },
    mocks: {
      'react-native': nativos,
      '../context/JuegoContext': { useJuego: () => ({
        estado: {}, ganarPuntos: noop, verificarLogros: noop,
        completarMision: id => completadas.push(id),
        marcarMemoriaPerfecta: () => { perfectas++; },
      }) },
      '../utils/sonidos': { sonar: { pop: noop, acierto: noop, error: noop, mision: noop } },
      '../utils/feedback': { vibrar: { suave: noop, error: noop, exito: noop } },
    },
  });
  const tablero = () => buscarNodo(app.tree, n => n.props.testID === 'memoria-tablero');
  const cartas = () => (tablero()?.props.children || []).flat().filter(n => n?.props?.carta);
  const medir = ancho => tablero().props.onLayout({ nativeEvent: { layout: { width: ancho } } });
  return { app, medir, cartas, completadas, get perfectas() { return perfectas; } };
}

test('las doce cartas reservan ancho y alto numéricos en teléfonos estrechos y al redimensionar', () => {
  const { app, medir, cartas } = memoria();
  assert.equal(cartas().length, 0); // espera la medida real del tablero
  let baraja;
  for (const ancho of [264, 292, 332, 404, 548, 292]) {
    medir(ancho);
    const nodos = cartas();
    assert.equal(nodos.length, 12);
    const contenido = nodos.map(n => n.props.carta.key).join(',');
    if (baraja) assert.equal(contenido, baraja); // medir no vuelve a barajar
    baraja = contenido;
    const dimensiones = nodos.map(n => Object.assign({}, ...app.inspectChild(n).props.style));
    for (const carta of dimensiones) {
      assert.equal(typeof carta.width, 'number');
      assert.equal(typeof carta.height, 'number');
      assert.ok(carta.width >= 80);
      assert.ok(carta.height > carta.width);
    }
    const { width, height, marginBottom } = dimensiones[0];
    assert.ok(width * 3 + 24 <= ancho);
    assert.ok(width * 4 > ancho); // cada fila admite exactamente tres cartas
    assert.ok((height + marginBottom) * 4 > 400); // cuatro filas con altura útil
  }
  app.unmount();
});

test('medir de nuevo conserva la selección y las seis parejas pueden completarse', () => {
  const juego = memoria();
  const { app, medir, cartas, completadas } = juego;
  medir(332);
  const grupos = [...new Set(cartas().map(n => n.props.carta.grupo))];
  grupos.forEach((grupo, i) => {
    const pareja = cartas().filter(n => n.props.carta.grupo === grupo);
    pareja[0].props.onPress();
    medir(i % 2 === 0 ? 404 : 332);
    assert.equal(cartas().find(n => n.props.carta.key === pareja[0].props.carta.key).props.faceUp, true);
    cartas().find(n => n.props.carta.key === pareja[1].props.carta.key).props.onPress();
    app.setTime(new Date(2026, 8, 5, 12, 0, i + 1));
    app.fireTimers();
    if (i < grupos.length - 1) {
      assert.equal(cartas().filter(n => n.props.resuelta).length, (i + 1) * 2);
    }
  });
  assert.deepEqual(completadas, ['memoria-1']);
  assert.equal(juego.perfectas, 1);
  assert.ok(buscarNodo(app.tree, n => n.props.texto === '← Volver al mundo'));
  app.unmount();
});
