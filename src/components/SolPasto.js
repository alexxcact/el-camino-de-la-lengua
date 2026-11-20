import React, { useMemo } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { capasSol } from '../theme/solPasto';

// Sol de los Pastos (emblema de la app) dibujado en vivo. La misma geometría
// genera el ícono del APK (scripts/gen-iconos.mjs).
export default function SolPasto({ tamano = 200, conBorde = true }) {
  const capas = useMemo(() => capasSol({ conBorde }), [conBorde]);
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 100 100">
      {capas.map((c, i) => (c.circulo
        ? <Circle key={i} cx={c.circulo.cx} cy={c.circulo.cy} r={c.circulo.r} fill={c.fill} stroke={c.stroke} strokeWidth={c.sw} opacity={c.opacity} />
        : <Path key={i} d={c.d} fill={c.fill} stroke={c.stroke} strokeWidth={c.sw} opacity={c.opacity} />))}
    </Svg>
  );
}
