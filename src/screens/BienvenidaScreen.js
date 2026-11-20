import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, Rect, Defs, LinearGradient as Degradado, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { acento } from '../theme/ui';
import { PALETA_SOL } from '../theme/solPasto';
import { useJuego } from '../context/JuegoContext';
import BotonGlow from '../components/BotonGlow';
import SolPasto from '../components/SolPasto';
import FranjaTejida from '../components/FranjaTejida';

const { width, height } = Dimensions.get('window');

// Tamaño del Sol de los Pastos, acotado para pantallas grandes y bajas.
const SOL = Math.round(Math.min(width * 0.62, height * 0.3, 270));
const ANCHO_HORIZONTE = width - 32;
const ALTO_HORIZONTE = 74;

// Estrella decorativa con opacidad pulsante (posición fija).
function Estrella({ style, size = 6, dur = 1600, delay = 0 }) {
  const pulso = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, { toValue: 1, duration: dur, delay, useNativeDriver: true }),
        Animated.timing(pulso, { toValue: 0, duration: dur, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const opacity = pulso.interpolate({ inputRange: [0, 1], outputRange: [0.12, 0.85] });
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', width: size, height: size, transform: [{ rotate: '45deg' }], backgroundColor: colors.doradoNeon, opacity }, style]}
    />
  );
}

// Horizonte: cerros del territorio con el camino punteado que une los cinco
// mundos (un rombo por mundo, con su color), como anticipo del mapa.
function Horizonte() {
  const W = ANCHO_HORIZONTE;
  const H = ALTO_HORIZONTE;
  const cerros = `M0 ${H} L0 ${H * 0.62} L${W * 0.12} ${H * 0.4} L${W * 0.22} ${H * 0.55} L${W * 0.36} ${H * 0.18} L${W * 0.47} ${H * 0.46}`
    + ` L${W * 0.58} ${H * 0.3} L${W * 0.7} ${H * 0.52} L${W * 0.83} ${H * 0.12} L${W * 0.93} ${H * 0.44} L${W} ${H * 0.36} L${W} ${H} Z`;
  const puntos = [0.1, 0.3, 0.5, 0.7, 0.9].map((f, i) => [W * f, H * (i % 2 === 0 ? 0.8 : 0.68)]);
  const camino = `M${puntos.map(([x, y]) => `${x} ${y}`).join(' L')}`;
  const r = 7;
  return (
    <Svg width={W} height={H}>
      <Defs>
        <Degradado id="cerros" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={PALETA_SOL.nocheAlta} stopOpacity="1" />
          <Stop offset="1" stopColor={PALETA_SOL.noche} stopOpacity="0" />
        </Degradado>
      </Defs>
      <Path d={cerros} fill="url(#cerros)" />
      <Path d={camino} stroke={colors.doradoNeon} strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round" fill="none" />
      {puntos.map(([x, y], i) => (
        <Rect key={i} x={x - r} y={y - r} width={r * 2} height={r * 2} rx={2}
          fill={acento(i + 1)} stroke={colors.noche} strokeWidth={2} transform={`rotate(45 ${x} ${y})`} />
      ))}
    </Svg>
  );
}

