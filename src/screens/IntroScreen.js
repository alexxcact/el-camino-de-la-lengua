import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import Glass from '../components/Glass';
import BotonGlow from '../components/BotonGlow';

const { width, height } = Dimensions.get('window');

const FRASES = [
  {
    personaje: 'taita_rimay',
    nombre: 'Taita Rimay',
    color: '#8B4513',
    texto: 'Kinti, escucha bien...\nEl territorio ha perdido su color. Las palabras de nuestra lengua desaparecen como neblina al sol.',
  },
  {
    personaje: 'taita_rimay',
    nombre: 'Taita Rimay',
    color: '#8B4513',
    texto: 'Los cerros han olvidado sus nombres. Los ríos callan. Los animales guardianes se pierden en la niebla.',
  },
  {
    personaje: 'uma',
    nombre: 'Uma',
    color: '#7A1515',
    texto: 'Wawa... solo tú puedes devolver la vida al territorio. Cada palabra pastoker que aprendas traerá de regreso un color, un sonido, una memoria.',
  },
  {
    personaje: 'pishku',
    nombre: 'Pishku',
    color: '#1A3A5C',
    texto: '¡Pío pío! Yo volaré contigo entre los mundos. Cuando aprendas una palabra, yo la cantaré para que nunca más se olvide.',
  },
  {
    personaje: 'chutun',
    nombre: 'Los Chutún',
    color: '#2D5A16',
    texto: 'Ji ji ji... nosotros te desafiaremos. Si sabes la palabra, el páramo revivirá. Si no la sabes... ¡el olvido seguirá creciendo!',
  },
  {
    personaje: 'taita_rimay',
    nombre: 'Taita Rimay',
    color: '#8B4513',
    texto: 'Ve, Kinti. Restaura el Tuta — la espiral del centro — y el Pued — el círculo sagrado. Que el territorio vuelva a cantar en pastoker.',
  },
];

export default function IntroScreen({ navigation }) {
  const [idx, setIdx] = useState(0);
  const fadeDialog  = useRef(new Animated.Value(0)).current;
  const fadeWorld   = useRef(new Animated.Value(0)).current;
  const colorReveal = useRef(new Animated.Value(0)).current;

  const frase = FRASES[idx];
  const imgPersonaje = {
    taita_rimay: require('../../assets/images/personajes/taita_rimay.jpg'),
    uma:         require('../../assets/images/personajes/uma.jpg'),
    pishku:      require('../../assets/images/personajes/pishku.jpg'),
    chutun:      require('../../assets/images/personajes/chutun.jpg'),
    kinti:       require('../../assets/images/personajes/kinti.jpg'),
  };

  useEffect(() => {
    fadeDialog.setValue(0);
    Animated.timing(fadeDialog, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [idx]);

  useEffect(() => {
    Animated.timing(fadeWorld, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  }, []);

  const siguiente = () => {
    if (idx + 1 < FRASES.length) {
      setIdx(idx + 1);
    } else {
      Animated.timing(colorReveal, { toValue: 1, duration: 1500, useNativeDriver: false }).start(() => {
        setTimeout(() => navigation.replace('MainTabs'), 800);
      });
    }
  };

  const saltar = () => navigation.replace('MainTabs');
  const esUltima = idx === FRASES.length - 1;

  return (
    <View style={s.container}>
      {/* Fondo gris */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeWorld }]}>
        <ImageBackground
          source={require('../../assets/images/escenarios/mundo1_paramo_gris.png')}
          style={s.bg}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(10,10,10,0.55)', 'rgba(26,16,8,0.35)']}
            style={StyleSheet.absoluteFill}
          />
        </ImageBackground>
      </Animated.View>

      {/* Fondo en color — se revela al final */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: colorReveal }]}>
        <ImageBackground
          source={require('../../assets/images/escenarios/mundo1_paramo.png')}
          style={s.bg}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(30,64,16,0.45)', 'rgba(30,64,16,0.2)']}
            style={StyleSheet.absoluteFill}
          />
        </ImageBackground>
      </Animated.View>

      {/* Botón saltar */}
      <TouchableOpacity style={s.saltarBtn} onPress={saltar}>
        <Text style={s.saltarTxt}>Saltar ›</Text>
      </TouchableOpacity>

      {/* Barra de progreso */}
      <View style={s.progBar}>
        {FRASES.map((_, i) => (
          <View key={i} style={[s.progDot, i <= idx && s.progDotOn]} />
        ))}
      </View>

      {/* Personaje */}
      <Animated.View style={[s.personajeWrap, { opacity: fadeDialog }]}>
        <View style={[s.personajeFrame, { borderColor: frase.color, shadowColor: frase.color }]}>
          <Image source={imgPersonaje[frase.personaje]} style={s.personajeImg} />
        </View>
        <LinearGradient
          colors={[frase.color, colors.negro]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.nombreTag}
        >
          <Text style={s.nombreTxt}>{frase.nombre}</Text>
        </LinearGradient>
      </Animated.View>

      {/* Globo de diálogo en Glass */}
      <Animated.View style={{ opacity: fadeDialog, marginHorizontal: 22 }}>
        <Glass tipo="oscuro" intensidad={75} bordeBrillante style={s.dialogBox}>
          <Text style={s.dialogLabel}>◆ DICE ◆</Text>
          <Text style={s.dialogTexto}>{frase.texto}</Text>
        </Glass>
      </Animated.View>

      {/* Botón continuar */}
      <View style={s.btnWrap}>
        {esUltima ? (
          <BotonGlow
            texto="Comenzar el camino"
            onPress={siguiente}
            variante="primario"
            icono="🌿"
            tamano="lg"
          />
        ) : (
          <BotonGlow
            texto="Continuar"
            onPress={siguiente}
            variante="fantasma"
            icono="→"
            tamano="md"
          />
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1, backgroundColor: colors.negro, justifyContent: 'space-between' },
  bg:            { width, height, flex: 1 },

  saltarBtn:     {
    position: 'absolute', top: 50, right: 16, zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1,
    borderColor: colors.glassBorde,
  },
  saltarTxt:     { color: colors.crema, fontSize: 12, fontWeight: '700' },

  progBar:       { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 50, zIndex: 5 },
  progDot:       { width: 28, height: 4, borderRadius: 2, backgroundColor: 'rgba(247,240,224,0.2)' },
  progDotOn:     { backgroundColor: colors.doradoBrillo },

  personajeWrap: { alignItems: 'center', marginTop: 30, zIndex: 5 },
  personajeFrame:{
    width: 180, height: 180, borderRadius: 90,
    borderWidth: 4, overflow: 'hidden',
    shadowOpacity: 0.7, shadowRadius: 24, shadowOffset: { width: 0, height: 0 },
    elevation: 20, backgroundColor: colors.negro,
  },
  personajeImg:  { width: '100%', height: '100%' },
  nombreTag:     {
    position: 'absolute', bottom: -14,
    paddingHorizontal: 18, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1.5, borderColor: colors.glassBorde,
  },
  nombreTxt:     { color: colors.crema, fontSize: 13, fontWeight: '900', letterSpacing: 1 },

  dialogBox:     { padding: 22 },
  dialogLabel:   { color: colors.doradoBrillo, fontSize: 10, fontWeight: '900', letterSpacing: 4, textAlign: 'center', marginBottom: 12 },
  dialogTexto:   { color: colors.crema, fontSize: 15, textAlign: 'center', lineHeight: 24, fontStyle: 'italic' },

  btnWrap:       { alignItems: 'center', marginBottom: 40, zIndex: 5 },
});
