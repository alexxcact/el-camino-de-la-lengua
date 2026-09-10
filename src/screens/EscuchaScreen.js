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
import PalabraIlustrada from '../components/PalabraIlustrada';
import IconoActividad from '../components/IconoActividad';
import { sonar } from '../utils/sonidos';
import { vibrar } from '../utils/feedback';
import { decirPalabra, detenerVoz } from '../utils/voz';
import { distinguirDibujos, sesionAprobada } from '../utils/ejercicios';

const RONDAS = 5;

// ══════════════════════════════════════════════════════════
// ESCUCHA Y ELIGE — ejercicio con lectura sintética y dibujos
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
      return { palabra: p, opciones: distinguirDibujos(shuffle([p, ...otras])) };
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
        const exito = sesionAprobada(total, rondas.length);
        setFin(true);
        if (!modoPractica) {
          if (exito) {
            completarMision(`escucha-${mundoId}`);
            ganarPuntos(20);
            sonar.mision(); vibrar.exito();
          }
        } else {
          completarPractica();
          if (exito) { sonar.mision(); vibrar.exito(); }
        }
        verificarLogros();
      }
    }, 1400);
  };

  // ─── Resultado ───
  if (fin) {
    const exito = sesionAprobada(aciertos, rondas.length);
    return (
      <View style={s.resBg}>
        <LinearGradient colors={exito ? colors.gradAurora : ['#0B1F2A', '#0E2730', '#11353F']} style={StyleSheet.absoluteFill} />
        <ScrollView contentContainerStyle={s.resContent}>
          {exito
            ? <PishkuMascota celebrando tamano={96} />
            : <Acompanante personaje="pishku" mensaje="Sigue practicando. Relaciona la palabra que escuchas con su significado." lado="izq" />}
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
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        <View style={s.header}>
          <View style={s.headerTop}>
            <View style={s.headerPill}>
              <IconoActividad tipo="escucha" tamano={22} />
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
          <Text style={s.instruccion}>Escucha y elige el significado completo de esta entrada</Text>
          <TouchableOpacity accessibilityRole="button" accessibilityLabel="Escuchar la palabra otra vez" onPress={() => decirPalabra(ronda.palabra.p)} activeOpacity={0.85}>
            <View style={s.audioGlowWrap}>
              {/* Halo (círculos concéntricos translúcidos: glow real en Android) */}
              <View style={[s.audioHalo, s.audioHaloLg]} />
              <View style={[s.audioHalo, s.audioHaloMd]} />
              <Animated.View style={[s.audioBtn, { transform: [{ scale: pulsoScale }] }]}>
                <Ionicons name="volume-high" size={44} color={colors.crema} />
              </Animated.View>
            </View>
          </TouchableOpacity>
          <Text style={s.audioHint}>Voz sintética de práctica · Toca para repetir</Text>
        </View>

        {/* Dibujos y etiquetas para distinguir significados ambiguos */}
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
                accessibilityRole="button"
                accessibilityLabel={`${op.e}${seleccion !== null && esCorr ? ', respuesta correcta' : seleccion !== null && elegida ? ', respuesta incorrecta' : ''}`}
                accessibilityState={{ disabled: seleccion !== null, selected: elegida }}
                disabled={seleccion !== null}
                activeOpacity={0.85}
              >
                <PalabraIlustrada palabra={op} tamano={64} />
                {(op.etiquetaDibujo || (seleccion !== null && esCorr)) && <Text style={s.opEsp}>{op.e}</Text>}
                {seleccion !== null && esCorr && <Text style={[s.opEstado, s.opEstadoCorrecto]}>✓</Text>}
                {seleccion !== null && elegida && !esCorr && <Text style={[s.opEstado, s.opEstadoError]}>×</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <Acompanante
          personaje="pishku"
          mensaje={seleccion === null
            ? '¡Pío! Usa el dibujo y su etiqueta para reconocer el significado completo de la ficha.'
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
  content: { padding: 16, flexGrow: 1, width: '100%', maxWidth: 620, alignSelf: 'center' },

  header:        { paddingVertical: 4, marginBottom: 16 },
  headerTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10 },
  headerPill:    { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  headerPillTxt: { color: colors.turquesaSuave, fontFamily: fonts.semibold, fontSize: 14, flexShrink: 1 },
  aciertosTxt:   { color: colors.cielo, fontSize: 14, fontFamily: fonts.bold },
  progBar:     { flexDirection: 'row', gap: 7, alignItems: 'center' },
  progDot:     { width: 18, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.18)' },
  progDone:    { backgroundColor: colors.doradoNeon },
  progActive:  { backgroundColor: colors.doradoNeon, width: 30, height: 8, borderRadius: 4 },

  audioWrap:    { alignItems: 'center', marginBottom: 18 },
  instruccion:  { color: colors.cielo, fontSize: 18, fontFamily: fonts.semibold, marginBottom: 8, textAlign: 'center' },
  audioGlowWrap:{ alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  audioHalo:    { position: 'absolute', borderRadius: radii.pill },
  audioHaloLg:  { width: 128, height: 128, backgroundColor: 'rgba(93,202,165,0.06)' },
  audioHaloMd:  { width: 112, height: 112, backgroundColor: 'rgba(93,202,165,0.12)' },
  audioBtn: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: colors.nocheCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.turquesaClaro,
  },
  audioHint: { color: colors.turquesaSuave, fontFamily: fonts.medium, fontSize: 14, marginTop: 8 },

  grid:   { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  opBtn:  {
    ...ui.card,
    borderRadius: radii.md, padding: 14,
    width: '48%', minHeight: 128, alignItems: 'center', justifyContent: 'center',
    marginBottom: 12, backgroundColor: colors.crema, borderColor: colors.arena, shadowOpacity: 0, elevation: 0,
  },
  opCorrecta:   { borderColor: colors.verdeM, borderWidth: 2, backgroundColor: colors.respuestaCorrecta },
  opIncorrecta: { borderColor: colors.rojoVivo, borderWidth: 2, backgroundColor: colors.respuestaIncorrecta },
  opOff:        { opacity: 0.72 },
  opEsp:   { fontSize: 16, lineHeight: 21, color: colors.noche, fontFamily: fonts.bold, marginTop: 6, textAlign: 'center' },
  opEstado: { position: 'absolute', top: 5, right: 10, fontSize: 24, fontFamily: fonts.extra },
  opEstadoCorrecto: { color: colors.verdeM },
  opEstadoError: { color: colors.rojoVivo },

  resBg:      { flex: 1 },
  resContent: { flexGrow: 1, padding: 22, justifyContent: 'center', alignItems: 'center' },
  resTit:     { fontSize: 24, fontFamily: fonts.extra, color: colors.doradoNeon, textAlign: 'center', marginTop: 18, textShadowColor: 'rgba(250,199,117,0.4)', textShadowRadius: 10 },
  scoreCard:  { ...ui.cardDestacada, alignItems: 'center', marginVertical: 22, alignSelf: 'stretch' },
  scoreNum:   { fontSize: 52, fontFamily: fonts.extra, color: colors.cielo },
  scoreLbl:   { fontSize: 14, color: colors.turquesaSuave, fontFamily: fonts.medium, marginTop: 2 },
});
