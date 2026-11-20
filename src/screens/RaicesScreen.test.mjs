import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarComponente, buscarNodo } from '../test/componentHarness.mjs';

function texto(nodo) {
  if (Array.isArray(nodo)) return nodo.map(texto).join('');
  if (typeof nodo === 'string' || typeof nodo === 'number') return String(nodo);
  return nodo?.props ? texto(nodo.props.children) : '';
}

function todos(arbol, pred, out = []) {
  if (Array.isArray(arbol)) { arbol.forEach(n => todos(n, pred, out)); return out; }
  if (!arbol || typeof arbol !== 'object') return out;
  if (pred(arbol)) out.push(arbol);
  todos(arbol.props?.children, pred, out);
  return out;
}

const IMUES = { palabra: 'Imues', tipo: 'lugar', piezas: [{ t: 'I', enlace: true }, { t: 'mu', sig: 'escondido' }, { t: 'es', sig: 'agua' }], traduccion: 'Agua escondida', fuente: 'Lengua de los Pastos (ANH, 2015), p. 13' };
const PUD = { palabra: 'Tepud', tipo: 'apellido', piezas: [{ t: 'Te', sig: 'bejuco' }, { t: 'pud', sig: 'cerro' }], traduccion: 'Cerro del bejuco', fuente: 'Lengua de los Pastos (ANH, 2015), p. 63' };

function montar(armadasRef) {
  const llamadas = { armadas: [], logros: 0 };
  const app = montarComponente('src/screens/RaicesScreen.js', {
    props: { navigation: { goBack: () => {} }, route: { params: { semilla: 3 } } },
    mocks: {
      '../data/raices': { RAICES: [IMUES, PUD], TIPOS_RAIZ: { lugar: 'Nombre de lugar', apellido: 'Apellido' } },
      '../context/JuegoContext': { useJuego: () => ({
        estado: { raicesArmadas: armadasRef },
        marcarRaizArmada: (p) => llamadas.armadas.push(p),
        verificarLogros: () => { llamadas.logros++; },
      }) },
      '../utils/sonidos': { sonar: { acierto() {}, error() {}, pop() {} } },
      '../utils/feedback': { vibrar: { exito() {}, error() {} } },
    },
  });
  return { app, llamadas };
}

const ficha = (arbol, t) => todos(arbol, n => n.type === 'TouchableOpacity' && n.props.accessibilityLabel?.startsWith(`${t.toLowerCase()}:`))[0];

function armar(app, orden) {
  for (const t of orden) ficha(app.tree, t).props.onPress();
}

test('Raíces: armar bien una palabra la registra y muestra su lectura y fuente', () => {
  const { app, llamadas } = montar([]);
  const trad = texto(buscarNodo(app.tree, n => n.type === 'Text' && texto(n).startsWith('«')));
  const item = trad.includes('Agua') ? IMUES : PUD;
  armar(app, item.piezas.filter(p => !p.enlace).map(p => p.t));
  assert.deepEqual(llamadas.armadas, [item.palabra]);
  const arbol = app.tree;
  assert.ok(buscarNodo(arbol, n => n.type === 'Text' && texto(n).startsWith('Según Lengua de los Pastos')));
  assert.ok(buscarNodo(arbol, n => n.type === 'Text' && texto(n).startsWith('De derecha a izquierda')));
  app.unmount();
});

test('Raíces: en otro orden no cuenta y se puede volver a empezar; al final verifica logros', () => {
  const { app, llamadas } = montar([]);
  for (let k = 0; k < 2; k++) {
    const trad = texto(buscarNodo(app.tree, n => n.type === 'Text' && texto(n).startsWith('«')));
    const item = trad.includes('Agua') ? IMUES : PUD;
    const piezas = item.piezas.filter(p => !p.enlace).map(p => p.t);
    armar(app, [...piezas].reverse());
    assert.equal(llamadas.armadas.length, k);
    const reintento = buscarNodo(app.tree, n => n.type === 'BotonGlow' && n.props.texto === 'Empezar de nuevo');
    assert.ok(reintento);
    reintento.props.onPress();
    armar(app, piezas);
    assert.equal(llamadas.armadas.at(-1), item.palabra);
    buscarNodo(app.tree, n => n.type === 'BotonGlow' && /Siguiente|Terminar/.test(n.props.texto)).props.onPress();
  }
  assert.equal(llamadas.logros, 1);
  assert.ok(buscarNodo(app.tree, n => n.type === 'BotonGlow' && n.props.texto === 'Otra ronda'));
  app.unmount();
});

test('Raíces: con la palabra llena, tocar otra ficha no suma intentos', () => {
  const { app } = montar([]);
  const trad = texto(buscarNodo(app.tree, n => n.type === 'Text' && texto(n).startsWith('«')));
  const item = trad.includes('Agua') ? IMUES : PUD;
  armar(app, item.piezas.filter(p => !p.enlace).map(p => p.t).reverse());
  const pulsoAntes = buscarNodo(app.tree, n => n.type === 'Acompanante').props.pulso;
  const libre = todos(app.tree, n => n.type === 'TouchableOpacity' && n.props.accessibilityLabel?.includes(':') && !n.props.disabled)[0];
  libre.props.onPress();
  assert.equal(buscarNodo(app.tree, n => n.type === 'Acompanante').props.pulso, pulsoAntes);
  app.unmount();
});

test('Raíces: las piezas se muestran en minúscula para no confundir I con l', () => {
  const { app } = montar([]);
  const fichas = todos(app.tree, n => n.type === 'TouchableOpacity' && /^[^ ]+: /.test(n.props.accessibilityLabel || ''));
  assert.ok(fichas.length >= 3);
  for (const f of fichas) {
    const t = f.props.accessibilityLabel.split(':')[0];
    assert.equal(t, t.toLowerCase());
  }
  app.unmount();
});
