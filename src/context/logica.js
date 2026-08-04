// Lógica pura del estado del juego — SIN React ni React Native, para poder
// testearla de forma aislada. JuegoContext.js consume todo esto.
//
// Aquí viven las invariantes delicadas del proyecto:
//   - serialización de los Sets a arrays para AsyncStorage (y su reconstrucción)
//   - merge del estado guardado con los defaults (usuarios de versiones viejas)
//   - cálculo de la racha diaria
// Si cambias algo aquí, corre `npm test` antes de commitear.

export const STORAGE_KEY = '@camino_lengua_estado';

export const estadoInicial = {
  nombreJugador: null,   // string o null si aún no lo ha dado (primitivo: se serializa solo)
  puntos: 0,
  nivel: 1,
  palabrasVistas: new Set(),
  mundosCompletados: new Set(),
  misionesCompletadas: new Set(),
  logrosDesbloqueados: new Set(),
  quizJugados: 0,
  parejasJugadas: 0,
  dictadosCorrectos: 0,
  // Racha diaria (primitivos — se serializan directo, no son Sets)
  racha: 0,            // días seguidos jugando
  ultimaSesion: null,  // 'YYYY-MM-DD' de la última vez que se abrió el juego
  palabrasHoy: 0,      // palabras nuevas aprendidas en el día actual
  sonidoActivado: true,// sonidos + vibración (primitivo, se serializa solo)
  finalVisto: false,   // si ya vio la cinemática final (primitivo)
  // Misión diaria + Palabra del Día (todos primitivos, default seguro)
  palabraDiaFecha: null,   // 'YYYY-MM-DD' del día que se asignó la palabra
  palabraDiaId: null,      // id de la palabra del día
  retoDiarioFecha: null,   // 'YYYY-MM-DD' del último reto diario completado
  retosDiariosTotal: 0,    // contador histórico de retos (para logros)
  notificacionesActivadas: false, // recordatorio diario de Pishku
  horaNotificacion: 16,    // hora local (0-23) del recordatorio, default 4:00 PM
  memoriaPerfecta: false,  // ganó alguna vez Memoria sin errores (primitivo)
  diccionarioAbierto: 0,   // veces que abrió el diccionario (para logro Consultor)
  practicasTotal: 0,       // sesiones de práctica libre completadas (logro Repaso constante)
  mejorRacha: 0,           // mejor racha histórica de días seguidos
  diasActivos: [],         // ['YYYY-MM-DD'] con actividad, recortado a MAX_DIAS (calendario)
  duelosJugados: 0,        // partidas de Duelo de 2 jugadas (solo para el logro; el duelo es efímero)
  cinematicasVistas: [],   // ['mundo1', ...] cinemáticas ya vistas (array, merge a default [])
  // Avatar personalizable (objetos planos: se serializan con JSON.stringify igual
  // que el resto del estado no-Set; se mergean con default para usuarios viejos)
  avatar: { piel: 0, ropa: 0, sombrero: 0, accesorio: 0 },
  avatarDesbloqueados: { ropa: [0], sombrero: [0], accesorio: [0] },
  avatarPersonalizado: false, // si ya guardó el avatar al menos una vez
};

export const niveles = [
  { min: 0,  nombre: "Aprendiz de la Palabra" },
  { min: 10, nombre: "Conocedor Andino" },
  { min: 20, nombre: "Guardián del Pastoker" },
  { min: 30, nombre: "Sabedor del Territorio" },
  { min: 50, nombre: "Taita de la Lengua" },
];

// Nivel numérico (cuántos umbrales alcanzados) a partir de los puntos.
export const calcularNivel = (puntos) => niveles.filter(nv => puntos >= nv.min).length;

// ── Helpers de fecha local (para la racha) ──
export const fechaISO = (d) => {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};
export const fechaHoy  = () => fechaISO(new Date());
export const fechaAyer = () => { const d = new Date(); d.setDate(d.getDate() - 1); return fechaISO(d); };

// Hash determinístico de una fecha → entero estable (misma fecha = mismo número en
// todos los dispositivos, y no cambia al recargar). Sirve de "semilla" para elegir
// la palabra del día sin azar.
export const seedFecha = (f) => {
  let h = 0;
  for (let i = 0; i < f.length; i++) h = (h * 31 + f.charCodeAt(i)) >>> 0;
  return h;
};

export const MAX_DIAS_ACTIVOS = 90; // tope del historial de días activos (no crece sin límite)

// Agrega la fecha de hoy a diasActivos (sin duplicar) y recorta a los más recientes.
export function agregarDiaActivo(base) {
  const hoy = fechaHoy();
  const dias = base.diasActivos || [];
  if (dias.includes(hoy)) return base;
  return { ...base, diasActivos: [...dias, hoy].slice(-MAX_DIAS_ACTIVOS) };
}

// Calcula racha/palabrasHoy según cuándo fue la última sesión (y actualiza mejorRacha)
export function aplicarSesion(base) {
  const hoy = fechaHoy();
  if (base.ultimaSesion === hoy) return base;            // misma sesión del día: sin cambios
  const racha = base.ultimaSesion === fechaAyer() ? (base.racha || 0) + 1 : 1;
  const mejorRacha = Math.max(base.mejorRacha || 0, racha);
  return { ...base, racha, mejorRacha, palabrasHoy: 0, ultimaSesion: hoy };
}

// Convierte el estado (con Sets) al objeto plano que se guarda en AsyncStorage.
// Los cuatro Sets pasan a arrays; el resto se copia tal cual.
export function serializarEstado(estado) {
  return {
    ...estado,
    palabrasVistas:      [...estado.palabrasVistas],
    mundosCompletados:   [...estado.mundosCompletados],
    misionesCompletadas: [...estado.misionesCompletadas],
    logrosDesbloqueados: [...estado.logrosDesbloqueados],
  };
}

// Reconstruye el estado en memoria (con Sets) desde lo parseado de AsyncStorage,
// mergeando con los defaults para usuarios que vienen de versiones anteriores.
// Acepta null/undefined (primer arranque) devolviendo el estado inicial fresco.
export function hidratarEstado(parsed) {
  const p = parsed || {};
  return {
    ...estadoInicial,
    ...p,
    palabrasVistas:      new Set(p.palabrasVistas      || []),
    mundosCompletados:   new Set(p.mundosCompletados   || []),
    misionesCompletadas: new Set(p.misionesCompletadas || []),
    logrosDesbloqueados: new Set(p.logrosDesbloqueados || []),
    diasActivos:       Array.isArray(p.diasActivos)       ? p.diasActivos       : [],
    cinematicasVistas: Array.isArray(p.cinematicasVistas) ? p.cinematicasVistas : [],
    // merge profundo del avatar (objetos planos) para usuarios sin estos campos
    avatar: { ...estadoInicial.avatar, ...(p.avatar || {}) },
    avatarDesbloqueados: {
      ropa:      p.avatarDesbloqueados?.ropa      || estadoInicial.avatarDesbloqueados.ropa,
      sombrero:  p.avatarDesbloqueados?.sombrero  || estadoInicial.avatarDesbloqueados.sombrero,
      accesorio: p.avatarDesbloqueados?.accesorio || estadoInicial.avatarDesbloqueados.accesorio,
    },
  };
}
