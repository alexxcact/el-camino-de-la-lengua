import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path } from 'react-native-svg';
import { colors } from '../theme/colors';

const tinta = colors.nocheHeader;
const trazo = { stroke: tinta, strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' };

// Ilustraciones decorativas: la tarjeta que las contiene da la descripción
// accesible. Así un dibujo nunca anuncia la respuesta de una carta oculta.
// El primer mundo tiene dibujos propios; el resto conserva su emoji actual.
export default function PalabraIlustrada({ palabra, tamano = 64, style }) {
  const lado = Number.isFinite(tamano) && tamano > 0 ? tamano : 64;
  const dibujo = ilustrar(Number(palabra?.id));

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

function ilustrar(id) {
  switch (id) {
    case 1: // Sol: disco y rayos, sin otros símbolos.
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
    case 2: // Luna creciente.
      return (
        <G>
          <Circle cx={50} cy={50} r={37} fill={colors.nocheCard} />
          <Path d="M58 19 C31 15 17 44 29 66 C40 86 68 85 80 64 C56 71 39 46 58 19Z" fill={colors.doradoNeon} {...trazo} />
          <Circle cx={70} cy={32} r={2.5} fill={colors.crema} />
          <Circle cx={77} cy={46} r={1.6} fill={colors.crema} />
          <Circle cx={60} cy={44} r={1.5} fill={colors.crema} />
        </G>
      );
    case 3: // Agua: una gota.
      return (
        <G>
          <Ellipse cx={50} cy={83} rx={24} ry={5} fill={colors.arena} opacity={0.45} />
          <Path d="M50 15 C44 30 26 45 26 59 A24 24 0 0 0 74 59 C74 45 56 30 50 15Z" fill={colors.turquesaClaro} {...trazo} />
          <Path d="M28 64 C44 77 64 64 73 57 C74 74 61 83 49 82 C38 81 30 75 28 64Z" fill={colors.turquesa} />
          <Path d="M44 38 Q35 49 35 58" fill="none" stroke={colors.cielo} strokeWidth={4} strokeLinecap="round" />
        </G>
      );
    case 4: // Viento: trazos suaves y una hoja.
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
    case 5: // Piedra: volumen redondeado y facetas.
      return (
        <G>
          <Ellipse cx={50} cy={79} rx={33} ry={6} fill={colors.arena} opacity={0.55} />
          <Path d="M18 70 L26 42 L45 27 L70 33 L84 60 L74 77 L31 79Z" fill={colors.arena} {...trazo} />
          <Path d="M45 27 L52 48 L31 79 L18 70 L26 42Z" fill={colors.tierraClara} opacity={0.6} />
          <Path d="M52 48 L84 60 L74 77 L31 79Z" fill={colors.gris} opacity={0.45} />
          <Path d="M45 27 L52 48 L70 33 M52 48 L84 60 M52 48 L31 79" fill="none" stroke={colors.gris} strokeWidth={2} strokeLinejoin="round" />
        </G>
      );
    case 6: // Fuego: llama individual.
      return (
        <G>
          <Ellipse cx={50} cy={85} rx={22} ry={4} fill={colors.arena} opacity={0.5} />
          <Path d="M49 14 C53 30 70 33 65 48 C73 46 76 39 76 39 C91 72 65 87 48 83 C27 81 17 64 28 46 C27 60 39 54 37 42 C35 32 42 23 49 14Z" fill={colors.coral} {...trazo} />
          <Path d="M50 43 C55 54 65 63 61 73 C57 87 35 82 37 68 C38 58 47 54 50 43Z" fill={colors.doradoBrillo} />
          <Path d="M49 62 C55 68 57 79 50 80 C42 80 45 70 49 62Z" fill={colors.crema} />
        </G>
      );
    case 7: // Nube.
      return (
        <G>
          <Circle cx={50} cy={50} r={37} fill={colors.turquesaSuave} opacity={0.45} />
          <Path d="M27 69 C9 68 10 44 27 42 C28 23 54 18 64 36 C81 31 95 51 83 64 C80 68 75 69 69 69Z" fill={colors.blanco} {...trazo} />
          <Path d="M22 62 Q47 69 78 60" fill="none" stroke={colors.turquesaSuave} strokeWidth={5} strokeLinecap="round" />
        </G>
      );
    case 8: // Pájaro posado, con la paleta del mensajero.
      return (
        <G>
          <Path d="M19 81 H80" stroke={colors.tierra} strokeWidth={5} strokeLinecap="round" />
          <Path d="M40 69 L40 80 M54 69 L54 80" stroke={tinta} strokeWidth={2.5} strokeLinecap="round" />
          <Path d="M32 60 L17 67 L22 46 L34 49Z" fill={colors.turquesa} {...trazo} />
          <Path d="M30 51 C33 41 48 42 51 33 C52 19 71 18 75 30 C78 39 71 44 70 50 C70 73 34 81 30 51Z" fill={colors.azul} {...trazo} />
          <Path d="M73 30 L85 35 L73 40Z" fill={colors.doradoBrillo} {...trazo} />
          <Path d="M35 48 Q60 43 58 62 Q43 69 35 48Z" fill={colors.turquesaClaro} />
          <Path d="M38 53 Q43 61 51 59" fill="none" stroke={colors.turquesa} strokeWidth={2} strokeLinecap="round" />
          <Circle cx={65} cy={31} r={4.3} fill={colors.crema} />
          <Circle cx={66} cy={31} r={2} fill={tinta} />
        </G>
      );
    case 9: // Árbol de copa ancha.
      return (
        <G>
          <Ellipse cx={50} cy={83} rx={30} ry={5} fill={colors.arena} opacity={0.5} />
          <Path d="M43 81 L46 43 H55 L59 81Z" fill={colors.tierraClara} {...trazo} />
          <Path d="M48 64 L34 52 M54 58 L66 46" fill="none" stroke={colors.tierra} strokeWidth={4} strokeLinecap="round" />
          <Path d="M26 57 C9 54 16 29 31 32 C27 14 53 10 61 23 C75 17 87 31 81 43 C92 57 68 66 59 56 C48 64 36 64 26 57Z" fill={colors.verdeClaro} {...trazo} />
          <Path d="M26 49 Q42 57 51 45 Q68 55 79 45" fill="none" stroke={colors.verdeM} strokeWidth={5} strokeLinecap="round" />
        </G>
      );
    case 10: // Montaña: cumbre alta y angular.
      return (
        <G>
          <Path d="M11 79 L38 39 L53 60 L69 33 L90 79Z" fill={colors.turquesaSuave} />
          <Path d="M16 79 L51 17 L86 79Z" fill={colors.verdeM} {...trazo} />
          <Path d="M51 17 L86 79 H57 L44 41Z" fill={colors.verdeClaro} />
          <Path d="M51 17 L65 42 L54 37 L49 44 L39 38Z" fill={colors.crema} {...trazo} />
          <Path d="M15 80 H87" stroke={tinta} strokeWidth={2.4} strokeLinecap="round" />
        </G>
      );
    case 51: // Loma: perfil continuo y redondeado, distinto de la montaña.
      return (
        <G>
          <Circle cx={70} cy={27} r={9} fill={colors.doradoBrillo} />
          <Path d="M12 77 Q26 26 49 38 Q69 43 89 77Z" fill={colors.turquesa} {...trazo} />
          <Path d="M12 77 Q48 51 89 77Z" fill={colors.verdeClaro} {...trazo} />
          <Path d="M49 80 C38 70 66 65 52 59" fill="none" stroke={colors.arena} strokeWidth={5} strokeLinecap="round" />
        </G>
      );
    case 52: // Fuego sagrado: contexto de hogar, sin atribuir símbolos rituales.
      return (
        <G>
          <Ellipse cx={50} cy={81} rx={34} ry={7} fill={colors.arena} opacity={0.55} />
          <Path d="M34 72 L66 82 M35 82 L65 72" stroke={colors.tierra} strokeWidth={7} strokeLinecap="round" />
          <Path d="M51 19 C52 36 68 36 64 47 C76 45 74 61 67 68 C54 79 32 74 31 60 C29 48 39 45 37 34 C43 39 44 44 44 44 C48 35 42 28 51 19Z" fill={colors.coral} {...trazo} />
          <Path d="M51 43 C53 51 63 54 58 66 C54 77 39 67 43 59Z" fill={colors.doradoBrillo} />
          <Ellipse cx={25} cy={77} rx={9} ry={7} fill={colors.gris} {...trazo} />
          <Ellipse cx={75} cy={77} rx={9} ry={7} fill={colors.gris} {...trazo} />
          <Ellipse cx={48} cy={85} rx={12} ry={6} fill={colors.tierraClara} {...trazo} />
          <Path d="M41 17 Q37 12 42 8 M63 25 Q68 20 64 15" fill="none" stroke={colors.dorado} strokeWidth={2.5} strokeLinecap="round" />
        </G>
      );
    case 53: // Agua profunda: una laguna en sección, con varias capas.
      return (
        <G>
          <Path d="M13 36 Q23 27 31 36 Q40 44 49 36 Q58 27 67 36 Q77 45 87 36 C85 69 68 86 50 86 C29 86 16 68 13 36Z" fill={colors.turquesaClaro} {...trazo} />
          <Path d="M18 54 Q31 62 44 54 T81 54 C76 74 65 86 50 86 C35 86 25 73 18 54Z" fill={colors.turquesa} />
          <Path d="M28 72 Q42 65 53 72 T72 73 Q50 99 28 72Z" fill={colors.azul} />
          <Path d="M28 43 Q35 47 41 42 M58 43 Q65 39 73 44" fill="none" stroke={colors.cielo} strokeWidth={2.5} strokeLinecap="round" />
          <Circle cx={48} cy={57} r={2} fill={colors.cielo} />
          <Circle cx={54} cy={66} r={1.5} fill={colors.cielo} />
        </G>
      );
    case 54: // Viento grande: ráfagas y vegetación inclinada.
      return (
        <G>
          <G fill="none" stroke={colors.azul} strokeWidth={4} strokeLinecap="round">
            <Path d="M13 24 H63 Q79 24 75 16" />
            <Path d="M21 36 H79" />
            <Path d="M12 48 H66 Q87 48 86 35" />
          </G>
          <Path d="M38 85 Q37 63 62 54" fill="none" stroke={colors.tierra} strokeWidth={5} strokeLinecap="round" />
          <Path d="M47 64 Q46 43 65 49 Q75 42 83 52 Q90 65 74 68 Q62 81 47 64Z" fill={colors.verdeClaro} {...trazo} />
          <Path d="M20 84 Q24 71 31 70 M53 85 Q57 76 64 76" fill="none" stroke={colors.verdeM} strokeWidth={3} strokeLinecap="round" />
          <Path d="M16 86 H75" stroke={tinta} strokeWidth={2.4} strokeLinecap="round" />
        </G>
      );
    case 55: // Frailejón: tallo grueso, roseta de hojas largas y flores amarillas.
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
