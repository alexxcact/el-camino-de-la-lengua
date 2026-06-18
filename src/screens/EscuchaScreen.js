import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { palabras, mundos, shuffle } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import Acompanante from '../components/Acompanante';
import BotonGlow from '../components/BotonGlow';
import Confeti from '../components/Confeti';
import PishkuMascota from '../components/PishkuMascota';
import { sonar } from '../utils/sonidos';
import { vibrar } from '../utils/feedback';
import { decirPalabra, detenerVoz } from '../utils/voz';

const RONDAS = 5;

// ══════════════════════════════════════════════════════════
// ESCUCHA Y ELIGE — refuerza lo oral (Pishku acompaña)
// ══════════════════════════════════════════════════════════
export default function EscuchaScreen({ route, navigation }) {
  const { mundoId } = route.params || {};
  const mundo = mundos.find(m => m.id === mundoId);
  const { estado, ganarPuntos, completarMision, verificarLogros } = useJuego();
  const nombre = estado.nombreJugador || 'Caminante';

  const palabrasMundo = palabras.filter(p => mundo.palabrasIds.includes(p.id));
  const [rondas, setRondas] = useState([]);
  const [idx, setIdx] = useState(0);
  const [seleccion, setSeleccion] = useState(null);
  const [aciertos, setAciertos] = useState(0);
  const [fin, setFin] = useState(false);
  const [flash, setFlash] = useState(false);
  const timeoutRef = useRef(null);
  const pulso = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const nuevas = shuffle(palabrasMundo).slice(0, RONDAS).map(p => {
      const otras = shuffle(palabras.filter(x => x.id !== p.id)).slice(0, 3);
      return { palabra: p, opciones: shuffle([p, ...otras]) };
    });
    setRondas(nuevas);
  }, []);

  // Pronuncia automáticamente la palabra al entrar a cada ronda
  useEffect(() => {
    if (rondas.length === 0) return;
    const t = setTimeout(() => decirPalabra(rondas[idx].palabra.p), 350);
    return () => clearTimeout(t);
  }, [idx, rondas.length]);

  useEffect(() => () => { clearTimeout(timeoutRef.current); detenerVoz(); }, []);

  // Pulso del botón de audio
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulso, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulso, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  if (rondas.length === 0) return <View style={s.bg} />;
  const ronda = rondas[idx];

  const elegir = (op) => {
    if (seleccion !== null) return;
    setSeleccion(op.id);
    const acerto = op.id === ronda.palabra.id;
    if (acerto) { setAciertos(a => a + 1); ganarPuntos(8); setFlash(true); sonar.acierto(); vibrar.suave(); }
    else { sonar.error(); vibrar.error(); }
    timeoutRef.current = setTimeout(() => {
      if (idx + 1 < rondas.length) {
        setIdx(idx + 1);
        setSeleccion(null);
      } else {
        const total = aciertos + (acerto ? 1 : 0);
        setFin(true);
        if (total >= 3) {
          completarMision(`escucha-${mundoId}`);
          ganarPuntos(20);
          sonar.mision(); vibrar.exito();
        }
        verificarLogros();
      }
    }, 1400);
  };

  // ─── Resultado ───
  if (fin) {
    const exito = aciertos >= 3;
    return (
      <View style={s.resBg}>
        <LinearGradient colors={exito ? colors.gradAurora : ['#0B1F2A', '#0E2730', '#11353F']} style={StyleSheet.absoluteFill} />
        <ScrollView contentContainerStyle={s.resContent}>
          {exito
            ? <PishkuMascota celebrando tamano={96} />
            : <Acompanante personaje="pishku" mensaje="¡Sigue escuchando, wawa! Tus oídos aprenderán el canto de las palabras." lado="izq" />}
          <Text style={s.resTit}>{exito ? `¡Buen oído, ${nombre}!` : `Sigue escuchando, ${nombre}`}</Text>
          <View style={s.scoreCard}>
            <Text style={s.scoreNum}>{aciertos} / {rondas.length}</Text>
            <Text style={s.scoreLbl}>palabras reconocidas</Text>
          </View>
          <BotonGlow texto="← Volver al mundo" onPress={() => navigation.goBack()} variante="primario" tamano="lg" />
        </ScrollView>
        {exito && <Confeti activo cantidad={28} />}
      </View>
    );
  }

  const pulsoScale = pulso.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  return (
    <View style={s.bg}>
      <ScrollView contentContainerStyle={{ padding: 14, flexGrow: 1 }} showsVerticalScrollIndicator={false}>

        <View style={s.header}>
          <View style={s.headerTop}>
            <Text style={s.headerBadge}>{mundo.emoji} {mundo.titulo}</Text>
            <Text style={s.aciertosTxt}>{idx + 1}/{rondas.length} · ✓ {aciertos}</Text>
          </View>
          <View style={s.progBar}>
            {rondas.map((_, i) => (
              <View key={i} style={[s.progDot, i < idx && s.progDone, i === idx && s.progActive]} />
            ))}
          </View>
        </View>

        {/* Botón de audio grande */}
        <View style={s.audioWrap}>
          <Text style={s.instruccion}>🎧 Escucha y elige el dibujo</Text>
          <TouchableOpacity onPress={() => decirPalabra(ronda.palabra.p)} activeOpacity={0.85}>
            <Animated.View style={[s.audioBtn, { transform: [{ scale: pulsoScale }] }]}>
              <Text style={s.audioIco}>🔊</Text>
            </Animated.View>
          </TouchableOpacity>
          <Text style={s.audioHint}>Toca para oír otra vez</Text>
        </View>

        {/* Opciones de emoji */}
        <View style={s.grid}>
          {ronda.opciones.map(op => {
            const esCorr = op.id === ronda.palabra.id;
            const elegida = seleccion === op.id;
            return (
              <TouchableOpacity
                key={op.id}
                style={[
                  s.opBtn,
                  seleccion !== null && esCorr && s.opCorrecta,
                  seleccion !== null && elegida && !esCorr && s.opIncorrecta,
                  seleccion !== null && !esCorr && !elegida && s.opOff,
                ]}
                onPress={() => elegir(op)}
                disabled={seleccion !== null}
                activeOpacity={0.85}
              >
                <Text style={s.opEmoji}>{op.emoji}</Text>
                {seleccion !== null && esCorr && <Text style={s.opEsp}>{op.e}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <Acompanante
          personaje="pishku"
          mensaje={seleccion === null
            ? '¡Pío! Escucha bien la palabra y toca el dibujo que le corresponde.'
            : (seleccion === ronda.palabra.id
                ? `¡Eso es! "${ronda.palabra.p}" = "${ronda.palabra.e}"`
                : `Era "${ronda.palabra.p}" = "${ronda.palabra.e}". ¡La próxima la oirás mejor!`)}
          lado="izq"
        />
      </ScrollView>

      <Confeti activo={flash} mini cantidad={8} onDone={() => setFlash(false)} />
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.noche },

  header:      { marginBottom: 16, padding: 14, borderRadius: 16, backgroundColor: colors.nocheCard, borderWidth: 1, borderColor: 'rgba(93,202,165,0.18)' },
  headerTop:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerBadge: { color: colors.cielo, fontSize: 13, fontFamily: fonts.bold },
  aciertosTxt: { color: colors.doradoNeon, fontSize: 13, fontFamily: fonts.bold },
  progBar:     { flexDirection: 'row', gap: 7, alignItems: 'center' },
  progDot:     { width: 18, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.18)' },
  progDone:    { backgroundColor: colors.doradoNeon },
  progActive:  { backgroundColor: colors.doradoNeon, width: 30, height: 8, borderRadius: 4 },

  audioWrap:   { alignItems: 'center', marginBottom: 22 },
  instruccion: { fontSize: 15, color: colors.turquesaSuave, fontFamily: fonts.semibold, marginBottom: 16 },
  audioBtn: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: colors.turquesa, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: colors.turquesaClaro,
    shadowColor: colors.turquesaClaro, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 16, elevation: 12,
  },
  audioIco:  { fontSize: 56 },
  audioHint: { fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 12 },

  grid:   { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  opBtn:  {
    width: '47%', aspectRatio: 1.3, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.nocheCard, borderRadius: 18, marginBottom: 12,
    borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.2)',
  },
  opCorrecta:   { borderColor: colors.turquesa, borderWidth: 2.5, backgroundColor: 'rgba(29,158,117,0.18)' },
  opIncorrecta: { borderColor: colors.coral, borderWidth: 2.5, backgroundColor: 'rgba(242,120,92,0.14)' },
  opOff:        { opacity: 0.4 },
  opEmoji: { fontSize: 56 },
  opEsp:   { fontSize: 13, color: colors.cielo, fontFamily: fonts.bold, marginTop: 4 },

  resBg:      { flex: 1 },
  resContent: { flexGrow: 1, padding: 22, justifyContent: 'center', alignItems: 'center' },
  resTit:     { fontSize: 24, fontFamily: fonts.extra, color: colors.doradoNeon, textAlign: 'center', marginTop: 18, textShadowColor: 'rgba(250,199,117,0.4)', textShadowRadius: 10 },
  scoreCard:  { alignItems: 'center', padding: 22, marginVertical: 22, borderRadius: 22, alignSelf: 'stretch', backgroundColor: colors.nocheCard, borderWidth: 2, borderColor: colors.doradoNeon },
  scoreNum:   { fontSize: 52, fontFamily: fonts.extra, color: colors.cielo },
  scoreLbl:   { fontSize: 13, color: colors.turquesaSuave, fontFamily: fonts.medium, marginTop: 2 },
});
