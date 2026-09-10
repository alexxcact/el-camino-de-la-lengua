import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path } from 'react-native-svg';
import { colors } from '../theme/colors';

const tinta = colors.nocheHeader;
const trazo = { stroke: tinta, strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' };

// Ilustraciones decorativas: la tarjeta que las contiene da la descripción
// accesible. Así un dibujo nunca anuncia la respuesta de una carta oculta.
// La palabra determina el dibujo: los IDs se conservan al actualizar el
// vocabulario, pero pueden representar otro significado. Las entradas sin
// ilustración propia conservan el emoji definido en el diccionario.
export default function PalabraIlustrada({ palabra, tamano = 64, style }) {
  const lado = Number.isFinite(tamano) && tamano > 0 ? tamano : 64;
  const dibujo = ilustrar(palabra?.p);

  return (
    <View
      style={[styles.marco, { width: lado, height: lado }, style]}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
    >
      {dibujo ? (
        <Svg width={lado} height={lado} viewBox="0 0 100 100" accessible={false}>
          <Circle cx={50} cy={50} r={46} fill={colors.crema} />
          {dibujo}
        </Svg>
      ) : (
        <Text accessible={false} style={{ fontSize: lado * 0.7, lineHeight: lado, textAlign: 'center' }}>
          {palabra?.emoji || '◇'}
        </Text>
      )}
    </View>
  );
}

function ilustrar(palabra) {
  switch (palabra) {
    case 'Pa': // Sol: disco y rayos, sin otros símbolos.
      return (
        <G>
          <G stroke={colors.dorado} strokeWidth={4} strokeLinecap="round">
            <Line x1={50} y1={14} x2={50} y2={22} />
            <Line x1={50} y1={78} x2={50} y2={86} />
            <Line x1={14} y1={50} x2={22} y2={50} />
            <Line x1={78} y1={50} x2={86} y2={50} />
            <Line x1={24} y1={24} x2={30} y2={30} />
            <Line x1={70} y1={70} x2={76} y2={76} />
            <Line x1={24} y1={76} x2={30} y2={70} />
            <Line x1={70} y1={30} x2={76} y2={24} />
          </G>
          <Circle cx={50} cy={50} r={22} fill={colors.doradoBrillo} {...trazo} />
          <Path d="M38 42 Q41 34 49 34" fill="none" stroke={colors.crema} strokeWidth={4} strokeLinecap="round" />
        </G>
      );
    case 'Pe': // Luna creciente.
      return (
        <G>
          <Circle cx={50} cy={50} r={37} fill={colors.nocheCard} />
          <Path d="M58 19 C31 15 17 44 29 66 C40 86 68 85 80 64 C56 71 39 46 58 19Z" fill={colors.doradoNeon} {...trazo} />
          <Circle cx={70} cy={32} r={2.5} fill={colors.crema} />
          <Circle cx={77} cy={46} r={1.6} fill={colors.crema} />
          <Circle cx={60} cy={44} r={1.5} fill={colors.crema} />
        </G>
      );
    case 'Pi': // Agua: una gota.
      return (
        <G>
          <Ellipse cx={50} cy={83} rx={24} ry={5} fill={colors.arena} opacity={0.45} />
          <Path d="M50 15 C44 30 26 45 26 59 A24 24 0 0 0 74 59 C74 45 56 30 50 15Z" fill={colors.turquesaClaro} {...trazo} />
          <Path d="M28 64 C44 77 64 64 73 57 C74 74 61 83 49 82 C38 81 30 75 28 64Z" fill={colors.turquesa} />
          <Path d="M44 38 Q35 49 35 58" fill="none" stroke={colors.cielo} strokeWidth={4} strokeLinecap="round" />
        </G>
      );
    case 'Ina': // Viento: trazos suaves y una hoja.
      return (
        <G>
          <G fill="none" stroke={colors.azul} strokeWidth={4} strokeLinecap="round">
            <Path d="M17 39 H62 C78 39 76 23 66 25" />
            <Path d="M24 51 H77" />
            <Path d="M16 63 H52 C65 63 68 78 57 79" />
          </G>
          <Path d="M69 64 Q88 60 83 77 Q70 80 69 64Z" fill={colors.verdeClaro} {...trazo} />
          <Path d="M72 75 L80 67" fill="none" stroke={colors.verde} strokeWidth={2} strokeLinecap="round" />
        </G>
      );
    case 'In': // Fuego: llama individual.
      return (
        <G>
          <Ellipse cx={50} cy={85} rx={22} ry={4} fill={colors.arena} opacity={0.5} />
          <Path d="M49 14 C53 30 70 33 65 48 C73 46 76 39 76 39 C91 72 65 87 48 83 C27 81 17 64 28 46 C27 60 39 54 37 42 C35 32 42 23 49 14Z" fill={colors.coral} {...trazo} />
          <Path d="M50 43 C55 54 65 63 61 73 C57 87 35 82 37 68 C38 58 47 54 50 43Z" fill={colors.doradoBrillo} />
          <Path d="M49 62 C55 68 57 79 50 80 C42 80 45 70 49 62Z" fill={colors.crema} />
        </G>
      );
    case 'Chill': // Cielo representado por una nube.
      return (
        <G>
          <Circle cx={50} cy={50} r={37} fill={colors.turquesaSuave} opacity={0.45} />
          <Path d="M27 69 C9 68 10 44 27 42 C28 23 54 18 64 36 C81 31 95 51 83 64 C80 68 75 69 69 69Z" fill={colors.blanco} {...trazo} />
          <Path d="M22 62 Q47 69 78 60" fill="none" stroke={colors.turquesaSuave} strokeWidth={5} strokeLinecap="round" />
        </G>
      );
    case 'Tar': // Árbol de copa ancha.
      return (
        <G>
          <Ellipse cx={50} cy={83} rx={30} ry={5} fill={colors.arena} opacity={0.5} />
          <Path d="M43 81 L46 43 H55 L59 81Z" fill={colors.tierraClara} {...trazo} />
          <Path d="M48 64 L34 52 M54 58 L66 46" fill="none" stroke={colors.tierra} strokeWidth={4} strokeLinecap="round" />
          <Path d="M26 57 C9 54 16 29 31 32 C27 14 53 10 61 23 C75 17 87 31 81 43 C92 57 68 66 59 56 C48 64 36 64 26 57Z" fill={colors.verdeClaro} {...trazo} />
          <Path d="M26 49 Q42 57 51 45 Q68 55 79 45" fill="none" stroke={colors.verdeM} strokeWidth={5} strokeLinecap="round" />
        </G>
      );
    case 'Pud': // Cerro: cumbre alta y angular.
      return (
        <G>
          <Path d="M11 79 L38 39 L53 60 L69 33 L90 79Z" fill={colors.turquesaSuave} />
          <Path d="M16 79 L51 17 L86 79Z" fill={colors.verdeM} {...trazo} />
          <Path d="M51 17 L86 79 H57 L44 41Z" fill={colors.verdeClaro} />
          <Path d="M51 17 L65 42 L54 37 L49 44 L39 38Z" fill={colors.crema} {...trazo} />
          <Path d="M15 80 H87" stroke={tinta} strokeWidth={2.4} strokeLinecap="round" />
        </G>
      );
    case 'Zon': // Frailejón: tallo grueso, roseta de hojas largas y flores amarillas.
      return (
        <G>
          <Ellipse cx={50} cy={88} rx={24} ry={4} fill={colors.arena} opacity={0.5} />
          <Path d="M43 86 L45 51 H55 L58 86Z" fill={colors.tierraClara} {...trazo} />
          <Path d="M44 66 L55 70 M44 74 L56 78" stroke={colors.tierra} strokeWidth={2.5} strokeLinecap="round" />
          <Path d="M47 50 Q34 30 32 20 M56 49 Q68 29 69 18" fill="none" stroke={colors.verdeM} strokeWidth={2.5} strokeLinecap="round" />
          <G fill={colors.turquesaSuave} {...trazo}>
            <Path d="M50 55 Q32 40 19 43 Q22 59 50 55Z" />
            <Path d="M50 55 Q65 37 82 42 Q76 60 50 55Z" />
            <Path d="M50 55 Q24 34 33 23 Q48 29 50 55Z" />
            <Path d="M50 55 Q57 29 72 24 Q75 41 50 55Z" />
            <Path d="M50 55 Q39 26 50 15 Q61 29 50 55Z" />
            <Path d="M50 55 Q31 55 27 69 Q42 71 50 55Z" />
            <Path d="M50 55 Q68 53 75 68 Q57 73 50 55Z" />
          </G>
          <Path d="M50 54 V28 M47 54 L31 47 M54 54 L70 47" fill="none" stroke={colors.turquesa} strokeWidth={1.8} strokeLinecap="round" />
          <Circle cx={30} cy={18} r={6} fill={colors.doradoBrillo} stroke={colors.dorado} strokeWidth={1.8} />
          <Circle cx={69} cy={16} r={6} fill={colors.doradoBrillo} stroke={colors.dorado} strokeWidth={1.8} />
          <Circle cx={30} cy={18} r={2} fill={colors.tierra} />
          <Circle cx={69} cy={16} r={2} fill={colors.tierra} />
        </G>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  marco: { alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
});
