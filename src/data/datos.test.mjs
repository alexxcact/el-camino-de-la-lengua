import { test } from 'node:test';
import assert from 'node:assert/strict';
import { palabras, mundos, frases, personajes, CINEMATICAS, logros, TIPOS_MISION } from './datos.js';
import { hidratarEstado, serializarEstado, STORAGE_KEY } from '../context/logica.js';

// Contrato del listado entregado: los ID no se infieren del orden del archivo.
const listadoSolicitado = `
1|Zon|Frailejón
2|Ina|Viento
3|Chill|Cielo
4|Chil|Frío / helado
5|Pud|Cerro / altura
6|Put|Volcán / altura
7|Pa|Sol
8|Pe|Luna / media luna
9|Pepe|Luna llena
10|Pingal|Arco iris
11|Pue|Redondo / círculo
12|Tuta|Espiral / centro
13|Punch|Blanco
14|Pulan|Amarillo
15|Cuanda|Rojo
16|Piar|Maíz
17|Piaran|Desgranar maíz
18|Turma|Papa
19|Yacuara|Rama o planta de papa
20|Caguara|Variedad de papa
21|Puli|Fruto
22|Capulí|Gran fruto
23|Cun|Yuca
24|Cuat|Comer
25|Yan|Sal
26|Yamata|Rica sal
27|Yaguacha|Alimento de la casa grande
28|Tarta|Planta valiosa
29|Tar|Planta / árbol
30|Poyo|Lugar para guardar papa-semilla
31|Pas|Familia
32|Cal|Trabajo / fuerza
33|Paskal|Trabajo comunitario de las familias
34|Gua|Hermano / hermana
35|Au|Voz / grito
36|Car|Traer / cargar
37|Mal|Ir
38|Que|Hacer / crear
39|Quer|Pueblo / tierra / lugar
40|Guanga|Telar de mano
41|Guango|Atado / copo
42|Cuenda|Hilo / lana
43|Quinchil|Elemento del telar
44|Chindé|Cesta de bejuco o lana
45|Hopa|Saludo al llegar de visita
46|In|Fuego / candela / tulpa
47|Chu|Leña
48|Chula|Haz de leña
49|Chular|Hacer haces de leña
50|Imbuera|Unión del fuego
51|Tacín|Fuego de cama / abrigo
52|Chapil|Bebida sabrosa
53|Chicha|Bebida tradicional
54|Chara|Sopa de cebada
55|Canchape|Bebida o alimento
56|Guamuca|Bebida de ofrenda / poder
57|Guanto|Planta poderosa
58|Chuma|Final de la leña
59|Pilche|Vasija para beber
60|Cumba|Techo con respiradero
61|Cual|Agua / río
62|Cuar|Agua / río / quebrada
63|Fuel|Quebrada / agua
64|Pi|Agua / líquido / río
65|Es|Agua / río / lugar
66|Cuas|Agua / planta de agua
67|Gualte|Bejuco de agua
68|Gualguán|Poder del agua
69|Guapil|Planta del agua grande
70|Cuarris|Planta del sitio del agua
71|Pipisiqui|Fruto que hace agua
72|Chichacuas|Animal asociado al agua
73|Cuatín|Animal del fuego y agua
74|Cusumbe|Animal viejo del agua
75|Cuasmal|Ir del agua / río
`.trim().split('\n').map(fila => {
  const [id, p, e] = fila.split('|');
  return { id: Number(id), p, e };
});

test('el diccionario coincide con las 75 entradas e IDs del listado solicitado', () => {
  assert.equal(palabras.length, 75);
  assert.deepEqual(palabras.map(({ id, p, e }) => ({ id, p, e })), listadoSolicitado);
  assert.equal(new Set(palabras.map(p => p.p)).size, 75);
});

