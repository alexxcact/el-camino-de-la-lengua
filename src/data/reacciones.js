// ───────────────────────────────────────────────────────────────
// Qué personaje habla y con qué línea (v1 "personajes vivos").
// Módulo puro: sin React. Lo usan Quiz, Escucha, Personajes y Mapa, y se
// puede importar en tests.
// ───────────────────────────────────────────────────────────────
import { palabras } from './datos.js';
import { elegirLinea } from './dialogos.js';
import { ctxPalabra } from './personajesUtil.js';

// Reacción de los personajes a una respuesta (Pieza C).
// fallo -> la Niebla esconde la palabra; 2+ fallos seguidos -> ayuda del guía o la tejedora;
// acierto de una palabra del Repaso -> dominada; acierto normal -> el Ave celebra.
export function reaccionPara({ acerto, palabraId, estabaFallada, fallosSeguidos, permitirDominada, ultima }) {
  const ctx = ctxPalabra(palabraId);
  const intentos = [];
  if (!acerto) {
    if (fallosSeguidos >= 2) {
      const primero = fallosSeguidos % 2 === 0 ? 'taita-rimay' : 'uma';
      intentos.push({ personaje: primero, momento: 'ayuda' });
      intentos.push({ personaje: primero === 'uma' ? 'taita-rimay' : 'uma', momento: 'ayuda' });
    }
    intentos.push({ personaje: 'chutun', momento: 'fallo' });
  } else {
    if (estabaFallada && permitirDominada) intentos.push({ personaje: 'chutun', momento: 'dominada' });
    intentos.push({ personaje: 'pishku', momento: 'acierto' });
  }
  for (const it of intentos) {
    const linea = elegirLinea({ ...it, ctx, ultima });
    if (linea) return { ...linea, momento: it.momento };
  }
  return null;
}

// Línea de cierre cuando la sesión no se aprueba: la Niebla nombra una palabra
// que se le escapó al jugador; si no hay, el guía anima con calma.
export function cierreSinAprobar(falladas, nombre) {
  const lista = falladas || [];
  if (lista.length > 0) {
    const id = lista[Math.floor(Math.random() * lista.length)];
    const linea = elegirLinea({ personaje: 'chutun', momento: 'fin_fallo', ctx: { nombre, ...ctxPalabra(id) } });
    if (linea) return linea;
  }
  return elegirLinea({ personaje: 'taita-rimay', momento: 'fin_fallo', ctx: { nombre } })
    || { personaje: 'taita-rimay', animo: 'pensativo', texto: 'Respira y vuelve a intentarlo con calma.' };
}

// Número que cada personaje "cuenta" en su línea del hero.
// `racha` debe venir ya validada (rachaVigente); si no llega, usa estado.racha.
export function numeroDe(id, estado, racha) {
  const vistas = estado?.palabrasVistas?.size || 0;
  switch (id) {
    case 'pishku': return Number.isFinite(racha) ? racha : (estado?.racha || 0);
    case 'chutun': return (estado?.palabrasFalladas || []).length;
    case 'taita-rimay': return estado?.mundosCompletados?.size || 0;
    case 'uma': return vistas;
    case 'kinti': return Math.max(0, palabras.length - vistas);
    default: return 0;
  }
}

// Días enteros entre dos fechas locales 'YYYY-MM-DD' (b - a). null si alguna no es válida.
export function diasEntre(a, b) {
  const aDate = (f) => {
    const [y, m, d] = String(f || '').split('-').map(Number);
    return y && m && d ? new Date(y, m - 1, d) : null;
  };
  const da = aDate(a), db = aDate(b);
  if (!da || !db) return null;
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

// Saludo diario del Mapa. Prioridad: repaso > racha > regreso (3+ días fuera) > palabra del día.
// Devuelve { linea, accion, accionTexto } o null.
export function elegirSaludo({ nFalladas = 0, racha = 0, diasActivos = [], hoy, palabraDiaId, nombre, retoDisponible = false, semilla = null }) {
  const ctxBase = { nombre };
  if (nFalladas > 0) {
    const linea = elegirLinea({ personaje: 'chutun', momento: 'saludo_repaso', ctx: { ...ctxBase, n: nFalladas }, semilla });
    if (linea) return { linea, accion: 'repaso', accionTexto: 'Repasar' };
  }
  if (racha >= 2) {
    const linea = elegirLinea({ personaje: 'pishku', momento: 'saludo_racha', ctx: { ...ctxBase, n: racha }, semilla });
    if (linea) {
      return retoDisponible
        ? { linea, accion: 'reto', accionTexto: 'Reto de hoy' }
        : { linea, accion: null, accionTexto: null };
    }
  }
  const ultimoOtroDia = [...(diasActivos || [])].reverse().find(d => d !== hoy);
  const diasAusente = ultimoOtroDia ? diasEntre(ultimoOtroDia, hoy) : null;
  if (diasAusente != null && diasAusente >= 3) {
    const linea = elegirLinea({ personaje: 'uma', momento: 'saludo_regreso', ctx: ctxBase, semilla });
    if (linea) return { linea, accion: null, accionTexto: null };
  }
  const linea = elegirLinea({ personaje: 'pishku', momento: 'saludo_dia', ctx: { ...ctxBase, ...ctxPalabra(palabraDiaId) }, semilla });
  return linea ? { linea, accion: null, accionTexto: null } : null;
}
