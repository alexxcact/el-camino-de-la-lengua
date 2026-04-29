import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { palabras, mundos } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import { imgMundoColor, imgMundoGris } from '../data/imagenes';
import Glass from '../components/Glass';
import BotonGlow from '../components/BotonGlow';

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
      <Glass tipo="claro" intensidad={50} bordeBrillante style={ls.card}>
        <LinearGradient
          colors={[mundo.color, colors.negro]}
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
      </Glass>
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

  const misiones = [
    { id: `quiz-${mundoId}`,    titulo: 'Quiz de palabras', emoji: '🧠', desc: 'Adivina la traducción correcta',  pantalla: 'Quiz',    params: { mundoId } },
    { id: `parejas-${mundoId}`, titulo: 'Une las parejas',  emoji: '🃏', desc: 'Conecta palabra y significado',    pantalla: 'Parejas', params: { mundoId } },
    { id: `dictado-${mundoId}`, titulo: 'Dictado cultural', emoji: '✍️', desc: 'Escribe la palabra en Pastoquer', pantalla: 'Dictado', params: { mundoId } },
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
      <View style={{ flex: 1, backgroundColor: colors.negro }}>
        <TouchableOpacity style={estilos.backBtn} onPress={() => setVistaActiva(null)}>
          <Text style={estilos.backTxt}>← Volver</Text>
        </TouchableOpacity>
        <LeccionView mundo={mundo} onTerminar={handleTerminarLeccion} />
      </View>
    );
  }

  // ─── Vista principal ───
  const fondoMundo = mundoYaCompletado ? imgMundoColor[mundoId] : imgMundoGris[mundoId];
  const misionesHechas = misiones.filter(m => estado.misionesCompletadas.has(m.id)).length;

  return (
    <ImageBackground source={fondoMundo} style={{ flex: 1 }} resizeMode="cover">
      <LinearGradient
        colors={['rgba(247,240,224,0.92)', 'rgba(247,240,224,0.88)']}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView style={estilos.container} contentContainerStyle={estilos.content}>

        {/* Banner del mundo */}
        <Glass tipo="oscuro" intensidad={60} style={[estilos.banner, { backgroundColor: mundo.color + 'CC' }]}>
          <Text style={estilos.bannerEmoji}>{mundo.emoji}</Text>
          <Text style={estilos.bannerTit}>{mundo.titulo}</Text>
          <Text style={estilos.bannerSub}>{mundo.desc}</Text>
          <View style={estilos.miniProgRow}>
            {misiones.map(m => (
              <View key={m.id} style={[estilos.miniProgDot, estado.misionesCompletadas.has(m.id) && estilos.miniProgDotOn]} />
            ))}
          </View>
        </Glass>

        <Text style={estilos.seccion}>📚 Lección de vocabulario</Text>
        <TouchableOpacity style={estilos.leccionCard} onPress={() => setVistaActiva('leccion')} activeOpacity={0.8}>
          <Glass tipo="dorado" intensidad={50} style={estilos.leccionGlass}>
            <Text style={estilos.leccionIco}>📖</Text>
            <View style={{ flex: 1 }}>
              <Text style={estilos.leccionTit}>Aprender las palabras</Text>
              <Text style={estilos.leccionSub}>{mundo.palabrasIds.length} palabras de este mundo</Text>
            </View>
            <Text style={{ fontSize: 20, color: colors.dorado }}>›</Text>
          </Glass>
        </TouchableOpacity>

        <Text style={[estilos.seccion, { marginTop: 8 }]}>🎮 Misiones</Text>
        {misiones.map(m => {
          const comp = estado.misionesCompletadas.has(m.id);
          return (
            <TouchableOpacity
              key={m.id}
              onPress={() => navigation.navigate(m.pantalla, m.params)}
              activeOpacity={0.85}
            >
              <Glass
                tipo={comp ? 'dorado' : 'claro'}
                intensidad={50}
                bordeBrillante={!comp}
                style={estilos.misionGlass}
              >
                <Text style={estilos.misionEmoji}>{m.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={estilos.misionTit}>{m.titulo}</Text>
                  <Text style={estilos.misionDesc}>{m.desc}</Text>
                </View>
                {comp
                  ? <Text style={estilos.compBadge}>✓</Text>
                  : <Text style={{ fontSize: 18, color: colors.arena }}>›</Text>
                }
              </Glass>
            </TouchableOpacity>
          );
        })}

        {/* Progreso de misiones */}
        <Glass tipo="claro" intensidad={40} style={estilos.progresoGlass}>
          <Text style={estilos.progresoTxt}>Misiones completadas: {misionesHechas} / {misiones.length}</Text>
          <View style={estilos.progresoBar}>
            <LinearGradient
              colors={colors.gradDorado}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[estilos.progresoFill, { width: `${(misionesHechas / misiones.length) * 100}%` }]}
            />
          </View>
        </Glass>

        {/* Banner de mundo completado */}
        {mundoYaCompletado && (
          <Glass tipo="dorado" bordeBrillante style={estilos.completadoBanner}>
            <Text style={estilos.compTit}>🏆 ¡Mundo completado!</Text>
            <Text style={estilos.compSub}>+20 puntos · Siguiente mundo desbloqueado</Text>
            <BotonGlow
              texto="🗺️ Ir al mapa"
              onPress={() => navigation.navigate('Mapa')}
              variante="secundario"
              tamano="sm"
            />
          </Glass>
        )}

        {/* Modal de felicitación */}
        {mostrarFelicitacion && (
          <View style={estilos.modalFeli}>
            <LinearGradient
              colors={colors.gradLogro}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={estilos.feliEmoji}>🎉</Text>
            <Text style={estilos.feliTit}>¡Mundo completado!</Text>
            <Text style={estilos.feliSub}>
              Has restaurado el {mundo.titulo.toLowerCase()}.
              {mundoId < 5 ? ' El siguiente mundo se ha desbloqueado.' : ' ¡Has completado todo el camino!'}
            </Text>
            <Text style={estilos.feliPuntos}>+20 puntos</Text>
            <View style={{ gap: 10, marginTop: 8 }}>
              <BotonGlow
                texto="🗺️ Ir al mapa"
                onPress={() => { setMostrarFelicitacion(false); navigation.navigate('Mapa'); }}
                variante="primario"
                tamano="lg"
              />
              <BotonGlow
                texto="Seguir aquí"
                onPress={() => setMostrarFelicitacion(false)}
                variante="fantasma"
                tamano="md"
              />
            </View>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const ls = StyleSheet.create({
  wrap:    { flex: 1, padding: 16 },
  card:    { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 14, overflow: 'hidden' },
  emoji:   { fontSize: 60, marginBottom: 10 },
  past:    {
    fontSize: 34, fontWeight: '900', color: colors.doradoBrillo, fontFamily: 'serif',
    textShadowColor: 'rgba(245,200,66,0.4)', textShadowRadius: 10,
  },
  fon:     { fontSize: 13, color: 'rgba(247,240,224,0.55)', fontStyle: 'italic', marginTop: 4 },
  esp:     { fontSize: 18, color: 'rgba(247,240,224,0.85)', marginTop: 6 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', width: '100%', marginVertical: 12 },
  ej:      { fontSize: 12, color: 'rgba(247,240,224,0.65)', fontStyle: 'italic', textAlign: 'center' },
  dots:    { flexDirection: 'row', gap: 5, marginTop: 14 },
  dot:     { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotOn:   { backgroundColor: colors.doradoBrillo },
  catWrap: { alignItems: 'center', marginBottom: 14 },
  catBadge:{ fontSize: 11, backgroundColor: colors.verdeM, color: colors.crema, paddingHorizontal: 12, paddingVertical: 3, borderRadius: 12 },
  contador:{ textAlign: 'center', fontSize: 12, color: colors.gris, fontStyle: 'italic', marginTop: 12 },
});

const estilos = StyleSheet.create({
  container:   { flex: 1 },
  content:     { padding: 16, paddingBottom: 30 },
  backBtn:     { padding: 16, paddingBottom: 0 },
  backTxt:     { fontSize: 14, color: colors.tierra },

  banner:      { borderRadius: 18, padding: 20, alignItems: 'center', marginBottom: 18 },
  bannerEmoji: { fontSize: 42, marginBottom: 8 },
  bannerTit:   { fontSize: 20, fontWeight: '900', color: colors.doradoBrillo, textAlign: 'center', textShadowColor: 'rgba(245,200,66,0.3)', textShadowRadius: 8 },
  bannerSub:   { fontSize: 12, color: 'rgba(247,240,224,0.75)', fontStyle: 'italic', marginTop: 6, textAlign: 'center' },
  miniProgRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  miniProgDot: { width: 28, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  miniProgDotOn:{ backgroundColor: colors.doradoBrillo },

  seccion:     { fontSize: 16, fontWeight: '700', color: colors.negro, marginBottom: 10 },

  leccionCard: { marginBottom: 10 },
  leccionGlass:{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 14 },
  leccionIco:  { fontSize: 30 },
  leccionTit:  { fontSize: 14, fontWeight: '700', color: colors.tierra },
  leccionSub:  { fontSize: 11, color: colors.gris, fontStyle: 'italic', marginTop: 2 },

  misionGlass: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, marginBottom: 9 },
  misionEmoji: { fontSize: 28 },
  misionTit:   { fontSize: 14, fontWeight: '700', color: colors.tierra },
  misionDesc:  { fontSize: 11, color: colors.gris, fontStyle: 'italic', marginTop: 2 },
  compBadge:   { fontSize: 12, backgroundColor: colors.verdeM, color: colors.blanco, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },

  progresoGlass:{ padding: 12, borderRadius: 12, marginTop: 8 },
  progresoTxt:  { fontSize: 12, color: colors.tierra, marginBottom: 6, fontWeight: '700' },
  progresoBar:  { height: 7, backgroundColor: colors.arena, borderRadius: 4, overflow: 'hidden' },
  progresoFill: { height: 7, borderRadius: 4 },

  completadoBanner: { padding: 18, alignItems: 'center', marginTop: 12, gap: 8 },
  compTit:      { fontSize: 18, fontWeight: '900', color: colors.doradoBrillo },
  compSub:      { fontSize: 13, color: colors.negro, opacity: 0.75 },

  modalFeli:    {
    position: 'absolute', top: 80, left: 10, right: 10,
    borderRadius: 24, padding: 28, alignItems: 'center', overflow: 'hidden',
    borderWidth: 2, borderColor: colors.glassBorde,
    shadowColor: colors.doradoBrillo, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 20, elevation: 20,
  },
  feliEmoji:    { fontSize: 72 },
  feliTit:      { fontSize: 24, fontWeight: '900', color: colors.negro, marginTop: 10 },
  feliSub:      { fontSize: 14, color: colors.negro, textAlign: 'center', marginTop: 10, lineHeight: 20, opacity: 0.8 },
  feliPuntos:   { fontSize: 36, fontWeight: '900', color: colors.negro, marginTop: 12 },
});
