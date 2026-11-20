import React, { useState } from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';
import { PALETA_SOL } from '../theme/solPasto';

// Franja tejida: rombos escalonados como en una faja o ruana pasto, con el
// color que se le pase (p. ej. el del mundo). Se repite según el ancho medido.
export default function FranjaTejida({ color = PALETA_SOL.terracota, alto = 16, fondo = 'rgba(8,26,34,0.85)' }) {
  const [ancho, setAncho] = useState(0);
  const paso = alto * 1.75;
  const n = ancho ? Math.ceil(ancho / paso) + 1 : 0;
  const m = alto / 2;
  const d = [];
  const relleno = [];
  for (let i = 0; i < n; i++) {
    const cx = i * paso + paso / 2;
    d.push(`M${cx - m} ${m} L${cx} 1 L${cx + m} ${m} L${cx} ${alto - 1} Z`);
    relleno.push(`M${cx - m / 2.4} ${m} L${cx} ${m - m / 2.4} L${cx + m / 2.4} ${m} L${cx} ${m + m / 2.4} Z`);
    // Dientes entre rombos (arriba y abajo).
    const x = i * paso;
    relleno.push(`M${x - 3} 0 L${x} 4 L${x + 3} 0 Z`, `M${x - 3} ${alto} L${x} ${alto - 4} L${x + 3} ${alto} Z`);
  }
  return (
    <View style={{ height: alto, alignSelf: 'stretch' }} onLayout={e => setAncho(e.nativeEvent.layout.width)} pointerEvents="none">
      {n > 0 && (
        <Svg width={ancho} height={alto}>
          <Rect x={0} y={0} width={ancho} height={alto} fill={fondo} />
          <Path d={d.join(' ')} stroke={colors.doradoNeon} strokeWidth={1.4} fill="none" />
          <Path d={relleno.join(' ')} fill={color} />
        </Svg>
      )}
    </View>
  );
}

