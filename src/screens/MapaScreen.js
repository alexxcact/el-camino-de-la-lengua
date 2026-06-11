import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { mundos } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import { imgMundoColor, imgMundoGris } from '../data/imagenes';
import HudJugador from '../components/HudJugador';
import TarjetaMundo from '../components/TarjetaMundo';

export default function MapaScreen({ navigation }) {
  const { estado } = useJuego();

  const fadeAnims  = useRef(mundos.map(() => new Animated.Value(0))).current;
  const slideAnims = useRef(mundos.map(() => new Animated.Value(28))).current;

  useEffect(() => {
    const anim = Animated.stagger(80,
      fadeAnims.map((a, i) =>
        Animated.parallel([
          Animated.timing(a,             { toValue: 1, duration: 420, useNativeDriver: true }),
          Animated.timing(slideAnims[i], { toValue: 0, duration: 420, useNativeDriver: true }),
        ])
      )
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const desbloqueado = (id) => id === 1 || estado.mundosCompletados.has(id - 1);

  const mundosRestaurados = mundos.filter(m => {
    const v = m.palabrasIds.filter(id => estado.palabrasVistas.has(id)).length;
    return v >= m.palabrasIds.length / 2;
  }).length;

  return (
    <View style={s.container}>
      <SafeAreaView edges={['top']} style={s.hudSafe}>
        <HudJugador />
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }} showsVerticalScrollIndicator={false}>

        {/* Medidor de restauración del territorio */}
        <View style={s.restCard}>
          <View style={s.restHead}>
            <Text style={s.restTit}>🌿 Restauración del Territorio</Text>
            <Text style={s.restCount}>{mundosRestaurados}/5</Text>
          </View>
          <View style={s.restTrack}>
            <LinearGradient
              colors={colors.gradVictoria}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[s.restFill, { width: `${(mundosRestaurados / 5) * 100}%` }]}
            />
          </View>
          <Text style={s.restSub}>
            {mundosRestaurados === 0 && 'El territorio está dormido... cada palabra lo enciende'}
            {mundosRestaurados >= 1 && mundosRestaurados < 3 && 'La luz empieza a volver a los cerros'}
            {mundosRestaurados >= 3 && mundosRestaurados < 5 && 'Las palabras cantan otra vez en la noche andina'}
            {mundosRestaurados === 5 && '¡El Tuta y el Pued brillan otra vez! 🏆'}
          </Text>
        </View>

        <Text style={s.label}>TU CAMINO</Text>

        {mundos.map((mundo, index) => {
          const completado = estado.mundosCompletados.has(mundo.id);
          const abierto    = desbloqueado(mundo.id);
          const palVistas  = mundo.palabrasIds.filter(id => estado.palabrasVistas.has(id)).length;
          const pct        = Math.round((palVistas / mundo.palabrasIds.length) * 100);
          const estadoT    = completado ? 'completado' : abierto ? 'activo' : 'bloqueado';
          const aColor     = completado || pct >= 50;
          const img        = aColor ? imgMundoColor[mundo.id] : imgMundoGris[mundo.id];

          return (
            <Animated.View
              key={mundo.id}
              style={{ opacity: fadeAnims[index], transform: [{ translateY: slideAnims[index] }] }}
            >
              <TarjetaMundo
                mundo={mundo}
                estado={estadoT}
                pct={pct}
                palVistas={palVistas}
                total={mundo.palabrasIds.length}
                img={img}
                onPress={() => navigation.navigate('Mundo', { mundoId: mundo.id })}
              />
            </Animated.View>
          );
        })}

        {estado.mundosCompletados.size === 5 && (
          <LinearGradient
            colors={colors.gradVictoria}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.victoria}
          >
            <Text style={s.vicEmoji}>🏆</Text>
            <Text style={s.vicTit}>¡EL CAMINO COMPLETO!</Text>
            <Text style={s.vicSub}>Has restaurado el Tuta y el Pued del territorio sagrado</Text>
          </LinearGradient>
        )}

        <View style={s.footer}>
          <Text style={s.footTxt}>🌄 Asociación Indígena Agroecológica</Text>
          <Text style={s.footNeg}>PUMA-MAKI</Text>
          <Text style={s.footSub}>Pueblo Pasto · Resguardo de Muellamués · Nariño</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },
  hudSafe:   { backgroundColor: colors.nocheHeader },

  restCard: {
    backgroundColor: colors.nocheCard,
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(93,202,165,0.18)',
  },
  restHead:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 },
  restTit:   { color: colors.cielo, fontSize: 13, fontFamily: fonts.bold },
  restCount: { color: colors.turquesaClaro, fontSize: 14, fontFamily: fonts.extra },
  restTrack: { height: 10, borderRadius: 5, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)' },
  restFill:  { height: '100%', borderRadius: 5 },
  restSub:   { color: colors.turquesaSuave, fontSize: 11, fontStyle: 'italic', marginTop: 7, lineHeight: 15 },

  label: {
    color: colors.turquesaSuave,
    fontSize: 12,
    fontFamily: fonts.bold,
    letterSpacing: 2,
    marginLeft: 18,
    marginTop: 20,
    marginBottom: 12,
  },

  victoria: { marginHorizontal: 14, marginTop: 6, padding: 24, borderRadius: 20, alignItems: 'center' },
  vicEmoji: { fontSize: 52 },
  vicTit:   { fontSize: 18, fontFamily: fonts.extra, color: colors.noche, marginTop: 8, letterSpacing: 1 },
  vicSub:   { fontSize: 12, color: colors.noche, opacity: 0.85, marginTop: 6, textAlign: 'center', lineHeight: 18, fontFamily: fonts.medium },

  footer:  { alignItems: 'center', marginTop: 24, paddingHorizontal: 14, paddingTop: 18, marginHorizontal: 14, borderTopWidth: 1, borderTopColor: 'rgba(93,202,165,0.18)' },
  footTxt: { fontSize: 11, color: colors.turquesaSuave, fontStyle: 'italic' },
  footNeg: { fontSize: 16, fontFamily: fonts.extra, color: colors.turquesaClaro, letterSpacing: 3, marginVertical: 3 },
  footSub: { fontSize: 10, color: colors.turquesaSuave, opacity: 0.7 },
});
