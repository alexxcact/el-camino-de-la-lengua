import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarComponente } from '../test/componentHarness.mjs';

async function juego() {
  const app = montarComponente('src/context/JuegoContext.js', {
    exportName: 'JuegoProvider',
    guardado: { ultimaSesion: '2026-09-05', racha: 4, mejorRacha: 4, palabrasHoy: 3, palabrasVistas: [1, 2, 3] },
  });
  await app.settle();
  return app;
}
const api = app => app.tree.props.value;

test('reanudar mañana actualiza racha y palabrasHoy una sola vez y persiste el resultado', async () => {
  const app = await juego();
  assert.equal(api(app).estado.racha, 4);
  app.emitAppState('background');
  assert.equal(app.timers, 0);
  app.setTime(new Date(2026, 8, 6, 9));
  app.emitAppState('active');
  assert.equal(api(app).estado.racha, 5);
  assert.equal(api(app).estado.palabrasHoy, 0);
  assert.equal(app.saved.ultimaSesion, '2026-09-06');
  api(app).marcarPalabraVista(4);
  app.emitAppState('active');
  assert.equal(api(app).estado.palabrasHoy, 1);
  assert.equal(api(app).estado.racha, 5);
  app.unmount();
  assert.equal(app.timers, 0);
  assert.equal(app.listeners, 0);
});

test('medianoche en primer plano refresca el estado sin pulsar ningún botón', async () => {
  const app = await juego();
  app.setTime(new Date(2026, 8, 6));
  app.fireTimers();
  assert.equal(api(app).estado.racha, 5);
  assert.equal(api(app).estado.palabrasHoy, 0);
  assert.equal(api(app).estado.ultimaSesion, '2026-09-06');
  assert.equal(app.timers, 1);
  app.unmount();
});

test('dos días suspendida no alargan la racha y al volver se reinicia', async () => {
  const app = await juego();
  app.emitAppState('background');
  app.setTime(new Date(2026, 8, 7, 12));
  app.fireTimers();
  assert.equal(api(app).estado.ultimaSesion, '2026-09-05');
  app.emitAppState('active');
  assert.equal(api(app).estado.racha, 1);
  assert.equal(api(app).estado.mejorRacha, 4);
  assert.equal(api(app).estado.palabrasHoy, 0);
  app.unmount();
});

test('una palabra aprendida antes del aviso de medianoche cuenta para el nuevo día', async () => {
  const app = await juego();
  app.setTime(new Date(2026, 8, 6, 0, 0, 1));
  api(app).marcarPalabraVista(4);
  assert.equal(api(app).estado.palabrasHoy, 1);
  assert.equal(api(app).estado.racha, 5);
  app.fireTimers();
  assert.equal(api(app).estado.palabrasHoy, 1);
  assert.equal(api(app).estado.racha, 5);
  app.unmount();
});

test('el contexto guarda 00:00 y conserva la hora tras recargar', async () => {
  const app = await juego();
  api(app).guardarHoraNotificacion(0);
  assert.equal(api(app).estado.horaNotificacion, 0);
  const otra = montarComponente('src/context/JuegoContext.js', { exportName: 'JuegoProvider', guardado: app.saved });
  await otra.settle();
  assert.equal(api(otra).estado.horaNotificacion, 0);
  app.unmount();
  otra.unmount();
});
