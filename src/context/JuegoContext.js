import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logros } from '../data/datos';
import { setSonido } from '../utils/ajustes';

const JuegoContext = createContext(null);

const STORAGE_KEY = '@camino_lengua_estado';

const estadoInicial = {
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
};

const niveles = [
  { min: 0,  nombre: "Aprendiz de la Palabra" },
  { min: 10, nombre: "Conocedor Andino" },
  { min: 20, nombre: "Guardián del Pastoker" },
  { min: 30, nombre: "Sabedor del Territorio" },
  { min: 50, nombre: "Taita de la Lengua" },
];

// ── Helpers de fecha local (para la racha) ──
const fechaISO = (d) => {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
};
const fechaHoy  = () => fechaISO(new Date());
const fechaAyer = () => { const d = new Date(); d.setDate(d.getDate() - 1); return fechaISO(d); };

// Calcula racha/palabrasHoy según cuándo fue la última sesión
function aplicarSesion(base) {
  const hoy = fechaHoy();
  if (base.ultimaSesion === hoy) return base;            // misma sesión del día: sin cambios
  if (base.ultimaSesion === fechaAyer()) {
    return { ...base, racha: (base.racha || 0) + 1, palabrasHoy: 0, ultimaSesion: hoy };
  }
  // primera vez o se rompió la racha
  return { ...base, racha: 1, palabrasHoy: 0, ultimaSesion: hoy };
}

export function JuegoProvider({ children }) {
  const [estado, setEstado] = useState(estadoInicial);
  const [cargado, setCargado] = useState(false);
  const [toastLogro, setToastLogro] = useState(null);

  useEffect(() => { cargarEstado(); }, []);

  const cargarEstado = async () => {
    let base = estadoInicial;
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        base = {
          ...estadoInicial,
          ...parsed,
          palabrasVistas:    new Set(parsed.palabrasVistas    || []),
          mundosCompletados: new Set(parsed.mundosCompletados || []),
          misionesCompletadas: new Set(parsed.misionesCompletadas || []),
          logrosDesbloqueados: new Set(parsed.logrosDesbloqueados || []),
        };
      }
    } catch (e) { console.log('Error cargando estado:', e); }

    const conSesion = aplicarSesion(base);
    setSonido(conSesion.sonidoActivado !== false);
    setEstado(conSesion);
    guardarEstado(conSesion);
    setCargado(true);
  };

  const guardarEstado = useCallback(async (nuevoEstado) => {
    try {
      const serializable = {
        ...nuevoEstado,
        palabrasVistas:      [...nuevoEstado.palabrasVistas],
        mundosCompletados:   [...nuevoEstado.mundosCompletados],
        misionesCompletadas: [...nuevoEstado.misionesCompletadas],
        logrosDesbloqueados: [...nuevoEstado.logrosDesbloqueados],
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) { console.log('Error guardando estado:', e); }
  }, []);

  const actualizarEstado = useCallback((fn) => {
    setEstado(prev => {
      const nuevo = fn(prev);
      guardarEstado(nuevo);
      return nuevo;
    });
  }, [guardarEstado]);

  // Guarda el nombre del jugador: trim, valida 2-15, capitaliza la inicial.
  // Si queda fuera de rango usa "Caminante" (nunca bloquea el flujo).
  const guardarNombre = useCallback((nombre) => {
    let limpio = (nombre || '').trim();
    if (limpio.length > 15) limpio = limpio.slice(0, 15).trim();
    if (limpio.length < 2)  limpio = 'Caminante';
    const final = limpio.charAt(0).toUpperCase() + limpio.slice(1);
    actualizarEstado(prev => ({ ...prev, nombreJugador: final }));
  }, [actualizarEstado]);

  const cambiarSonido = useCallback((v) => {
    setSonido(v);
    actualizarEstado(prev => ({ ...prev, sonidoActivado: v }));
  }, [actualizarEstado]);

  const marcarFinalVisto = useCallback(() => {
    actualizarEstado(prev => prev.finalVisto ? prev : { ...prev, finalVisto: true });
  }, [actualizarEstado]);

  const ganarPuntos = useCallback((n) => {
    actualizarEstado(prev => {
      const puntos = prev.puntos + n;
      const nivel = niveles.filter(nv => puntos >= nv.min).length;
      return { ...prev, puntos, nivel };
    });
  }, [actualizarEstado]);

  const marcarPalabraVista = useCallback((id) => {
    actualizarEstado(prev => {
      if (prev.palabrasVistas.has(id)) return prev;
      const palabrasVistas = new Set(prev.palabrasVistas);
      palabrasVistas.add(id);
      const puntos = prev.puntos + 2;
      const nivel = niveles.filter(nv => puntos >= nv.min).length;
      const palabrasHoy = (prev.palabrasHoy || 0) + 1;
      return { ...prev, palabrasVistas, puntos, nivel, palabrasHoy };
    });
  }, [actualizarEstado]);

  const completarMundo = useCallback((id) => {
    actualizarEstado(prev => {
      if (prev.mundosCompletados.has(id)) return prev;
      const mundosCompletados = new Set(prev.mundosCompletados);
      mundosCompletados.add(id);
      return { ...prev, mundosCompletados };
    });
    ganarPuntos(20);
  }, [actualizarEstado, ganarPuntos]);

  const completarMision = useCallback((id) => {
    actualizarEstado(prev => {
      if (prev.misionesCompletadas.has(id)) return prev;
      const misionesCompletadas = new Set(prev.misionesCompletadas);
      misionesCompletadas.add(id);
      return { ...prev, misionesCompletadas };
    });
  }, [actualizarEstado]);

  const sumarQuiz = useCallback(() => {
    actualizarEstado(prev => ({ ...prev, quizJugados: prev.quizJugados + 1 }));
  }, [actualizarEstado]);

  const sumarParejas = useCallback(() => {
    actualizarEstado(prev => ({ ...prev, parejasJugadas: prev.parejasJugadas + 1 }));
  }, [actualizarEstado]);

  const verificarLogros = useCallback(() => {
    actualizarEstado(prev => {
      const nuevosLogros = logros.filter(l =>
        !prev.logrosDesbloqueados.has(l.id) && l.cond(prev)
      );
      if (nuevosLogros.length === 0) return prev;
      const logrosDesbloqueados = new Set(prev.logrosDesbloqueados);
      nuevosLogros.forEach(l => logrosDesbloqueados.add(l.id));
      if (nuevosLogros[0]) setToastLogro(nuevosLogros[0]);
      return { ...prev, logrosDesbloqueados };
    });
  }, [actualizarEstado]);

  const getNivel = useCallback(() => {
    return niveles.filter(nv => estado.puntos >= nv.min).slice(-1)[0]?.nombre || niveles[0].nombre;
  }, [estado.puntos]);

  return (
    <JuegoContext.Provider value={{
      estado, cargado, toastLogro, setToastLogro,
      ganarPuntos, marcarPalabraVista, completarMundo,
      completarMision, sumarQuiz, sumarParejas,
      verificarLogros, getNivel, guardarNombre, cambiarSonido, marcarFinalVisto,
    }}>
      {children}
    </JuegoContext.Provider>
  );
}

export const useJuego = () => useContext(JuegoContext);
