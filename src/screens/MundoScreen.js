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
import PalabraIlustrada from '../components/PalabraIlustrada';
import IconoActividad from '../components/IconoActividad';
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
    <ScrollView contentContainerStyle={ls.wrap} showsVerticalScrollIndicator={false}>
      <View style={ls.card}>
        <Text style={ls.contador}>{idx + 1} de {pals.length} palabras</Text>
        <View style={ls.ilustracion}><PalabraIlustrada palabra={pal} tamano={96} /></View>
        <Text style={ls.past}>{pal.p}</Text>
        <Text style={ls.fon}>Grafía: {pal.fon}</Text>
        <Text style={ls.esp}>{pal.e}</Text>
        <View style={ls.divider} />
        <Text style={ls.ej}>{pal.ej}</Text>
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
    </ScrollView>
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
    { id: `quiz-${mundoId}`,    tipo: 'quiz', titulo: 'Quiz de palabras', desc: 'Elige la traducción correcta', pantalla: 'Quiz', params: { mundoId } },
    { id: `parejas-${mundoId}`, tipo: 'parejas', titulo: 'Une las parejas', desc: 'Conecta palabra y significado', pantalla: 'Parejas', params: { mundoId } },
    { id: `dictado-${mundoId}`, tipo: 'dictado', titulo: 'Dictado cultural', desc: 'Escribe la palabra del vocabulario', pantalla: 'Dictado', params: { mundoId } },
    { id: `escucha-${mundoId}`, tipo: 'escucha', titulo: 'Escucha y elige', desc: 'Reconoce la palabra que suena', pantalla: 'Escucha', params: { mundoId } },
    { id: `memoria-${mundoId}`, tipo: 'memoria', titulo: 'Memoria andina', desc: 'Encuentra las parejas de cartas', pantalla: 'Memoria', params: { mundoId } },
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
        <TouchableOpacity accessibilityRole="button" style={est.backBtn} onPress={() => setVistaActiva(null)}>
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
          </View>
        </View>

        {CINEMATICAS[`mundo${mundoId}`] && (
          <TouchableOpacity
            style={est.historiaBtn}
            accessibilityRole="button"
            onPress={() => navigation.navigate('Cinematica', { clave: `mundo${mundoId}`, mundoId, rever: true })}
            activeOpacity={0.85}
          >
            <Text style={est.historiaTxt}>Ver historia de nuevo</Text>
          </TouchableOpacity>
        )}

        <Text style={est.seccionTitulo}>Aprende primero</Text>
        <TouchableOpacity accessibilityRole="button" style={[est.card, est.cardLeccion]} onPress={() => setVistaActiva('leccion')} activeOpacity={0.85}>
          <View style={[est.iconBox, est.iconBoxLeccion]}><IconoActividad tipo="leccion" color={colors.verdeM} /></View>
          <View style={{ flex: 1 }}>
            <Text style={[est.cardTit, est.cardTitLeccion]}>Aprender las palabras</Text>
            <Text style={[est.cardSub, est.cardSubLeccion]}>{mundo.palabrasIds.length} palabras de este mundo</Text>
          </View>
          <Text style={[est.chevron, est.cardTitLeccion]}>›</Text>
        </TouchableOpacity>

        <View style={est.seccionHeader}>
          <Text style={est.seccionTitulo}>Tus misiones</Text>
          <Text style={est.progTxt}>{misionesHechas} de {misiones.length} completadas</Text>
        </View>
        <View style={est.progBar} accessibilityRole="progressbar" accessibilityLabel="Misiones completadas" accessibilityValue={{ min: 0, max: misiones.length, now: misionesHechas }}>
          <LinearGradient colors={colors.gradXP} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[est.progFill, { width: `${(misionesHechas / misiones.length) * 100}%` }]} />
        </View>
        {misiones.map(m => {
          const comp = estado.misionesCompletadas.has(m.id);
          return (
            <TouchableOpacity
              key={m.id}
              accessibilityRole="button"
              accessibilityLabel={`${m.titulo}${comp ? ', completada' : ''}. ${m.desc}`}
              onPress={() => navigation.navigate(m.pantalla, m.params)}
              activeOpacity={0.85}
              style={[est.card, comp && est.cardDone]}
            >
              <View style={[est.iconBox, comp && est.iconBoxDone]}><IconoActividad tipo={m.tipo} color={comp ? colors.doradoNeon : colors.turquesaSuave} /></View>
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
          <ScrollView style={est.modalScroll} contentContainerStyle={est.modalCard} showsVerticalScrollIndicator={false}>
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
          </ScrollView>
          <Confeti activo={ondaMedio} cantidad={30} />
        </View>
      )}
    </View>
  );
}

