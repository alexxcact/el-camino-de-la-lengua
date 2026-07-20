import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { sonar } from '../utils/sonidos';

/**
 * Tarjeta "Palabra del Día" (glass dorado) para la cabecera del mapa.
 * Props:
 *  palabra        objeto de datos.js ({ p, e, fon, emoji, ... })
 *  retoCompletado bool — si ya completó el reto diario hoy
 *  onReto         () => void — abre la pantalla del reto diario
 */
export default function TarjetaPalabraDia({ palabra, retoCompletado, onReto }) {
  if (!palabra) return null;

  // Placeholder de audio: por ahora un sonido de la app.
  // TODO: reemplazar con audio real de sabedores (Audio.Sound) cuando llegue.
  const escuchar = () => sonar.pop();

  return (
    <View style={s.wrap}>
      <LinearGradient
        colors={['rgba(250,199,117,0.18)', 'rgba(196,144,16,0.10)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Text style={s.etiqueta}>✨ PALABRA DE HOY</Text>

      <View style={s.fila}>
        <Text style={s.emoji}>{palabra.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={s.past}>{palabra.p}</Text>
          <Text style={s.esp}>{palabra.e}</Text>
        </View>
        <TouchableOpacity
          style={s.audioBtn}
          onPress={escuchar}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="volume-high" size={22} color={colors.doradoNeon} />
        </TouchableOpacity>
      </View>

      {retoCompletado ? (
        <View style={s.hechoRow}>
          <Text style={s.hechoTxt}>✓ Reto diario completado</Text>
        </View>
      ) : (
        <TouchableOpacity style={s.retoBtn} onPress={onReto} activeOpacity={0.85}>
          <Text style={s.retoTxt}>🎯 Reto del día</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    marginHorizontal: 16, marginTop: 4, marginBottom: 8,
    borderRadius: 20, padding: 16, overflow: 'hidden',
    borderWidth: 1.5, borderColor: colors.doradoNeon,
    shadowColor: colors.doradoNeon, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  etiqueta: { fontSize: 10, color: colors.doradoNeon, fontFamily: fonts.bold, letterSpacing: 2, marginBottom: 8 },

  fila:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 44 },
  past:  { fontSize: 30, fontWeight: '900', color: colors.doradoNeon, fontFamily: 'serif', textShadowColor: 'rgba(250,199,117,0.5)', textShadowRadius: 10 },
  esp:   { fontSize: 14, color: colors.cielo, fontFamily: fonts.semibold, marginTop: 2 },

  audioBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(250,199,117,0.20)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: colors.doradoNeon,
  },
  audioIco: { fontSize: 22 },

  retoBtn: {
    marginTop: 14, minHeight: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.turquesa,
    borderWidth: 1, borderColor: colors.turquesaClaro,
  },
  retoTxt: { color: colors.cielo, fontSize: 15, fontFamily: fonts.extra },

  hechoRow: {
    marginTop: 14, minHeight: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(29,158,117,0.18)',
    borderWidth: 1, borderColor: colors.turquesa,
  },
  hechoTxt: { color: colors.turquesaSuave, fontSize: 14, fontFamily: fonts.bold },
});
