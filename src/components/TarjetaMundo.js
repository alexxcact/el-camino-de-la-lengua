import React, { useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

/**
 * Tarjeta grande de mundo para el mapa.
 * Props:
 *  mundo     objeto del mundo (titulo, subtitulo, emoji, color)
 *  estado    'completado' | 'activo' | 'bloqueado'
 *  pct       número 0-100 (progreso de palabras)
 *  palVistas número de palabras vistas
 *  total     total de palabras del mundo
 *  img       require() de la imagen (color o gris)
 *  onPress   función
 */
export default function TarjetaMundo({ mundo, estado, pct = 0, palVistas = 0, total = 0, img, onPress }) {
  const completado = estado === 'completado';
  const activo     = estado === 'activo';
  const bloqueado  = estado === 'bloqueado';

  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!activo) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [activo]);

  const glowScale = glow.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.9] });

  return (
    <TouchableOpacity
      activeOpacity={bloqueado ? 1 : 0.85}
      onPress={() => !bloqueado && onPress?.()}
      disabled={bloqueado}
      style={[
        s.card,
        completado && s.cardDone,
        activo && s.cardActivo,
        bloqueado && s.cardLock,
      ]}
    >
      {activo && (
        <Animated.View
          pointerEvents="none"
          style={[s.glowBorder, { opacity: glowOpacity, transform: [{ scale: glowScale }] }]}
        />
      )}

      {/* Icono / imagen */}
      <View style={[s.iconBox, bloqueado && s.iconBoxLock]}>
        {bloqueado ? (
          <Ionicons name="lock-closed" size={26} color={colors.turquesaSuave} style={s.lockEmoji} />
        ) : (
          <Image source={img} style={s.iconImg} />
        )}
        <View style={[s.numBadge, { backgroundColor: bloqueado ? colors.nocheProfundo : mundo.color }]}>
          <Text style={s.numTxt}>{mundo.id}</Text>
        </View>
      </View>

      {/* Centro */}
      <View style={s.center}>
        <Text style={[s.titulo, bloqueado && s.tituloLock]} numberOfLines={1}>
          {mundo.emoji} {mundo.titulo}
        </Text>
        <Text style={[s.sub, bloqueado && s.subLock]} numberOfLines={1}>
          {bloqueado ? 'Bloqueado' : `"${mundo.subtitulo}"`}
        </Text>

        <View style={s.barTrack}>
          <LinearGradient
            colors={completado ? colors.gradVictoria : colors.gradXP}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[s.barFill, { width: `${completado ? 100 : pct}%` }]}
          />
        </View>
        <Text style={[s.count, bloqueado && s.subLock]}>
          {bloqueado ? '———' : `${palVistas} / ${total} palabras`}
        </Text>
      </View>

      {/* Estado a la derecha */}
      <View style={s.right}>
        {completado && <Text style={s.check}>✓</Text>}
        {activo && (
          <View style={s.playBtn}>
            <Text style={s.playTxt}>▶</Text>
          </View>
        )}
        {bloqueado && <Ionicons name="lock-closed" size={20} color={colors.turquesaSuave} style={s.lockSmall} />}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.nocheCard,
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(93,202,165,0.18)',
  },
  cardDone: { borderWidth: 2, borderColor: colors.doradoNeon },
  cardActivo: { borderWidth: 2, borderColor: colors.turquesa },
  cardLock: { backgroundColor: colors.nocheProfundo, opacity: 0.75 },

  glowBorder: {
    position: 'absolute',
    top: -3, left: -3, right: -3, bottom: -3,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.turquesaClaro,
  },

  iconBox: {
    width: 64, height: 64, borderRadius: 14, overflow: 'hidden',
    backgroundColor: colors.nocheProfundo,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  iconBoxLock: { opacity: 0.9 },
  iconImg: { width: '100%', height: '100%' },
  lockEmoji: { fontSize: 26, opacity: 0.6 },
  numBadge: {
    position: 'absolute', top: 3, left: 3,
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: colors.cielo,
  },
  numTxt: { color: colors.cielo, fontSize: 11, fontFamily: fonts.extra },

  center: { flex: 1 },
  titulo: { color: colors.cielo, fontSize: 16, fontFamily: fonts.bold },
  tituloLock: { color: colors.turquesaClaro },
  sub: { color: colors.turquesaSuave, fontSize: 11, fontStyle: 'italic', marginTop: 1, marginBottom: 7 },
  subLock: { color: colors.turquesaClaro, fontStyle: 'normal' },
  barTrack: {
    height: 7, borderRadius: 4, overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  barFill: { height: '100%', borderRadius: 4 },
  count: { color: colors.turquesaSuave, fontSize: 10, fontFamily: fonts.medium, marginTop: 4 },

  right: { width: 40, alignItems: 'center', justifyContent: 'center' },
  check: { color: colors.doradoNeon, fontSize: 26, fontFamily: fonts.extra },
  playBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.turquesa,
    alignItems: 'center', justifyContent: 'center',
  },
  playTxt: { color: colors.cielo, fontSize: 14, marginLeft: 2 },
  lockSmall: { fontSize: 20, opacity: 0.6 },
});
