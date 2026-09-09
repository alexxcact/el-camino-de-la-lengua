import { test } from 'node:test';
import assert from 'node:assert/strict';
import { palabras } from '../data/datos.js';
import { montarComponente, buscarNodo } from '../test/componentHarness.mjs';

function crearReto(resultadoPermiso) {
  const estado = {
    ultimaSesion: '2026-09-05', retoDiarioFecha: null,
    palabrasVistas: new Set(), retosDiariosTotal: 0,
    notificacionesActivadas: false, horaNotificacion: 0,
  };
  const programaciones = [];
  const noop = () => {};
  const contexto = {
    estado, ganarPuntos: noop, verificarLogros: noop,
    getPalabraDelDia: () => palabras[0],
    retoDiarioDisponible: () => estado.retoDiarioFecha !== estado.ultimaSesion,
    completarRetoDiario: () => { estado.retoDiarioFecha = estado.ultimaSesion; estado.retosDiariosTotal++; },
    cambiarNotificaciones: v => { estado.notificacionesActivadas = v; },
  };
  const app = montarComponente('src/screens/RetoDiarioScreen.js', {
    props: { navigation: { goBack: noop } },
    mocks: {
      '../context/JuegoContext': { useJuego: () => contexto },
      '../utils/sonidos': { sonar: { acierto: noop, error: noop, mundo: noop } },
      '../utils/feedback': { vibrar: { suave: noop, error: noop, exito: noop } },
      '../utils/notificaciones': { programarNotificacionDiaria: async hora => {
        assert.equal(estado.notificacionesActivadas, false);
        programaciones.push(hora);
        return resultadoPermiso;
      } },
    },
  });
  return { app, estado, programaciones };
}

function terminarReto(app) {
  for (let i = 0; i < 5; i++) {
    if (i < 4) {
      const opcion = buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && !n.props.disabled);
      assert.ok(opcion);
      opcion.props.onPress();
    } else {
      buscarNodo(app.tree, n => n.type === 'TextInput').props.onChangeText('respuesta');
      buscarNodo(app.tree, n => n.props.texto === 'Verificar').props.onPress();
    }
    app.setTime(new Date(2026, 8, 5, 12, 0, (i + 1) * 2));
    app.fireTimers();
  }
}

for (const permitido of [false, true]) {
  test(`el reto refleja programación ${permitido ? 'aceptada' : 'rechazada'} y conserva medianoche`, async () => {
    const { app, estado, programaciones } = crearReto(permitido);
    terminarReto(app);
    const boton = buscarNodo(app.tree, n => n.props.texto === 'Sí, recuérdame');
    assert.ok(boton);
    await boton.props.onPress();
    assert.deepEqual(programaciones, [0]);
    assert.equal(estado.notificacionesActivadas, permitido);
    app.unmount();
  });
}

test('un reto completado ayer permite empezar otro sin remontar la pantalla', () => {
  const { app, estado } = crearReto(false);
  terminarReto(app);
  assert.equal(estado.retosDiariosTotal, 1);
  estado.ultimaSesion = '2026-09-06';
  app.setTime(new Date(2026, 8, 6, 12));
  app.rerender();
  assert.equal(buscarNodo(app.tree, n => n.props.texto === 'Sí, recuérdame'), undefined);
  assert.ok(buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && !n.props.disabled));
  assert.equal(buscarNodo(app.tree, n => n.type === 'TextInput'), undefined);
  assert.equal(estado.retosDiariosTotal, 1);
  app.unmount();
});
