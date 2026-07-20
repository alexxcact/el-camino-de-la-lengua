import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { palabras, shuffle } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import BotonGlow from '../components/BotonGlow';
import Confeti from '../components/Confeti';
import PishkuMascota from '../components/PishkuMascota';
import { sonar } from '../utils/sonidos';
import { vibrar } from '../utils/feedback';
import { programarNotificacionDiaria } from '../utils/notificaciones';

// Orden fijo de mecánicas del reto: 2 quiz, 2 parejas rápidas, 1 dictado
const ORDEN = ['quiz', 'parejas', 'quiz', 'parejas', 'dictado'];

const opcionesCon = (target) => {
  const distractores = shuffle(palabras.filter(x => x.id !== target.id)).slice(0, 3);
  return shuffle([target, ...distractores]);
};

// ── Cuenta regresiva hasta medianoche ──
function tiempoHastaMedianoche() {
  const ahora = new Date();
  const manana = new Date(ahora);
  manana.setHours(24, 0, 0, 0);
  const ms = manana - ahora;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function RetoDiarioScreen({ navigation }) {
  const {
    estado, ganarPuntos, completarRetoDiario, retoDiarioDisponible,
    getPalabraDelDia, verificarLogros, cambiarNotificaciones,
  } = useJuego();
  const nombre = estado.nombreJugador || 'Caminante';

  const disponible = retoDiarioDisponible();

  const [pasos, setPasos] = useState([]);
  const [idx, setIdx] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [seleccion, setSeleccion] = useState(null);   // id elegido (quiz/parejas)
  const [texto, setTexto] = useState('');             // dictado
  const [verif, setVerif] = useState(null);           // 'ok' | 'err' | null
  const [fin, setFin] = useState(false);
  const [confeti, setConfeti] = useState(false);
  const [preguntarNotif, setPreguntarNotif] = useState(false);
  const [reloj, setReloj] = useState(tiempoHastaMedianoche());
  const timeoutRef = useRef(null);

  // Construye la secuencia al montar (solo si el reto está disponible).
  useEffect(() => {
    if (!disponible) return;
    const vistas = palabras.filter(p => estado.palabrasVistas.has(p.id));
    const base = vistas.length >= 5 ? vistas : palabras.filter(p => p.mundo === 1);
    const dia = getPalabraDelDia();
    let pool = base.find(p => p.id === dia.id) ? [...base] : [dia, ...base];
    const objetivos = [dia, ...shuffle(pool.filter(p => p.id !== dia.id))].slice(0, ORDEN.length);
    // si el pool fuera muy chico, rellena repitiendo
    while (objetivos.length < ORDEN.length) objetivos.push(pool[objetivos.length % pool.length]);

    setPasos(ORDEN.map((tipo, i) => {
      const target = objetivos[i];
      return { tipo, target, opciones: tipo === 'dictado' ? null : opcionesCon(target) };
    }));
  }, [disponible]);

  // Reloj de la cuenta regresiva (solo cuando ya completó hoy)
  useEffect(() => {
    if (disponible) return;
    const t = setInterval(() => setReloj(tiempoHastaMedianoche()), 1000);
    return () => clearInterval(t);
  }, [disponible]);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  // ─── Ya completado hoy: "Vuelve mañana" + cuenta regresiva ───
  if (!disponible && !fin) {
    return (
      <View style={s.resBg}>
        <LinearGradient colors={colors.gradAurora} style={StyleSheet.absoluteFill} />
        <ScrollView contentContainerStyle={s.resContent}>
          <PishkuMascota celebrando={false} tamano={92} />
          <Text style={s.resTit}>¡Reto completado, {nombre}!</Text>
          <Text style={s.resSub}>Ya recuperaste tu palabra de hoy. Pishku te espera mañana.</Text>
          <View style={s.relojCard}>
            <Text style={s.relojLbl}>VUELVE EN</Text>
            <Text style={s.relojTxt}>{reloj}</Text>
          </View>
          <BotonGlow texto="← Volver al mapa" onPress={() => navigation.goBack()} variante="primario" tamano="lg" />
        </ScrollView>
      </View>
    );
  }

  if (pasos.length === 0) return <View style={s.bg} />;

  // ─── Pantalla de éxito ───
  if (fin) {
    return (
      <View style={s.resBg}>
        <LinearGradient colors={colors.gradAurora} style={StyleSheet.absoluteFill} />
        <ScrollView contentContainerStyle={s.resContent}>
          <PishkuMascota celebrando tamano={96} />
          <Text style={s.resTit}>¡Reto del día logrado!</Text>
          <View style={s.scoreCard}>
            <Text style={s.scoreNum}>{aciertos} / {pasos.length}</Text>
            <Text style={s.bonus}>+25 puntos de bonus diario</Text>
            <Text style={s.rachaTxt}>Racha: {estado.racha || 0} {(estado.racha || 0) === 1 ? 'día' : 'días'}</Text>
          </View>
          <BotonGlow texto="← Volver al mapa" onPress={() => navigation.goBack()} variante="primario" tamano="lg" />
        </ScrollView>
        <Confeti activo={confeti} cantidad={30} onDone={() => setConfeti(false)} />

        {/* Pregunta amable de notificaciones (solo la primera vez) */}
        {preguntarNotif && (
          <View style={s.modalOverlay}>
            <LinearGradient colors={['rgba(11,31,42,0.94)', 'rgba(15,110,86,0.88)']} style={StyleSheet.absoluteFill} />
            <View style={s.modalCard}>
              <Text style={s.modalTit}>¿Quieres que Pishku te recuerde tu palabra del día?</Text>
              <Text style={s.modalSub}>Te avisará una vez al día. Puedes cambiarlo en tu perfil.</Text>
              <View style={{ gap: 10, alignSelf: 'stretch', marginTop: 14 }}>
                <BotonGlow
                  texto="Sí, recuérdame"
                  variante="primario"
                  tamano="lg"
                  onPress={async () => {
                    setPreguntarNotif(false);
                    cambiarNotificaciones(true);
                    await programarNotificacionDiaria(estado.horaNotificacion || 16, nombre);
                  }}
                />
                <BotonGlow texto="Ahora no" variante="fantasma" tamano="md" onPress={() => setPreguntarNotif(false)} />
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }

  const paso = pasos[idx];
  const bloqueado = paso.tipo === 'dictado' ? verif !== null : seleccion !== null;

  const avanzar = (acerto) => {
    if (acerto) { setAciertos(a => a + 1); ganarPuntos(5); sonar.acierto(); vibrar.suave(); }
    else { sonar.error(); vibrar.error(); }
    timeoutRef.current = setTimeout(() => {
      if (idx + 1 < pasos.length) {
        setIdx(idx + 1);
        setSeleccion(null);
        setTexto('');
        setVerif(null);
      } else {
        const esPrimerReto = (estado.retosDiariosTotal || 0) === 0;
        completarRetoDiario();
        verificarLogros();
        sonar.mundo(); vibrar.exito();
        setFin(true);
        setConfeti(true);
        if (esPrimerReto && !estado.notificacionesActivadas) setPreguntarNotif(true);
      }
    }, paso.tipo === 'dictado' ? 1300 : 1100);
  };

  const elegir = (op) => {
    if (seleccion !== null) return;
    setSeleccion(op.id);
    avanzar(op.id === paso.target.id);
  };

  const verificarDictado = () => {
    if (verif !== null) return;
    const correcto = texto.trim().toLowerCase() === paso.target.p.toLowerCase();
    setVerif(correcto ? 'ok' : 'err');
    avanzar(correcto);
  };

  return (
    <KeyboardAvoidingView style={s.bg} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 14, flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Header con progreso */}
        <View style={s.header}>
          <View style={s.headerTop}>
            <Text style={s.headerBadge}>Reto del día</Text>
            <Text style={s.aciertosTxt}>✓ {aciertos}</Text>
          </View>
          <View style={s.progBar}>
            {pasos.map((_, i) => (
              <View key={i} style={[s.progDot, i < idx && s.progDone, i === idx && s.progActive]} />
            ))}
          </View>
        </View>

        {/* QUIZ: pastoker → significado en español */}
        {paso.tipo === 'quiz' && (
          <>
            <View style={s.qCard}>
              <Text style={s.qLabel}>¿QUÉ SIGNIFICA?</Text>
              <Text style={s.qEmoji}>{paso.target.emoji}</Text>
              <Text style={s.qPast}>{paso.target.p}</Text>
              <Text style={s.qFon}>[ {paso.target.fon} ]</Text>
            </View>
            <View style={s.opciones}>
              {paso.opciones.map(op => {
                const esCorr = op.id === paso.target.id;
                const elegida = seleccion === op.id;
                return (
                  <TouchableOpacity
                    key={op.id}
                    style={[
                      s.op,
                      seleccion !== null && esCorr && s.opCorrecta,
                      seleccion !== null && elegida && !esCorr && s.opIncorrecta,
                      seleccion !== null && !esCorr && !elegida && s.opOff,
                    ]}
                    onPress={() => elegir(op)}
                    disabled={bloqueado}
                    activeOpacity={0.85}
                  >
                    <Text style={s.opEmoji}>{op.emoji}</Text>
                    <Text style={s.opTxt}>{op.e}</Text>
                    {seleccion !== null && esCorr && <Text style={s.opCheck}>✓</Text>}
                    {seleccion !== null && elegida && !esCorr && <Ionicons name="close" size={22} color={colors.coral} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* PAREJAS RÁPIDAS: significado → elige el dibujo correcto */}
        {paso.tipo === 'parejas' && (
          <>
            <View style={s.qCard}>
              <Text style={s.qLabel}>UNE CON SU DIBUJO</Text>
              <Text style={s.qPast}>{paso.target.p}</Text>
              <Text style={s.qEsp}>{paso.target.e}</Text>
            </View>
            <View style={s.emojiGrid}>
              {paso.opciones.map(op => {
                const esCorr = op.id === paso.target.id;
                const elegida = seleccion === op.id;
                return (
                  <TouchableOpacity
                    key={op.id}
                    style={[
                      s.emojiBtn,
                      seleccion !== null && esCorr && s.opCorrecta,
                      seleccion !== null && elegida && !esCorr && s.opIncorrecta,
                      seleccion !== null && !esCorr && !elegida && s.opOff,
                    ]}
                    onPress={() => elegir(op)}
                    disabled={bloqueado}
                    activeOpacity={0.85}
                  >
                    <Text style={s.emojiBig}>{op.emoji}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* DICTADO: escribe la palabra en pastoker */}
        {paso.tipo === 'dictado' && (
          <>
            <View style={s.qCard}>
              <Text style={s.qLabel}>¿CÓMO SE ESCRIBE EN PASTOKER?</Text>
              <Text style={s.qEmoji}>{paso.target.emoji}</Text>
              <Text style={s.qEsp}>{paso.target.e}</Text>
            </View>
            <View style={[
              s.inputWrap,
              verif === 'ok' && s.inputWrapOk,
              verif === 'err' && s.inputWrapErr,
            ]}>
              <TextInput
                style={s.input}
                placeholder="Escribe aquí..."
                placeholderTextColor={colors.turquesaSuave}
                value={texto}
                onChangeText={setTexto}
                editable={verif === null}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {verif === 'ok' && <Text style={s.msgOk}>✓ ¡Correcto! "{paso.target.p}"</Text>}
            {verif === 'err' && <Text style={s.msgErr}><Ionicons name="close" size={14} color={colors.coral} /> La correcta era: "{paso.target.p}"</Text>}
            <BotonGlow
              texto="Verificar"
              onPress={verificarDictado}
              variante="primario"
              tamano="lg"
              desactivado={!texto.trim() || verif !== null}
            />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.noche },

  header:      { marginBottom: 16, padding: 14, borderRadius: 16, backgroundColor: colors.nocheCard, borderWidth: 1, borderColor: 'rgba(250,199,117,0.3)' },
  headerTop:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  headerBadge: { color: colors.doradoNeon, fontSize: 14, fontFamily: fonts.bold },
  aciertosTxt: { color: colors.doradoNeon, fontSize: 13, fontFamily: fonts.bold },
  progBar:     { flexDirection: 'row', gap: 7, alignItems: 'center' },
  progDot:     { width: 18, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.18)' },
  progDone:    { backgroundColor: colors.doradoNeon },
  progActive:  { backgroundColor: colors.doradoNeon, width: 30, height: 8, borderRadius: 4, shadowColor: colors.doradoNeon, shadowOpacity: 0.9, shadowRadius: 7, elevation: 6 },

  qCard:  { padding: 24, alignItems: 'center', marginBottom: 16, borderRadius: 22, backgroundColor: colors.nocheCard, borderWidth: 1.5, borderColor: colors.turquesa },
  qLabel: { fontSize: 10, color: colors.turquesaSuave, fontFamily: fonts.bold, letterSpacing: 3, marginBottom: 10 },
  qEmoji: { fontSize: 60, marginBottom: 8 },
  qPast:  { fontSize: 34, fontWeight: '900', color: colors.doradoNeon, fontFamily: 'serif', letterSpacing: 1, textShadowColor: 'rgba(250,199,117,0.5)', textShadowRadius: 12 },
  qFon:   { fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 4 },
  qEsp:   { fontSize: 20, color: colors.cielo, fontFamily: fonts.semibold, marginTop: 6 },

  opciones: { gap: 10, marginBottom: 12 },
  op: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.nocheCard, paddingHorizontal: 14, minHeight: 56, borderRadius: 16,
    borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.2)',
  },
  opCorrecta:   { borderColor: colors.turquesa, borderWidth: 2, backgroundColor: 'rgba(29,158,117,0.15)' },
  opIncorrecta: { borderColor: colors.coral, borderWidth: 2, backgroundColor: 'rgba(242,120,92,0.12)' },
  opOff:        { opacity: 0.4 },
  opEmoji: { fontSize: 26 },
  opTxt:   { flex: 1, fontSize: 15, fontFamily: fonts.bold, color: colors.cielo },
  opCheck: { fontSize: 22, color: colors.turquesa, fontFamily: fonts.extra },
  opX:     { fontSize: 22, color: colors.coral, fontFamily: fonts.extra },

  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  emojiBtn:  {
    width: '47%', aspectRatio: 1.4, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.nocheCard, borderRadius: 18, marginBottom: 10,
    borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.2)',
  },
  emojiBig: { fontSize: 50 },

  inputWrap:    { backgroundColor: colors.nocheProfundo, borderRadius: 16, borderWidth: 2, borderColor: 'rgba(93,202,165,0.3)', marginBottom: 10, height: 52, justifyContent: 'center' },
  inputWrapOk:  { borderColor: colors.turquesa },
  inputWrapErr: { borderColor: colors.coral },
  input:        { paddingHorizontal: 16, fontSize: 18, color: colors.cielo, textAlign: 'center', fontFamily: fonts.bold },
  msgOk:  { color: colors.turquesaClaro, fontSize: 14, fontFamily: fonts.bold, textAlign: 'center', marginBottom: 10 },
  msgErr: { color: colors.coral, fontSize: 14, fontFamily: fonts.bold, textAlign: 'center', marginBottom: 10 },

  // Resultados / vuelve mañana
  resBg:      { flex: 1 },
  resContent: { flexGrow: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  resTit:     { fontSize: 24, fontFamily: fonts.extra, color: colors.doradoNeon, textAlign: 'center', marginTop: 18, textShadowColor: 'rgba(250,199,117,0.4)', textShadowRadius: 10 },
  resSub:     { fontSize: 14, color: colors.turquesaSuave, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  scoreCard:  { alignItems: 'center', padding: 22, marginVertical: 22, borderRadius: 22, alignSelf: 'stretch', backgroundColor: colors.nocheCard, borderWidth: 2, borderColor: colors.doradoNeon },
  scoreNum:   { fontSize: 52, fontFamily: fonts.extra, color: colors.cielo },
  bonus:      { fontSize: 14, color: colors.doradoNeon, fontFamily: fonts.bold, marginTop: 6 },
  rachaTxt:   { fontSize: 13, color: colors.turquesaSuave, fontFamily: fonts.semibold, marginTop: 8 },

  relojCard:  { alignItems: 'center', padding: 20, marginVertical: 22, borderRadius: 20, alignSelf: 'stretch', backgroundColor: colors.nocheCard, borderWidth: 1.5, borderColor: colors.turquesa },
  relojLbl:   { fontSize: 11, color: colors.turquesaSuave, fontFamily: fonts.bold, letterSpacing: 3 },
  relojTxt:   { fontSize: 40, fontFamily: fonts.extra, color: colors.doradoNeon, marginTop: 6, letterSpacing: 2 },

  modalOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard:    { backgroundColor: colors.nocheCard, borderRadius: 24, padding: 24, alignItems: 'center', alignSelf: 'stretch', borderWidth: 2, borderColor: colors.doradoNeon },
  modalEmoji:   { fontSize: 48, marginBottom: 8 },
  modalTit:     { fontSize: 18, fontFamily: fonts.extra, color: colors.cielo, textAlign: 'center' },
  modalSub:     { fontSize: 13, color: colors.turquesaSuave, textAlign: 'center', marginTop: 8, lineHeight: 19 },
});
