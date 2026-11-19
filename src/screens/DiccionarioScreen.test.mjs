import { test } from 'node:test';
import assert from 'node:assert/strict';
import { palabras } from '../data/datos.js';
import { montarComponente, buscarNodo } from '../test/componentHarness.mjs';

function texto(nodo) {
  if (Array.isArray(nodo)) return nodo.map(texto).join('');
  if (typeof nodo === 'string' || typeof nodo === 'number') return String(nodo);
  return nodo?.props ? texto(nodo.props.children) : '';
}

function diccionario(idsAprendidos = [], props = {}) {
  const noop = () => {};
  const estado = { palabrasVistas: new Set(idsAprendidos) };
  const app = montarComponente('src/screens/DiccionarioScreen.js', {
    props,
    mocks: {
      'react-native': {
        View: 'View', Text: 'Text', TextInput: 'TextInput', TouchableOpacity: 'TouchableOpacity',
        FlatList: 'FlatList', ScrollView: 'ScrollView',
        Platform: { OS: 'android' }, UIManager: {},
        StyleSheet: { create: s => s },
        LayoutAnimation: { configureNext: noop, Presets: { easeInEaseOut: {} } },
      },
      '@react-navigation/native': { useFocusEffect: noop },
      '../context/JuegoContext': { useJuego: () => ({
        estado, registrarAperturaDiccionario: noop, verificarLogros: noop,
      }) },
      '../utils/voz': { decirPalabra: noop },
      '../utils/sonidos': { sonar: { pop: noop } },
    },
  });
  const lista = () => buscarNodo(app.tree, n => n.type === 'FlatList');
  const fila = id => {
    const item = lista().props.data.find(p => p.id === id);
    assert.ok(item, `La lista debe contener la palabra ${id}`);
    return lista().props.renderItem({ item });
  };
  return { app, lista, fila, estado };
}

test('buscar capuli encuentra Capulí y desplegar la entrada muestra su documentación', () => {
  const { app, lista, fila } = diccionario();
  buscarNodo(app.tree, n => n.type === 'TextInput').props.onChangeText('capuli');
  assert.deepEqual(Array.from(lista().props.data, p => p.p), ['Capulí']);

  const capuli = palabras.find(p => p.p === 'Capulí');
  assert.equal(texto(fila(capuli.id)).includes('Fuente:'), false);
  fila(capuli.id).props.onPress();
  const expandida = fila(capuli.id);
  assert.ok(buscarNodo(expandida, n => n.type === 'Text' && texto(n) === `Fuente: ${capuli.fuente}`), 'Fuente');
  // Capulí quedó documentado: muestra la Fuente, pero NO la nota editorial, el "Tipo:" ni el aviso de pendiente.
  assert.equal(capuli.respaldo, 'documentado');
  assert.equal(buscarNodo(expandida, n => n.type === 'Text' && texto(n) === capuli.nota), undefined);
  assert.equal(buscarNodo(expandida, n => n.type === 'Text' && texto(n).startsWith('Tipo:')), undefined);
  assert.equal(buscarNodo(expandida, n => n.type === 'Text' && texto(n) === 'Validación documental pendiente.'), undefined);
  app.unmount();
});

test('filtrar Cuasmal presenta quince entradas y conserva la marca de aprendido por ID', () => {
  const { app, lista, fila, estado } = diccionario([61]);
  buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && texto(n).startsWith('Filtros')).props.onPress();
  buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && texto(n).trim().endsWith('Cuasmal')).props.onPress();

  assert.equal(lista().props.data.length, 15);
  assert.ok(lista().props.data.every(p => p.mundo === 5));
  assert.ok(buscarNodo(app.tree, n => n.type === 'Text' && texto(n).startsWith('15 palabras · 1/')));
  assert.ok(buscarNodo(fila(61), n => n.type === 'Text' && texto(n) === '✓'));
  assert.equal(buscarNodo(fila(62), n => n.type === 'Text' && texto(n) === '✓'), undefined);
  assert.ok(buscarNodo(fila(62), n => n.props.name === 'lock-closed'));
  assert.deepEqual([...estado.palabrasVistas], [61]);
  app.unmount();
});

test('llegar con route.params.palabraId limpia busqueda y filtros y deja expandida esa ficha', () => {
  const objetivo = palabras.find(p => p.mundo === 1);
  const setParams = [];
  const props = { route: { params: {} }, navigation: { setParams: p => setParams.push(p) } };
  const { app, lista, fila } = diccionario([], props);

  // Filtros activos que ocultan la palabra objetivo: mundo Cuasmal + una búsqueda.
  buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && texto(n).startsWith('Filtros')).props.onPress();
  buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && texto(n).trim().endsWith('Cuasmal')).props.onPress();
  buscarNodo(app.tree, n => n.type === 'TextInput').props.onChangeText('zzz');
  assert.equal(lista().props.data.some(p => p.id === objetivo.id), false);

  props.route.params.palabraId = objetivo.id;
  app.rerender();

  assert.equal(buscarNodo(app.tree, n => n.type === 'TextInput').props.value, '');
  assert.equal(lista().props.data.length, palabras.length);
  assert.ok(buscarNodo(fila(objetivo.id), n => n.type === 'Text' && texto(n) === `Fuente: ${objetivo.fuente}`), 'ficha expandida');
  assert.equal(typeof lista().props.onScrollToIndexFailed, 'function');
  assert.equal(setParams.length, 1);
  assert.ok('palabraId' in setParams[0] && setParams[0].palabraId === undefined, 'consume el parametro');
  app.unmount();
});

test('el diccionario monta sin route ni navigation', () => {
  const { app, lista } = diccionario();
  assert.equal(lista().props.data.length, palabras.length);
  app.unmount();
});

test('Mi mochila deja solo las palabras aprendidas y cuenta cuántas van', () => {
  const { app, lista } = diccionario([5, 18, 40]);
  assert.equal(lista().props.data.length, palabras.length);
  assert.ok(buscarNodo(app.tree, n => n.type === 'Text' && texto(n).includes(`3/${palabras.length} aprendidas`)));
  const boton = buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && n.props.accessibilityLabel?.startsWith('Mi mochila'));
  boton.props.onPress();
  assert.equal(JSON.stringify(lista().props.data.map(p => p.id).sort((a, b) => a - b)), '[5,18,40]');
  buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && n.props.accessibilityLabel?.startsWith('Mi mochila')).props.onPress();
  assert.equal(lista().props.data.length, palabras.length);
  app.unmount();
});

test('Mi mochila vacía invita a aprender en el mapa', () => {
  const { app, lista } = diccionario([]);
  buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && n.props.accessibilityLabel?.startsWith('Mi mochila')).props.onPress();
  assert.equal(lista().props.data.length, 0);
  const vacio = lista().props.ListEmptyComponent;
  assert.ok(texto(vacio).includes('Tu mochila está vacía'));
  app.unmount();
});

test('ya no existe la pestaña Mochila', async () => {
  const fs = await import('node:fs');
  const app = fs.readFileSync('App.js', 'utf8');
  assert.ok(!app.includes('MochilaTab'));
  assert.ok(app.includes('DiccionarioTab'));
});
