import React from 'react';
import Svg, { G, Path, Circle, Rect, Ellipse } from 'react-native-svg';
import { colors } from '../../theme/colors';

// Íconos de línea dibujados para la app (reemplazan a los emojis): misma
// retícula de 24 y el mismo trazo que IconoActividad. Los motivos (rombos,
// chaquiras, trenzas, ruana) vienen del tejido y la orfebrería pasta.
const DIBUJOS = {
  // Avatar
  piel: (c) => <><Circle cx="12" cy="11" r="7.5" /><Path d="M9 13.5q3 2.6 6 0" /><Circle cx="9.4" cy="10" r=".7" fill={c} stroke="none" /><Circle cx="14.6" cy="10" r=".7" fill={c} stroke="none" /><Path d="M8 21q4-2.5 8 0" /></>,
  cabello: (c) => <><Path d="M5.5 13a6.5 6.5 0 0 1 13 0" /><Path d="M5.5 13q2-4 6.5-4.5Q16.5 9 18.5 13" /><Path d="M17.5 13.5c1.6 1.2-1.6 2.4 0 3.6s-1.6 2.4 0 3.6" /><Path d="M6.5 13.5c-1.6 1.2 1.6 2.4 0 3.6s1.6 2.4 0 3.6" /></>,
  ropa: () => <><Path d="M3 20 12 7l9 13Z" /><Path d="m12 7-2.2 5h4.4Z" /><Path d="m8 17 1.5-1.5L11 17l-1.5 1.5ZM13 17l1.5-1.5L16 17l-1.5 1.5Z" /></>,
  sombrero: () => <><Ellipse cx="12" cy="16" rx="9.5" ry="2.5" /><Path d="M7 15.5 8 7.5h8l1 8" /><Path d="M7.6 12.5h8.8" /></>,
  adorno: (c) => <>{[[5, 6], [6.2, 10.4], [8.6, 14], [12, 15.4], [15.4, 14], [17.8, 10.4], [19, 6]].map(([x, y], i) => <Circle key={i} cx={x} cy={y} r="1.5" fill={i % 2 ? 'none' : c} />)}<Path d="m12 17.5 2 2.5-2 2.5-2-2.5Z" /></>,
  accesorio: () => <><Path d="M6 10h12l-1 11H7Z" /><Path d="M9 10V7.5a3 3 0 0 1 6 0V10" /><Path d="m9.5 15.5 1.25-1.5L12 15.5l-1.25 1.5ZM12 15.5l1.25-1.5 1.25 1.5-1.25 1.5Z" /></>,
  // Práctica: "sorpréndeme" (rombos del tejido que giran)
  sorpresa: (c) => <><Path d="M12 2.5 21.5 12 12 21.5 2.5 12Z" /><Path d="M12 7.5 16.5 12 12 16.5 7.5 12Z" /><Circle cx="12" cy="12" r="1.2" fill={c} stroke="none" /></>,
  mapa: () => <><Path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20Z" /><Path d="M9 4v13.5M15 6.5V20" /></>,
};

export default function IconoPasto({ tipo, tamano = 24, color = colors.turquesaSuave }) {
  const dibujo = DIBUJOS[tipo];
  if (!dibujo) return null;
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" accessible={false}>
      <G fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{dibujo(color)}</G>
    </Svg>
  );
}
