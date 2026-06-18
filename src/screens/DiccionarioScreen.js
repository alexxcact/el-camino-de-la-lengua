import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList,
  ScrollView, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
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
  { key: 'past',  label: 'A-Z pastoker' },
  { key: 'esp',   label: 'A-Z español' },
  { key: 'mundo', label: 'Por mundo' },
];

export default function DiccionarioScreen() {
  const { estado, registrarAperturaDiccionario, verificarLogros } = useJuego();

  const [busqueda, setBusqueda] = useState('');
  const [mundosSel, setMundosSel] = useState(() => new Set());
  const [catsSel, setCatsSel] = useState(() => new Set());
  const [orden, setOrden] = useState('past');
  const [expandido, setExpandido] = useState(null);

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
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Text style={s.audioIco}>🔊</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.esp}>{item.e}</Text>
            <Text style={s.meta}>{item.cat} · {mundo?.emoji} Mundo {item.mundo}</Text>
          </View>
          <Text style={vista ? s.check : s.lock}>{vista ? '✓' : '🔒'}</Text>
        </View>
        {abierto && (
          <View style={s.expand}>
            <Text style={s.fon}>[{item.fon}]</Text>
            <Text style={s.ej}>"{item.ej}"</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={s.bg}>
      {/* Buscador */}
      <View style={s.srchWrap}>
        <Text style={s.srchIco}>🔍</Text>
        <TextInput
          style={s.srchIn}
          placeholder="Busca en pastoker o español…"
          placeholderTextColor={colors.turquesaSuave}
          value={busqueda}
          onChangeText={setBusqueda}
          autoCorrect={false}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={s.clear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={s.contador}>{lista.length} palabras en el diccionario</Text>

      {/* Orden */}
      <View style={s.ordenRow}>
        {ORDENES.map(o => (
          <TouchableOpacity key={o.key} style={[s.ordenChip, orden === o.key && s.ordenOn]} onPress={() => setOrden(o.key)}>
            <Text style={[s.ordenTxt, orden === o.key && { color: colors.noche }]}>{o.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filtros por mundo */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipScroll} contentContainerStyle={s.chipRow}>
        {mundos.map(m => {
          const on = mundosSel.has(m.id);
          return (
            <TouchableOpacity key={m.id} style={[s.chip, on && s.chipOn]} onPress={() => toggleMundo(m.id)}>
              <Text style={[s.chipTxt, on && { color: colors.noche }]}>{m.emoji} {m.titulo}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Filtros por categoría */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipScroll} contentContainerStyle={s.chipRow}>
        {CATS.map(c => {
          const on = catsSel.has(c);
          return (
            <TouchableOpacity key={c} style={[s.chip, on && s.chipOn]} onPress={() => toggleCat(c)}>
              <Text style={[s.chipTxt, on && { color: colors.noche }]}>{c}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <FlatList
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
    backgroundColor: colors.nocheCard, margin: 14, marginBottom: 8, borderRadius: 40,
    borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.35)', paddingHorizontal: 16,
  },
  srchIco: { fontSize: 16, marginRight: 8 },
  srchIn:  { flex: 1, paddingVertical: 12, fontSize: 14, color: colors.cielo, fontFamily: fonts.medium },
  clear:   { fontSize: 16, color: colors.turquesaSuave, paddingLeft: 8 },

  contador: { fontSize: 11, color: colors.turquesaSuave, paddingHorizontal: 16, marginBottom: 6, fontFamily: fonts.medium },

  ordenRow:  { flexDirection: 'row', gap: 8, paddingHorizontal: 14, marginBottom: 8 },
  ordenChip: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12, backgroundColor: colors.nocheCard, borderWidth: 1, borderColor: 'rgba(93,202,165,0.25)' },
  ordenOn:   { backgroundColor: colors.doradoNeon, borderColor: colors.doradoNeon },
  ordenTxt:  { fontSize: 11, color: colors.turquesaSuave, fontFamily: fonts.semibold },

  chipScroll: { maxHeight: 42, flexGrow: 0 },
  chipRow:    { paddingHorizontal: 14, gap: 8, alignItems: 'center', paddingBottom: 6 },
  chip:    { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 18, backgroundColor: colors.nocheCard, borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.3)' },
  chipOn:  { backgroundColor: colors.doradoNeon, borderColor: colors.doradoNeon },
  chipTxt: { fontSize: 12, color: colors.turquesaSuave, fontFamily: fonts.semibold },

  row: {
    backgroundColor: colors.nocheCard, borderRadius: 14, padding: 14, marginBottom: 9,
    borderLeftWidth: 4, borderLeftColor: colors.doradoNeon,
    borderWidth: 1, borderColor: 'rgba(93,202,165,0.15)',
  },
  rowTop:   { flexDirection: 'row', alignItems: 'flex-start' },
  pastLine: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  past: { fontSize: 19, fontWeight: '900', color: colors.doradoNeon, fontFamily: 'serif' },
  audioBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(250,199,117,0.16)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(250,199,117,0.4)' },
  audioIco: { fontSize: 16 },
  esp:  { fontSize: 14, color: colors.cielo, marginTop: 3, fontFamily: fonts.medium },
  meta: { fontSize: 10, color: colors.turquesaSuave, marginTop: 3, fontFamily: fonts.medium },
  check: { fontSize: 18, color: colors.doradoNeon, fontFamily: fonts.extra, paddingLeft: 8 },
  lock:  { fontSize: 14, opacity: 0.5, paddingLeft: 8 },

  expand: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(93,202,165,0.18)' },
  fon: { fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic' },
  ej:  { fontSize: 13, color: colors.turquesaClaro, fontStyle: 'italic', marginTop: 4 },

  vacio:    { alignItems: 'center', paddingTop: 40 },
  vacioTxt: { fontSize: 15, color: colors.turquesaSuave, fontFamily: fonts.semibold, marginTop: 14, textAlign: 'center' },
});
