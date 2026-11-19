import { test } from 'node:test';
import assert from 'node:assert/strict';
import { montarComponente, buscarNodo } from '../test/componentHarness.mjs';

function texto(nodo) {
  if (Array.isArray(nodo)) return nodo.map(texto).join('');
  if (typeof nodo === 'string') return nodo;
  return nodo?.props ? texto(nodo.props.children) : '';
}

function resaltadas(nodo) {
  if (Array.isArray(nodo)) return nodo.flatMap(resaltadas);
  if (!nodo?.props) return [];
  if (nodo.type === 'Text' && nodo.props.style && typeof nodo.props.children[0] === 'string') {
    return [texto(nodo)];
  }
  return resaltadas(nodo.props.children);
}

const noop = () => {};
const retratos = Object.fromEntries(
  ['taita_rimay', 'uma', 'pishku', 'chutun', 'kinti'].map(p => [`../../assets/images/personajes/${p}.jpg`, p])
);

// Monta la cinemática "prueba" con las escenas dadas. Devuelve la app y el
// contador de vibraciones suaves.
function montarCinematica(escenas, { navigation = { replace: noop, goBack: noop } } = {}) {
  const vibraciones = { suave: 0 };
  const inicio = new Date(2026, 8, 5, 12);
  const app = montarComponente('src/screens/CinematicaScreen.js', {
    fecha: inicio,
    props: { route: { params: { clave: 'prueba', mundoId: 1 } }, navigation },
    mocks: {
      ...retratos,
      'react-native': {
        View: 'View', Text: 'Text', TouchableOpacity: 'TouchableOpacity', ImageBackground: 'ImageBackground',
        StyleSheet: { create: s => s, absoluteFill: {} },
        Dimensions: { get: () => ({ width: 360, height: 800 }) },
      },
      '../data/datos': {
        personajes: [{ id: 'taita-rimay', nombre: 'El guía', color: '#123456' }],
        CINEMATICAS: { prueba: { titulo: 'Lectura de vocabulario', escenas } },
      },
      '../data/personajesUtil': { significadoDe: p => `significado de ${p}` },
      '../data/imagenes': { imgMundoColor: {} },
      '../context/JuegoContext': { useJuego: () => ({ marcarCinematicaVista: noop }) },
      '../utils/sonidos': { sonar: { mundo: noop } },
      '../utils/feedback': { vibrar: { suave: () => { vibraciones.suave++; } } },
    },
  });
  let ahora = inicio.getTime();
  // Avanza el reloj `ms` en pasos de 28 ms (velocidad de la máquina de escribir).
  const avanzarTiempo = ms => {
    for (let t = 0; t < ms; t += 28) {
      ahora += 28;
      app.setTime(new Date(ahora));
      app.fireTimers();
    }
  };
  return { app, vibraciones, avanzarTiempo };
}

// El arnés sustituye los componentes por su basename (import sin extensión).
const chapaDe = arbol => buscarNodo(arbol, n => /^ChapaPalabra(\.js)?$/.test(n.type));
const personajeDe = arbol => buscarNodo(arbol, n => /^PersonajeVivo(\.js)?$/.test(n.type));

test('las cinemáticas resaltan términos completos sin confundir palabras que comparten prefijo', () => {
  const contenido = 'Pa, Pas y Paskal. Pe y Pepe. Chu, Chula y Chular.';
  const grupos = [
    ['Pa', 'Pe', 'Chu'],
    ['Pa', 'Pas', 'Paskal', 'Pe', 'Pepe', 'Chu', 'Chula', 'Chular'],
  ];
  const { app } = montarCinematica(
    grupos.map(resaltar => ({ personaje: 'taita_rimay', fondo: 'aurora', texto: contenido, resaltar }))
  );

  grupos.forEach((esperadas, indice) => {
    if (indice > 0) app.tree.props.onPress(); // Avanza a la siguiente escena.
    app.tree.props.onPress(); // Completa la escritura de la escena.
    const dialogo = buscarNodo(app.tree, n => n.type === 'Text' && texto(n) === contenido);
    assert.ok(dialogo);
    assert.deepEqual(Array.from(resaltadas(dialogo)), esperadas);
  });
  app.unmount();
});

