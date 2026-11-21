import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { montarComponente, buscarNodo } from '../test/componentHarness.mjs';

function montar(estado = {}) {
  const rutas = [];
  const est = { palabrasFalladas: [], raicesArmadas: [], palabrasVistas: new Set(), ...estado };
  const palabraDia = { id: 1, p: 'Zon', e: 'Frailejón' };
  const app = montarComponente('src/screens/JuegosScreen.js', {
    props: { navigation: { navigate: (r, p) => rutas.push([r, p]) } },
    mocks: {
      'react-native-safe-area-context': { SafeAreaView: 'SafeAreaView' },
      '../context/JuegoContext': { useJuego: () => ({
        estado: est,
        getPalabraDelDia: () => palabraDia,
        retoDiarioDisponible: () => true,
      }) },
    },
  });
  return { app, rutas };
}

// Atajo es un componente local: se buscan sus props (título y etiqueta accesible).
const boton = (arbol, inicio) => buscarNodo(arbol, n => typeof n.type === 'function' && `${n.props.accessibilityLabel || n.props.titulo}. ${n.props.sub}`.startsWith(inicio));

test('Juegos reúne la palabra de hoy, el reto y los juegos, y navega a cada uno', () => {
  const { app, rutas } = montar({ raicesArmadas: ['Imues', 'Males'] });
  const tarjeta = buscarNodo(app.tree, n => n.type === 'TarjetaPalabraDia');
  assert.equal(tarjeta.props.palabra.p, 'Zon');
  tarjeta.props.onReto();
  boton(app.tree, 'Práctica libre').props.onPress();
  const raices = boton(app.tree, 'Raíces de la palabra');
  assert.match(raices.props.sub, /2\/\d+/);
  raices.props.onPress();
  boton(app.tree, 'Duelo de 2').props.onPress();
  assert.deepEqual(rutas.map(r => r[0]), ['RetoDiario', 'Practica', 'Raices', 'Duelo']);
  assert.equal(boton(app.tree, 'Repaso'), undefined, 'sin fallos no hay repaso');
  app.unmount();
});

test('con palabras falladas aparece el Repaso y abre el quiz en modo repaso', () => {
  const { app, rutas } = montar({ palabrasFalladas: [1, 2] });
  boton(app.tree, 'Repaso de 2').props.onPress();
  assert.equal(rutas[0][0], 'Quiz');
  assert.equal(rutas[0][1].modoRepaso, true);
  assert.equal(rutas[0][1].palabrasPractica.length, 2);
  app.unmount();
});

test('el mapa queda solo con el sendero y Juegos es su propia pestaña', () => {
  const mapa = fs.readFileSync('src/screens/MapaScreen.js', 'utf8');
  for (const x of ['TarjetaPalabraDia', "'Practica'", "'Raices'", "'Duelo'", 'cabecera=']) assert.ok(!mapa.includes(x), `el mapa aún tiene ${x}`);
  const app = fs.readFileSync('App.js', 'utf8');
  assert.match(app, /Tab\.Screen name="MapaTab"[\s\S]*Tab\.Screen name="JuegosTab"[\s\S]*Tab\.Screen name="DiccionarioTab"/);
  const pila = app.slice(app.indexOf('function JuegosStackScreen'), app.indexOf('function DiccionarioStackScreen'));
  for (const r of ['JuegosMain', 'RetoDiario', 'Practica', 'Raices', 'Duelo', 'Quiz', 'Parejas', 'Dictado', 'Escucha', 'Memoria']) {
    assert.ok(pila.includes(`name="${r}"`), `falta ${r} en la pila de Juegos`);
  }
});

test('El vuelo de Auara aparece destacado en Juegos, muestra el récord y abre el juego', () => {
  const { app, rutas } = montar({ vueloRecord: 12 });
  const vuelo = buscarNodo(app.tree, n => String(n.props?.accessibilityLabel || '').startsWith('El vuelo de Auara'));
  assert.ok(vuelo, 'tarjeta del vuelo');
  assert.ok(vuelo.props.accessibilityLabel.includes('Récord 12'));
  vuelo.props.onPress();
  assert.deepEqual(rutas.map(r => r[0]), ['Vuelo']);
  const app2 = fs.readFileSync('App.js', 'utf8');
  assert.ok(app2.includes('name="Vuelo"'));
  app.unmount();
});
