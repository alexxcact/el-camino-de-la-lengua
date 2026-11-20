import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList,
  ScrollView, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii, acento } from '../theme/ui';
import { palabras, mundos, categorias } from '../data/datos';
import { useJuego } from '../context/JuegoContext';
import PishkuMascota from '../components/PishkuMascota';
import { decirPalabra } from '../utils/voz';
import { sonar } from '../utils/sonidos';
import PalabraIlustrada from '../components/PalabraIlustrada';
import { RAICES } from '../data/raices';
import { dondeViveRaiz } from '../data/raicesLogica';
import Petroglifo from '../components/Petroglifo';
import { laja, LAJA, SIMBOLO_MUNDO } from '../theme/pasto';
import FondoSimbolos from '../components/FondoSimbolos';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Normaliza para buscar: minúsculas, sin tildes
const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const CATS = categorias.filter(c => c !== 'Todas');

// Comparadores de cada orden (compartidos por la lista y el salto a una palabra)
const COMPARADORES = {
  past:  (a, b) => a.p.localeCompare(b.p, 'es'),
  esp:   (a, b) => a.e.localeCompare(b.e, 'es'),
  mundo: (a, b) => a.mundo - b.mundo || a.p.localeCompare(b.p, 'es'),
};

const ORDENES = [
  { key: 'past',  label: 'A-Z palabra' },
  { key: 'esp',   label: 'A-Z significado' },
  { key: 'mundo', label: 'Por mundo' },
];

