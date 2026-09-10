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

test('las cinemáticas resaltan términos completos sin confundir palabras que comparten prefijo', () => {
  const noop = () => {};
  const contenido = 'Pa, Pas y Paskal. Pe y Pepe. Chu, Chula y Chular.';
  const grupos = [
    ['Pa', 'Pe', 'Chu'],
    ['Pa', 'Pas', 'Paskal', 'Pe', 'Pepe', 'Chu', 'Chula', 'Chular'],
  ];
  const retratos = Object.fromEntries(
    ['taita_rimay', 'uma', 'pishku', 'chutun', 'kinti'].map(p => [`../../assets/images/personajes/${p}.jpg`, p])
  );
  const app = montarComponente('src/screens/CinematicaScreen.js', {
    props: { route: { params: { clave: 'prueba', mundoId: 1 } }, navigation: { replace: noop, goBack: noop } },
    mocks: {
      ...retratos,
      'react-native': {
        View: 'View', Text: 'Text', Image: 'Image', TouchableOpacity: 'TouchableOpacity', ImageBackground: 'ImageBackground',
        StyleSheet: { create: s => s, absoluteFill: {} },
        Dimensions: { get: () => ({ width: 360, height: 800 }) },
      },
      '../data/datos': {
        personajes: [],
        CINEMATICAS: { prueba: {
          titulo: 'Lectura de vocabulario',
          escenas: grupos.map(resaltar => ({ personaje: 'taita_rimay', fondo: 'aurora', texto: contenido, resaltar })),
        } },
      },
      '../data/imagenes': { imgMundoColor: {} },
      '../context/JuegoContext': { useJuego: () => ({ marcarCinematicaVista: noop }) },
      '../utils/sonidos': { sonar: { mundo: noop } },
    },
  });

  grupos.forEach((esperadas, indice) => {
    if (indice > 0) app.tree.props.onPress(); // Avanza a la siguiente escena.
    app.tree.props.onPress(); // Completa la escritura de la escena.
    const dialogo = buscarNodo(app.tree, n => n.type === 'Text' && texto(n) === contenido);
    assert.ok(dialogo);
    assert.deepEqual(Array.from(resaltadas(dialogo)), esperadas);
  });
  app.unmount();
});