test('los cinco mundos tienen sus títulos, descripciones y 15 IDs consecutivos sin huecos', () => {
  const esperados = [
  {
    "id": 1,
    "titulo": "Pud",
    "subtitulo": "Las Alturas",
    "desc": "Un camino entre cerros, volcanes, viento, cielo y símbolos del territorio."
  },
  {
    "id": 2,
    "titulo": "Piar",
    "subtitulo": "La Tierra que Alimenta",
    "desc": "Un recorrido por la chagra, el maíz, la papa, las plantas y los alimentos."
  },
  {
    "id": 3,
    "titulo": "Paskal",
    "subtitulo": "La Fuerza de la Comunidad",
    "desc": "Un mundo dedicado a la familia, el trabajo comunitario, el tejido y el encuentro."
  },
  {
    "id": 4,
    "titulo": "In",
    "subtitulo": "El Fuego del Hogar",
    "desc": "El espacio del fuego, la tulpa, la cocina, la leña y los saberes alrededor del hogar."
  },
  {
    "id": 5,
    "titulo": "Cuasmal",
    "subtitulo": "El Camino del Agua",
    "desc": "Un recorrido por ríos, quebradas, plantas y seres relacionados con el agua."
  }
];
  assert.deepEqual(mundos.map(({ id, titulo, subtitulo, desc }) => ({ id, titulo, subtitulo, desc })), esperados);
  assert.deepEqual(mundos.map(m => m.palabrasIds.length), [15, 15, 15, 15, 15]);
  assert.deepEqual(mundos.flatMap(m => m.palabrasIds), Array.from({ length: 75 }, (_, i) => i + 1));
  for (const mundo of mundos) {
    assert.deepEqual(palabras.filter(p => p.mundo === mundo.id).map(p => p.id), mundo.palabrasIds);
  }
  assert.deepEqual(TIPOS_MISION, ['quiz', 'parejas', 'dictado', 'escucha', 'memoria']);
});

test('cada entrada conserva el esquema del juego y declara el respaldo sin inventar pronunciaciones', () => {
  for (const palabra of palabras) {
    for (const campo of ['p', 'e', 'cat', 'fon', 'ej', 'emoji', 'tipo', 'respaldo', 'fuente', 'nota']) {
      assert.equal(typeof palabra[campo], 'string', `${palabra.id}: ${campo}`);
      assert.ok(palabra[campo].trim().length > 0);
    }
    assert.equal(palabra.fon, palabra.p.toLocaleLowerCase('es'));
    assert.equal(palabra.respaldo, 'pendiente_validacion');
    assert.match(palabra.fuente, /listado/i);
    assert.ok(palabra.ej.includes(palabra.p));
    assert.ok(!palabra.ej.includes('='));
  }
});

test('los contextos y cinemáticas solo destacan entradas del nuevo corpus', () => {
  assert.deepEqual(frases.map(f => f.id), Array.from({ length: 18 }, (_, i) => i + 1));
  for (const frase of frases) {
    const palabra = palabras.find(p => p.p === frase.past);
    assert.ok(palabra, `Entrada ausente: ${frase.past}`);
    assert.equal(frase.esp, palabra.e);
    assert.equal(frase.mundo, palabra.mundo);
    assert.ok(frase.ctx.trim().length > 0);
  }
  assert.deepEqual(Object.keys(CINEMATICAS), mundos.map(m => `mundo${m.id}`));
  for (const mundo of mundos) {
    const cine = CINEMATICAS[`mundo${mundo.id}`];
    assert.equal(cine.titulo, `${mundo.titulo} · ${mundo.subtitulo}`);
    assert.ok(cine.escenas.length > 0);
    for (const escena of cine.escenas) {
      assert.ok(personajes.some(p => p.id.replaceAll('-', '_') === escena.personaje));
      assert.ok(escena.fondo === mundo.id || escena.fondo === 'aurora');
      for (const destacada of escena.resaltar) {
        assert.ok(palabras.some(p => p.p === destacada), destacada);
        assert.ok(escena.texto.includes(destacada), destacada);
      }
    }
  }
});

test('hidratar y guardar una partida anterior conserva el progreso por ID y las medallas', () => {
  const guardado = {
    nombreJugador: 'Caminante', puntos: 870, nivel: 5,
    palabrasVistas: [1, 15, 16, 31, 46, 61, 75],
    mundosCompletados: [1, 2, 3],
    misionesCompletadas: ['quiz-1', 'parejas-1', 'dictado-1', 'escucha-1', 'memoria-1'],
    logrosDesbloqueados: logros.slice(0, 7).map(l => l.id),
    cinematicasVistas: ['mundo1', 'mundo2', 'mundo3'],
    avatar: { piel: 2, ropa: 2, sombrero: 1, accesorio: 0 },
    avatarDesbloqueados: { ropa: [0, 1, 2], sombrero: [0, 1], accesorio: [0] },
    racha: 8, retosDiariosTotal: 12, finalVisto: false,
  };
  assert.equal(STORAGE_KEY, '@camino_lengua_estado');
  const hidratado = hidratarEstado(guardado);
  const recuperado = serializarEstado(hidratado);
  for (const [clave, valor] of Object.entries(guardado)) assert.deepEqual(recuperado[clave], valor, clave);
  assert.deepEqual(palabras.filter(p => hidratado.palabrasVistas.has(p.id)).map(p => p.id), guardado.palabrasVistas);
  assert.ok(guardado.logrosDesbloqueados.every(id => logros.some(l => l.id === id)));
});

