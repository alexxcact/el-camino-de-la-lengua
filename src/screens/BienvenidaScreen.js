import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import BotonGlow from '../components/BotonGlow';

const { width, height } = Dimensions.get('window');

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
  const opacity = pulso.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] });
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', width: size, height: size, borderRadius: size / 2, backgroundColor: colors.doradoNeon, opacity },
        { shadowColor: colors.doradoNeon, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 6, elevation: 4 },
        style,
      ]}
    />
  );
}

export default function BienvenidaScreen({ navigation }) {
  const fadeTitle = useRef(new Animated.Value(0)).current;
  const fadeCard  = useRef(new Animated.Value(0)).current;
  const fadeBtn   = useRef(new Animated.Value(0)).current;
  const levita    = useRef(new Animated.Value(0)).current;
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

    const entrada = Animated.sequence([
      Animated.delay(300),
      Animated.timing(fadeTitle, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(fadeCard,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(fadeBtn,   { toValue: 1, duration: 600, useNativeDriver: true }),
    ]);
    entrada.start();

    const flotar = Animated.loop(
      Animated.sequence([
        Animated.timing(levita, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(levita, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    );
    flotar.start();

    return () => { entrada.stop(); flotar.stop(); };
  }, []);

  const comenzar = async () => {
    if (introVista) {
      navigation.replace('MainTabs');
    } else {
      try { await AsyncStorage.setItem('intro_vista_v1', '1'); } catch {}
      navigation.replace('Intro');
    }
  };

  const translateY = levita.interpolate({ inputRange: [0, 1], outputRange: [-6, 6] });

  return (
    <View style={s.bg}>
      <LinearGradient colors={colors.gradAurora} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />

      {/* Estrellas decorativas */}
      <Estrella style={{ top: height * 0.12, left: width * 0.14 }} size={9} dur={1500} />
      <Estrella style={{ top: height * 0.20, right: width * 0.16 }} size={6} dur={1900} delay={400} />
      <Estrella style={{ top: height * 0.55, left: width * 0.18 }} size={7} dur={1700} delay={800} />
      <Estrella style={{ top: height * 0.50, right: width * 0.12 }} size={5} dur={2100} delay={200} />

      {/* Logo flotante */}
      <Animated.View style={[s.logoWrap, { transform: [{ translateY }] }]}>
        <Image source={require('../../assets/images/icon.png')} style={s.logo} resizeMode="contain" />
      </Animated.View>

      {/* Títulos */}
      <Animated.View style={{ opacity: fadeTitle, alignItems: 'center' }}>
        <Text style={s.tituloApp}>El Camino</Text>
        <Text style={s.tituloApp2}>de la Lengua</Text>
        <Text style={s.subtitulo}>Pueblo Pasto · Nariño · Colombia</Text>
      </Animated.View>

      {/* Story card */}
      <Animated.View style={{ opacity: fadeCard, marginHorizontal: 24 }}>
        <View style={s.storyCard}>
          <Text style={s.storyBadge}>✨ KINTI ✨</Text>
          <Text style={s.storyTxt}>
            Las palabras del <Text style={s.dorado}>pastoker</Text> están desapareciendo del territorio.
          </Text>
          <View style={s.storyDivider} />
          <Text style={s.storyTxt2}>
            Ayuda a recuperarlas y enciende otra vez el <Text style={s.dorado}>Tuta</Text> y el <Text style={s.dorado}>Pued</Text> sagrados.
          </Text>
        </View>
      </Animated.View>

      {/* CTA */}
      <Animated.View style={[s.btnWrap, { opacity: fadeBtn }]}>
        <BotonGlow
          texto={introVista ? 'Continuar el camino' : 'Comenzar el camino'}
          onPress={comenzar}
          variante="primario"
          icono="🌿"
          tamano="lg"
        />
        <Text style={s.creditos}>Asociación PUMA-MAKI · Crea Digital 2026</Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, width, height, justifyContent: 'space-around', paddingVertical: 40 },

  logoWrap: { alignItems: 'center' },
  logo: { width: width * 0.34, height: width * 0.34 },

  tituloApp: {
    fontSize: 44, fontFamily: fonts.extra, color: colors.cielo, letterSpacing: 0.5,
    textShadowColor: 'rgba(250,199,117,0.4)', textShadowRadius: 16,
  },
  tituloApp2: {
    fontSize: 34, fontFamily: fonts.bold, color: colors.turquesaSuave, marginTop: -4,
  },
  subtitulo: { fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 10, letterSpacing: 3, opacity: 0.85 },

  storyCard: {
    padding: 22, borderRadius: 22,
    backgroundColor: 'rgba(11,31,42,0.55)',
    borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.35)',
  },
  storyBadge:   { color: colors.doradoNeon, fontSize: 11, fontFamily: fonts.extra, letterSpacing: 4, textAlign: 'center', marginBottom: 14 },
  storyTxt:     { color: colors.cielo, fontSize: 14, textAlign: 'center', lineHeight: 22, fontStyle: 'italic' },
  storyDivider: { height: 1, backgroundColor: 'rgba(93,202,165,0.3)', marginVertical: 12 },
  storyTxt2:    { color: colors.cielo, fontSize: 13, textAlign: 'center', lineHeight: 21 },
  dorado:       { color: colors.doradoNeon, fontFamily: fonts.bold },

  btnWrap:  { alignItems: 'center', gap: 16 },
  creditos: { fontSize: 10, color: colors.turquesaSuave, letterSpacing: 2, opacity: 0.7 },
});
