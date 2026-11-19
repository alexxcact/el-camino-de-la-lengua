import { test } from 'node:test';
import assert from 'node:assert/strict';
import { personajes } from '../data/datos.js';
import { montarComponente, buscarNodo } from '../test/componentHarness.mjs';

function texto(nodo) {
  if (Array.isArray(nodo)) return nodo.map(texto).join('');
  if (typeof nodo === 'string' || typeof nodo === 'number') return String(nodo);
  return nodo?.props ? texto(nodo.props.children) : '';
}

function montar() {
  return montarComponente('src/screens/PersonajesScreen.js', {
    props: { navigation: { navigate: () => {} } },
    mocks: {
      'react-native': {
        View: 'View', Text: 'Text', ScrollView: 'ScrollView', TouchableOpacity: 'TouchableOpacity',
        ImageBackground: 'ImageBackground',
        StyleSheet: { create: s => s, absoluteFill: {} },
        Dimensions: { get: () => ({ width: 390, height: 860 }) },
      },
      '../data/imagenes': { imgMundoColor: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 } },
      '../context/JuegoContext': { useJuego: () => ({ estado: { palabrasVistas: new Set(), palabrasFalladas: [] } }) },
      '../utils/navegacion': { abrirPalabraEnDiccionario: () => {} },
    },
  });
}

test('cada héroe del selector se puede elegir y pasa al escenario', () => {
  const app = montar();
  for (const pj of personajes) {
    const boton = buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && n.props.accessibilityLabel === pj.nombre);
    assert.ok(boton, `botón de ${pj.nombre}`);
    boton.props.onPress();
    const arbol = app.tree;
    assert.ok(buscarNodo(arbol, n => n.type === 'Text' && texto(n) === pj.nombre && n.props.style?.fontSize === 30), `hero muestra ${pj.nombre}`);
    const vivo = buscarNodo(arbol, n => n.type === 'PersonajeVivo');
    assert.equal(vivo.props.personaje, pj.id);
  }
  app.unmount();
});

test('el selector muestra figuras de cuerpo entero, sin recorte cuadrado', () => {
  const app = montar();
  assert.equal(buscarNodo(app.tree, n => n.type === 'RetratosPersonaje'), undefined);
  const minis = [];
  buscarNodo(app.tree, n => { if (n.type === 'FiguraMini') minis.push(n); return false; });
  assert.equal(minis.length, personajes.length);
  app.unmount();
});
