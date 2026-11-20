import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { G, Path, Ellipse } from 'react-native-svg';
import { colors } from '../theme/colors';
import { petroglifoDelLugar } from '../data/petroglifos';

const PIEDRA = '#1E4148';
const PIEDRA_BORDE = '#2C5A60';
const CREMA = '#F4E6C8';

// Piedra (laja) donde se talla el petroglifo, en un lienzo de 120×120.
const LAJA = 'M14 92 C8 70 12 38 28 22 C44 8 78 6 96 18 C112 30 114 62 108 86 C104 100 30 104 14 92 Z';

// Junto a cada mundo hay una piedra con su petroglifo, apenas insinuado hasta
// que lo encuentras escondido en el mundo; entonces se ve tallado (crema) y,
// con el mundo completado, brilla en dorado. La capa es decorativa: no intercepta gestos ni lector de pantalla.
export default function PaisajeSendero({ ancho, alto, nodos, encontrados = [] }) {
  const tamano = Math.min(110, ancho * 0.24);
  return (
    <Svg width={ancho} height={alto} style={StyleSheet.absoluteFill} pointerEvents="none" accessible={false}>
      {nodos.map(({ mundo, cx, cy, estado }) => {
        const centroX = cx < ancho * 0.5 ? ancho * 0.79 : ancho * 0.2;
        const p = petroglifoDelLugar(`mundo${mundo.id}`);
        const visto = !!p && encontrados.includes(p.id);
        const completado = estado === 'completado';
        const k = p ? 76 / Math.max(p.ancho, p.alto) : 1;
        return (
          <G key={mundo.id} transform={`translate(${centroX - tamano / 2}, ${cy - tamano / 2}) scale(${tamano / 120})`}
            opacity={estado === 'bloqueado' ? 0.45 : 1}>
            <Ellipse cx="60" cy="104" rx="50" ry="7" fill="#0A1B22" opacity={0.6} />
            <Path d={LAJA} fill={PIEDRA} opacity={0.75} stroke={PIEDRA_BORDE} strokeWidth="2" />
            {p && (
              // Sin descubrir: apenas insinuado, como tallado gastado por el tiempo.
              <G transform={`translate(${60 - (p.ancho * k) / 2}, ${56 - (p.alto * k) / 2}) scale(${k})`}>
                <Path d={p.d} fillRule="evenodd"
                  fill={visto && completado ? colors.doradoNeon : CREMA}
                  opacity={!visto ? 0.1 : completado ? 0.9 : 0.55} />
              </G>
            )}
          </G>
        );
      })}
    </Svg>
  );
}
