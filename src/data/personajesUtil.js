// Utilidades puras sobre los personajes del juego (sin React).
// Aceptan tanto el id de datos ("taita-rimay") como la clave de asset ("taita_rimay").
import { personajes, palabras, CINEMATICAS } from './datos.js';

const CLAVES = ['kinti', 'taita_rimay', 'uma', 'pishku', 'chutun'];

function normalizar(idOClave) {
  if (typeof idOClave !== 'string') return null;
  const clave = idOClave.trim().toLowerCase().replace(/-/g, '_');
  return CLAVES.includes(clave) ? clave : null;
}

export function claveRetrato(idOClave) {
  return normalizar(idOClave) || 'pishku';
}

export function idPersonaje(idOClave) {
  return claveRetrato(idOClave).replace(/_/g, '-');
}

export function datosPersonaje(idOClave) {
  const clave = normalizar(idOClave);
  if (!clave) return null;
  const id = clave.replace(/_/g, '-');
  return personajes.find(p => p.id === id) || null;
}

const NOMBRES_CORTOS = {
  kinti: 'Tercán',
  'taita-rimay': 'Taita Ipaín',
  uma: 'Mama Cuenda',
  pishku: 'Auara',
  chutun: 'Chalaca',
};

export function nombreCorto(idOClave) {
  return NOMBRES_CORTOS[idPersonaje(idOClave)];
}

export const ANFITRIONES = {
  quiz: 'pishku',
  escucha: 'pishku',
  parejas: 'uma',
  memoria: 'uma',
  dictado: 'taita-rimay',
};

function escenasDe(clave) {
  const out = [];
  for (const k of Object.keys(CINEMATICAS)) {
    for (const escena of CINEMATICAS[k].escenas || []) {
      if (escena.personaje === clave) out.push(escena);
    }
  }
  return out;
}

const FONDO_RESPALDO = { kinti: 4, chutun: 1 };

export function mundoFondo(idOClave) {
  const clave = normalizar(idOClave);
  if (!clave) return null;
  const escena = escenasDe(clave).find(e => typeof e.fondo === 'number');
  if (escena) return escena.fondo;
  return FONDO_RESPALDO[clave] ?? null;
}

export function palabrasDePersonaje(idOClave) {
  const clave = normalizar(idOClave);
  if (!clave) return [];
  const vistas = new Set();
  const out = [];
  for (const escena of escenasDe(clave)) {
    for (const termino of escena.resaltar || []) {
      const palabra = palabras.find(w => w.p === termino);
      if (palabra && !vistas.has(palabra.id)) {
        vistas.add(palabra.id);
        out.push(palabra);
      }
    }
  }
  return out;
}

// Solo la primera letra en minúscula: respeta el resto del campo e (p. ej. "Sol").
function minusculaInicial(e) {
  return e ? e.charAt(0).toLowerCase() + e.slice(1) : '';
}

export function significadoDe(p) {
  const palabra = palabras.find(w => w.p === p);
  return palabra ? minusculaInicial(palabra.e) : '';
}

export function ctxPalabra(idONumeroOP) {
  let palabra = null;
  if (typeof idONumeroOP === 'number') {
    palabra = palabras.find(w => w.id === idONumeroOP);
  } else if (typeof idONumeroOP === 'string') {
    palabra = palabras.find(w => w.p === idONumeroOP);
  }
  if (!palabra) return {};
  return { palabra: palabra.p, significado: minusculaInicial(palabra.e) };
}

