import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { petroglifoDe } from '../data/petroglifos';
import { SIMBOLOS_FONDO } from '../data/simbolosFondo';

// Dibuja un petroglifo (figura vectorizada de las láminas) dentro de un cuadro
// de `tamano`, conservando su proporción. Con `enColor`, las figuras que traen
// capas (Perdiz, Machín de la cartilla) se pintan con sus colores originales.
export default function Petroglifo({ id, tamano = 64, color = '#F4E6C8', opacity = 1, enColor = false }) {
  // También dibuja las figuras del fondo (danzante, monos en la rama, figuras del plato).
  const p = petroglifoDe(id) || SIMBOLOS_FONDO.find(f => f.id === id);
  if (!p) return null;
  const k = tamano / Math.max(p.ancho, p.alto);
  return (
    <Svg width={p.ancho * k} height={p.alto * k} viewBox={`0 0 ${p.ancho} ${p.alto}`} opacity={opacity}>
      {enColor && p.capas
        ? p.capas.map((c, i) => <Path key={i} d={c.d} fill={c.color} fillRule="evenodd" />)
        : <Path d={p.d} fill={color} fillRule="evenodd" />}
    </Svg>
  );
}