const ls = StyleSheet.create({
  wrap:    { flexGrow: 1, padding: 16, paddingBottom: 28, width: '100%', maxWidth: 620, alignSelf: 'center' },
  card:    {
    borderRadius: radii.lg, padding: 20, alignItems: 'center', marginBottom: 14,
    backgroundColor: colors.crema, borderWidth: 1, borderColor: colors.arena,
  },
  ilustracion: { marginTop: 12, marginBottom: 8 },
  past:    { fontSize: 36, color: colors.verdeM, fontFamily: fonts.extra, textAlign: 'center' },
  fon:     { fontSize: 16, color: colors.gris, fontFamily: fonts.medium, marginTop: 2, textAlign: 'center' },
  esp:     { fontSize: 22, color: colors.noche, marginTop: 6, fontFamily: fonts.semibold, textAlign: 'center' },
  divider: { height: 1, backgroundColor: colors.arena, width: '100%', marginVertical: 14 },
  ej:      { fontSize: 16, lineHeight: 23, color: colors.gris, fontFamily: fonts.regular, fontStyle: 'italic', textAlign: 'center' },
  dots:    { flexDirection: 'row', gap: 5, marginTop: 14 },
  dot:     { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.arena },
  dotOn:   { backgroundColor: colors.verdeM },
  catWrap:    { alignItems: 'center', marginBottom: 14 },
  catBadge:   { ...ui.chip },
  catBadgeTxt:{ ...ui.chipTxt, fontSize: 14 },
  contador:{ textAlign: 'center', fontSize: 14, color: colors.gris, fontFamily: fonts.medium },
});

const est = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },
  content:   { padding: 16, paddingBottom: 36, width: '100%', maxWidth: 680, alignSelf: 'center' },
  backBtn:   { paddingHorizontal: 16, minHeight: 48, justifyContent: 'center' },
  backTxt:   { fontSize: 14, color: colors.turquesaClaro, fontFamily: fonts.semibold },

  banner:      { borderRadius: radii.lg, overflow: 'hidden', marginBottom: 12, minHeight: 190, justifyContent: 'flex-end', borderWidth: 1, borderColor: 'rgba(93,202,165,0.35)' },
  bannerTxt:    { padding: 16 },
  bannerTit:    { fontSize: 24, fontFamily: fonts.extra, color: colors.cielo, letterSpacing: 0.3 },
  bannerSub:    { fontSize: 15, lineHeight: 21, color: colors.cielo, fontFamily: fonts.medium, marginTop: 3 },
  seccionHeader: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12, alignItems: 'baseline', justifyContent: 'space-between', marginTop: 12 },
  seccionTitulo: { color: colors.cielo, fontSize: 18, fontFamily: fonts.bold, marginTop: 8, marginBottom: 10 },
  historiaBtn: { alignSelf: 'flex-start', paddingHorizontal: 4, minHeight: 48, justifyContent: 'center', marginBottom: 2 },
  historiaTxt: { color: colors.turquesaSuave, fontSize: 14, fontFamily: fonts.bold },

  card: {
    ...ui.card,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, marginBottom: 10, shadowOpacity: 0, elevation: 0,
  },
  cardLeccion: { backgroundColor: colors.crema, borderColor: colors.arena },
  cardTitLeccion: { color: colors.noche },
  cardSubLeccion: { color: colors.gris },
  cardDone:   { borderColor: 'rgba(250,199,117,0.6)' },
  iconBox:    { width: 44, height: 48, borderRadius: 12, backgroundColor: colors.nocheProfundo, alignItems: 'center', justifyContent: 'center' },
  iconBoxLeccion: { backgroundColor: 'rgba(45,90,22,0.08)' },
  iconBoxDone:{ backgroundColor: 'rgba(250,199,117,0.18)' },
  cardTit:    { ...ui.h3, fontSize: 17, lineHeight: 22 },
  cardSub:    { ...ui.sub, fontSize: 14, lineHeight: 20, marginTop: 3 },
  chevron:    { fontSize: 24, color: colors.turquesaClaro, paddingHorizontal: 6 },
  check:      { fontSize: 26, color: colors.doradoNeon, fontFamily: fonts.extra, paddingHorizontal: 6 },

  progTxt:  { fontSize: 14, color: colors.turquesaSuave, marginBottom: 10, fontFamily: fonts.semibold },
  progBar:  { height: 6, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 },
  progFill: { height: '100%', borderRadius: 4 },

  compBanner: { ...ui.cardDestacada, alignItems: 'center', marginTop: 14, gap: 8 },
  compTit:    { fontSize: 18, fontFamily: fonts.extra, color: colors.doradoNeon },
  compSub:    { ...ui.sub, fontSize: 14, textAlign: 'center' },

  modalOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', padding: 22 },
  modalScroll: { flexGrow: 0, maxHeight: '100%', width: '100%', maxWidth: 620, borderRadius: 26 },
  modalCard: {
    ...ui.cardDestacada,
    borderRadius: 26, padding: 24, alignItems: 'center', alignSelf: 'stretch',
    borderWidth: 2, borderColor: colors.doradoNeon,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 20, elevation: 20,
  },
  modalBanner:{ alignSelf: 'stretch', height: 140, borderRadius: 16, overflow: 'hidden', marginBottom: 14, borderWidth: 1, borderColor: 'rgba(250,199,117,0.4)' },
  medallaBox: { alignItems: 'center', marginTop: 10, marginBottom: 4 },
  medallaTxt: { color: colors.doradoNeon, fontSize: 14, fontFamily: fonts.bold, textAlign: 'center', marginTop: 8 },
  feliTit:    { fontSize: 22, fontFamily: fonts.extra, color: colors.cielo, marginTop: 14 },
  feliSub:    { fontSize: 14, color: colors.turquesaSuave, textAlign: 'center', marginTop: 8, lineHeight: 21 },
  feliPuntos: { fontSize: 56, fontFamily: fonts.extra, color: colors.doradoNeon, marginTop: 8, textShadowColor: 'rgba(250,199,117,0.5)', textShadowRadius: 16 },
});