test('el personaje es PersonajeVivo integrado (sin aro) con su nombre en el color del personaje', () => {
  const { app } = montarCinematica([{ personaje: 'taita_rimay', fondo: 'aurora', texto: 'Hola.', resaltar: [] }]);
  const vivo = personajeDe(app.tree);
  assert.ok(vivo);
  assert.equal(vivo.props.personaje, 'taita_rimay');
  assert.equal(vivo.props.marco, undefined);
  assert.equal(vivo.props.colorMarco, undefined);
  const tag = buscarNodo(app.tree, n => n.type === 'View' && [].concat(n.props.style).some(st => st && st.backgroundColor === '#123456'));
  assert.ok(tag, 'la etiqueta del nombre usa el color del personaje');
  assert.equal(vivo.props.animo, 'neutral');
  assert.equal(buscarNodo(app.tree, n => n.type === 'Image'), undefined); // sin retrato duplicado
  app.unmount();
});

test('al terminar de escribirse una palabra resaltada aparece su chapa y el personaje se sorprende', () => {
  // "Pas" no debe disparar la reacción de "Pa"; "Pa" ocupa los caracteres 14-15.
  const contenido = 'Mira el Pas, Pa brilla.';
  const { app, vibraciones, avanzarTiempo } = montarCinematica([
    { personaje: 'taita_rimay', fondo: 'aurora', texto: contenido, resaltar: ['Pa'] },
  ]);

  avanzarTiempo(28 * 14); // "Mira el Pas, P": todavía no termina "Pa"
  assert.equal(chapaDe(app.tree), undefined);
  assert.equal(vibraciones.suave, 0);

  avanzarTiempo(28); // escribe la "a" final de "Pa"
  const chapa = chapaDe(app.tree);
  assert.ok(chapa, 'debe aparecer la chapa');
  assert.equal(chapa.props.palabra, 'Pa');
  assert.equal(chapa.props.significado, 'significado de Pa');
  assert.equal(vibraciones.suave, 1);
  const vivo = personajeDe(app.tree);
  assert.equal(vivo.props.animo, 'sorprendido');
  const pulso = vivo.props.pulso;
  assert.ok(pulso > 0);

  avanzarTiempo(1500); // pasa la reacción
  assert.equal(personajeDe(app.tree).props.animo, 'neutral');

  avanzarTiempo(28 * contenido.length); // termina el texto sin nuevas reacciones
  assert.equal(vibraciones.suave, 1);
  assert.ok(buscarNodo(app.tree, n => n.type === 'Text' && /Toca para entrar/.test(texto(n))));
  app.unmount();
  assert.equal(app.timers, 0, 'el cleanup limpia intervalos y timeouts');
});

test('tocar para completar muestra solo la chapa de la última palabra resaltada', () => {
  const contenido = 'Pa y Pe y Chu.';
  const { app, vibraciones } = montarCinematica([
    { personaje: 'taita_rimay', fondo: 'aurora', texto: contenido, resaltar: ['Pa', 'Pe', 'Chu'] },
  ]);
  app.tree.props.onPress(); // completa
  const chapa = chapaDe(app.tree);
  assert.ok(chapa);
  assert.equal(chapa.props.palabra, 'Chu');
  assert.equal(vibraciones.suave, 1);
  app.unmount();
});

test('terminar limpia los temporizadores de la reacción', () => {
  let destino = null;
  const { app, avanzarTiempo } = montarCinematica(
    [{ personaje: 'taita_rimay', fondo: 'aurora', texto: 'Pa.', resaltar: ['Pa'] }],
    { navigation: { replace: (r, p) => { destino = [r, p]; }, goBack: noop } },
  );
  avanzarTiempo(28 * 2); // reacción en curso (timeout de la reacción pendiente)
  assert.ok(app.timers > 0);
  app.tree.props.onPress(); // completa
  app.tree.props.onPress(); // última escena: termina
  assert.equal(JSON.stringify(destino), JSON.stringify(['Mundo', { mundoId: 1 }]));
  assert.equal(app.timers, 0);
  app.unmount();
});
