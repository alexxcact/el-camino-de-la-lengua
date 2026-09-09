import React from 'react';
import Svg, { G, Path, Rect, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';

// Una misma línea y proporción para reconocer las actividades del camino.
export default function IconoActividad({ tipo, tamano = 28, color = colors.turquesaSuave }) {
  const dibujos = {
    leccion: <><Path d="M12 6C9 3.5 5 3.5 2 5v15c3-1.5 7-1.5 10 1 3-2.5 7-2.5 10-1V5c-3-1.5-7-1.5-10 1Z" /><Path d="M12 6v15M5 8h3M16 8h3M5 12h3M16 12h3" /></>,
    quiz: <><Path d="M5 3h14v14h-8l-5 4v-4H5Z" /><Path d="M9.5 7a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4" /><Circle cx="12" cy="14" r=".7" fill={color} stroke="none" /></>,
    parejas: <><Rect x="2" y="4" width="7" height="15" rx="2" /><Rect x="15" y="4" width="7" height="15" rx="2" /><Path d="M9 11.5h6M4.5 11.5h2M17.5 11.5h2" /></>,
    dictado: <><Path d="m5 15-1 5 5-1L20 8l-4-4ZM13.5 6.5l4 4M4 22h17" /></>,
    escucha: <><Path d="M3 13v-2a9 9 0 0 1 18 0v2M3 12h3v8H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 1-2ZM21 12h-3v8h2a2 2 0 0 0 2-2v-4a2 2 0 0 0-1-2Z" /><Path d="M10 10v5M14 8v9" /></>,
    memoria: <><Rect x="2" y="3" width="8" height="17" rx="2" /><Rect x="14" y="3" width="8" height="17" rx="2" /><Path d="m6 8 2 3.5L6 15l-2-3.5ZM18 8l2 3.5-2 3.5-2-3.5Z" /></>,
  };
  return <Svg width={tamano} height={tamano} viewBox="0 0 24 24" accessible={false}><G fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{dibujos[tipo] || dibujos.leccion}</G></Svg>;
}
