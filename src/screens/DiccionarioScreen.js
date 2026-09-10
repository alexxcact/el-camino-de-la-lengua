import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList,
  ScrollView, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import { palabras, mundos, categorias } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import PishkuMascota from '../components/PishkuMascota';
import { decirPalabra } from '../utils/voz';
import { sonar } from '../utils/sonidos';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Normaliza para buscar: minúsculas, sin tildes
const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const CATS = categorias.filter(c => c !== 'Todas');

const ORDENES = [
  { key: 'past',  label: 'A-Z palabra' },
  { key: 'esp',   label: 'A-Z significado' },
  { key: 'mundo', label: 'Por mundo' },
];

export default function DiccionarioScreen() {
  const { estado, registrarAperturaDiccionario, verificarLogros } = useJuego();

  const [busqueda, setBusqueda] = useState('');
  const [mundosSel, setMundosSel] = useState(() => new Set());
  const [catsSel, setCatsSel] = useState(() => new Set());
  const [orden, setOrden] = useState('past');
  const [expandido, setExpandido] = useState(null);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  // Cuenta una "apertura" cada vez que se enfoca el diccionario (logro Consultor)
  useFocusEffect(
    useCallback(() => {
      registrarAperturaDiccionario();
      verificarLogros();
    }, [registrarAperturaDiccionario, verificarLogros])
  );

  const toggleSet = (setter) => (val) => {
    setter(prev => {
      const n = new Set(prev);
      n.has(val) ? n.delete(val) : n.add(val);
      return n;
    });
  };
  const toggleMundo = toggleSet(setMundosSel);
  const toggleCat = toggleSet(setCatsSel);

  const toggleFiltros = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFiltrosAbiertos(v => !v);
  };
  const limpiarFiltros = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMundosSel(new Set());
    setCatsSel(new Set());
  };

  const lista = useMemo(() => {
    const q = norm(busqueda);
    let r = palabras.filter(p => {
      const okQ = !q || norm(p.p).includes(q) || norm(p.e).includes(q);
      const okM = mundosSel.size === 0 || mundosSel.has(p.mundo);
      const okC = catsSel.size === 0 || catsSel.has(p.cat);
      return okQ && okM && okC;
    });
    const cmp = {
      past:  (a, b) => a.p.localeCompare(b.p, 'es'),
      esp:   (a, b) => a.e.localeCompare(b.e, 'es'),
      mundo: (a, b) => a.mundo - b.mundo || a.p.localeCompare(b.p, 'es'),
    }[orden];
    return [...r].sort(cmp);
  }, [busqueda, mundosSel, catsSel, orden]);

  const expandir = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandido(prev => (prev === id ? null : id));
    sonar.pop();
  };

  const renderItem = ({ item }) => {
    const vista = estado.palabrasVistas.has(item.id);
    const abierto = expandido === item.id;
    const mundo = mundos.find(m => m.id === item.mundo);
    return (
      <TouchableOpacity style={s.row} onPress={() => expandir(item.id)} activeOpacity={0.85}>
        <View style={s.rowTop}>
          <View style={{ flex: 1 }}>
            <View style={s.pastLine}>
              <Text style={s.past}>{item.emoji} {item.p}</Text>
              <TouchableOpacity
                style={s.audioBtn}
                onPress={() => decirPalabra(item.p)}
                accessibilityRole="button"
                accessibilityLabel={`Leer ${item.p} con voz sintética de práctica`}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Ionicons name="volume-high" size={16} color={colors.doradoNeon} />
              </TouchableOpacity>
            </View>
            <Text style={s.esp}>{item.e}</Text>
            <Text style={s.meta}>{item.cat} · {mundo?.emoji} Mundo {item.mundo}</Text>
          </View>
          {vista
            ? <Text style={s.check}>✓</Text>
            : <Ionicons name="lock-closed" size={14} color={colors.turquesaSuave} style={s.lock} />}
        </View>
        {abierto && (
          <View style={s.expand}>
            <Text style={s.fon}>Grafía: {item.fon} · Voz sintética de práctica</Text>
            <Text style={s.ej}>{item.ej}</Text>
            <Text style={s.documentacion}>Tipo: {item.tipo === 'raiz' ? 'Raíz' : 'Entrada de vocabulario'}</Text>
            <Text style={s.documentacion}>Fuente: {item.fuente}</Text>
            <Text style={s.documentacion}>{item.nota}</Text>
            {item.respaldo === 'pendiente_validacion' && (
              <Text style={s.documentacion}>Validación documental pendiente.</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={s.bg}>
      {/* Buscador */}
      <View style={s.srchWrap}>
        <Ionicons name="search" size={16} color={colors.turquesaSuave} style={s.srchIco} />
        <TextInput
          style={s.srchIn}
          placeholder="Busca una palabra o significado…"
          placeholderTextColor={colors.turquesaSuave}
          value={busqueda}
          onChangeText={setBusqueda}
          autoCorrect={false}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={16} color={colors.turquesaSuave} style={s.clear} />
          </TouchableOpacity>
        )}
      </View>

      {/* Etiquetas de filtros activos (toca para quitar) */}
      {(mundosSel.size > 0 || catsSel.size > 0) && (
        <View style={s.activosWrap}>
          {[...mundosSel].map(id => {
            const m = mundos.find(x => x.id === id);
            return (
              <TouchableOpacity key={'m' + id} style={s.activoTag} onPress={() => toggleMundo(id)} activeOpacity={0.8}>
                <Text style={s.activoTxt}>{m?.emoji} {m?.titulo}  <Ionicons name="close" size={13} color={colors.doradoNeon} /></Text>
              </TouchableOpacity>
            );
          })}
          {[...catsSel].map(c => (
            <TouchableOpacity key={'c' + c} style={s.activoTag} onPress={() => toggleCat(c)} activeOpacity={0.8}>
              <Text style={s.activoTxt}>{c}  <Ionicons name="close" size={13} color={colors.doradoNeon} /></Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={s.limpiarTag} onPress={limpiarFiltros} activeOpacity={0.8}>
            <Text style={s.limpiarTxt}>Limpiar todo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Contador + botón Filtros */}
      <View style={s.toolRow}>
        <Text style={s.contador}>{lista.length} palabras</Text>
        <TouchableOpacity
          style={[s.filtBtn, (filtrosAbiertos || mundosSel.size + catsSel.size > 0) && s.filtBtnOn]}
          onPress={toggleFiltros}
          activeOpacity={0.85}
        >
          <Text style={[s.filtBtnTxt, (filtrosAbiertos || mundosSel.size + catsSel.size > 0) && { color: colors.doradoNeon }]}>
            Filtros{mundosSel.size + catsSel.size > 0 ? ` (${mundosSel.size + catsSel.size})` : ''} {filtrosAbiertos ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orden (siempre visible) */}
      <View style={s.ordenRow}>
        {ORDENES.map(o => (
          <TouchableOpacity key={o.key} style={[s.ordenChip, orden === o.key && s.ordenOn]} onPress={() => setOrden(o.key)} activeOpacity={0.85}>
            <Text style={[s.ordenTxt, orden === o.key && { color: colors.doradoNeon }]}>{o.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Panel colapsable de filtros (mundos + categorías) con wrap cómodo */}
      {filtrosAbiertos && (
        <ScrollView style={s.panel} contentContainerStyle={s.panelContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={s.panelLbl}>MUNDOS</Text>
          <View style={s.wrap}>
            {mundos.map(m => {
              const on = mundosSel.has(m.id);
              return (
                <TouchableOpacity key={m.id} style={[s.chip, on && s.chipOn]} onPress={() => toggleMundo(m.id)} activeOpacity={0.85}>
                  <Text style={[s.chipTxt, on && { color: colors.doradoNeon }]}>{m.emoji} {m.titulo}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[s.panelLbl, { marginTop: 14 }]}>CATEGORÍAS</Text>
          <View style={s.wrap}>
            {CATS.map(c => {
              const on = catsSel.has(c);
              return (
                <TouchableOpacity key={c} style={[s.chip, on && s.chipOn]} onPress={() => toggleCat(c)} activeOpacity={0.85}>
                  <Text style={[s.chipTxt, on && { color: colors.doradoNeon }]}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      <FlatList
        style={s.lista}
        data={lista}
        keyExtractor={i => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 24, paddingTop: 4 }}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={s.vacio}>
            <PishkuMascota celebrando={false} tamano={72} />
            <Text style={s.vacioTxt}>No encontramos esa palabra todavía</Text>
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  bg: { flex: 1, backgroundColor: colors.noche },

  srchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(8,26,34,0.62)', margin: 14, marginBottom: 8, borderRadius: radii.pill,
    borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.35)', paddingHorizontal: 16,
  },
  srchIco: { fontSize: 16, marginRight: 8 },
  srchIn:  { flex: 1, paddingVertical: 12, fontSize: 14, color: colors.cielo, fontFamily: fonts.medium },
  clear:   { fontSize: 16, color: colors.turquesaSuave, paddingLeft: 8 },

  // Etiquetas de filtros activos (removibles)
  activosWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 14, marginBottom: 8 },
  activoTag:   { ...ui.pill, flexDirection: 'row', alignItems: 'center', minHeight: 34, paddingHorizontal: 12 },
  activoTxt:   { fontSize: 12, color: colors.doradoNeon, fontFamily: fonts.bold },
  limpiarTag:  { ...ui.chip, minHeight: 34, justifyContent: 'center', paddingHorizontal: 12 },
  limpiarTxt:  { fontSize: 12, color: colors.turquesaSuave, fontFamily: fonts.semibold },

  // Fila contador + botón Filtros
  toolRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10 },
  contador:    { ...ui.caption },
  filtBtn:     { minHeight: 40, justifyContent: 'center', paddingHorizontal: 14, borderRadius: radii.pill, backgroundColor: 'rgba(8,26,34,0.62)', borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.4)' },
  filtBtnOn:   { backgroundColor: 'rgba(250,199,117,0.14)', borderColor: 'rgba(250,199,117,0.6)' },
  filtBtnTxt:  { fontSize: 13, color: colors.doradoNeon, fontFamily: fonts.bold },

  ordenRow:  { flexDirection: 'row', gap: 8, paddingHorizontal: 14, marginBottom: 10 },
  ordenChip: { ...ui.chip, flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 48, paddingVertical: 8 },
  ordenOn:   { backgroundColor: 'rgba(250,199,117,0.14)', borderColor: 'rgba(250,199,117,0.6)' },
  ordenTxt:  { ...ui.chipTxt, textAlign: 'center' },

  // Panel colapsable de filtros
  panel:        { maxHeight: 260, marginHorizontal: 14, marginBottom: 10, borderRadius: radii.md, backgroundColor: colors.nocheProfundo, borderWidth: 1, borderColor: 'rgba(93,202,165,0.28)' },
  panelContent: { padding: 12 },
  panelLbl:     { ...ui.pillTxt, letterSpacing: 2, marginBottom: 8 },
  wrap:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:    { ...ui.chip, minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, paddingVertical: 8 },
  chipOn:  { backgroundColor: 'rgba(250,199,117,0.14)', borderColor: 'rgba(250,199,117,0.6)' },
  chipTxt: { ...ui.chipTxt, fontSize: 13 },

  lista: { flex: 1 },

  row: {
    ...ui.card,
    borderRadius: radii.md, padding: 14, marginBottom: 9,
    borderLeftWidth: 4, borderLeftColor: colors.doradoNeon,
  },
  rowTop:   { flexDirection: 'row', alignItems: 'flex-start' },
  pastLine: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  past: { ...ui.pastoker, fontSize: 19 },
  audioBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(250,199,117,0.16)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(250,199,117,0.4)' },
  audioIco: { fontSize: 16 },
  esp:  { fontSize: 14, color: colors.cielo, marginTop: 3, fontFamily: fonts.medium },
  meta: { fontSize: 10, color: colors.turquesaSuave, marginTop: 3, fontFamily: fonts.medium },
  check: { fontSize: 18, color: colors.doradoNeon, fontFamily: fonts.extra, paddingLeft: 8 },
  lock:  { fontSize: 14, opacity: 0.5, paddingLeft: 8 },

  expand: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(93,202,165,0.28)' },
  fon: { fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic' },
  ej:  { fontSize: 13, color: colors.turquesaClaro, fontStyle: 'italic', marginTop: 4 },
  documentacion: { fontSize: 12, lineHeight: 18, color: colors.turquesaSuave, fontFamily: fonts.regular, marginTop: 6 },

  vacio:    { alignItems: 'center', paddingTop: 40 },
  vacioTxt: { fontSize: 15, color: colors.turquesaSuave, fontFamily: fonts.semibold, marginTop: 14, textAlign: 'center' },
});
