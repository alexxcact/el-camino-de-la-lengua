import { test } from 'node:test';
import assert from 'node:assert/strict';
import { palabras } from '../data/datos.js';
import { montarComponente, buscarNodo } from '../test/componentHarness.mjs';

function texto(nodo) {
  if (Array.isArray(nodo)) return nodo.map(texto).join('');
  if (typeof nodo === 'string' || typeof nodo === 'number') return String(nodo);
  return nodo?.props ? texto(nodo.props.children) : '';
}

function diccionario(idsAprendidos = []) {
  const noop = () => {};
  const estado = { palabrasVistas: new Set(idsAprendidos) };
  const app = montarComponente('src/screens/DiccionarioScreen.js', {
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
  for (const contenido of [
    `Fuente: ${capuli.fuente}`, capuli.nota, 'Validación documental pendiente.',
  ]) {
    assert.ok(buscarNodo(expandida, n => n.type === 'Text' && texto(n) === contenido), contenido);
  }
  assert.equal(capuli.respaldo, 'pendiente_validacion');
  app.unmount();
});

test('filtrar Cuasmal presenta quince entradas y conserva la marca de aprendido por ID', () => {
  const { app, lista, fila, estado } = diccionario([61]);
  buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && texto(n).startsWith('Filtros')).props.onPress();
  buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && texto(n).trim().endsWith('Cuasmal')).props.onPress();

  assert.equal(lista().props.data.length, 15);
  assert.ok(lista().props.data.every(p => p.mundo === 5));
  assert.ok(buscarNodo(app.tree, n => n.type === 'Text' && texto(n) === '15 palabras'));
  assert.ok(buscarNodo(fila(61), n => n.type === 'Text' && texto(n) === '✓'));
  assert.equal(buscarNodo(fila(62), n => n.type === 'Text' && texto(n) === '✓'), undefined);
  assert.ok(buscarNodo(fila(62), n => n.props.name === 'lock-closed'));
  assert.deepEqual([...estado.palabrasVistas], [61]);
  app.unmount();
});
