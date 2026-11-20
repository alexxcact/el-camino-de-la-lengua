import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import Acompanante from '../components/Acompanante';
import { APELLIDOS } from '../data/apellidos';
import { buscarApellidos, lecturaApellido, partesDe } from '../data/apellidosLogica';
import { sonar } from '../utils/sonidos';
import FondoSimbolos from '../components/FondoSimbolos';

const INTRO = 'Muchos apellidos del pueblo Pasto guardan raíces de la lengua, como hilos de un tejido. Escribe tu apellido y busquemos su secreto.';

// Piezas en minúscula: con esta letra la 'I' y la 'l' se confunden.
const pieza = (t) => String(t || '').toLowerCase();

function FichaApellido({ entrada }) {
  const lectura = lecturaApellido(entrada);
  const conPiezas = entrada.piezas.length > 0;
  return (
    <View style={s.ficha} accessibilityLabel={`${entrada.apellido}: ${entrada.traduccion || `tótem ${entrada.totem}`}`}>
      <Text style={s.apellido}>{entrada.apellido}</Text>
      {entrada.variantes?.length ? <Text style={s.variantes}>también se escribe {entrada.variantes.join(', ')}</Text> : null}
      {entrada.dudoso ? <Text style={s.dudoso}>Lectura incierta: el libro la propone con dudas</Text> : null}
      {conPiezas && (
        <View style={s.piezas}>
          {entrada.piezas.map((p, i) => (
            <View key={i} style={[s.pieza, p.enlace && s.piezaEnlace]}>
              <Text style={s.piezaT}>{pieza(p.t)}</Text>
              <Text style={s.piezaSig}>{p.enlace ? 'enlace' : p.sig}</Text>
            </View>
          ))}
        </View>
      )}
      {entrada.traduccion ? <Text style={s.traduccion}>«{entrada.traduccion}»</Text> : null}
      {lectura.length > 1 && (
        <Text style={s.lectura}>Se lee de derecha a izquierda: {lectura.join(' · ')}</Text>
      )}
      {entrada.traduccion ? <Text style={s.fuente}>Significado propuesto según {entrada.fuente}</Text> : null}
      {entrada.otraLectura ? (
        <Text style={s.otra}>Otra lectura: «{entrada.otraLectura.traduccion}» ({entrada.otraLectura.fuente})</Text>
      ) : null}
      {entrada.totem ? (
        <View style={s.totem}>
          <Ionicons name="shield-outline" size={16} color={colors.doradoNeon} />
          <Text style={s.totemTxt}>Tótem familiar: {entrada.totem}</Text>
        </View>
      ) : null}
      {entrada.totem ? <Text style={s.fuente}>{conPiezas ? 'Tótem' : 'El libro solo nombra su tótem'} según {entrada.fuenteTotem}</Text> : null}
    </View>
  );
}