export default function BienvenidaScreen({ navigation }) {
  const { estado, cargado } = useJuego();
  const aparece = useRef(new Animated.Value(0)).current;
  const titulo = useRef(new Animated.Value(0)).current;
  const pie = useRef(new Animated.Value(0)).current;
  const giro = useRef(new Animated.Value(0)).current;
  const entrada = useRef(new Animated.Value(0.8)).current;
  const [introVista, setIntroVista] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem('intro_vista_v1');
        setIntroVista(v === '1');
      } catch {
        setIntroVista(false);
      }
    })();

    const anim = Animated.sequence([
      Animated.delay(150),
      Animated.parallel([
        Animated.timing(aparece, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.spring(entrada, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
      ]),
      Animated.timing(titulo, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(pie, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]);
    anim.start();

    // El sol gira muy despacio (una vuelta cada 80 s).
    const girar = Animated.loop(
      Animated.timing(giro, { toValue: 1, duration: 80000, easing: Easing.linear, useNativeDriver: true })
    );
    girar.start();

    return () => { anim.stop(); girar.stop(); };
  }, []);

  const comenzar = async () => {
    // Si aún no dio su nombre, pedirlo primero (NombreScreen decide a dónde sigue).
    if (estado.nombreJugador == null) {
      navigation.replace('Nombre');
      return;
    }
    if (introVista) {
      navigation.replace('MainTabs');
    } else {
      try { await AsyncStorage.setItem('intro_vista_v1', '1'); } catch {}
      navigation.replace('Intro');
    }
  };

  const rotate = giro.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const subir = (v) => v.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  return (
    <View style={s.bg}>
      <LinearGradient colors={[PALETA_SOL.nocheAlta, PALETA_SOL.noche, '#081821']} locations={[0, 0.55, 1]} style={StyleSheet.absoluteFill} />

      <Estrella style={{ top: height * 0.09, left: width * 0.12 }} size={7} dur={1500} />
      <Estrella style={{ top: height * 0.15, right: width * 0.14 }} size={5} dur={1900} delay={400} />
      <Estrella style={{ top: height * 0.33, left: width * 0.08 }} size={5} dur={2100} delay={200} />
      <Estrella style={{ top: height * 0.29, right: width * 0.08 }} size={6} dur={1700} delay={800} />

      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <FranjaTejida alto={14} fondo="transparent" />

        {/* Sol de los Pastos con halo */}
        <Animated.View style={[s.hero, { opacity: aparece, transform: [{ scale: entrada }] }]}>
          <View style={[s.halo, { width: SOL * 1.45, height: SOL * 1.45, borderRadius: SOL }]} />
          <View style={[s.halo, s.haloInterior, { width: SOL * 1.15, height: SOL * 1.15, borderRadius: SOL }]} />
          <Animated.View style={{ transform: [{ rotate }] }}>
            <SolPasto tamano={SOL} />
          </Animated.View>
        </Animated.View>

        {/* Título */}
        <Animated.View style={[s.tituloWrap, { opacity: titulo, transform: [{ translateY: subir(titulo) }] }]}>
          <Text style={s.antetitulo}>EL CAMINO</Text>
          <Text style={s.titulo} accessibilityRole="header">de la Lengua</Text>
          <Text style={s.subtitulo}>La lengua del pueblo Pasto vive en los nombres de sus cerros, ríos y familias.</Text>
        </Animated.View>

        {/* Horizonte con los cinco mundos */}
        <Animated.View style={[s.horizonte, { opacity: titulo }]} accessibilityLabel="Cinco mundos unidos por un camino">
          <Horizonte />
        </Animated.View>

        {/* Botón */}
        <Animated.View style={[s.pie, { opacity: pie, transform: [{ translateY: subir(pie) }] }]}>
          <BotonGlow
            texto={introVista ? 'Continuar el camino' : 'Comenzar el camino'}
            onPress={comenzar}
            variante="primario"
            tamano="lg"
            desactivado={!cargado}
          />
        </Animated.View>

        <FranjaTejida alto={10} fondo="transparent" color={colors.turquesa} />
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  bg:   { flex: 1, backgroundColor: PALETA_SOL.noche },
  safe: { flex: 1, justifyContent: 'space-between', paddingVertical: 8 },

  hero: { alignItems: 'center', justifyContent: 'center', marginTop: height * 0.03, height: SOL * 1.2 },
  halo: { position: 'absolute', backgroundColor: 'rgba(250,199,117,0.035)' },
  haloInterior: { backgroundColor: 'rgba(250,199,117,0.05)' },

  tituloWrap: { alignItems: 'center', paddingHorizontal: 28 },
  antetitulo: { color: colors.turquesaSuave, fontSize: 14, fontFamily: fonts.extra, letterSpacing: 8 },
  titulo:     { color: colors.doradoNeon, fontSize: 44, fontFamily: fonts.extra, lineHeight: 52, marginTop: -2 },
  subtitulo:  { color: colors.cielo, fontSize: 15, fontFamily: fonts.medium, textAlign: 'center', lineHeight: 22, marginTop: 8, opacity: 0.9 },

  horizonte: { alignItems: 'center', paddingHorizontal: 16 },

  pie:     { alignItems: 'center', gap: 12, paddingHorizontal: 26 },
});
