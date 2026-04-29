import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { palabras, mundos, shuffle } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import Acompanante from '../components/Acompanante';
import Glass from '../components/Glass';
import BotonGlow from '../components/BotonGlow';
import { imgMundoColor, imgMundoGris } from '../data/imagenes';

export default function QuizScreen({ route, navigation }) {
  const { mundoId } = route.params || {};
  const mundo = mundos.find(m => m.id === mundoId);
  const { ganarPuntos, completarMision, sumarQuiz, verificarLogros } = useJuego();

  const palabrasMundo = palabras.filter(p => mundo.palabrasIds.includes(p.id));
  const [preguntas, setPreguntas] = useState([]);
  const [idx, setIdx] = useState(0);
  const [seleccion, setSeleccion] = useState(null);
  const [aciertos, setAciertos] = useState(0);
  const [fin, setFin] = useState(false);

  useEffect(() => {
    const nuevas = shuffle(palabrasMundo).slice(0, 5).map(p => {
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
    if (op.id === pregunta.palabra.id) {
      setAciertos(a => a + 1);
      ganarPuntos(10);
    }
    setTimeout(() => {
      if (idx + 1 < preguntas.length) {
        setIdx(idx + 1);
        setSeleccion(null);
      } else {
        setFin(true);
        sumarQuiz();
        if (aciertos + (op.id === pregunta.palabra.id ? 1 : 0) >= 3) {
          completarMision(`quiz-${mundoId}`);
          ganarPuntos(20);
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
      <ImageBackground
        source={exito ? imgMundoColor[mundoId] : imgMundoGris[mundoId]}
        style={s.resultBg}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(26,16,8,0.88)', 'rgba(26,16,8,0.65)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={s.resultContent}>
          <Text style={s.resultEmoji}>{exito ? '🏆' : '💪'}</Text>
          <Text style={s.resultTit}>{exito ? '¡Misión cumplida!' : 'Sigue intentando'}</Text>

          <Glass tipo="dorado" bordeBrillante style={s.scoreGlass}>
            <Text style={s.resultScore}>{aciertos} / {preguntas.length}</Text>
            <Text style={s.resultPct}>{porcentaje}% de aciertos</Text>
          </Glass>

          <View style={s.resultDivider} />

          <Acompanante
            personaje={exito ? 'pishku' : 'chutun'}
            mensaje={exito
              ? '¡Pío pío! Las palabras vuelven al territorio. ¡Muy bien hecho, Kinti!'
              : 'Ji ji ji... el olvido aún es fuerte. ¡Inténtalo de nuevo!'}
            lado="izq"
          />

          <BotonGlow
            texto="← Volver al mundo"
            onPress={() => navigation.goBack()}
            variante="primario"
            tamano="lg"
          />
        </View>
      </ImageBackground>
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
    <ImageBackground source={imgMundoGris[mundoId]} style={s.bg} resizeMode="cover">
      <LinearGradient
        colors={['rgba(26,16,8,0.82)', 'rgba(26,16,8,0.60)']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>

        <Glass tipo="oscuro" intensidad={65} style={s.header}>
          <View style={s.headerBadge}>
            <Text style={s.headerBadgeTxt}>{mundo.emoji} {mundo.titulo}</Text>
          </View>
          <Text style={s.progTxt}>Pregunta {idx + 1} / {preguntas.length}</Text>
          <View style={s.progBar}>
            {preguntas.map((_, i) => (
              <View key={i} style={[s.progDot, i < idx && s.progDone, i === idx && s.progActive]} />
            ))}
          </View>
          <Text style={s.aciertosTxt}>✓ {aciertos} aciertos</Text>
        </Glass>

        <Glass tipo="claro" bordeBrillante style={s.qCard}>
          <Text style={s.qLabel}>¿QUÉ SIGNIFICA EN ESPAÑOL?</Text>
          <Text style={s.qEmoji}>{pregunta.palabra.emoji}</Text>
          <Text style={s.qPast}>{pregunta.palabra.p}</Text>
          <Text style={s.qFon}>[ {pregunta.palabra.fon} ]</Text>
        </Glass>

        <View style={s.opciones}>
          {pregunta.opciones.map(op => {
            const esCorr  = op.id === pregunta.palabra.id;
            const elegida = seleccion === op.id;
            return (
              <TouchableOpacity
                key={op.id}
                style={[
                  s.op,
                  seleccion !== null && esCorr            && s.opCorrecta,
                  seleccion !== null && elegida && !esCorr && s.opIncorrecta,
                  seleccion !== null && !esCorr && !elegida && s.opDeshabilitada,
                ]}
                onPress={() => elegir(op)}
                disabled={seleccion !== null}
                activeOpacity={0.8}
              >
                <Text style={s.opEmoji}>{op.emoji}</Text>
                <Text style={s.opTxt}>{op.e}</Text>
                {seleccion !== null && esCorr  && <Text style={s.opCheck}>✓</Text>}
                {seleccion !== null && elegida && !esCorr && <Text style={s.opX}>✗</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <Acompanante personaje={personajeAyuda} mensaje={mensajePersonaje} lado="izq" />
      </ScrollView>
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1 },

  header:         { alignItems: 'center', marginBottom: 16, padding: 14, borderRadius: 18 },
  headerBadge:    { backgroundColor: colors.dorado, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 10 },
  headerBadgeTxt: { color: colors.negro, fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
  progTxt:        { color: colors.crema, fontSize: 12, fontWeight: '700' },
  progBar:        { flexDirection: 'row', gap: 6, marginTop: 6 },
  progDot:        { width: 18, height: 5, borderRadius: 2.5, backgroundColor: 'rgba(247,240,224,0.25)' },
  progActive:     { backgroundColor: colors.doradoBrillo, width: 28 },
  progDone:       { backgroundColor: colors.verdeM },
  aciertosTxt:    { color: colors.doradoBrillo, fontSize: 11, fontWeight: '700', marginTop: 6 },

  qCard:          { padding: 22, alignItems: 'center', marginBottom: 14, borderRadius: 22 },
  qLabel:         { fontSize: 10, color: colors.gris, fontWeight: '900', letterSpacing: 3, marginBottom: 10 },
  qEmoji:         { fontSize: 54, marginBottom: 8 },
  qPast:          {
    fontSize: 34, fontWeight: '900', color: colors.tierra, letterSpacing: 1,
    textShadowColor: 'rgba(139,69,19,0.3)', textShadowRadius: 8,
  },
  qFon:           { fontSize: 12, color: colors.gris, fontStyle: 'italic', marginTop: 4 },

  opciones:       { gap: 9, marginBottom: 10 },
  op:             {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(247,240,224,0.92)',
    padding: 13, borderRadius: 14,
    borderWidth: 1.5, borderColor: colors.glassBorde,
    shadowColor: colors.doradoBrillo, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
  },
  opCorrecta:     { borderColor: colors.verdeM, borderWidth: 2, backgroundColor: 'rgba(247,240,224,0.92)' },
  opIncorrecta:   { borderColor: '#d04040', borderWidth: 2, backgroundColor: 'rgba(208,64,64,0.08)' },
  opDeshabilitada:{ opacity: 0.4 },
  opEmoji:        { fontSize: 24 },
  opTxt:          { flex: 1, fontSize: 14, fontWeight: '700', color: colors.negro },
  opCheck:        { fontSize: 20, color: colors.verdeM, fontWeight: '900' },
  opX:            { fontSize: 20, color: '#d04040', fontWeight: '900' },

  resultBg:       { flex: 1 },
  resultContent:  { flex: 1, padding: 20, justifyContent: 'center' },
  resultEmoji:    { fontSize: 72, textAlign: 'center' },
  resultTit:      {
    fontSize: 24, fontWeight: '900', color: colors.doradoBrillo,
    textAlign: 'center', marginTop: 8, letterSpacing: 0.5,
    textShadowColor: 'rgba(245,200,66,0.3)', textShadowRadius: 8,
  },
  scoreGlass:     { alignItems: 'center', padding: 20, marginTop: 14, borderRadius: 20 },
  resultScore:    { fontSize: 52, fontWeight: '900', color: colors.tierra },
  resultPct:      { fontSize: 14, color: colors.gris },
  resultDivider:  { height: 1, backgroundColor: 'rgba(196,144,16,0.4)', marginVertical: 18 },
});
