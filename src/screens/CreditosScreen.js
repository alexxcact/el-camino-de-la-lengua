import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { ui, radii } from '../theme/ui';
import { palabras, RELATOS } from '../data/datos';
import { RAICES } from '../data/raices';
import { APELLIDOS } from '../data/apellidos';
import SolPasto from '../components/SolPasto';
import FranjaTejida from '../components/FranjaTejida';
import FondoSimbolos from '../components/FondoSimbolos';

export const AUTOR = 'Ing. Alexander Cuaspud';

const esANH = (f) => /Academia Nariñense|ANH/.test(f || '');
const esAUK = (f) => /AUKUSAN/.test(f || '');

// Cuánto del juego sale de cada libro (se calcula de los datos, no a mano).
export function usoDeLibros() {
  const relatos = Object.values(RELATOS || {});
  return {
    anh: {
      palabras: palabras.filter(p => esANH(p.fuente)).length,
      raices: RAICES.filter(r => esANH(r.fuente)).length,
      apellidos: APELLIDOS.filter(a => esANH(a.fuente) || esANH(a.otraLectura?.fuente)).length,
      relatos: relatos.filter(r => esANH(r.fuente)).length,
    },
    auk: {
      palabras: palabras.filter(p => esAUK(p.fuente)).length,
      raices: RAICES.filter(r => esAUK(r.fuente)).length,
      apellidos: APELLIDOS.filter(a => esAUK(a.fuente) || esAUK(a.otraLectura?.fuente) || esAUK(a.fuenteTotem)).length,
      relatos: relatos.filter(r => esAUK(r.fuente)).length,
      totems: APELLIDOS.filter(a => a.totem).length,
    },
  };
}

function Uso({ n, txt }) {
  if (!n) return null;
  return (
    <View style={s.usoFila}>
      <Text style={s.usoNum}>{n}</Text>
      <Text style={s.usoTxt}>{txt}</Text>
    </View>
  );
}

export default function CreditosScreen() {
  const u = usoDeLibros();
  return (
    <View style={s.container}>
      <FondoSimbolos variante="creditos" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <View style={s.cabecera}>
        <SolPasto tamano={96} />
        <Text style={s.titulo}>El Camino de la Lengua</Text>
        <Text style={s.sub}>Un juego para aprender palabras del pueblo Pasto</Text>
      </View>

      {/* Autoría */}
      <View style={[s.card, s.autor]}>
        <FranjaTejida alto={10} fondo="transparent" />
        <Text style={s.lbl}>DESARROLLADO POR</Text>
        <Text style={s.autorNombre} accessibilityRole="header">{AUTOR}</Text>
      </View>

      <Text style={s.seccion}>Libros fuente</Text>
      <Text style={s.intro}>Los significados, las raíces, los apellidos y los relatos del juego vienen de estos libros. Cada ficha cita la página de donde sale.</Text>

      <View style={s.card}>
        <View style={s.libroCab}>
          <Ionicons name="book" size={22} color={colors.doradoNeon} />
          <Text style={s.libroTit}>Lengua de los Pastos: Vocabulario Básico y Etimologías Sagradas</Text>
        </View>
        <Text style={s.libroDato}>Academia Nariñense de Historia (ANH), 2015</Text>
        <Text style={s.libroDato}>ISBN 978-958-58150-8-7</Text>
        <View style={s.uso}>
          <Uso n={u.anh.palabras} txt="significados de palabras del vocabulario" />
          <Uso n={u.anh.raices} txt="nombres de Raíces de la palabra" />
          <Uso n={u.anh.apellidos} txt="lecturas de apellidos" />
          <Uso n={u.anh.relatos} txt="relatos de los mundos" />
        </View>
      </View>

      <View style={s.card}>
        <View style={s.libroCab}>
          <Ionicons name="book" size={22} color={colors.doradoNeon} />
          <Text style={s.libroTit}>AUKUSAN – Nuestra Palabra Sagrada</Text>
        </View>
        <Text style={s.libroDato}>Cabildo Indígena del Gran Tescual</Text>
        <View style={s.uso}>
          <Uso n={u.auk.raices} txt="nombres de Raíces de la palabra" />
          <Uso n={u.auk.apellidos} txt="lecturas de apellidos" />
          <Uso n={u.auk.totems} txt="tótems familiares" />
          <Uso n={u.auk.relatos} txt="relatos de los mundos" />
          <Uso n={u.auk.palabras} txt="lecturas complementarias del vocabulario" />
        </View>
      </View>

      <Text style={s.seccion}>Para tener en cuenta</Text>
      <View style={s.card}>
        <Text style={s.nota}>Los significados son propuestas de los autores de estos libros a partir de las raíces de la lengua. Las familias, los cabildos y los sabedores pueden contarlos de otra manera.</Text>
        <Text style={s.nota}>El contenido está pendiente de revisión con la comunidad del pueblo Pasto.</Text>
        <Text style={s.nota}>La voz que lee las palabras es sintética, solo para practicar.</Text>
        <Text style={s.nota}>El emblema es una interpretación del Sol de los Pastos de la cerámica pasta.</Text>
      </View>

      <Text style={s.pie}>Hecho con respeto por la lengua y el territorio Pasto.</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.noche },
  content:   { padding: 16, paddingBottom: 40 },

  cabecera: { alignItems: 'center', marginTop: 6, marginBottom: 16 },
  titulo:   { color: colors.doradoNeon, fontSize: 24, fontFamily: fonts.extra, marginTop: 10 },
  sub:      { color: colors.turquesaSuave, fontSize: 13, fontFamily: fonts.medium, marginTop: 2, textAlign: 'center' },

  card:  { ...ui.card, padding: 16, marginBottom: 12, overflow: 'hidden' },
  autor: { paddingTop: 0, alignItems: 'center', borderColor: 'rgba(250,199,117,0.5)' },
  lbl:   { fontSize: 10, color: colors.turquesaSuave, fontFamily: fonts.bold, letterSpacing: 2.5, marginTop: 14 },
  autorNombre: { color: colors.cielo, fontSize: 22, fontFamily: fonts.extra, marginTop: 4, marginBottom: 2, textAlign: 'center' },

  seccion: { color: colors.cielo, fontSize: 18, fontFamily: fonts.bold, marginTop: 12, marginBottom: 6 },
  intro:   { color: colors.turquesaSuave, fontSize: 13, fontFamily: fonts.regular, lineHeight: 19, marginBottom: 10 },

  libroCab:  { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  libroTit:  { flex: 1, color: colors.doradoNeon, fontSize: 16, fontFamily: fonts.extra, lineHeight: 21 },
  libroDato: { color: colors.cielo, fontSize: 13, fontFamily: fonts.medium, marginTop: 4, marginLeft: 32 },
  uso:       { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(159,225,203,0.15)', gap: 4 },
  usoFila:   { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  usoNum:    { color: colors.doradoNeon, fontSize: 16, fontFamily: fonts.extra, minWidth: 28, textAlign: 'right' },
  usoTxt:    { flex: 1, color: colors.turquesaSuave, fontSize: 13, fontFamily: fonts.medium },

  nota: { color: colors.cielo, fontSize: 13, fontFamily: fonts.regular, lineHeight: 19, marginBottom: 8, opacity: 0.9 },
  pie:  { ...ui.caption, color: colors.turquesaSuave, textAlign: 'center', marginTop: 12, fontStyle: 'italic' },
});