export default function DiccionarioScreen({ route, navigation } = {}) {
  const { estado, registrarAperturaDiccionario, verificarLogros } = useJuego();

  const [busqueda, setBusqueda] = useState('');
  const [mundosSel, setMundosSel] = useState(() => new Set());
  const [catsSel, setCatsSel] = useState(() => new Set());
  const [orden, setOrden] = useState('past');
  const [expandido, setExpandido] = useState(null);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  // "Mi mochila": solo las palabras que ya aprendiste (antes era otra pestaña).
  const [soloMias, setSoloMias] = useState(false);
  const listaRef = useRef(null);
  const timersRef = useRef([]);
  const reintentosRef = useRef(0);

  const palabraIdParam = route?.params?.palabraId;

  // Llegar con una palabra (desde otra pestaña): limpia búsqueda y filtros,
  // expande su ficha y la lleva a la vista. Luego consume el parámetro.
  useEffect(() => {
    if (palabraIdParam == null) return undefined;
    const id = Number(palabraIdParam);
    const palabra = palabras.find(w => w.id === id);
    if (palabra) {
      setBusqueda('');
      setMundosSel(new Set());
      setCatsSel(new Set());
      setSoloMias(false);
      setFiltrosAbiertos(false);
      setExpandido(id);
      // Sin filtros la lista es el corpus completo en el orden actual.
      const index = [...palabras].sort(COMPARADORES[orden]).findIndex(w => w.id === id);
      if (index >= 0) {
        reintentosRef.current = 0;
        const t = setTimeout(() => {
          listaRef.current?.scrollToIndex?.({ index, animated: true, viewPosition: 0.1 });
        }, 120);
        timersRef.current.push(t);
      }
    }
    navigation?.setParams?.({ palabraId: undefined });
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palabraIdParam]);

  // Limpia los saltos pendientes al desmontar.
  useEffect(() => () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // Respaldo cuando la fila aún no está medida: acerca por promedio y reintenta.
  const alFallarScroll = (info) => {
    const index = info?.index ?? 0;
    listaRef.current?.scrollToOffset?.({ offset: (info?.averageItemLength || 0) * index, animated: true });
    if (reintentosRef.current >= 3) return;
    reintentosRef.current += 1;
    const t = setTimeout(() => {
      listaRef.current?.scrollToIndex?.({ index, animated: true, viewPosition: 0.1 });
    }, 250);
    timersRef.current.push(t);
  };

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
      const okV = !soloMias || estado.palabrasVistas.has(p.id);
      return okQ && okM && okC && okV;
    });
    return [...r].sort(COMPARADORES[orden]);
  }, [busqueda, mundosSel, catsSel, orden, soloMias, estado.palabrasVistas]);

  const aprendidas = palabras.filter(p => estado.palabrasVistas.has(p.id)).length;

  const expandir = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandido(prev => (prev === id ? null : id));
    sonar.pop();
  };

  const sinTilde = (t) => (t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

  const renderItem = ({ item, index }) => {
    const vista = estado.palabrasVistas.has(item.id);
    const abierto = expandido === item.id;
    const mundo = mundos.find(m => m.id === item.mundo);
    const color = acento(item.mundo);
    // En orden alfabético, una letra tallada abre cada grupo.
    const letra = sinTilde(item.p).charAt(0);
    const nuevaLetra = orden === 'past' && (index === 0 || sinTilde(lista[index - 1]?.p).charAt(0) !== letra);
    return (
      <View>
        {nuevaLetra && (
          <View style={s.letraFila} accessibilityRole="header">
            <View style={s.letraRombo}><Text style={s.letraTxt}>{letra}</Text></View>
            <View style={s.letraLinea} />
          </View>
        )}
        <TouchableOpacity style={[s.row, { borderLeftColor: color }]} onPress={() => expandir(item.id)} activeOpacity={0.85}>
          <View style={s.rowTop}>
            <View style={[s.romboIlus, { borderColor: color }]}>
              <View style={s.romboDentro}><PalabraIlustrada palabra={item} tamano={30} /></View>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={s.pastLine}>
                <Text style={s.past}>{item.p}</Text>
                <TouchableOpacity
                  style={s.audioBtn}
                  onPress={() => decirPalabra(item.p)}
                  accessibilityRole="button"
                  accessibilityLabel={`Leer ${item.p} con voz sintética de práctica`}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="volume-high" size={15} color={colors.doradoNeon} />
                </TouchableOpacity>
              </View>
              <Text style={s.esp}>{item.e}</Text>
              <View style={s.metaFila}>
                <Petroglifo id={SIMBOLO_MUNDO[item.mundo]} tamano={14} color={color} />
                <Text style={s.meta}>{mundo?.titulo} · {item.cat}</Text>
              </View>
            </View>
            {vista
              ? <View style={s.sello} accessibilityLabel="Aprendida"><View style={s.romboDentro}><Ionicons name="checkmark" size={13} color={colors.noche} /></View></View>
              : <Ionicons name="lock-closed" size={14} color={colors.turquesaSuave} style={s.lock} />}
          </View>
          {abierto && (
            <View style={s.expand}>
              <Text style={s.fon}>Grafía: {item.fon} · Voz sintética de práctica</Text>
              <Text style={s.ej}>{item.ej}</Text>
              {(() => {
                // ¿Dónde vive esta raíz? Nombres reales que la llevan (de Raíces de la palabra).
                const nombres = dondeViveRaiz(item.p, RAICES);
                if (nombres.length === 0) return null;
                return (
                  <View style={s.vive}>
                    <Text style={s.viveLbl}>VIVE EN NOMBRES COMO</Text>
                    {nombres.slice(0, 5).map(n => (
                      <Text key={n.palabra} style={s.viveFila}>
                        <Text style={s.viveNombre}>{n.palabra}</Text>
                        {`  ${n.t.toLowerCase()} = ${n.sig} · «${n.traduccion}»`}
                      </Text>
                    ))}
                    {nombres.length > 5 ? <Text style={s.viveMas}>y {nombres.length - 5} más en Raíces de la palabra</Text> : null}
                  </View>
                );
              })()}
              <Text style={s.documentacion}>Fuente: {item.fuente}</Text>
              {item.respaldo === 'pendiente_validacion' && (
                <Text style={s.documentacion}>Validación documental pendiente.</Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={s.bg}>
      <FondoSimbolos variante="diccionario" />
      {/* Buscador */}
      <View style={s.srchWrap}>
        <Ionicons name="search" size={16} color={colors.doradoNeon} style={s.srchIco} />
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

      {/* Los cinco mundos, cada uno con su petroglifo: tocar filtra */}
      <View style={s.mundosFila}>
        {mundos.map(m => {
          const on = mundosSel.has(m.id);
          return (
            <TouchableOpacity
              key={m.id}
              style={[s.mundoLaja, on && { borderColor: acento(m.id), backgroundColor: 'rgba(250,199,117,0.08)' }]}
              onPress={() => toggleMundo(m.id)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`Filtrar por el mundo ${m.titulo}`}
              accessibilityState={{ selected: on }}
            >
              <Petroglifo id={SIMBOLO_MUNDO[m.id]} tamano={30} color={on ? colors.doradoNeon : LAJA.crema} opacity={on ? 1 : 0.55} />
              <Text style={[s.mundoNom, on && { color: colors.doradoNeon }]} numberOfLines={1}>{m.titulo}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Etiquetas de filtros activos (toca para quitar) */}
      {(mundosSel.size > 0 || catsSel.size > 0) && (
        <View style={s.activosWrap}>
          {[...mundosSel].map(id => {
            const m = mundos.find(x => x.id === id);
            return (
              <TouchableOpacity key={'m' + id} style={s.activoTag} onPress={() => toggleMundo(id)} activeOpacity={0.8}>
                <Text style={s.activoTxt}>{m?.emoji} {m?.titulo}  <Ionicons name="close" size={13} color="#fff" /></Text>
              </TouchableOpacity>
            );
          })}
          {[...catsSel].map(c => (
            <TouchableOpacity key={'c' + c} style={s.activoTag} onPress={() => toggleCat(c)} activeOpacity={0.8}>
              <Text style={s.activoTxt}>{c}  <Ionicons name="close" size={13} color="#fff" /></Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={s.limpiarTag} onPress={limpiarFiltros} activeOpacity={0.8}>
            <Text style={s.limpiarTxt}>Limpiar todo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Contador + botón Filtros */}
      <View style={s.toolRow}>
        <Text style={[s.contador, { flexShrink: 1 }]}>{lista.length} palabras · {aprendidas}/{palabras.length} aprendidas</Text>
        <TouchableOpacity
          style={[s.filtBtn, s.mochilaBtn, soloMias && s.filtBtnOn]}
          onPress={() => setSoloMias(v => !v)}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Mi mochila: ver solo las palabras que ya aprendiste"
          accessibilityState={{ selected: soloMias }}
        >
          <Text style={[s.filtBtnTxt, soloMias && { color: '#fff' }]}>Mi mochila</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.filtBtn, (filtrosAbiertos || mundosSel.size + catsSel.size > 0) && s.filtBtnOn]}
          onPress={toggleFiltros}
          activeOpacity={0.85}
        >
          <Text style={[s.filtBtnTxt, (filtrosAbiertos || mundosSel.size + catsSel.size > 0) && { color: '#fff' }]}>
            Filtros{mundosSel.size + catsSel.size > 0 ? ` (${mundosSel.size + catsSel.size})` : ''} {filtrosAbiertos ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orden (siempre visible) */}
      <View style={s.ordenRow}>
        {ORDENES.map(o => (
          <TouchableOpacity key={o.key} style={[s.ordenChip, orden === o.key && s.ordenOn]} onPress={() => setOrden(o.key)} activeOpacity={0.85}>
            <Text style={[s.ordenTxt, orden === o.key && { color: '#fff' }]}>{o.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Panel colapsable de filtros (mundos + categorías) con wrap cómodo */}
      {filtrosAbiertos && (
        <ScrollView style={s.panel} contentContainerStyle={s.panelContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={s.panelLbl}>CATEGORÍAS</Text>
          <View style={s.wrap}>
            {CATS.map(c => {
              const on = catsSel.has(c);
              return (
                <TouchableOpacity key={c} style={[s.chip, on && s.chipOn]} onPress={() => toggleCat(c)} activeOpacity={0.85}>
                  <Text style={[s.chipTxt, on && { color: '#fff' }]}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      <FlatList
        ref={listaRef}
        style={s.lista}
        data={lista}
        keyExtractor={i => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 24, paddingTop: 4 }}
        keyboardShouldPersistTaps="handled"
        onScrollToIndexFailed={alFallarScroll}
        ListEmptyComponent={
          <View style={s.vacio}>
            <PishkuMascota celebrando={false} tamano={72} />
            <Text style={s.vacioTxt}>
              {soloMias && aprendidas === 0
                ? 'Tu mochila está vacía: aprende palabras en los mundos del mapa y aparecerán aquí'
                : 'No encontramos esa palabra todavía'}
            </Text>
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
    backgroundColor: LAJA.fondo, margin: 14, marginBottom: 10, borderRadius: radii.pill,
    borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.35)', paddingHorizontal: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3,
  },
  srchIco: { fontSize: 16, marginRight: 8 },
  srchIn:  { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.cielo, fontFamily: fonts.medium },

  mundosFila: { flexDirection: 'row', gap: 6, paddingHorizontal: 14, marginBottom: 10 },
  mundoLaja:  { ...laja, flex: 1, alignItems: 'center', paddingTop: 8, paddingBottom: 6, minHeight: 64 },
  mundoNom:   { fontSize: 10, color: colors.turquesaSuave, fontFamily: fonts.bold, marginTop: 3 },

  letraFila:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10, marginBottom: 8, paddingLeft: 4 },
  letraRombo: { width: 30, height: 30, borderWidth: 1.5, borderColor: colors.doradoNeon, transform: [{ rotate: '45deg' }], alignItems: 'center', justifyContent: 'center', backgroundColor: LAJA.fondo },
  letraTxt:   { color: colors.doradoNeon, fontSize: 15, fontFamily: fonts.extra, transform: [{ rotate: '-45deg' }] },
  letraLinea: { flex: 1, height: 1, backgroundColor: 'rgba(250,199,117,0.25)' },
  clear:   { fontSize: 16, color: colors.textoCartaSuave, paddingLeft: 8 },

  // Etiquetas de filtros activos (removibles)
  activosWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 14, marginBottom: 8 },
  activoTag:   { ...ui.pill, backgroundColor: colors.cieloVivo, borderColor: colors.cieloVivo, flexDirection: 'row', alignItems: 'center', minHeight: 34, paddingHorizontal: 12 },
  activoTxt:   { fontSize: 12, color: '#fff', fontFamily: fonts.bold },
  limpiarTag:  { ...ui.chip, minHeight: 34, justifyContent: 'center', paddingHorizontal: 12 },
  limpiarTxt:  { fontSize: 12, color: colors.turquesaSuave, fontFamily: fonts.semibold },

  // Fila contador + botón Filtros
  toolRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10 },
  contador:    { ...ui.caption },
  filtBtn:     { minHeight: 40, justifyContent: 'center', paddingHorizontal: 14, borderRadius: radii.pill, backgroundColor: 'rgba(8,26,34,0.62)', borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.4)' },
  filtBtnOn:   { backgroundColor: colors.cieloVivo, borderColor: colors.cieloVivo },
  filtBtnTxt:  { fontSize: 13, color: colors.doradoNeon, fontFamily: fonts.bold },
  mochilaBtn:  { marginLeft: 'auto', marginRight: 8 },

  ordenRow:  { flexDirection: 'row', gap: 8, paddingHorizontal: 14, marginBottom: 10 },
  ordenChip: { ...ui.chip, flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 48, paddingVertical: 8 },
  ordenOn:   { backgroundColor: colors.cieloVivo, borderColor: colors.cieloVivo },
  ordenTxt:  { ...ui.chipTxt, textAlign: 'center' },

  // Panel colapsable de filtros
  panel:        { maxHeight: 260, marginHorizontal: 14, marginBottom: 10, borderRadius: radii.md, backgroundColor: colors.nocheProfundo, borderWidth: 1, borderColor: 'rgba(93,202,165,0.28)' },
  panelContent: { padding: 12 },
  panelLbl:     { ...ui.pillTxt, letterSpacing: 2, marginBottom: 8 },
  wrap:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:    { ...ui.chip, minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, paddingVertical: 8 },
  chipOn:  { backgroundColor: colors.cieloVivo, borderColor: colors.cieloVivo },
  chipTxt: { ...ui.chipTxt, fontSize: 13 },

  lista: { flex: 1 },

  row: {
    ...laja,
    borderRadius: radii.md, padding: 12, marginBottom: 9,
    borderLeftWidth: 4, borderLeftColor: colors.sol,
  },
  rowTop:   { flexDirection: 'row', alignItems: 'center', gap: 14 },
  // Ilustración dentro de un rombo, como la tarjeta de la palabra de hoy.
  romboIlus:   { width: 40, height: 40, marginLeft: 6, marginRight: 2, borderRadius: 8, borderWidth: 1.5, transform: [{ rotate: '45deg' }], alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(250,199,117,0.06)' },
  romboDentro: { transform: [{ rotate: '-45deg' }] },
  pastLine: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  past: { ...ui.pastoker, color: colors.doradoNeon, fontSize: 20 },
  audioBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(250,199,117,0.10)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(250,199,117,0.35)' },
  audioIco: { fontSize: 16 },
  esp:  { fontSize: 15, color: colors.cielo, marginTop: 2, fontFamily: fonts.semibold },
  metaFila: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  meta: { fontSize: 11, color: colors.turquesaSuave, fontFamily: fonts.medium },
  // Sello de palabra aprendida: rombo dorado.
  sello: { width: 20, height: 20, marginRight: 4, borderRadius: 3, backgroundColor: colors.doradoNeon, transform: [{ rotate: '45deg' }], alignItems: 'center', justifyContent: 'center' },
  lock:  { fontSize: 14, opacity: 0.5, paddingLeft: 8 },

  expand: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: LAJA.borde },
  fon: { fontSize: 12, color: colors.turquesaSuave, fontStyle: 'italic' },
  ej:  { fontSize: 13, color: colors.cielo, fontStyle: 'italic', marginTop: 4, opacity: 0.9 },
  vive:       { marginTop: 10, padding: 10, borderRadius: radii.sm, backgroundColor: 'rgba(8,26,34,0.6)' },
  viveLbl:    { fontSize: 9, color: colors.turquesaSuave, fontFamily: fonts.bold, letterSpacing: 2, marginBottom: 4 },
  viveFila:   { fontSize: 12, lineHeight: 19, color: colors.cielo, fontFamily: fonts.medium },
  viveNombre: { fontSize: 14, color: colors.doradoNeon, fontFamily: fonts.extra },
  viveMas:    { fontSize: 11, color: colors.turquesaSuave, fontFamily: fonts.medium, fontStyle: 'italic', marginTop: 2 },
  documentacion: { fontSize: 12, lineHeight: 18, color: colors.turquesaSuave, fontFamily: fonts.regular, marginTop: 6 },

  vacio:    { alignItems: 'center', paddingTop: 40 },
  vacioTxt: { fontSize: 15, color: colors.turquesaSuave, fontFamily: fonts.semibold, marginTop: 14, textAlign: 'center' },
});
