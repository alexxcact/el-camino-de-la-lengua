import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logros } from '../data/datos';

const JuegoContext = createContext(null);

const STORAGE_KEY = '@camino_lengua_estado';

const estadoInicial = {
  puntos: 0,
  nivel: 1,
  palabrasVistas: new Set(),
  mundosCompletados: new Set(),
  misionesCompletadas: new Set(),
  logrosDesbloqueados: new Set(),
  quizJugados: 0,
  parejasJugadas: 0,
  dictadosCorrectos: 0,
};

const niveles = [
  { min: 0,  nombre: "Aprendiz de la Palabra" },
  { min: 10, nombre: "Conocedor Andino" },
  { min: 20, nombre: "Guardián del Pastoker" },
  { min: 30, nombre: "Sabedor del Territorio" },
  { min: 50, nombre: "Taita de la Lengua" },
];

export function JuegoProvider({ children }) {
  const [estado, setEstado] = useState(estadoInicial);
  const [cargado, setCargado] = useState(false);
  const [toastLogro, setToastLogro] = useState(null);

  useEffect(() => { cargarEstado(); }, []);

  const cargarEstado = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setEstado({
          ...estadoInicial,
          ...parsed,
          palabrasVistas:    new Set(parsed.palabrasVistas    || []),
          mundosCompletados: new Set(parsed.mundosCompletados || []),
          misionesCompletadas: new Set(parsed.misionesCompletadas || []),
          logrosDesbloqueados: new Set(parsed.logrosDesbloqueados || []),
        });
      }
    } catch (e) { console.log('Error cargando estado:', e); }
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
      return { ...prev, palabrasVistas, puntos, nivel };
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
      verificarLogros, getNivel,
    }}>
      {children}
    </JuegoContext.Provider>
  );
}

export const useJuego = () => useContext(JuegoContext);
