import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii, acento } from '../theme/ui';
import { palabras, logros as todosLogros } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import HudJugador from '../components/HudJugador';
import ContadorAnimado from '../components/ContadorAnimado';
import MedallaPasto, { MEDALLAS_INFO } from '../components/MedallaPasto';
import AvatarSVG from '../components/AvatarSVG';
import Medallon from '../components/Medallon';
import { programarNotificacionDiaria, cancelarNotificaciones } from '../utils/notificaciones';

// Formatea una hora 0-23 a "4:00 PM"
const formatoHora = (h) => {
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:00 ${ampm}`;
};

// ── PERFIL ────────────────────────────────────────────────────
export function PerfilScreen({ navigation }) {
  const { estado, getNivel, guardarNombre, cambiarSonido, cambiarNotificaciones, guardarHoraNotificacion } = useJuego();
  const nombre = estado.nombreJugador || 'Caminante';
  const [editando, setEditando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState(nombre);

  const notifOn = estado.notificacionesActivadas === true;
  const horaNotif = estado.horaNotificacion ?? 16;

  // Activa/desactiva el recordatorio diario. Si el permiso se niega, deja el flag
  // en false y no insiste (la util ya es silenciosa).
  const toggleNotif = async (v) => {
    if (v) {
      const ok = await programarNotificacionDiaria(horaNotif, nombre);
      cambiarNotificaciones(ok);
    } else {
      cambiarNotificaciones(false);
      await cancelarNotificaciones();
    }
  };

  // Cambia la hora del recordatorio (paso de 1h, envuelve 0-23) y reprograma si está activo.
  const cambiarHora = async (delta) => {
    const nueva = (horaNotif + delta + 24) % 24;
    guardarHoraNotificacion(nueva);
    if (notifOn) await programarNotificacionDiaria(nueva, nombre);
  };

  const abrirEditor = () => { setNuevoNombre(nombre); setEditando(true); };
  const guardar = () => { guardarNombre(nuevoNombre); setEditando(false); };
  const [medallaSel, setMedallaSel] = useState(null);

  const stats = [
    { n: estado.puntos,                  l: 'Puntos' },
    { n: estado.palabrasVistas.size,     l: 'Palabras' },
    { n: estado.mundosCompletados.size,  l: 'Mundos' },
    { n: estado.logrosDesbloqueados.size, l: 'Logros' },
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

        {/* Avatar grande + acceso a personalizar */}
        <View style={ps.avatarHeader}>
          <Medallon size={126} ring={ui.ringDorado}>
            <AvatarSVG avatar={estado.avatar} tamano={110} conFondo />
          </Medallon>
          <TouchableOpacity style={ps.personalizarBtn} onPress={() => navigation.navigate('Avatar')} activeOpacity={0.85}>
            <Text style={ps.personalizarTxt}>Personalizar avatar</Text>
          </TouchableOpacity>
        </View>

        <View style={ps.nameRow}>
          <Text style={ps.nombreGrande}>{nombre}</Text>
          <TouchableOpacity style={ps.editBtn} onPress={abrirEditor} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Ionicons name="pencil" size={14} color={colors.turquesaSuave} />
          </TouchableOpacity>
        </View>
        <Text style={ps.rango}>{getNivel()}</Text>
        <Text style={ps.rangoSub}>Pueblo Pasto · Nariño · Colombia</Text>

        {/* Stats 2x2 — animan desde 0 al entrar (escalonado) */}
        <View style={ps.statsGrid}>
          {stats.map((stat, i) => (
            <View key={stat.l} style={ps.statCard}>
              <ContadorAnimado valor={stat.n} estilo={[ps.statN, { color: acento(i) }]} duracion={800} delay={i * 100} animarEntrada />
              <Text style={ps.statL}>{stat.l}</Text>
            </View>
          ))}
        </View>

        {/* Acceso a estadísticas */}
        <TouchableOpacity style={ps.statsBtn} onPress={() => navigation.navigate('Estadisticas')} activeOpacity={0.85}>
          <Text style={ps.statsBtnTxt}>Ver mis estadísticas</Text>
          <Text style={ps.statsBtnSub}>Progreso por mundo, categorías y calendario de racha</Text>
        </TouchableOpacity>

        {/* Progreso */}
        <View style={ps.card}>
          <Text style={ps.cardTit}>Tu avance</Text>
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

        {/* Vitrina de medallas Pasto */}
        <View style={ps.seccionPill}>
          <Text style={ps.seccionPillTxt}>VITRINA</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ps.vitrina}>
          {[1, 2, 3, 4, 5].map(id => {
            const ganada = estado.mundosCompletados.has(id);
            return (
              <TouchableOpacity
                key={id}
                style={ps.medallaCol}
                activeOpacity={ganada ? 0.7 : 1}
                onPress={() => ganada && setMedallaSel(id)}
              >
                <MedallaPasto mundoId={id} ganada={ganada} tamano={64} />
                <Text style={[ps.medallaNom, ganada && { color: colors.cielo }]} numberOfLines={2}>
                  {MEDALLAS_INFO[id].nombre}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Logros */}
        <View style={ps.seccionPill}>
          <Text style={ps.seccionPillTxt}>LOGROS</Text>
        </View>
        <View style={ps.logrosGrid}>
          {todosLogros.map(l => {
            const on = estado.logrosDesbloqueados.has(l.id);
            return (
              <View key={l.id} style={[ps.logroCard, on ? ps.logroOn : ps.logroOff]}>
                {on
                  ? <Text style={[ps.logroEmoji, ps.logroEmojiOn]}>{l.emoji}</Text>
                  : <Ionicons name="lock-closed" size={28} color={colors.turquesaSuave} style={ps.logroEmoji} />}
                <Text style={[ps.logroNom, on && { color: colors.sol }]}>{l.nom}</Text>
                <Text style={ps.logroDesc}>{l.desc}</Text>
              </View>
            );
          })}
        </View>

        {/* Ver final otra vez (solo si ya lo vio) */}
        {estado.finalVisto && (
          <TouchableOpacity style={ps.finalBtn} onPress={() => navigation.navigate('Final')} activeOpacity={0.85}>
            <Text style={ps.finalBtnTxt}>Ver final otra vez</Text>
          </TouchableOpacity>
        )}

        {/* Ajustes */}
        <View style={ps.ajusteRow}>
          <Text style={ps.ajusteLbl}>Sonidos y vibración</Text>
          <Switch
            value={estado.sonidoActivado !== false}
            onValueChange={cambiarSonido}
            trackColor={{ false: colors.nocheProfundo, true: colors.turquesa }}
            thumbColor={colors.cielo}
          />
        </View>

        {/* Recordatorio diario */}
        <View style={ps.ajusteRow}>
          <Text style={ps.ajusteLbl}>Recordatorio diario</Text>
          <Switch
            value={notifOn}
            onValueChange={toggleNotif}
            trackColor={{ false: colors.nocheProfundo, true: colors.turquesa }}
            thumbColor={colors.cielo}
          />
        </View>
        {notifOn && (
          <View style={ps.horaRow}>
            <Text style={ps.horaLbl}>Hora del aviso</Text>
            <View style={ps.horaCtrl}>
              <TouchableOpacity style={ps.horaBtn} onPress={() => cambiarHora(-1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={ps.horaBtnTxt}>−</Text>
              </TouchableOpacity>
              <Text style={ps.horaVal}>{formatoHora(horaNotif)}</Text>
              <TouchableOpacity style={ps.horaBtn} onPress={() => cambiarHora(1)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={ps.horaBtnTxt}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={ps.footer}>El Camino de la Lengua · Vocabulario Pasto</Text>
      </ScrollView>

      {/* Modal significado de medalla */}
      {medallaSel && (
        <TouchableOpacity style={ps.modalOverlay} activeOpacity={1} onPress={() => setMedallaSel(null)}>
          <LinearGradient colors={['rgba(11,31,42,0.94)', 'rgba(15,110,86,0.88)']} style={StyleSheet.absoluteFill} />
          <View style={ps.medModalCard}>
            <MedallaPasto mundoId={medallaSel} ganada tamano={96} />
            <Text style={ps.medModalNom}>{MEDALLAS_INFO[medallaSel].nombre}</Text>
            <Text style={ps.medModalSig}>{MEDALLAS_INFO[medallaSel].significado}</Text>
            <Text style={ps.medModalTap}>Toca para cerrar</Text>
          </View>
        </TouchableOpacity>
      )}

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
// ─── Estilos Perfil ────────────────────────────────────────────
const ps = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },
  content:   { padding: 16, paddingBottom: 30 },

  avatarHeader:    { alignItems: 'center', marginTop: 8, marginBottom: 6 },
  personalizarBtn: { marginTop: 10, backgroundColor: 'rgba(250,199,117,0.14)', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 10, borderWidth: 1.5, borderColor: colors.doradoNeon },
  personalizarTxt: { color: colors.doradoNeon, fontSize: 13, fontFamily: fonts.bold },

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
  statCard:  { ...ui.cardClara, width: '48%', padding: 16, alignItems: 'center', marginBottom: 12 },
  statN:     { fontSize: 28, fontFamily: fonts.extra, color: colors.textoCarta },
  statL:     { fontSize: 11, color: colors.textoCartaSuave, marginTop: 2, fontFamily: fonts.medium },

  statsBtn:    { backgroundColor: 'rgba(250,199,117,0.12)', borderRadius: radii.md, padding: 16, marginBottom: 16, borderWidth: 1.5, borderColor: colors.doradoNeon, alignItems: 'center' },
  statsBtnTxt: { color: colors.doradoNeon, fontSize: 15, fontFamily: fonts.extra },
  statsBtnSub: { color: colors.turquesaSuave, fontSize: 11, fontFamily: fonts.medium, marginTop: 3, textAlign: 'center' },

  card:    { ...ui.cardClara, padding: 16, marginBottom: 18 },
  cardTit: { fontSize: 15, fontFamily: fonts.bold, color: colors.textoCarta },
  barLbl:  { fontSize: 11, color: colors.textoCartaSuave, fontFamily: fonts.medium },
  barVal:  { fontSize: 11, color: colors.textoCarta, fontFamily: fonts.semibold },
  barWrap: { height: 8, backgroundColor: 'rgba(23,64,58,0.12)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },

  seccionPill:   { ...ui.pill, marginBottom: 12 },
  seccionPillTxt:{ ...ui.pillTxt },

  vitrina:    { gap: 14, paddingVertical: 4, paddingHorizontal: 2, marginBottom: 18 },
  medallaCol: { width: 76, alignItems: 'center' },
  medallaNom: { fontSize: 11, fontFamily: fonts.semibold, color: colors.turquesaSuave, textAlign: 'center', marginTop: 8 },

  medModalCard: { backgroundColor: colors.nocheCard, borderRadius: 22, padding: 24, alignItems: 'center', marginHorizontal: 30, borderWidth: 2, borderColor: colors.doradoNeon },
  medModalNom:  { fontSize: 18, fontFamily: fonts.extra, color: colors.doradoNeon, marginTop: 14, textAlign: 'center' },
  medModalSig:  { fontSize: 14, color: colors.cielo, textAlign: 'center', marginTop: 10, lineHeight: 21, fontStyle: 'italic' },
  medModalTap:  { fontSize: 11, color: colors.turquesaSuave, marginTop: 16 },
  logrosGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  logroCard:  { width: '48%', borderRadius: radii.md, padding: 14, alignItems: 'center', marginBottom: 12 },
  logroOn:    { backgroundColor: 'rgba(8,26,34,0.62)', borderWidth: 2, borderColor: colors.sol },
  logroOff:   { backgroundColor: colors.nocheProfundo, opacity: 0.5, borderWidth: 1, borderColor: 'rgba(93,202,165,0.15)' },
  logroEmoji: { fontSize: 28, marginBottom: 4 },
  logroEmojiOn:{ textShadowColor: 'rgba(242,177,52,0.7)', textShadowRadius: 12 },
  logroNom:   { fontSize: 12, fontFamily: fonts.bold, color: colors.turquesaSuave, textAlign: 'center' },
  logroDesc:  { fontSize: 10, color: colors.turquesaSuave, marginTop: 2, textAlign: 'center', opacity: 0.8 },

  finalBtn:    { backgroundColor: 'rgba(250,199,117,0.15)', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginBottom: 12, borderWidth: 1.5, borderColor: colors.doradoNeon },
  finalBtnTxt: { color: colors.doradoNeon, fontSize: 15, fontFamily: fonts.bold },
  ajusteRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.nocheCard, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginTop: 4, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(93,202,165,0.18)' },
  ajusteLbl: { color: colors.cielo, fontSize: 14, fontFamily: fonts.semibold },

  horaRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.nocheProfundo, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(93,202,165,0.18)' },
  horaLbl:  { color: colors.turquesaSuave, fontSize: 13, fontFamily: fonts.medium },
  horaCtrl: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  horaBtn:  { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.turquesa, alignItems: 'center', justifyContent: 'center' },
  horaBtnTxt: { color: colors.cielo, fontSize: 22, fontFamily: fonts.extra, marginTop: -2 },
  horaVal:  { color: colors.doradoNeon, fontSize: 15, fontFamily: fonts.bold, minWidth: 84, textAlign: 'center' },
  footer: { textAlign: 'center', fontSize: 11, color: colors.turquesaSuave, fontStyle: 'italic', opacity: 0.6, marginTop: 8 },
});
