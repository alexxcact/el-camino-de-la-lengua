// ───────────────────────────────────────────────────────────────
// Diálogos de los personajes (v1 "personajes vivos").
// Módulo puro: sin React. Las palabras del corpus solo entran vía {palabra}
// y su significado vía {significado} (campo e, en minúscula).
// Tokens: {nombre} {palabra} {significado} {n}
// ───────────────────────────────────────────────────────────────

export const LINEAS = [
  // ── fallo: la Niebla juguetona esconde la palabra ──
  { id: 'fallo-chutun-1', personaje: 'chutun', momento: 'fallo', animo: 'travieso',
    texto: 'Ji, ji. Escondí {palabra}: significa {significado}. ¿La buscamos?' },
  { id: 'fallo-chutun-2', personaje: 'chutun', momento: 'fallo', animo: 'travieso',
    texto: 'Mi neblina tapó {palabra}, que es {significado}. ¡Ya casi!' },
  { id: 'fallo-chutun-3', personaje: 'chutun', momento: 'fallo', animo: 'travieso',
    texto: 'Ji, ji, ¡te la escondí! {palabra} quiere decir {significado}.' },
  { id: 'fallo-chutun-4', personaje: 'chutun', momento: 'fallo', animo: 'travieso',
    texto: 'Escondí {palabra} en la niebla: {significado}. ¡A buscarla!' },

  // ── ayuda: el guía y la tejedora dan una pista con calma ──
  { id: 'ayuda-taita-1', personaje: 'taita-rimay', momento: 'ayuda', animo: 'pensativo',
    texto: 'Despacio. Mira el paisaje y piensa en {significado}.' },
  { id: 'ayuda-taita-2', personaje: 'taita-rimay', momento: 'ayuda', animo: 'pensativo',
    texto: 'Respira y mira con calma la que sigue.' },
  { id: 'ayuda-taita-3', personaje: 'taita-rimay', momento: 'ayuda', animo: 'pensativo',
    texto: 'Sin prisa. Guarda esto: {palabra} es {significado}.' },
  { id: 'ayuda-uma-1', personaje: 'uma', momento: 'ayuda', animo: 'pensativo',
    texto: 'Un tejido se hace sin prisa. Mira bien cada opción que viene.' },
  { id: 'ayuda-uma-2', personaje: 'uma', momento: 'ayuda', animo: 'pensativo',
    texto: 'Sigue el hilo con paciencia: piensa en {significado}.' },
  { id: 'ayuda-uma-3', personaje: 'uma', momento: 'ayuda', animo: 'pensativo',
    texto: 'Hilo a hilo. Recuerda que {palabra} es {significado}.' },

  // ── acierto: el Ave mensajera celebra ──
  { id: 'acierto-pishku-1', personaje: 'pishku', momento: 'acierto', animo: 'feliz',
    texto: '¡Pío! {palabra} es {significado}. ¡Muy bien!' },
  { id: 'acierto-pishku-2', personaje: 'pishku', momento: 'acierto', animo: 'feliz',
    texto: '¡Eso es! {palabra} quiere decir {significado}.' },
  { id: 'acierto-pishku-3', personaje: 'pishku', momento: 'acierto', animo: 'feliz',
    texto: '¡Pío, pío! Llevo la noticia: {palabra} es {significado}.' },
  { id: 'acierto-pishku-4', personaje: 'pishku', momento: 'acierto', animo: 'feliz',
    texto: '¡Acertaste! {palabra}: {significado}. ¡Pío!' },
  { id: 'acierto-pishku-5', personaje: 'pishku', momento: 'acierto', animo: 'feliz',
    texto: '¡Pío! ¡Así se hace!' },

  // ── dominada: la Niebla ya no puede esconder la palabra ──
  { id: 'dominada-chutun-1', personaje: 'chutun', momento: 'dominada', animo: 'sorprendido',
    texto: '¡Oh! Ya no puedo esconder {palabra}. Te la sabes muy bien.' },
  { id: 'dominada-chutun-2', personaje: 'chutun', momento: 'dominada', animo: 'sorprendido',
    texto: '¿Cómo? ¡Encontraste {palabra} entre la niebla, ya es tuya!' },
  { id: 'dominada-chutun-3', personaje: 'chutun', momento: 'dominada', animo: 'sorprendido',
    texto: 'Ji... {palabra} ya no cabe en mi neblina. ¡La dominas!' },

  // ── fin_exito ──
  { id: 'finok-pishku-1', personaje: 'pishku', momento: 'fin_exito', animo: 'feliz',
    texto: '¡Pío! ¡Lo lograste, {nombre}! Vuelo a contarlo.' },
  { id: 'finok-pishku-2', personaje: 'pishku', momento: 'fin_exito', animo: 'feliz',
    texto: '¡Pío, pío! ¡Qué buen camino hiciste hoy!' },
  { id: 'finok-uma-1', personaje: 'uma', momento: 'fin_exito', animo: 'feliz',
    texto: 'Cada acierto fue un hilo, {nombre}. Hoy tejiste bonito.' },
  { id: 'finok-uma-2', personaje: 'uma', momento: 'fin_exito', animo: 'feliz',
    texto: 'Con paciencia, hilo a hilo, el tejido creció.' },
  { id: 'finok-taita-1', personaje: 'taita-rimay', momento: 'fin_exito', animo: 'feliz',
    texto: 'Bien hecho, {nombre}. Mira cuánto camino recorriste.' },
  { id: 'finok-taita-2', personaje: 'taita-rimay', momento: 'fin_exito', animo: 'feliz',
    texto: 'Despacio y con calma llegaste lejos. Bien hecho.' },

  // ── fin_fallo ──
  { id: 'finko-chutun-1', personaje: 'chutun', momento: 'fin_fallo', animo: 'travieso',
    texto: 'Ji, ji. Me quedé con {palabra}: es {significado}. ¡Otra vuelta!' },
  { id: 'finko-chutun-2', personaje: 'chutun', momento: 'fin_fallo', animo: 'travieso',
    texto: 'Me quedé con una: {palabra}, {significado}. ¿Jugamos de nuevo?' },
  { id: 'finko-taita-1', personaje: 'taita-rimay', momento: 'fin_fallo', animo: 'pensativo',
    texto: 'El camino se recorre despacio. Mira el paisaje y vuelve a intentarlo.' },
  { id: 'finko-taita-2', personaje: 'taita-rimay', momento: 'fin_fallo', animo: 'pensativo',
    texto: 'Respira. Cada vuelta te enseña algo nuevo del territorio.' },

  // ── heroe: tarjeta de cada personaje con su número ──
  // pishku: n = racha de días
  { id: 'heroe-pishku-0', personaje: 'pishku', momento: 'heroe', animo: 'feliz', cuando: { nMax: 0 },
    texto: '¡Pío! Hoy puede empezar tu racha de días.' },
  { id: 'heroe-pishku-1', personaje: 'pishku', momento: 'heroe', animo: 'feliz', cuando: { nMin: 1, nMax: 1 },
    texto: '¡Pío! Llevas 1 día seguido. ¡Mañana volamos otra vez!' },
  { id: 'heroe-pishku-n', personaje: 'pishku', momento: 'heroe', animo: 'feliz', cuando: { nMin: 2 },
    texto: '¡Pío! ¡{n} días seguidos! Llevo la noticia por el cielo.' },
  // chutun: n = palabras en Repaso
  { id: 'heroe-chutun-0', personaje: 'chutun', momento: 'heroe', animo: 'travieso', cuando: { nMax: 0 },
    texto: 'Ji, ji. No tengo ninguna palabra escondida. ¡Por ahora!' },
  { id: 'heroe-chutun-1', personaje: 'chutun', momento: 'heroe', animo: 'travieso', cuando: { nMin: 1, nMax: 1 },
    texto: 'Ji, ji. Escondí 1 palabra en Repaso. ¿La encuentras?' },
  { id: 'heroe-chutun-n', personaje: 'chutun', momento: 'heroe', animo: 'travieso', cuando: { nMin: 2 },
    texto: 'Ji, ji. Tengo {n} palabras escondidas en Repaso.' },
  // taita-rimay: n = mundos completados (0..5)
  { id: 'heroe-taita-0', personaje: 'taita-rimay', momento: 'heroe', animo: 'pensativo', cuando: { nMax: 0 },
    texto: 'Mira el paisaje con calma. Tu primer mundo te espera.' },
  { id: 'heroe-taita-1', personaje: 'taita-rimay', momento: 'heroe', animo: 'feliz', cuando: { nMin: 1, nMax: 1 },
    texto: 'Ya completaste 1 mundo. Sigamos mirando el territorio.' },
  { id: 'heroe-taita-n', personaje: 'taita-rimay', momento: 'heroe', animo: 'feliz', cuando: { nMin: 2, nMax: 4 },
    texto: 'Completaste {n} mundos. El paisaje se abre a tu paso.' },
  { id: 'heroe-taita-5', personaje: 'taita-rimay', momento: 'heroe', animo: 'feliz', cuando: { nMin: 5 },
    texto: 'Recorriste los {n} mundos. Ahora míralos de nuevo, despacio.' },
  // uma: n = palabras vistas (0..75)
  { id: 'heroe-uma-0', personaje: 'uma', momento: 'heroe', animo: 'neutral', cuando: { nMax: 0 },
    texto: 'El telar está listo. El primer hilo te espera.' },
  { id: 'heroe-uma-1', personaje: 'uma', momento: 'heroe', animo: 'feliz', cuando: { nMin: 1, nMax: 1 },
    texto: 'Ya tienes 1 hilo en el tejido. Con paciencia crece.' },
  { id: 'heroe-uma-n', personaje: 'uma', momento: 'heroe', animo: 'feliz', cuando: { nMin: 2 },
    texto: 'Llevas {n} palabras vistas: {n} hilos en mi tejido.' },
  // kinti: n = palabras que faltan por descubrir
  { id: 'heroe-kinti-0', personaje: 'kinti', momento: 'heroe', animo: 'feliz', cuando: { nMax: 0 },
    texto: '¡Descubrimos todas las palabras! Vamos a recorrer el camino otra vez.' },
  { id: 'heroe-kinti-1', personaje: 'kinti', momento: 'heroe', animo: 'feliz', cuando: { nMin: 1, nMax: 1 },
    texto: '¡Solo nos falta 1 palabra por descubrir! Vamos a buscarla.' },
  { id: 'heroe-kinti-n', personaje: 'kinti', momento: 'heroe', animo: 'neutral', cuando: { nMin: 2 },
    texto: 'Nos faltan {n} palabras por descubrir. ¡Vamos juntos!' },

  // ── saludos ──
  { id: 'srep-chutun-1', personaje: 'chutun', momento: 'saludo_repaso', animo: 'travieso', cuando: { nMin: 1, nMax: 1 },
    texto: 'Ji, ji. Hay 1 palabra escondida en Repaso. ¿Vamos a encontrarla?' },
  { id: 'srep-chutun-n', personaje: 'chutun', momento: 'saludo_repaso', animo: 'travieso', cuando: { nMin: 2 },
    texto: 'Ji, ji. Escondí {n} palabras en Repaso. ¿Las encuentras?' },
  { id: 'srac-pishku-1', personaje: 'pishku', momento: 'saludo_racha', animo: 'feliz', cuando: { nMin: 2 },
    texto: '¡Pío! ¡{n} días seguidos! Hoy volamos otra vez.' },
  { id: 'srac-pishku-2', personaje: 'pishku', momento: 'saludo_racha', animo: 'feliz', cuando: { nMin: 2 },
    texto: '¡Pío, pío! Tu racha va en {n} días. ¡Qué alegría!' },
  { id: 'sreg-uma-1', personaje: 'uma', momento: 'saludo_regreso', animo: 'feliz',
    texto: 'Qué bueno verte, {nombre}. El hilo sigue donde lo dejaste.' },
  { id: 'sreg-uma-2', personaje: 'uma', momento: 'saludo_regreso', animo: 'feliz',
    texto: 'Hola de nuevo. Retomemos el tejido, sin prisa.' },
  { id: 'sdia-pishku-1', personaje: 'pishku', momento: 'saludo_dia', animo: 'feliz',
    texto: '¡Pío! La palabra de hoy: {palabra}, que es {significado}.' },
  { id: 'sdia-pishku-2', personaje: 'pishku', momento: 'saludo_dia', animo: 'feliz',
    texto: '¡Pío! Traigo noticia: hoy toca {palabra}, {significado}.' },
];

