import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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
import { sesionAprobada } from '../utils/ejercicios';

export default function QuizScreen({ route, navigation }) {
  const { mundoId, palabrasPractica, modoPractica = false, nPreguntas } = route.params || {};
  const mundo = mundoId ? mundos.find(m => m.id === mundoId) : null;
  const { estado, ganarPuntos, completarMision, sumarQuiz, verificarLogros, completarPractica } = useJuego();
  const nombre = estado.nombreJugador || 'Caminante';

  // En práctica, mitad de puntos por acierto (la historia sigue siendo la vía oficial)
  const premiar = (n) => ganarPuntos(modoPractica ? Math.max(1, Math.round(n / 2)) : n);

  const palabrasMundo = modoPractica
    ? (palabrasPractica || [])
    : palabras.filter(p => mundo.palabrasIds.includes(p.id));
  const [preguntas, setPreguntas] = useState([]);
  const [idx, setIdx] = useState(0);
  const [seleccion, setSeleccion] = useState(null);
  const [aciertos, setAciertos] = useState(0);
  const [fin, setFin] = useState(false);
  const [flashAcierto, setFlashAcierto] = useState(false);

  useEffect(() => {
    const nuevas = shuffle(palabrasMundo).slice(0, nPreguntas || 5).map(p => {
      const otras = shuffle(palabras.filter(x => x.id !== p.id)).slice(0, 3);
      const opciones = shuffle([p, ...otras]);
      return { palabra: p, opciones };
    });
    setPreguntas(nuevas);
  }, []);

  if (preguntas.length === 0) return null;
  const pregunta = preguntas[idx];

  const elegir = (op) => {
    if (seleccion !== null) return;
    setSeleccion(op.id);
    const acerto = op.id === pregunta.palabra.id;
    if (acerto) {
      setAciertos(a => a + 1);
      premiar(10);
      setFlashAcierto(true);
      sonar.acierto(); vibrar.suave();
    } else {
      sonar.error(); vibrar.error();
    }
    setTimeout(() => {
      if (idx + 1 < preguntas.length) {
        setIdx(idx + 1);
        setSeleccion(null);
      } else {
        const exito = sesionAprobada(aciertos + (acerto ? 1 : 0), preguntas.length);
        setFin(true);
        if (!modoPractica) {
          sumarQuiz();
          if (exito) {
            completarMision(`quiz-${mundoId}`);
            ganarPuntos(20);
            sonar.mision(); vibrar.exito();
          }
        } else {
          completarPractica();
          if (exito) { sonar.mision(); vibrar.exito(); }
        }
        verificarLogros();
      }
    }, 1500);
  };

  // ─── Resultado ───
  if (fin) {
    const porcentaje = Math.round((aciertos / preguntas.length) * 100);
    const exito = sesionAprobada(aciertos, preguntas.length);
    return (
      <View style={s.resultBg}>
        <LinearGradient
          colors={exito ? colors.gradAurora : ['#0B1F2A', '#0E2730', '#11353F']}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView contentContainerStyle={s.resultContent}>
          {exito
            ? <PishkuMascota celebrando tamano={96} />
            : <Acompanante personaje="chutun" mensaje="Ji ji ji... el olvido aún es fuerte. ¡Inténtalo de nuevo!" lado="izq" />}

          <Text style={s.resultTit}>{exito ? `¡Muy bien, ${nombre}!` : `Sigue intentando, ${nombre}`}</Text>

          <View style={s.scoreCard}>
            <Text style={s.resultScore}>{aciertos} / {preguntas.length}</Text>
            <Text style={s.resultPct}>{porcentaje}% de aciertos</Text>
            <View style={s.scoreBar}>
              <LinearGradient
                colors={colors.gradXP}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[s.scoreFill, { width: `${porcentaje}%` }]}
              />
            </View>
          </View>

          <BotonGlow texto={modoPractica ? '← Volver a practicar' : '← Volver al mundo'} onPress={() => navigation.goBack()} variante="primario" tamano="lg" />
        </ScrollView>
        {exito && <Confeti activo cantidad={28} />}
      </View>
    );
  }

  // ─── Pregunta ───
  const personajeAyuda = seleccion === null
    ? 'pishku'
    : (seleccion === pregunta.palabra.id ? 'pishku' : 'chutun');
  const mensajePersonaje = seleccion === null
    ? '¡Elige la traducción correcta! Yo volaré con cada palabra que recuperes.'
    : (seleccion === pregunta.palabra.id
        ? `¡Perfecto! "${pregunta.palabra.p}" significa "${pregunta.palabra.e}"`
        : `¡Ji ji ji! La correcta era "${pregunta.palabra.e}"`);

  return (
    <View style={s.bg}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header compacto */}
        <View style={s.header}>
          <View style={s.headerTop}>
            <View style={s.headerPill}>
              <IconoActividad tipo="quiz" tamano={22} />
              <Text style={s.headerPillTxt}>{modoPractica ? 'Práctica libre' : mundo.titulo}</Text>
            </View>
            <Text style={s.aciertosTxt}>{idx + 1}/{preguntas.length} · ✓ {aciertos}</Text>
          </View>
          <View style={s.progBar}>
            {preguntas.map((_, i) => (
              <View key={i} style={[s.progDot, i < idx && s.progDone, i === idx && s.progActive]} />
            ))}
          </View>
        </View>

        {/* Tarjeta de pregunta */}
        <View style={s.qCard}>
          <Text style={s.qLabel}>Elige el significado completo de esta entrada</Text>
          <PalabraIlustrada palabra={pregunta.palabra} tamano={64} />
          <Text style={s.qPast}>{pregunta.palabra.p}</Text>
          <Text style={s.qFon}>Grafía: {pregunta.palabra.fon}</Text>
        </View>

        {/* Opciones */}
        <View style={s.opciones}>
          {pregunta.opciones.map(op => {
            const esCorr  = op.id === pregunta.palabra.id;
            const elegida = seleccion === op.id;
            return (
              <TouchableOpacity
                key={op.id}
                style={[
                  s.op,
                  seleccion !== null && esCorr             && s.opCorrecta,
                  seleccion !== null && elegida && !esCorr  && s.opIncorrecta,
                  seleccion !== null && !esCorr && !elegida && s.opDeshabilitada,
                ]}
                onPress={() => elegir(op)}
                accessibilityRole="button"
                accessibilityLabel={`${op.e}${seleccion !== null && esCorr ? ', respuesta correcta' : seleccion !== null && elegida ? ', respuesta incorrecta' : ''}`}
                accessibilityState={{ disabled: seleccion !== null, selected: elegida }}
                disabled={seleccion !== null}
                activeOpacity={0.85}
              >
                <PalabraIlustrada palabra={op} tamano={36} />
                <Text style={s.opTxt}>{op.e}</Text>
                {seleccion !== null && esCorr             && <Text style={s.opCheck}>✓</Text>}
                {seleccion !== null && elegida && !esCorr  && <Ionicons name="close" size={22} color={colors.rojoVivo} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <Acompanante personaje={personajeAyuda} mensaje={mensajePersonaje} lado="izq" />
      </ScrollView>

      {/* Micro-confeti al acertar */}
      <Confeti activo={flashAcierto} mini cantidad={8} onDone={() => setFlashAcierto(false)} />
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
  progBar:      { flexDirection: 'row', gap: 7, alignItems: 'center' },
  progDot:      { width: 18, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.18)' },
  progDone:     { backgroundColor: colors.doradoNeon },
  progActive:   { backgroundColor: colors.doradoNeon, width: 30, height: 8, borderRadius: 4 },

  qCard:  { backgroundColor: colors.crema, borderRadius: radii.lg, padding: 18, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: colors.arena },
  qLabel: { color: colors.gris, fontSize: 15, fontFamily: fonts.semibold, marginBottom: 10, textAlign: 'center' },
  qPast:  { color: colors.verdeM, fontSize: 34, fontFamily: fonts.extra, marginTop: 4, textAlign: 'center' },
  qFon:   { fontSize: 16, color: colors.gris, fontFamily: fonts.medium, marginTop: 2, textAlign: 'center' },

  opciones: { gap: 10, marginBottom: 12 },
  op: {
    ...ui.card,
    borderRadius: radii.md, paddingVertical: 10, paddingHorizontal: 14, minHeight: 60,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.crema, borderColor: colors.arena, shadowOpacity: 0, elevation: 0,
  },
  opCorrecta:      { borderColor: colors.verdeM, borderWidth: 2, backgroundColor: colors.respuestaCorrecta },
  opIncorrecta:    { borderColor: colors.rojoVivo, borderWidth: 2, backgroundColor: colors.respuestaIncorrecta },
  opDeshabilitada: { opacity: 0.72 },
  opTxt:   { flex: 1, fontSize: 17, lineHeight: 23, fontFamily: fonts.bold, color: colors.noche },
  opCheck: { fontSize: 22, color: colors.verdeM, fontFamily: fonts.extra },

  resultBg:      { flex: 1 },
  resultContent: { flexGrow: 1, padding: 22, justifyContent: 'center', alignItems: 'center' },
  resultTit:     { fontSize: 24, fontFamily: fonts.extra, color: colors.doradoNeon, textAlign: 'center', marginTop: 18, textShadowColor: 'rgba(250,199,117,0.4)', textShadowRadius: 10 },
  scoreCard:     { ...ui.cardDestacada, alignItems: 'center', marginVertical: 22, alignSelf: 'stretch' },
  resultScore:   { fontSize: 52, fontFamily: fonts.extra, color: colors.cielo },
  resultPct:     { fontSize: 14, color: colors.turquesaSuave, marginTop: 2, fontFamily: fonts.medium },
  scoreBar:      { height: 8, width: '100%', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radii.pill, overflow: 'hidden', marginTop: 14 },
  scoreFill:     { height: '100%', borderRadius: radii.pill },
});
