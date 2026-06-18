import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { palabras, mundos } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import { imgMundoColor, imgMundoGris } from '../data/imagenes';
import BotonGlow from '../components/BotonGlow';
import HudJugador from '../components/HudJugador';
import Confeti from '../components/Confeti';
import PishkuMascota from '../components/PishkuMascota';
import ReveladoColor from '../components/ReveladoColor';
import MedallaPasto, { MEDALLAS_INFO } from '../components/MedallaPasto';
import { sonar } from '../utils/sonidos';
import { vibrar } from '../utils/feedback';

// ═══════════════════════════════════════════════════════════
// VISTA DE LECCIÓN (aprendizaje de vocabulario)
// ═══════════════════════════════════════════════════════════
function LeccionView({ mundo, onTerminar }) {
  const { marcarPalabraVista } = useJuego();
  const pals = mundo.palabrasIds.map(id => palabras.find(p => p.id === id)).filter(Boolean);
  const [idx, setIdx] = useState(0);

  const pal = pals[idx];

  const siguiente = () => {
    marcarPalabraVista(pal.id);
    if (idx + 1 < pals.length) setIdx(idx + 1);
    else onTerminar();
  };

  return (
    <View style={ls.wrap}>
      <View style={ls.card}>
        <LinearGradient
          colors={[mundo.color, colors.noche]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={ls.emoji}>{pal.emoji}</Text>
        <Text style={ls.past}>{pal.p}</Text>
        <Text style={ls.fon}>[{pal.fon}]</Text>
        <Text style={ls.esp}>{pal.e}</Text>
        <View style={ls.divider} />
        <Text style={ls.ej}>"{pal.ej}"</Text>
        <View style={ls.dots}>
          {pals.map((_, i) => <View key={i} style={[ls.dot, i === idx && ls.dotOn]} />)}
        </View>
      </View>
      <View style={ls.catWrap}>
        <Text style={ls.catBadge}>{pal.cat}</Text>
      </View>
      <BotonGlow
        texto={idx + 1 < pals.length ? 'Siguiente →' : '✓ Terminar lección'}
        onPress={siguiente}
        variante="primario"
        tamano="lg"
      />
      <Text style={ls.contador}>{idx + 1} de {pals.length} palabras</Text>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════
// PANTALLA PRINCIPAL DEL MUNDO
// ═══════════════════════════════════════════════════════════
export default function MundoScreen({ route, navigation }) {
  const { mundoId } = route.params;
  const mundo = mundos.find(m => m.id === mundoId);
  const { estado, completarMundo, verificarLogros } = useJuego();
  const [vistaActiva, setVistaActiva] = useState(null);
  const [mostrarFelicitacion, setMostrarFelicitacion] = useState(false);
  const [ondaMedio, setOndaMedio] = useState(false);
  const [ondaFin, setOndaFin] = useState(false);
  const popPuntos = useRef(new Animated.Value(0)).current;

  const cerrarModal = () => { setMostrarFelicitacion(false); setOndaMedio(false); setOndaFin(false); };

  useEffect(() => {
    if (!mostrarFelicitacion) return;
    popPuntos.setValue(0);
    const a = Animated.spring(popPuntos, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true });
    a.start();
    return () => a.stop();
  }, [mostrarFelicitacion]);

  const misiones = [
    { id: `quiz-${mundoId}`,    titulo: 'Quiz de palabras', emoji: '🧠', desc: 'Adivina la traducción correcta',  pantalla: 'Quiz',    params: { mundoId } },
    { id: `parejas-${mundoId}`, titulo: 'Une las parejas',  emoji: '🃏', desc: 'Conecta palabra y significado',    pantalla: 'Parejas', params: { mundoId } },
    { id: `dictado-${mundoId}`, titulo: 'Dictado cultural', emoji: '✍️', desc: 'Escribe la palabra en Pastoquer', pantalla: 'Dictado', params: { mundoId } },
    { id: `escucha-${mundoId}`, titulo: 'Escucha y elige',  emoji: '🎧', desc: 'Reconoce la palabra que suena',   pantalla: 'Escucha', params: { mundoId } },
    { id: `memoria-${mundoId}`, titulo: 'Memoria andina',   emoji: '🧩', desc: 'Encuentra las parejas de cartas', pantalla: 'Memoria', params: { mundoId } },
  ];

  const todasCompletadas  = misiones.every(m => estado.misionesCompletadas.has(m.id));
  const mundoYaCompletado = estado.mundosCompletados.has(mundoId);

  useEffect(() => {
    if (todasCompletadas && !mundoYaCompletado) {
      completarMundo(mundoId);
      verificarLogros();
      setMostrarFelicitacion(true);
    }
  }, [todasCompletadas, mundoYaCompletado, mundoId]);

  const handleTerminarLeccion = () => setVistaActiva(null);

  // ─── Vista de lección ───
  if (vistaActiva === 'leccion') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.noche }}>
        <TouchableOpacity style={est.backBtn} onPress={() => setVistaActiva(null)}>
          <Text style={est.backTxt}>← Volver</Text>
        </TouchableOpacity>
        <LeccionView mundo={mundo} onTerminar={handleTerminarLeccion} />
      </View>
    );
  }

  // ─── Vista principal ───
  const misionesHechas = misiones.filter(m => estado.misionesCompletadas.has(m.id)).length;

  return (
    <View style={est.container}>
      <HudJugador />

      <ScrollView contentContainerStyle={est.content} showsVerticalScrollIndicator={false}>

        {/* Banner del mundo (imagen dentro de tarjeta) */}
        <View style={est.banner}>
          <ReveladoColor
            imagenGris={imgMundoGris[mundoId]}
            imagenColor={imgMundoColor[mundoId]}
            revelado={mundoYaCompletado}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={['transparent', 'rgba(11,31,42,0.55)', colors.noche]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={est.bannerTxt}>
            <Text style={est.bannerEmoji}>{mundo.emoji}</Text>
            <Text style={est.bannerTit}>{mundo.titulo}</Text>
            <Text style={est.bannerSub}>{mundo.desc}</Text>
            <View style={est.miniProgRow}>
              {misiones.map(m => (
                <View key={m.id} style={[est.miniDot, estado.misionesCompletadas.has(m.id) && est.miniDotOn]} />
              ))}
            </View>
          </View>
        </View>

        <Text style={est.seccion}>📚 LECCIÓN</Text>
        <TouchableOpacity style={est.card} onPress={() => setVistaActiva('leccion')} activeOpacity={0.85}>
          <View style={[est.iconBox, { backgroundColor: 'rgba(250,199,117,0.18)' }]}>
            <Text style={est.iconEmoji}>📖</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={est.cardTit}>Aprender las palabras</Text>
            <Text style={est.cardSub}>{mundo.palabrasIds.length} palabras de este mundo</Text>
          </View>
          <Text style={est.chevron}>›</Text>
        </TouchableOpacity>

        <Text style={est.seccion}>🎮 MISIONES</Text>
        {misiones.map(m => {
          const comp = estado.misionesCompletadas.has(m.id);
          return (
            <TouchableOpacity
              key={m.id}
              onPress={() => navigation.navigate(m.pantalla, m.params)}
              activeOpacity={0.85}
              style={[est.card, comp && est.cardDone]}
            >
              <View style={[est.iconBox, comp && est.iconBoxDone]}>
                <Text style={est.iconEmoji}>{m.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={est.cardTit}>{m.titulo}</Text>
                <Text style={est.cardSub}>{m.desc}</Text>
              </View>
              {comp
                ? <Text style={est.check}>✓</Text>
                : <Text style={est.chevron}>›</Text>}
            </TouchableOpacity>
          );
        })}

        {/* Progreso de misiones */}
        <View style={est.progCard}>
          <Text style={est.progTxt}>Misiones completadas: {misionesHechas} / {misiones.length}</Text>
          <View style={est.progBar}>
            <LinearGradient
              colors={colors.gradXP}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[est.progFill, { width: `${(misionesHechas / misiones.length) * 100}%` }]}
            />
          </View>
        </View>

        {/* Banner persistente de mundo completado */}
        {mundoYaCompletado && (
          <LinearGradient
            colors={colors.gradVictoria}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={est.compBanner}
          >
            <Text style={est.compTit}>🏆 ¡Mundo completado!</Text>
            <Text style={est.compSub}>+20 puntos · Siguiente mundo desbloqueado</Text>
            <BotonGlow texto="🗺️ Ir al mapa" onPress={() => navigation.navigate('Mapa')} variante="secundario" tamano="sm" />
          </LinearGradient>
        )}
      </ScrollView>

      {/* Modal de felicitación */}
      {mostrarFelicitacion && (
        <View style={est.modalOverlay}>
          <LinearGradient
            colors={['rgba(11,31,42,0.92)', 'rgba(15,110,86,0.85)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={est.modalCard}>
            <ReveladoColor
              imagenGris={imgMundoGris[mundoId]}
              imagenColor={imgMundoColor[mundoId]}
              revelado
              animarAhora={mostrarFelicitacion}
              onMedio={() => { setOndaMedio(true); sonar.mundo(); vibrar.exito(); }}
              onFin={() => setOndaFin(true)}
              style={est.modalBanner}
            />
            <PishkuMascota celebrando tamano={92} />
            <Text style={est.feliTit}>¡Mundo completado!</Text>
            <Text style={est.feliSub}>
              {estado.nombreJugador || 'Caminante'}, has restaurado el {mundo.titulo.toLowerCase()}.
              {mundoId < 5 ? ' El siguiente mundo se ha encendido.' : ' ¡Has iluminado todo el camino!'}
            </Text>

            {ondaFin && (
              <View style={est.medallaBox}>
                <MedallaPasto mundoId={mundoId} ganada tamano={84} animarEntrada />
                <Text style={est.medallaTxt}>¡Medalla ganada: {MEDALLAS_INFO[mundoId].nombre}!</Text>
              </View>
            )}
            <Animated.Text style={[est.feliPuntos, { transform: [{ scale: popPuntos.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }] }]}>
              +20
            </Animated.Text>
            <View style={{ gap: 10, marginTop: 6, alignSelf: 'stretch' }}>
              <BotonGlow
                texto="🗺️ Ir al mapa"
                onPress={() => { cerrarModal(); navigation.navigate('Mapa'); }}
                variante="primario"
                tamano="lg"
              />
              <BotonGlow texto="Seguir aquí" onPress={cerrarModal} variante="fantasma" tamano="md" />
            </View>
          </View>
          <Confeti activo={ondaMedio} cantidad={30} />
        </View>
      )}
    </View>
  );
}

const ls = StyleSheet.create({
  wrap:    { flex: 1, padding: 16 },
  card:    {
    borderRadius: 22, padding: 24, alignItems: 'center', marginBottom: 14, overflow: 'hidden',
    borderWidth: 1.5, borderColor: colors.turquesa,
  },
  emoji:   { fontSize: 60, marginBottom: 10 },
  past:    {
    fontSize: 36, fontWeight: '900', color: colors.doradoNeon, fontFamily: 'serif',
    textShadowColor: 'rgba(250,199,117,0.5)', textShadowRadius: 12,
  },
  fon:     { fontSize: 13, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 4 },
  esp:     { fontSize: 18, color: colors.cielo, marginTop: 6, fontFamily: fonts.semibold },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', width: '100%', marginVertical: 12 },
  ej:      { fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic', textAlign: 'center' },
  dots:    { flexDirection: 'row', gap: 5, marginTop: 14 },
  dot:     { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotOn:   { backgroundColor: colors.doradoNeon },
  catWrap: { alignItems: 'center', marginBottom: 14 },
  catBadge:{ fontSize: 11, backgroundColor: colors.verdeVivo, color: colors.cielo, paddingHorizontal: 12, paddingVertical: 3, borderRadius: 12, fontFamily: fonts.semibold, overflow: 'hidden' },
  contador:{ textAlign: 'center', fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 12 },
});

const est = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },
  content:   { padding: 14, paddingBottom: 36 },
  backBtn:   { padding: 16, paddingBottom: 4 },
  backTxt:   { fontSize: 14, color: colors.turquesaClaro, fontFamily: fonts.semibold },

  banner:      { borderRadius: 20, overflow: 'hidden', marginBottom: 18, height: 170, justifyContent: 'flex-end', borderWidth: 1, borderColor: 'rgba(93,202,165,0.2)' },
  bannerImg:    { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  bannerTxt:    { padding: 16 },
  bannerEmoji:  { fontSize: 34 },
  bannerTit:    { fontSize: 24, fontFamily: fonts.extra, color: colors.cielo },
  bannerSub:    { fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 3 },
  miniProgRow:  { flexDirection: 'row', gap: 8, marginTop: 12 },
  miniDot:      { width: 28, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
  miniDotOn:    { backgroundColor: colors.doradoNeon },

  seccion: { fontSize: 12, fontFamily: fonts.bold, color: colors.turquesaSuave, letterSpacing: 2, marginTop: 6, marginBottom: 10, marginLeft: 4 },

  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.nocheCard, borderRadius: 18, padding: 12, marginBottom: 10,
    borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.18)',
  },
  cardDone:   { borderWidth: 2, borderColor: colors.doradoNeon },
  iconBox:    { width: 54, height: 54, borderRadius: 14, backgroundColor: colors.nocheProfundo, alignItems: 'center', justifyContent: 'center' },
  iconBoxDone:{ backgroundColor: 'rgba(250,199,117,0.18)' },
  iconEmoji:  { fontSize: 28 },
  cardTit:    { fontSize: 15, fontFamily: fonts.bold, color: colors.cielo },
  cardSub:    { fontSize: 11, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 2 },
  chevron:    { fontSize: 24, color: colors.turquesaClaro, paddingHorizontal: 6 },
  check:      { fontSize: 26, color: colors.doradoNeon, fontFamily: fonts.extra, paddingHorizontal: 6 },

  progCard: { backgroundColor: colors.nocheCard, padding: 14, borderRadius: 16, marginTop: 6, borderWidth: 1, borderColor: 'rgba(93,202,165,0.18)' },
  progTxt:  { fontSize: 12, color: colors.cielo, marginBottom: 7, fontFamily: fonts.semibold },
  progBar:  { height: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden' },
  progFill: { height: '100%', borderRadius: 4 },

  compBanner: { padding: 18, alignItems: 'center', marginTop: 14, borderRadius: 18, gap: 8 },
  compTit:    { fontSize: 18, fontFamily: fonts.extra, color: colors.noche },
  compSub:    { fontSize: 13, color: colors.noche, opacity: 0.8, fontFamily: fonts.medium },

  modalOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', padding: 22 },
  modalCard: {
    backgroundColor: colors.nocheCard, borderRadius: 26, padding: 24, alignItems: 'center', alignSelf: 'stretch',
    borderWidth: 2, borderColor: colors.doradoNeon,
    shadowColor: colors.doradoNeon, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 20, elevation: 20,
  },
  modalBanner:{ alignSelf: 'stretch', height: 140, borderRadius: 16, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: 'rgba(250,199,117,0.4)' },
  medallaBox: { alignItems: 'center', marginTop: 10, marginBottom: 4 },
  medallaTxt: { color: colors.doradoNeon, fontSize: 13, fontFamily: fonts.bold, textAlign: 'center', marginTop: 8 },
  feliTit:    { fontSize: 22, fontFamily: fonts.extra, color: colors.cielo, marginTop: 14 },
  feliSub:    { fontSize: 13, color: colors.turquesaSuave, textAlign: 'center', marginTop: 8, lineHeight: 19 },
  feliPuntos: { fontSize: 56, fontFamily: fonts.extra, color: colors.doradoNeon, marginTop: 8, textShadowColor: 'rgba(250,199,117,0.5)', textShadowRadius: 16 },
});
