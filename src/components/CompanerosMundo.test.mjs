import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { montarComponente, buscarNodo } from '../test/componentHarness.mjs';

function texto(nodo) {
  if (Array.isArray(nodo)) return nodo.map(texto).join('');
  if (typeof nodo === 'string' || typeof nodo === 'number') return String(nodo);
  return nodo?.props ? texto(nodo.props.children) : '';
}

function montar(mundoId, estado = {}) {
  return montarComponente('src/components/CompanerosMundo.js', {
    props: { mundoId },
    mocks: {
      './FiguraMini': 'FiguraMini',
      '../context/JuegoContext': { useJuego: () => ({ estado: { palabrasVistas: new Set(), palabrasFalladas: [], mundosCompletados: new Set(), nombreJugador: 'Ana', ...estado } }) },
    },
  });
}

test('cada mundo muestra de pie (FiguraMini) a los personajes de su cinemática', () => {
  const app = montar(4);
  const botones = [];
  buscarNodo(app.tree, n => { if (n.type === 'TouchableOpacity') botones.push(n.props.accessibilityLabel); return false; });
  assert.ok(botones.some(l => l.startsWith('Caminante')), 'Kinti acompaña en el mundo 4');
  assert.ok(buscarNodo(app.tree, n => n.type === 'FiguraMini'));
  assert.ok(!buscarNodo(app.tree, n => n.type === 'RetratosPersonaje'));
  app.unmount();
});

test('al tocar un personaje habla con una línea propia', () => {
  const app = montar(1);
  const boton = buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && n.props.accessibilityLabel.startsWith('La tejedora'));
  boton.props.onPress();
  const arbol = app.tree;
  const sel = buscarNodo(arbol, n => n.type === 'TouchableOpacity' && n.props.accessibilityState?.selected);
  assert.ok(sel.props.accessibilityLabel.startsWith('La tejedora'));
  assert.ok(!buscarNodo(arbol, n => n.type === 'Text' && texto(n).includes('Toca a un personaje')), 'desaparece la pista');
  app.unmount();
});

test('la Niebla aparece solo si hay palabras en Repaso', () => {
  const sin = montar(2);
  assert.ok(!buscarNodo(sin.tree, n => n.type === 'TouchableOpacity' && n.props.accessibilityLabel.startsWith('Niebla')));
  sin.unmount();
  const con = montar(2, { palabrasFalladas: [3] });
  assert.ok(buscarNodo(con.tree, n => n.type === 'TouchableOpacity' && n.props.accessibilityLabel.startsWith('Niebla')));
  con.unmount();
});

test('ya no existe la pestaña Héroes', () => {
  const app = fs.readFileSync('App.js', 'utf8');
  assert.ok(!app.includes('PersonajesTab'));
  assert.ok(!fs.existsSync('src/screens/PersonajesScreen.js'));
});
