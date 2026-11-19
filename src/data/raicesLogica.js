// ───────────────────────────────────────────────────────────────
// Raíces de la palabra: lógica pura del minijuego (sin React).
// El jugador ve la traducción de una palabra real y la arma con sus piezas.
// Las piezas de enlace (consonantes sin significado propio) vienen puestas.
// ───────────────────────────────────────────────────────────────

// Generador determinista (mulberry32) para que una ronda se pueda repetir en tests.
function azar(semilla) {
  let a = (Math.abs(Math.floor(semilla)) || 1) >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function barajar(lista, rnd) {
  const out = [...lista];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const norm = (t) => String(t || '').trim().toLowerCase();

// Significados que el jugador no podría distinguir entre sí (agua / río / quebrada…).
const GRUPOS = [
  ['agua', 'río', 'quebrada'],
  ['cerro', 'colina', 'volcán', 'altura', 'loma', 'alto', 'arriba'],
  ['pueblo', 'sitio', 'lugar', 'tierra'],
  ['frío', 'helado', 'cielo'],
  ['familia', 'casa', 'hogar'],
  ['útil', 'sabroso', 'valioso', 'riqueza', 'cosa'],
  ['trabajo', 'fuerza', 'poder'],
  ['pequeño', 'grande'],
];
function sentidos(sig) {
  const out = new Set();
  for (const w of norm(sig).split(/[^a-záéíóúñü]+/).filter(x => x.length > 2)) {
    const g = GRUPOS.findIndex(gr => gr.includes(w));
    out.add(g >= 0 ? `g${g}` : w);
  }
  return out;
}

// Elige `n` palabras para una ronda: primero las que aún no armó.
export function rondaRaices(todas, armadas = [], n = 5, semilla = 1) {
  const rnd = azar(semilla);
  const ya = new Set(armadas);
  const nuevas = barajar(todas.filter(r => !ya.has(r.palabra)), rnd);
  const viejas = barajar(todas.filter(r => ya.has(r.palabra)), rnd);
  return [...nuevas, ...viejas].slice(0, Math.min(n, todas.length));
}

// Fichas para armar `item`: sus piezas con significado más `extra` piezas de
// otras palabras que no se confundan con las suyas (ni por texto ni por sentido). Cada ficha tiene una clave única.
export function fichasDe(item, todas, extra = 2, semilla = 1) {
  const rnd = azar(semilla * 7 + item.palabra.length);
  const propias = item.piezas
    .map((p, i) => ({ ...p, clave: `p${i}` }))
    .filter(p => !p.enlace);
  const usadas = new Set(propias.map(p => norm(p.t)));
  const prohibidos = new Set(propias.flatMap(p => [...sentidos(p.sig)]));
  const candidatas = [];
  for (const otra of todas) {
    if (otra.palabra === item.palabra) continue;
    for (const p of otra.piezas) {
      if (p.enlace || usadas.has(norm(p.t))) continue;
      if ([...sentidos(p.sig)].some(x => prohibidos.has(x))) continue;
      usadas.add(norm(p.t));
      candidatas.push(p);
    }
  }
  const señuelos = barajar(candidatas, rnd).slice(0, extra).map((p, i) => ({ ...p, clave: `s${i}` }));
  return barajar([...propias, ...señuelos], rnd);
}

// Huecos iniciales: los de enlace ya ocupados con su pieza; los demás vacíos (null).
export function huecosIniciales(item) {
  return item.piezas.map(p => (p.enlace ? { ...p, clave: 'enlace', fija: true } : null));
}

// Coloca una ficha en el primer hueco libre. Devuelve los huecos nuevos.
export function colocar(huecos, ficha) {
  const i = huecos.findIndex(h => h === null);
  if (i === -1 || huecos.some(h => h && h.clave === ficha.clave)) return huecos;
  const out = [...huecos];
  out[i] = ficha;
  return out;
}

// Quita la ficha de un hueco (las de enlace no se mueven).
export function quitar(huecos, i) {
  if (!huecos[i] || huecos[i].fija) return huecos;
  const out = [...huecos];
  out[i] = null;
  return out;
}

export const completos = (huecos) => huecos.every(h => h !== null);

// Correcta si las piezas forman la palabra en orden (se compara el texto, así
// dos piezas iguales en otra palabra también valen).
export function esCorrecta(item, huecos) {
  return completos(huecos) && huecos.every((h, i) => norm(h.t) === norm(item.piezas[i].t));
}

// Lectura pasto: de derecha a izquierda, solo las piezas con significado.
export function lecturaDerechaIzquierda(item) {
  return item.piezas.filter(p => !p.enlace && p.sig).map(p => p.sig).reverse();
}