export default function ApellidoScreen() {
  const [texto, setTexto] = useState('');
  const [buscado, setBuscado] = useState(null);
  const [vistaLista, setVistaLista] = useState(null); // apellido elegido de la lista

  const resultado = useMemo(() => (buscado ? buscarApellidos(buscado, APELLIDOS) : null), [buscado]);
  const ordenados = useMemo(() => [...APELLIDOS].sort((a, b) => a.apellido.localeCompare(b.apellido, 'es')), []);

  const [aviso, setAviso] = useState(false);
  const buscar = () => {
    Keyboard?.dismiss?.();
    setVistaLista(null);
    // Sin ningún apellido con letras ("123", "de la"...): no se busca.
    if (partesDe(texto).length === 0) { setBuscado(null); setAviso(!!texto.trim()); return; }
    sonar.pop();
    setAviso(false);
    setBuscado(texto);
  };

  const hallados = resultado?.encontrados.length || 0;
  const mensaje = aviso
    ? 'Escribe un apellido con letras, por ejemplo Tepud o Alpala.'
    : !resultado
    ? INTRO
    : hallados > 0
      ? `¡Lo encontré en los libros! ${hallados > 1 ? 'Estos apellidos guardan' : 'Este apellido guarda'} raíces de la lengua pasto.`
      : 'No lo encontré en los libros que consultamos. Puede venir de otra lengua o no estar escrito todavía, y sigue siendo parte de tu historia.';

  return (
    <KeyboardAvoidingView style={s.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FondoSimbolos variante="juego" />
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Acompanante personaje="uma" animo={hallados > 0 ? 'feliz' : resultado ? 'pensativo' : 'neutral'} mensaje={mensaje} compacto />

        <View style={s.buscador}>
          <TextInput
            style={s.input}
            value={texto}
            onChangeText={setTexto}
            onSubmitEditing={buscar}
            placeholder="Escribe tu apellido"
            placeholderTextColor={colors.turquesaSuave}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel="Tu apellido"
          />
          <TouchableOpacity style={s.btn} onPress={buscar} activeOpacity={0.85} accessibilityRole="button" accessibilityLabel="Descubrir el secreto del apellido">
            <Ionicons name="search" size={20} color={colors.noche} />
          </TouchableOpacity>
        </View>
        <Text style={s.privacidad}>Tu apellido no se guarda: solo se busca en esta pantalla.</Text>

        {resultado?.encontrados.map(({ entrada }) => <FichaApellido key={entrada.apellido} entrada={entrada} />)}
        {resultado?.noEncontrados.length ? (
          <View style={s.nada}>
            <Text style={s.nadaTxt}>
              No está en los libros: {resultado.noEncontrados.join(', ')}
            </Text>
          </View>
        ) : null}

        {vistaLista ? <FichaApellido entrada={vistaLista} /> : null}

        <Text style={s.seccion}>Apellidos pastos en los libros</Text>
        <View style={s.lista}>
          {ordenados.map(a => (
            <TouchableOpacity
              key={a.apellido}
              style={[s.chip, vistaLista?.apellido === a.apellido && s.chipOn]}
              onPress={() => { sonar.pop(); setBuscado(null); setAviso(false); setVistaLista(a); }}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`Ver el apellido ${a.apellido}`}
            >
              <Text style={[s.chipTxt, vistaLista?.apellido === a.apellido && { color: colors.noche }]}>{a.apellido}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={s.nota}>
          Los significados son propuestas de los autores a partir de las raíces de la lengua; otras familias y sabedores pueden contarlos distinto.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },
  content:   { padding: 16, paddingBottom: 40 },

  buscador: { flexDirection: 'row', gap: 10, marginTop: 14 },
  input: {
    flex: 1, minHeight: 52, paddingHorizontal: 16, borderRadius: radii.pill,
    backgroundColor: colors.nocheCard, borderWidth: 1.5, borderColor: 'rgba(250,199,117,0.5)',
    color: colors.cielo, fontSize: 18, fontFamily: fonts.bold,
  },
  btn: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.doradoNeon, alignItems: 'center', justifyContent: 'center' },
  privacidad: { ...ui.caption, color: colors.turquesaSuave, marginTop: 6, marginLeft: 6 },

  ficha:     { ...ui.card, padding: 16, marginTop: 14, borderColor: 'rgba(250,199,117,0.45)' },
  apellido:  { color: colors.doradoNeon, fontSize: 30, fontFamily: fonts.extra, textAlign: 'center' },
  variantes: { color: colors.turquesaSuave, fontSize: 12, fontFamily: fonts.medium, fontStyle: 'italic', textAlign: 'center' },
  piezas:    { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 12 },
  pieza:     { alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: radii.sm, backgroundColor: 'rgba(29,158,117,0.18)' },
  piezaEnlace:{ backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(250,199,117,0.4)' },
  piezaT:    { color: colors.cielo, fontSize: 18, fontFamily: fonts.extra },
  piezaSig:  { color: colors.turquesaSuave, fontSize: 11, fontFamily: fonts.medium },
  traduccion:{ color: colors.cielo, fontSize: 20, fontFamily: fonts.extra, textAlign: 'center', marginTop: 12 },
  lectura:   { ...ui.body, fontSize: 13, textAlign: 'center', marginTop: 4 },
  totem:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, paddingVertical: 6, borderRadius: radii.pill, backgroundColor: 'rgba(250,199,117,0.10)' },
  totemTxt:  { color: colors.doradoNeon, fontSize: 13, fontFamily: fonts.bold },
  fuente:    { ...ui.caption, color: colors.turquesaSuave, fontStyle: 'italic', textAlign: 'center', marginTop: 8 },
  otra:      { ...ui.caption, color: colors.cielo, textAlign: 'center', marginTop: 6 },
  dudoso:    { ...ui.caption, color: colors.sol, textAlign: 'center', marginTop: 4 },

  nada:    { ...ui.card, padding: 14, marginTop: 14 },
  nadaTxt: { color: colors.cielo, fontSize: 14, fontFamily: fonts.semibold, textAlign: 'center' },

  seccion: { color: colors.cielo, fontSize: 17, fontFamily: fonts.bold, marginTop: 24, marginBottom: 10 },
  lista:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:    { ...ui.chip, minHeight: 40, justifyContent: 'center', paddingHorizontal: 14 },
  chipOn:  { backgroundColor: colors.doradoNeon, borderColor: colors.doradoNeon },
  chipTxt: { ...ui.chipTxt, fontSize: 14 },
  nota:    { ...ui.caption, color: colors.turquesaSuave, fontStyle: 'italic', marginTop: 16, lineHeight: 18 },
});
