import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// Anillos concéntricos como los del plato del danzante (cerámica pasta),
// alrededor de un contenido circular (p. ej. el avatar).
export default function AnillosPlato({ tamano = 150, color = '#FAC775', children }) {
  const c = tamano / 2;
  const radios = [c - 1.5, c - 6, c - 10, c - 13.5];
  return (
    <View style={{ width: tamano, height: tamano, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={tamano} height={tamano} style={{ position: 'absolute' }}>
        {radios.map((r, i) => (
          <Circle key={i} cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={i === 0 ? 2.4 : 1.4} opacity={i === 0 ? 0.9 : 0.55} />
        ))}
      </Svg>
      {children}
    </View>
  );
}
