import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { useJuego } from '../context/JuegoContext';

const frasesCon = (n) => [
  `¡Pío, ${n}! ¡Una palabra más viva!`,
  `¡Pas, ${n}! ¡Lo lograste!`,
  `¡${n}, el territorio brilla otra vez!`,
  `¡Sigamos el camino, ${n}!`,
];

/**
 * Pishku, la mascota que celebra los logros.
 * Props:
 *  celebrando bool   — dispara el salto y muestra el globo (default true)
 *  mensaje    string — texto fijo del globo (si no, frase aleatoria)
 *  tamano     número — diámetro del círculo (default 96)
 */
export default function PishkuMascota({ celebrando = true, mensaje, tamano = 96 }) {
  const { estado } = useJuego();
  const sway = useRef(new Animated.Value(0)).current;
  const salto = useRef(new Animated.Value(0)).current;
  const [frase] = useState(() => {
    if (mensaje) return mensaje;
    const fr = frasesCon(estado.nombreJugador || 'Caminante');
    return fr[Math.floor(Math.random() * fr.length)];
  });

  // Balanceo idle continuo
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(sway, { toValue: -1, duration: 1500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Salto al celebrar
  useEffect(() => {
    if (!celebrando) return;
    const anim = Animated.sequence([
      Animated.timing(salto, { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.spring(salto, { toValue: 0, friction: 4, useNativeDriver: true }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [celebrando]);

  const rotate = sway.interpolate({ inputRange: [-1, 1], outputRange: ['-3deg', '3deg'] });
  const translateY = salto.interpolate({ inputRange: [0, 1], outputRange: [0, -22] });

  return (
    <View style={s.wrap}>
      {celebrando && (
        <View style={s.bubble}>
          <Text style={s.bubbleTxt}>{frase}</Text>
          <View style={s.bubbleTail} />
        </View>
      )}
      <Animated.View style={{ transform: [{ translateY }, { rotate }] }}>
        <Image
          source={require('../../assets/images/personajes/pishku.jpg')}
          style={[s.img, { width: tamano, height: tamano, borderRadius: tamano / 2 }]}
        />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center' },
  img: { borderWidth: 3, borderColor: colors.doradoNeon },
  bubble: {
    backgroundColor: colors.cielo,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 10,
    maxWidth: 220,
    shadowColor: colors.doradoNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  bubbleTxt: { color: colors.noche, fontSize: 14, fontFamily: fonts.bold, textAlign: 'center' },
  bubbleTail: {
    position: 'absolute',
    bottom: -7, alignSelf: 'center',
    width: 0, height: 0,
    borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: colors.cielo,
  },
});
