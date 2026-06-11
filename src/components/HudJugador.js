import React, { useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { useJuego } from '../context/JuegoContext';

// Mismos umbrales de nivel que el JuegoContext (para la barra de XP del HUD)
const NIVELES = [0, 10, 20, 30, 50];

function fraccionXP(puntos) {
  let lo = 0, hi = null;
  for (let i = 0; i < NIVELES.length; i++) {
    if (puntos >= NIVELES[i]) { lo = NIVELES[i]; hi = NIVELES[i + 1] ?? null; }
  }
  if (hi == null) return 1; // nivel máximo
  return Math.max(0, Math.min(1, (puntos - lo) / (hi - lo)));
}

/**
 * Barra superior fija del jugador (HUD estilo videojuego).
 * Visible en Mapa, Mundo y Perfil.
 * Props:
 *  expandido  bool  (margen/padding un poco mayor para la pantalla de perfil)
 */
export default function HudJugador({ expandido = false }) {
  const { estado, getNivel } = useJuego();
  const puntos = estado.puntos;
  const racha = estado.racha || 0;
  const palabrasHoy = estado.palabrasHoy || 0;

  const xpAnim = useRef(new Animated.Value(fraccionXP(puntos))).current;

  useEffect(() => {
    const anim = Animated.timing(xpAnim, {
      toValue: fraccionXP(puntos),
      duration: 600,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [puntos]);

  return (
    <View style={[s.wrap, expandido && s.wrapExp]}>
      {/* Avatar */}
      <View style={s.avatarBox}>
        <Image source={require('../../assets/images/personajes/kinti.jpg')} style={s.avatar} />
        <View style={s.lvlBadge}>
          <Text style={s.lvlTxt}>{estado.nivel}</Text>
        </View>
      </View>

      {/* Nombre + barra XP + chips */}
      <View style={s.center}>
        <Text style={s.nombre} numberOfLines={1}>Kinti · Nivel {estado.nivel}</Text>
        <View style={s.xpTrack}>
          <Animated.View style={[s.xpFillWrap, { transform: [{ scaleX: xpAnim }], transformOrigin: 'left' }]}>
            <LinearGradient
              colors={colors.gradXP}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.xpFill}
            />
          </Animated.View>
        </View>
        <View style={s.chips}>
          <Text style={s.chip}>🔥 {racha} {racha === 1 ? 'día' : 'días'}</Text>
          <Text style={s.chip}>✨ {palabrasHoy} hoy</Text>
        </View>
      </View>

      {/* Píldora de puntos */}
      <View style={s.puntosPill}>
        <Text style={s.puntosNum}>{puntos}</Text>
        <Text style={s.puntosLbl}>pts</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.nocheHeader,
  },
  wrapExp: { paddingVertical: 16 },

  avatarBox: { position: 'relative' },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    borderWidth: 2.5, borderColor: colors.turquesa,
  },
  lvlBadge: {
    position: 'absolute', bottom: -4, right: -4,
    minWidth: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.doradoNeon,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5, borderColor: colors.nocheHeader,
  },
  lvlTxt: { fontSize: 11, color: colors.noche, fontFamily: fonts.extra },

  center: { flex: 1 },
  nombre: { color: colors.cielo, fontSize: 14, fontFamily: fonts.bold, marginBottom: 4 },
  xpTrack: {
    height: 9, borderRadius: 5, overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  xpFillWrap: { width: '100%', height: '100%' },
  xpFill: { flex: 1, borderRadius: 5 },
  chips: { flexDirection: 'row', gap: 10, marginTop: 5 },
  chip: { color: colors.turquesaSuave, fontSize: 11, fontFamily: fonts.semibold },

  puntosPill: {
    backgroundColor: colors.nocheProfundo,
    borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6,
    alignItems: 'center', minWidth: 56,
    borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)',
  },
  puntosNum: { color: colors.doradoNeon, fontSize: 20, fontFamily: fonts.extra, lineHeight: 22 },
  puntosLbl: { color: colors.turquesaSuave, fontSize: 9, fontFamily: fonts.medium, letterSpacing: 1 },
});