// ── Figuras vectoriales (src/components/figuras, viewBox = ancho x alto) ──
// Medidas del viewBox y puntos de referencia relativos (0..1 dentro de la figura):
//   cabeza: centro aproximado de la cabeza (ahí van las decoraciones del ánimo)
//   radioCabeza: radio de la cabeza relativo a la ALTURA de la figura
//   pie: dónde apoya (centro de la sombra de suelo); anchoSombra relativo al ancho
//   flota: no pisa el suelo (sombra pequeña y tenue que respira con la flotación)
//   escala: tamaño propio frente a un personaje adulto (Kinti = 1). `tamano` es la
//           altura de referencia de un adulto; Chutun (nubecita) y Pishku (colibrí)
//           salen más pequeños, y Chutun no se amplía tanto (su viewBox es de 256 de alto).
export const FIGURA_INFO = {
  kinti:       { ancho: 268, alto: 560, cabeza: { x: 0.48, y: 0.10 }, radioCabeza: 0.075, pie: { x: 0.52, y: 0.97 }, anchoSombra: 0.95, flota: false, escala: 1 },
  uma:         { ancho: 560, alto: 469, cabeza: { x: 0.59, y: 0.23 }, radioCabeza: 0.09,  pie: { x: 0.50, y: 0.95 }, anchoSombra: 0.95, flota: false, escala: 1 },
  pishku:      { ancho: 560, alto: 475, cabeza: { x: 0.77, y: 0.28 }, radioCabeza: 0.08,  pie: { x: 0.50, y: 1.02 }, anchoSombra: 0.45, flota: true,  escala: 0.8 },
  chutun:      { ancho: 294, alto: 256, cabeza: { x: 0.38, y: 0.36 }, radioCabeza: 0.30,  pie: { x: 0.48, y: 0.97 }, anchoSombra: 0.70, flota: false, escala: 0.6 },
  taita_rimay: { ancho: 500, alto: 560, cabeza: { x: 0.42, y: 0.25 }, radioCabeza: 0.09,  pie: { x: 0.45, y: 0.98 }, anchoSombra: 0.70, flota: true,  escala: 1 },
};

export function infoFigura(idOClave) {
  return FIGURA_INFO[claveRetrato(idOClave)];
}

// Relación ancho/alto de la figura recortada.
export function aspectoFigura(idOClave) {
  const f = infoFigura(idOClave);
  return f.ancho / f.alto;
}

// Medidas en pantalla de una figura cuya altura de referencia es `alto` (la de
// un adulto; se aplica la `escala` propia del personaje). Las figuras anchas
// (uma, pishku) no superan `maxAncho` veces su altura: si lo harían, se limita
// el ancho y la altura baja en proporción.
export function medidasFigura(idOClave, alto, maxAncho = 1.25) {
  const base = Number.isFinite(alto) && alto > 0 ? alto : 72;
  const h = base * (infoFigura(idOClave).escala ?? 1);
  const aspecto = aspectoFigura(idOClave);
  let ancho = h * aspecto;
  let altoFinal = h;
  const tope = h * maxAncho;
  if (ancho > tope) {
    ancho = tope;
    altoFinal = tope / aspecto;
  }
  return { ancho: Math.round(ancho), alto: Math.round(altoFinal) };
}

// Márgenes de la caja de PersonajeVivo alrededor de la figura (relativos a su
// altura): sitio para las decoraciones del ánimo y la sombra de suelo.
export const MARGEN_FIGURA = { x: 0.14, arriba: 0.14, abajo: 0.06 };

// Geometría completa de la caja de un PersonajeVivo de altura `tamano`: medidas
// de la caja y de la figura, márgenes y el centro de la cabeza en px de la caja.
export function cajaFigura(idOClave, tamano) {
  const info = infoFigura(idOClave);
  const { ancho: figAncho, alto: figAlto } = medidasFigura(idOClave, tamano);
  const padX = Math.round(figAlto * MARGEN_FIGURA.x);
  const padArriba = Math.round(figAlto * MARGEN_FIGURA.arriba);
  const padAbajo = Math.round(figAlto * MARGEN_FIGURA.abajo);
  return {
    ancho: figAncho + padX * 2,
    alto: figAlto + padArriba + padAbajo,
    figAncho, figAlto, padX, padArriba, padAbajo,
    cabezaX: padX + info.cabeza.x * figAncho,
    cabezaY: padArriba + info.cabeza.y * figAlto,
  };
}
