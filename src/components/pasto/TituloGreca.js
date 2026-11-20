import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';
import { pathGreca } from '../../data/greca';

// Título de sección entre dos tramos de greca de espiral cuadrada.
export default function TituloGreca({ texto, color = colors.doradoNeon, style }) {
  const g = pathGreca(52, 12);
  const tramo = (
    <Svg width={52} height={12} opacity={0.75}>
      <Path d={g.d} fill="none" stroke={color} strokeWidth={g.trazo} strokeLinecap="square" />
    </Svg>
  );
  return (
    <View style={[s.fila, style]} accessibilityRole="header">
      {tramo}
      <Text style={[s.txt, { color }]}>{texto}</Text>
      <View style={{ transform: [{ scaleX: -1 }] }}>{tramo}</View>
    </View>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20, marginBottom: 12 },
  txt:  { fontSize: 12, fontFamily: fonts.extra, letterSpacing: 3 },
});
