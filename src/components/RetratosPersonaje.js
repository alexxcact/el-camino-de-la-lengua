import React from 'react';
import { View } from 'react-native';
import { figuraVectorDe } from './figuras/index';

// Busto del personaje dibujado con vectores (la misma figura de cuerpo entero
// recortada con su BUSTO_VIEWBOX), sin círculo ni borde: se integra con lo que
// tenga detrás. Mismo API de siempre (personaje, size, style); `animo` opcional.
export default function RetratoMini({ personaje, size = 24, style, animo = 'neutral' }) {
  const { Componente, BUSTO_VIEWBOX } = figuraVectorDe(personaje);
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Componente width={size} height={size} viewBox={BUSTO_VIEWBOX} animo={animo} />
    </View>
  );
}
