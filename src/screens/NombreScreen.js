import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { useJuego } from '../context/JuegoContext';
import BotonGlow from '../components/BotonGlow';

// Mismo formateo que guardarNombre, para mostrar el nombre correcto en la respuesta
const formatNombre = (raw) => {
  let l = (raw || '').trim();
  if (l.length > 15) l = l.slice(0, 15).trim();
  if (l.length < 2)  l = 'Caminante';
  return l.charAt(0).toUpperCase() + l.slice(1);
};

export default function NombreScreen({ navigation }) {
  const { guardarNombre } = useJuego();
  const [texto, setTexto] = useState('');
  const [foco, setFoco] = useState(false);
  const [fase, setFase] = useState('pregunta');   // 'pregunta' | 'respuesta'
  const [nombreFinal, setNombreFinal] = useState('');

  const pulso   = useRef(new Animated.Value(0)).current;   // glow del avatar
  const respFade = useRef(new Animated.Value(0)).current;  // aparición de la respuesta
  const salto   = useRef(new Animated.Value(0)).current;   // saltito de Taita al responder

  // Glow suave continuo del avatar
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(pulso, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const confirmar = async (raw) => {
    const disp = formatNombre(raw);
    guardarNombre(raw);
    setNombreFinal(disp);
    setFase('respuesta');

    Animated.parallel([
      Animated.timing(respFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(salto, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.spring(salto, { toValue: 0, friction: 4, useNativeDriver: true }),
      ]),
    ]).start();

    // Decide destino respetando si ya vio la intro
    let destino = 'Intro';
    try {
      const visto = await AsyncStorage.getItem('intro_vista_v1');
      if (visto === '1') destino = 'MainTabs';
      else await AsyncStorage.setItem('intro_vista_v1', '1');
    } catch {}
    setTimeout(() => navigation.replace(destino), 2200);
  };

  const escala = pulso.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });
  const brillo = pulso.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.85] });
  const saltoY = salto.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  const valido = texto.trim().length >= 2;

  return (
    <KeyboardAvoidingView style={s.bg} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={colors.gradAurora} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Avatar de Taita Rimay con glow */}
        <Animated.View style={[s.avatarWrap, { transform: [{ translateY: saltoY }, { scale: escala }] }]}>
          <Animated.View style={[s.glowRing, { opacity: brillo }]} />
          <Image source={require('../../assets/images/personajes/taita_rimay.jpg')} style={s.avatar} />
        </Animated.View>
        <Text style={s.nombrePersonaje}>Taita Rimay</Text>

        {/* Globo de diálogo */}
        {fase === 'pregunta' ? (
          <View style={s.bubble}>
            <Text style={s.bubbleTxt}>
              Pas, wawa... Soy Taita Rimay, el padre de la palabra.{'\n'}
              ¿Cómo te llamas tú, caminante?
            </Text>
          </View>
        ) : (
          <Animated.View style={[s.bubble, s.bubbleResp, { opacity: respFade }]}>
            <Text style={s.bubbleTxt}>
              ¡<Text style={s.nombreResp}>{nombreFinal}</Text>! Un buen nombre para un guardián de la lengua.
              Acompaña a Kinti en este camino...
            </Text>
          </Animated.View>
        )}

        {/* Input + botones (solo en fase pregunta) */}
        {fase === 'pregunta' && (
          <>
            <View style={[s.inputWrap, foco && s.inputWrapFoco]}>
              <TextInput
                style={s.input}
                placeholder="Tu nombre..."
                placeholderTextColor={colors.turquesaSuave}
                value={texto}
                onChangeText={setTexto}
                onFocus={() => setFoco(true)}
                onBlur={() => setFoco(false)}
                maxLength={15}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={() => valido && confirmar(texto)}
              />
            </View>

            <View style={s.btns}>
              <BotonGlow
                texto="Así me llamo"
                icono="✨"
                onPress={() => confirmar(texto)}
                variante="primario"
                tamano="lg"
                desactivado={!valido}
              />
              <BotonGlow
                texto="Prefiero no decirlo"
                onPress={() => confirmar('Caminante')}
                variante="fantasma"
                tamano="sm"
              />
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  bg:      { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 4 },

  avatarWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  glowRing: {
    position: 'absolute', width: 156, height: 156, borderRadius: 78,
    backgroundColor: colors.doradoNeon,
  },
  avatar: { width: 140, height: 140, borderRadius: 70, borderWidth: 3.5, borderColor: colors.doradoNeon },
  nombrePersonaje: { color: colors.doradoNeon, fontSize: 14, fontFamily: fonts.extra, letterSpacing: 2, marginBottom: 14 },

  bubble: {
    backgroundColor: 'rgba(11,31,42,0.6)',
    borderRadius: 20, padding: 20, marginBottom: 22,
    borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.35)',
    maxWidth: 360,
  },
  bubbleResp:  { borderColor: colors.doradoNeon },
  bubbleTxt:   { color: colors.cielo, fontSize: 15, textAlign: 'center', lineHeight: 23, fontStyle: 'italic' },
  nombreResp:  { color: colors.doradoNeon, fontFamily: fonts.extra, fontStyle: 'normal' },

  inputWrap: {
    alignSelf: 'stretch', height: 52, justifyContent: 'center',
    backgroundColor: colors.nocheProfundo, borderRadius: 16,
    borderWidth: 2, borderColor: 'rgba(93,202,165,0.4)', marginBottom: 20,
  },
  inputWrapFoco: {
    borderColor: colors.turquesa,
    shadowColor: colors.turquesa, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 10, elevation: 6,
  },
  input: { paddingHorizontal: 16, fontSize: 20, color: colors.cielo, textAlign: 'center', fontFamily: fonts.bold },

  btns: { alignSelf: 'stretch', gap: 14, alignItems: 'center' },
});
