// Lógica pura de «El vuelo de Auara»: Auara vuela por el páramo y debe
// atravesar la nube que trae el significado de la palabra pasta que se busca.
// Sin React: se prueba con node --test.

const VACIAS = new Set(['del', 'las', 'los', 'una', 'que', 'con', 'para', 'por', 'gran', 'grande', 'hacer']);

const sinTildes = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function tokens(e) {
  return new Set(sinTildes(e).split(/[^a-zñ]+/).filter(t => t.length > 2 && !VACIAS.has(t)));
}

// Dos significados «se parecen» si comparten una palabra con contenido
// (Cual «Agua / río» y Pi «Agua / río / líquido»): no pueden ir en la misma ronda.
export function seParecen(a, b) {
  const A = tokens(a.e);
  for (const t of tokens(b.e)) if (A.has(t)) return true;
  return false;
}

// Palabras con las que se vuela: las aprendidas; si son pocas, se completan
// con las del primer mundo para que un niño que empieza también pueda jugar.
export function bancoVuelo(palabras, vistas) {
  const aprendidas = palabras.filter(p => vistas.has(p.id));
  if (aprendidas.length >= 8) return aprendidas;
  return [...aprendidas, ...palabras.filter(p => p.mundo === 1 && !vistas.has(p.id))];
}

function barajar(lista, rnd) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Una ronda: la palabra que se busca y tres nubes (una correcta). Evita
// repetir las palabras recientes y que dos nubes signifiquen casi lo mismo.
export function nuevaRonda(banco, todas, recientes = [], rnd = Math.random) {
  const frescas = banco.filter(p => !recientes.includes(p.id));
  const fuente = frescas.length ? frescas : banco;
  const objetivo = fuente[Math.floor(rnd() * fuente.length)];
  const distractores = [];
  for (const p of [...barajar(banco, rnd), ...barajar(todas, rnd)]) {
    if (distractores.length === 2) break;
    if (p.id === objetivo.id || distractores.some(d => d.id === p.id)) continue;
    if (seParecen(objetivo, p) || distractores.some(d => seParecen(d, p))) continue;
    distractores.push(p);
  }
  const correcto = Math.floor(rnd() * 3);
  const opciones = [...distractores];
  opciones.splice(correcto, 0, objetivo);
  return { objetivo, opciones, correcto };
}

// Carril (0 arriba, 1 centro, 2 abajo) cuya nube contiene la altura y; -1 si pasa entre nubes.
export function carrilEn(y, centros, altoNube) {
  return centros.findIndex(c => y >= c - altoNube / 2 && y <= c + altoNube / 2);
}

// Carril más cercano a la altura y (siempre hay uno).
export function carrilCercano(y, centros) {
  let mejor = 0;
  centros.forEach((c, i) => { if (Math.abs(y - c) < Math.abs(y - centros[mejor])) mejor = i; });
  return mejor;
}

// ¿Qué nube eligió Auara en este cuadro? Si toca una nube, esa. Si la columna
// llega a su mitad sin que la haya tocado (pasó por debajo, por encima o por
// un hueco), cuenta la nube más cercana: no se puede esquivar la pregunta.
// Devuelve el carril elegido o null si todavía no hay elección.
export function eleccionEnPaso({ x, ancho, aveX, radio = 14, y, centros, altoNube }) {
  if (x > aveX + radio || x + ancho < aveX - radio) return null;
  const dentro = carrilEn(y, centros, altoNube);
  if (dentro >= 0) return dentro;
  if (x + ancho / 2 <= aveX) return carrilCercano(y, centros);
  return null;
}

// La velocidad crece con cada acierto, con un tope amable para niños.
export const VEL_INICIAL = 140;
export const VEL_MAX = 320;
export const velocidad = (aciertos) => Math.min(VEL_MAX, VEL_INICIAL + aciertos * 9);

// Puntos del juego que se suman al avance (con tope, para que no se «farmee»).
export const puntosDeVuelo = (aciertos) => Math.max(0, Math.min(15, aciertos));

// Texto corto para la nube: sin paréntesis («Trabajo comunitario (minga)»).
export const textoNube = (e) => String(e || '').replace(/\s*\([^)]*\)\s*/g, ' ').trim();

export const VIDAS = 3;
