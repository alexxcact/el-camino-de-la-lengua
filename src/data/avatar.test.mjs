import { test } from 'node:test';
import assert from 'node:assert/strict';
import { atuendosDesbloqueados } from './datos.js';
import { hidratarEstado, serializarEstado } from '../context/logica.js';

test('Pishku sigue disponible tras perder la racha y recargar la partida', () => {
  const estado = hidratarEstado(null);
  estado.racha = 7;
  estado.avatarDesbloqueados.accesorio = atuendosDesbloqueados(estado, 'accesorio');
  assert.ok(estado.avatarDesbloqueados.accesorio.includes(1));
  estado.racha = 1;
  const recargado = hidratarEstado(JSON.parse(JSON.stringify(serializarEstado(estado))));
  assert.ok(atuendosDesbloqueados(recargado, 'accesorio').includes(1));
});

test('partidas antiguas reciben los atuendos ganados y no se desbloquean otros', () => {
  const estado = hidratarEstado(null);
  delete estado.avatarDesbloqueados;
  assert.deepEqual(atuendosDesbloqueados(estado, 'accesorio'), [0]);
  estado.racha = 7;
  assert.deepEqual(atuendosDesbloqueados(estado, 'accesorio'), [0, 1]);
  estado.avatarDesbloqueados = { accesorio: [0, 99] };
  assert.deepEqual(atuendosDesbloqueados(estado, 'accesorio'), [0, 1]);
});

test('el avatar ofrece cabello, prendas de mujer y adornos pastos sin cambiar los índices guardados', async () => {
  const { AVATAR_OPCIONES } = await import('./datos.js');
  // Los atuendos de siempre conservan su posición (el avatar guardado usa índices).
  assert.equal(AVATAR_OPCIONES.ropa[0].nombre, 'Ruana sencilla');
  assert.equal(AVATAR_OPCIONES.ropa[4].nombre, 'Ruana dorada');
  assert.equal(AVATAR_OPCIONES.sombrero[3].nombre, 'Capucha de ruana');
  assert.equal(AVATAR_OPCIONES.accesorio[3].nombre, 'Mochila tejida');
  assert.ok(AVATAR_OPCIONES.cabello.some(c => c.estilo === 'trenzas'));
  assert.ok(AVATAR_OPCIONES.ropa.some(r => r.patron === 'chalina' && !r.cond), 'chalina disponible desde el inicio');
  assert.ok(AVATAR_OPCIONES.adorno.some(a => /chaquiras/i.test(a.nombre) && !a.cond));
  assert.ok(AVATAR_OPCIONES.adorno.some(a => /orejeras/i.test(a.nombre) && !a.cond));
});

test('cada petroglifo descubierto se vuelve un emblema para el avatar', () => {
  const estado = hidratarEstado(null);
  const antes = atuendosDesbloqueados(estado, 'emblema');
  assert.deepEqual(antes, [0]);
  estado.petroglifosEncontrados = ['venado', 'mono'];
  assert.equal(atuendosDesbloqueados(estado, 'emblema').length, 3);
});
