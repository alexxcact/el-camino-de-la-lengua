import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
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
        const exito = aciertos + (acerto ? 1 : 0) >= 3;
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
    const exito = aciertos >= 3;
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
      <ScrollView contentContainerStyle={{ padding: 14, flexGrow: 1 }} showsVerticalScrollIndicator={false}>

        {/* Header compacto */}
        <View style={s.header}>
          <View style={s.headerTop}>
            <Text style={s.headerBadge}>{modoPractica ? '🎯 Práctica libre' : `${mundo.emoji} ${mundo.titulo}`}</Text>
            <Text style={s.aciertosTxt}>✓ {aciertos}</Text>
          </View>
          <View style={s.progBar}>
            {preguntas.map((_, i) => (
              <View key={i} style={[s.progDot, i < idx && s.progDone, i === idx && s.progActive]} />
            ))}
          </View>
        </View>

        {/* Tarjeta de pregunta */}
        <View style={s.qCard}>
          <Text style={s.qLabel}>¿QUÉ SIGNIFICA EN ESPAÑOL?</Text>
          <Text style={s.qEmoji}>{pregunta.palabra.emoji}</Text>
          <Text style={s.qPast}>{pregunta.palabra.p}</Text>
          <Text style={s.qFon}>[ {pregunta.palabra.fon} ]</Text>
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
                disabled={seleccion !== null}
                activeOpacity={0.85}
              >
                <Text style={s.opEmoji}>{op.emoji}</Text>
                <Text style={s.opTxt}>{op.e}</Text>
                {seleccion !== null && esCorr             && <Text style={s.opCheck}>✓</Text>}
                {seleccion !== null && elegida && !esCorr  && <Text style={s.opX}>✗</Text>}
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

  header:       { marginBottom: 16, padding: 14, borderRadius: 16, backgroundColor: colors.nocheCard, borderWidth: 1, borderColor: 'rgba(93,202,165,0.18)' },
  headerTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerBadge:  { color: colors.cielo, fontSize: 13, fontFamily: fonts.bold },
  aciertosTxt:  { color: colors.doradoNeon, fontSize: 13, fontFamily: fonts.bold },
  progBar:      { flexDirection: 'row', gap: 7, alignItems: 'center' },
  progDot:      { width: 18, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.18)' },
  progDone:     { backgroundColor: colors.doradoNeon },
  progActive:   {
    backgroundColor: colors.doradoNeon, width: 30, height: 8, borderRadius: 4,
    shadowColor: colors.doradoNeon, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 7, elevation: 6,
  },

  qCard:  { padding: 24, alignItems: 'center', marginBottom: 16, borderRadius: 22, backgroundColor: colors.nocheCard, borderWidth: 1.5, borderColor: colors.turquesa },
  qLabel: { fontSize: 10, color: colors.turquesaSuave, fontFamily: fonts.bold, letterSpacing: 3, marginBottom: 10 },
  qEmoji: { fontSize: 60, marginBottom: 8 },
  qPast:  { fontSize: 36, fontWeight: '900', color: colors.doradoNeon, fontFamily: 'serif', letterSpacing: 1, textShadowColor: 'rgba(250,199,117,0.5)', textShadowRadius: 12 },
  qFon:   { fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 4 },

  opciones: { gap: 10, marginBottom: 12 },
  op: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.nocheCard, paddingHorizontal: 14, minHeight: 56, borderRadius: 16,
    borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.2)',
  },
  opCorrecta:      { borderColor: colors.turquesa, borderWidth: 2, backgroundColor: 'rgba(29,158,117,0.15)' },
  opIncorrecta:    { borderColor: colors.coral, borderWidth: 2, backgroundColor: 'rgba(242,120,92,0.12)' },
  opDeshabilitada: { opacity: 0.4 },
  opEmoji: { fontSize: 26 },
  opTxt:   { flex: 1, fontSize: 15, fontFamily: fonts.bold, color: colors.cielo },
  opCheck: { fontSize: 22, color: colors.turquesa, fontFamily: fonts.extra },
  opX:     { fontSize: 22, color: colors.coral, fontFamily: fonts.extra },

  resultBg:      { flex: 1 },
  resultContent: { flexGrow: 1, padding: 22, justifyContent: 'center', alignItems: 'center' },
  resultTit:     { fontSize: 24, fontFamily: fonts.extra, color: colors.doradoNeon, textAlign: 'center', marginTop: 18, textShadowColor: 'rgba(250,199,117,0.4)', textShadowRadius: 10 },
  scoreCard:     { alignItems: 'center', padding: 22, marginVertical: 22, borderRadius: 22, alignSelf: 'stretch', backgroundColor: colors.nocheCard, borderWidth: 2, borderColor: colors.doradoNeon },
  resultScore:   { fontSize: 52, fontFamily: fonts.extra, color: colors.cielo },
  resultPct:     { fontSize: 14, color: colors.turquesaSuave, marginTop: 2, fontFamily: fonts.medium },
  scoreBar:      { height: 8, width: '100%', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden', marginTop: 14 },
  scoreFill:     { height: '100%', borderRadius: 4 },
});
