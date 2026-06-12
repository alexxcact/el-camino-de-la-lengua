import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { useJuego } from '../context/JuegoContext';
import ContadorAnimado from './ContadorAnimado';

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
  const { estado } = useJuego();
  const puntos = estado.puntos;
  const racha = estado.racha || 0;
  const palabrasHoy = estado.palabrasHoy || 0;
  const nombre = estado.nombreJugador || 'Caminante';
  const inicial = nombre.charAt(0).toUpperCase();

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

  // Pulso de la píldora + "+X" flotante al ganar puntos
  const pulso    = useRef(new Animated.Value(0)).current;
  const flotante = useRef(new Animated.Value(0)).current;
  const prevPuntos = useRef(puntos);
  const [delta, setDelta] = useState(0);

  useEffect(() => {
    const d = puntos - prevPuntos.current;
    prevPuntos.current = puntos;
    if (d <= 0) return;
    setDelta(d);
    pulso.setValue(0);
    flotante.setValue(0);
    const a = Animated.sequence([
      Animated.timing(pulso, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(pulso, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]);
    const b = Animated.timing(flotante, { toValue: 1, duration: 600, useNativeDriver: true });
    a.start();
    b.start();
    return () => { a.stop(); b.stop(); };
  }, [puntos]);

  const pillScale  = pulso.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const glowOp     = pulso.interpolate({ inputRange: [0, 1], outputRange: [0, 0.85] });
  const flotanteY  = flotante.interpolate({ inputRange: [0, 1], outputRange: [0, -22] });
  const flotanteOp = flotante.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] });

  return (
    <View style={[s.wrap, expandido && s.wrapExp]}>
      {/* Avatar con inicial + insignia de Kinti */}
      <View style={s.avatarBox}>
        <View style={s.avatarInicial}>
          <Text style={s.inicialTxt}>{inicial}</Text>
        </View>
        <Image source={require('../../assets/images/personajes/kinti.jpg')} style={s.kintiBadge} />
      </View>

      {/* Nombre + barra XP + chips */}
      <View style={s.center}>
        <Text style={s.nombre} numberOfLines={1}>{nombre} · Nivel {estado.nivel}</Text>
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

      {/* Píldora de puntos animada */}
      <View style={s.puntosBox}>
        <Animated.Text style={[s.flotante, { opacity: flotanteOp, transform: [{ translateY: flotanteY }] }]}>
          +{delta}
        </Animated.Text>
        <Animated.View style={[s.pillGlow, { opacity: glowOp }]} />
        <Animated.View style={[s.puntosPill, { transform: [{ scale: pillScale }] }]}>
          <ContadorAnimado valor={puntos} estilo={s.puntosNum} duracion={600} />
          <Text style={s.puntosLbl}>pts</Text>
        </Animated.View>
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

  avatarBox: { position: 'relative', width: 50, height: 50 },
  avatarInicial: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: colors.turquesa,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.turquesaClaro,
  },
  inicialTxt: { fontSize: 24, color: colors.cielo, fontFamily: fonts.extra, marginTop: -1 },
  kintiBadge: {
    position: 'absolute', bottom: -3, right: -3,
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: colors.nocheHeader,
  },

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

  puntosBox: { position: 'relative', alignItems: 'center' },
  flotante: {
    position: 'absolute', top: -16, alignSelf: 'center', zIndex: 10,
    color: colors.doradoNeon, fontSize: 15, fontFamily: fonts.bold,
  },
  puntosPill: {
    backgroundColor: colors.nocheProfundo,
    borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6,
    alignItems: 'center', minWidth: 56,
    borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)',
  },
  pillGlow: {
    position: 'absolute', top: -5, left: -5, right: -5, bottom: -5,
    borderRadius: 20, backgroundColor: colors.doradoNeon,
  },
  puntosNum: { color: colors.doradoNeon, fontSize: 20, fontFamily: fonts.extra, lineHeight: 22 },
  puntosLbl: { color: colors.turquesaSuave, fontSize: 9, fontFamily: fonts.medium, letterSpacing: 1 },
});
