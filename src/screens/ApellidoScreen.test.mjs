import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { montarComponente, buscarNodo } from '../test/componentHarness.mjs';

function texto(nodo) {
  if (Array.isArray(nodo)) return nodo.map(texto).join('');
  if (typeof nodo === 'string' || typeof nodo === 'number') return String(nodo);
  return nodo?.props ? texto(nodo.props.children) : '';
}
// FichaApellido es un componente local: se renderiza a mano con sus props.
function textoFichas(app) {
  const out = [];
  const rec = (n) => {
    if (Array.isArray(n)) return n.forEach(rec);
    if (!n || typeof n !== 'object') return;
    if (typeof n.type === 'function') return rec(n.type(n.props));
    if (n.type === 'Text') out.push(texto(n));
    rec(n.props?.children);
  };
  rec(app.tree);
  return out.join(' | ');
}

function montar() {
  return montarComponente('src/screens/ApellidoScreen.js', {
    mocks: { '../utils/sonidos': { sonar: { pop() {} } } },
  });
}
const input = (a) => buscarNodo(a.tree, n => n.type === 'TextInput');

test('escribir un apellido pasto muestra sus piezas, traducción, fuente y tótem', () => {
  const app = montar();
  input(app).props.onChangeText('cuaspud');
  input(app).props.onSubmitEditing();
  const t = textoFichas(app);
  assert.match(t, /Cuaspud/);
  assert.match(t, /«Señor del agua»/);
  assert.match(t, /Significado propuesto según Lengua de los Pastos \(ANH, 2015\), p\. 70/);
  assert.match(t, /Tótem familiar: agua/);
  assert.match(t, /Otra lectura: «Cerro de agua»/);
  assert.match(t, /cuas/);
  app.unmount();
});

test('un apellido que no está lo dice sin inventar, y la lista permite explorar', () => {
  const app = montar();
  input(app).props.onChangeText('Pérez');
  buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && n.props.accessibilityLabel === 'Descubrir el secreto del apellido').props.onPress();
  const t = textoFichas(app);
  assert.match(t, /No está en los libros: Pérez/);
  assert.match(buscarNodo(app.tree, n => n.type === 'Acompanante').props.mensaje, /No lo encontré en los libros/);
  assert.ok(!/Significado propuesto/.test(t));
  buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && n.props.accessibilityLabel === 'Ver el apellido Aramues').props.onPress();
  const t2 = textoFichas(app);
  assert.match(t2, /Tótem familiar: águila/);
  assert.match(t2, /El libro solo nombra su tótem/);
  app.unmount();
});

test('el apellido no se guarda y la pantalla está en Juegos', () => {
  const src = fs.readFileSync('src/screens/ApellidoScreen.js', 'utf8');
  assert.ok(!/useJuego|AsyncStorage/.test(src), 'no toca el estado guardado');
  const app = fs.readFileSync('App.js', 'utf8');
  const pila = app.slice(app.indexOf('function JuegosStackScreen'), app.indexOf('function DiccionarioStackScreen'));
  assert.ok(pila.includes('name="Apellido"'));
});

test('sin letras no busca y pide un apellido; tocar la lista limpia la búsqueda', () => {
  const app = montar();
  input(app).props.onChangeText('123');
  input(app).props.onSubmitEditing();
  assert.match(buscarNodo(app.tree, n => n.type === 'Acompanante').props.mensaje, /Escribe un apellido con letras/);
  input(app).props.onChangeText('Tepud');
  input(app).props.onSubmitEditing();
  buscarNodo(app.tree, n => n.type === 'TouchableOpacity' && n.props.accessibilityLabel === 'Ver el apellido Tepud').props.onPress();
  const t = textoFichas(app);
  assert.equal(t.split('«Cerro del bejuco»').length - 1, 1, 'la ficha no sale dos veces');
  assert.doesNotMatch(buscarNodo(app.tree, n => n.type === 'Acompanante').props.mensaje, /Lo encontré/);
  app.unmount();
});
