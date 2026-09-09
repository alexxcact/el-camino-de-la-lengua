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
