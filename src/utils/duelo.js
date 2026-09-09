import { shuffle } from '../data/datos.js';

const TIPOS = ['quiz', 'escucha', 'relampago'];

// Con una sola palabra aprendida ya se puede jugar; el banco inicial solo se
// ofrece a quien todavía no tiene vocabulario en la mochila.
export function bancoDuelo(palabras, palabrasVistas) {
  const vistas = palabras.filter(p => palabrasVistas.has(p.id));
  return vistas.length > 0 ? vistas : palabras.filter(p => p.mundo === 1);
}

export function filtrarBancoDuelo(base, modo, mundo, categoria) {
  if (modo === 'mundo') return base.filter(p => p.mundo === mundo);
  if (modo === 'categoria') return base.filter(p => p.cat === categoria);
  return base;
}

export function generarPreguntaDuelo(pool, random = Math.random) {
  if (pool.length === 0) return null;
  // Una pareja sigue siendo jugable sin inventar distractores de otra categoría.
  const tipo = pool.length === 1 ? 'relampago' : TIPOS[Math.floor(random() * TIPOS.length)];
  if (tipo === 'relampago') {
    const pares = shuffle(pool).slice(0, 3);
    const tiles = shuffle([
      ...pares.map(w => ({ key: 'p' + w.id, id: w.id, txt: w.p, emoji: w.emoji, lado: 'past' })),
      ...pares.map(w => ({ key: 'e' + w.id, id: w.id, txt: w.e, emoji: w.emoji, lado: 'esp' })),
    ]);
    return { tipo, tiles };
  }
  const target = pool[Math.floor(random() * pool.length)];
  const otras = shuffle(pool.filter(w => w.id !== target.id)).slice(0, 3);
  return { tipo, target, opciones: shuffle([target, ...otras]) };
}
