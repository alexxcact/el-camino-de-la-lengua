import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
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
  const { mundoId, palabrasPractica, modoPractica = false, nPreguntas } = route.params || {};
  const mundo = mundoId ? mundos.find(m => m.id === mundoId) : null;
  const { estado, ganarPuntos, completarMision, verificarLogros, completarPractica } = useJuego();
  const nombre = estado.nombreJugador || 'Caminante';

  const premiar = (n) => ganarPuntos(modoPractica ? Math.max(1, Math.round(n / 2)) : n);
  const palabrasMundo = modoPractica
    ? (palabrasPractica || [])
    : palabras.filter(p => mundo.palabrasIds.includes(p.id));
  const [rondas, setRondas] = useState([]);
  const [idx, setIdx] = useState(0);
  const [seleccion, setSeleccion] = useState(null);
  const [aciertos, setAciertos] = useState(0);
  const [fin, setFin] = useState(false);
  const [flash, setFlash] = useState(false);
  const timeoutRef = useRef(null);
  const pulso = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const nuevas = shuffle(palabrasMundo).slice(0, nPreguntas || RONDAS).map(p => {
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
    if (acerto) { setAciertos(a => a + 1); premiar(8); setFlash(true); sonar.acierto(); vibrar.suave(); }
    else { sonar.error(); vibrar.error(); }
    timeoutRef.current = setTimeout(() => {
      if (idx + 1 < rondas.length) {
        setIdx(idx + 1);
        setSeleccion(null);
      } else {
        const total = aciertos + (acerto ? 1 : 0);
        setFin(true);
        if (!modoPractica) {
          if (total >= 3) {
            completarMision(`escucha-${mundoId}`);
            ganarPuntos(20);
            sonar.mision(); vibrar.exito();
          }
        } else {
          completarPractica();
          if (total >= 3) { sonar.mision(); vibrar.exito(); }
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
          <BotonGlow texto={modoPractica ? '← Volver a practicar' : '← Volver al mundo'} onPress={() => navigation.goBack()} variante="primario" tamano="lg" />
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
            <View style={s.headerPill}>
              <Text style={s.headerPillTxt}>{modoPractica ? 'Práctica libre' : mundo.titulo}</Text>
            </View>
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
          <Text style={s.instruccion}>Escucha y elige el dibujo</Text>
          <TouchableOpacity onPress={() => decirPalabra(ronda.palabra.p)} activeOpacity={0.85}>
            <View style={s.audioGlowWrap}>
              {/* Halo (círculos concéntricos translúcidos: glow real en Android) */}
              <View style={[s.audioHalo, s.audioHaloLg]} />
              <View style={[s.audioHalo, s.audioHaloMd]} />
              <Animated.View style={[s.audioBtn, { transform: [{ scale: pulsoScale }] }]}>
                <Ionicons name="volume-high" size={56} color={colors.cielo} />
              </Animated.View>
            </View>
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

  header:        { ...ui.card, padding: 14, marginBottom: 16 },
  headerTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerPill:    { ...ui.pill, flexShrink: 1 },
  headerPillTxt: { ...ui.pillTxt },
  aciertosTxt:   { color: colors.doradoNeon, fontSize: 13, fontFamily: fonts.bold },
  progBar:     { flexDirection: 'row', gap: 7, alignItems: 'center' },
  progDot:     { width: 18, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.18)' },
  progDone:    { backgroundColor: colors.doradoNeon },
  progActive:  { backgroundColor: colors.doradoNeon, width: 30, height: 8, borderRadius: 4 },

  audioWrap:    { alignItems: 'center', marginBottom: 22 },
  instruccion:  { ...ui.sub, fontSize: 15, fontFamily: fonts.semibold, marginBottom: 16 },
  audioGlowWrap:{ alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  audioHalo:    { position: 'absolute', borderRadius: radii.pill },
  audioHaloLg:  { width: 168, height: 168, backgroundColor: ui.haloTurquesa },
  audioHaloMd:  { width: 140, height: 140, backgroundColor: ui.haloDorado },
  audioBtn: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: colors.turquesa, alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: ui.ringTurquesa,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8,
  },
  audioHint: { ...ui.caption, fontSize: 12, letterSpacing: 0.5, marginTop: 4 },

  grid:   { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  opBtn:  {
    ...ui.card,
    borderRadius: radii.md, padding: 0,
    width: '47%', aspectRatio: 1.3, alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  opCorrecta:   { borderColor: colors.turquesa, borderWidth: 2.5, backgroundColor: 'rgba(29,158,117,0.18)' },
  opIncorrecta: { borderColor: colors.coral, borderWidth: 2.5, backgroundColor: 'rgba(242,120,92,0.14)' },
  opOff:        { opacity: 0.4 },
  opEmoji: { fontSize: 56 },
  opEsp:   { fontSize: 13, color: colors.cielo, fontFamily: fonts.bold, marginTop: 4 },

  resBg:      { flex: 1 },
  resContent: { flexGrow: 1, padding: 22, justifyContent: 'center', alignItems: 'center' },
  resTit:     { fontSize: 24, fontFamily: fonts.extra, color: colors.doradoNeon, textAlign: 'center', marginTop: 18, textShadowColor: 'rgba(250,199,117,0.4)', textShadowRadius: 10 },
  scoreCard:  { ...ui.cardDestacada, alignItems: 'center', marginVertical: 22, alignSelf: 'stretch' },
  scoreNum:   { fontSize: 52, fontFamily: fonts.extra, color: colors.cielo },
  scoreLbl:   { fontSize: 13, color: colors.turquesaSuave, fontFamily: fonts.medium, marginTop: 2 },
});
