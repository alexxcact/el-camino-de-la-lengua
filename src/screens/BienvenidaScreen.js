import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { useJuego } from '../context/JuegoContext';
import BotonGlow from '../components/BotonGlow';

const { width, height } = Dimensions.get('window');

// Diámetro del medallón (emblema circular). Acotado para tablets/pantallas grandes.
const EMBLEMA = Math.min(width * 0.6, 250);

// Estrella decorativa con opacidad pulsante (posición fija)
function Estrella({ style, size = 8, dur = 1600, delay = 0 }) {
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
  const opacity = pulso.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.9] });
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: colors.doradoNeon, opacity }, style]}
    />
  );
}

export default function BienvenidaScreen({ navigation }) {
  const { estado, cargado } = useJuego();
  const fadeHero = useRef(new Animated.Value(0)).current;
  const fadeCard = useRef(new Animated.Value(0)).current;
  const fadeBtn  = useRef(new Animated.Value(0)).current;
  const levita   = useRef(new Animated.Value(0)).current;
  const entrada  = useRef(new Animated.Value(0.85)).current; // escala de entrada del emblema
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
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(fadeHero, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(entrada,  { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
      ]),
      Animated.timing(fadeCard, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(fadeBtn,  { toValue: 1, duration: 500, useNativeDriver: true }),
    ]);
    anim.start();

    const flotar = Animated.loop(
      Animated.sequence([
        Animated.timing(levita, { toValue: 1, duration: 2400, useNativeDriver: true }),
        Animated.timing(levita, { toValue: 0, duration: 2400, useNativeDriver: true }),
      ])
    );
    flotar.start();

    return () => { anim.stop(); flotar.stop(); };
  }, []);

  const comenzar = async () => {
    // Si aún no dio su nombre, pedirlo primero (NombreScreen decide a dónde sigue)
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

  const translateY = levita.interpolate({ inputRange: [0, 1], outputRange: [-7, 7] });

  return (
    <View style={s.bg}>
      <LinearGradient colors={colors.gradAurora} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={StyleSheet.absoluteFill} />

      {/* Estrellas decorativas de fondo */}
      <Estrella style={{ top: height * 0.10, left: width * 0.14 }} size={8} dur={1500} />
      <Estrella style={{ top: height * 0.16, right: width * 0.18 }} size={5} dur={1900} delay={400} />
      <Estrella style={{ top: height * 0.30, right: width * 0.10 }} size={6} dur={1700} delay={800} />
      <Estrella style={{ top: height * 0.62, left: width * 0.12 }} size={5} dur={2100} delay={200} />
      <Estrella style={{ top: height * 0.70, right: width * 0.16 }} size={7} dur={1600} delay={600} />

      <SafeAreaView style={s.safe}>
        {/* HERO: medallón + tagline */}
        <Animated.View style={[s.hero, { opacity: fadeHero }]}>
          <Animated.View style={{ transform: [{ translateY }, { scale: entrada }] }}>
            <View style={s.emblemaWrap}>
              {/* Halo (círculos concéntricos translúcidos: glow real en Android) */}
              <View style={[s.halo, s.haloLg]} />
              <View style={[s.halo, s.haloMd]} />
              <View style={s.ring}>
                <Image source={require('../../assets/images/icon.png')} style={s.logo} resizeMode="cover" />
              </View>
            </View>
          </Animated.View>

          <Text style={s.tagline}>Pueblo Pasto · Nariño · Colombia</Text>
        </Animated.View>

        {/* Story card */}
        <Animated.View style={{ opacity: fadeCard }}>
          <View style={s.storyCard}>
            <View style={s.kintiPill}>
              <Text style={s.kintiPillTxt}>KINTI · TU GUÍA</Text>
            </View>
            <Text style={s.storyTxt}>
              Las palabras del <Text style={s.dorado}>pastoker</Text> están desapareciendo del territorio.
            </Text>
            <View style={s.storyDivider} />
            <Text style={s.storyTxt2}>
              Ayúdanos a recuperarlas y a encender otra vez el <Text style={s.dorado}>Tuta</Text> y el <Text style={s.dorado}>Pued</Text> sagrados.
            </Text>
          </View>
        </Animated.View>

        {/* CTA */}
        <Animated.View style={[s.btnWrap, { opacity: fadeBtn }]}>
          <BotonGlow
            texto={introVista ? 'Continuar el camino' : 'Comenzar el camino'}
            onPress={comenzar}
            variante="primario"
            tamano="lg"
            desactivado={!cargado}
          />
          <Text style={s.creditos}>Asociación PUMA-MAKI · Muellamués</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },
  safe: {
    flex: 1,
    paddingHorizontal: 26,
    paddingVertical: 28,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // ── Hero ──
  hero: { alignItems: 'center', marginTop: height * 0.02 },
  emblemaWrap: { alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', borderRadius: 999 },
  haloLg: { width: EMBLEMA * 1.42, height: EMBLEMA * 1.42, backgroundColor: 'rgba(29,158,117,0.16)' },
  haloMd: { width: EMBLEMA * 1.16, height: EMBLEMA * 1.16, backgroundColor: 'rgba(250,199,117,0.12)' },
  ring: {
    width: EMBLEMA, height: EMBLEMA, borderRadius: EMBLEMA / 2,
    overflow: 'hidden',
    borderWidth: 3, borderColor: 'rgba(250,199,117,0.55)',
    backgroundColor: colors.noche,
    // Sombra (iOS) + elevación (Android) para despegar el medallón del fondo
    shadowColor: colors.doradoNeon, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 18,
    elevation: 12,
  },
  logo: { width: '100%', height: '100%' },

  tagline: {
    fontSize: 12, color: colors.turquesaSuave, fontFamily: fonts.medium,
    letterSpacing: 2.5, marginTop: 22, opacity: 0.9, textAlign: 'center',
  },

  // ── Story card ──
  storyCard: {
    width: '100%',
    padding: 22, borderRadius: 24,
    backgroundColor: 'rgba(8,26,34,0.62)',
    borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.35)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16,
    elevation: 6,
  },
  kintiPill: {
    alignSelf: 'center', marginBottom: 16,
    paddingHorizontal: 14, paddingVertical: 5, borderRadius: 999,
    backgroundColor: 'rgba(250,199,117,0.14)',
    borderWidth: 1, borderColor: 'rgba(250,199,117,0.5)',
  },
  kintiPillTxt: { color: colors.doradoNeon, fontSize: 11, fontFamily: fonts.extra, letterSpacing: 3 },
  storyTxt:     { color: colors.cielo, fontSize: 15, textAlign: 'center', lineHeight: 23, fontFamily: fonts.medium },
  storyDivider: { height: 1, backgroundColor: 'rgba(93,202,165,0.3)', marginVertical: 14, alignSelf: 'center', width: '60%' },
  storyTxt2:    { color: colors.cielo, fontSize: 14, textAlign: 'center', lineHeight: 22, fontFamily: fonts.regular, opacity: 0.95 },
  dorado:       { color: colors.doradoNeon, fontFamily: fonts.bold },

  // ── CTA ──
  btnWrap:  { width: '100%', alignItems: 'center', gap: 16 },
  creditos: { fontSize: 10, color: colors.turquesaSuave, letterSpacing: 2, opacity: 0.65, fontFamily: fonts.regular },
});
