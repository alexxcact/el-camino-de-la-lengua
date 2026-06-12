import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Path, Rect, G, Line } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

// Info cultural de cada medalla (también la usa el modal y la vitrina)
export const MEDALLAS_INFO = {
  1: { nombre: 'Espiral del Viento', bg: colors.verde,     significado: 'El churo cósmico representa el viento que lleva la palabra por todo el territorio.' },
  2: { nombre: 'Rombo de la Chagra', bg: colors.verdeVivo, significado: 'El rombo del chumbe teje la siembra y la palabra en un mismo hilo.' },
  3: { nombre: 'Sol de los Pastos',  bg: colors.tierra,    significado: 'El sol de ocho puntas guía los ciclos del territorio y de la lengua.' },
  4: { nombre: 'Llama de la Tulpa',  bg: colors.rojo,      significado: 'Las tres piedras del fogón guardan la palabra que se cuenta al calor.' },
  5: { nombre: 'Espejo de la Laguna', bg: colors.azul,     significado: 'La laguna refleja el cielo: la palabra que vuelve a quien la nombra.' },
};

// Espiral de Arquímedes (churo) como path
function espiralPath(cx, cy, vueltas, rMax, steps = 64) {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const ang = t * vueltas * 2 * Math.PI;
    const r = t * rMax;
    const x = cx + r * Math.cos(ang);
    const y = cy + r * Math.sin(ang);
    d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
  }
  return d;
}

function Simbolo({ mundoId, color }) {
  const sw = 3.5;
  switch (mundoId) {
    case 1: // Espiral del Viento
      return <Path d={espiralPath(50, 50, 2.5, 32)} stroke={color} strokeWidth={3.2} fill="none" strokeLinecap="round" />;
    case 2: // Rombo de la Chagra
      return (
        <G>
          <Path d="M50 20 L80 50 L50 80 L20 50 Z" stroke={color} strokeWidth={sw} fill="none" />
          <Path d="M50 34 L66 50 L50 66 L34 50 Z" stroke={color} strokeWidth={3} fill="none" />
          <Circle cx={50} cy={50} r={4} fill={color} />
        </G>
      );
    case 3: // Sol de los Pastos (dos cuadrados rotados)
      return (
        <G>
          <Rect x={27} y={27} width={46} height={46} stroke={color} strokeWidth={sw} fill="none" />
          <G rotation={45} origin="50, 50">
            <Rect x={27} y={27} width={46} height={46} stroke={color} strokeWidth={sw} fill="none" />
          </G>
          <Circle cx={50} cy={50} r={9} fill={color} />
        </G>
      );
    case 4: // Llama de la Tulpa
      return (
        <G>
          <Path d="M50 24 C40 40 46 56 50 56 C54 56 60 40 50 24 Z" fill={color} />
          <Circle cx={33} cy={74} r={7} fill={color} />
          <Circle cx={67} cy={74} r={7} fill={color} />
          <Circle cx={50} cy={80} r={7} fill={color} />
        </G>
      );
    case 5: // Espejo de la Laguna
      return (
        <G>
          <Line x1={22} y1={50} x2={78} y2={50} stroke={color} strokeWidth={3} strokeLinecap="round" />
          <Path d="M38 50 A12 12 0 0 1 62 50 Z" fill={color} />
          <Path d="M38 50 A12 12 0 0 0 62 50 Z" fill={color} opacity={0.5} />
        </G>
      );
    default:
      return null;
  }
}

/**
 * Medalla Pasto coleccionable.
 * Props: mundoId (1-5), ganada (bool), tamano (default 72), animarEntrada (bool)
 */
export default function MedallaPasto({ mundoId, ganada = false, tamano = 72, animarEntrada = false }) {
  const meta = MEDALLAS_INFO[mundoId];
  const anim = useRef(new Animated.Value(animarEntrada ? 0 : 1)).current;

  useEffect(() => {
    if (!animarEntrada) return;
    anim.setValue(0);
    const a = Animated.spring(anim, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true });
    a.start();
    return () => a.stop();
  }, []);

  if (!meta) return null;

  const bg     = ganada ? meta.bg : colors.nocheProfundo;
  const aro    = ganada ? colors.doradoNeon : 'rgba(93,202,165,0.3)';
  const simbolo = ganada ? colors.doradoNeon : '#0A3D34';

  const scale  = anim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['-180deg', '0deg'] });

  return (
    <Animated.View style={[
      { width: tamano, height: tamano, opacity: ganada ? 1 : 0.45 },
      { transform: [{ scale }, { rotate }] },
    ]}>
      <Svg width={tamano} height={tamano} viewBox="0 0 100 100">
        <Circle cx={50} cy={50} r={47} fill={bg} stroke={aro} strokeWidth={3} />
        <Simbolo mundoId={mundoId} color={simbolo} />
      </Svg>

      {/* Insignia de esquina */}
      <View style={[s.corner, { backgroundColor: ganada ? colors.doradoNeon : colors.nocheProfundo, borderColor: ganada ? colors.noche : 'rgba(93,202,165,0.3)' }]}>
        <Text style={[s.cornerTxt, { color: ganada ? colors.noche : colors.turquesaSuave }]}>{ganada ? '✦' : '?'}</Text>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  corner: {
    position: 'absolute', top: -2, right: -2,
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5,
  },
  cornerTxt: { fontSize: 11, fontFamily: fonts.extra },
});
