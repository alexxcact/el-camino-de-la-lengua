import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { G, Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { PETROGLIFOS } from '../data/petroglifos';
import { SIMBOLOS_FONDO } from '../data/simbolosFondo';
import { pathGreca } from '../data/greca';

const CREMA = '#F4E6C8';
const FIGURAS = Object.fromEntries([...PETROGLIFOS, ...SIMBOLOS_FONDO].map(f => [f.id, f]));

// Composiciones por pantalla. Cada figura: id, x/y (centro, en fracción del
// ancho/alto; fuera de 0..1 = recortada por el borde), t (tamaño en fracción
// del ancho), r (giro en grados) y o (opacidad). Fijas: no saltan al navegar.
// En pantallas con barra de pestañas, y ≤ ~0.85 para que la barra no las tape.
// El Sol de los Pastos no se usa como fondo (símbolo sagrado, Cartilla 4 p. 48).
export const COMPOSICIONES = {
  mapa: [
    { id: 'danzante', x: 0.08, y: 0.86, t: 0.62, r: -8, o: 0.07 },
    { id: 'monosRama', x: 0.74, y: 0.12, t: 0.7, r: 4, o: 0.08 },
    { id: 'espiralDoble', x: 0.98, y: 0.52, t: 0.42, r: 82, o: 0.06 },
    { id: 'venadoSalto', x: 0.1, y: 0.36, t: 0.3, r: 0, o: 0.06 },
  ],
  juegos: [
    { id: 'monosRama', x: 0.3, y: 0.06, t: 0.72, r: -3, o: 0.08 },
    { id: 'figurasPlato', x: 0.86, y: 0.8, t: 0.62, r: 6, o: 0.07 },
    { id: 'espiralS', x: -0.02, y: 0.55, t: 0.36, r: 10, o: 0.06 },
  ],
  diccionario: [
    { id: 'selloMono', x: 1.02, y: 0.4, t: 0.5, r: -12, o: 0.06 },
    { id: 'danzante', x: 0.0, y: 0.8, t: 0.56, r: 8, o: 0.06 },
    { id: 'mono', x: 0.92, y: 0.72, t: 0.28, r: 0, o: 0.06 },
  ],
  progreso: [
    { id: 'figurasPlato', x: 0.5, y: 0.03, t: 0.9, r: 0, o: 0.07 },
    { id: 'venado', x: 0.9, y: 0.7, t: 0.38, r: -6, o: 0.06 },
    { id: 'espiralDoble', x: 0.02, y: 0.5, t: 0.38, r: -80, o: 0.05 },
  ],
  mundo: [
    { id: 'monosRama', x: 0.7, y: 0.84, t: 0.66, r: -4, o: 0.07 },
    { id: 'selloFigura', x: -0.04, y: 0.6, t: 0.4, r: 12, o: 0.05 },
    { id: 'espiralS', x: 1.0, y: 0.38, t: 0.3, r: -10, o: 0.05 },
  ],
  juego: [
    { id: 'espiralDoble', x: 0.0, y: 0.3, t: 0.38, r: 90, o: 0.07 },
    { id: 'monosRama', x: 0.78, y: 0.83, t: 0.6, r: -3, o: 0.08 },
    { id: 'figurasPlato', x: 1.04, y: 0.5, t: 0.42, r: 8, o: 0.06 },
  ],
  inicio: [
    { id: 'monosRama', x: 0.5, y: 0.97, t: 0.9, r: 0, o: 0.07 },
    { id: 'danzante', x: -0.06, y: 0.42, t: 0.5, r: -10, o: 0.05 },
    { id: 'figurasPlato', x: 1.06, y: 0.6, t: 0.5, r: 8, o: 0.05 },
  ],
  creditos: [
    { id: 'danzante', x: 0.95, y: 0.16, t: 0.5, r: 6, o: 0.06 },
    { id: 'figurasPlato', x: 0.14, y: 0.84, t: 0.66, r: -4, o: 0.06 },
    { id: 'espiralS', x: -0.03, y: 0.5, t: 0.32, r: 0, o: 0.05 },
  ],
  escena: [
    { id: 'monosRama', x: 0.5, y: 0.985, t: 0.86, r: 0, o: 0.09 },
    { id: 'espiralDoble', x: 1.0, y: 0.3, t: 0.34, r: -86, o: 0.06 },
  ],
};

// Fondo de pantalla con simbología pasta: figuras muy tenues (enteras o
// recortadas), una greca arriba y abajo, y un desvanecido hacia el centro para
// que nunca compita con el contenido (desvanecer=false en escenas con
// ilustración propia). No intercepta toques ni lector de pantalla.
export default function FondoSimbolos({ variante = 'mapa', greca = true, desvanecer = true }) {
  const { width: W, height: H } = useWindowDimensions();
  const items = COMPOSICIONES[variante] || COMPOSICIONES.mapa;
  const bandaH = 18;
  const g = useMemo(() => pathGreca(W, bandaH), [W]);

  return (
    <Svg width={W} height={H} style={StyleSheet.absoluteFill} pointerEvents="none" accessible={false}>
      <Defs>
        <LinearGradient id="desvanecido" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#0B1F2A" stopOpacity="0" />
          <Stop offset="0.45" stopColor="#0B1F2A" stopOpacity="0.55" />
          <Stop offset="0.6" stopColor="#0B1F2A" stopOpacity="0.55" />
          <Stop offset="1" stopColor="#0B1F2A" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      {items.map((it, i) => {
        const f = FIGURAS[it.id];
        if (!f) return null;
        const lado = it.t * W;
        const k = lado / Math.max(f.ancho, f.alto);
        const cx = it.x * W;
        const cy = it.y * H;
        return (
          <G key={`${it.id}-${i}`} opacity={it.o}
            transform={`translate(${cx} ${cy}) rotate(${it.r}) scale(${k}) translate(${-f.ancho / 2} ${-f.alto / 2})`}>
            <Path d={f.d} fill={CREMA} fillRule="evenodd" />
          </G>
        );
      })}
      {desvanecer && <Rect x={0} y={0} width={W} height={H} fill="url(#desvanecido)" />}
      {greca && (
        <>
          <G opacity={0.09}><Path d={g.d} fill="none" stroke={CREMA} strokeWidth={g.trazo} strokeLinecap="square" /></G>
          <G opacity={0.09} transform={`translate(0 ${H - bandaH - 2})`}>
            <Path d={g.d} fill="none" stroke={CREMA} strokeWidth={g.trazo} strokeLinecap="square" />
          </G>
        </>
      )}
    </Svg>
  );
}
