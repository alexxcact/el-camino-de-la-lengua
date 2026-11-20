import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { useJuego } from '../context/JuegoContext';
import ContadorAnimado from './ContadorAnimado';
import AvatarSVG from './AvatarSVG';
import { pathGreca } from '../data/greca';
import { LAJA } from '../theme/pasto';

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

const AV = 50;      // avatar
const MARCO = 64;   // anillos del plato alrededor

/**
 * Barra superior fija del jugador (HUD estilo videojuego), con la estética
 * pasta: el avatar dentro de los anillos del plato, el nivel en un rombo, la
 * barra con su rombo de avance, los puntos en una laja y una greca abajo.
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
  const { width: W } = useWindowDimensions();
  const greca = pathGreca(W, 8);
  const fraccion = fraccionXP(puntos);

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
      <View style={s.fila}>
        {/* Avatar dentro de los anillos del plato, con el nivel en un rombo */}
        <View style={s.avatarBox} accessibilityLabel={`${nombre}, nivel ${estado.nivel}`}>
          <Svg width={MARCO} height={MARCO} style={StyleSheet.absoluteFill}>
            <Circle cx={MARCO / 2} cy={MARCO / 2} r={MARCO / 2 - 1.5} fill="none" stroke={colors.doradoNeon} strokeWidth={2} opacity={0.9} />
            <Circle cx={MARCO / 2} cy={MARCO / 2} r={MARCO / 2 - 5} fill="none" stroke={colors.doradoNeon} strokeWidth={1} opacity={0.45} />
          </Svg>
          <View style={s.avatarMarco}>
            {estado.avatar
              ? <AvatarSVG avatar={estado.avatar} tamano={AV} conFondo />
              : <View style={s.avatarInicial}><Text style={s.inicialTxt}>{inicial}</Text></View>}
          </View>
          <View style={s.nivelRombo}>
            <Text style={s.nivelTxt}>{estado.nivel}</Text>
          </View>
        </View>

        {/* Nombre + barra del camino + racha */}
        <View style={s.center}>
          <View style={s.nombreFila}>
            <Text style={s.nombre} numberOfLines={1}>{nombre}</Text>
            <Text style={s.nivelLbl}>NIVEL {estado.nivel}</Text>
          </View>
          <View style={s.xpTrack}>
            <Animated.View style={[s.xpFillWrap, { transform: [{ scaleX: xpAnim }], transformOrigin: 'left' }]}>
              <LinearGradient
                colors={[colors.doradoNeon, '#D9643A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.xpFill}
              />
            </Animated.View>
            <View style={[s.xpRombo, { left: `${Math.min(97, Math.round(fraccion * 100))}%` }]} />
          </View>
          <View style={s.chips}>
            <View style={s.chip}>
              <Ionicons name="flame" size={13} color="#E8774A" />
              <Text style={s.chipTxt}>{racha} {racha === 1 ? 'día' : 'días'}</Text>
            </View>
            <View style={s.chip}>
              <Ionicons name="leaf" size={12} color={colors.turquesaClaro} />
              <Text style={s.chipTxt}>{palabrasHoy} hoy</Text>
            </View>
          </View>
        </View>

        {/* Puntos en una laja, con pulso y "+X" flotante */}
        <View style={s.puntosBox}>
          <Animated.Text style={[s.flotante, { opacity: flotanteOp, transform: [{ translateY: flotanteY }] }]}>
            +{delta}
          </Animated.Text>
          <Animated.View style={[s.pillGlow, { opacity: glowOp }]} />
          <Animated.View style={[s.puntosPill, { transform: [{ scale: pillScale }] }]}>
            <ContadorAnimado valor={puntos} estilo={s.puntosNum} duracion={600} />
            <Text style={s.puntosLbl}>PUNTOS</Text>
          </Animated.View>
        </View>
      </View>

      {/* Greca tejida que cierra la barra */}
      <Svg width={W} height={8} style={s.greca} pointerEvents="none">
        <Path d={greca.d} fill="none" stroke={colors.doradoNeon} strokeWidth={greca.trazo} strokeLinecap="square" opacity={0.28} />
      </Svg>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: colors.nocheHeader,
  },
  wrapExp: { paddingTop: 14, paddingBottom: 18 },
  fila: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  greca: { position: 'absolute', left: 0, bottom: 3 },

  avatarBox: { width: MARCO, height: MARCO, alignItems: 'center', justifyContent: 'center' },
  avatarMarco: { width: AV, height: AV, borderRadius: AV / 2, overflow: 'hidden' },
  avatarInicial: {
    width: AV, height: AV, borderRadius: AV / 2,
    backgroundColor: colors.turquesa,
    alignItems: 'center', justifyContent: 'center',
  },
  inicialTxt: { fontSize: 24, color: colors.cielo, fontFamily: fonts.extra, marginTop: -1 },
  // Nivel en un rombo dorado, al pie del avatar
  nivelRombo: {
    position: 'absolute', bottom: -4, alignSelf: 'center',
    width: 20, height: 20, borderRadius: 3,
    backgroundColor: colors.doradoNeon, borderWidth: 2, borderColor: colors.nocheHeader,
    transform: [{ rotate: '45deg' }], alignItems: 'center', justifyContent: 'center',
  },
  nivelTxt: { color: colors.noche, fontSize: 11, fontFamily: fonts.extra, transform: [{ rotate: '-45deg' }], lineHeight: 13 },

  center: { flex: 1, minWidth: 0 },
  nombreFila: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 6 },
  nombre: { flexShrink: 1, color: colors.cielo, fontSize: 16, fontFamily: fonts.extra },
  nivelLbl: { color: colors.doradoNeon, fontSize: 10, fontFamily: fonts.bold, letterSpacing: 1.5 },
  xpTrack: {
    height: 10, borderRadius: 5, justifyContent: 'center',
    backgroundColor: 'rgba(8,26,34,0.8)', borderWidth: 1, borderColor: LAJA.borde,
  },
  xpFillWrap: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', borderRadius: 5, overflow: 'hidden' },
  xpFill: { flex: 1 },
  xpRombo: {
    position: 'absolute', width: 10, height: 10, marginLeft: -5,
    backgroundColor: colors.doradoNeon, borderWidth: 2, borderColor: colors.nocheHeader,
    transform: [{ rotate: '45deg' }],
  },
  chips: { flexDirection: 'row', gap: 8, marginTop: 7 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
    backgroundColor: 'rgba(8,26,34,0.55)', borderWidth: 1, borderColor: LAJA.borde,
  },
  chipTxt: { color: colors.cielo, fontSize: 11, fontFamily: fonts.semibold },

  puntosBox: { position: 'relative', alignItems: 'center' },
  flotante: {
    position: 'absolute', top: -16, alignSelf: 'center', zIndex: 10,
    color: colors.doradoNeon, fontSize: 15, fontFamily: fonts.bold,
  },
  puntosPill: {
    backgroundColor: LAJA.fondo,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7,
    alignItems: 'center', minWidth: 64,
    borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.4)',
  },
  pillGlow: {
    position: 'absolute', top: -5, left: -5, right: -5, bottom: -5,
    borderRadius: 16, backgroundColor: colors.doradoNeon,
  },
  puntosNum: { color: colors.doradoNeon, fontSize: 20, fontFamily: fonts.extra, lineHeight: 23 },
  puntosLbl: { color: colors.turquesaSuave, fontSize: 8, fontFamily: fonts.bold, letterSpacing: 1.5 },
});
