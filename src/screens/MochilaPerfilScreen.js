import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { palabras, logros as todosLogros } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import Glass from '../components/Glass';

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
          colors={[colors.verdeM, colors.negro]}
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

      <Glass tipo="claro" style={ss.infoCard}>
        <Text style={ss.infoTit}>📚 Contexto cultural</Text>
        <Text style={ss.infoTxt}>
          El pastoker es la lengua ancestral del pueblo Pasto de Nariño, Colombia.
          Cada palabra es un puente entre generaciones y una forma de nombrar el territorio.
        </Text>
      </Glass>
    </ScrollView>
  );

  // ─── Vista vacía ───
  if (aprendidas.length === 0) return (
    <View style={[ss.container, { justifyContent: 'center', alignItems: 'center', padding: 30 }]}>
      <Text style={{ fontSize: 48 }}>🌱</Text>
      <Text style={ss.vacioTit}>Tu mochila está vacía</Text>
      <Text style={ss.vacioSub}>Aprende palabras en las lecciones y aparecerán aquí</Text>
      <TouchableOpacity
        style={ss.vacioBtn}
        onPress={() => navigation.navigate('Mapa')}
      >
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
          placeholderTextColor="rgba(247,240,224,0.45)"
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
          <TouchableOpacity
            key={c}
            style={[ss.catBtn, catActiva === c && ss.catOn]}
            onPress={() => setCatActiva(c)}
          >
            <Text style={[ss.catTxt, catActiva === c && { color: colors.negro }]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={ss.count}>{filtradas.length} palabras · {aprendidas.length}/{palabras.length} aprendidas</Text>

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
  const { estado, getNivel } = useJuego();
  const barras = [
    { lbl: 'Vocabulario',     val: estado.palabrasVistas.size,   max: palabras.length },
    { lbl: 'Lecciones',       val: estado.mundosCompletados.size, max: 5 },
    { lbl: 'Quiz jugados',    val: estado.quizJugados,            max: 10 },
    { lbl: 'Parejas jugadas', val: estado.parejasJugadas,         max: 10 },
  ];

  return (
    <ScrollView style={ps.container} contentContainerStyle={ps.content}>

      {/* Header decorativo */}
      <LinearGradient
        colors={colors.gradHero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={ps.headerGrad}
      />

      {/* Banner de perfil */}
      <Glass tipo="dorado" bordeBrillante style={ps.banner}>
        <View style={ps.avatar}><Text style={{ fontSize: 30 }}>🌿</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={ps.nivelTxt}>{getNivel()}</Text>
          <Text style={ps.subTxt}>Pueblo Pasto · Nariño · Colombia</Text>
        </View>
        <Text style={ps.puntosLbl}>⭐ {estado.puntos}</Text>
      </Glass>

      {/* Stats rápidas */}
      <View style={ps.statsRow}>
        {[
          { n: estado.puntos,              l: 'Puntos ⭐' },
          { n: estado.palabrasVistas.size,  l: 'Palabras 📖' },
          { n: estado.mundosCompletados.size,l: 'Mundos 🏔️' },
        ].map(stat => (
          <Glass key={stat.l} tipo="claro" style={ps.statCard}>
            <Text style={ps.statN}>{stat.n}</Text>
            <Text style={ps.statL}>{stat.l}</Text>
          </Glass>
        ))}
      </View>

      {/* Progreso */}
      <Glass tipo="oscuro" style={ps.card}>
        <Text style={ps.cardTit}>📈 Tu avance</Text>
        {barras.map(b => (
          <View key={b.lbl} style={{ marginTop: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={ps.barLbl}>{b.lbl}</Text>
              <Text style={ps.barLbl}>{b.val}/{b.max}</Text>
            </View>
            <View style={ps.barWrap}>
              <LinearGradient
                colors={colors.gradDorado}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[ps.barFill, { width: `${Math.min(100, Math.round((b.val / b.max) * 100))}%` }]}
              />
            </View>
          </View>
        ))}
      </Glass>

      {/* Logros */}
      <Text style={ps.seccion}>🏆 Logros</Text>
      <View style={ps.logrosGrid}>
        {todosLogros.map(l => {
          const on = estado.logrosDesbloqueados.has(l.id);
          return (
            <Glass
              key={l.id}
              tipo={on ? 'dorado' : 'oscuro'}
              bordeBrillante={on}
              style={[ps.logroCard, !on && ps.logroOff]}
            >
              <Text style={{ fontSize: 28, marginBottom: 4 }}>{l.emoji}</Text>
              <Text style={[ps.logroNom, on && { color: colors.doradoBrillo }]}>{l.nom}</Text>
              <Text style={ps.logroDesc}>{l.desc}</Text>
            </Glass>
          );
        })}
      </View>

      <Text style={ps.footer}>🌄 Asociación PUMA-MAKI · El Camino de la Lengua</Text>
    </ScrollView>
  );
}

// ─── Estilos Mochila ───────────────────────────────────────────
const ss = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.negro },

  // Buscador
  srchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(247,240,224,0.10)',
    margin: 16, borderRadius: 40,
    borderWidth: 1.5, borderColor: colors.glassBorde,
    paddingHorizontal: 14,
  },
  srchIco: { fontSize: 16, marginRight: 8 },
  srchIn:  { flex: 1, paddingVertical: 11, fontSize: 14, color: colors.crema },

  // Chips de categoría
  catBtn: {
    paddingHorizontal: 13, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1.5, borderColor: colors.glassBorde,
    backgroundColor: 'rgba(247,240,224,0.08)',
  },
  catOn:  { backgroundColor: colors.dorado, borderColor: colors.dorado },
  catTxt: { fontSize: 12, color: colors.crema },

  count: { fontSize: 11, color: 'rgba(247,240,224,0.4)', paddingHorizontal: 16, marginVertical: 8 },

  // Filas de palabras
  wordRow: {
    backgroundColor: 'rgba(247,240,224,0.90)',
    borderRadius: 12, padding: 14, marginBottom: 9,
    flexDirection: 'row', alignItems: 'flex-start',
    borderLeftWidth: 4, borderLeftColor: colors.dorado,
    borderWidth: 1, borderColor: colors.glassBorde,
    shadowColor: colors.doradoBrillo, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  wordPast: { fontSize: 19, fontWeight: '700', color: colors.tierra },
  wordEsp:  { fontSize: 13, color: colors.negro, marginTop: 2 },
  badge:    { backgroundColor: colors.verdeM, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  badgeTxt: { fontSize: 9, color: colors.blanco, fontStyle: 'italic' },

  // Botón volver
  backBtn: { marginBottom: 12 },
  backTxt: { fontSize: 13, color: colors.doradoBrillo },

  // Vista vacía
  vacioTit: { fontSize: 18, fontWeight: '700', color: colors.arena, marginTop: 12, textAlign: 'center' },
  vacioSub: { fontSize: 14, color: colors.gris, fontStyle: 'italic', marginTop: 6, textAlign: 'center' },
  vacioBtn: { backgroundColor: colors.dorado, borderRadius: 12, padding: 14, marginTop: 20 },
  vacioBtnTxt: { color: colors.negro, fontWeight: '700', fontSize: 15 },

  // Detalle
  detWrap: {
    borderRadius: 16, padding: 22, marginBottom: 14, overflow: 'hidden',
    borderWidth: 1.5, borderColor: colors.glassBorde,
  },
  detCat:  { fontSize: 10, color: colors.doradoBrillo, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 6, textAlign: 'center' },
  detPast: { fontSize: 34, fontWeight: '900', color: colors.doradoBrillo, textAlign: 'center' },
  detFon:  { fontSize: 12, color: 'rgba(247,240,224,0.5)', fontStyle: 'italic', textAlign: 'center', marginTop: 4 },
  detEsp:  { fontSize: 18, color: colors.crema, marginTop: 6, opacity: 0.85, textAlign: 'center' },
  detDiv:  { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 12 },
  detEj:   { fontSize: 12, color: colors.crema, fontStyle: 'italic', opacity: 0.7, textAlign: 'center' },
  infoCard:{ borderRadius: 14, padding: 16 },
  infoTit: { fontSize: 14, fontWeight: '700', color: colors.tierra, marginBottom: 8 },
  infoTxt: { fontSize: 13, color: colors.negro, lineHeight: 20 },
});

// ─── Estilos Perfil ────────────────────────────────────────────
const ps = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.negro },
  content:   { padding: 16, paddingBottom: 30 },

  headerGrad: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 160,
    opacity: 0.55,
  },

  // Banner
  banner:   {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 18, borderRadius: 20, marginBottom: 16,
  },
  avatar:   {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  nivelTxt: { fontSize: 15, fontWeight: '700', color: colors.doradoBrillo },
  subTxt:   { fontSize: 11, color: 'rgba(247,240,224,0.6)', marginTop: 2 },
  puntosLbl:{ fontSize: 14, fontWeight: '900', color: colors.doradoBrillo },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCard: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 14 },
  statN:    { fontSize: 24, fontWeight: '900', color: colors.tierra },
  statL:    { fontSize: 10, color: colors.gris, marginTop: 1 },

  // Progreso
  card:    { padding: 16, borderRadius: 16, marginBottom: 16 },
  cardTit: { fontSize: 15, fontWeight: '700', color: colors.doradoBrillo },
  barLbl:  { fontSize: 11, color: colors.arena },
  barWrap: { height: 7, backgroundColor: 'rgba(247,240,224,0.2)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 7, borderRadius: 4 },

  // Logros
  seccion:    { fontSize: 16, fontWeight: '700', color: colors.doradoBrillo, marginBottom: 12, letterSpacing: 0.5 },
  logrosGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  logroCard:  { width: '47%', borderRadius: 14, padding: 14, alignItems: 'center' },
  logroOff:   { opacity: 0.35 },
  logroNom:   { fontSize: 11, fontWeight: '700', color: colors.arena, textAlign: 'center' },
  logroDesc:  { fontSize: 10, color: colors.gris, marginTop: 2, textAlign: 'center' },

  footer: { textAlign: 'center', fontSize: 11, color: 'rgba(247,240,224,0.35)', fontStyle: 'italic' },
});
