import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { palabras, logros as todosLogros } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import HudJugador from '../components/HudJugador';

// ── MOCHILA ───────────────────────────────────────────────────
export function MochilaScreen({ navigation }) {
  const { estado } = useJuego();
  const [busqueda, setBusqueda] = useState('');
  const [catActiva, setCatActiva] = useState('Todas');
  const [detalle, setDetalle] = useState(null);

  const aprendidas = palabras.filter(p => estado.palabrasVistas.has(p.id));
  const cats = ['Todas', ...new Set(aprendidas.map(p => p.cat))];

  const filtradas = aprendidas.filter(p => {
    const okC = catActiva === 'Todas' || p.cat === catActiva;
    const q = busqueda.toLowerCase();
    const okQ = !q || p.p.toLowerCase().includes(q) || p.e.toLowerCase().includes(q);
    return okC && okQ;
  });

  // ─── Vista detalle ───
  if (detalle) return (
    <ScrollView style={ss.container} contentContainerStyle={{ padding: 16 }}>
      <TouchableOpacity style={ss.backBtn} onPress={() => setDetalle(null)}>
        <Text style={ss.backTxt}>← Volver a la Mochila</Text>
      </TouchableOpacity>

      <View style={ss.detWrap}>
        <LinearGradient
          colors={[colors.nocheCard, colors.noche]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={ss.detCat}>{detalle.cat}</Text>
        <Text style={{ fontSize: 56, textAlign: 'center', marginBottom: 8 }}>{detalle.emoji}</Text>
        <Text style={ss.detPast}>{detalle.p}</Text>
        <Text style={ss.detFon}>[{detalle.fon}]</Text>
        <Text style={ss.detEsp}>{detalle.e}</Text>
        <View style={ss.detDiv} />
        <Text style={ss.detEj}>"{detalle.ej}"</Text>
      </View>

      <View style={ss.infoCard}>
        <Text style={ss.infoTit}>📚 Contexto cultural</Text>
        <Text style={ss.infoTxt}>
          El pastoker es la lengua ancestral del pueblo Pasto de Nariño, Colombia.
          Cada palabra es un puente entre generaciones y una forma de nombrar el territorio.
        </Text>
      </View>
    </ScrollView>
  );

  // ─── Vista vacía ───
  if (aprendidas.length === 0) return (
    <View style={[ss.container, { justifyContent: 'center', alignItems: 'center', padding: 30 }]}>
      <Text style={{ fontSize: 48 }}>🌱</Text>
      <Text style={ss.vacioTit}>Tu mochila está dormida</Text>
      <Text style={ss.vacioSub}>Aprende palabras en las lecciones y aparecerán aquí, brillando</Text>
      <TouchableOpacity style={ss.vacioBtn} onPress={() => navigation.navigate('Mapa')}>
        <Text style={ss.vacioBtnTxt}>Ir al Mapa →</Text>
      </TouchableOpacity>
    </View>
  );

  // ─── Lista principal ───
  return (
    <View style={ss.container}>

      {/* Buscador */}
      <View style={ss.srchWrap}>
        <Text style={ss.srchIco}>🔍</Text>
        <TextInput
          style={ss.srchIn}
          placeholder="Buscar en Pastoker o Español…"
          placeholderTextColor={colors.turquesaSuave}
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 44 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'center' }}
      >
        {cats.map(c => (
          <TouchableOpacity key={c} style={[ss.catBtn, catActiva === c && ss.catOn]} onPress={() => setCatActiva(c)}>
            <Text style={[ss.catTxt, catActiva === c && { color: colors.noche }]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={ss.count}>{filtradas.length} palabras · {aprendidas.length}/{palabras.length} encendidas</Text>

      <FlatList
        data={filtradas}
        keyExtractor={i => String(i.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={ss.wordRow} onPress={() => setDetalle(item)}>
            <View style={{ flex: 1 }}>
              <Text style={ss.wordPast}>{item.emoji} {item.p}</Text>
              <Text style={ss.wordEsp}>{item.e}</Text>
            </View>
            <View style={ss.badge}><Text style={ss.badgeTxt}>{item.cat}</Text></View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ── PERFIL ────────────────────────────────────────────────────
export function PerfilScreen() {
  const { estado, getNivel, guardarNombre } = useJuego();
  const nombre = estado.nombreJugador || 'Caminante';
  const [editando, setEditando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState(nombre);

  const abrirEditor = () => { setNuevoNombre(nombre); setEditando(true); };
  const guardar = () => { guardarNombre(nuevoNombre); setEditando(false); };

  const stats = [
    { n: estado.puntos,                  l: 'Puntos ⭐' },
    { n: estado.palabrasVistas.size,     l: 'Palabras 📖' },
    { n: estado.mundosCompletados.size,  l: 'Mundos 🏔️' },
    { n: estado.logrosDesbloqueados.size, l: 'Logros 🏆' },
  ];

  const barras = [
    { lbl: 'Vocabulario',     val: estado.palabrasVistas.size,    max: palabras.length },
    { lbl: 'Lecciones',       val: estado.mundosCompletados.size, max: 5 },
    { lbl: 'Quiz jugados',    val: estado.quizJugados,            max: 10 },
    { lbl: 'Parejas jugadas', val: estado.parejasJugadas,         max: 10 },
  ];

  return (
    <View style={ps.container}>
      <HudJugador expandido />

      <ScrollView contentContainerStyle={ps.content} showsVerticalScrollIndicator={false}>

        <View style={ps.nameRow}>
          <Text style={ps.nombreGrande}>{nombre}</Text>
          <TouchableOpacity style={ps.editBtn} onPress={abrirEditor} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={ps.editIco}>✏️</Text>
          </TouchableOpacity>
        </View>
        <Text style={ps.rango}>{getNivel()}</Text>
        <Text style={ps.rangoSub}>Pueblo Pasto · Nariño · Colombia</Text>

        {/* Stats 2x2 */}
        <View style={ps.statsGrid}>
          {stats.map(stat => (
            <View key={stat.l} style={ps.statCard}>
              <Text style={ps.statN}>{stat.n}</Text>
              <Text style={ps.statL}>{stat.l}</Text>
            </View>
          ))}
        </View>

        {/* Progreso */}
        <View style={ps.card}>
          <Text style={ps.cardTit}>📈 Tu avance</Text>
          {barras.map(b => (
            <View key={b.lbl} style={{ marginTop: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={ps.barLbl}>{b.lbl}</Text>
                <Text style={ps.barVal}>{b.val}/{b.max}</Text>
              </View>
              <View style={ps.barWrap}>
                <LinearGradient
                  colors={colors.gradXP}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[ps.barFill, { width: `${Math.min(100, Math.round((b.val / b.max) * 100))}%` }]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Logros */}
        <Text style={ps.seccion}>🏆 LOGROS</Text>
        <View style={ps.logrosGrid}>
          {todosLogros.map(l => {
            const on = estado.logrosDesbloqueados.has(l.id);
            return (
              <View key={l.id} style={[ps.logroCard, on ? ps.logroOn : ps.logroOff]}>
                <Text style={[ps.logroEmoji, on && ps.logroEmojiOn]}>{on ? l.emoji : '🔒'}</Text>
                <Text style={[ps.logroNom, on && { color: colors.doradoNeon }]}>{l.nom}</Text>
                <Text style={ps.logroDesc}>{l.desc}</Text>
              </View>
            );
          })}
        </View>

        <Text style={ps.footer}>🌄 Asociación PUMA-MAKI · El Camino de la Lengua</Text>
      </ScrollView>

      {/* Modal cambiar nombre */}
      {editando && (
        <View style={ps.modalOverlay}>
          <LinearGradient colors={['rgba(11,31,42,0.94)', 'rgba(15,110,86,0.88)']} style={StyleSheet.absoluteFill} />
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={ps.modalKav}>
            <View style={ps.modalCard}>
              <Text style={ps.modalTit}>Cambiar nombre</Text>
              <View style={ps.modalInputWrap}>
                <TextInput
                  style={ps.modalInput}
                  value={nuevoNombre}
                  onChangeText={setNuevoNombre}
                  maxLength={15}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoFocus
                  placeholder="Tu nombre..."
                  placeholderTextColor={colors.turquesaSuave}
                />
              </View>
              <View style={ps.modalBtns}>
                <TouchableOpacity style={ps.modalCancel} onPress={() => setEditando(false)}>
                  <Text style={ps.modalCancelTxt}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[ps.modalSave, nuevoNombre.trim().length < 2 && ps.modalSaveOff]}
                  onPress={guardar}
                  disabled={nuevoNombre.trim().length < 2}
                >
                  <Text style={ps.modalSaveTxt}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </View>
  );
}

// ─── Estilos Mochila ───────────────────────────────────────────
const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },

  srchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.nocheCard,
    margin: 16, borderRadius: 40,
    borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.3)',
    paddingHorizontal: 16,
  },
  srchIco: { fontSize: 16, marginRight: 8 },
  srchIn:  { flex: 1, paddingVertical: 12, fontSize: 14, color: colors.cielo, fontFamily: fonts.medium },

  catBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.3)', backgroundColor: colors.nocheCard },
  catOn:  { backgroundColor: colors.turquesa, borderColor: colors.turquesa },
  catTxt: { fontSize: 12, color: colors.turquesaSuave, fontFamily: fonts.semibold },

  count: { fontSize: 11, color: colors.turquesaSuave, paddingHorizontal: 16, marginVertical: 8, fontFamily: fonts.medium },

  wordRow: {
    backgroundColor: colors.nocheCard,
    borderRadius: 14, padding: 14, marginBottom: 9,
    flexDirection: 'row', alignItems: 'center',
    borderLeftWidth: 4, borderLeftColor: colors.doradoNeon,
    borderWidth: 1, borderColor: 'rgba(93,202,165,0.15)',
  },
  wordPast: { fontSize: 19, fontWeight: '900', color: colors.doradoNeon, fontFamily: 'serif' },
  wordEsp:  { fontSize: 13, color: colors.cielo, marginTop: 2, fontFamily: fonts.medium },
  badge:    { backgroundColor: colors.turquesa, borderRadius: 12, paddingHorizontal: 9, paddingVertical: 4, alignSelf: 'flex-start' },
  badgeTxt: { fontSize: 9, color: colors.cielo, fontFamily: fonts.semibold },

  backBtn: { marginBottom: 12 },
  backTxt: { fontSize: 13, color: colors.turquesaClaro, fontFamily: fonts.semibold },

  vacioTit: { fontSize: 18, fontFamily: fonts.bold, color: colors.cielo, marginTop: 12, textAlign: 'center' },
  vacioSub: { fontSize: 14, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 6, textAlign: 'center', lineHeight: 20 },
  vacioBtn: { backgroundColor: colors.turquesa, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14, marginTop: 22 },
  vacioBtnTxt: { color: colors.cielo, fontFamily: fonts.bold, fontSize: 15 },

  detWrap: { borderRadius: 18, padding: 24, marginBottom: 14, overflow: 'hidden', borderWidth: 1.5, borderColor: colors.turquesa },
  detCat:  { fontSize: 10, color: colors.turquesaSuave, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6, textAlign: 'center', fontFamily: fonts.bold },
  detPast: { fontSize: 36, fontWeight: '900', color: colors.doradoNeon, textAlign: 'center', fontFamily: 'serif', textShadowColor: 'rgba(250,199,117,0.5)', textShadowRadius: 12 },
  detFon:  { fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic', textAlign: 'center', marginTop: 4 },
  detEsp:  { fontSize: 18, color: colors.cielo, marginTop: 6, textAlign: 'center', fontFamily: fonts.semibold },
  detDiv:  { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 12 },
  detEj:   { fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic', textAlign: 'center' },
  infoCard:{ backgroundColor: colors.nocheCard, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(93,202,165,0.18)' },
  infoTit: { fontSize: 14, fontFamily: fonts.bold, color: colors.turquesaClaro, marginBottom: 8 },
  infoTxt: { fontSize: 13, color: colors.cielo, lineHeight: 20 },
});

// ─── Estilos Perfil ────────────────────────────────────────────
const ps = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },
  content:   { padding: 16, paddingBottom: 30 },

  nameRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 },
  nombreGrande:{ fontSize: 26, fontFamily: fonts.extra, color: colors.cielo },
  editBtn:     { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.nocheCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)' },
  editIco:     { fontSize: 14 },
  rango:    { fontSize: 14, fontFamily: fonts.bold, color: colors.doradoNeon, textAlign: 'center', marginTop: 4 },
  rangoSub: { fontSize: 11, color: colors.turquesaSuave, textAlign: 'center', marginTop: 2, marginBottom: 16, letterSpacing: 1 },

  modalOverlay:  { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalKav:      { alignSelf: 'stretch' },
  modalCard:     { backgroundColor: colors.nocheCard, borderRadius: 22, padding: 22, borderWidth: 2, borderColor: colors.doradoNeon },
  modalTit:      { fontSize: 18, fontFamily: fonts.extra, color: colors.cielo, textAlign: 'center', marginBottom: 16 },
  modalInputWrap:{ height: 52, justifyContent: 'center', backgroundColor: colors.nocheProfundo, borderRadius: 14, borderWidth: 2, borderColor: colors.turquesa, marginBottom: 16 },
  modalInput:    { paddingHorizontal: 16, fontSize: 18, color: colors.cielo, textAlign: 'center', fontFamily: fonts.bold },
  modalBtns:     { flexDirection: 'row', gap: 10 },
  modalCancel:   { flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(93,202,165,0.4)' },
  modalCancelTxt:{ color: colors.turquesaSuave, fontFamily: fonts.bold, fontSize: 14 },
  modalSave:     { flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.turquesa },
  modalSaveOff:  { opacity: 0.4 },
  modalSaveTxt:  { color: colors.cielo, fontFamily: fonts.extra, fontSize: 14 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  statCard:  { width: '48%', backgroundColor: colors.nocheCard, borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(93,202,165,0.18)' },
  statN:     { fontSize: 28, fontFamily: fonts.extra, color: colors.doradoNeon },
  statL:     { fontSize: 11, color: colors.turquesaSuave, marginTop: 2, fontFamily: fonts.medium },

  card:    { backgroundColor: colors.nocheCard, padding: 16, borderRadius: 18, marginBottom: 18, borderWidth: 1, borderColor: 'rgba(93,202,165,0.18)' },
  cardTit: { fontSize: 15, fontFamily: fonts.bold, color: colors.cielo },
  barLbl:  { fontSize: 11, color: colors.turquesaSuave, fontFamily: fonts.medium },
  barVal:  { fontSize: 11, color: colors.turquesaClaro, fontFamily: fonts.semibold },
  barWrap: { height: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },

  seccion:    { fontSize: 13, fontFamily: fonts.bold, color: colors.turquesaSuave, letterSpacing: 2, marginBottom: 12 },
  logrosGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  logroCard:  { width: '48%', borderRadius: 16, padding: 14, alignItems: 'center', marginBottom: 12 },
  logroOn:    { backgroundColor: colors.nocheCard, borderWidth: 2, borderColor: colors.doradoNeon },
  logroOff:   { backgroundColor: colors.nocheProfundo, opacity: 0.5, borderWidth: 1, borderColor: 'rgba(93,202,165,0.15)' },
  logroEmoji: { fontSize: 28, marginBottom: 4 },
  logroEmojiOn:{ textShadowColor: 'rgba(250,199,117,0.7)', textShadowRadius: 12 },
  logroNom:   { fontSize: 12, fontFamily: fonts.bold, color: colors.turquesaSuave, textAlign: 'center' },
  logroDesc:  { fontSize: 10, color: colors.turquesaSuave, marginTop: 2, textAlign: 'center', opacity: 0.8 },

  footer: { textAlign: 'center', fontSize: 11, color: colors.turquesaSuave, fontStyle: 'italic', opacity: 0.6, marginTop: 8 },
});
