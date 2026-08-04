import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import { palabras, mundos, categorias, TIPOS_MISION } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import ContadorAnimado from '../components/ContadorAnimado';

const DIAS_CAL = 35; // 5 semanas

// Últimas N fechas locales como 'YYYY-MM-DD' (oldest → hoy)
function ultimosDias(n) {
  const hoy = new Date();
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const x = new Date(hoy);
    x.setDate(hoy.getDate() - i);
    const y = x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, '0');
    const d = String(x.getDate()).padStart(2, '0');
    arr.push(`${y}-${m}-${d}`);
  }
  return arr;
}

const CATS = categorias.filter(c => c !== 'Todas');

export default function EstadisticasScreen() {
  const { estado } = useJuego();
  const nombre = estado.nombreJugador || 'Caminante';

  const totalPal = palabras.length;
  const aprendidas = estado.palabrasVistas.size;
  const pct = Math.round((aprendidas / totalPal) * 100);
  const mundosComp = estado.mundosCompletados.size;
  const totalMis = mundos.length * TIPOS_MISION.length;
  const misionesHechas = estado.misionesCompletadas.size;
  const racha = estado.racha || 0;
  const mejorRacha = estado.mejorRacha || 0;

  const cards = [
    { v: aprendidas,             l: `Palabras (de ${totalPal})` },
    { v: mundosComp,             l: 'Mundos (de 5)' },
    { v: misionesHechas,         l: `Misiones (de ${totalMis})` },
    { v: mundosComp,             l: 'Medallas (de 5)' },
    { v: estado.puntos,          l: `Puntos · Nivel ${estado.nivel}` },
    { v: racha,                  l: `Racha 🔥 (mejor ${mejorRacha})` },
    { v: estado.retosDiariosTotal || 0, l: 'Retos diarios' },
    { v: estado.practicasTotal || 0,    l: 'Prácticas' },
  ];

  const porMundo = mundos.map(m => {
    const total = m.palabrasIds.length;
    const sabe = m.palabrasIds.filter(id => estado.palabrasVistas.has(id)).length;
    return { ...m, total, sabe, pct: Math.round((sabe / total) * 100) };
  });

  const porCategoria = useMemo(() => CATS.map(c => {
    const ids = palabras.filter(p => p.cat === c);
    const sabe = ids.filter(p => estado.palabrasVistas.has(p.id)).length;
    return { cat: c, total: ids.length, sabe };
  }).sort((a, b) => b.sabe - a.sabe || b.total - a.total), [estado.palabrasVistas]);

  const dias = ultimosDias(DIAS_CAL);
  const activos = new Set(estado.diasActivos || []);
  const diasActivosCount = (estado.diasActivos || []).length;
  const filas = [];
  for (let i = 0; i < dias.length; i += 7) filas.push(dias.slice(i, i + 7));

  const compartir = async () => {
    try {
      await Share.share({
        message: `${nombre} ha aprendido ${aprendidas} palabras del Pastoker, completado ${mundosComp} mundos y lleva una racha de ${racha} días en El Camino de la Lengua 🌿 #PuebloPasto`,
      });
    } catch (e) {}
  };

  return (
    <View style={s.bg}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>

        {/* Resumen general */}
        <Text style={s.seccion}>RESUMEN</Text>
        <View style={s.grid}>
          {cards.map((c, i) => (
            <View key={c.l} style={s.card}>
              <ContadorAnimado valor={c.v} estilo={s.cardNum} duracion={800} delay={i * 80} animarEntrada />
              <Text style={s.cardLbl}>{c.l}</Text>
            </View>
          ))}
        </View>

        {/* Barra global de vocabulario */}
        <View style={s.bigBarCard}>
          <View style={s.bigBarTop}>
            <Text style={s.bigBarLbl}>Vocabulario aprendido</Text>
            <Text style={s.bigBarPct}>{pct}%</Text>
          </View>
          <View style={s.barWrap}>
            <LinearGradient colors={colors.gradXP} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.barFill, { width: `${pct}%` }]} />
          </View>
          <Text style={s.bigBarSub}>{aprendidas} de {totalPal} palabras</Text>
        </View>

        {/* Progreso por mundo */}
        <Text style={s.seccion}>POR MUNDO</Text>
        {porMundo.map(m => (
          <View key={m.id} style={s.barRow}>
            <View style={s.barRowTop}>
              <Text style={s.barRowLbl}>{m.emoji} {m.titulo}</Text>
              <Text style={s.barRowVal}>{m.sabe}/{m.total}</Text>
            </View>
            <View style={s.barWrap}>
              <View style={[s.barFill, { width: `${m.pct}%`, backgroundColor: m.color }]} />
            </View>
          </View>
        ))}

        {/* Progreso por categoría */}
        <Text style={s.seccion}>POR CATEGORÍA</Text>
        {porCategoria.map(c => (
          <View key={c.cat} style={s.catRow}>
            <Text style={s.catLbl} numberOfLines={1}>{c.cat}</Text>
            <View style={[s.barWrap, { flex: 1, marginHorizontal: 10 }]}>
              <LinearGradient colors={colors.gradVictoria} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[s.barFill, { width: `${Math.round((c.sabe / c.total) * 100)}%` }]} />
            </View>
            <Text style={s.catVal}>{c.sabe}/{c.total}</Text>
          </View>
        ))}

        {/* Calendario de racha */}
        <Text style={s.seccion}>🔥 CALENDARIO (últimas 5 semanas)</Text>
        <View style={s.calCard}>
          {filas.map((fila, i) => (
            <View key={i} style={s.calFila}>
              {fila.map(d => (
                <View key={d} style={[s.calDia, activos.has(d) ? s.calOn : s.calOff]} />
              ))}
            </View>
          ))}
          <View style={s.calLeyenda}>
            <View style={[s.calDot, s.calOff]} /><Text style={s.calLeyTxt}>sin actividad</Text>
            <View style={[s.calDot, s.calOn]} /><Text style={s.calLeyTxt}>activo</Text>
            <Text style={[s.calLeyTxt, { marginLeft: 'auto' }]}>{diasActivosCount} días activos</Text>
          </View>
        </View>

        {/* Compartir */}
        <TouchableOpacity style={s.shareBtn} onPress={compartir} activeOpacity={0.85}>
          <Ionicons name="share-social" size={18} color={colors.doradoNeon} />
          <Text style={s.shareTxt}>Compartir mi avance</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.noche },

  seccion: { ...ui.pill, ...ui.pillTxt, overflow: 'hidden', marginTop: 20, marginBottom: 10 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { ...ui.card, width: '48%', borderRadius: radii.md, padding: 14, alignItems: 'center', marginBottom: 12 },
  cardNum: { fontSize: 28, fontFamily: fonts.extra, color: colors.doradoNeon },
  cardLbl: { fontSize: 11, color: colors.turquesaSuave, marginTop: 2, fontFamily: fonts.medium, textAlign: 'center' },

  bigBarCard: { ...ui.cardDestacada, padding: 16, marginTop: 4 },
  bigBarTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  bigBarLbl: { fontSize: 14, color: colors.cielo, fontFamily: fonts.bold },
  bigBarPct: { fontSize: 18, color: colors.doradoNeon, fontFamily: fonts.extra },
  bigBarSub: { fontSize: 11, color: colors.turquesaSuave, marginTop: 6, fontFamily: fonts.medium },

  barRow: { marginBottom: 12 },
  barRowTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  barRowLbl: { fontSize: 13, color: colors.cielo, fontFamily: fonts.semibold },
  barRowVal: { fontSize: 12, color: colors.turquesaClaro, fontFamily: fonts.semibold },

  barWrap: { height: 9, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },

  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 9 },
  catLbl: { fontSize: 12, color: colors.turquesaSuave, fontFamily: fonts.medium, width: 92 },
  catVal: { fontSize: 11, color: colors.turquesaClaro, fontFamily: fonts.semibold, width: 38, textAlign: 'right' },

  calCard: { ...ui.card, padding: 14 },
  calFila: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  calDia: { flex: 1, aspectRatio: 1, borderRadius: 5 },
  calOn:  { backgroundColor: colors.doradoNeon },
  calOff: { backgroundColor: colors.nocheProfundo, borderWidth: 1, borderColor: 'rgba(93,202,165,0.15)' },
  calLeyenda: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  calDot: { width: 12, height: 12, borderRadius: 4 },
  calLeyTxt: { fontSize: 10, color: colors.turquesaSuave, fontFamily: fonts.medium, marginRight: 8 },

  shareBtn: { marginTop: 22, flexDirection: 'row', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(250,199,117,0.14)', borderRadius: radii.md, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.5)' },
  shareTxt: { color: colors.doradoNeon, fontSize: 15, fontFamily: fonts.bold },
});
