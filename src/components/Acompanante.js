import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';
import Glass from './Glass';
import { personajes } from '../data/datos';

const PERSONAJES = {
  kinti:       { img: require('../../assets/images/personajes/kinti.jpg'), id: 'kinti' },
  uma:         { img: require('../../assets/images/personajes/uma.jpg'), id: 'uma' },
  taita_rimay: { img: require('../../assets/images/personajes/taita_rimay.jpg'), id: 'taita-rimay' },
  pishku:      { img: require('../../assets/images/personajes/pishku.jpg'), id: 'pishku' },
  chutun:      { img: require('../../assets/images/personajes/chutun.jpg'), id: 'chutun' },
};

export default function Acompanante({ personaje = 'pishku', mensaje = '', lado = 'izq', compacto = false }) {
  const retrato = PERSONAJES[personaje] || PERSONAJES.pishku;
  const datos = personajes.find(p => p.id === retrato.id);
  const p = { img: retrato.img, nom: datos.nombre, color: datos.color };
  const fadeIn = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, [personaje]);

  const translateY = bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -3] });

  if (compacto) {
    return (
      <View style={s.compactWrap}>
        <Image source={p.img} style={s.compactImg} />
        <Glass tipo="claro" intensidad={55} style={s.compactGlass}>
          <Text style={[s.compactNom, { color: p.color }]}>{p.nom}</Text>
          <Text style={s.compactMsg}>{mensaje}</Text>
        </Glass>
      </View>
    );
  }

  return (
    <Animated.View style={[
      s.wrap,
      lado === 'der' && { flexDirection: 'row-reverse' },
      { opacity: fadeIn, transform: [{ translateY }] },
    ]}>
      <View style={[s.avatarFrame, { borderColor: p.color, shadowColor: p.color }]}>
        <Image source={p.img} style={s.avatar} />
      </View>
      <Glass tipo="oscuro" intensidad={65} bordeBrillante style={s.bubble}>
        <Text style={[s.nombre, { color: colors.doradoBrillo }]}>{p.nom}</Text>
        <Text style={s.mensaje}>{mensaje}</Text>
      </Glass>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap:         { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10 },

  avatarFrame:  {
    width: 64, height: 64, borderRadius: 32,
    borderWidth: 3, overflow: 'hidden',
    backgroundColor: colors.blanco,
    shadowOpacity: 0.5, shadowRadius: 8, shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  avatar:       { width: '100%', height: '100%' },

  bubble:       { flex: 1, padding: 12, borderRadius: 14 },
  nombre:       { fontSize: 11, fontWeight: '900', letterSpacing: 1, marginBottom: 3 },
  mensaje:      { color: colors.crema, fontSize: 13, lineHeight: 18, fontStyle: 'italic' },

  compactWrap:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 6 },
  compactImg:   { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: colors.doradoBrillo },
  compactGlass: { flex: 1, padding: 8, borderRadius: 10 },
  compactNom:   { fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 2 },
  compactMsg:   { fontSize: 11, color: colors.crema, fontStyle: 'italic', lineHeight: 15 },
});
