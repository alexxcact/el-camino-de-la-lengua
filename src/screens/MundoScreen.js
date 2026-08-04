import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import { palabras, mundos, CINEMATICAS } from '../data/datos';
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
        <View style={ls.catBadge}><Text style={ls.catBadgeTxt}>{pal.cat}</Text></View>
      </View>
      <BotonGlow
        texto={idx + 1 < pals.length ? 'Siguiente →' : 'Terminar lección'}
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
            <Text style={est.bannerTit}>{mundo.titulo}</Text>
            <Text style={est.bannerSub}>{mundo.desc}</Text>
            <View style={est.miniProgRow}>
              {misiones.map(m => (
                <View key={m.id} style={[est.miniDot, estado.misionesCompletadas.has(m.id) && est.miniDotOn]} />
              ))}
            </View>
          </View>
        </View>

        {CINEMATICAS[`mundo${mundoId}`] && (
          <TouchableOpacity
            style={est.historiaBtn}
            onPress={() => navigation.navigate('Cinematica', { clave: `mundo${mundoId}`, mundoId, rever: true })}
            activeOpacity={0.85}
          >
            <Text style={est.historiaTxt}>Ver historia de nuevo</Text>
          </TouchableOpacity>
        )}

        <View style={est.seccionPill}><Text style={ui.pillTxt}>LECCIÓN</Text></View>
        <TouchableOpacity style={est.card} onPress={() => setVistaActiva('leccion')} activeOpacity={0.85}>
          <View style={{ flex: 1 }}>
            <Text style={est.cardTit}>Aprender las palabras</Text>
            <Text style={est.cardSub}>{mundo.palabrasIds.length} palabras de este mundo</Text>
          </View>
          <Text style={est.chevron}>›</Text>
        </TouchableOpacity>

        <View style={est.seccionPill}><Text style={ui.pillTxt}>MISIONES</Text></View>
        {misiones.map(m => {
          const comp = estado.misionesCompletadas.has(m.id);
          return (
            <TouchableOpacity
              key={m.id}
              onPress={() => navigation.navigate(m.pantalla, m.params)}
              activeOpacity={0.85}
              style={[est.card, comp && est.cardDone]}
            >
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
          <View style={est.compBanner}>
            <Text style={est.compTit}>¡Mundo completado!</Text>
            <Text style={est.compSub}>+20 puntos · Siguiente mundo desbloqueado</Text>
            <BotonGlow texto="Ir al mapa" onPress={() => navigation.navigate('Mapa')} variante="secundario" tamano="sm" />
          </View>
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
                texto="Ir al mapa"
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
    borderRadius: radii.lg, padding: 24, alignItems: 'center', marginBottom: 14, overflow: 'hidden',
    borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.45)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 6,
  },
  emoji:   { fontSize: 60, marginBottom: 10 },
  past:    {
    fontSize: 36, color: colors.doradoNeon, fontFamily: fonts.extra,
    textShadowColor: 'rgba(250,199,117,0.5)', textShadowRadius: 12,
  },
  fon:     { fontSize: 13, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 4 },
  esp:     { fontSize: 18, color: colors.cielo, marginTop: 6, fontFamily: fonts.semibold },
  divider: { ...ui.divider, width: '100%', marginVertical: 12 },
  ej:      { fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic', textAlign: 'center' },
  dots:    { flexDirection: 'row', gap: 5, marginTop: 14 },
  dot:     { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotOn:   { backgroundColor: colors.doradoNeon },
  catWrap:    { alignItems: 'center', marginBottom: 14 },
  catBadge:   { ...ui.chip },
  catBadgeTxt:{ ...ui.chipTxt, fontSize: 11 },
  contador:{ textAlign: 'center', fontSize: 12, color: colors.turquesaSuave, fontFamily: fonts.medium, marginTop: 12 },
});

const est = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },
  content:   { padding: 14, paddingBottom: 36 },
  backBtn:   { padding: 16, paddingBottom: 4 },
  backTxt:   { fontSize: 14, color: colors.turquesaClaro, fontFamily: fonts.semibold },

  banner:      { borderRadius: radii.lg, overflow: 'hidden', marginBottom: 18, height: 170, justifyContent: 'flex-end', borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.35)' },
  bannerImg:    { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  bannerTxt:    { padding: 16 },
  bannerEmoji:  { fontSize: 34 },
  bannerTit:    { fontSize: 24, fontFamily: fonts.extra, color: colors.cielo, letterSpacing: 0.3 },
  bannerSub:    { fontSize: 12, color: colors.turquesaSuave, fontFamily: fonts.medium, marginTop: 3 },
  miniProgRow:  { flexDirection: 'row', gap: 8, marginTop: 12 },
  miniDot:      { width: 28, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
  miniDotOn:    { backgroundColor: colors.doradoNeon },

  seccionPill: { ...ui.pill, marginTop: 8, marginBottom: 10 },

  historiaBtn: { ...ui.chip, alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14 },
  historiaTxt: { color: colors.turquesaSuave, fontSize: 13, fontFamily: fonts.bold },

  card: {
    ...ui.card,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, marginBottom: 10,
  },
  cardDone:   { borderColor: 'rgba(250,199,117,0.6)' },
  iconBox:    { width: 54, height: 54, borderRadius: 14, backgroundColor: colors.nocheProfundo, alignItems: 'center', justifyContent: 'center' },
  iconBoxDone:{ backgroundColor: 'rgba(250,199,117,0.18)' },
  iconEmoji:  { fontSize: 28 },
  cardTit:    { ...ui.h3, fontSize: 15 },
  cardSub:    { ...ui.sub, fontSize: 11, marginTop: 2 },
  chevron:    { fontSize: 24, color: colors.turquesaClaro, paddingHorizontal: 6 },
  check:      { fontSize: 26, color: colors.doradoNeon, fontFamily: fonts.extra, paddingHorizontal: 6 },

  progCard: { ...ui.card, padding: 14, marginTop: 6 },
  progTxt:  { fontSize: 12, color: colors.cielo, marginBottom: 7, fontFamily: fonts.semibold },
  progBar:  { height: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden' },
  progFill: { height: '100%', borderRadius: 4 },

  compBanner: { ...ui.cardDestacada, alignItems: 'center', marginTop: 14, gap: 8 },
  compTit:    { fontSize: 18, fontFamily: fonts.extra, color: colors.doradoNeon },
  compSub:    { ...ui.sub, fontSize: 13, textAlign: 'center' },

  modalOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', padding: 22 },
  modalCard: {
    ...ui.cardDestacada,
    borderRadius: 26, padding: 24, alignItems: 'center', alignSelf: 'stretch',
    borderWidth: 2, borderColor: colors.doradoNeon,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 20, elevation: 20,
  },
  modalBanner:{ alignSelf: 'stretch', height: 140, borderRadius: 16, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: 'rgba(250,199,117,0.4)' },
  medallaBox: { alignItems: 'center', marginTop: 10, marginBottom: 4 },
  medallaTxt: { color: colors.doradoNeon, fontSize: 13, fontFamily: fonts.bold, textAlign: 'center', marginTop: 8 },
  feliTit:    { fontSize: 22, fontFamily: fonts.extra, color: colors.cielo, marginTop: 14 },
  feliSub:    { fontSize: 13, color: colors.turquesaSuave, textAlign: 'center', marginTop: 8, lineHeight: 19 },
  feliPuntos: { fontSize: 56, fontFamily: fonts.extra, color: colors.doradoNeon, marginTop: 8, textShadowColor: 'rgba(250,199,117,0.5)', textShadowRadius: 16 },
});