const TOKEN_RE = /\{(\w+)\}/g;

function vacio(v) {
  return v === undefined || v === null || v === '';
}

function normalizarPersonaje(id) {
  return typeof id === 'string' ? id.replace('_', '-') : id;
}

/** Tokens {x} que usa una plantilla. */
export function tokensDe(texto) {
  const out = new Set();
  String(texto).replace(TOKEN_RE, (_, k) => { out.add(k); return ''; });
  return [...out];
}

/** Reemplaza {nombre} {palabra} {significado} {n}. Tokens sin valor quedan vacíos. */
export function resolver(texto, ctx = {}) {
  return String(texto ?? '')
    .replace(TOKEN_RE, (_, k) => (vacio(ctx?.[k]) ? '' : String(ctx[k])))
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function cumpleCuando(cuando, ctx) {
  if (!cuando) return true;
  const n = ctx?.n;
  if (typeof n !== 'number' || Number.isNaN(n)) return false;
  if (typeof cuando.nMin === 'number' && n < cuando.nMin) return false;
  if (typeof cuando.nMax === 'number' && n > cuando.nMax) return false;
  return true;
}

/**
 * Elige una línea para un momento (y personaje, si se pasa).
 * Devuelve { id, personaje, animo, texto (resuelto) } o null.
 */
export function elegirLinea({ personaje, momento, ctx = {}, ultima = null, semilla = null } = {}) {
  const pj = normalizarPersonaje(personaje);
  const c = ctx || {};
  let candidatos = LINEAS.filter(l =>
    l.momento === momento &&
    (!pj || l.personaje === pj) &&
    tokensDe(l.texto).every(k => !vacio(c[k])) &&
    cumpleCuando(l.cuando, c)
  );
  if (candidatos.length === 0) return null;
  if (ultima && candidatos.length > 1) {
    const sinUltima = candidatos.filter(l => l.id !== ultima);
    if (sinUltima.length > 0) candidatos = sinUltima;
  }
  const idx = typeof semilla === 'number' && Number.isFinite(semilla)
    ? Math.abs(Math.floor(semilla)) % candidatos.length
    : Math.floor(Math.random() * candidatos.length);
  const l = candidatos[idx];
  return { id: l.id, personaje: l.personaje, animo: l.animo, texto: resolver(l.texto, c) };
}
