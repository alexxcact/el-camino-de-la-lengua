import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarComponente, buscarNodo } from '../test/componentHarness.mjs';
import { LINEAS, resolver } from '../data/dialogos.js';

function montar(props) {
  const app = montarComponente('src/components/PishkuMascota.js', {
    props,
    mocks: {
      '../context/JuegoContext': { useJuego: () => ({ estado: { nombreJugador: 'Ana' } }) },
      './PersonajeVivo': 'PersonajeVivo',
    },
  });
  const tree = app.tree;
  const vivo = buscarNodo(tree, n => n.type === 'PersonajeVivo');
  const globo = buscarNodo(tree, n => n.type === 'Text');
  const texto = globo ? [].concat(globo.props.children).join('') : null;
  return { app, vivo, texto };
}

test('sin momento conserva el mensaje y muestra al Ave feliz', () => {
  const { vivo, texto } = montar({ mensaje: 'X' });
  assert.equal(texto, 'X');
  assert.equal(vivo.props.personaje, 'pishku');
  assert.equal(vivo.props.animo, 'feliz');
});

test('celebrando=false queda neutral y sin globo', () => {
  const { vivo, texto } = montar({ celebrando: false, mensaje: 'X' });
  assert.equal(vivo.props.animo, 'neutral');
  assert.equal(texto, null);
});

test('sin mensaje ni momento usa una frase con el nombre del jugador', () => {
  const { texto } = montar({});
  assert.match(texto, /Ana/);
});

test('con momento la línea sale del personaje pedido con {nombre} completado', () => {
  const { vivo, texto } = montar({ personaje: 'uma', momento: 'fin_exito' });
  assert.equal(vivo.props.personaje, 'uma');
  const posibles = LINEAS
    .filter(l => l.personaje === 'uma' && l.momento === 'fin_exito')
    .map(l => resolver(l.texto, { nombre: 'Ana' }));
  assert.ok(posibles.includes(texto), `texto inesperado: ${texto}`);
});

test('un momento sin línea elegible vuelve al mensaje', () => {
  const { texto } = montar({ momento: 'no-existe', mensaje: 'Y' });
  assert.equal(texto, 'Y');
});
