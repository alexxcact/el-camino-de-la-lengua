import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import Glass from '../components/Glass';
import BotonGlow from '../components/BotonGlow';

const { width, height } = Dimensions.get('window');

export default function BienvenidaScreen({ navigation }) {
  const fadeTitle = useRef(new Animated.Value(0)).current;
  const fadeCard  = useRef(new Animated.Value(0)).current;
  const fadeBtn   = useRef(new Animated.Value(0)).current;
  const shinePts  = useRef(new Animated.Value(0)).current;
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

    Animated.sequence([
      Animated.delay(300),
      Animated.timing(fadeTitle, { toValue: 1, duration: 900,  useNativeDriver: true }),
      Animated.timing(fadeCard,  { toValue: 1, duration: 800,  useNativeDriver: true }),
      Animated.timing(fadeBtn,   { toValue: 1, duration: 600,  useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(shinePts, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(shinePts, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const comenzar = async () => {
    if (introVista) {
      navigation.replace('MainTabs');
    } else {
      try { await AsyncStorage.setItem('intro_vista_v1', '1'); } catch {}
      navigation.replace('Intro');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/personajes/kinti.jpg')}
      style={s.bg}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(13,37,64,0.88)', 'rgba(30,64,16,0.75)', 'rgba(139,69,19,0.70)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Logo PUMA-MAKI */}
      <View style={s.logoWrap}>
        <View style={s.logoFrame}>
          <Image
            source={require('../../assets/images/logo-pumamaki.png')}
            style={s.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Títulos */}
      <Animated.View style={{ opacity: fadeTitle, alignItems: 'center', marginTop: 6 }}>
        <Text style={s.ornamentoTxt}>◆ ◆ ◆</Text>
        <Text style={s.tituloApp}>El Camino</Text>
        <Text style={s.tituloApp2}>de la Lengua</Text>
        <Text style={s.ornamentoTxt}>◆ ◆ ◆</Text>
        <Text style={s.subtitulo}>Pueblo Pasto · Nariño · Colombia</Text>
      </Animated.View>

      {/* Story card en Glass */}
      <Animated.View style={{ opacity: fadeCard, marginHorizontal: 22 }}>
        <Glass tipo="oscuro" intensidad={72} bordeBrillante style={s.storyCard}>
          <Text style={s.storyBadge}>◆ KINTI ◆</Text>
          <Text style={s.storyTxt}>
            Las palabras del{' '}
            <Text style={s.dorado}>pastoker</Text>
            {' '}están desapareciendo del territorio.
          </Text>
          <View style={s.storyDivider} />
          <Text style={s.storyTxt2}>
            Ayuda a recuperarlas y restaura el{' '}
            <Animated.Text style={[s.dorado, {
              opacity: shinePts.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
            }]}>
              Tuta
            </Animated.Text>
            {' '}y el{' '}
            <Animated.Text style={[s.dorado, {
              opacity: shinePts.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
            }]}>
              Pued
            </Animated.Text>
            {' '}sagrados.
          </Text>
        </Glass>
      </Animated.View>

      {/* Botón CTA */}
      <Animated.View style={[s.btnWrap, { opacity: fadeBtn }]}>
        <BotonGlow
          texto={introVista ? 'Continuar el Camino' : 'Comenzar el Camino'}
          onPress={comenzar}
          variante="primario"
          icono="🌿"
          tamano="lg"
        />
        <Text style={s.creditos}>Asociación PUMA-MAKI · Crea Digital 2026</Text>
      </Animated.View>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg:           { flex: 1, width, height, justifyContent: 'space-between' },
  logoWrap:     { alignItems: 'center', marginTop: 44, zIndex: 2 },
  logoFrame:    {
    width: width * 0.50,
    height: 64,
    backgroundColor: 'rgba(26,16,8,0.45)',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.glassBorde,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:         { width: '100%', height: '100%' },
  ornamentoTxt: { color: colors.doradoBrillo, fontSize: 12, letterSpacing: 8, opacity: 0.85, marginVertical: 3 },
  tituloApp:    {
    fontSize: 40, fontWeight: '900', color: colors.doradoBrillo,
    fontFamily: 'serif', letterSpacing: 1,
    textShadowColor: 'rgba(245,200,66,0.45)', textShadowRadius: 14,
  },
  tituloApp2:   {
    fontSize: 33, fontWeight: '900', color: colors.crema,
    fontFamily: 'serif', marginTop: -6, marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.65)', textShadowRadius: 8,
  },
  subtitulo:    { fontSize: 12, color: colors.arena, fontStyle: 'italic', marginTop: 8, letterSpacing: 3, opacity: 0.85 },
  storyCard:    { padding: 22 },
  storyBadge:   { color: colors.doradoBrillo, fontSize: 11, fontWeight: '900', letterSpacing: 4, textAlign: 'center', marginBottom: 14 },
  storyTxt:     { color: colors.crema, fontSize: 14, textAlign: 'center', lineHeight: 22, fontStyle: 'italic' },
  storyDivider: { height: 1, backgroundColor: colors.glassBorde, marginVertical: 12 },
  storyTxt2:    { color: colors.crema, fontSize: 13, textAlign: 'center', lineHeight: 21 },
  dorado:       { color: colors.doradoBrillo, fontWeight: '900', textShadowColor: 'rgba(245,200,66,0.3)', textShadowRadius: 6 },
  btnWrap:      { alignItems: 'center', marginBottom: 36, zIndex: 2, gap: 16 },
  creditos:     { fontSize: 10, color: 'rgba(247,240,224,0.5)', letterSpacing: 2 },
});
